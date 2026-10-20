/* Development / evolution and design / fusion screens (prototype). Owned units and credits are the test save
   (browser key PRO_TACTICAL_HQ, per data source). Units are picked on the shared unit grid. */
(function(){'use strict';
const C=window.PROCore,D=window.PROTacticalData,G=window.PROUnitGrid,$=id=>document.getElementById(id);
const seen=()=>window.PROUnitsSeen;
// Test player state: owned units (uid → unit id, level, EXP, skill points), credits, the production / hire list
// (unit ids registered by evolution or fusion settings) and PRO・D unit levels (by unit id). Stats follow PROCore.levelStats.
// Starting units keep their unit id as uid (the formation screen and its tests address them that way).
const HQ_KEY='PRO_TACTICAL_HQ',START_CREDITS=24800;
let serial=1,credits=START_CREDITS,owned=D.roster().map(u=>({uid:u.id,id:u.id})),registered=[],dlv={},hired={},cleared=[],items=D.startItems(),day=1,done=[],active=null,notices=[],records={},flags={},recruited=[],wins=0,presets={dispatch:[],tactical:[]},dlost=[],ddown={};
// A save made with another data source (built-in / maker) is ignored; units missing from the data are dropped.
try{const h=JSON.parse(localStorage.getItem(HQ_KEY)||'null');if(h&&h.source===D.source&&Array.isArray(h.owned)){owned=h.owned.filter(o=>{try{D.unit(o.id);return typeof o.uid==='string';}catch(e){return false;}});credits=Number.isFinite(h.credits)?h.credits:START_CREDITS;registered=Array.isArray(h.registered)?h.registered:[];dlv=h.dlv&&typeof h.dlv==='object'?h.dlv:{};hired=h.hired&&typeof h.hired==='object'?h.hired:{};cleared=Array.isArray(h.cleared)?h.cleared:[];items=h.items&&typeof h.items==='object'?h.items:D.startItems();day=h.day>=1?h.day:1;done=Array.isArray(h.done)?h.done:[];active=h.active&&D.research().some(r=>r.id===h.active.id)?h.active:null;notices=Array.isArray(h.notices)?h.notices:[];records=h.records&&typeof h.records==='object'?h.records:{};flags=h.flags&&typeof h.flags==='object'?h.flags:{};recruited=Array.isArray(h.recruited)?h.recruited:[];wins=h.wins|0;dlost=Array.isArray(h.dlost)?h.dlost:[];ddown=h.ddown&&typeof h.ddown==='object'?h.ddown:{};presets=h.presets&&typeof h.presets==='object'?{dispatch:h.presets.dispatch||[],tactical:h.presets.tactical||[]}:{dispatch:[],tactical:[]};serial=h.serial||1;}}catch(e){}
function save(){try{localStorage.setItem(HQ_KEY,JSON.stringify({source:D.source,owned,credits,serial,registered,dlv,hired,cleared,items,day,done,active,notices,records,flags,recruited,wins,presets,dlost,ddown}));}catch(e){}}
// An owned unit's stats: level stats, then permanent item boosts (mods flat, pct %), then equipment. Item-added
// weapons / skills / tags and equipped weapons / skills are appended. Equipment slots: unit.equipSlots (default 2) + bonus.
const SLOT_DEFAULT=2,SLOT_MAX=8,STATS=['hp','atk','def','mob','acc'],tryW=w=>{try{return C.weapon(w);}catch(e){return null;}},tryS=x=>{try{return C.skill({...x});}catch(e){return null;}};
const slotsOf=o=>Math.min(SLOT_MAX,Math.max(0,(D.unit(o.id).equipSlots??SLOT_DEFAULT)+(o.slotBonus||0)));
function unitOf(o){const u=C.levelStats(D.unit(o.id),o.lv||1),gear=(o.equip||[]).filter(Boolean).map(id=>D.item(id)).filter(it=>it?.equip);
 for(const k of STATS){if(u[k]==null)continue;let v=u[k]+(o.mods?.[k]||0);v=Math.round(v*(1+(o.pct?.[k]||0)/100));for(const it of gear)v+=Number(it.equip.stats?.[k])||0;u[k]=k==='hp'?Math.max(1,v):Math.max(0,v);}
 const tags=new Set([...(u.tags||[]),...(o.tagsAdd||[])]);for(const t of o.tagsRemove||[])tags.delete(t);
 return {...u,weapons:[...(u.weapons||[]),...(o.weapons||[]),...gear.flatMap(it=>(it.equip.weapons||[]).map(tryW).filter(Boolean))],skills:[...(u.skills||[]),...(o.skills||[]),...gear.flatMap(it=>(it.equip.skills||[]).map(tryS).filter(Boolean))],tags:[...tags],
  id:o.id,uid:o.uid,exp:o.exp||0,sp:o.sp||0,down:o.down||null,slots:slotsOf(o),equip:Array.from({length:slotsOf(o)},(_,i)=>(o.equip||[])[i]||null)};}
const counts=()=>owned.reduce((m,o)=>(m[o.id]=(m[o.id]||0)+1,m),{});
const state=u=>({credits,units:counts(),items:{...items},reserved:{items:{...(active?.reserve||{})}},research:done,flags:{...flags},wins,stars:Object.fromEntries(Object.entries(records).map(([k,r])=>[k,(r.stars||[]).filter(Boolean).length])),day,cleared,hires:hired,unit:u?{...u,level:u.level||1}:undefined,rng:()=>0});
const name=id=>seen().has(id)?D.unit(id).name:'？？？';
const CMP={ge:'以上',le:'以下',eq:'ちょうど',lt:'未満'};
// Short text for the condition types the samples use; other types fall back to their id.
function condText(c){const n=v=>v+(CMP[c.cmp||'ge']);let t;switch(c.type){case 'credits_use':t='資金'+c.value+'を消費';break;case 'credits_have':t='資金'+n(c.value);break;case 'unit_level':t='Lv'+n(c.value);break;
 case 'unit_owned':t=name(c.unitId)+'を'+n(c.count??1)+'体所持';break;case 'item_has':t='アイテム'+c.itemId+'を'+n(c.count??1)+'個';break;case 'item_use':t='アイテム'+c.itemId+'×'+(c.count||1)+'を消費';break;default:t=c.type;}return (c.not?'【否定】':'')+t;}
const condsText=cs=>cs?.list?.length?cs.list.map(condText).join(cs.mode==='any'?' または ':' かつ '):'条件なし';
// Production / hire list: registering also counts as an encounter.
function register(id){if(!registered.includes(id))registered.push(id);seen().mark([id],'registered');save();}
const carryText=keep=>keep?'レベル・経験値・スキルポイントを引き継ぐ':'Lv1から（引き継がない）';
function pay(costs){for(const c of costs)if(c.credits!=null)credits-=c.credits;showCredits();save();}
function showCredits(){const b=$('hubCredits');if(b)b.textContent=credits.toLocaleString();}
function tell(id,text){$(id).textContent=text;}
// Window shared by both screens: commands in a list, a confirm step, and results.
function win(kind,title,lines,acts){$('labWinKind').textContent=kind;$('labWinTitle').textContent=title;$('labWinBody').replaceChildren(...lines.map(t=>{const p=document.createElement('p');p.className='catalog-line';p.textContent=t;return p;}));
 $('labWinActions').replaceChildren(...acts.map(([label,fn,off,data])=>{const b=document.createElement('button');b.type='button';b.textContent=label;b.onclick=fn;b.disabled=!!off;if(data)b.dataset.lab=data;return b;}));const d=$('labWindow');if(!d.open)d.showModal();$('labWinActions').querySelector('button:not(:disabled)')?.focus();}
const close=()=>$('labWindow').close();

/* ---------- development / evolution ---------- */
let evoPick=null;
const evosOf=o=>D.evolutions().filter(e=>e.from===o.id);
function renderEvolve(){const list=owned.map(unitOf);tell('evolveCredits','資金 '+credits.toLocaleString()+' Cr');
 G.render($('evolveGrid'),list,{selected:u=>u.uid===evoPick,reason:u=>evosOf(u).length?'':'開発・進化先なし',badge:u=>evosOf(u).length?'進化'+evosOf(u).length:'',onPick:u=>{if(evoPick===u.uid){openEvolve(u);return;}evoPick=u.uid;renderEvolve();focusTile('evolveGrid',u.uid);}});
 for(const t of $('evolveGrid').querySelectorAll('.ug-tile'))t.dataset.uid=list[[...t.parentNode.children].indexOf(t)].uid;}
function openEvolve(u){const evos=evosOf(u);if(!evos.length){win('開発・進化',u.name,['このユニットには開発・進化先がありません。'],[['閉じる',close]]);return;}
 const rows=evos.map(e=>{const r=C.evalConds(e.conds,state(u)),known=seen().has(e.to)||r.ok;return {e,r,label:'→ '+(known?D.unit(e.to).name:'？？？')+'（'+condsText(e.conds)+(r.ok?' ✓':' ✗')+'）'};});
 win('開発・進化',u.name+' の開発・進化先',['条件を満たした先を選ぶと確認します。'],[...rows.map(x=>[x.label,()=>confirmEvolve(u,x),!x.r.ok,x.e.id]),['閉じる',close]]);}
function confirmEvolve(u,{e,r}){const to=D.unit(e.to),keep=!!e.carry?.level;win('確認',u.name+' → '+to.name,['この内容で開発・進化します。','条件：'+condsText(e.conds),r.costs.length?'消費：'+r.costs.map(c=>c.credits!=null?c.credits+' Cr':c.itemId+'×'+c.count).join('・'):'消費なし',carryText(keep),e.register?'生産・雇用リストに '+to.name+' を登録します':'生産・雇用リストは変わりません'],
 [['実行する',()=>{const o=owned.find(x=>x.uid===u.uid);if(!o)return;pay(r.costs);o.id=e.to;if(!keep){o.lv=1;o.exp=0;o.sp=0;}save();seen().mark([e.to],'joined');if(e.register)register(e.to);evoPick=null;renderEvolve();win('完了',to.name,[u.name+' が '+to.name+' に開発・進化しました。',...(e.register?['生産・雇用リストに登録しました。']:[])],[['閉じる',close]]);},false,'run'],['戻る',()=>openEvolve(u)]]);}

/* ---------- design / fusion ---------- */
// The confirm window only opens for a recipe whose conditions hold, so it always names the result (as evolution does).
// First unit: two taps. Then partners that can still complete a recipe (with its conditions met) are bright;
// tapping toggles them. When the picks match a recipe exactly, the confirm window opens.
let anchor=null,picks=[];
const recipes=()=>D.fusions().map(f=>({f,need:f.materials.map(m=>m.unitId)}));
const ids=uids=>uids.map(uid=>owned.find(o=>o.uid===uid)?.id);
// Can the multiset `have` (unit ids) still grow into `need`?
const fits=(have,need)=>{const n=[...need];for(const id of have){const i=n.indexOf(id);if(i<0)return false;n.splice(i,1);}return true;};
const live=()=>{const a=owned.find(o=>o.uid===anchor);if(!a)return [];return recipes().filter(x=>fits([a.id,...ids(picks)],x.need)&&C.evalConds(x.f.conds,state()).ok);};
function renderFusion(){const list=owned.map(unitOf),a=owned.find(o=>o.uid===anchor);tell('fusionCredits','資金 '+credits.toLocaleString()+' Cr');
 tell('fusionStep',!a?'1体目を選び、もう一度押して決定してください。':'1体目：'+D.unit(a.id).name+(picks.length?' ＋ '+picks.map(uid=>unitOf(owned.find(o=>o.uid===uid)).name).join(' ＋ '):'')+' ｜ 明るいユニットを選んでください。');$('fusionReset').hidden=!a;
 const can=u=>{if(!a)return D.fusions().some(f=>f.materials.some(m=>m.unitId===u.id));if(u.uid===anchor||picks.includes(u.uid))return true;return live().some(x=>fits([a.id,...ids(picks),u.id],x.need));};
 G.render($('fusionGrid'),list,{selected:u=>u.uid===anchor||u.uid===pending||picks.includes(u.uid),reason:u=>can(u)?'':a?'組み合わせられない':'設計・合成の素材にならない',badge:u=>u.uid===anchor?'1体目':picks.includes(u.uid)?'素材':'',onPick:u=>pickFusion(u)});
 for(const t of $('fusionGrid').querySelectorAll('.ug-tile'))t.dataset.uid=list[[...t.parentNode.children].indexOf(t)].uid;}
let pending=null;
function pickFusion(u){if(!anchor){if(pending===u.uid){anchor=u.uid;pending=null;if(!live().length){tell('fusionStep',u.name+'：条件を満たす組み合わせがありません。');anchor=null;renderFusion();return;}renderFusion();return;}pending=u.uid;renderFusion();focusTile('fusionGrid',u.uid);return;}
 if(u.uid===anchor)return;if(picks.includes(u.uid)){picks=picks.filter(x=>x!==u.uid);renderFusion();return;}
 const a=owned.find(o=>o.uid===anchor);if(!live().some(x=>fits([a.id,...ids(picks),u.id],x.need))){tell('fusionStep',u.name+'：この組み合わせでは設計・合成できません。');return;}
 picks.push(u.uid);renderFusion();focusTile('fusionGrid',u.uid);const all=[a.id,...ids(picks)],done=live().find(x=>x.need.length===all.length&&fits(all,x.need));if(done)confirmFusion(done.f);}
// result.type: unit (adds the unit; register optional) or register (no unit; only the production / hire list).
// carry.level: the new unit starts at the first material's level, EXP and skill points instead of Lv1.
function confirmFusion(f){const uids=[anchor,...picks],r=C.evalConds(f.conds,state()),res=f.result.unitId,only=f.result.type==='register',keep=!only&&!!f.carry?.level,first=owned.find(o=>o.uid===anchor);
 // Pair each picked unit with a recipe slot so per-material consume flags apply to the right unit.
 const slots=[...f.materials],plan=uids.map(uid=>{const o=owned.find(x=>x.uid===uid),i=slots.findIndex(m=>m.unitId===o.id);const m=slots.splice(i,1)[0];return {o,keep:m.consume===false};});
 win('確認','設計・合成',[plan.map(p=>D.unit(p.o.id).name+(p.keep?'（消費しない）':'')).join(' ＋ ')+(only?' → 生産・雇用リストに '+D.unit(res).name:' → '+D.unit(res).name+((f.result.count||1)>1?' ×'+f.result.count:'')),'条件：'+condsText(f.conds),r.costs.length?'消費：'+r.costs.map(c=>c.credits!=null?c.credits+' Cr':c.itemId+'×'+c.count).join('・'):'資金の消費なし',...(only?['ユニットは増えません（生産・雇用の解禁のみ）']:[carryText(keep),f.result.register?'生産・雇用リストにも登録します':'生産・雇用リストは変わりません'])],
 [['実行する',()=>{pay(r.costs);const base=keep?{lv:first.lv||1,exp:first.exp||0,sp:first.sp||0}:{lv:1,exp:0,sp:0},gone=new Set(plan.filter(p=>!p.keep).map(p=>p.o.uid));owned=owned.filter(o=>!gone.has(o.uid));
   if(!only){for(let i=0;i<(f.result.count||1);i++)owned.push({uid:res+'#'+serial++,id:res,...base});seen().mark([res],'joined');}if(only||f.result.register)register(res);save();anchor=null;picks=[];renderFusion();
   win('完了',D.unit(res).name,[only?D.unit(res).name+' を生産・雇用リストに登録しました。':'設計・合成で '+D.unit(res).name+' が加わりました。',...(!only&&f.result.register?['生産・雇用リストにも登録しました。']:[])],[['閉じる',close]]);},false,'run'],
  ['戻る',()=>{picks.pop();renderFusion();close();}]]);}
/* ---------- production / hire ---------- */
// Entries: the pack's hire entries plus units on the production / hire list without one. A hire entry is available
// when its required missions are cleared and its conditions hold; hidden entries are listed only then.
// Units without a hire entry cost their hireCost (set in the maker), or a provisional price derived from their stats.
// joinVerb (hire / produce) only changes the wording; both are the same process. New units always join at Lv1.
const defaultCost=u=>u.hireCost??Math.max(100,Math.round(((u.hp||0)/4+(u.atk||0)*2+(u.def||0)*2)/100)*100);
const verb=u=>u.joinVerb==='produce'?'生産':u.joinVerb==='hire'?'雇用':'生産・雇用';
function entries(){const hs=D.hires(),out=hs.map(h=>({...h,cost:h.cost??defaultCost(D.unit(h.unitId))}));for(const id of registered)if(!out.some(e=>e.unitId===id))out.push({id:'reg-'+id,unitId:id,cost:defaultCost(D.unit(id)),registered:true});return out;}
function status(e){const missing=(e.requires?.missions||[]).filter(m=>!cleared.includes(m)),needR=(e.requires?.research||[]).filter(x=>!done.includes(x)),r=C.evalConds(e.conds,state()),full=e.limit!=null&&(hired[e.id]||0)>=e.limit,afford=credits>=e.cost+r.costs.reduce((n,c)=>n+(c.credits||0),0);
 const why=missing.length?'作戦「'+missing.map(m=>D.mission(m)?.name||m).join('・')+'」のクリアが必要':needR.length?'研究「'+needR.map(x=>D.research().find(r=>r.id===x)?.name||x).join('・')+'」が必要':!r.ok?'条件：'+condsText(e.conds):full?'雇える上限（'+e.limit+'）に達しています':!afford?'資金が足りません':'';return {ok:!why,why,r,open:!missing.length&&!needR.length&&r.ok};}
let prodPick=null;
function renderProduction(){const list=entries().filter(e=>!e.hidden||status(e).open);tell('productionCredits','資金 '+credits.toLocaleString()+' Cr');
 G.render($('productionGrid'),list.map(e=>({...D.unit(e.unitId),id:e.unitId,uid:e.id})),{selected:u=>u.uid===prodPick,reason:u=>status(list.find(e=>e.id===u.uid)).why,badge:u=>list.find(e=>e.id===u.uid).cost.toLocaleString()+'Cr',onPick:u=>{if(prodPick===u.uid){openProduction(list.find(e=>e.id===u.uid));return;}prodPick=u.uid;renderProduction();focusTile('productionGrid',u.uid);}});
 [...$('productionGrid').querySelectorAll('.ug-tile')].forEach((t,i)=>{t.dataset.uid=list[i].id;});
 if(!list.length)$('productionGrid').append(Object.assign(document.createElement('p'),{className:'cmd-hint',textContent:'生産・雇用できるユニットはまだありません。'}));}
function openProduction(e){const u=D.unit(e.unitId),st=status(e),have=counts()[e.unitId]||0;
 win(verb(u),u.name,[(e.registered?'生産・雇用リスト（開発・設計で登録）':verb(u))+' ｜ 費用 '+e.cost.toLocaleString()+' Cr','所持 '+have+'体'+(e.limit!=null?' ｜ 雇用 '+(hired[e.id]||0)+' / '+e.limit:''),...(e.requires?.missions?.length?['必要：作戦「'+e.requires.missions.map(m=>D.mission(m)?.name||m).join('・')+'」のクリア']:[]),...(e.conds?.list?.length?['条件：'+condsText(e.conds)]:[]),st.ok?'Lv1で加わります。':'できません：'+st.why],
 [[verb(u)+'する',()=>{if(!status(e).ok)return;const r=status(e).r;pay([{credits:e.cost},...r.costs]);owned.push({uid:e.unitId+'#'+serial++,id:e.unitId,lv:1,exp:0,sp:0});hired[e.id]=(hired[e.id]||0)+1;save();seen().mark([e.unitId],'joined');prodPick=null;renderProduction();win('完了',u.name,[u.name+' が加わりました。（資金 残り '+credits.toLocaleString()+' Cr）'],[['閉じる',close]]);},!st.ok,'run'],['ユニット情報',()=>window.PROField?.showUnit({...u,id:e.unitId})],['閉じる',close]]);}
/* ---------- research ---------- */
// One research at a time. Start: pay credits, reserve cost.items (they stay owned but can't be used elsewhere).
// The in-game day advances when a mission ends; on the finishing day the reserved items are consumed and the
// unlocks apply. Cancelling refunds the credits and releases the reservation. Completion notes wait in `notices`.
const rById=id=>D.research().find(r=>r.id===id),itemText=o=>Object.entries(o||{}).map(([id,n])=>D.itemName(id)+'×'+n).join('・');
// Usable count: owned minus research reservations minus equipped copies.
const equipped=id=>owned.reduce((n,o)=>n+(o.equip||[]).slice(0,slotsOf(o)).filter(x=>x===id).length,0);
const free=id=>(items[id]||0)-(active?.reserve?.[id]||0)-equipped(id);
function researchStatus(r){if(done.includes(r.id))return {state:'done',why:'完了済み'};if(active?.id===r.id)return {state:'active',why:'研究中（あと'+Math.max(0,active.until-day)+'日）'};
 const needR=(r.requires||[]).filter(x=>!done.includes(x)),c=C.evalConds(r.conds,state()),lack=Object.entries(r.cost?.items||{}).filter(([id,n])=>free(id)<n);
 const why=active?'ほかの研究を進行中':needR.length?'先に「'+needR.map(x=>rById(x)?.name||x).join('・')+'」が必要':!c.ok?'条件：'+condsText(r.conds):credits<(r.cost?.credits||0)?'資金が足りません':lack.length?'素材が足りません（'+lack.map(([id,n])=>D.itemName(id)+' '+free(id)+'/'+n).join('・')+'）':'';
 return {state:why?'blocked':'ready',why,open:!needR.length&&c.ok};}
function startResearch(id){const r=rById(id);if(!r||researchStatus(r).state!=='ready')return false;const paid=r.cost?.credits||0;pay([{credits:paid}]);active={id,start:day,until:day+Math.max(1,r.days||1),paid,reserve:{...(r.cost?.items||{})}};save();return true;}
function cancelResearch(){if(!active)return false;credits+=active.paid||0;active=null;showCredits();save();return true;}
function completeResearch(){const r=rById(active.id);for(const [id,n] of Object.entries(active.reserve||{}))items[id]=Math.max(0,(items[id]||0)-n);
 const u=r?.unlock||{},got=[];for(const id of u.units||[]){try{D.unit(id);}catch(e){continue;}owned.push({uid:id+'#'+serial++,id,lv:1,exp:0,sp:0});seen().mark([id],'joined');got.push(D.unit(id).name+'が加入');}
 for(const id of u.register||[]){try{D.unit(id);}catch(e){continue;}register(id);got.push(D.unit(id).name+'を生産・雇用リストに登録');}
 for(const [id,n] of Object.entries(u.grantItems||{})){items[id]=(items[id]||0)+n;got.push(D.itemName(id)+'×'+n+'を入手');}
 done.push(active.id);notices.push((r?.name||active.id)+' が完了'+(got.length?'：'+got.join('、'):''));active=null;}
// In-game day: +1 per finished mission (Tactical or Dispatch). Returns completion notes produced by this advance.
function advanceDay(n=1){const before=notices.length;day+=n;if(active&&day>=active.until)completeResearch();save();return notices.slice(before);}
let researchPick=null;
function renderResearch(){const list=D.research().filter(r=>!r.hidden||researchStatus(r).open||done.includes(r.id));
 tell('researchDay','ゲーム内 '+day+'日目 ｜ 資金 '+credits.toLocaleString()+' Cr');const box=$('researchList');box.replaceChildren(...list.map(r=>{const st=researchStatus(r),b=document.createElement('button');b.type='button';b.setAttribute('role','menuitem');b.dataset.research=r.id;b.className='research-'+st.state;const a=document.createElement('span'),sm=document.createElement('small');a.textContent=(st.state==='done'?'✓ ':'')+r.name;sm.textContent=st.state==='ready'?(r.days||1)+'日 ・ '+(r.cost?.credits||0).toLocaleString()+' Cr':st.why;b.append(a,sm);b.onclick=()=>openResearch(r.id);return b;}));
 if(!list.length)box.append(Object.assign(document.createElement('p'),{className:'cmd-hint',textContent:'研究できる項目はありません。'}));
 $('researchNow').textContent=active?rById(active.id)?.name+'（'+active.until+'日目に完了・あと'+Math.max(0,active.until-day)+'日）':'なし';$('researchReserved').textContent=active&&Object.keys(active.reserve||{}).length?itemText(active.reserve):'なし';$('researchItems').textContent=itemText(Object.fromEntries(Object.entries(items).filter(([,n])=>n>0)))||'なし';
 $('researchNotices').replaceChildren(...notices.slice(-3).reverse().map(t=>Object.assign(document.createElement('p'),{className:'catalog-line',textContent:t})));}
function openResearch(id){const r=rById(id),st=researchStatus(r),u=r.unlock||{};
 const gets=[...(u.units||[]).map(x=>name(x)+' が加入'),...(u.register||[]).map(x=>name(x)+' を生産・雇用リストに登録'),...Object.entries(u.grantItems||{}).map(([x,n])=>D.itemName(x)+'×'+n+' を入手')];
 win('研究',r.name,[r.desc||'',(r.days||1)+'日 ｜ 開始時に '+(r.cost?.credits||0).toLocaleString()+' Cr',Object.keys(r.cost?.items||{}).length?'素材（完了時に消費・それまで予約）：'+itemText(r.cost.items):'素材なし',...(r.requires?.length?['先に必要：'+r.requires.map(x=>rById(x)?.name||x).join('・')]:[]),'完了すると：'+(gets.join('、')||'なし'),st.state==='ready'?'研究を始められます。':st.why].filter(Boolean),
  [...(st.state==='active'?[['研究を取りやめる',()=>win('確認','研究を取りやめますか？',['資金 '+(active.paid||0).toLocaleString()+' Cr を返金し、素材の予約を解除します。'],[['取りやめる',()=>{cancelResearch();renderResearch();openResearch(id);},false,'cancel'],['戻る',()=>openResearch(id)]]),false,'stop']]:[['研究を始める',()=>{if(startResearch(id)){renderResearch();win('開始',r.name,[r.name+' を始めました。'+(active.until)+'日目に完了します。'],[['閉じる',close]]);}},st.state!=='ready','run']]),['閉じる',close]]);}
/* ---------- shop / storage ---------- */
// Listed in the shop when the item has a price and its gates are met: shop.requiresMission cleared,
// shop.requiresResearch done, conds hold, and any research whose unlock.items names it is done. Selling gives half
// the price (rounded down); key items and reserved quantities cannot be sold.
const sellPrice=it=>it.key||it.price==null?null:Math.floor(it.price/2);
function shopGate(it){const s=it.shop||{},gates=D.research().filter(r=>(r.unlock?.items||[]).includes(it.id));
 if(s.requiresMission&&!cleared.includes(s.requiresMission))return '作戦「'+(D.mission(s.requiresMission)?.name||s.requiresMission)+'」のクリアで入荷';
 if(s.requiresResearch&&!done.includes(s.requiresResearch))return '研究「'+(rById(s.requiresResearch)?.name||s.requiresResearch)+'」で入荷';
 if(gates.length&&!gates.some(r=>done.includes(r.id)))return '研究「'+gates.map(r=>r.name).join('・')+'」で入荷';
 if(it.conds?.list?.length&&!C.evalConds(it.conds,state()).ok)return '条件：'+condsText(it.conds);return '';}
function buy(id,n=1){const it=D.item(id);if(!it||it.price==null||shopGate(it)||credits<it.price*n)return false;credits-=it.price*n;items[id]=(items[id]||0)+n;showCredits();save();return true;}
function sell(id,n=1){const it=D.item(id),p=it&&sellPrice(it);if(p==null||free(id)<n)return false;items[id]-=n;credits+=p*n;showCredits();save();return true;}
const listItems=(box,list,label,sub,open)=>{$(box).replaceChildren(...list.map(it=>{const b=document.createElement('button');b.type='button';b.setAttribute('role','menuitem');b.dataset.item=it.id;const a=document.createElement('span'),m=document.createElement('small');a.textContent=label(it);m.textContent=sub(it);b.append(a,m);b.onclick=()=>open(it.id);return b;}));if(!list.length)$(box).append(Object.assign(document.createElement('p'),{className:'cmd-hint',textContent:'ありません。'}));};
function renderShop(){const list=D.items().filter(it=>it.price!=null&&!shopGate(it));tell('shopCredits',credits.toLocaleString()+' Cr');
 listItems('shopList',list,it=>it.name,it=>it.price.toLocaleString()+' Cr ・ 所持 '+(items[it.id]||0),openShop);
 const soon=D.items().filter(it=>it.price!=null&&shopGate(it));$('shopSoon').textContent=soon.length?soon.map(it=>'？？？（'+shopGate(it)+'）').join(' ／ '):'なし';}
function openShop(id){const it=D.item(id),p=sellPrice(it),gate=shopGate(it),act=(label,fn,off,key)=>[label,()=>{fn();renderShop();openShop(id);},off,key];
 win('ショップ',it.name,[it.desc||'',it.price!=null?'価格 '+it.price.toLocaleString()+' Cr':'販売していません','所持 '+(items[id]||0)+(active?.reserve?.[id]?'（うち予約 '+active.reserve[id]+'）':''),p==null?(it.key?'大切なもの（売却できません）':'売却できません'):'売値 '+p.toLocaleString()+' Cr','資金 '+credits.toLocaleString()+' Cr'].filter(Boolean),
  [act('1個買う',()=>buy(id,1),it.price==null||!!gate||credits<it.price,'buy1'),act('5個買う',()=>buy(id,5),it.price==null||!!gate||credits<it.price*5,'buy5'),act('1個売る',()=>sell(id,1),p==null||free(id)<1,'sell1'),['閉じる',close]]);}
function renderStorage(){const list=D.items().filter(it=>(items[it.id]||0)>0);
 listItems('storageList',list,it=>(it.key?'★ ':'')+it.name,it=>'×'+items[it.id]+(active?.reserve?.[it.id]?'（予約 '+active.reserve[it.id]+'）':''),openStorage);
 $('storageReserved').textContent=active&&Object.keys(active.reserve||{}).length?itemText(active.reserve)+'（'+(rById(active.id)?.name||'')+'）':'なし';$('storageCount').textContent=list.length+'種類 ・ 合計 '+list.reduce((n,it)=>n+items[it.id],0)+'個';}
function openStorage(id){const it=D.item(id),eq=equipped(id),why=usable(it)?useBlock(it,null):'';
 win('倉庫',(it.key?'★ ':'')+it.name,[it.desc||'','所持 '+(items[id]||0)+' ・ 使える数 '+free(id),eq?'装備中：'+eq:'',active?.reserve?.[id]?'研究「'+(rById(active.id)?.name||'')+'」で予約中：'+active.reserve[id]:'',it.key?'大切なもの':sellPrice(it)!=null?'ショップでの売値 '+sellPrice(it).toLocaleString()+' Cr':'売却できません',(it.effects||[]).length&&!usable(it)?'作戦中に使う効果です（拠点では使えません）':''].filter(Boolean),
  [...(usable(it)?[['使う',()=>{if(needsUnit(it)){useItemId=id;usePick=null;close();location.hash='#useitem';}else confirmUse(it,null);},free(id)<1,'use']]:[]),...(it.equip?[['装備する（ユニット → 装備）',()=>{close();location.hash='#equip';},false,'equip']]:[]),['閉じる',close]]);}
/* ---------- item use / equipment ---------- */
// Effects that work at the base. HP / revive / next-sortie effects need a battle and are not usable here.
const BASE_EFFECTS=['stat_up_flat','stat_up_pct','all_stats_up_flat','exp_gain','skill_point','credits_gain','add_skill','remove_skill','add_weapon','remove_weapon','add_tag','remove_tag','recruit_unit','equip_slot','loot_box'];
const usable=it=>(it.effects||[]).length>0&&it.effects.every(e=>BASE_EFFECTS.includes(e.type));
const needsUnit=it=>it.scope!=='party'&&(it.effects||[]).some(e=>!['credits_gain','recruit_unit','loot_box'].includes(e.type));
function useBlock(it,o){if(!usable(it))return (it.effects||[]).length?'作戦中に使う効果です（拠点では使えません）':'使えないアイテムです';if(free(it.id)<1)return '使える数がありません';
 if(o&&it.limitPerUnit&&(o.used?.[it.id]||0)>=it.limitPerUnit)return 'このユニットにはもう使えません（'+it.limitPerUnit+'回まで）';
 if(it.useConds?.list?.length&&!C.evalConds(it.useConds,state(o?unitOf(o):undefined)).ok)return '条件：'+condsText(it.useConds);return '';}
function applyEffect(e,o,notes){const add=(k,v)=>{o.mods=o.mods||{};o.mods[k]=(o.mods[k]||0)+v;};switch(e.type){
 case 'stat_up_flat':add(e.stat,e.value);notes.push(e.stat.toUpperCase()+'+'+e.value);break;case 'all_stats_up_flat':for(const k of STATS)add(k,e.value);notes.push('全能力+'+e.value);break;
 case 'stat_up_pct':o.pct=o.pct||{};o.pct[e.stat]=(o.pct[e.stat]||0)+e.value;notes.push(e.stat.toUpperCase()+'+'+e.value+'%');break;
 case 'exp_gain':{const r=C.gainExp({lv:o.lv||1,exp:o.exp||0,sp:o.sp||0},e.value);Object.assign(o,{lv:r.lv,exp:r.exp,sp:r.sp});notes.push('経験値+'+e.value+(r.ups?'（Lv'+r.lv+'）':''));break;}
 case 'skill_point':o.sp=(o.sp||0)+e.value;notes.push('SP+'+e.value);break;case 'equip_slot':o.slotBonus=(o.slotBonus||0)+e.value;notes.push('装備枠'+(e.value>0?'+':'')+e.value);break;
 case 'add_weapon':{const w=tryW(e.weapon);if(w){o.weapons=[...(o.weapons||[]),w];notes.push('武装「'+w.name+'」を追加');}break;}case 'remove_weapon':o.weapons=(o.weapons||[]).filter(w=>e.name&&w.name!==e.name);notes.push('追加武装を外した');break;
 case 'add_skill':{const k=tryS(e.skill);if(k){o.skills=[...(o.skills||[]),k];notes.push('スキル「'+k.name+'」を習得');}break;}case 'remove_skill':o.skills=(o.skills||[]).filter(k=>e.skillId&&k.id!==e.skillId);notes.push('習得スキルを外した');break;
 case 'add_tag':o.tagsAdd=[...new Set([...(o.tagsAdd||[]),e.tag])];o.tagsRemove=(o.tagsRemove||[]).filter(t=>t!==e.tag);notes.push('タグ「'+e.tag+'」');break;case 'remove_tag':o.tagsRemove=[...new Set([...(o.tagsRemove||[]),e.tag])];o.tagsAdd=(o.tagsAdd||[]).filter(t=>t!==e.tag);notes.push('タグ「'+e.tag+'」を削除');break;}}
function applyGlobal(e,notes){switch(e.type){case 'credits_gain':credits+=e.value;showCredits();notes.push('資金+'+e.value.toLocaleString());break;
 case 'recruit_unit':try{D.unit(e.unitId);owned.push({uid:e.unitId+'#'+serial++,id:e.unitId,lv:1,exp:0,sp:0});seen().mark([e.unitId],'joined');notes.push(D.unit(e.unitId).name+'が加入');}catch(x){}break;
 case 'loot_box':{const t=e.table||[],sum=t.reduce((n,r)=>n+(r.weight??1),0);let x=Math.random()*sum;const r=t.find(r=>(x-=(r.weight??1))<0)||t[t.length-1];if(r){const n=(r.min??1)+Math.floor(Math.random()*((r.max??r.min??1)-(r.min??1)+1));items[r.itemId]=(items[r.itemId]||0)+n;notes.push(D.itemName(r.itemId)+'×'+n+'を入手');}break;}}}
// useItem(itemId, uid?) → notes, or a reason string when it can't be used. party scope applies to every owned unit.
function useItem(id,uid){const it=D.item(id);if(!it)return '不明なアイテムです';const target=uid?owned.find(o=>o.uid===uid):null;if(needsUnit(it)&&it.scope!=='party'&&!target)return 'ユニットを選んでください';const why=useBlock(it,target);if(why)return why;
 const notes=[],targets=it.scope==='party'?owned:target?[target]:[];for(const e of it.effects||[]){if(['credits_gain','recruit_unit','loot_box'].includes(e.type))applyGlobal(e,notes);else for(const o of targets)applyEffect(e,o,notes);}
 items[id]-=1;for(const o of targets){o.used=o.used||{};o.used[id]=(o.used[id]||0)+1;}save();return notes;}
// equip(uid, slot, itemId|null): an item can be equipped only while a free copy remains.
function equip(uid,slot,id){const o=owned.find(x=>x.uid===uid);if(!o||slot<0||slot>=slotsOf(o))return false;const cur=(o.equip||[])[slot]||null;if(id&&id!==cur){const it=D.item(id);if(!it?.equip||free(id)<1)return false;}o.equip=Array.from({length:slotsOf(o)},(_,i)=>(o.equip||[])[i]||null);o.equip[slot]=id||null;save();return true;}
let usePick=null,useItemId=null,equipPick=null;
function renderUse(){const it=D.item(useItemId);if(!it){tell('useTitleSub','');return;}tell('useTitleSub',it.name+'（使える数 '+free(it.id)+'）を使うユニットを選び、もう一度押して決定');
 const list=owned.map(unitOf);G.render($('useGrid'),list,{selected:u=>u.uid===usePick,reason:u=>useBlock(it,owned.find(o=>o.uid===u.uid)),badge:u=>'Lv'+u.level+(it.limitPerUnit?' '+((owned.find(o=>o.uid===u.uid).used?.[it.id])||0)+'/'+it.limitPerUnit:''),onPick:u=>{if(usePick===u.uid){confirmUse(it,u);return;}usePick=u.uid;renderUse();focusTile('useGrid',u.uid);}});
 [...$('useGrid').querySelectorAll('.ug-tile')].forEach((t,i)=>{t.dataset.uid=list[i].uid;});}
function confirmUse(it,u){const why=useBlock(it,u?owned.find(o=>o.uid===u.uid):null);win('確認',it.name+(u?' → '+u.name:''),[it.desc||'',why||'使うと1個減ります。'].filter(Boolean),[['使う',()=>{const r=useItem(it.id,u?.uid);usePick=null;if(location.hash==='#useitem')renderUse();renderStorage();win('使用',it.name,typeof r==='string'?[r]:[(u?u.name+'：':'')+(r.join('、')||'効果なし')],[['閉じる',close]]);},!!why,'run'],['戻る',close]]);}
function renderEquip(){const list=owned.map(unitOf);G.render($('equipGrid'),list,{selected:u=>u.uid===equipPick,reason:u=>u.slots?'':'装備枠がありません',badge:u=>'装備'+u.equip.filter(Boolean).length+'/'+u.slots,onPick:u=>{if(equipPick===u.uid){openEquip(u.uid);return;}equipPick=u.uid;renderEquip();focusTile('equipGrid',u.uid);}});
 [...$('equipGrid').querySelectorAll('.ug-tile')].forEach((t,i)=>{t.dataset.uid=list[i].uid;});}
function openEquip(uid){const u=unitOf(owned.find(o=>o.uid===uid)),stat=k=>k.toUpperCase()+' '+u[k];
 win('装備',u.name,['Lv'+u.level+' ｜ '+['hp','atk','def','mob','acc'].map(stat).join(' ・ '),'武装：'+u.weapons.map(w=>w.name).join('・')],[...u.equip.map((id,i)=>['枠'+(i+1)+'：'+(id?D.itemName(id):'空き'),()=>pickGear(uid,i),false,'slot'+i]),['ユニット情報',()=>window.PROField?.showUnit(u)],['閉じる',()=>{close();renderEquip();}]]);}
function pickGear(uid,slot){const o=owned.find(x=>x.uid===uid),cur=(o.equip||[])[slot]||null,gear=D.items().filter(it=>it.equip&&(items[it.id]||0)>0);
 const desc=it=>Object.entries(it.equip.stats||{}).map(([k,v])=>k.toUpperCase()+(v>0?'+':'')+v).concat((it.equip.weapons||[]).map(w=>'武装「'+w.name+'」')).join(' ・ ');
 win('装備','枠'+(slot+1)+'に装備するもの',[cur?'いま：'+D.itemName(cur):'いま：空き'],[...gear.map(it=>[(it.id===cur?'✓ ':'')+it.name+'（使える '+free(it.id)+'）'+(desc(it)?' '+desc(it):''),()=>{equip(uid,slot,it.id);renderEquip();openEquip(uid);},it.id!==cur&&free(it.id)<1,'gear-'+it.id]),['外す',()=>{equip(uid,slot,null);renderEquip();openEquip(uid);},!cur,'unequip'],['戻る',()=>openEquip(uid)]]);}
/* ---------- missions (Tactical and PRO・D) ---------- */
// Same rules as the published game: requires.flags / missions / items (key items owned) / research, the mission's
// condition set, and allowed weekdays (real weekday). Hidden missions are not listed while locked. Records keep
// clears, best turns and stars; new stars pay starReward (default 20% of the reward) once.
const record=id=>records[id]||{clears:0,best:0,stars:[]};
function missionLock(m){const r=m.requires||{};
 if(r.flags&&Object.entries(r.flags).some(([k,v])=>!!flags[k]!==!!v))return '分岐条件：'+Object.entries(r.flags).map(([k,v])=>k+(v?'':'（OFF）')).join('・');
 const miss=(r.missions||[]).filter(id=>!cleared.includes(id));if(miss.length)return '前提作戦が未クリア：'+miss.map(id=>missionName(id)).join('・');
 const keys=(r.items||[]).filter(id=>!((items[id]||0)>0));if(keys.length)return '必要なキーアイテム：'+keys.map(D.itemName).join('・');
 const res=(r.research||[]).filter(id=>!done.includes(id));if(res.length)return '必要な研究：'+res.map(id=>rById(id)?.name||id).join('・');
 if(m.conds?.list?.length&&!C.evalConds(m.conds,state()).ok)return '条件：'+condsText(m.conds);
 if(m.days?.length&&!m.days.includes(new Date().getDay()))return '出撃できる曜日：'+m.days.map(d=>'日月火水木金土'[d]).join('・');return '';}
// Deploy rules (published rules): minimum level, terrain-banned tags, the mission's deploy_tags rule.
function deployProblem(m,u,level=1){if(m?.requires?.minLevel&&level<m.requires.minLevel)return 'Lv'+m.requires.minLevel+'以上が必要';
 let ban=[];try{ban=C.terrainMods(m).banTags||[];}catch(e){}const tags=u.tags||[],b=ban.filter(t=>tags.includes(t));if(b.length)return '地形「'+(m.terrain||'')+'」では「'+b.join('・')+'」は出撃不可';
 const rule=(m?.rules||[]).find(r=>r&&r.type==='deploy_tags');if(rule){try{const ok=C.checkRequirements(rule,u);if(!ok.ok)return '出撃制限 '+ok.reason;}catch(e){}}return '';}
const missionHidden=m=>!!m.hidden&&!!missionLock(m);
let missionName=id=>D.mission(id)?.name||id;const setMissionNames=f=>{missionName=f;};
// Star checks: clear, no_loss (no deployed unit fell), turns_le, hp_ge (remaining HP % of the deployed units).
function evalStars(m,{win,turns,lost,hpPct}){return C.missionStars(m).map(s=>win&&(s.type==='clear'||(s.type==='no_loss'&&!lost)||(s.type==='turns_le'&&turns<=s.value)||(s.type==='hp_ge'&&hpPct>=s.value)));}
const starText=s=>s.type==='clear'?'クリア':s.type==='no_loss'?'撃破されずにクリア':s.type==='turns_le'?s.value+'ターン以内':s.type==='hp_ge'?'残りHP'+s.value+'%以上':s.type;
// finishMission: credits (win: reward; draw 25%; loss 12%), drops (row conditions, then rate) on a win, stars and
// their first-time bonus, the record, cleared list and win count, and units whose recruit.missionId is this mission.
function finishMission(m,{outcome,turns,lost=false,hpPct=100,reward=0,itemsWon={},recruitPool=null,itemName=D.itemName}){const win=outcome==='win',rep={credits:0,items:[],stars:[],newStars:0,starCredits:0,recruits:[]};
 rep.credits=Math.round(win?reward:reward*(outcome==='draw'?.25:.12));credits+=rep.credits;
 if(win){for(const [id,n] of Object.entries(itemsWon)){items[id]=(items[id]||0)+n;rep.items.push({id,name:itemName(id),count:n});}
  for(const d of m.drops||[]){if(d.conds?.list?.length&&!C.evalConds(d.conds,state()).ok)continue;let p;try{p=C.dropChance(d);}catch(e){p=(d.chance??100)/100;}if(Math.random()>=p)continue;const n=(d.min??1)+Math.floor(Math.random()*((d.max??d.min??1)-(d.min??1)+1));
   if(d.unitId){let ok=true;try{D.unit(d.unitId);}catch(e){ok=false;}if(ok){for(let i=0;i<n;i++)owned.push({uid:d.unitId+'#'+serial++,id:d.unitId,lv:1,exp:0,sp:0});seen().mark([d.unitId],'joined');rep.items.push({id:d.unitId,name:D.unit(d.unitId).name+'（ユニット）',count:n});}}
   else{items[d.itemId]=(items[d.itemId]||0)+n;rep.items.push({id:d.itemId,name:itemName(d.itemId),count:n});}}
  const rec={...record(m.id)};rec.clears++;rec.best=rec.best?Math.min(rec.best,turns):turns;rep.stars=evalStars(m,{win,turns,lost,hpPct});rec.stars=rep.stars.map((ok,i)=>{if(ok&&!(rec.stars||[])[i])rep.newStars++;return ok||!!(rec.stars||[])[i];});
  rep.starCredits=rep.newStars*(m.starReward??Math.round(reward*.2));credits+=rep.starCredits;records[m.id]=rec;wins++;if(!cleared.includes(m.id))cleared.push(m.id);
  // Recruits: Tactical units join the owned roster; PRO・D units (other data) are only marked recruited.
  for(const u of recruitPool||D.units())if(u.recruit?.missionId===m.id&&!recruited.includes(u.id)){recruited.push(u.id);let mine=true;try{D.unit(u.id);}catch(e){mine=false;}if(mine)owned.push({uid:u.id+'#'+serial++,id:u.id,lv:1,exp:0,sp:0});seen().mark([u.id],'joined');rep.recruits.push(u.name);}
  for(const [id,v] of Object.entries(m.resultFlags||{}))flags[id]=v;}
 showCredits();save();return rep;}
/* ---------- sortie support: supply items, presets, choices ---------- */
// Supply items: items whose effects are all next-sortie buffs (sortie_buff). Consumed when the sortie starts and
// applied to that battle only (stat +value%).
const isSupply=it=>(it.effects||[]).length>0&&it.effects.every(e=>e.type==='sortie_buff');
const supplyItems=()=>D.items().filter(it=>isSupply(it)&&free(it.id)>0);
function applySupply(u,id){const it=D.item(id);if(!it||!isSupply(it))return u;const o={...u};for(const e of it.effects)if(o[e.stat]!=null)o[e.stat]=Math.round(o[e.stat]*(1+e.value/100));return o;}
function consumeItem(id){if(free(id)<1)return false;items[id]-=1;save();return true;}
// Formation presets: 4 slots each for PRO・D lineups and Tactical formations.
const PRESETS=4;
const getPreset=(kind,i)=>C.clone(presets[kind]?.[i]||null);
function setPreset(kind,i,value){if(i<0||i>=PRESETS)return false;presets[kind]=presets[kind]||[];presets[kind][i]=value?{...C.clone(value),savedDay:day}:null;save();return true;}
// pickChoice(title, choices) → Promise of the chosen entry; choices hidden by their display conditions are left out.
function pickChoice(title,choices){const list=(choices||[]).filter(c=>!c.conds?.list?.length||C.evalConds(c.conds,state()).ok);if(!list.length)return Promise.resolve(null);
 return new Promise(res=>win('選択',title,['選んでください。'],list.map((c,i)=>[c.text||'（選択肢）',()=>{close();for(const [k,v] of Object.entries(c.flags||{}))flags[k]=v;save();res(c);},false,'choice'+i])));}
/* ---------- defeat, recovery, dismissal ---------- */
// A unit that can be dismissed (no noFire) or hired / produced is lost when destroyed in a mission. A key unit
// (noFire and not hireable) is wrecked (machines) or badly injured ('生身' tag) instead and cannot sortie until it is
// repaired / treated (credits, much more than ordinary repairs) or revived with an item (revive_hp_pct effect).
const hireable=id=>D.hires().some(h=>h.unitId===id)||registered.includes(id);
const isKey=u=>!!u?.noFire&&!hireable(u.id);
const downKind=u=>(u?.tags||[]).includes('生身')?'injured':'wrecked',DOWN={wrecked:'大破',injured:'重傷'};
const downText=k=>DOWN[k]||'';
function handleLosses(uids){const out=[];for(const uid of uids){const o=owned.find(x=>x.uid===uid);if(!o)continue;const u=D.unit(o.id);
 if(isKey(u)){o.down=downKind(u);out.push({name:u.name,result:'down',text:downText(o.down)+'（出撃不可・修理・治療が必要）'});}else{owned=owned.filter(x=>x!==o);out.push({name:u.name,result:'lost',text:'失われた'});}}save();return out;}
// PRO・D units: the same rule by unit id (they have no hire entries in the prototype, so only noFire units are kept).
function handleDispatchLosses(units){const out=[];for(const u of units){if(u.noFire){ddown[u.id]=downKind(u);out.push({name:u.name,result:'down',text:downText(ddown[u.id])+'（出撃不可・修理・治療が必要）'});}else{if(!dlost.includes(u.id))dlost.push(u.id);out.push({name:u.name,result:'lost',text:'失われた'});}}save();return out;}
const repairCost=u=>Math.max(1000,Math.round(((Number(u.hp)||1000)*5+(u.level||1)*500)/100)*100);
const reviveItems=()=>D.items().filter(it=>(it.effects||[]).some(e=>e.type==='revive_hp_pct')&&free(it.id)>0);
// recover(key, how): key = owned uid, or 'd:'+PRO・D unit id; how = 'credits' or an item id.
function recover(key,how,u){const isD=key.startsWith('d:'),id=isD?key.slice(2):null,o=isD?null:owned.find(x=>x.uid===key);if(isD?!ddown[id]:!o?.down)return '復帰の必要はありません';
 if(how==='credits'){const c=repairCost(u);if(credits<c)return '資金が足りません（'+c.toLocaleString()+' Cr）';credits-=c;showCredits();}else{const it=D.item(how);if(!it||!(it.effects||[]).some(e=>e.type==='revive_hp_pct')||free(how)<1)return 'このアイテムは使えません';items[how]-=1;}
 if(isD)delete ddown[id];else delete o.down;save();return '';}
// Dismissal: hire → 解雇, produce → 解体. Key units (noFire) cannot be dismissed. Equipment returns to storage.
const dismissVerb=u=>u.joinVerb==='produce'?'解体':'解雇';
function dismiss(uid){const o=owned.find(x=>x.uid===uid);if(!o)return '見つかりません';const u=D.unit(o.id);if(u.noFire)return '重要ユニットは'+dismissVerb(u)+'できません';owned=owned.filter(x=>x!==o);save();return '';}
let carePick=null,firePick=null;
function careList(){const DDd=window.PRODispatchData;return [...owned.filter(o=>o.down).map(o=>({key:o.uid,unit:unitOf(o),kind:o.down})),...Object.entries(ddown).filter(([id])=>DDd?.defs[id]).map(([id,k])=>({key:'d:'+id,unit:{...C.levelStats(DDd.defs[id],dispatchLevel(id).lv),id,uid:'d:'+id},kind:k,dispatch:true}))];}
function renderCare(){const list=careList();tell('careCredits','資金 '+credits.toLocaleString()+' Cr');G.render($('careGrid'),list.map(x=>x.unit),{selected:u=>u.uid===carePick,badge:u=>downText(list.find(x=>x.unit.uid===u.uid).kind),onPick:u=>{if(carePick===u.uid){openCare(list.find(x=>x.unit.uid===u.uid));return;}carePick=u.uid;renderCare();focusTile('careGrid',u.uid);}});
 [...$('careGrid').querySelectorAll('.ug-tile')].forEach((t,i)=>{t.dataset.uid=list[i].key;});if(!list.length)$('careGrid').append(Object.assign(document.createElement('p'),{className:'cmd-hint',textContent:'大破・重傷のユニットはいません。'}));}
function openCare(x){const u=x.unit,c=repairCost(u),verb=x.kind==='injured'?'治療':'修理',done=why=>{carePick=null;renderCare();win(verb,u.name,[why||u.name+' が復帰しました。'],[['閉じる',close]]);};
 win(verb,u.name+'（'+downText(x.kind)+'）',[(x.dispatch?'PRO・D ・ ':'')+'Lv'+(u.level||1)+' ・ '+verb+'費 '+c.toLocaleString()+' Cr','資金 '+credits.toLocaleString()+' Cr','復帰すると出撃できるようになります。'],
  [[verb+'する（'+c.toLocaleString()+' Cr）',()=>done(recover(x.key,'credits',u)),credits<c,'care'],...reviveItems().map(it=>[it.name+'で復帰（残り '+free(it.id)+'）',()=>done(recover(x.key,it.id,u)),false,'item-'+it.id]),['閉じる',close]]);}
function renderFire(){const list=owned.map(unitOf);G.render($('fireGrid'),list,{selected:u=>u.uid===firePick,reason:u=>D.unit(u.id).noFire?'重要ユニット':'',badge:u=>dismissVerb(D.unit(u.id))+(u.down?'・'+downText(u.down):''),onPick:u=>{if(firePick===u.uid){openFire(u);return;}firePick=u.uid;renderFire();focusTile('fireGrid',u.uid);}});
 [...$('fireGrid').querySelectorAll('.ug-tile')].forEach((t,i)=>{t.dataset.uid=list[i].uid;});}
function openFire(u){const v=dismissVerb(D.unit(u.id)),why=D.unit(u.id).noFire?'重要ユニットは'+v+'できません':'';
 win(v,u.name,['Lv'+u.level+(u.equip?.some(Boolean)?' ・ 装備は倉庫に戻ります':''),why||v+'すると元に戻せません。'],[[v+'する',()=>{const r=dismiss(u.uid);firePick=null;renderFire();win(v,u.name,[r||u.name+' を'+v+'しました。'],[['閉じる',close]]);},!!why,'fire'],['戻る',close]]);}
const markCleared=id=>{if(id&&!cleared.includes(id)){cleared.push(id);save();}};
function focusTile(grid,uid){$(grid).querySelector('[data-uid="'+uid+'"]')?.focus();}
$('fusionReset').onclick=()=>{anchor=null;picks=[];pending=null;renderFusion();};
$('labWindow').addEventListener('cancel',e=>e.preventDefault());
showCredits();
// EXP for owned units (Tactical) by uid, and for PRO・D units by unit id. entries: [{key, amount}].
// Returns what changed so result screens can show level-ups.
function grant(entries,get,put,nameOf){const out=[];for(const {key,amount} of entries){const cur=get(key);if(!cur)continue;const r=C.gainExp(cur,amount);put(key,r);out.push({key,name:nameOf(key),amount,lv:r.lv,ups:r.ups,sp:r.sp});}save();return out;}
const gainExp=entries=>grant(entries,uid=>{const o=owned.find(x=>x.uid===uid);return o&&{lv:o.lv||1,exp:o.exp||0,sp:o.sp||0};},(uid,r)=>Object.assign(owned.find(x=>x.uid===uid),{lv:r.lv,exp:r.exp,sp:r.sp}),uid=>D.unit(owned.find(x=>x.uid===uid).id).name);
const dispatchLevel=id=>({lv:1,exp:0,sp:0,...(dlv[id]||{})});
const gainDispatchExp=(entries,names={})=>grant(entries,dispatchLevel,(id,r)=>{dlv[id]={lv:r.lv,exp:r.exp,sp:r.sp};},id=>names[id]||id);
window.PROUnitLab=Object.freeze({handleLosses,handleDispatchLosses,recover,repairCost,dismiss,renderCare,renderFire,isKey,dispatchState:id=>dlost.includes(id)?'lost':ddown[id]||null,supplyItems,applySupply,consumeItem,getPreset,setPreset,PRESETS,pickChoice,evalConds:cs=>C.evalConds(cs,state()),mergeFlags:f=>{Object.assign(flags,f||{});save();},deployProblem,missionLock,missionHidden,record,finishMission,evalStars,starText,setMissionNames,recruited:()=>[...recruited],flags:()=>({...flags}),setFlag:(k,v)=>{flags[k]=v;save();},renderUse,renderEquip,useItem,equip,free,setUseItem:id=>{useItemId=id;usePick=null;},renderShop,renderStorage,buy,sell,renderResearch,advanceDay,startResearch,cancelResearch,day:()=>day,items:()=>({...items}),done:()=>[...done],active:()=>active&&{...active},renderEvolve,renderFusion,renderProduction,markCleared,cleared:()=>[...cleared],gainExp,gainDispatchExp,dispatchLevel,registered:()=>[...registered],register,owned:()=>owned.map(unitOf),credits:()=>credits,reset(){serial=1;credits=START_CREDITS;owned=D.roster().map(u=>({uid:u.id,id:u.id}));registered=[];dlv={};hired={};cleared=[];items=D.startItems();day=1;done=[];active=null;notices=[];records={};flags={};recruited=[];wins=0;presets={dispatch:[],tactical:[]};dlost=[];ddown={};evoPick=null;prodPick=null;anchor=null;picks=[];pending=null;showCredits();save();}});
})();
