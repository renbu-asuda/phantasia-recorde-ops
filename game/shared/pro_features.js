/* PRO 1.15 authoring, dependency and history helpers. No network and no eval. */
(function(root){'use strict';
const C=root.PROCore,clone=C.clone;
const KINDS=['units','missions','items','research','hires','weapons','skills'];
function usage(pack,kind,id){
 const key=kind==='skills'?'skillId':'weaponId',listKey=key+'s',out=[];
 const walk=(x,path,owner)=>{if(!x||typeof x!=='object')return;
  if(x[key]===id||Array.isArray(x[listKey])&&x[listKey].includes(id))out.push({kind:owner.kind,id:owner.id,name:owner.name,path});
  for(const [k,v] of Object.entries(x))if(v&&typeof v==='object')walk(v,path+'/'+k,owner);
 };
 for(const k of KINDS)for(const x of pack[k]||[])if(k!==kind)walk(x,k+'/'+x.id,{kind:k,id:x.id,name:x.name||x.id});return out;
}
function replaceRef(pack,kind,from,to,owner){
 const key=kind==='skills'?'skillId':'weaponId',listKey=key+'s';
 const walk=x=>{if(!x||typeof x!=='object')return;if(x[key]===from)x[key]=to;if(Array.isArray(x[listKey]))x[listKey]=x[listKey].map(v=>v===from?to:v);for(const v of Object.values(x))if(v&&typeof v==='object')walk(v);};
 if(owner)walk(owner);else for(const k of KINDS)if(k!==kind)for(const x of pack[k]||[])walk(x);
}
function diff(before,after){
 const out=[];
 for(const k of KINDS){const a=new Map((before?.[k]||[]).map(x=>[x.id,x])),b=new Map((after?.[k]||[]).map(x=>[x.id,x]));
  for(const [id,x] of b){const old=a.get(id);if(!old)out.push({kind:k,id,name:x.name||id,type:'add',fields:[]});else if(JSON.stringify(old)!==JSON.stringify(x)){const fields=[...new Set([...Object.keys(old),...Object.keys(x)])].filter(f=>JSON.stringify(old[f])!==JSON.stringify(x[f])).map(f=>({key:f,before:old[f],after:x[f]}));out.push({kind:k,id,name:x.name||id,type:'change',fields});}}
  for(const [id,x] of a)if(!b.has(id))out.push({kind:k,id,name:x.name||id,type:'remove',fields:[]});
 }return out;
}
function diffText(before,after){const rows=diff(before,after);return rows.length?rows.map(x=>`${{add:'追加',change:'変更',remove:'削除'}[x.type]} ${x.kind} / ${x.name}${x.fields.length?'\n'+x.fields.map(f=>'  '+f.key+': '+JSON.stringify(f.before)+' → '+JSON.stringify(f.after)).join('\n'):''}`).join('\n'):'変更なし';}
function history(initial,max=40){let rows=[JSON.stringify(initial)],at=0,lastTime=0;return {
 record(value){const next=JSON.stringify(value);if(rows[at]===next)return;const now=Date.now();rows=rows.slice(0,at+1);if(now-lastTime<600&&at>0)rows[at]=next;else{rows.push(next);if(rows.length>max)rows.shift();at=rows.length-1;}lastTime=now;},
 undo(){if(at===0)return null;lastTime=0;return JSON.parse(rows[--at]);},redo(){if(at>=rows.length-1)return null;lastTime=0;return JSON.parse(rows[++at]);},
 get canUndo(){return at>0;},get canRedo(){return at<rows.length-1;},boundary(){lastTime=0;}
 };}
function bulk(pack,kind,ids,operation,value){
 const next=clone(pack),rows=(next[kind]||[]).filter(x=>ids.includes(x.id));if(!rows.length)throw Error('対象を選んでください');
 if(operation==='tag'){const tag=String(value).trim();C.tagList([tag]);for(const x of rows)x.tags=C.tagList([...new Set([...(x.tags||[]),tag])]);}
 else{if(kind!=='units'||!C.STAT_KEYS.includes(operation))throw Error('能力一括変更はユニットで使います');const rate=Number(value);if(!Number.isFinite(rate)||rate<0||rate>1000)throw Error('倍率は0～1000%です');for(const x of rows){const n=Math.round(Number(x[operation])*rate/100);if(!Number.isFinite(n)||n<(operation==='hp'?1:0)||n>1000000)throw Error(x.name+': 能力の範囲を超えます');x[operation]=n;}}
 return next;
}
function graph(pack){
 const nodes=[],edges=[];const add=(k,x)=>nodes.push({key:k+':'+x.id,kind:k,id:x.id,name:x.name||x.id});
 for(const k of ['missions','items','research','units','hires'])for(const x of pack[k]||[])add(k,x);
 const edge=(kind,id,to,why)=>edges.push({from:kind+':'+id,to,why});
 for(const m of pack.missions||[]){const to='missions:'+m.id;for(const id of m.requires?.missions||[])edge('missions',id,to,'クリア');for(const id of m.requires?.items||[])edge('items',id,to,'所持');for(const d of m.drops||[])if(C.dropChance(d)>0)edge('missions',m.id,'items:'+d.itemId,'ドロップ');}
 for(const r of pack.research||[]){const to='research:'+r.id;for(const id of r.requires||[])edge('research',id,to,'研究完了');for(const id of Object.keys(r.cost?.items||{}))edge('items',id,to,'素材');for(const id of r.unlock?.units||[])edge('research',r.id,'units:'+id,'加入');for(const id of [...(r.unlock?.items||[]),...Object.keys(r.unlock?.grantItems||{})])edge('research',r.id,'items:'+id,'解放/支給');}
 for(const u of pack.units||[])if(u.recruit?.missionId)edge('missions',u.recruit.missionId,'units:'+u.id,'加入');
 for(const h of pack.hires||[]){const to='hires:'+h.id;for(const k of ['missions','research','items'])for(const id of h.requires?.[k]||[])edge(k,id,to,'雇用条件');edge('hires',h.id,'units:'+h.unitId,'雇用');}
 for(const i of pack.items||[]){if(i.shop?.requiresMission)edge('missions',i.shop.requiresMission,'items:'+i.id,'販売解放');if(i.shop?.requiresResearch)edge('research',i.shop.requiresResearch,'items:'+i.id,'販売解放');}
 // Branch flags connect choices/events/results to the missions they unlock.
 const flagNodes=new Set();const flagKey=(id,value)=>'flags:'+id+'='+value;
 const flags=(values,from,to,why)=>{for(const [id,value] of Object.entries(values||{})){const key=flagKey(id,value);if(!flagNodes.has(key)){flagNodes.add(key);nodes.push({key,kind:'flags',id,name:id+'='+value});}if(from)edges.push({from,to:key,why});if(to)edges.push({from:key,to,why:'分岐条件'});}};
 for(const m of pack.missions||[]){const key='missions:'+m.id;flags(m.requires?.flags,null,key);for(const c of m.story?.choices||[])flags(c.flags,key,null,'選択');for(const e of m.events||[])flags(e.flags,key,null,'イベント');for(const [outcome,map] of Object.entries(m.resultFlags||{}))flags(map,key,null,{win:'勝利',lose:'敗北',draw:'引分'}[outcome]);}
 const keys=new Set(nodes.map(n=>n.key)),warnings=[];for(const e of edges)if(!keys.has(e.from)||!keys.has(e.to))warnings.push('外部参照: '+e.from+' → '+e.to);
 const visiting=new Set(),done=new Set(),cycles=new Set();const visit=(key,path=[])=>{if(visiting.has(key)){cycles.add([...path.slice(path.indexOf(key)),key].join(' → '));return;}if(done.has(key))return;visiting.add(key);for(const e of edges.filter(e=>e.from===key))visit(e.to,[...path,key]);visiting.delete(key);done.add(key);};for(const n of nodes)visit(n.key);
 for(const c of cycles)warnings.push('循環候補（別の入手経路があれば成立）: '+c);
 // Conservative reachability: external-pack paths and flags are unknown, never export blockers.
 const reached=new Set([...flagNodes].filter(k=>k.endsWith('=false')));for(const i of pack.items||[])if(i.initial||i.price>0&&!i.shop?.requiresMission&&!i.shop?.requiresResearch)reached.add('items:'+i.id);
 for(const u of pack.units||[])if(!u.recruit?.locked)reached.add('units:'+u.id);
 let changed=true;while(changed){changed=false;const mark=k=>{if(!reached.has(k)){reached.add(k);changed=true;}};
  for(const m of pack.missions||[])if((m.requires?.missions||[]).every(id=>reached.has('missions:'+id))&&(m.requires?.items||[]).every(id=>reached.has('items:'+id))&&Object.entries(m.requires?.flags||{}).every(([id,v])=>reached.has(flagKey(id,v))))mark('missions:'+m.id);
  for(const r of pack.research||[])if((r.requires||[]).every(id=>reached.has('research:'+id))&&Object.keys(r.cost?.items||{}).every(id=>reached.has('items:'+id)))mark('research:'+r.id);
  for(const e of edges)if(reached.has(e.from)&&['ドロップ','解放/支給','販売解放','加入','雇用','選択','イベント','勝利','敗北','引分'].includes(e.why))mark(e.to);
 }
 for(const n of nodes)if(['missions','research'].includes(n.kind)&&!reached.has(n.key))warnings.push('パック内だけでは到達未確認: '+n.name);
 return {nodes,edges,warnings:[...new Set(warnings)]};
}
function packAudit(incoming,loaded,state={}){
 const warnings=[];const ids=new Set(loaded.map(p=>p.packId));for(const id of incoming.dependencies||[])if(!ids.has(id)&&id!==incoming.packId)warnings.push('必要パック未読込: '+id);
 for(const p of loaded)if(p.packId!==incoming.packId)for(const k of KINDS){const own=new Set((incoming[k]||[]).map(x=>x.id));for(const x of p[k]||[])if(own.has(x.id))warnings.push(`${k} / ${x.name||x.id}: ${p.packName||p.packId} とID競合`);}
 const old=loaded.find(p=>p.packId===incoming.packId);if(old)for(const x of diff(old,incoming).filter(x=>x.type==='remove')){if(x.kind==='units'&&(state.roster||[]).some(r=>r.base===x.id)||x.kind==='items'&&(state.items?.[x.id]>0||Object.values(state.equip||{}).some(a=>a.includes(x.id))))warnings.push('使用中データの削除: '+x.kind+' / '+x.name);}
 return {warnings,diff:diffText(old||{},incoming)};
}
function materialSources(missions,itemId){return missions.flatMap(m=>(m.drops||[]).filter(d=>d.itemId===itemId).map(d=>({mission:m,chance:C.dropChance(d),expected:C.dropChance(d)*((d.min??1)+(d.max??1))/2})));}

// ---- 1.15.1: flag dictionary, where flags are set / needed, warnings, and plain-language summaries ----
let flagSource=null,nameResolver=id=>id;
function setFlagSource(src){flagSource=src||null;}function getFlagSource(){return flagSource;}
function setNameResolver(fn){nameResolver=typeof fn==='function'?fn:(id=>id);}
const nameOf=id=>{try{return nameResolver(id)||id;}catch(e){return id;}};
// Every place a mission sets or requires a flag. mode 'set' = this place makes the flag true/false, 'need' = the sortie needs this value.
function flagSites(pack){
 const out=[],add=(map,mode,m,where,step)=>{for(const [id,value] of Object.entries(map||{}))out.push({id,value,mode,missionId:m.id,missionName:m.name||m.id,where,step});};
 for(const m of pack.missions||[]){
  for(const e of m.events||[])add(e.flags,'set',m,'イベント「'+(e.id||'')+'」',3);
  for(const c of m.story?.choices||[])add(c.flags,'set',m,'選択肢「'+(c.text||'')+'」',3);
  for(const [k,label] of [['win','勝利したとき'],['lose','敗北したとき'],['draw','引き分けたとき']])add(m.resultFlags?.[k],'set',m,label,3);
  add(m.requires?.flags,'need',m,'出撃条件',3);
 }
 return out;
}
const flagKey=id=>String(id).toLowerCase().replace(/[-_]/g,'');
function lev1(a,b){if(a===b)return true;if(Math.abs(a.length-b.length)>1)return false;let i=0;while(i<a.length&&i<b.length&&a[i]===b[i])i++;if(a.length===b.length)return a.slice(i+1)===b.slice(i+1);return a.length>b.length?a.slice(i+1)===b.slice(i):b.slice(i+1)===a.slice(i);}
// Pairs of different IDs that look like the same flag spelled twice (case, - and _ differences, or one wrong letter).
// A one-character difference that is a digit or a short last word (route_a / route_b, stage1 / stage2) is a deliberate choice, not a typo.
function deliberateVariant(a,b){const ta=a.split(/[-_]/),tb=b.split(/[-_]/);if(ta.length===tb.length){const d=ta.map((x,i)=>[x,tb[i]]).filter(([x,y])=>x!==y);if(d.length===1&&d[0][0].length<=2&&d[0][1].length<=2)return true;}if(a.length===b.length){let k=0;while(a[k]===b[k])k++;if(/\d/.test(a[k])&&/\d/.test(b[k])&&a.slice(k+1)===b.slice(k+1))return true;}return false;}
function similarFlags(ids){const list=[...new Set(ids)].sort(),out=[];for(let i=0;i<list.length;i++)for(let j=i+1;j<list.length;j++){const a=list[i],b=list[j];if(flagKey(a)===flagKey(b)||(Math.min(a.length,b.length)>=5&&lev1(a,b)&&!deliberateVariant(a,b)))out.push([a,b]);}return out;}
function flagReport(pack){
 const notes=pack.flagNotes||{},sites=flagSites(pack),ids=[...new Set([...Object.keys(notes),...sites.map(x=>x.id)])].sort();
 const rows=ids.map(id=>{const sets=sites.filter(x=>x.id===id&&x.mode==='set'),needs=sites.filter(x=>x.id===id&&x.mode==='need'),note=notes[id],issues=[];
  if(needs.some(x=>x.value===true)&&!sets.some(x=>x.value===true))issues.push({level:'warn',text:'出撃条件で「成立」が必要ですが、成立させる場所がありません（ほかのパックで成立させる場合は問題ありません）'});
  if(sets.length&&!needs.length)issues.push({level:'info',text:'成立させていますが、出撃条件で使っている場所がありません'});
  if(!sets.length&&!needs.length&&note)issues.push({level:'info',text:'辞書にありますが、どこでも使われていません'});
  if(!note)issues.push({level:'info',text:'辞書に未登録です（登録すると名前と説明を付けられます）'});
  return {id,name:note?.name||'',desc:note?.desc||'',registered:!!note,sets,needs,issues};});
 const similar=similarFlags(ids);for(const [a,b] of similar)for(const id of [a,b])rows.find(r=>r.id===id).issues.unshift({level:'warn',text:'「'+(id===a?b:a)+'」と似ています。同じフラグのつづり違い（タイプミス）ではありませんか？'});
 return {rows,similar,warnings:rows.flatMap(r=>r.issues.filter(i=>i.level==='warn').map(i=>({id:r.id,text:r.id+': '+i.text})))};
}
function flagLabel(pack,id){const n=pack?.flagNotes?.[id]?.name;return n?n+'（'+id+'）':id;}
// Rename a flag everywhere it is used (events, choices, results, sortie conditions) and in the dictionary.
function renameFlag(pack,from,to,merge=false){
 if(!C.safeId(to))throw Error('IDは英数字・_・-で指定してください');if(from===to)return 0;
 const exists=(pack.flagNotes&&Object.hasOwn(pack.flagNotes,to))||flagSites(pack).some(x=>x.id===to);if(exists&&!merge)throw Error('「'+to+'」は既に使われています');
 let n=0;const ren=map=>{if(!map||!Object.hasOwn(map,from))return;const v=map[from],entries=Object.entries(map).map(([k,x])=>k===from?[to,v]:[k,x]);for(const k of Object.keys(map))delete map[k];for(const [k,x] of entries)map[k]=x;n++;};
 for(const m of pack.missions||[]){for(const e of m.events||[])ren(e.flags);for(const c of m.story?.choices||[])ren(c.flags);for(const k of ['win','lose','draw'])ren(m.resultFlags?.[k]);ren(m.requires?.flags);}
 if(pack.flagNotes&&Object.hasOwn(pack.flagNotes,from)){const note=pack.flagNotes[from];delete pack.flagNotes[from];if(!Object.hasOwn(pack.flagNotes,to))pack.flagNotes[to]=note;}
 return n;
}
function setFlagNote(pack,id,note){if(!C.safeId(id))throw Error('IDは英数字・_・-で指定してください');pack.flagNotes||={};const name=String(note?.name||'').trim().slice(0,40),desc=String(note?.desc||'').trim().slice(0,200);pack.flagNotes[id]={...(name?{name}:{}),...(desc?{desc}:{})};}
function deleteFlagNote(pack,id){if(pack.flagNotes){delete pack.flagNotes[id];if(!Object.keys(pack.flagNotes).length)delete pack.flagNotes;}}
// Plain-language summaries used as titles in the maker, so creators can check what they set without reading the data.
const flagText=(flags,pack)=>Object.entries(flags||{}).map(([id,v])=>flagLabel(pack,id)+'を'+(v?'成立':'不成立')).join('・');
function describePhase(p,pack){const parts=[],st=Object.entries(p.stats||{}).map(([k,v])=>k.toUpperCase()+' '+v);if(st.length)parts.push('能力を '+st.join('・')+' に');
 parts.push({ratio:'HPは割合を維持',keep:'HPは現在値を維持',value:'HPを '+p.hpValue+' に'}[p.hpMode||'ratio']||'HPは割合を維持');
 if(p.weaponIds)parts.push('武装を'+p.weaponIds.length+'個に切り替え');if(p.skillIds)parts.push(p.skillIds.length?'スキルを'+p.skillIds.length+'個に切り替え':'スキルを外す');if(p.ai?.target)parts.push('狙い方を変更');if(p.lines?.length)parts.push('会話'+p.lines.length+'行');
 let cond='条件未設定';try{if(p.cond)cond=C.conditionText(p.cond);}catch(e){}return cond+'になったとき（一戦闘に一度）: '+parts.join('、');}
function describeEvent(e,pack){const when={turn:'TURN'+(e.value??'?')+'に達したとき',wave:'第'+(e.value??'?')+'波が登場したとき',boss_hp:'ボスのHPが'+(e.value??'?')+'%以下になったとき',unit_down:'「'+nameOf(e.unitId||'')+'」が撃破されたとき'}[e.when]||'条件未設定';
 const acts=[];if(e.lines?.length)acts.push('会話'+e.lines.length+'行');if(e.terrain)acts.push('地形を「'+e.terrain+'」に変更');const f=flagText(e.flags,pack);if(f)acts.push(f);
 return (e.requiredUnitId?'「'+nameOf(e.requiredUnitId)+'」が出撃しているとき限定で、':'')+when+': '+(acts.join('、')||'何も起きません（会話・地形・フラグのどれかを設定してください）');}
function describeChoice(c,pack){const acts=[];const f=flagText(c.flags,pack);if(f)acts.push(f);if(c.lines?.length)acts.push('選択後の会話'+c.lines.length+'行');return '選択肢「'+(c.text||'')+'」: '+(acts.join('、')||'フラグも会話もありません');}
function describeResultFlags(r,pack){const out=[];for(const [k,l] of [['win','勝利'],['lose','敗北'],['draw','引き分け']])if(r?.[k]&&Object.keys(r[k]).length)out.push(l+': '+flagText(r[k],pack));return out.join(' ／ ');}
function describeRequires(req,pack){return flagText(req?.flags,pack).replace(/成立/g,'成立している').replace(/不成立/g,'不成立').replace(/・/g,'、');}
// Ready-made starting points. make(parent, list) returns a fresh object; flag IDs used here are registered in the dictionary when one is open.
const rid=()=>Math.random().toString(36).slice(2,8);
function registerSample(id,name,desc){if(flagSource?.register)try{flagSource.register(id,name,desc);}catch(e){}return id;}
const templates={
 phases:[
  {label:'HP半分以下で覚醒（ATKが1.5倍）',make:u=>({id:'phase_'+rid(),name:'覚醒',cond:{type:'hp_below',value:50},hpMode:'ratio',stats:{atk:Math.round((Number(u?.atk)||250)*1.5)},lines:[{speaker:'',text:'力が解放された！'}]})},
  {label:'HP30%以下で防御形態（DEFが2倍・MOBが半分）',make:u=>({id:'phase_'+rid(),name:'防御形態',cond:{type:'hp_below',value:30},hpMode:'ratio',stats:{def:Math.max(100,(Number(u?.def)||0)*2),mob:Math.round((Number(u?.mob)||500)/2)}})},
  {label:'5TURN目に第二形態（ATK・MOBが1.3倍）',make:u=>({id:'phase_'+rid(),name:'第二形態',cond:{type:'turn_ge',value:5},hpMode:'ratio',stats:{atk:Math.round((Number(u?.atk)||250)*1.3),mob:Math.round((Number(u?.mob)||500)*1.3)}})}],
 events:[
  {label:'3TURN目に会話が入る',make:()=>({id:'event_'+rid(),when:'turn',value:3,lines:[{speaker:'隊長',text:'敵の増援が来る！ 気を引き締めろ！'}]})},
  {label:'ボスのHPが半分以下で会話＋フラグ「ボス弱体」',make:()=>({id:'event_'+rid(),when:'boss_hp',value:50,lines:[{speaker:'ボス',text:'ここまでやるとはな…'}],flags:{[registerSample('boss_weak','ボス弱体','ボスのHPが半分を切った')]:true}})},
  {label:'敵ユニットの撃破でフラグを立てる',make:m=>({id:'event_'+rid(),when:'unit_down',unitId:(m?.enemies||[])[0]||'',flags:{[registerSample('enemy_down','要の敵を撃破','指定した敵を倒した')]:true}})},
  {label:'第2波が来たら地形が変わる',make:()=>({id:'event_'+rid(),when:'wave',value:2,terrain:'標準',lines:[{speaker:'',text:'戦場の様子が変わった。'}]})}],
 choices:[
  {label:'作戦前の選択肢「強行突破する」',make:()=>({text:'強行突破する',flags:{[registerSample('route_assault','強行突破を選んだ','作戦前の選択で強行突破を選んだ')]:true},lines:[{speaker:'隊長',text:'正面から行くぞ。'}]})},
  {label:'作戦前の選択肢「迂回する」',make:()=>({text:'迂回する',flags:{[registerSample('route_detour','迂回を選んだ','作戦前の選択で迂回を選んだ')]:true},lines:[{speaker:'隊長',text:'裏から回り込む。'}]})}]
};

// Creator hints: things that save fine but probably do not do what the creator meant. Output is never blocked by them.
function authoringHints(pack){
 const out=[],hint=(kind,id,name,step,text,tag)=>out.push({kind,id,name,step,text,tag});
 const unitIds=new Set((pack.units||[]).map(u=>u.id));
 for(const m of pack.missions||[]){
  const nm=m.name||m.id;
  const boss=m.objective?.type==='boss'||!!m.objective?.bossWave;
  for(const e of m.events||[]){const lbl='イベント「'+(e.id||'')+'」';
   if(!e.lines?.length&&!e.terrain&&!Object.keys(e.flags||{}).length)hint('missions',m.id,nm,3,lbl+'は、会話・地形変更・フラグのどれも設定されておらず、何も起きません','event');
   if(e.when==='unit_down'&&!e.unitId)hint('missions',m.id,nm,3,lbl+'は「撃破を検知するユニット」が未設定です','event');
   if(e.when==='unit_down'&&e.unitId&&!unitIds.has(e.unitId))hint('missions',m.id,nm,3,lbl+'の撃破ユニット「'+e.unitId+'」がこのパックにありません（ほかのパックのユニットなら問題ありません）','event');
   if(e.requiredUnitId&&!unitIds.has(e.requiredUnitId))hint('missions',m.id,nm,3,lbl+'の「出撃している場合だけ」のユニット「'+e.requiredUnitId+'」がこのパックにありません','event');
   if(e.when==='boss_hp'&&!boss)hint('missions',m.id,nm,3,lbl+'は「ボスのHP」で発生しますが、この作戦の勝利条件にボスが設定されていないため、発生しません','event');
   if(e.when==='wave'&&!(m.waves||[]).length)hint('missions',m.id,nm,3,lbl+'は「第n波」で発生しますが、この作戦に追加ウェーブがありません','event');}
  for(const c of m.story?.choices||[])if(!Object.keys(c.flags||{}).length&&!c.lines?.length)hint('missions',m.id,nm,3,'選択肢「'+(c.text||'')+'」は、選んでもフラグも会話もなく、何も起きません','choice');
  if((m.story?.choices||[]).length===1)hint('missions',m.id,nm,3,'選択肢が1つだけです。選択肢は2つ以上あると分岐になります','choice');
 }
 for(const u of pack.units||[]){
  for(const p of u.phases||[])if(!Object.keys(p.stats||{}).length&&!p.weaponIds?.length&&!p.weapons?.length&&!p.skillIds&&!p.skills&&!p.ai?.target&&!p.lines?.length&&(p.hpMode||'ratio')==='ratio')hint('units',u.id,u.name||u.id,3,'段階「'+(p.name||p.id)+'」は能力・武装・スキル・狙い方・会話のどれも変えず、何も起きません','phase');
 }
 for(const w of flagReport(pack).warnings)hint('flags',w.id,w.id,0,w.text,'flag');
 return out;
}
// ---- /1.15.1 ----
root.PROFeatures=Object.freeze({version:'1.1.0',usage,flagSites,flagReport,similarFlags,flagLabel,renameFlag,setFlagNote,deleteFlagNote,setFlagSource,getFlagSource,setNameResolver,authoringHints,describePhase,describeEvent,describeChoice,describeResultFlags,describeRequires,templates,replaceRef,diff,diffText,history,bulk,graph,packAudit,materialSources,KINDS});
})(window);
