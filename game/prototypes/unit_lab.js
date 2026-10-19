/* Development / evolution and design / fusion screens (prototype). Owned units and credits are the test save
   (browser key PRO_TACTICAL_HQ, per data source). Units are picked on the shared unit grid. */
(function(){'use strict';
const C=window.PROCore,D=window.PROTacticalData,G=window.PROUnitGrid,$=id=>document.getElementById(id);
const seen=()=>window.PROUnitsSeen;
// Test player state: owned units (uid → unit id, level, EXP, skill points), credits, the production / hire list
// (unit ids registered by evolution or fusion settings) and PRO・D unit levels (by unit id). Stats follow PROCore.levelStats.
// Starting units keep their unit id as uid (the formation screen and its tests address them that way).
const HQ_KEY='PRO_TACTICAL_HQ',START_CREDITS=24800;
let serial=1,credits=START_CREDITS,owned=D.roster().map(u=>({uid:u.id,id:u.id})),registered=[],dlv={},hired={},cleared=[];
// A save made with another data source (built-in / maker) is ignored; units missing from the data are dropped.
try{const h=JSON.parse(localStorage.getItem(HQ_KEY)||'null');if(h&&h.source===D.source&&Array.isArray(h.owned)){owned=h.owned.filter(o=>{try{D.unit(o.id);return typeof o.uid==='string';}catch(e){return false;}});credits=Number.isFinite(h.credits)?h.credits:START_CREDITS;registered=Array.isArray(h.registered)?h.registered:[];dlv=h.dlv&&typeof h.dlv==='object'?h.dlv:{};hired=h.hired&&typeof h.hired==='object'?h.hired:{};cleared=Array.isArray(h.cleared)?h.cleared:[];serial=h.serial||1;}}catch(e){}
function save(){try{localStorage.setItem(HQ_KEY,JSON.stringify({source:D.source,owned,credits,serial,registered,dlv,hired,cleared}));}catch(e){}}
const unitOf=o=>({...C.levelStats(D.unit(o.id),o.lv||1),id:o.id,uid:o.uid,exp:o.exp||0,sp:o.sp||0}),counts=()=>owned.reduce((m,o)=>(m[o.id]=(m[o.id]||0)+1,m),{});
const state=u=>({credits,units:counts(),items:{},flags:{},day:1,cleared,hires:hired,unit:u?{...u,level:u.level||1}:undefined,rng:()=>0});
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
function status(e){const missing=(e.requires?.missions||[]).filter(m=>!cleared.includes(m)),r=C.evalConds(e.conds,state()),full=e.limit!=null&&(hired[e.id]||0)>=e.limit,afford=credits>=e.cost+r.costs.reduce((n,c)=>n+(c.credits||0),0);
 const why=missing.length?'作戦「'+missing.map(m=>D.mission(m)?.name||m).join('・')+'」のクリアが必要':!r.ok?'条件：'+condsText(e.conds):full?'雇える上限（'+e.limit+'）に達しています':!afford?'資金が足りません':'';return {ok:!why,why,r,open:!missing.length&&r.ok};}
let prodPick=null;
function renderProduction(){const list=entries().filter(e=>!e.hidden||status(e).open);tell('productionCredits','資金 '+credits.toLocaleString()+' Cr');
 G.render($('productionGrid'),list.map(e=>({...D.unit(e.unitId),id:e.unitId,uid:e.id})),{selected:u=>u.uid===prodPick,reason:u=>status(list.find(e=>e.id===u.uid)).why,badge:u=>list.find(e=>e.id===u.uid).cost.toLocaleString()+'Cr',onPick:u=>{if(prodPick===u.uid){openProduction(list.find(e=>e.id===u.uid));return;}prodPick=u.uid;renderProduction();focusTile('productionGrid',u.uid);}});
 [...$('productionGrid').querySelectorAll('.ug-tile')].forEach((t,i)=>{t.dataset.uid=list[i].id;});
 if(!list.length)$('productionGrid').append(Object.assign(document.createElement('p'),{className:'cmd-hint',textContent:'生産・雇用できるユニットはまだありません。'}));}
function openProduction(e){const u=D.unit(e.unitId),st=status(e),have=counts()[e.unitId]||0;
 win(verb(u),u.name,[(e.registered?'生産・雇用リスト（開発・設計で登録）':verb(u))+' ｜ 費用 '+e.cost.toLocaleString()+' Cr','所持 '+have+'体'+(e.limit!=null?' ｜ 雇用 '+(hired[e.id]||0)+' / '+e.limit:''),...(e.requires?.missions?.length?['必要：作戦「'+e.requires.missions.map(m=>D.mission(m)?.name||m).join('・')+'」のクリア']:[]),...(e.conds?.list?.length?['条件：'+condsText(e.conds)]:[]),st.ok?'Lv1で加わります。':'できません：'+st.why],
 [[verb(u)+'する',()=>{if(!status(e).ok)return;const r=status(e).r;pay([{credits:e.cost},...r.costs]);owned.push({uid:e.unitId+'#'+serial++,id:e.unitId,lv:1,exp:0,sp:0});hired[e.id]=(hired[e.id]||0)+1;save();seen().mark([e.unitId],'joined');prodPick=null;renderProduction();win('完了',u.name,[u.name+' が加わりました。（資金 残り '+credits.toLocaleString()+' Cr）'],[['閉じる',close]]);},!st.ok,'run'],['ユニット情報',()=>window.PROField?.showUnit({...u,id:e.unitId})],['閉じる',close]]);}
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
window.PROUnitLab=Object.freeze({renderEvolve,renderFusion,renderProduction,markCleared,cleared:()=>[...cleared],gainExp,gainDispatchExp,dispatchLevel,registered:()=>[...registered],register,owned:()=>owned.map(unitOf),credits:()=>credits,reset(){serial=1;credits=START_CREDITS;owned=D.roster().map(u=>({uid:u.id,id:u.id}));registered=[];dlv={};hired={};cleared=[];evoPick=null;prodPick=null;anchor=null;picks=[];pending=null;showCredits();save();}});
})();
