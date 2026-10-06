/* PRO maker editor 1.5.0 — schema-driven forms, easy/expert mode, reference pickers, plain-language
 * descriptions, strength and difficulty estimates, friendly validation, simulator and damage calculator.
 * 1.5.0: minus-friendly number input, front/back formation editor, wave editor, win/lose condition editor,
 * terrain list + pack terrain editor, one-battle test with a readable log.
 * 1.7.0: tag chips (free text + ＋ button), duplicate buttons for list rows and waves, hire offers, sortie cost /
 * equipment slots / cannot-dismiss unit fields, hide-until-unlocked selectors, fraction drop rates.
 * Uses only element properties and on* handlers so it also runs in the lightweight test DOM. */
(function(root){'use strict';
const C=root.PROCore,B=root.PROBattle;
const rid=()=>Math.random().toString(36).slice(2,8);
function el(tag,cls,text){const e=document.createElement(tag);if(cls)e.className=cls;if(text!==undefined)e.textContent=text;return e;}
function btn(text,fn,cls='flow-btn'){const b=el('button',cls,text);b.type='button';b.onclick=fn;return b;}
const isEmpty=v=>v===undefined||v===null||v===''||(Array.isArray(v)&&!v.length)||(typeof v==='object'&&!Array.isArray(v)&&!Object.keys(v).length);
function setVal(obj,key,v,keep){if(!keep&&isEmpty(v))delete obj[key];else obj[key]=v;}
const splitList=text=>String(text||'').split(/[,、\n]/).map(x=>x.trim()).filter(Boolean);
const choicesOf=(f,obj)=>typeof f.choices==='function'?f.choices(obj):f.choices;
const STAT_LABELS={hp:'HP',atk:'ATK',def:'DEF',mob:'MOB',acc:'ACC'};
const BLOCK_TYPES=['formation','waves','objective','terrain','list','object','lines','textarea','json','skill','statmap','days','counts','idlines','image','typedRules','refcounts'];
const MODE_KEY='pro_maker_mode';
function mode(){try{return localStorage.getItem(MODE_KEY)==='expert'?'expert':'easy';}catch(e){return 'easy';}}
function applyMode(){const b=document.body;if(b&&b.classList){b.classList.toggle('mode-easy',mode()==='easy');b.classList.toggle('mode-expert',mode()==='expert');}}
function setMode(m){try{localStorage.setItem(MODE_KEY,m==='expert'?'expert':'easy');}catch(e){}applyMode();}
function newSkill(){return {id:'skill_'+rid(),name:'新しいスキル',trigger:'before_attack',effect:'damage_up_pct',value:10,chance:100,maxUses:0,note:''};}
function newWeapon(){return C.clone(C.weaponDefaults);}

// 1.13.0: tag input — each tag is a chip with ×; type a tag and press ＋ or Enter. Pasted text with commas is split.
function tagInput(parent,values,onChange,o={}){
  const box=el('div','pro-tags'),chips=el('div','pro-tag-chips'),row=el('div','pro-tag-add'),input=el('input'),add=btn('＋',()=>commit(),'flow-btn pro-tag-plus');
  let list=[...new Set((values||[]).map(x=>String(x).trim()).filter(Boolean))];const max=o.max||16;
  input.type='text';input.placeholder=o.placeholder||'タグを入力して＋';input.setAttribute('aria-label',(o.label||'タグ')+'を入力');add.setAttribute('aria-label',(o.label||'タグ')+'を追加');
  function draw(){chips.replaceChildren();for(const t of list){const c=el('span','pro-tag-chip');c.append(el('span',undefined,t));const x=btn('×',()=>{list=list.filter(v=>v!==t);draw();onChange([...list]);},'pro-tag-x');x.setAttribute('aria-label',`タグ「${t}」を削除`);c.append(x);chips.append(c);}if(!list.length)chips.append(el('small','pro-help',o.empty||'タグなし'));add.disabled=list.length>=max;}
  function commit(){const parts=splitList(input.value);if(!parts.length)return false;let added=false;for(const t of parts){const v=t.slice(0,32);if(!list.includes(v)&&list.length<max){list.push(v);added=true;}}input.value='';draw();if(added)onChange([...list]);return added;}
  input.onkeydown=e=>{if(e&&e.key==='Enter'&&!e.isComposing){if(e.preventDefault)e.preventDefault();commit();}};
  input.onpaste=()=>setTimeout(()=>{if(/[,、\n]/.test(input.value))commit();},0);
  row.append(input,add);box.append(chips,row);parent.append(box);draw();
  return {box,input,add,commit,get values(){return [...list];},set(v){list=[...new Set((v||[]).map(String).filter(Boolean))];draw();}};
}
// 1.13.0: a duplicated row gets fresh skill IDs (and a new ID / name suffix when it has one) so it never collides.
function freshIds(x,top=true){
  if(Array.isArray(x)){x.forEach(v=>freshIds(v,false));return x;}
  if(!x||typeof x!=='object')return x;
  if(typeof x.id==='string'&&(x.trigger||top)){const base=x.id.replace(/_[a-z0-9]{6}$/,'')||'id';x.id=`${base}_${rid()}`;}
  else if(top&&typeof x.name==='string'&&x.attackType){x.name=`${x.name}（複製）`;}
  for(const v of Object.values(x))if(v&&typeof v==='object')freshIds(v,false);
  return x;
}
function duplicateOf(item){return freshIds(C.clone(item));}
// form(container, obj, fields, onChange) renders editable fields bound to obj. Empty optional values are removed
// so packs that never use a 1.9 field keep their older schema number.
function form(container,obj,fields,onChange,opts={}){
  const host=el('div','pro-form');container.append(host);
  const lives=[];const changed=()=>{for(const f of lives)f();if(onChange)onChange(obj);};
  function redraw(){host.replaceChildren();lives.length=0;draw();}
  function draw(){const grid=el('div','pro-fields');host.append(grid);const easy=mode()==='easy';let adv=null,advGrid=null;for(const f of fields){if(f.show&&!f.show(obj))continue;const block=BLOCK_TYPES.includes(f.type)||f.wide;let target=block?host:grid;if(f.advanced&&easy){if(!adv){adv=el('details','pro-advanced');adv.append(el('summary',undefined,'詳細設定を開く'));advGrid=el('div','pro-fields');adv.append(advGrid);host.append(adv);}target=block?adv:advGrid;}renderField(target,f);}}
  const refList=kind=>{try{return opts.refs?opts.refs(kind,obj)||null:null;}catch(e){return null;}};
  const refSelect=selectOf;
  const nameMap=()=>labelNames(refList('units'));
  function wrap(parent,f){const l=el('label','pro-field');l.append(el('span','pro-label',f.label||f.key));parent.append(l);return l;}
  function help(l,f){if(f.help)l.append(el('small','pro-help',f.help));}
  function after(f){changed();if(f.rerender)redraw();}
  function renderField(parent,f){
    const k=f.key;
    switch(f.type){
    case 'select':{const l=wrap(parent,f),s=el('select');s.setAttribute('aria-label',f.label||k);const opts=[...(f.empty!==undefined?[['',f.empty]]:[]),...Object.entries(choicesOf(f,obj)||{})];for(const [v,t] of opts){const o=el('option',undefined,t);o.value=v;s.append(o);}s.value=obj[k]??'';s.onchange=()=>{if(s.value===''&&f.empty!==undefined)delete obj[k];else obj[k]=s.value;if(f.onSet)f.onSet(obj);after(f);};l.append(s);help(l,f);return;}
    case 'check':{const l=el('label','pro-check'),x=el('input');x.type='checkbox';x.checked=!!obj[k];x.onchange=()=>{if(x.checked)obj[k]=true;else delete obj[k];after(f);};l.append(x,el('span',undefined,f.label));parent.append(l);help(l,f);return;}
    case 'number':{const l=wrap(parent,f),i=el('input');i.type='number';i.step=f.step||'any';if(f.min!==undefined)i.min=f.min;if(f.max!==undefined)i.max=f.max;if(f.placeholder)i.placeholder=f.placeholder;i.value=obj[k]??'';const set=()=>{const v=normNum(i.value);if(v!==i.value)i.value=v;if(v===''){if(f.keep)obj[k]=0;else delete obj[k];}else{const x=Number(v);if(!Number.isFinite(x))return;obj[k]=x;}changed();};i.oninput=set;i.onchange=()=>{set();if(f.rerender)redraw();};l.append(i);numberInput(i,set);help(l,f);return;}
    case 'tags':{const l=wrap(parent,f);tagInput(l,obj[k],v=>{setVal(obj,k,v,f.keepEmptyArray);changed();},{label:f.label,placeholder:f.placeholder});help(l,f);return;}
    case 'ids':case 'rowlist':{const l=wrap(parent,f),i=el('input');i.type='text';i.placeholder=f.placeholder||(f.type==='rowlist'?'front, back, front':'カンマ区切り');i.value=(obj[k]||[]).join(', ');i.oninput=()=>{setVal(obj,k,splitList(i.value),f.keepEmptyArray);changed();};l.append(i);help(l,f);return;}
    case 'textarea':{const l=wrap(parent,f),t=el('textarea');t.value=obj[k]??'';t.oninput=()=>{setVal(obj,k,t.value);changed();};l.append(t);help(l,f);return;}
    case 'lines':{const l=wrap(parent,f),t=el('textarea');t.placeholder='隊長: 作戦を開始する\nオペレーター: 了解';t.value=(obj[k]||[]).map(x=>x.speaker?`${x.speaker}: ${x.text}`:x.text).join('\n');t.oninput=()=>{const lines=t.value.split('\n').map(x=>x.trim()).filter(Boolean).map(x=>{const m=x.match(/^([^:：]{1,40})[:：]\s*(.+)$/);return m?{speaker:m[1].trim(),text:m[2]}:{speaker:'',text:x};});setVal(obj,k,lines);changed();};l.append(t);help(l,f);return;}
    case 'idlines':{const l=wrap(parent,f),t=el('textarea');t.placeholder='enemy_a, enemy_a\nboss_unit';t.value=(obj[k]||[]).map(w=>w.join(', ')).join('\n');t.oninput=()=>{setVal(obj,k,t.value.split('\n').map(splitList).filter(x=>x.length));changed();};l.append(t);help(l,f);return;}
    case 'counts':{const l=wrap(parent,f),t=el('textarea');t.placeholder='item_id: 2';t.value=Object.entries(obj[k]||{}).map(([id,n])=>`${id}: ${n}`).join('\n');t.oninput=()=>{const out={};for(const line of t.value.split('\n')){const m=line.match(/^\s*([^:：×x\s]+)\s*[:：×x]\s*(\d+)\s*$/);if(m)out[m[1]]=Number(m[2]);}setVal(obj,k,out);changed();};l.append(t);help(l,f);return;}
    case 'json':{const l=wrap(parent,f),t=el('textarea');t.value=obj[k]===undefined?'':JSON.stringify(obj[k],null,1);t.oninput=()=>{if(!t.value.trim()){delete obj[k];t.className='';changed();return;}try{obj[k]=JSON.parse(t.value);t.className='';changed();}catch(e){t.className='pro-invalid';}};l.append(t);help(l,f);return;}
    case 'days':{const box=el('fieldset','pro-days');box.append(el('legend',undefined,f.label));const days=new Set(obj[k]||[]);C.days.forEach((d,i)=>{const l=el('label','pro-check'),x=el('input');x.type='checkbox';x.checked=days.has(i);x.onchange=()=>{if(x.checked)days.add(i);else days.delete(i);setVal(obj,k,[...days].sort());changed();};l.append(x,el('span',undefined,d));box.append(l);});parent.append(box);help(box,f);return;}
    case 'statmap':{const box=el('fieldset','pro-group');box.append(el('legend',undefined,f.label));const g=el('div','pro-fields');box.append(g);const cur=obj[k]||{};for(const s of C.STAT_KEYS){const l=el('label','pro-field'),i=el('input');l.append(el('span','pro-label',STAT_LABELS[s]));i.type='number';i.step='any';i.value=cur[s]??'';i.oninput=()=>{const m={...(obj[k]||{})};if(i.value===''||Number(i.value)===0)delete m[s];else m[s]=Number(i.value);setVal(obj,k,m);changed();};l.append(i);g.append(l);}help(box,f);parent.append(box);return;}
    case 'image':{const box=el('fieldset','pro-group');box.append(el('legend',undefined,f.label));const prev=el('img','pro-image');if(obj[k])prev.src=obj[k];else prev.hidden=true;const input=el('input');input.type='file';input.accept='image/png,image/jpeg,image/webp,image/gif';input.onchange=async()=>{const file=input.files&&input.files[0];if(!file)return;try{obj[k]=await shrinkImage(file,f.size||128);redraw();changed();}catch(e){alert('画像を読み込めません: '+e.message);}};box.append(prev,input);if(obj[k])box.append(btn('画像を削除',()=>{delete obj[k];redraw();changed();}));help(box,f);parent.append(box);return;}
    case 'object':{
      const box=el('fieldset','pro-group');box.append(el('legend',undefined,f.label));parent.append(box);help(box,f);
      if(f.toggle){const l=el('label','pro-check'),x=el('input');x.type='checkbox';x.checked=!!obj[k];x.onchange=()=>{if(x.checked)obj[k]=f.factory?f.factory():{};else delete obj[k];redraw();changed();};l.append(x,el('span',undefined,f.toggle));box.append(l);if(!obj[k])return;}
      const holder=obj[k]&&typeof obj[k]==='object'?obj[k]:{};
      form(box,holder,f.fields,h=>{if(!f.toggle&&(isEmpty(h)||(f.emptyWhen&&f.emptyWhen(h))))delete obj[k];else obj[k]=h;changed();},opts);return;}
    case 'skill':{const box=el('fieldset','pro-group');box.append(el('legend',undefined,f.label));parent.append(box);if(!obj[k])obj[k]=newSkill();form(box,obj[k],skillFields(),()=>changed(),opts);return;}
    case 'formation':{const box=el('fieldset','pro-group');box.append(el('legend',undefined,f.label));parent.append(box);help(box,f);const ids=Array.isArray(obj[k])?obj[k]:(obj[k]=[]);const rws=ids.map((_,i)=>(obj[f.rowsKey]||[])[i]==='back'?'back':'front');
      formationBox(box,ids,rws,refList(f.ref||'enemies'),()=>{obj[k]=ids;if(rws.some(r=>r==='back'))obj[f.rowsKey]=rws.slice(0,ids.length);else delete obj[f.rowsKey];changed();},{max:f.max});return;}
    case 'waves':{const box=el('fieldset','pro-group pro-list');box.append(el('legend',undefined,f.label));parent.append(box);help(box,f);const list=refList(f.ref||'enemies'),waves=(Array.isArray(obj[k])?obj[k]:[]).map(C.normalizeWave);
      const commit=re=>{const out=waves.map(compactWave);if(out.length)obj[k]=out;else delete obj[k];changed();if(re)redraw();};
      waves.forEach((w,i)=>{const card=el('div','pro-list-item pro-wave'),head=el('div','pro-list-head'),title=el('b',undefined,'');const names=()=>labelNames(list);const retitle=()=>{title.textContent=C.waveText(w,i,names());};retitle();lives.push(retitle);head.append(title);
        const up=btn('↑',()=>{[waves[i-1],waves[i]]=[waves[i],waves[i-1]];commit(true);});up.disabled=i===0;up.setAttribute('aria-label','前の波と入れ替え');
        const down=btn('↓',()=>{[waves[i+1],waves[i]]=[waves[i],waves[i+1]];commit(true);});down.disabled=i===waves.length-1;down.setAttribute('aria-label','次の波と入れ替え');
        const dup=btn('複製',()=>{waves.splice(i+1,0,C.clone(w));commit(true);});dup.disabled=waves.length>=9;dup.setAttribute('aria-label','この波を複製');
        head.append(up,down,dup,btn('この波を削除',()=>{waves.splice(i,1);commit(true);},'flow-btn danger'));card.append(head);
        const g=el('div','pro-fields');card.append(g);
        const lw=el('label','pro-field');lw.append(el('span','pro-label','いつ出てくる？'));const sw=selectOf(Object.entries(WAVE_WHEN),w.when,'出現のタイミング',null);sw.onchange=()=>{w.when=sw.value;if(w.when==='cleared')delete w.value;else w.value=WAVE_DEFAULT[w.when];commit(true);};lw.append(sw);g.append(lw);
        if(w.when!=='cleared'){const spec=WAVE_VALUE[w.when],lv=el('label','pro-field');lv.append(el('span','pro-label',spec.label));const iv=el('input');iv.type='number';iv.min=spec.min;iv.max=spec.max;iv.step='1';iv.value=w.value??'';iv.oninput=()=>{const v=normNum(iv.value);if(v==='')return;const x=Math.round(Number(v));if(!Number.isFinite(x))return;w.value=x;commit(false);};lv.append(iv,el('small','pro-help',spec.help));g.append(lv);}
        const ll=el('label','pro-field');ll.append(el('span','pro-label','波の名前（なくてもOK）'));const il=el('input');il.type='text';il.placeholder='例: 増援部隊';il.value=w.label||'';il.oninput=()=>{const v=il.value.trim();if(v)w.label=v;else delete w.label;commit(false);};ll.append(il);g.append(ll);
        formationBox(card,w.enemies,w.rows,list,()=>commit(false));box.append(card);});
      const add=btn('＋ 波を追加',()=>{waves.push({enemies:[],rows:[],when:'cleared'});commit(true);});add.disabled=waves.length>=9;box.append(add);
      if(!waves.length)box.append(el('small','pro-help','追加ウェーブなし（最初の敵だけで戦います）。'));return;}
    case 'objective':{objectiveEditor(parent,obj,f,{refList,changed,redraw,lives});return;}
    case 'terrain':{const box=el('fieldset','pro-group');box.append(el('legend',undefined,f.label));parent.append(box);help(box,f);const packList=()=>{try{return opts.terrains?opts.terrains()||[]:[];}catch(e){return [];}};
      const s=el('select');s.setAttribute('aria-label',f.label);const fx=el('div','pro-desc');const fill=()=>{s.replaceChildren();for(const [v,t] of terrainOptions(packList(),obj[k])){const o=el('option',undefined,t);o.value=v;s.append(o);}s.value=obj[k]||'標準';fx.textContent='効果: '+terrainEffectOf(obj[k],packList());};fill();
      s.onchange=()=>{obj[k]=s.value;fill();changed();};box.append(s,fx);if(opts.onEditTerrains)box.append(btn('地形を追加・編集する',()=>opts.onEditTerrains()));lives.push(fill);return;}
    case 'list':{
      const box=el('fieldset','pro-group pro-list');box.append(el('legend',undefined,f.label));parent.append(box);help(box,f);const arr=Array.isArray(obj[k])?obj[k]:[];
      arr.forEach((item,i)=>{const row=el('div','pro-list-item'),head=el('div','pro-list-head'),title=el('b',undefined,f.itemLabel?f.itemLabel(item,i):`${i+1}`);head.append(title);const itemChanged=()=>{if(f.itemLabel)title.textContent=f.itemLabel(item,i);changed();};
        const up=btn('↑',()=>{[arr[i-1],arr[i]]=[arr[i],arr[i-1]];redraw();changed();});up.disabled=i===0;up.setAttribute('aria-label','上へ');
        const down=btn('↓',()=>{[arr[i+1],arr[i]]=[arr[i],arr[i+1]];redraw();changed();});down.disabled=i===arr.length-1;down.setAttribute('aria-label','下へ');
        const dup=btn('複製',()=>{if(f.max&&arr.length>=f.max)return;arr.splice(i+1,0,f.duplicate?f.duplicate(item,arr):duplicateOf(item));redraw();changed();});dup.disabled=!!f.max&&arr.length>=f.max;dup.setAttribute('aria-label',`${f.label} ${i+1}を複製`);
        head.append(up,down,dup,btn('削除',()=>{arr.splice(i,1);if(!arr.length)delete obj[k];redraw();changed();},'flow-btn danger'));row.append(head);
        if(f.itemType==='skill')form(row,item,skillFields(),itemChanged,opts);else form(row,item,typeof f.fields==='function'?f.fields(item):f.fields,itemChanged,opts);box.append(row);});
      const add=btn('＋ '+(f.addLabel||'追加'),()=>{const a=Array.isArray(obj[k])?obj[k]:(obj[k]=[]);if(f.max&&a.length>=f.max)return;a.push(f.factory?f.factory():{});redraw();changed();});add.disabled=!!f.max&&arr.length>=f.max;box.append(add);
      if(f.presets&&f.presets.length){const s=el('select');s.setAttribute('aria-label',f.label+'のテンプレート');for(const [v,t] of [['','テンプレートから追加…'],...f.presets.map((p,i)=>[String(i),p.label])]){const o=el('option',undefined,t);o.value=v;s.append(o);}s.disabled=!!f.max&&arr.length>=f.max;s.onchange=()=>{if(s.value==='')return;const a=Array.isArray(obj[k])?obj[k]:(obj[k]=[]);a.push(f.presets[Number(s.value)].make(obj,a));redraw();changed();};box.append(s);}
      return;}
    case 'typedRules':{
      const box=el('fieldset','pro-group pro-list');box.append(el('legend',undefined,f.label));parent.append(box);help(box,f);
      const all=Array.isArray(obj[k])?obj[k]:[],typed=all.filter(r=>r&&typeof r==='object'&&Object.hasOwn(C.ruleTypes,r.type)),others=all.filter(r=>!typed.includes(r));
      const commit=()=>{const next=[...others,...typed];if(next.length)obj[k]=next;else delete obj[k];changed();};
      typed.forEach((r,i)=>{const row=el('div','pro-list-item'),head=el('div','pro-list-head');head.append(el('b',undefined,C.ruleTypes[r.type]),btn('削除',()=>{typed.splice(i,1);commit();redraw();},'flow-btn danger'));row.append(head);form(row,r,ruleFields(r.type),commit,opts);box.append(row);});
      const add=el('div','pro-row');for(const [t,label] of Object.entries(C.ruleTypes))add.append(btn('＋ '+label,()=>{typed.push(t==='turn_limit'?{type:t,value:10}:t==='reinforce'?{type:t,turn:3,enemies:[]}:{type:t});commit();redraw();}));box.append(add);return;}
    case 'ref':{
      const list=refList(f.ref);
      if(!list){const l=wrap(parent,f),i=el('input');i.type='text';i.placeholder=f.multi?'IDをカンマ区切り':'ID';i.value=f.multi?(obj[k]||[]).join(', '):(obj[k]??'');i.oninput=()=>{if(f.multi)setVal(obj,k,splitList(i.value),f.keepEmptyArray);else setVal(obj,k,i.value.trim());changed();};l.append(i,el('small','pro-help','※参照先のデータを読み込むとリストから選べます。'));help(l,f);return;}
      if(!f.multi){const l=wrap(parent,f),s=refSelect(list,obj[k],f.label||k,f.empty||'（選んでください）');s.onchange=()=>{setVal(obj,k,s.value,f.keep);after(f);};l.append(s);if(!list.length)l.append(el('small','pro-help','候補がありません。先にデータを作成・読み込みしてください。'));help(l,f);return;}
      if(f.ordered){const box=el('fieldset','pro-group');box.append(el('legend',undefined,f.label));parent.append(box);help(box,f);const arr=Array.isArray(obj[k])?obj[k]:[];arr.forEach((id,i)=>{const row=el('div','pro-row'),s=refSelect(list,id,`${f.label} ${i+1}`);s.onchange=()=>{arr[i]=s.value;setVal(obj,k,arr.filter(Boolean),f.keepEmptyArray);changed();};row.append(s,btn('削除',()=>{arr.splice(i,1);setVal(obj,k,arr,f.keepEmptyArray);redraw();changed();},'flow-btn danger'));box.append(row);});const add=refSelect(list,'',`${f.label}に追加`,'＋ 追加する'),max=f.max||8;add.disabled=arr.length>=max;add.onchange=()=>{if(!add.value)return;const a=Array.isArray(obj[k])?obj[k]:(obj[k]=[]);if(a.length<max)a.push(add.value);redraw();changed();};box.append(add);return;}
      const box=el('fieldset','pro-group');box.append(el('legend',undefined,f.label));parent.append(box);help(box,f);const set=new Set(obj[k]||[]);if(!list.length)box.append(el('small','pro-help','候補がありません。'));for(const [v,t] of list){const l=el('label','pro-check'),x=el('input');x.type='checkbox';x.checked=set.has(v);x.onchange=()=>{if(x.checked)set.add(v);else set.delete(v);setVal(obj,k,[...set],f.keepEmptyArray);changed();};l.append(x,el('span',undefined,t));box.append(l);}return;}
    case 'refcounts':{
      const list=refList(f.ref);if(!list){f={...f,type:'counts'};renderField(parent,f);return;}
      const box=el('fieldset','pro-group');box.append(el('legend',undefined,f.label));parent.append(box);help(box,f);const cur=obj[k]||{};
      for(const [id,n] of Object.entries(cur)){const row=el('div','pro-row'),s=refSelect(list,id,'アイテム'),i=el('input');i.type='number';i.min=1;i.value=n;i.setAttribute('aria-label','個数');s.onchange=()=>{const m={...(obj[k]||{})};delete m[id];if(s.value)m[s.value]=Number(i.value)||1;setVal(obj,k,m);redraw();changed();};i.oninput=()=>{const m={...(obj[k]||{})};m[id]=Math.max(1,Number(i.value)||1);setVal(obj,k,m);changed();};row.append(s,i,btn('削除',()=>{const m={...(obj[k]||{})};delete m[id];setVal(obj,k,m);redraw();changed();},'flow-btn danger'));box.append(row);}
      const add=refSelect(list.filter(([v])=>!Object.hasOwn(cur,v)),'',`${f.label}に追加`,'＋ 追加する');add.onchange=()=>{if(!add.value)return;setVal(obj,k,{...(obj[k]||{}),[add.value]:1});redraw();changed();};box.append(add);return;}
    default:{const l=wrap(parent,f),i=el('input');i.type='text';if(f.placeholder)i.placeholder=f.placeholder;i.value=obj[k]??'';i.oninput=()=>{setVal(obj,k,f.trim===false?i.value:i.value.trim(),f.keep);changed();};if(f.rerender)i.onchange=()=>redraw();l.append(i);help(l,f);}
    }
  }
  draw();return {redraw};
}
function shrinkImage(file,size){return new Promise((resolve,reject)=>{const reader=new FileReader();reader.onerror=()=>reject(new Error('読み込み失敗'));reader.onload=()=>{const img=new Image();img.onerror=()=>reject(new Error('画像形式を認識できません'));img.onload=()=>{const scale=Math.min(1,size/Math.max(img.width,img.height)),w=Math.max(1,Math.round(img.width*scale)),h=Math.max(1,Math.round(img.height*scale));const c=document.createElement('canvas');c.width=w;c.height=h;c.getContext('2d').drawImage(img,0,0,w,h);let url=c.toDataURL('image/webp',.85);if(!url.startsWith('data:image/webp'))url=c.toDataURL('image/png');try{resolve(C.image(url,'画像'));}catch(e){reject(e);}};img.src=reader.result;};reader.readAsDataURL(file);});}

// ---- field sets ----
// `advanced:true` fields sit behind 「詳細設定を開く」 in easy mode. `ref` fields pick IDs from loaded data.
const RESIST=C.RESIST_TYPES;
const T=()=>root.PROTemplates;
const skillPresets=()=>(T()?.skills||[]).map(t=>({label:`${t.label}：${t.desc}`,make:(o,a)=>T().skillByKey(t.key,(a||[]).map(x=>x.id))}));
const weaponPresets=()=>(T()?.weapons||[]).map(t=>({label:`${t.label}：${t.desc}`,make:()=>T().weaponByKey(t.key)}));
function skillExtFields(){return [
  {key:'tag',label:'特効タグ（このタグを持つ敵へのダメージが上がる）',type:'text',show:o=>o.effect==='tag_damage_up_pct'},
  {key:'target',label:'効果対象',type:'select',empty:'自動（強化・回復は自分、弱体は相手）',choices:C.skillTargets,show:o=>C.TARGETED_EFFECTS.includes(o.effect)},
  {key:'duration',label:'持続TURN（スタンは行動不能回数）',type:'number',min:1,max:99,show:o=>C.DURATION_EFFECTS.includes(o.effect)},
  {key:'cond',label:'追加の発動条件',type:'object',advanced:true,emptyWhen:o=>!o.type,fields:[{key:'type',label:'条件',type:'select',empty:'なし',choices:C.conditions,rerender:true},{key:'value',label:'条件値',type:'number',show:o=>o.type&&o.type!=='target_tag'},{key:'tag',label:'条件タグ',type:'text',show:o=>o.type==='target_tag'}]}
];}
function skillFields(){return [
  {key:'name',label:'スキル名',type:'text',keep:true},
  {key:'trigger',label:'いつ発動する？',type:'select',choices:C.triggers,rerender:true,onSet:o=>{if(!C.allowed[o.trigger]?.includes(o.effect))o.effect=C.allowed[o.trigger][0];}},
  {key:'effect',label:'何が起きる？',type:'select',choices:o=>Object.fromEntries((C.allowed[o.trigger]||[]).map(x=>[x,C.skillEffects[x]])),rerender:true,onSet:o=>{if(o.effect==='weapon_resist_pct'&&!o.resistType)o.resistType='physical';}},
  {key:'resistType',label:'どの攻撃に強い？（耐性の対象）',type:'select',choices:RESIST,show:o=>o.effect==='weapon_resist_pct',help:'物理・ビーム・特殊・幻想はその属性の武装に、近接・射撃は攻撃方式に効きます。'},
  {key:'value',label:'効果の大きさ',type:'number',keep:true},{key:'chance',label:'発動率 %',type:'number',min:0,max:100,keep:true},
  ...skillExtFields(),
  {key:'maxUses',label:'1戦闘の発動回数（0=無制限）',type:'number',min:0,keep:true,advanced:true},
  {key:'id',label:'スキルID',type:'text',advanced:true},{key:'note',label:'メモ',type:'text',advanced:true}
];}
function weaponExtFields(){return [
  {key:'usesPerBattle',label:'1戦闘の使用回数（空欄=無制限）',type:'number',min:0,max:99,advanced:true},
  {key:'cooldown',label:'使用後に待つTURN数（空欄=なし）',type:'number',min:0,max:99,advanced:true},
  {key:'defPiercePct',label:'DEF貫通 %',type:'number',min:0,max:100,advanced:true},
  {key:'fxColor',label:'演出色（#RRGGBB）',type:'text',placeholder:'#ffaa33',advanced:true},
  {key:'effects',label:'追加効果（武装を使う前・使った後に発動）',type:'list',max:C.WEAPON_EFFECT_MAX,wide:true,fields:weaponEffectFields,factory:()=>({timing:'after',effect:'def_down_pct',value:15,when:'hit'}),presets:WEAPON_EFFECT_PRESETS.map(([label,e])=>({label,make:()=>C.clone(e)})),addLabel:'白紙の追加効果を追加',itemLabel:(e,i)=>{try{return `効果${i+1}: ${C.weaponEffectText(C.weaponEffect(e))}`;}catch(x){return `効果${i+1}`;}},help:'使用前の効果はこの攻撃のダメージにも反映されます。使用後の効果は攻撃が終わってから発動します（反撃では発動しません）。'}
];}
const WEAPON_EFFECT_PRESETS=[
  ['使用前：自分のATK+20%（2TURN）',{timing:'before',effect:'atk_up_pct',value:20,duration:2}],
  ['使用前：命中+15pt（この攻撃だけ）',{timing:'before',effect:'hit_up_pt',value:15}],
  ['使用前：相手のDEF-20%（この攻撃から効く）',{timing:'before',effect:'def_down_pct',value:20,duration:2}],
  ['使用前：「装甲車」へのダメージ+30%',{timing:'before',effect:'tag_damage_up_pct',value:30,tag:'装甲車'}],
  ['命中したら相手のDEF-15%（装甲破壊）',{timing:'after',effect:'def_down_pct',value:15,when:'hit',duration:2}],
  ['命中したら30%の確率でスタン',{timing:'after',effect:'stun',value:0,when:'hit',chance:30}],
  ['命中したら炎上（毎TURN 80・3TURN）',{timing:'after',effect:'burn',value:80,when:'hit',duration:3}],
  ['命中したら相手のACC-20%',{timing:'after',effect:'acc_down_pct',value:20,when:'hit',duration:2}],
  ['使用後：与ダメージの30%を吸収',{timing:'after',effect:'drain_pct',value:30}],
  ['使用後：反動（最大HPの5%ダメージ）',{timing:'after',effect:'recoil_pct',value:5}],
  ['撃破したら再行動',{timing:'after',effect:'extra_action',value:0,when:'kill'}],
  ['使用後：自分にバリア200',{timing:'after',effect:'shield',value:200}],
  ['使用後：味方全体のATK+10%（2TURN）',{timing:'after',effect:'atk_up_pct',value:10,target:'allies',duration:2}]
];
const WEAPON_OWN_EFFECTS=[...(C.WEAPON_BEFORE_ONLY||[]),...(C.WEAPON_AFTER_ONLY||[]),'extra_action']; // tolerant of an older cached pro_core.js
function weaponEffectFields(){return [
  {key:'timing',label:'タイミング',type:'select',choices:{before:'使用前（ダメージ計算の前）',after:'使用後（攻撃が終わった後）'},rerender:true,onSet:o=>{if(!C.weaponEffectsAllowed[o.timing].includes(o.effect))o.effect=C.weaponEffectsAllowed[o.timing][0];if(o.timing!=='after')delete o.when;}},
  {key:'effect',label:'何が起きる？',type:'select',choices:o=>Object.fromEntries((C.weaponEffectsAllowed[o.timing]||[]).map(x=>[x,C.weaponEffectLabels[x]])),rerender:true,onSet:o=>{if(o.effect==='tag_damage_up_pct'&&!o.tag)o.tag='装甲車';if(WEAPON_OWN_EFFECTS.includes(o.effect))delete o.target;}},
  {key:'value',label:'効果の大きさ',type:'number',min:0,keep:true,show:o=>!['stun','extra_action'].includes(o.effect)},
  {key:'when',label:'発動のきっかけ',type:'select',empty:'いつでも',choices:{hit:C.weaponWhen.hit,crit:C.weaponWhen.crit,kill:C.weaponWhen.kill},show:o=>o.timing==='after'},
  {key:'chance',label:'発動率 %（空欄=100%）',type:'number',min:0,max:100},
  {key:'target',label:'効果対象',type:'select',empty:'自動（弱体はこの攻撃の対象、強化・回復は自分）',choices:C.weaponEffectTargets,show:o=>!WEAPON_OWN_EFFECTS.includes(o.effect)},
  {key:'duration',label:'持続TURN（スタンは行動不能回数）',type:'number',min:1,max:99,show:o=>C.DURATION_EFFECTS.includes(o.effect)},
  {key:'tag',label:'特効タグ（このタグを持つ敵へのダメージが上がる）',type:'text',show:o=>o.effect==='tag_damage_up_pct'},
  skillExtFields().find(f=>f.key==='cond')
];}
function weaponFields(){return [
  {key:'name',label:'武装名',type:'text',keep:true},{key:'attackType',label:'攻撃方式',type:'select',choices:{melee:'近接',ranged:'射撃'}},{key:'damageType',label:'属性',type:'select',choices:C.DAMAGE_TYPES},
  ...[['powerPct','威力 %'],['accuracyPt','命中補正 pt'],['critPt','CRIT補正 pt'],['targetCount','対象数'],['weight','抽選ウェイト'],['minDamage','最低ダメージ'],['hitsMin','最小HIT'],['hitsMax','最大HIT'],['hitPowerPct','1HIT威力 %']].map(([key,label])=>({key,label,type:'number',keep:true,advanced:true})),
  ...weaponExtFields(),{key:'note',label:'メモ',type:'text',advanced:true}
];}
function unitExtFields(){return [
  {key:'image',label:'ユニット画像（128px程度に縮小して埋め込みます）',type:'image'},
  {key:'sortieCost',label:'出撃費用（出撃1回ごとに資金から引く。勝敗に関係なし。空欄=0）',type:'number',min:0,max:1000000,help:'部隊全員の出撃費用の合計が資金より多いと出撃できません。'},
  {key:'equipSlots',label:'装備枠の数（0～6。空欄=2）',type:'number',min:0,max:6,help:'「装備枠を増やす」アイテムで、ユニットごとに最大8枠まで増減できます。'},
  {key:'noFire',label:'解雇できない（重要ユニット）',type:'check',help:'ゲームのユニット一覧に「解雇する」ボタンを出しません。'},
  {key:'row',label:'標準の隊列',type:'select',empty:'前衛（標準）',choices:{back:'後衛'},help:'前衛は狙われやすく、後衛は前衛がいる間は近接攻撃を受けません。'},
  {key:'recruit',label:'加入条件',type:'object',emptyWhen:o=>!o.locked,fields:[{key:'locked',label:'最初は部隊にいない（作戦クリア・アイテム・研究で加入）',type:'check',rerender:true},{key:'missionId',label:'この作戦をクリアすると加入（任意）',type:'ref',ref:'missions',empty:'（作戦クリアでは加入しない）',show:o=>o.locked},{key:'note',label:'加入条件のメモ',type:'text',show:o=>o.locked,advanced:true}]},
  {key:'skillTree',label:'スキルツリー（レベルアップで得るSPで解放）',type:'list',max:32,addLabel:'白紙のノードを追加',presets:(T()?.skills||[]).map(t=>({label:`${t.label}：${t.desc}`,make:(o,a)=>{const n=T().makeTreeNode(t.key,(a||[]).map(x=>x.id));n.cost=Math.min(3,1+Math.floor(a.length/2));n.minLevel=1+a.length*2;return n;}})),itemLabel:(n,i)=>`ノード${i+1}: ${n.skill?.name||''}`,factory:()=>({id:'node_'+rid(),cost:1,minLevel:1,requires:[],skill:newSkill()}),fields:[{key:'cost',label:'必要SP',type:'number',min:0,keep:true},{key:'minLevel',label:'必要レベル',type:'number',min:1,keep:true},{key:'requires',label:'先に解放が必要なノード',type:'ref',ref:'nodes',multi:true,keepEmptyArray:true},{key:'skill',label:'習得スキル',type:'skill'},{key:'id',label:'ノードID',type:'text',advanced:true}]},
  {key:'crew',label:'パイロット',type:'select',empty:C.crews.optional+'（標準）',choices:{none:C.crews.none,required:C.crews.required},rerender:true,onSet:o=>{if(o.crew==='required')delete o.pilotProfile;},help:'「パイロットが必要」にすると、パイロットが乗っていないと出撃できません（敵として出るときは不要）。'},
  {key:'pilotProfile',label:'パイロットとして乗る',type:'object',toggle:'このユニットはパイロットとして他のユニット（機体）に乗れる',show:o=>o.crew!=='required',factory:()=>({stats:{acc:20},skills:[],growthPct:2}),help:'自分で出撃することも、機体に乗って補正を与えることもできます。乗っている間は機体と一緒に経験値・疲労・負傷を受けます。',fields:[
    ...pilotFields().filter(f=>['stats','aptitude','skills'].includes(f.key)),
    {key:'growthPct',label:'補正の成長 %（パイロットLvが1上がるごと。空欄=2）',type:'number',min:0,max:20,advanced:true}]},
  {key:'ai',label:'AIの狙い方',type:'object',advanced:true,emptyWhen:o=>!o.target,fields:[{key:'target',label:'狙い方',type:'select',empty:'ランダム（標準）',choices:{lowest_hp:C.aiTargets.lowest_hp,highest_atk:C.aiTargets.highest_atk,tag:C.aiTargets.tag},rerender:true},{key:'tag',label:'優先するタグ',type:'text',show:o=>o.target==='tag'}]},
  {key:'growth',label:'レベルアップ時の成長値（すべて空欄なら自動）',type:'statmap',advanced:true},
  {key:'exp',label:'敵として撃破された時の経験値（空欄なら自動）',type:'number',min:0,advanced:true}
];}
function pilotFields(){return [
  {key:'name',label:'名前',type:'text',keep:true},
  {key:'stats',label:'搭乗時の能力補正',type:'statmap'},
  {key:'aptitude',label:'適性（このタグの機体に乗るとATK・MOB・ACCが上がる）',type:'object',emptyWhen:o=>!o.pct,fields:[{key:'tags',label:'適性タグ',type:'tags'},{key:'pct',label:'ボーナス %',type:'number',min:0,max:200}]},
  {key:'skills',label:'パイロットスキル',type:'list',itemType:'skill',max:8,factory:newSkill,presets:skillPresets(),addLabel:'白紙のスキルを追加',itemLabel:(s,i)=>`スキル${i+1}: ${s.name||''}`},
  {key:'image',label:'顔画像',type:'image'},
  {key:'tags',label:'タグ（カンマ区切り）',type:'tags',keepEmptyArray:true,advanced:true},{key:'id',label:'パイロットID',type:'text',advanced:true},{key:'note',label:'メモ',type:'text',advanced:true}
];}
function newPilot(){return {id:'pilot_'+rid(),name:'新しいパイロット',tags:[],stats:{acc:20},skills:[]};}
function ruleFields(type){if(type==='turn_limit')return [{key:'value',label:'このTURNまでに勝てなければ敗北',type:'number',min:1,max:300,keep:true}];if(type==='reinforce')return [{key:'turn',label:'出現TURN',type:'number',min:1,max:300,keep:true},{key:'enemies',label:'援軍の敵',type:'ref',ref:'enemies',multi:true,ordered:true,keepEmptyArray:true}];return [{key:'allTags',label:'全員がすべて持つタグ',type:'tags'},{key:'anyTags',label:'全員がどれか1つ持つタグ',type:'tags'},{key:'noneTags',label:'持っていると出撃不可のタグ',type:'tags'}];}
function missionExtFields(){return [
  {key:'objective',label:'勝敗条件',type:'objective',help:'勝ち方を1つ選び、必要なら「護衛」や「TURN制限」を足します。下の「勝敗条件の確認」に、ゲームで表示される文章が出ます。'},
  {key:'waves',label:'追加ウェーブ（あとから出てくる敵）',type:'waves',ref:'enemies',help:'波ごとに「いつ出てくるか」と前衛・後衛を決めます。盤面の敵がいなくなったときは、まだ出ていない次の波がそのTURNの終わりに出ます。'},
  {key:'rules',label:'戦闘ルール（TURN制限・決まったTURNの援軍・出撃できるユニットの条件）',type:'typedRules'},
  {key:'requires',label:'出撃条件',type:'object',fields:[{key:'missions',label:'先にクリアが必要な作戦',type:'ref',ref:'missions',multi:true},{key:'items',label:'持っている必要があるキーアイテム',type:'ref',ref:'keyItems',multi:true},{key:'minLevel',label:'出撃ユニットの必要レベル',type:'number',min:1,max:99}]},
  hiddenField('作戦','前提作戦・キーアイテムの条件を満たすまで作戦一覧に出しません（曜日の条件だけのときは隠しません）。'),
  {key:'story',label:'ストーリー（1行に「話す人: セリフ」）',type:'object',fields:[{key:'before',label:'作戦前',type:'lines'},{key:'after',label:'勝利後',type:'lines'}]},
  {key:'stars',label:'星条件（最大3つ。なしなら「勝利／被撃破なし／10TURN以内」）',type:'list',max:3,addLabel:'星条件を追加',advanced:true,factory:()=>({type:'clear'}),fields:[{key:'type',label:'条件',type:'select',choices:C.starTypes,rerender:true},{key:'value',label:'値',type:'number',min:1,max:100,show:o=>['turns_le','hp_ge'].includes(o.type),keep:true}]},
  {key:'days',label:'出撃できる曜日（全部オフ=毎日）',type:'days',advanced:true},
  {key:'terrainMods',label:'この作戦だけ地形の効果を変える（空欄なら地形のまま）',type:'object',advanced:true,fields:[{key:'meleeHitPt',label:'近接の命中 pt（マイナス可）',type:'number',min:-100,max:100},{key:'rangedHitPt',label:'射撃の命中 pt（マイナス可）',type:'number',min:-100,max:100},{key:'mobPct',label:'MOB %（マイナス可）',type:'number',min:-90,max:200},{key:'banTags',label:'出撃できないタグ',type:'tags'}]},
  {key:'starReward',label:'星1つの初回ボーナス資金（空欄=報酬の20%）',type:'number',min:0,advanced:true},
  {key:'exp',label:'出撃経験値（空欄=RANKから自動）',type:'number',min:0,advanced:true}
];}
function itemExtFields(){return [
  {key:'price',label:'ショップ価格（空欄=非売品）',type:'number',min:0},
  {key:'scope',label:'使用範囲',type:'select',empty:'選んだ1体',choices:{party:'部隊全員（使用できるユニット全員に効果）'}},
  {key:'key',label:'キーアイテム（使用不可・作戦の出撃条件に使う）',type:'check'},
  {key:'equip',label:'装備品',type:'object',toggle:'装備品にする（「育成」で装備・効果は装備中だけ）',factory:()=>({slot:'accessory',stats:{atk:20},skills:[],weapons:[]}),fields:[{key:'stats',label:'装備中の能力補正',type:'statmap'},{key:'skills',label:'装備中のスキル',type:'list',itemType:'skill',max:8,factory:newSkill,presets:skillPresets(),addLabel:'白紙のスキルを追加',itemLabel:(s,i)=>`スキル${i+1}: ${s.name||''}`},{key:'weapons',label:'装備中の追加武装',type:'list',max:4,factory:newWeapon,presets:weaponPresets(),addLabel:'白紙の武装を追加',fields:weaponFields(),itemLabel:(w,i)=>`武装${i+1}: ${w.name||''}`}]},
  {key:'limitPerUnit',label:'1体あたりの使用回数上限（空欄=無制限）',type:'number',min:0,advanced:true},
  {key:'shop',label:'ショップの販売条件',type:'object',advanced:true,fields:[{key:'requiresResearch',label:'完了が必要な研究',type:'ref',ref:'research',empty:'（条件なし）'},{key:'requiresMission',label:'クリアが必要な作戦',type:'ref',ref:'missions',empty:'（条件なし）'}]}
];}
function researchFields(){return [
  {key:'name',label:'研究名',type:'text',keep:true},{key:'desc',label:'説明',type:'textarea'},
  {key:'cost',label:'研究費',type:'object',fields:[{key:'credits',label:'資金',type:'number',min:0},{key:'items',label:'必要素材',type:'refcounts',ref:'items'}]},
  {key:'requires',label:'先に完了が必要な研究',type:'ref',ref:'research',multi:true},
  hiddenField('研究','前提研究が終わるまで研究一覧に出しません。'),
  {key:'unlock',label:'完了時の効果',type:'object',fields:[{key:'units',label:'加入させるユニット',type:'ref',ref:'lockedUnits',multi:true},{key:'items',label:'ショップに並べるアイテム',type:'ref',ref:'pricedItems',multi:true},{key:'grantItems',label:'支給アイテム',type:'refcounts',ref:'items'}]},
  {key:'id',label:'研究ID',type:'text',advanced:true}
];}
function hiddenField(what,help){return {key:'hidden',label:'未解放のときの表示',type:'select',empty:'🔒付きで見せる（標準）',choices:{true:'隠す（条件を満たすまで見せない）'},onSet:o=>{if(o.hidden==='true')o.hidden=true;},help:`${what}を${help}`};}
// 1.13.0: hire offers (combined maker 「雇用」 tab)
function hireFields(){return [
  {key:'unitId',label:'雇えるユニット',type:'ref',ref:'players',keep:true},
  {key:'cost',label:'雇用費（0=無料）',type:'number',min:0,keep:true},
  {key:'limit',label:'雇える上限（そのユニットの所持数。空欄=無制限）',type:'number',min:0,max:99},
  {key:'requires',label:'雇えるようになる条件（すべて空欄=最初から）',type:'object',fields:[{key:'missions',label:'クリアが必要な作戦',type:'ref',ref:'missions',multi:true},{key:'research',label:'完了が必要な研究',type:'ref',ref:'research',multi:true},{key:'items',label:'持っている必要があるキーアイテム',type:'ref',ref:'keyItems',multi:true},{key:'day',label:'この日数がたってから',type:'number',min:0,max:99999}]},
  {key:'hidden',label:'条件を満たすまでの表示',type:'select',empty:'🔒付きで見せる（標準）',choices:{true:'隠す'},onSet:o=>{if(o.hidden==='true')o.hidden=true;}},
  {key:'note',label:'紹介文（雇用画面に出ます）',type:'text'},
  {key:'id',label:'雇用候補ID',type:'text',advanced:true}
];}
function newHire(unitId=''){return {id:'hire_'+rid(),unitId,cost:1000};}
// 1.13.0: one input for drop rates — "50", "50%" or "1/8". Returns {chance} or {odds} (null when invalid).
function dropRateInput(parent,drop,onChange){const i=el('input');i.type='text';i.inputMode='text';i.placeholder='例: 50 / 50% / 1/8';i.value=Array.isArray(drop.odds)?`${drop.odds[0]}/${drop.odds[1]}`:(drop.chance??'');i.setAttribute('aria-label','ドロップ率（%か分数）');const hint=el('small','pro-help','');
  const show=()=>{try{hint.textContent=C.dropRateText(drop);}catch(e){hint.textContent='';}};
  i.oninput=()=>{const r=C.parseDropRate(i.value);if(!r){i.className='pro-invalid';hint.textContent='「50」「50%」「1/8」のように入力してください';return;}i.className='';delete drop.chance;delete drop.odds;Object.assign(drop,r);show();onChange&&onChange(drop);};
  parent.append(i,hint);show();return i;}
function newResearch(){return {id:'research_'+rid(),name:'新しい研究',desc:'',cost:{credits:1000},requires:[],unlock:{}};}
const NEW_EFFECTS=['add_tag','remove_tag','sortie_buff','loot_box','remove_skill','remove_weapon','recruit_unit','exp_gain','skill_point','equip_slot'];
function effectDefaults(type){switch(type){case 'add_tag':return {type,tag:'改造'};case 'remove_tag':return {type,tag:'生身'};case 'sortie_buff':return {type,stat:'atk',value:20};case 'loot_box':return {type,table:[{itemId:'item-0001',weight:1,min:1,max:1}]};case 'remove_skill':case 'remove_weapon':return {type};case 'recruit_unit':return {type,unitId:'unit-0001'};case 'exp_gain':return {type,value:100};case 'skill_point':return {type,value:1};case 'equip_slot':return {type,value:1};}return null;}
function effectFields(type){switch(type){
  case 'add_tag':case 'remove_tag':return [{key:'tag',label:'タグ',type:'text',keep:true}];
  case 'sortie_buff':return [{key:'stat',label:'対象能力',type:'select',choices:{atk:'ATK',def:'DEF',mob:'MOB',acc:'ACC'}},{key:'value',label:'上昇率 %（次の出撃だけ）',type:'number',min:1,max:500,keep:true}];
  case 'loot_box':return [{key:'table',label:'中身（重みの比率で1つ選ばれる）',type:'list',max:32,addLabel:'中身を追加',factory:()=>({itemId:'',weight:1,min:1,max:1}),itemLabel:(r,i)=>`${i+1}: ${r.itemId||''}`,fields:[{key:'itemId',label:'アイテム',type:'ref',ref:'items',keep:true},{key:'weight',label:'出やすさ（重み）',type:'number',min:.01,keep:true},{key:'min',label:'最小個数',type:'number',min:1,keep:true},{key:'max',label:'最大個数',type:'number',min:1,keep:true}]}];
  case 'remove_skill':return [{key:'skillId',label:'外すスキルID（空欄=アイテムで習得したスキルをすべて）',type:'text'}];
  case 'remove_weapon':return [{key:'name',label:'外す武装名（空欄=アイテムで追加した武装をすべて）',type:'text'}];
  case 'recruit_unit':return [{key:'unitId',label:'加入するユニット（加入条件付きのユニット）',type:'ref',ref:'lockedUnits',keep:true}];
  case 'exp_gain':return [{key:'value',label:'経験値',type:'number',min:1,keep:true}];
  case 'skill_point':return [{key:'value',label:'スキルポイント',type:'number',min:1,keep:true}];
  case 'equip_slot':return [{key:'value',label:'装備枠を増やす数（減らすときはマイナス。-3～3）',type:'number',min:-3,max:3,keep:true}];}return [];}

// Lenient extraction for maker drafts: keep 1.9 fields even when not yet valid so the user can fix them.
const UNIT_EXT_KEYS=['image','ai','row','growth','exp','skillTree','recruit','crew','pilotProfile','sortieCost','equipSlots','noFire'],SKILL_EXT_KEYS=['cond','target','duration','tag'],WEAPON_EXT_KEYS=['usesPerBattle','cooldown','defPiercePct','fxColor','effects'],MISSION_EXT_KEYS=['enemyRows','objective','waves','terrainMods','requires','story','stars','starReward','days','exp','hidden'],ITEM_EXT_KEYS=['price','limitPerUnit','scope','equip','key','shop'];
function pick(o,keys){const out={};for(const k of keys)if(o&&o[k]!==undefined&&o[k]!==null&&o[k]!=='')out[k]=C.clone(o[k]);return out;}

// ---- simulator and damage calculator ----
function battleUnit(u){const s=x=>{try{return C.skill(x)}catch(e){return null}},w=x=>{try{return C.weapon(x)}catch(e){return null}};let tags=[];try{tags=C.unitTags(u)}catch(e){}let ext={};try{ext=C.unitExt(u)}catch(e){}
  const weapons=(u.weapons||[]).map(w).filter(Boolean);return {...u,...ext,tags,hp:Math.max(1,Math.floor(Number(u.hp)||3000)),atk:Number(u.atk)||0,def:Number(u.def)||0,mob:Number(u.mob)||0,acc:Number(u.acc)||0,skills:(u.skills||[]).map(s).filter(Boolean),weapons:weapons.length?weapons:[C.weapon({name:'標準攻撃'})],deploy:{player:u.deploy?.player!==false,enemy:!!u.deploy?.enemy}};}
function battleMission(m){let ext={};try{ext=C.missionExt(m)}catch(e){}const rules=(m.rules||[]).map(r=>{try{return C.rule(r,m.id)}catch(e){return null}}).filter(Boolean);return {...m,...ext,rules,enemies:(m.enemies||[]).filter(Boolean)};}
function tools(container,src){
  const box=el('section','pro-tools');container.append(box);
  box.append(el('h3',undefined,'勝率シミュレーター'),el('p','pro-help','読み込んだユニット・作戦で自動戦闘を繰り返し、勝率と平均TURNを計算します（レベル・装備などの育成要素は含みません）。'));
  const simArea=el('div');box.append(simArea);
  box.append(el('h3',undefined,'ダメージ計算機'),el('p','pro-help','攻撃側の武装1回分の命中率・ダメージ・撃破までの行動回数の目安です（スキルは含みません）。'));
  const dmgArea=el('div');box.append(dmgArea);
  const st={allies:[],enemies:[],mission:'',trials:100,seed:1,att:'',weapon:'',def:'',terrain:'標準'};
  function units(){return (src.getUnits()||[]).filter(u=>u&&u.id).map(battleUnit);}
  function missions(){return (src.getMissions?src.getMissions():[]).filter(m=>m&&m.id);}
  function checkList(parent,label,list,sel,max){const fs=el('fieldset','pro-group');fs.append(el('legend',undefined,label));if(!list.length)fs.append(el('small','pro-help','候補がありません'));for(const u of list){const l=el('label','pro-check'),x=el('input');x.type='checkbox';x.checked=sel.includes(u.id);x.onchange=()=>{const i=sel.indexOf(u.id);if(x.checked&&i<0){if(sel.length>=max){x.checked=false;return;}sel.push(u.id);}if(!x.checked&&i>=0)sel.splice(i,1);};l.append(x,el('span',undefined,`${u.name}（${u.id}）`));fs.append(l);}parent.append(fs);}
  function drawSim(){simArea.replaceChildren();const all=units(),ms=missions();
    checkList(simArea,'味方（最大8）',all.filter(u=>u.deploy.player),st.allies,8);
    const row=el('div','pro-fields');const ml=el('label','pro-field');ml.append(el('span','pro-label','作戦'));const ms2=el('select');ms2.setAttribute('aria-label','シミュレーションする作戦');for(const [v,t] of [['','敵を直接選ぶ'],...ms.map(m=>[m.id,m.name])]){const o=el('option',undefined,t);o.value=v;ms2.append(o);}ms2.value=st.mission;ms2.onchange=()=>{st.mission=ms2.value;drawSim();};ml.append(ms2);row.append(ml);
    const tl=el('label','pro-field');tl.append(el('span','pro-label','試行回数（1～2000）'));const ti=el('input');ti.type='number';ti.value=st.trials;ti.oninput=()=>{st.trials=Number(ti.value)||100;};tl.append(ti);row.append(tl);simArea.append(row);
    if(!st.mission)checkList(simArea,'敵（最大8）',all.filter(u=>u.deploy.enemy),st.enemies,8);
    const out=el('pre','pro-output');const run=btn('シミュレーション実行',async()=>{const defs=Object.fromEntries(all.map(u=>[u.id,u])),allies=st.allies.map(id=>defs[id]).filter(Boolean);const m=st.mission?ms.find(x=>x.id===st.mission):null;const mission=m?battleMission(m):null;const enemies=mission?mission.enemies:st.enemies;
      const missing=[...enemies,...(mission?C.missionEnemyIds(mission):[])].filter(id=>!defs[id]);if(!allies.length){out.textContent='味方を選んでください。';return;}if(!enemies.length){out.textContent='敵または作戦を選んでください。';return;}if(missing.length){out.textContent='ユニットデータが足りません: '+[...new Set(missing)].join(', ');return;}
      run.disabled=true;out.textContent='計算中…';try{const r=await B.simulate({allies,enemies,mission,enemyDefs:defs,unitDefs:defs,trials:st.trials,seed:st.seed});out.textContent=simText(r);}catch(e){out.textContent='エラー: '+e.message;}finally{run.disabled=false;}},'flow-btn flow-primary');
    simArea.append(run,out);}
  function drawDmg(){dmgArea.replaceChildren();const all=units();if(!all.length){dmgArea.append(el('p','pro-help','ユニットがありません。'));return;}
    if(!all.some(u=>u.id===st.att))st.att=all[0].id;if(!all.some(u=>u.id===st.def))st.def=(all.find(u=>u.deploy.enemy)||all[0]).id;const att=all.find(u=>u.id===st.att),def=all.find(u=>u.id===st.def);if(!att.weapons.some(w=>w.name===st.weapon))st.weapon=att.weapons[0].name;
    const row=el('div','pro-fields');const sel=(label,choices,key,redraw)=>{const l=el('label','pro-field');l.append(el('span','pro-label',label));const s=el('select');s.setAttribute('aria-label',label);for(const [v,t] of choices){const o=el('option',undefined,t);o.value=v;s.append(o);}s.value=st[key];s.onchange=()=>{st[key]=s.value;if(redraw)drawDmg();else calc();};l.append(s);row.append(l);};
    sel('攻撃側',all.map(u=>[u.id,u.name]),'att',true);sel('武装',att.weapons.map(w=>[w.name,w.name]),'weapon');sel('防御側',all.map(u=>[u.id,u.name]),'def');sel('地形',Object.keys(C.TERRAINS).map(t=>[t,t]),'terrain');dmgArea.append(row);
    const out=el('pre','pro-output');dmgArea.append(out);function calc(){const a=all.find(u=>u.id===st.att),d=all.find(u=>u.id===st.def),w=a.weapons.find(x=>x.name===st.weapon)||a.weapons[0];const r=B.damagePreview(a,w,d,{terrain:st.terrain});out.textContent=dmgText(r,w,d);}calc();}
  drawSim();drawDmg();return {redraw(){drawSim();drawDmg();}};
}
function simText(r){return `試行 ${r.trials}回\n勝利 ${r.win} / 引き分け ${r.draw} / 敗北 ${r.lose}\n勝率 ${(r.winRate*100).toFixed(1)}%\nTURN 平均 ${r.meanTurns.toFixed(1)}（最短 ${r.minTurns} / 最長 ${r.maxTurns}）\n味方の平均被撃破数 ${r.allyDownsMean.toFixed(2)}\n\nユニット別\n${r.perUnit.map(p=>`・${p.name}: 平均与ダメ ${Math.round(p.meanDamage).toLocaleString()} / 撃破され率 ${(p.downRate*100).toFixed(0)}%`).join('\n')}`;}
function dmgText(r,w,d){return `命中率 ${(r.hitRate*100).toFixed(1)}%${r.terrainHit?`（地形 ${r.terrainHit>0?'+':''}${r.terrainHit}pt）`:''} / CRIT率 ${(r.critRate*100).toFixed(1)}%\n1HIT ${r.perHitMin}～${r.perHitMax}（平均 ${r.perHitAvg} / CRIT ${r.critHit}）\n1回の攻撃で平均 ${r.avgHits.toFixed(2)} HIT / 期待ダメージ ${r.expected}\n${d.name}（HP ${d.hp}）の撃破まで 約${Number.isFinite(r.actionsToKill)?r.actionsToKill:'∞'}回の攻撃\n武装: ${w.name}（${w.hitsMin===w.hitsMax?w.hitsMin:w.hitsMin+'～'+w.hitsMax}HIT / 威力${w.powerPct}% / 1HIT${w.hitPowerPct}%${w.defPiercePct?` / DEF貫通${w.defPiercePct}%`:''}）`;}
function validationErrors(fn,label){try{fn();return [];}catch(e){return [`${label}: ${e.message}`];}}
// ---- plain-language descriptions ----
const TRIGGER_TEXT={before_attack:'攻撃するとき',when_targeted:'攻撃されるとき',turn_start:'毎TURNのはじめに',turn_end:'毎TURNの終わりに',after_attack:'攻撃したあと',after_damaged:'ダメージを受けたあと',on_kill:'敵を倒したとき',battle_start:'戦闘開始時',on_evade:'攻撃をかわしたとき',on_crit:'クリティカルを出したとき',ally_down:'味方が倒されたとき',on_death:'倒されそうになったとき'};
const TARGET_TEXT={self:'自分',allies:'味方全体',weakest_ally:'HPが一番減っている味方',enemies:'敵全体',opponent:'相手',random_enemy:'ランダムな敵1体'};
const COND_TEXT={hp_below:c=>`自分のHPが${c.value}%以下なら`,hp_above:c=>`自分のHPが${c.value}%以上なら`,turn_ge:c=>`${c.value}TURN目以降なら`,turn_le:c=>`${c.value}TURN目までなら`,target_tag:c=>`相手が「${c.tag}」なら`,allies_le:c=>`生き残っている味方が${c.value}体以下なら`,enemies_le:c=>`生き残っている敵が${c.value}体以下なら`};
const STAT_NAME={atk:'ATK',def:'DEF',mob:'MOB（機動）',acc:'ACC（照準）'};
function describeSkill(s){
  if(!s)return '';const v=s.value,hostile=C.HOSTILE_EFFECTS.includes(s.effect),tgt=TARGET_TEXT[s.target||(hostile?'opponent':'self')];
  const buff=/^(atk|def|mob|acc)_(up|down)_pct$/.exec(s.effect);
  const body={damage_up_pct:`与えるダメージを${v}%上げる`,hit_up_pt:`命中率を${v}ポイント上げる`,crit_up_pt:`クリティカル率を${v}ポイント上げる`,enemy_hit_down_pt:`相手の命中率を${Math.abs(v)}ポイント下げる`,damage_reduce_pct:`受けるダメージを${Math.abs(v)}%減らす`,weapon_resist_pct:`${RESIST[s.resistType]||'指定'}${['melee','ranged'].includes(s.resistType)?'':'属性'}の攻撃から受けるダメージを${Math.abs(v)}%減らす`,
    heal_maxhp_pct:`${tgt}のHPを最大HPの${v}%回復する`,heal_flat:`${tgt}のHPを${v}回復する`,def_pierce_pct:`相手のDEFを${v}%無視する`,tag_damage_up_pct:`「${s.tag||'?'}」を持つ相手へのダメージを${v}%上げる`,guts:`HP${Math.max(1,v||1)}で踏みとどまる`,counter:`威力${v}%で反撃する`,shield:`${tgt}に${v}ダメージを防ぐバリアを張る`,extra_action:'もう一度行動する',taunt:`${tgt}が狙われやすくなる（+${v}%）`,stun:`${tgt}を行動不能にする`,burn:`${tgt}を炎上させる（毎TURN ${v}ダメージ）`}[s.effect]||(buff?`${tgt}の${STAT_NAME[buff[1]]}を${Math.abs(v)}%${buff[2]==='up'?'上げる':'下げる'}`:C.skillEffects[s.effect]||s.effect);
  const cond=s.cond&&COND_TEXT[s.cond.type]?COND_TEXT[s.cond.type](s.cond)+'、':'';
  const extras=[];if(C.DURATION_EFFECTS.includes(s.effect)){const d=s.duration||(s.effect==='stun'?1:2);extras.push(s.effect==='stun'?`${d}回`:d>=99?'戦闘終了まで':`${d}TURN`);}
  if(s.chance<100)extras.push(`発動率${s.chance}%`);if(s.maxUses>0)extras.push(`1戦闘${s.maxUses}回まで`);
  return `${TRIGGER_TEXT[s.trigger]||s.trigger}、${cond}${body}${extras.length?`（${extras.join('・')}）`:''}。`;
}
const STANDARD=Object.freeze({id:'standard',name:'標準歩兵',tags:['歩兵','生身'],hp:3000,atk:500,def:0,mob:500,acc:500,skills:[],weapons:[C.weapon(C.weaponDefaults)],deploy:{player:true,enemy:true}});
function describeWeapon(w,unit){try{const a=battleUnit(unit||STANDARD),ww=C.weapon(w),r=B.damagePreview(a,ww,STANDARD);const parts=[`【${B.weaponTypeLabel(ww)}】標準的な敵（HP3000）に命中率${Math.round(r.hitRate*100)}%、1回の攻撃で平均${r.expected}ダメージ（撃破まで約${Number.isFinite(r.actionsToKill)?r.actionsToKill:'∞'}回）`];if(ww.targetCount>1)parts.push(`最大${ww.targetCount}体を同時に攻撃`);if(ww.attackType==='melee')parts.push('近接（前衛がいる間は後衛に届かない）');if(ww.usesPerBattle)parts.push(`1戦闘${ww.usesPerBattle}回まで`);if(ww.cooldown)parts.push(`撃った後${ww.cooldown}TURN待つ`);if(ww.defPiercePct)parts.push(`DEFを${ww.defPiercePct}%無視`);for(const t of C.weaponEffectsText(ww))parts.push(t);return parts.join('。')+'。';}catch(e){return '武装の設定を確認してください: '+e.message;}}
// Strength relative to the standard infantry: damage per action × actions it survives.
function unitPower(u){return B.unitPower(battleUnit(u));}
// Square root of (damage × survival) keeps the scale intuitive: 2.0 ≈ worth two standard soldiers. (Formula lives in PROBattle 1.2.0.)
function powerRatio(u){return B.powerRatio(battleUnit(u));}
function starRating(u){let r=1;try{r=powerRatio(u);}catch(e){return {stars:0,ratio:0,text:'能力を確認してください'};}const stars=B.starCount(r);return {stars,ratio:r,text:`${'★'.repeat(stars)}${'☆'.repeat(5-stars)}（標準歩兵 約${r>=10?Math.round(r):r.toFixed(1)}体分の強さ・スキル除く）`};}
const RANKS=['E','D','C','B','A','S','SS'];
async function missionDifficulty(m,defs,squad,o={}){
  const mission=battleMission(m),ids=C.missionEnemyIds(mission),missing=ids.filter(id=>!defs[id]);if(!mission.enemies.length)return {ok:false,message:'敵編成が空です。'};if(missing.length)return {ok:false,message:'敵のデータが見つかりません: '+missing.join(', ')};
  const enemyPower=[...mission.enemies,...(mission.waves||[]).flatMap(w=>C.normalizeWave(w).enemies),...(mission.rules||[]).filter(r=>r.type==='reinforce').flatMap(r=>r.enemies)].reduce((s,id)=>s+powerRatio(defs[id]),0);
  const sq=squadFor(m,squad),allies=sq.allies,squadNote=sq.note;
  const r=await B.simulate({allies,enemies:mission.enemies,mission,enemyDefs:defs,unitDefs:defs,trials:o.trials||40,seed:o.seed||11});
  const rankIndex=Math.max(0,Math.min(RANKS.length-1,Math.floor(Math.log2(Math.max(1,enemyPower))*1.4)));
  const reward=Math.max(300,Math.round(enemyPower*350/100)*100);
  const label=r.winRate>=.9?'かんたん':r.winRate>=.6?'ふつう':r.winRate>=.3?'むずかしい':'とてもむずかしい';
  return {ok:true,winRate:r.winRate,meanTurns:r.meanTurns,label,rank:RANKS[rankIndex],reward,enemyPower,squadNote:`${squadNote}${allies.length}体で${r.trials}回計算`,text:`推定勝率 ${Math.round(r.winRate*100)}%（${label}）／ 平均 ${r.meanTurns.toFixed(1)}TURN ／ 敵の強さ合計 標準歩兵の約${enemyPower.toFixed(1)}体分 ／ おすすめ: RANK ${RANKS[rankIndex]}・報酬 ${reward.toLocaleString()}`};
}
// ---- 1.5.0: shared inputs for missions ----
function selectOf(list,value,label,placeholder='（選んでください）'){const s=el('select');s.setAttribute('aria-label',label);const opts2=[...(placeholder===null?[]:[['',placeholder]]),...list];if(value&&!list.some(([v])=>v===value))opts2.push([value,value+'（未読込）']);for(const [v,t] of opts2){const o=el('option',undefined,t);o.value=v;s.append(o);}s.value=value||(placeholder===null&&list[0]?list[0][0]:'');return s;}
// "名前（id）" labels from refsFrom → {id: 名前}
function labelNames(list){const out={};for(const [v,t] of list||[])out[v]=String(t).replace(/（[^（）]*）$/,'')||v;return out;}
// Full-width digits / minus signs (Japanese IME) become plain ASCII.
function normNum(v){return String(v??'').replace(/[０-９]/g,c=>String.fromCharCode(c.charCodeAt(0)-0xFEE0)).replace(/[－−ー‐―]/g,'-').replace(/[．。]/g,'.').replace(/[,，\s]/g,'');}
function allowsNegative(i){const m=(i.getAttribute?i.getAttribute('min'):null)??i.min;return m===null||m===undefined||m===''||Number(m)<0;}
// Phone number keyboards often have no "-": fields that accept negatives become decimal text inputs with a ± button.
function numberInput(i,onSet,parent){if(!i||i._proNum)return i;i._proNum=true;if(!allowsNegative(i))return i;
  i.type='text';i.setAttribute('inputmode','decimal');i.setAttribute('data-pro-num','1');i.setAttribute('autocomplete','off');
  const b=btn('±',()=>{let v=normNum(i.value);v=v.startsWith('-')?v.slice(1):'-'+v;i.value=v;if(onSet)onSet();else{for(const type of ['input','change']){if(typeof Event==='function'&&i.dispatchEvent)i.dispatchEvent(new Event(type,{bubbles:true}));else if(i['on'+type])i['on'+type]();}}},'pro-sign');
  b.setAttribute('aria-label','プラスとマイナスを切り替え');b.title='プラス／マイナスを切り替え';
  const p=i.parentNode;if(p&&typeof p.insertBefore==='function'){const w=el('span','pro-num');p.insertBefore(w,i);w.append(i,b);}else if(parent)parent.append(b);
  return i;}
const WIN_TYPES={annihilate:'殲滅（敵を全部倒す）',boss:'ボス撃破（決めた敵を倒す）',defense:'防衛（決めたTURNまで耐える）'};
const WAVE_WHEN={cleared:'前の敵がいなくなったら',turn:'決まったTURNになったら',remaining:'敵が残り少なくなったら',bossHp:'ボスのHPが減ったら'};
const WAVE_DEFAULT={turn:3,remaining:2,bossHp:50};
const WAVE_VALUE={turn:{label:'何TURN目に出る？（1～300）',min:1,max:300,help:'そのTURNの始めに出てきます。'},remaining:{label:'敵が残り何体以下で出る？（0～8）',min:0,max:8,help:'0なら、盤面の敵がいなくなったときに出ます。'},bossHp:{label:'ボスのHPが何%以下で出る？（1～99）',min:1,max:99,help:'勝ち方が「ボス撃破」のときに使えます。'}};
// Old form (plain ID array) when nothing new is used, so packs keep their older schema.
function compactWave(w){const enemies=[...(w.enemies||[])],rws=enemies.map((_,i)=>(w.rows||[])[i]==='back'?'back':'front'),back=rws.some(r=>r==='back'),when=w.when||'cleared';
  if(when==='cleared'&&!back&&!w.label)return enemies;const o={enemies,when};if(back)o.rows=rws;if(when!=='cleared')o.value=w.value??WAVE_DEFAULT[when];if(w.label)o.label=w.label;return o;}
// Front / back lanes. ids and rws are edited in place; onChange is called after each edit.
function formationBox(parent,ids,rws,list,onChange,o={}){const box=el('div','pro-formation');parent.append(box);const max=o.max||8;
  const sync=()=>{rws.length=ids.length;for(let i=0;i<ids.length;i++)rws[i]=rws[i]==='back'?'back':'front';};
  const nameOf=id=>{if(!list)return id;const hit=list.find(([v])=>v===id);return hit?String(hit[1]).replace(/（[^（）]*）$/,''):id+'（未読込）';};
  const commit=()=>{sync();onChange();draw();};
  function draw(){sync();box.replaceChildren();
    for(const [row,label,hint] of [['front','前衛','先に狙われます。近接攻撃が届きます。'],['back','後衛','前衛がいる間、近接攻撃は届きません。']]){
      const lane=el('div','pro-lane pro-lane-'+row),h=el('div','pro-lane-head');h.append(el('b',undefined,label),el('small','pro-help',hint));lane.append(h);let count=0;
      ids.forEach((id,i)=>{if(rws[i]!==row)return;count++;const chip=el('div','pro-chip');chip.append(el('span','pro-chip-name',`${i+1}. ${nameOf(id)}`));
        const sw=btn(row==='front'?'後衛へ':'前衛へ',()=>{rws[i]=row==='front'?'back':'front';commit();});sw.setAttribute('aria-label',`${nameOf(id)}を${row==='front'?'後衛':'前衛'}へ移す`);
        const up=btn('◀',()=>{[ids[i-1],ids[i]]=[ids[i],ids[i-1]];[rws[i-1],rws[i]]=[rws[i],rws[i-1]];commit();});up.disabled=i===0;up.setAttribute('aria-label','順番を前へ');
        const rm=btn('×',()=>{ids.splice(i,1);rws.splice(i,1);commit();},'flow-btn danger');rm.setAttribute('aria-label',nameOf(id)+'を外す');
        chip.append(sw,up,rm);lane.append(chip);});
      if(!count)lane.append(el('small','pro-help','（なし）'));box.append(lane);}
    const add=el('div','pro-row');let pick;if(list)pick=selectOf(list,'','追加する敵','追加する敵を選ぶ…');else{pick=el('input');pick.type='text';pick.placeholder='敵のユニットID';}
    const addTo=row=>{const v=String(pick.value||'').trim();if(!v||ids.length>=max)return;ids.push(v);rws.push(row);commit();};
    const bf=btn('＋ 前衛に追加',()=>addTo('front')),bb=btn('＋ 後衛に追加',()=>addTo('back'));bf.disabled=bb.disabled=ids.length>=max;add.append(pick,bf,bb);
    box.append(add,el('small','pro-help',`${ids.length}/${max}体。「◀」で順番、「前衛へ」「後衛へ」で隊列を変えます。`));if(!list)box.append(el('small','pro-help','※ユニットのデータを読み込むとリストから選べます。'));}
  draw();return {redraw:draw};}
function turnLimitOf(obj){return (obj.rules||[]).find(r=>r&&typeof r==='object'&&r.type==='turn_limit')?.value||0;}
function setTurnLimit(obj,v){const rules=Array.isArray(obj.rules)?obj.rules:(obj.rules=[]);const i=rules.findIndex(r=>r&&typeof r==='object'&&r.type==='turn_limit');if(v>=1){if(i>=0)rules[i].value=v;else rules.push({type:'turn_limit',value:v});}else if(i>=0)rules.splice(i,1);}
function bossCandidates(obj,names){const out=[];(obj.enemies||[]).forEach((id,i)=>out.push([`0:${i}`,`最初の敵 ${i+1}番目: ${names[id]||id}`]));(obj.waves||[]).forEach((w,wi)=>C.normalizeWave(w).enemies.forEach((id,i)=>out.push([`${wi+1}:${i}`,`第${wi+2}波 ${i+1}番目: ${names[id]||id}`])));return out;}
// Win condition (one) + add-on conditions (escort, turn limit) + the sentences the game shows.
function objectiveEditor(parent,obj,f,ctx){
  const box=el('fieldset','pro-group pro-objective');box.append(el('legend',undefined,f.label||'勝敗条件'));parent.append(box);if(f.help)box.append(el('small','pro-help',f.help));
  const cur=()=>obj.objective||{},typeOf=ob=>ob.type==='boss'||ob.type==='defense'?ob.type:'annihilate',type=typeOf(cur());
  const g=el('div','pro-fields');box.append(g);const field=(label,input,text)=>{const l=el('label','pro-field');l.append(el('span','pro-label',label),input);if(text)l.append(el('small','pro-help',text));g.append(l);return l;};
  const names=()=>labelNames(ctx.refList('units')||ctx.refList('enemies'));
  function write(patch){const ob=cur(),t=patch.type||typeOf(ob),esc=Object.hasOwn(patch,'escortUnitId')?patch.escortUnitId:ob.escortUnitId;let next=null;
    if(t==='boss'){next={type:'boss',bossIndex:patch.bossIndex??(ob.type==='boss'?ob.bossIndex||0:0)};const bw=patch.bossWave??(ob.type==='boss'?ob.bossWave||0:0);if(bw)next.bossWave=bw;}
    else if(t==='defense')next={type:'defense',turns:patch.turns??(ob.type==='defense'?ob.turns||10:10)};
    else if(esc)next={type:'escort'};else if(ob.type==='chain'&&(obj.waves||[]).length)next={type:'chain'};
    if(esc)next.escortUnitId=esc;if(next)obj.objective=next;else delete obj.objective;ctx.changed();}
  const st=selectOf(Object.entries(WIN_TYPES),type,'勝ち方',null);st.onchange=()=>{write({type:st.value});ctx.redraw();};field('勝ち方',st);
  if(type==='defense'){const i=el('input');i.type='number';i.min=1;i.max=300;i.step=1;i.value=cur().turns??10;i.oninput=()=>{const x=Math.round(Number(normNum(i.value)));if(x>=1&&x<=300)write({turns:x});};field('耐えるTURN数（1～300）',i,'このTURNの終わりまで耐えたら勝利。敵を全滅させても勝利です。');}
  if(type==='boss'){const sb=el('select');sb.setAttribute('aria-label','倒すボス');const fill=()=>{const ob=cur(),v=`${ob.bossWave||0}:${ob.bossIndex||0}`,list=bossCandidates(obj,names());sb.replaceChildren();if(!list.some(([x])=>x===v))list.push([v,'⚠ その位置に敵がいません（選び直してください）']);for(const [x,t] of list){const o=el('option',undefined,t);o.value=x;sb.append(o);}sb.value=v;};fill();sb.onfocus=fill;ctx.lives.push(fill);
    sb.onchange=()=>{const [w,i]=sb.value.split(':').map(Number);write({bossWave:w,bossIndex:i});};field('倒すボス',sb,'最初の敵か、追加ウェーブの敵から選びます。あとの波にいるボスは、出てくるまで倒せません。');}
  const units=ctx.refList('units');let se;if(units){se=selectOf(units,cur().escortUnitId||'','護衛するユニット','なし（護衛しない）');se.onchange=()=>write({escortUnitId:se.value||undefined});}else{se=el('input');se.type='text';se.placeholder='ユニットID（空欄=なし）';se.value=cur().escortUnitId||'';se.oninput=()=>write({escortUnitId:se.value.trim()||undefined});}
  field('追加条件: 護衛するユニット',se,'このユニットが味方の後衛に加わります。倒されたら敗北です。');
  const li=el('input');li.type='number';li.min=1;li.max=300;li.step=1;li.placeholder='なし';li.value=turnLimitOf(obj)||'';li.oninput=()=>{const v=normNum(li.value);const x=v===''?0:Math.round(Number(v));if(!Number.isFinite(x)||x>300)return;setTurnLimit(obj,x);ctx.changed();};li.onchange=()=>ctx.redraw();
  field('追加条件: TURN制限（空欄=なし、1～300）',li,'このTURNまでに勝てなければ敗北になります。');
  const conf=el('div','pro-conditions');box.append(el('b','pro-conditions-title','勝敗条件の確認（ゲームでの表示）'),conf);
  const show=()=>{let lines;try{const m={...obj,...C.missionExt(obj)};const c=C.missionConditions(m,names());lines=[c.win,c.lose,c.draw];}catch(e){lines=['⚠ '+(friendlyError(e.message).message||e.message)+'（'+e.message+'）'];}conf.replaceChildren(...lines.map(x=>el('div',undefined,x)));};show();ctx.lives.push(show);
}
// ---- terrains ----
function terrainOptions(packList,current){const names=new Set((packList||[]).map(t=>t.name)),out=[];for(const t of packList||[])out.push([t.name,`★ ${t.name}（${C.terrainEffectText(t)}）`]);for(const [n,mods] of Object.entries(C.TERRAINS))if(!names.has(n))out.push([n,`${n}（${C.terrainEffectText(mods)}）`]);if(current&&!out.some(([v])=>v===current))out.push([current,`${current}（未登録・効果なし）`]);return out;}
function terrainEffectOf(name,packList){const n=name||'標準',t=(packList||[]).find(x=>x.name===n)||C.TERRAINS[n];return t?C.terrainEffectText(t)+(t.desc?`。${t.desc}`:''):'未登録の地形です（効果なし）。「地形を追加・編集する」で作れます。';}
function uniqueTerrainName(list,base){if(!list.some(t=>t.name===base))return base;let i=2;while(list.some(t=>t.name===base+i))i++;return base+i;}
const TERRAIN_FIELDS=[{key:'name',label:'名前（作戦で選ぶときの名前）',type:'text',keep:true},{key:'desc',label:'説明（なくてもOK）',type:'text'},{key:'meleeHitPt',label:'近接の命中 pt（-100～100）',type:'number',min:-100,max:100},{key:'rangedHitPt',label:'射撃の命中 pt（-100～100）',type:'number',min:-100,max:100},{key:'mobPct',label:'MOB %（-90～200）',type:'number',min:-90,max:200},{key:'banTags',label:'出撃できないタグ（例: 生身）',type:'tags'}];
// Pack terrains: add / edit / duplicate / delete, or copy a built-in one. o.get() returns the editable array.
function terrainEditor(container,o){const box=el('section','pro-terrains');container.append(box);
  const check=err=>{try{C.terrainList(o.get());err.textContent='';err.className='pro-help';}catch(e){err.textContent='⚠ '+e.message;err.className='pro-issue bad';}};
  function draw(){box.replaceChildren();const list=o.get();
    box.append(el('p','pro-help','ここで作った地形は、このパックの作戦で選べます。組み込みと同じ名前にすると、このパックの作戦ではこちらの効果になります。命中・MOBはマイナスも入れられます（「±」で切り替え）。'));
    const err=el('div','pro-help');box.append(err);check(err);
    if(!list.length)box.append(el('small','pro-help','このパックの地形はまだありません。'));
    list.forEach((t,i)=>{const card=el('div','pro-list-item'),head=el('div','pro-list-head'),title=el('b',undefined,''),fx=el('div','pro-desc');const re=()=>{title.textContent='★ '+(t.name||'（名前なし）');fx.textContent='効果: '+C.terrainEffectText(t);};re();
      head.append(title,btn('複製',()=>{if(list.length>=50)return;list.splice(i+1,0,{...C.clone(t),name:uniqueTerrainName(list,t.name||'地形')});o.onChange();draw();}),btn('削除',()=>{if(root.confirm&&!root.confirm(`地形「${t.name}」を削除しますか？`))return;list.splice(i,1);o.onChange();draw();},'flow-btn danger'));
      card.append(head,fx);form(card,t,TERRAIN_FIELDS,()=>{re();check(err);o.onChange();});box.append(card);});
    const row=el('div','pro-row'),add=btn('＋ 新しい地形',()=>{if(list.length>=50)return;list.push({name:uniqueTerrainName(list,'新しい地形'),desc:''});o.onChange();draw();});add.disabled=list.length>=50;
    const s=selectOf(Object.entries(C.TERRAINS).map(([n,m])=>[n,`${n}（${C.terrainEffectText(m)}）`]),'','組み込みの地形をコピー','組み込みの地形をコピーして編集…');s.onchange=()=>{if(!s.value||list.length>=50)return;list.push({name:uniqueTerrainName(list,s.value),desc:'',...C.clone(C.TERRAINS[s.value])});o.onChange();draw();};
    row.append(add,s);box.append(row);}
  draw();return {redraw:draw};}
// ---- one test battle with a readable log ----
function squadFor(m,squad){let allies=(squad||[]).filter(Boolean),note='読み込んだ味方の上位';if(!allies.length){allies=Array.from({length:Math.min(4,m.maxDeploy||4)},(_,i)=>({...STANDARD,id:'standard_'+i,name:'標準歩兵'}));note='標準歩兵';}return {allies:allies.slice(0,Math.max(1,Math.min(8,m.maxDeploy||8))),note};}
const unhtml=h=>String(h).replace(/<[^>]+>/g,'').replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&quot;/g,'"').replace(/&#39;/g,"'").replace(/&amp;/g,'&');
function outcomeReason(ctx,m,r){const ob=m.objective||{},escort=ctx.allies.find(u=>u.escort);
  if(r.outcome==='win'){if(ob.type==='boss'){const b=C.bossOf(m),u=ctx.enemies.find(e=>e.key===b?.id&&!e.alive);return `ボス「${u?.name||b?.id||'?'}」を倒した`;}if(ob.type==='defense')return ctx.enemies.some(e=>e.alive)?`${ob.turns||10}TURN耐えきった`:'敵を全滅させた';return '敵をすべて倒した';}
  if(r.outcome==='lose'){if(escort&&!escort.alive)return `護衛対象「${escort.name}」が倒された`;if(!ctx.allies.some(u=>u.alive&&!u.escort))return '味方が全滅した';if(r.limit)return `${r.limit}TURNを過ぎた（TURN制限）`;return '敗北条件を満たした';}
  return `${r.turns}TURNで決着がつかなかった`;}
async function testBattle(m,defs,squad,o={}){
  const mission=battleMission(m),ids=C.missionEnemyIds(mission),missing=ids.filter(id=>!defs[id]);if(!mission.enemies.length)return {ok:false,message:'敵編成が空です。'};if(missing.length)return {ok:false,message:'敵のデータが見つかりません: '+missing.join(', ')};
  const esc=mission.objective?.escortUnitId;if(esc&&!defs[esc])return {ok:false,message:'護衛対象のユニットが見つかりません: '+esc};
  const {allies,note}=squadFor(m,squad),lines=[],rng=B.mulberry32(o.seed??(Date.now()%1000000));
  const ctx=B.buildBattle({allies,enemies:mission.enemies,mission,enemyDefs:defs,unitDefs:defs},rng);let lastTurn=-1;
  ctx.hooks.log=h=>{if(ctx.turn!==lastTurn){lastTurn=ctx.turn;if(ctx.turn)lines.push(`── ${ctx.turn}TURN ──`);}lines.push(unhtml(h));};
  const r=await B.runBattle(ctx,{maxTurns:o.maxTurns}),reason=outcomeReason(ctx,mission,r),label={win:'勝利',lose:'敗北',draw:'引き分け'}[r.outcome];
  const log=lines.length>400?[...lines.slice(0,300),`…（${lines.length-350}行省略）…`,...lines.slice(-50)]:lines;
  let cond=[];try{const c=C.missionConditions(mission,Object.fromEntries(Object.entries(defs).map(([k,d])=>[k,d.name||k])));cond=[c.win,c.lose,c.draw];}catch(e){}
  const head=[`結果: ${label}（${r.turns}TURN）— ${reason}`,`味方: ${note}（${allies.map(a=>a.name).join('・')}）`,...cond];
  return {ok:true,outcome:r.outcome,turns:r.turns,reason,log,text:[...head,'',...log].join('\n')};}
// Upgrade number inputs on maker pages (also ones built later from HTML strings) and normalize full-width input.
function upgradeNumbers(node){if(node&&node.querySelectorAll)for(const i of node.querySelectorAll('input[type="number"]'))numberInput(i);}
if(typeof document!=='undefined'&&typeof document.addEventListener==='function'&&typeof MutationObserver!=='undefined'){
  document.addEventListener('input',e=>{const t=e.target;if(t&&t._proNum&&t.type==='text'){const v=normNum(t.value);if(v!==t.value)t.value=v;}},true);
  const start=()=>{upgradeNumbers(document.body);new MutationObserver(ms=>{for(const m of ms)for(const n of m.addedNodes){if(n.nodeType!==1)continue;if(n.matches&&n.matches('input[type="number"]'))numberInput(n);else upgradeNumbers(n);}}).observe(document.body,{childList:true,subtree:true});};
  if(document.body)start();else document.addEventListener('DOMContentLoaded',start);}
// ---- friendly validation ----
const FRIENDLY=[
  [/IDは英数字|IDのIDは英数字|ID・名前が必要|IDが空|ID重複|IDが重複/,'IDに問題があります（空欄・重複・使えない文字）。','「IDを自動修正」ボタンを押すと、自動で付け直します。'],
  [/名前がありません|名前が空|表示名が空/,'名前が入っていません。','名前を入力してください。'],
  [/発動条件と効果の組み合わせ|組み合わせが未対応/,'スキルの「いつ発動する？」と「何が起きる？」の組み合わせが使えません。','「何が起きる？」を選び直してください（選べる効果だけが表示されます）。'],
  [/追加効果は|このタイミングでは使えない|タイミングは使用前|発動のきっかけ|効果対象が不正/,'武装の追加効果の設定が使えない組み合わせです。','追加効果の「タイミング」と「何が起きる？」を選び直してください（選べる効果だけが表示されます）。'],
  [/特効タグ/,'タグ特効スキルに対象のタグがありません。','「特効タグ」に「装甲車」などのタグを入れてください。'],
  [/敵ユニットが不足|敵出撃可能|敵として登場|敵使用/,'作戦の敵が見つからないか、「敵として登場」がOFFになっています。','ユニットの「敵として登場可」をONにするか、敵ユニットのデータを読み込んでください。'],
  [/ドロップアイテムが不足|ドロップアイテム「|アイテムJS未読込/,'ドロップに設定したアイテムが見つかりません。','同じパックにアイテムを作るか、アイテムJSを読み込んでください。'],
  [/護衛対象/,'護衛対象のユニットが見つかりません。','勝利条件の「護衛対象」をリストから選び直してください。'],
  [/効果は1～8個|効果は8個まで/,'アイテムの効果がありません（または多すぎます）。','効果を1～8個にしてください。装備品・キーアイテムなら効果なしでもOKです。'],
  [/ボスの出る波|ボス番号/,'ボスに指定した敵が見つかりません。','「勝敗条件」の「倒すボス」をリストから選び直してください。'],
  [/出現条件|出現TURN|残り体数|ボスHP%/,'追加ウェーブの「いつ出てくる？」の設定が正しくありません。','波の出現タイミングと数値（TURNは1～300、残り体数は0～8、ボスHPは1～99%）を確認してください。'],
  [/波の敵がいません|波が空です/,'敵のいない追加ウェーブがあります。','その波に敵を追加するか、波を削除してください。'],
  [/地形/,'地形の設定に問題があります。','名前の重複や、数値の範囲（命中は-100～100、MOBは-90～200%）を確認してください。'],
  [/数値が必要|で指定してください|以上にしてください/,'数値の範囲が正しくありません。','エラーに書かれた範囲の数値に直してください。'],
  [/敵編成が空|敵編成を1～8体/,'敵が1体もいません。','「敵編成」で敵を1～8体追加してください。'],
  [/追加ウェーブ/,'連戦なのに追加の敵（ウェーブ）がありません。','勝利条件を変えるか、追加ウェーブを設定してください。'],
  [/前提ノード|前提研究/,'「先に必要」に指定したものが見つかりません。','リストから選び直してください。'],
  [/画像/,'画像の形式が使えません。','PNG・JPEG・WebP・GIFの画像を選んでください。']
];
function friendlyError(msg){const m=String(msg||'');for(const [re,message,fix] of FRIENDLY)if(re.test(m))return {message,fix,detail:m};return {message:m,fix:'',detail:m};}
function issues(container,list,o={}){
  // Minimal DOMs without replaceChildren get a plain-text rendering.
  if(typeof container.replaceChildren!=='function'){const esc2=x=>String(x).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));container.innerHTML=list.length?list.map(it=>{const f=friendlyError(it.message);return esc2((it.level==='warn'?'⚠ ':'✕ ')+(it.where?it.where+'：':'')+f.message+(f.detail!==f.message?'（'+f.detail+'）':'')+(f.fix?' 直し方: '+f.fix:''));}).join('<br>'):esc2(o.okText||'✓ 問題はありません。書き出せます。');return;}
  container.replaceChildren();if(!list.length){container.append(el('div','pro-ok',o.okText||'✓ 問題はありません。書き出せます。'));return;}
  const errs=list.filter(x=>x.level!=='warn').length,warns=list.length-errs;
  container.append(el('div',errs?'pro-issue-head bad':'pro-issue-head warn',errs?`直す必要がある項目が${errs}件あります${warns?`（注意 ${warns}件）`:''}`:`書き出せます。ただし注意が${warns}件あります`));
  for(const it of list.slice(0,o.max||20)){const f=it.friendly===false?{message:it.message,fix:it.fix||''}:{...friendlyError(it.message),...(it.fix?{fix:it.fix}:{})};const row=el('div','pro-issue '+(it.level==='warn'?'warn':'bad'));row.append(el('b',undefined,(it.level==='warn'?'⚠ ':'✕ ')+(it.where?it.where+'：':'')+f.message));if(f.fix)row.append(el('div','pro-fix','直し方: '+f.fix));if(f.detail&&f.detail!==f.message)row.append(el('small','pro-detail',f.detail));if(it.go)row.append(btn('ここを直す',it.go,'flow-btn'));container.append(row);}
  if(list.length>(o.max||20))container.append(el('small','pro-detail',`ほか${list.length-(o.max||20)}件`));
}
// ---- guidance ----
function guide(container,key,title,steps){let closed=false;try{closed=localStorage.getItem('pro_guide_'+key)==='closed';}catch(e){}const box=el('section','pro-guide');if(closed){const open=btn('？ 使い方を見る',()=>{try{localStorage.removeItem('pro_guide_'+key);}catch(e){}box.replaceWith?box.replaceWith(guide(el('div'),key,title,steps)):null;},'flow-btn pro-guide-open');box.append(open);container.append(box);return box;}
  box.append(el('h3',undefined,title));const ol=el('ol');for(const s of steps)ol.append(el('li',undefined,s));box.append(ol,btn('わかった（閉じる）',()=>{try{localStorage.setItem('pro_guide_'+key,'closed');}catch(e){}box.replaceChildren();box.append(btn('？ 使い方を見る',()=>{try{localStorage.removeItem('pro_guide_'+key);}catch(e){}box.replaceChildren();guide(box,key,title,steps);},'flow-btn pro-guide-open'));}));container.append(box);return box;}
