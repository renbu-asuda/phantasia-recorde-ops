/* Development / evolution and design / fusion screens (prototype). Owned units and credits are the test save
   (browser key PRO_TACTICAL_HQ, per data source). Units are picked on the shared unit grid. */
(function(){'use strict';
const C=window.PROCore,D=window.PROTacticalData,G=window.PROUnitGrid,$=id=>document.getElementById(id);
const seen=()=>window.PROUnitsSeen;
// Test player state: owned units (uid → unit id, level, EXP) and credits. Stats follow PROCore.levelStats.
// Starting units keep their unit id as uid (the formation screen and its tests address them that way).
const HQ_KEY='PRO_TACTICAL_HQ',START_CREDITS=24800;
let serial=1,credits=START_CREDITS,owned=D.roster().map(u=>({uid:u.id,id:u.id}));
// A save made with another data source (built-in / maker) is ignored; units missing from the data are dropped.
try{const h=JSON.parse(localStorage.getItem(HQ_KEY)||'null');if(h&&h.source===D.source&&Array.isArray(h.owned)){owned=h.owned.filter(o=>{try{D.unit(o.id);return typeof o.uid==='string';}catch(e){return false;}});credits=Number.isFinite(h.credits)?h.credits:START_CREDITS;serial=h.serial||1;}}catch(e){}
function save(){try{localStorage.setItem(HQ_KEY,JSON.stringify({source:D.source,owned,credits,serial}));}catch(e){}}
const unitOf=o=>({...C.levelStats(D.unit(o.id),o.lv||1),id:o.id,uid:o.uid,exp:o.exp||0}),counts=()=>owned.reduce((m,o)=>(m[o.id]=(m[o.id]||0)+1,m),{});
const state=u=>({credits,units:counts(),items:{},flags:{},day:1,unit:u?{...u,level:u.level||1}:undefined,rng:()=>0});
const name=id=>seen().has(id)?D.unit(id).name:'？？？';
const CMP={ge:'以上',le:'以下',eq:'ちょうど',lt:'未満'};
// Short text for the condition types the samples use; other types fall back to their id.
function condText(c){const n=v=>v+(CMP[c.cmp||'ge']);let t;switch(c.type){case 'credits_use':t='資金'+c.value+'を消費';break;case 'credits_have':t='資金'+n(c.value);break;case 'unit_level':t='Lv'+n(c.value);break;
 case 'unit_owned':t=name(c.unitId)+'を'+n(c.count??1)+'体所持';break;case 'item_has':t='アイテム'+c.itemId+'を'+n(c.count??1)+'個';break;case 'item_use':t='アイテム'+c.itemId+'×'+(c.count||1)+'を消費';break;default:t=c.type;}return (c.not?'【否定】':'')+t;}
const condsText=cs=>cs?.list?.length?cs.list.map(condText).join(cs.mode==='any'?' または ':' かつ '):'条件なし';
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
function confirmEvolve(u,{e,r}){const to=D.unit(e.to);win('確認',u.name+' → '+to.name,['この内容で開発・進化します。','条件：'+condsText(e.conds),r.costs.length?'消費：'+r.costs.map(c=>c.credits!=null?c.credits+' Cr':c.itemId+'×'+c.count).join('・'):'消費なし'],
 [['実行する',()=>{const o=owned.find(x=>x.uid===u.uid);if(!o)return;pay(r.costs);o.id=e.to;save();seen().mark([e.to],'joined');evoPick=null;renderEvolve();win('完了',to.name,[u.name+' が '+to.name+' に開発・進化しました。'],[['閉じる',close]]);},false,'run'],['戻る',()=>openEvolve(u)]]);}

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
function confirmFusion(f){const uids=[anchor,...picks],r=C.evalConds(f.conds,state()),res=f.result.unitId,used=f.materials.map(m=>m);
 // Pair each picked unit with a recipe slot so per-material consume flags apply to the right unit.
 const slots=[...used],plan=uids.map(uid=>{const o=owned.find(x=>x.uid===uid),i=slots.findIndex(m=>m.unitId===o.id);const m=slots.splice(i,1)[0];return {o,keep:m.consume===false};});
 win('確認','設計・合成',[plan.map(p=>D.unit(p.o.id).name+(p.keep?'（消費しない）':'')).join(' ＋ ')+' → '+D.unit(res).name,'条件：'+condsText(f.conds),r.costs.length?'消費：'+r.costs.map(c=>c.credits!=null?c.credits+' Cr':c.itemId+'×'+c.count).join('・'):'資金の消費なし'],
 [['実行する',()=>{pay(r.costs);const gone=new Set(plan.filter(p=>!p.keep).map(p=>p.o.uid));owned=owned.filter(o=>!gone.has(o.uid));for(let i=0;i<(f.result.count||1);i++)owned.push({uid:res+'#'+serial++,id:res,lv:1,exp:0});save();seen().mark([res],'joined');anchor=null;picks=[];renderFusion();win('完了',D.unit(res).name,['設計・合成で '+D.unit(res).name+' が加わりました。'],[['閉じる',close]]);},false,'run'],
  ['戻る',()=>{picks.pop();renderFusion();close();}]]);}
function focusTile(grid,uid){$(grid).querySelector('[data-uid="'+uid+'"]')?.focus();}
$('fusionReset').onclick=()=>{anchor=null;picks=[];pending=null;renderFusion();};
$('labWindow').addEventListener('cancel',e=>e.preventDefault());
showCredits();
// EXP for owned units (mission rewards). Returns what changed so the result screen can show level-ups.
function gainExp(uids,amount){const out=[];for(const uid of uids){const o=owned.find(x=>x.uid===uid);if(!o)continue;const r=C.gainExp({lv:o.lv||1,exp:o.exp||0},amount);o.lv=r.lv;o.exp=r.exp;out.push({uid,name:D.unit(o.id).name,lv:r.lv,ups:r.ups});}save();return out;}
window.PROUnitLab=Object.freeze({renderEvolve,renderFusion,gainExp,owned:()=>owned.map(unitOf),credits:()=>credits,reset(){serial=1;credits=START_CREDITS;owned=D.roster().map(u=>({uid:u.id,id:u.id}));evoPick=null;anchor=null;picks=[];pending=null;showCredits();save();}});
})();
