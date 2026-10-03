/* PRO maker editor 1.1.0 — schema-driven forms, easy/expert mode, reference pickers, plain-language
 * descriptions, strength and difficulty estimates, friendly validation, simulator and damage calculator.
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
const BLOCK_TYPES=['list','object','lines','textarea','json','skill','statmap','days','counts','idlines','image','typedRules','refcounts'];
const MODE_KEY='pro_maker_mode';
function mode(){try{return localStorage.getItem(MODE_KEY)==='expert'?'expert':'easy';}catch(e){return 'easy';}}
function applyMode(){const b=document.body;if(b&&b.classList){b.classList.toggle('mode-easy',mode()==='easy');b.classList.toggle('mode-expert',mode()==='expert');}}
function setMode(m){try{localStorage.setItem(MODE_KEY,m==='expert'?'expert':'easy');}catch(e){}applyMode();}
function newSkill(){return {id:'skill_'+rid(),name:'新しいスキル',trigger:'before_attack',effect:'damage_up_pct',value:10,chance:100,maxUses:0,note:''};}
function newWeapon(){return C.clone(C.weaponDefaults);}

// form(container, obj, fields, onChange) renders editable fields bound to obj. Empty optional values are removed
// so packs that never use a 1.9 field keep their older schema number.
function form(container,obj,fields,onChange,opts={}){
  const host=el('div','pro-form');container.append(host);
  const changed=()=>{if(onChange)onChange(obj);};
  function redraw(){host.replaceChildren();draw();}
  function draw(){const grid=el('div','pro-fields');host.append(grid);const easy=mode()==='easy';let adv=null,advGrid=null;for(const f of fields){if(f.show&&!f.show(obj))continue;const block=BLOCK_TYPES.includes(f.type)||f.wide;let target=block?host:grid;if(f.advanced&&easy){if(!adv){adv=el('details','pro-advanced');adv.append(el('summary',undefined,'詳細設定を開く'));advGrid=el('div','pro-fields');adv.append(advGrid);host.append(adv);}target=block?adv:advGrid;}renderField(target,f);}}
  const refList=kind=>{try{return opts.refs?opts.refs(kind,obj)||null:null;}catch(e){return null;}};
  function refSelect(list,value,label,placeholder='（選んでください）'){const s=el('select');s.setAttribute('aria-label',label);const opts2=[['',placeholder],...list];if(value&&!list.some(([v])=>v===value))opts2.push([value,value+'（未読込）']);for(const [v,t] of opts2){const o=el('option',undefined,t);o.value=v;s.append(o);}s.value=value||'';return s;}
  function wrap(parent,f){const l=el('label','pro-field');l.append(el('span','pro-label',f.label||f.key));parent.append(l);return l;}
  function help(l,f){if(f.help)l.append(el('small','pro-help',f.help));}
  function after(f){changed();if(f.rerender)redraw();}
  function renderField(parent,f){
    const k=f.key;
    switch(f.type){
    case 'select':{const l=wrap(parent,f),s=el('select');s.setAttribute('aria-label',f.label||k);const opts=[...(f.empty!==undefined?[['',f.empty]]:[]),...Object.entries(choicesOf(f,obj)||{})];for(const [v,t] of opts){const o=el('option',undefined,t);o.value=v;s.append(o);}s.value=obj[k]??'';s.onchange=()=>{if(s.value===''&&f.empty!==undefined)delete obj[k];else obj[k]=s.value;if(f.onSet)f.onSet(obj);after(f);};l.append(s);help(l,f);return;}
    case 'check':{const l=el('label','pro-check'),x=el('input');x.type='checkbox';x.checked=!!obj[k];x.onchange=()=>{if(x.checked)obj[k]=true;else delete obj[k];after(f);};l.append(x,el('span',undefined,f.label));parent.append(l);help(l,f);return;}
    case 'number':{const l=wrap(parent,f),i=el('input');i.type='number';i.step=f.step||'any';if(f.min!==undefined)i.min=f.min;if(f.max!==undefined)i.max=f.max;if(f.placeholder)i.placeholder=f.placeholder;i.value=obj[k]??'';const set=()=>{if(i.value===''){if(f.keep)obj[k]=0;else delete obj[k];}else obj[k]=Number(i.value);changed();};i.oninput=set;i.onchange=()=>{set();if(f.rerender)redraw();};l.append(i);help(l,f);return;}
    case 'tags':case 'ids':case 'rowlist':{const l=wrap(parent,f),i=el('input');i.type='text';i.placeholder=f.placeholder||(f.type==='rowlist'?'front, back, front':'カンマ区切り');i.value=(obj[k]||[]).join(', ');i.oninput=()=>{setVal(obj,k,splitList(i.value),f.keepEmptyArray);changed();};l.append(i);help(l,f);return;}
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
    case 'list':{
      const box=el('fieldset','pro-group pro-list');box.append(el('legend',undefined,f.label));parent.append(box);help(box,f);const arr=Array.isArray(obj[k])?obj[k]:[];
      arr.forEach((item,i)=>{const row=el('div','pro-list-item'),head=el('div','pro-list-head');head.append(el('b',undefined,f.itemLabel?f.itemLabel(item,i):`${i+1}`));
        const up=btn('↑',()=>{[arr[i-1],arr[i]]=[arr[i],arr[i-1]];redraw();changed();});up.disabled=i===0;up.setAttribute('aria-label','上へ');
        const down=btn('↓',()=>{[arr[i+1],arr[i]]=[arr[i],arr[i+1]];redraw();changed();});down.disabled=i===arr.length-1;down.setAttribute('aria-label','下へ');
        head.append(up,down,btn('削除',()=>{arr.splice(i,1);if(!arr.length)delete obj[k];redraw();changed();},'flow-btn danger'));row.append(head);
        if(f.itemType==='skill')form(row,item,skillFields(),()=>changed(),opts);else form(row,item,typeof f.fields==='function'?f.fields(item):f.fields,()=>changed(),opts);box.append(row);});
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
const RESIST={physical:'物理',beam:'ビーム',special:'特殊',melee:'近接',ranged:'射撃'};
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
  {key:'resistType',label:'耐性対象',type:'select',choices:RESIST,show:o=>o.effect==='weapon_resist_pct'},
  {key:'value',label:'効果の大きさ',type:'number',keep:true},{key:'chance',label:'発動率 %',type:'number',min:0,max:100,keep:true},
  ...skillExtFields(),
  {key:'maxUses',label:'1戦闘の発動回数（0=無制限）',type:'number',min:0,keep:true,advanced:true},
  {key:'id',label:'スキルID',type:'text',advanced:true},{key:'note',label:'メモ',type:'text',advanced:true}
];}
function weaponExtFields(){return [
  {key:'usesPerBattle',label:'1戦闘の使用回数（空欄=無制限）',type:'number',min:0,max:99,advanced:true},
  {key:'cooldown',label:'使用後に待つTURN数（空欄=なし）',type:'number',min:0,max:99,advanced:true},
  {key:'defPiercePct',label:'DEF貫通 %',type:'number',min:0,max:100,advanced:true},
  {key:'fxColor',label:'演出色（#RRGGBB）',type:'text',placeholder:'#ffaa33',advanced:true}
];}
function weaponFields(){return [
  {key:'name',label:'武装名',type:'text',keep:true},{key:'attackType',label:'攻撃方式',type:'select',choices:{melee:'近接',ranged:'射撃'}},{key:'damageType',label:'属性',type:'select',choices:{physical:'物理',beam:'ビーム',special:'特殊'}},
  ...[['powerPct','威力 %'],['accuracyPt','命中補正 pt'],['critPt','CRIT補正 pt'],['targetCount','対象数'],['weight','抽選ウェイト'],['minDamage','最低ダメージ'],['hitsMin','最小HIT'],['hitsMax','最大HIT'],['hitPowerPct','1HIT威力 %']].map(([key,label])=>({key,label,type:'number',keep:true,advanced:true})),
  ...weaponExtFields(),{key:'note',label:'メモ',type:'text',advanced:true}
];}
function unitExtFields(){return [
  {key:'image',label:'ユニット画像（128px程度に縮小して埋め込みます）',type:'image'},
  {key:'row',label:'標準の隊列',type:'select',empty:'前衛（標準）',choices:{back:'後衛'},help:'前衛は狙われやすく、後衛は前衛がいる間は近接攻撃を受けません。'},
  {key:'recruit',label:'加入条件',type:'object',emptyWhen:o=>!o.locked,fields:[{key:'locked',label:'最初は部隊にいない（作戦クリア・アイテム・研究で加入）',type:'check',rerender:true},{key:'missionId',label:'この作戦をクリアすると加入（任意）',type:'ref',ref:'missions',empty:'（作戦クリアでは加入しない）',show:o=>o.locked},{key:'note',label:'加入条件のメモ',type:'text',show:o=>o.locked,advanced:true}]},
  {key:'skillTree',label:'スキルツリー（レベルアップで得るSPで解放）',type:'list',max:32,addLabel:'白紙のノードを追加',presets:(T()?.skills||[]).map(t=>({label:`${t.label}：${t.desc}`,make:(o,a)=>{const n=T().makeTreeNode(t.key,(a||[]).map(x=>x.id));n.cost=Math.min(3,1+Math.floor(a.length/2));n.minLevel=1+a.length*2;return n;}})),itemLabel:(n,i)=>`ノード${i+1}: ${n.skill?.name||''}`,factory:()=>({id:'node_'+rid(),cost:1,minLevel:1,requires:[],skill:newSkill()}),fields:[{key:'cost',label:'必要SP',type:'number',min:0,keep:true},{key:'minLevel',label:'必要レベル',type:'number',min:1,keep:true},{key:'requires',label:'先に解放が必要なノード',type:'ref',ref:'nodes',multi:true,keepEmptyArray:true},{key:'skill',label:'習得スキル',type:'skill'},{key:'id',label:'ノードID',type:'text',advanced:true}]},
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
function ruleFields(type){if(type==='turn_limit')return [{key:'value',label:'このTURNまでに勝てなければ敗北',type:'number',min:1,max:99,keep:true}];if(type==='reinforce')return [{key:'turn',label:'出現TURN',type:'number',min:1,max:99,keep:true},{key:'enemies',label:'援軍の敵',type:'ref',ref:'enemies',multi:true,ordered:true,keepEmptyArray:true}];return [{key:'allTags',label:'全員がすべて持つタグ',type:'tags'},{key:'anyTags',label:'全員がどれか1つ持つタグ',type:'tags'},{key:'noneTags',label:'持っていると出撃不可のタグ',type:'tags'}];}
function missionExtFields(){return [
  {key:'objective',label:'勝利条件',type:'object',emptyWhen:o=>!o.type,fields:[{key:'type',label:'種類',type:'select',empty:'殲滅（敵を全員倒す）',choices:{boss:C.objectives.boss,defense:C.objectives.defense,escort:C.objectives.escort,chain:C.objectives.chain},rerender:true},{key:'turns',label:'耐えるTURN数',type:'number',min:1,max:99,show:o=>o.type==='defense'},{key:'bossIndex',label:'ボスの番号（敵編成の1番目=0）',type:'number',min:0,max:7,show:o=>o.type==='boss'},{key:'escortUnitId',label:'護衛対象のユニット',type:'ref',ref:'units',show:o=>o.type==='escort'}]},
  {key:'waves',label:'追加ウェーブ（連戦）: 1行が1ウェーブ、敵IDをカンマ区切り',type:'idlines',advanced:true},
  {key:'rules',label:'戦闘ルール（TURN制限・援軍・出撃タグ制限）',type:'typedRules'},
  {key:'requires',label:'出撃条件',type:'object',fields:[{key:'missions',label:'先にクリアが必要な作戦',type:'ref',ref:'missions',multi:true},{key:'items',label:'持っている必要があるキーアイテム',type:'ref',ref:'keyItems',multi:true},{key:'minLevel',label:'出撃ユニットの必要レベル',type:'number',min:1,max:99}]},
  {key:'story',label:'ストーリー（1行に「話者: セリフ」）',type:'object',fields:[{key:'before',label:'作戦前',type:'lines'},{key:'after',label:'勝利後',type:'lines'}]},
  {key:'stars',label:'星条件（最大3つ。なしなら「勝利／被撃破なし／10TURN以内」）',type:'list',max:3,addLabel:'星条件を追加',advanced:true,factory:()=>({type:'clear'}),fields:[{key:'type',label:'条件',type:'select',choices:C.starTypes,rerender:true},{key:'value',label:'値',type:'number',min:1,max:100,show:o=>['turns_le','hp_ge'].includes(o.type),keep:true}]},
  {key:'days',label:'出撃できる曜日（全部オフ=毎日）',type:'days',advanced:true},
  {key:'enemyRows',label:'敵の隊列: 敵編成の順に front / back（例: front, front, back）',type:'rowlist',advanced:true},
  {key:'terrainMods',label:'地形補正の上書き（空欄なら地形の標準値）',type:'object',advanced:true,fields:[{key:'meleeHitPt',label:'近接命中 pt',type:'number'},{key:'rangedHitPt',label:'射撃命中 pt',type:'number'},{key:'mobPct',label:'MOB %',type:'number'},{key:'banTags',label:'出撃禁止タグ',type:'tags'}]},
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
  {key:'unlock',label:'完了時の効果',type:'object',fields:[{key:'units',label:'加入させるユニット',type:'ref',ref:'lockedUnits',multi:true},{key:'items',label:'ショップに並べるアイテム',type:'ref',ref:'pricedItems',multi:true},{key:'grantItems',label:'支給アイテム',type:'refcounts',ref:'items'}]},
  {key:'id',label:'研究ID',type:'text',advanced:true}
];}
function newResearch(){return {id:'research_'+rid(),name:'新しい研究',desc:'',cost:{credits:1000},requires:[],unlock:{}};}
const NEW_EFFECTS=['add_tag','remove_tag','sortie_buff','loot_box','remove_skill','remove_weapon','recruit_unit','exp_gain','skill_point'];
function effectDefaults(type){switch(type){case 'add_tag':return {type,tag:'改造'};case 'remove_tag':return {type,tag:'生身'};case 'sortie_buff':return {type,stat:'atk',value:20};case 'loot_box':return {type,table:[{itemId:'item-0001',weight:1,min:1,max:1}]};case 'remove_skill':case 'remove_weapon':return {type};case 'recruit_unit':return {type,unitId:'unit-0001'};case 'exp_gain':return {type,value:100};case 'skill_point':return {type,value:1};}return null;}
function effectFields(type){switch(type){
  case 'add_tag':case 'remove_tag':return [{key:'tag',label:'タグ',type:'text',keep:true}];
  case 'sortie_buff':return [{key:'stat',label:'対象能力',type:'select',choices:{atk:'ATK',def:'DEF',mob:'MOB',acc:'ACC'}},{key:'value',label:'上昇率 %（次の出撃だけ）',type:'number',min:1,max:500,keep:true}];
  case 'loot_box':return [{key:'table',label:'中身（重みの比率で1つ選ばれる）',type:'list',max:32,addLabel:'中身を追加',factory:()=>({itemId:'',weight:1,min:1,max:1}),itemLabel:(r,i)=>`${i+1}: ${r.itemId||''}`,fields:[{key:'itemId',label:'アイテム',type:'ref',ref:'items',keep:true},{key:'weight',label:'出やすさ（重み）',type:'number',min:.01,keep:true},{key:'min',label:'最小個数',type:'number',min:1,keep:true},{key:'max',label:'最大個数',type:'number',min:1,keep:true}]}];
  case 'remove_skill':return [{key:'skillId',label:'外すスキルID（空欄=アイテムで習得したスキルをすべて）',type:'text'}];
  case 'remove_weapon':return [{key:'name',label:'外す武装名（空欄=アイテムで追加した武装をすべて）',type:'text'}];
  case 'recruit_unit':return [{key:'unitId',label:'加入するユニット（加入条件付きのユニット）',type:'ref',ref:'lockedUnits',keep:true}];
  case 'exp_gain':return [{key:'value',label:'経験値',type:'number',min:1,keep:true}];
  case 'skill_point':return [{key:'value',label:'スキルポイント',type:'number',min:1,keep:true}];}return [];}

// Lenient extraction for maker drafts: keep 1.9 fields even when not yet valid so the user can fix them.
const UNIT_EXT_KEYS=['image','ai','row','growth','exp','skillTree','recruit'],SKILL_EXT_KEYS=['cond','target','duration','tag'],WEAPON_EXT_KEYS=['usesPerBattle','cooldown','defPiercePct','fxColor'],MISSION_EXT_KEYS=['enemyRows','objective','waves','terrainMods','requires','story','stars','starReward','days','exp'],ITEM_EXT_KEYS=['price','limitPerUnit','scope','equip','key','shop'];
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
  const body={damage_up_pct:`与えるダメージを${v}%上げる`,hit_up_pt:`命中率を${v}ポイント上げる`,crit_up_pt:`クリティカル率を${v}ポイント上げる`,enemy_hit_down_pt:`相手の命中率を${Math.abs(v)}ポイント下げる`,damage_reduce_pct:`受けるダメージを${Math.abs(v)}%減らす`,weapon_resist_pct:`${RESIST[s.resistType]||'指定'}の攻撃から受けるダメージを${Math.abs(v)}%減らす`,
    heal_maxhp_pct:`${tgt}のHPを最大HPの${v}%回復する`,heal_flat:`${tgt}のHPを${v}回復する`,def_pierce_pct:`相手のDEFを${v}%無視する`,tag_damage_up_pct:`「${s.tag||'?'}」を持つ相手へのダメージを${v}%上げる`,guts:`HP${Math.max(1,v||1)}で踏みとどまる`,counter:`威力${v}%で反撃する`,shield:`${tgt}に${v}ダメージを防ぐバリアを張る`,extra_action:'もう一度行動する',taunt:`${tgt}が狙われやすくなる（+${v}%）`,stun:`${tgt}を行動不能にする`,burn:`${tgt}を炎上させる（毎TURN ${v}ダメージ）`}[s.effect]||(buff?`${tgt}の${STAT_NAME[buff[1]]}を${Math.abs(v)}%${buff[2]==='up'?'上げる':'下げる'}`:C.skillEffects[s.effect]||s.effect);
  const cond=s.cond&&COND_TEXT[s.cond.type]?COND_TEXT[s.cond.type](s.cond)+'、':'';
  const extras=[];if(C.DURATION_EFFECTS.includes(s.effect)){const d=s.duration||(s.effect==='stun'?1:2);extras.push(s.effect==='stun'?`${d}回`:d>=99?'戦闘終了まで':`${d}TURN`);}
  if(s.chance<100)extras.push(`発動率${s.chance}%`);if(s.maxUses>0)extras.push(`1戦闘${s.maxUses}回まで`);
  return `${TRIGGER_TEXT[s.trigger]||s.trigger}、${cond}${body}${extras.length?`（${extras.join('・')}）`:''}。`;
}
const STANDARD=Object.freeze({id:'standard',name:'標準歩兵',tags:['歩兵','生身'],hp:3000,atk:500,def:0,mob:500,acc:500,skills:[],weapons:[C.weapon(C.weaponDefaults)],deploy:{player:true,enemy:true}});
function describeWeapon(w,unit){try{const a=battleUnit(unit||STANDARD),ww=C.weapon(w),r=B.damagePreview(a,ww,STANDARD);const parts=[`標準的な敵（HP3000）に命中率${Math.round(r.hitRate*100)}%、1回の攻撃で平均${r.expected}ダメージ（撃破まで約${Number.isFinite(r.actionsToKill)?r.actionsToKill:'∞'}回）`];if(ww.targetCount>1)parts.push(`最大${ww.targetCount}体を同時に攻撃`);if(ww.attackType==='melee')parts.push('近接（前衛がいる間は後衛に届かない）');if(ww.usesPerBattle)parts.push(`1戦闘${ww.usesPerBattle}回まで`);if(ww.cooldown)parts.push(`撃った後${ww.cooldown}TURN待つ`);if(ww.defPiercePct)parts.push(`DEFを${ww.defPiercePct}%無視`);return parts.join('。')+'。';}catch(e){return '武装の設定を確認してください: '+e.message;}}
// Strength relative to the standard infantry: damage per action × actions it survives.
function unitPower(u){
  const a=battleUnit(u);const ws=a.weapons,total=ws.reduce((s,w)=>s+Math.max(.01,w.weight),0);
  let dmg=0;for(const w of ws)dmg+=B.damagePreview(a,w,STANDARD).expected*Math.min(w.targetCount,3)*(Math.max(.01,w.weight)/total);
  const taken=Math.max(1,B.damagePreview(STANDARD,STANDARD.weapons[0],a).expected);
  return dmg*(a.hp/taken);
}
let STD_POWER=0;
// Square root of (damage × survival) keeps the scale intuitive: 2.0 ≈ worth two standard soldiers.
function powerRatio(u){if(!STD_POWER)STD_POWER=unitPower(STANDARD);return Math.sqrt(unitPower(u)/STD_POWER);}
function starRating(u){let r=1;try{r=powerRatio(u);}catch(e){return {stars:0,ratio:0,text:'能力を確認してください'};}const stars=r<.75?1:r<.95?2:r<1.3?3:r<2.5?4:5;return {stars,ratio:r,text:`${'★'.repeat(stars)}${'☆'.repeat(5-stars)}（標準歩兵 約${r>=10?Math.round(r):r.toFixed(1)}体分の強さ・スキル除く）`};}
const RANKS=['E','D','C','B','A','S','SS'];
async function missionDifficulty(m,defs,squad,o={}){
  const mission=battleMission(m),ids=C.missionEnemyIds(mission),missing=ids.filter(id=>!defs[id]);if(!mission.enemies.length)return {ok:false,message:'敵編成が空です。'};if(missing.length)return {ok:false,message:'敵のデータが見つかりません: '+missing.join(', ')};
  const enemyPower=[...mission.enemies,...(mission.waves||[]).flat(),...(mission.rules||[]).filter(r=>r.type==='reinforce').flatMap(r=>r.enemies)].reduce((s,id)=>s+powerRatio(defs[id]),0);
  let allies=(squad||[]).filter(Boolean);let squadNote='読み込んだ味方の上位';if(!allies.length){allies=Array.from({length:Math.min(4,m.maxDeploy||4)},(_,i)=>({...STANDARD,id:'standard_'+i,name:'標準歩兵'}));squadNote='標準歩兵';}
  allies=allies.slice(0,Math.max(1,Math.min(8,m.maxDeploy||8)));
  const r=await B.simulate({allies,enemies:mission.enemies,mission,enemyDefs:defs,unitDefs:defs,trials:o.trials||40,seed:o.seed||11});
  const rankIndex=Math.max(0,Math.min(RANKS.length-1,Math.floor(Math.log2(Math.max(1,enemyPower))*1.4)));
  const reward=Math.max(300,Math.round(enemyPower*350/100)*100);
  const label=r.winRate>=.9?'かんたん':r.winRate>=.6?'ふつう':r.winRate>=.3?'むずかしい':'とてもむずかしい';
  return {ok:true,winRate:r.winRate,meanTurns:r.meanTurns,label,rank:RANKS[rankIndex],reward,enemyPower,squadNote:`${squadNote}${allies.length}体で${r.trials}回計算`,text:`推定勝率 ${Math.round(r.winRate*100)}%（${label}）／ 平均 ${r.meanTurns.toFixed(1)}TURN ／ 敵の強さ合計 標準歩兵の約${enemyPower.toFixed(1)}体分 ／ おすすめ: RANK ${RANKS[rankIndex]}・報酬 ${reward.toLocaleString()}`};
}
// ---- friendly validation ----
const FRIENDLY=[
  [/IDは英数字|IDのIDは英数字|ID・名前が必要|IDが空|ID重複|IDが重複/,'IDに問題があります（空欄・重複・使えない文字）。','「IDを自動修正」ボタンを押すと、自動で付け直します。'],
  [/名前がありません|名前が空|表示名が空/,'名前が入っていません。','名前を入力してください。'],
  [/発動条件と効果の組み合わせ|組み合わせが未対応/,'スキルの「いつ発動する？」と「何が起きる？」の組み合わせが使えません。','「何が起きる？」を選び直してください（選べる効果だけが表示されます）。'],
  [/特効タグ/,'タグ特効スキルに対象のタグがありません。','「特効タグ」に「装甲車」などのタグを入れてください。'],
  [/敵ユニットが不足|敵出撃可能|敵として登場|敵使用/,'作戦の敵が見つからないか、「敵として登場」がOFFになっています。','ユニットの「敵として登場可」をONにするか、敵ユニットのデータを読み込んでください。'],
  [/ドロップアイテムが不足|ドロップアイテム「|アイテムJS未読込/,'ドロップに設定したアイテムが見つかりません。','同じパックにアイテムを作るか、アイテムJSを読み込んでください。'],
  [/護衛対象/,'護衛対象のユニットが見つかりません。','勝利条件の「護衛対象」をリストから選び直してください。'],
  [/効果は1～8個|効果は8個まで/,'アイテムの効果がありません（または多すぎます）。','効果を1～8個にしてください。装備品・キーアイテムなら効果なしでもOKです。'],
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
  for(const m of pack.missions||[]){if(m.enemies)m.enemies=m.enemies.map(mu);if(m.waves)m.waves=m.waves.map(w=>w.map(mu));for(const r of m.rules||[])if(r&&r.type==='reinforce')r.enemies=(r.enemies||[]).map(mu);if(m.objective?.escortUnitId)m.objective.escortUnitId=mu(m.objective.escortUnitId);if(m.requires){if(m.requires.missions)m.requires.missions=m.requires.missions.map(mm);if(m.requires.items)m.requires.items=m.requires.items.map(mi);}for(const d of m.drops||[])d.itemId=mi(d.itemId);}
  for(const i of pack.items||[]){for(const e of i.effects||(i.effect?[i.effect]:[])){if(e?.type==='recruit_unit')e.unitId=mu(e.unitId);if(e?.type==='loot_box')for(const r of e.table||[])r.itemId=mi(r.itemId);}if(i.shop){if(i.shop.requiresResearch)i.shop.requiresResearch=mr(i.shop.requiresResearch);if(i.shop.requiresMission)i.shop.requiresMission=mm(i.shop.requiresMission);}}
  for(const r of pack.research||[]){r.requires=(r.requires||[]).map(mr);if(r.cost?.items)r.cost.items=remapKeys(r.cost.items,mi);if(r.unlock){r.unlock.units=(r.unlock.units||[]).map(mu);r.unlock.items=(r.unlock.items||[]).map(mi);if(r.unlock.grantItems)r.unlock.grantItems=remapKeys(r.unlock.grantItems,mi);}}
  return renamed;
}
// Reference lists for pickers built from whatever data a maker has loaded.
function refsFrom(src){const label=x=>`${x.name||x.id}（${x.id}）`;return (kind,obj)=>{const units=src.units?.()||[],missions=src.missions?.()||[],items=src.items?.()||[],research=src.research?.()||[];
  switch(kind){case 'units':return units.map(u=>[u.id,label(u)]);case 'enemies':return units.filter(u=>u.deploy?.enemy).map(u=>[u.id,label(u)]);case 'players':return units.filter(u=>u.deploy?.player!==false).map(u=>[u.id,label(u)]);case 'lockedUnits':{const l=units.filter(u=>u.recruit?.locked);return (l.length?l:units.filter(u=>u.deploy?.player!==false)).map(u=>[u.id,label(u)]);}
  case 'missions':return missions.map(m=>[m.id,label(m)]);case 'items':return items.map(i=>[i.id,label(i)]);case 'keyItems':{const k=items.filter(i=>i.key);return (k.length?k:items).map(i=>[i.id,label(i)]);}case 'pricedItems':{const p=items.filter(i=>i.price);return (p.length?p:items).map(i=>[i.id,label(i)]);}
  case 'research':return research.map(r=>[r.id,label(r)]);case 'nodes':{const nodes=src.nodes?.()||[];return nodes.filter(n=>n.id!==obj?.id).map(n=>[n.id,`${n.skill?.name||n.id}（${n.id}）`]);}}return null;};}
root.PROEditor=Object.freeze({version:'1.1.0',mode,setMode,applyMode,modeToggle,describeSkill,describeWeapon,unitPower,powerRatio,starRating,missionDifficulty,friendlyError,issues,guide,afterExport,templatePicker,autoId,fixIds,refsFrom,STANDARD,el,btn,form,skillFields,skillExtFields,weaponFields,weaponExtFields,unitExtFields,pilotFields,missionExtFields,itemExtFields,researchFields,effectFields,effectDefaults,NEW_EFFECTS,newSkill,newWeapon,newPilot,newResearch,pick,UNIT_EXT_KEYS,SKILL_EXT_KEYS,WEAPON_EXT_KEYS,MISSION_EXT_KEYS,ITEM_EXT_KEYS,battleUnit,battleMission,tools,simText,dmgText,validationErrors});
})(window);