const AFTER={unit:'ゲームの「データ管理 → ユニットJSをインポート」で読み込むと、ユニットが使えます。',mission:'ゲームの「データ管理 → 作戦JSをインポート」で読み込みます。敵ユニットとドロップアイテムのJSも一緒に読み込んでください。',item:'ゲームの「データ管理 → アイテムJSをインポート」で読み込みます。作戦のドロップに使うときはMission Makerでも読み込んでください。',bundle:'ゲームの「データ管理 → 統合JSを読み込む」で1回読み込めば、ユニット・作戦・アイテムがまとめて使えます。'};
function afterExport(container,kind){if(!container)return;container.hidden=false;container.textContent='✓ 書き出しました。次は：'+AFTER[kind];container.className=(container.className||'')+' pro-after';}
function modeToggle(container,onChange){applyMode();const box=el('div','pro-mode');box.setAttribute('role','group');box.setAttribute('aria-label','表示モード');const make=(m,label)=>{const b=btn(label,()=>{setMode(m);draw();if(onChange)onChange(m);},'pro-mode-btn');return b;};function draw(){box.replaceChildren();for(const [m,label] of [['easy','かんたん'],['expert','詳細']]){const b=make(m,label);if(mode()===m)b.setAttribute('aria-pressed','true');else b.setAttribute('aria-pressed','false');box.append(b);}}draw();container.append(box);return box;}
// templatePicker: cards to choose a template, optional extra selects, a name box, then onPick(key, values, name).
function templatePicker(container,o){
  const box=el('section','pro-picker');box.append(el('h3',undefined,o.title||'テンプレートから作る'));if(o.lead)box.append(el('p','pro-help',o.lead));
  const state={key:o.templates[0]?.key,values:{}};for(const s of o.selects||[])state.values[s.key]=s.value??s.options[0]?.[0];
  const grid=el('div','pro-cards');box.append(grid);const cards=[];
  for(const t of o.templates){const c=btn('',()=>{state.key=t.key;for(const x of cards)x.setAttribute('aria-pressed',x._key===state.key?'true':'false');if(o.onSelect)o.onSelect(t.key);},'pro-card');c._key=t.key;c.append(el('b',undefined,t.label),el('small',undefined,t.desc||''));c.setAttribute('aria-pressed',t.key===state.key?'true':'false');cards.push(c);grid.append(c);}
  const row=el('div','pro-fields');for(const s of o.selects||[]){const l=el('label','pro-field');l.append(el('span','pro-label',s.label));const sel=el('select');sel.setAttribute('aria-label',s.label);for(const [v,t] of s.options){const op=el('option',undefined,t);op.value=v;sel.append(op);}sel.value=state.values[s.key];sel.onchange=()=>{state.values[s.key]=sel.value;};l.append(sel);row.append(l);}
  const nl=el('label','pro-field');nl.append(el('span','pro-label',o.nameLabel||'名前（空欄ならテンプレート名）'));const name=el('input');name.type='text';name.placeholder=o.namePlaceholder||'例: レイ';nl.append(name);row.append(nl);box.append(row);
  const act=el('div','pro-row');act.append(btn(o.createLabel||'この内容で作る',()=>o.onPick(state.key,state.values,name.value.trim()),'flow-btn flow-primary'));if(o.onCancel)act.append(btn('やめる',o.onCancel));if(o.onBlank)act.append(btn('白紙から作る（上級者向け）',o.onBlank));box.append(act);
  container.append(box);return box;
}
// ---- automatic ID repair: fixes empty, invalid and duplicate IDs and rewrites references ----
function autoId(prefix,existing){return root.PROTemplates?root.PROTemplates.autoId(prefix,existing):`${prefix}-${rid()}`;}
function fixIds(pack){
  const renamed=[],maps={units:{},missions:{},items:{},pilots:{},research:{}},prefix={units:'unit',missions:'mission',items:'item',pilots:'pilot',research:'research'};
  for(const kind of Object.keys(maps)){const rows=pack[kind];if(!Array.isArray(rows))continue;const seen=new Set();const valid=rows.filter(r=>C.safeId(r?.id)).map(r=>r.id);
    for(const r of rows){if(!r)continue;if(C.safeId(r.id)&&!seen.has(r.id)){seen.add(r.id);continue;}const old=r.id,id=autoId(prefix[kind],[...seen,...valid]);if(old!==undefined&&old!==''&&!seen.has(old))maps[kind][old]=id;r.id=id;seen.add(id);renamed.push({kind,from:old||'(空欄)',to:id,name:r.name});}}
  const mu=x=>maps.units[x]||x,mm=x=>maps.missions[x]||x,mi=x=>maps.items[x]||x,mr=x=>maps.research[x]||x,remapKeys=(o,f)=>o?Object.fromEntries(Object.entries(o).map(([k,v])=>[f(k),v])):o;
  for(const u of pack.units||[]){if(u.recruit?.missionId)u.recruit.missionId=mm(u.recruit.missionId);const sk=new Set();for(const s of u.skills||[]){if(!C.safeId(s.id)||sk.has(s.id)){const id=autoId('skill',[...sk]);renamed.push({kind:'skills',from:s.id||'(空欄)',to:id,name:s.name});s.id=id;}sk.add(s.id);}const nodes=new Set();for(const n of u.skillTree||[]){if(!C.safeId(n.id)||nodes.has(n.id))n.id=autoId('node',[...nodes]);nodes.add(n.id);}}
  for(const m of pack.missions||[]){if(m.enemies)m.enemies=m.enemies.map(mu);if(m.waves)m.waves=m.waves.map(w=>Array.isArray(w)?w.map(mu):{...w,enemies:(w.enemies||[]).map(mu)});for(const r of m.rules||[])if(r&&r.type==='reinforce')r.enemies=(r.enemies||[]).map(mu);if(m.objective?.escortUnitId)m.objective.escortUnitId=mu(m.objective.escortUnitId);if(m.requires){if(m.requires.missions)m.requires.missions=m.requires.missions.map(mm);if(m.requires.items)m.requires.items=m.requires.items.map(mi);}for(const d of m.drops||[])d.itemId=mi(d.itemId);}
  for(const i of pack.items||[]){for(const e of i.effects||(i.effect?[i.effect]:[])){if(e?.type==='recruit_unit')e.unitId=mu(e.unitId);if(e?.type==='loot_box')for(const r of e.table||[])r.itemId=mi(r.itemId);}if(i.shop){if(i.shop.requiresResearch)i.shop.requiresResearch=mr(i.shop.requiresResearch);if(i.shop.requiresMission)i.shop.requiresMission=mm(i.shop.requiresMission);}}
  for(const r of pack.research||[]){r.requires=(r.requires||[]).map(mr);if(r.cost?.items)r.cost.items=remapKeys(r.cost.items,mi);if(r.unlock){r.unlock.units=(r.unlock.units||[]).map(mu);r.unlock.items=(r.unlock.items||[]).map(mi);if(r.unlock.grantItems)r.unlock.grantItems=remapKeys(r.unlock.grantItems,mi);}}
  return renamed;
}
// Reference lists for pickers built from whatever data a maker has loaded.
function refsFrom(src){const label=x=>`${x.name||x.id}（${x.id}）`;return (kind,obj)=>{const units=src.units?.()||[],missions=src.missions?.()||[],items=src.items?.()||[],research=src.research?.()||[];
  switch(kind){case 'units':return units.map(u=>[u.id,label(u)]);case 'enemies':return units.filter(u=>u.deploy?.enemy).map(u=>[u.id,label(u)]);case 'players':return units.filter(u=>u.deploy?.player!==false).map(u=>[u.id,label(u)]);case 'lockedUnits':{const l=units.filter(u=>u.recruit?.locked);return (l.length?l:units.filter(u=>u.deploy?.player!==false)).map(u=>[u.id,label(u)]);}
  case 'missions':return missions.map(m=>[m.id,label(m)]);case 'items':return items.map(i=>[i.id,label(i)]);case 'keyItems':{const k=items.filter(i=>i.key);return (k.length?k:items).map(i=>[i.id,label(i)]);}case 'pricedItems':{const p=items.filter(i=>i.price);return (p.length?p:items).map(i=>[i.id,label(i)]);}
  case 'research':return research.map(r=>[r.id,label(r)]);case 'nodes':{const nodes=src.nodes?.()||[];return nodes.filter(n=>n.id!==obj?.id).map(n=>[n.id,`${n.skill?.name||n.id}（${n.id}）`]);}}return null;};}
root.PROEditor=Object.freeze({version:'1.7.0',tagInput,freshIds,duplicateOf,hireFields,newHire,hiddenField,dropRateInput,numberInput,normNum,selectOf,labelNames,formationBox,compactWave,objectiveEditor,terrainOptions,terrainEffectOf,terrainEditor,TERRAIN_FIELDS,testBattle,squadFor,WIN_TYPES,WAVE_WHEN,weaponEffectFields,WEAPON_EFFECT_PRESETS,mode,setMode,applyMode,modeToggle,describeSkill,describeWeapon,unitPower,powerRatio,starRating,missionDifficulty,friendlyError,issues,guide,afterExport,templatePicker,autoId,fixIds,refsFrom,STANDARD,el,btn,form,skillFields,skillExtFields,weaponFields,weaponExtFields,unitExtFields,pilotFields,missionExtFields,itemExtFields,researchFields,effectFields,effectDefaults,NEW_EFFECTS,newSkill,newWeapon,newPilot,newResearch,pick,UNIT_EXT_KEYS,SKILL_EXT_KEYS,WEAPON_EXT_KEYS,MISSION_EXT_KEYS,ITEM_EXT_KEYS,battleUnit,battleMission,tools,simText,dmgText,validationErrors});
})(window);
