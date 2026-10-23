/* Development / evolution and design / fusion screens (prototype). Owned units and credits are the test save
   (browser key PRO_TACTICAL_HQ, per data source). Units are picked on the shared unit grid. */
(function(){'use strict';
const C=window.PROCore,D=window.PROTacticalData,G=window.PROUnitGrid,$=id=>document.getElementById(id);
const seen=()=>window.PROUnitsSeen;
// Test player state: owned units (uid → unit id, level, EXP, skill points), credits, the production / hire list
// (unit ids registered by evolution or fusion settings) and PRO・D unit levels (by unit id). Stats follow PROCore.levelStats.
// Starting units keep their unit id as uid (the formation screen and its tests address them that way).
const HQ_KEY='PRO_TACTICAL_HQ',START_CREDITS=10000;
// hireUnlocks: hire entry ids opened by a fusion result 「雇用を解禁」 (their unlock rules no longer apply).
let aside=[],hireUnlocks=[],serial=1,credits=START_CREDITS,owned=D.roster().map(u=>({uid:u.id,id:u.id})),registered=[],dlv={},hired={},cleared=[],items=D.startItems(),day=1,done=[],active=null,notices=[],records={},flags={},vars={},captives=[],recruited=[],wins=0,presets={dispatch:[],tactical:[]},dlost=[],ddown={},dtree={},boards={},dboards={},achieved={},history=[],stats={battles:0,win:0,lose:0,draw:0},briefs=[],evolved=[],fused=[],weekBase={day:1,weekday:new Date().getDay()};
// One save for every pack combination: units and items missing from the loaded data are dropped (removing a pack warns first);
// packs loaded for the first time (packs = origin ids already seen) bring their starting roster.
let packs=D.origins().map(o=>o.id);
// Save size: the records keep the 20 newest battles, but full logs only for the newest LOG_KEEP (each up to 1500
// lines); older ones keep their summary. The save is copied into the autosave and the slots, so this bounds them too.
const LOG_KEEP=5,trimHistory=list=>list.map((h,i)=>i<LOG_KEEP||!h.log?.length?h:{...h,log:[],logTrimmed:true});
try{const h=JSON.parse(localStorage.getItem(HQ_KEY)||'null');if(h&&Array.isArray(h.owned)){{const okU=o=>{try{D.unit(o.id);return typeof o.uid==='string';}catch(e){return false;}},all=[...h.owned,...(Array.isArray(h.aside)?h.aside:[])];owned=all.filter(okU);/* units of a chosen pack that couldn't be read wait aside until it loads again */aside=all.filter(o=>o&&typeof o.uid==='string'&&!okU(o)&&D.unreadable?.(o.id));}credits=Number.isFinite(h.credits)?h.credits:START_CREDITS;registered=Array.isArray(h.registered)?h.registered.filter(id=>{try{D.unit(id);return true;}catch(e){return false;}}):[];if(Array.isArray(h.registered)&&registered.length!==h.registered.length){h.registered=registered;try{localStorage.setItem(HQ_KEY,JSON.stringify(h));}catch(e){}}dlv=h.dlv&&typeof h.dlv==='object'?h.dlv:{};hired=h.hired&&typeof h.hired==='object'?h.hired:{};cleared=Array.isArray(h.cleared)?h.cleared:[];items=h.items&&typeof h.items==='object'?h.items:D.startItems();day=h.day>=1?h.day:1;evolved=Array.isArray(h.evolved)?h.evolved:[];fused=Array.isArray(h.fused)?h.fused:[];weekBase=h.weekBase&&Number.isInteger(h.weekBase.day)&&h.weekBase.day>=1&&Number.isInteger(h.weekBase.weekday)&&h.weekBase.weekday>=0&&h.weekBase.weekday<=6?{...h.weekBase}:{day,weekday:new Date().getDay()};done=Array.isArray(h.done)?h.done:[];active=h.active&&D.research().some(r=>r.id===h.active.id)?h.active:null;notices=Array.isArray(h.notices)?h.notices:[];records=h.records&&typeof h.records==='object'?h.records:{};flags=h.flags&&typeof h.flags==='object'?h.flags:{};vars=h.vars&&typeof h.vars==='object'?h.vars:{};captives=Array.isArray(h.captives)?h.captives.filter(c=>{try{D.unit(c.unitId);return true;}catch(e){return false;}}):[];recruited=Array.isArray(h.recruited)?h.recruited:[];wins=h.wins|0;dlost=Array.isArray(h.dlost)?h.dlost:[];dtree=h.dtree&&typeof h.dtree==='object'?h.dtree:{};boards=h.boards&&typeof h.boards==='object'?h.boards:{};{const has=uid=>owned.some(o=>o.uid===uid);for(const [k,v] of Object.entries(boards))if(!has(k)||!has(v))delete boards[k];}achieved=h.achieved&&typeof h.achieved==='object'?h.achieved:{};history=Array.isArray(h.history)?trimHistory(h.history.slice(0,20)):[];stats={battles:0,win:0,lose:0,draw:0,...(h.stats||{})};briefs=Array.isArray(h.briefs)?h.briefs:[];dboards=h.dboards&&typeof h.dboards==='object'?h.dboards:{};ddown=h.ddown&&typeof h.ddown==='object'?h.ddown:{};hireUnlocks=Array.isArray(h.hireUnlocks)?h.hireUnlocks:[];presets=h.presets&&typeof h.presets==='object'?{dispatch:h.presets.dispatch||[],tactical:h.presets.tactical||[]}:{dispatch:[],tactical:[]};serial=h.serial||1;
 const seen=Array.isArray(h.packs)?h.packs:D.origins().map(o=>o.id),ids=new Set(owned.map(o=>o.uid));for(const o of D.origins())if(!seen.includes(o.id)){for(const id of D.rosterOf(o.id)){let uid=id;while(ids.has(uid))uid=id+'-'+(serial++);ids.add(uid);owned.push({uid,id});}// a pack used for the first time also gives its starting items (once: the pack is then in 'packs')
   for(const [k,n] of Object.entries(D.startItemsOf?.(o.id)||{}))items[k]=(items[k]||0)+n;}
 const known=new Set((D.items()||[]).map(i=>i.id));for(const k of Object.keys(items))if(!known.has(k))delete items[k];}}catch(e){}
// Keep valid boarding across evolution / reload; invalid roles detach without losing either owned unit.
function cleanBoards(){const used=new Set();for(const [k,v] of Object.entries(boards)){const m=owned.find(o=>o.uid===k),p=owned.find(o=>o.uid===v);if(!m||!p||k===v||C.crewOf(D.unit(m.id))==='none'||!D.unit(p.id).pilotProfile||p.down||boards[v]||used.has(v)){delete boards[k];continue;}used.add(v);}}
// PRO・D pairs (machine id → pilot id): a machine or pilot no longer loaded (its pack removed), or no longer a pilot, leaves.
function cleanDBoards(){const DDd=window.PRODispatchData;if(!DDd)return;const used=new Set();for(const [k,v] of Object.entries(dboards)){const m=DDd.defs[k],p=DDd.defs[v];if(!m||!p||k===v||C.crewOf(m)==='none'||!p.pilotProfile||used.has(v)){delete dboards[k];continue;}used.add(v);}}
cleanBoards();cleanDBoards();
// save() also checks achievements (each pays its reward once; the check itself saves again without recursing).
// A save that does not fit (the browser's storage is full) is reported once, so progress is not lost unnoticed.
let saveWarned=false;function saveFailed(e){if(saveWarned)return;saveWarned=true;setTimeout(()=>{try{win('セーブできませんでした','ブラウザの保存領域',['進行をこのブラウザに保存できませんでした（保存領域がいっぱいの可能性があります）。','記録・設定 → セーブ・ロード で使っていないスロットを削除するか、パック管理で使っていないパックを外してから、もう一度操作してください。','（'+(e?.name||'')+'）'],[['閉じる',close]]);}catch(x){}},0);}
// Equipment past a unit's slots (after evolving into a form with fewer) goes back to the storage.
// Also equipment no longer defined (its pack removed) or not held any more (more equipped than owned) comes off.
function trimEquip(){try{const have={};for(const o of owned){try{const n=slotsOf(o);if((o.equip||[]).length>n)o.equip=o.equip.slice(0,n);if(o.equip)o.equip=o.equip.map(id=>{if(!id)return null;let ok=false;try{ok=!!D.item(id)?.equip;}catch(e){}if(!ok)return null;have[id]=(have[id]||0)+1;return have[id]<=(items[id]||0)?id:null;});if(o.equip&&!o.equip.some(Boolean))delete o.equip;}catch(e){}}}catch(e){}}
let checking=false;function save(check=true){trimEquip();try{showCredits();}catch(e){}if(check&&!checking){checking=true;try{checkAchievements();}finally{checking=false;}}try{localStorage.setItem(HQ_KEY,hqJson());}catch(e){saveFailed(e);}}
// The progress as saved (also used by file export / slots, so they get the latest progress even when the browser storage is full).
function hqJson(){return JSON.stringify({source:D.source,packs,owned,aside,credits,serial,registered,hireUnlocks,dlv,hired,cleared,items,day,evolved,fused,weekBase,done,active,notices,records,flags,vars,captives,recruited,wins,presets,dlost,ddown,dtree,boards,dboards,achieved,history,stats,briefs});}
// Skills learned from the unit's skill tree (published shape: nodes with id, cost, minLevel, requires, skill).
const treeSkills=(u,got)=>(u.skillTree||[]).filter(n=>(got||[]).includes(n.id)).map(n=>tryS(n.skill)).filter(Boolean);
// An owned unit's stats: level stats, then permanent item boosts (mods flat, pct %), then equipment. Item-added
// weapons / skills / tags and equipped weapons / skills are appended. Equipment slots: unit.equipSlots (default 2) + bonus.
const SLOT_DEFAULT=2,SLOT_MAX=8,STATS=['hp','atk','def','mob','acc'],tryW=w=>{if(D.normWeapon)return D.normWeapon(w);try{return C.weapon(w);}catch(e){return null;}},tryS=x=>{if(D.normSkill)return D.normSkill(x?{...x}:x);try{return C.skill({...x});}catch(e){return null;}};
const slotsOf=o=>Math.min(SLOT_MAX,Math.max(0,(D.unit(o.id).equipSlots??SLOT_DEFAULT)+(o.slotBonus||0)));
// Pilot boarding (published rules): a pilot (unit with pilotProfile) rides one unit whose crew is not 'none'. The unit
// gets the pilot's stat bonus (growing with the pilot's level), the pilot's skills, and its aptitude % on ATK / MOB /
// ACC when the unit has one of the aptitude tags. A riding pilot can't sortie alone; crew 'required' needs a pilot.
const isPilot=u=>!!u?.pilotProfile,crew=u=>C.crewOf(u);
// Pilot skills keep their map part (味方支援, 気力 ...); a map-only skill has no battle effect, only that part.
const pilotSkill=x=>x?.tacticalOnly?{id:x.id,name:x.name||x.id,tacticalOnly:true,tactical:C.clone(x.tactical||{})}:(s=>s&&x.tactical?{...s,tactical:C.clone(x.tactical)}:s)(tryS(x));
const pilotSkills=p=>(p.pilotProfile?.skills||[]).map(pilotSkill).filter(Boolean);
function applyPilot(u,p,plv){if(!isPilot(p))return u;const b=C.pilotBonus(p.pilotProfile,Math.max(1,Math.min(C.LEVEL_MAX||50,Math.round(Number(plv)||1)))),o={...u};for(const k of STATS)if(o[k]!=null&&b[k])o[k]+=b[k];
 const apt=p.pilotProfile.aptitude;if(apt?.pct&&(apt.tags||[]).some(t=>(o.tags||[]).includes(t)))for(const k of ['atk','mob','acc'])if(o[k]!=null)o[k]=Math.round(o[k]*(1+apt.pct/100));
 return {...o,skills:[...(o.skills||[]),...pilotSkills(p)]};}
const ridingIn=uid=>Object.keys(boards).find(k=>boards[k]===uid)||null;
function unitOf(o){const u=C.levelStats(D.unit(o.id),o.lv||1),gear=(o.equip||[]).slice(0,slotsOf(o)).filter(Boolean).map(id=>D.item(id)).filter(it=>it?.equip);
 for(const k of STATS){if(u[k]==null)continue;let v=u[k]+(o.mods?.[k]||0);v=Math.round(v*(1+(o.pct?.[k]||0)/100));for(const it of gear)v+=Number(it.equip.stats?.[k])||0;u[k]=k==='hp'?Math.max(1,v):Math.max(0,v);}
 const tags=new Set([...(u.tags||[]),...(o.tagsAdd||[])]);for(const t of o.tagsRemove||[])tags.delete(t);
 const po=boards[o.uid]&&owned.find(x=>x.uid===boards[o.uid]);if(po){const p=D.unit(po.id),b=applyPilot({...u,tags:[...tags]},p,po.lv||1);for(const k of STATS)u[k]=b[k];u.pilotSkills=pilotSkills(p);u.pilot={uid:po.uid,name:p.name,lv:po.lv||1};}
 return {...u,weapons:[...(u.weapons||[]),...(o.weapons||[]),...gear.flatMap(it=>(it.equip.weapons||[]).map(tryW).filter(Boolean))],skills:[...(u.skills||[]),...treeSkills(u,o.tree),...(u.pilotSkills||[]),...(o.skills||[]),...gear.flatMap(it=>(it.equip.skills||[]).map(tryS).filter(Boolean))],tags:[...tags],
  id:o.id,uid:o.uid,exp:o.exp||0,sp:o.sp||0,down:o.down||null,pilot:u.pilot||null,riding:ridingIn(o.uid),slots:slotsOf(o),equip:Array.from({length:slotsOf(o)},(_,i)=>(o.equip||[])[i]||null)};}
const counts=()=>owned.reduce((m,o)=>(m[o.id]=(m[o.id]||0)+1,m),{});
const state=u=>({credits,units:counts(),items:{...items},reserved:{items:Object.fromEntries(Object.keys(items).map(id=>[id,(active?.reserve?.[id]||0)+equipped(id)]))},research:done,flags:{...flags},vars:varsNow(),wins,stars:Object.fromEntries(Object.entries(records).map(([k,r])=>[k,(r.stars||[]).filter(Boolean).length])),day,weekBase:{...weekBase},evolved:[...evolved],fused:[...fused],cleared,hires:hired,unit:u?{...u,level:u.level||1}:undefined});
// A preview never draws: a nonzero possible chance may be attempted. The committed action rolls once.
// An 'any' set whose satisfied entries all cost something: take the first option that can be paid together with the
// other costs of the same action (base), instead of always the first one. Chance draws are shared between the tries.
const canPay=cs=>{const need={};let cr=0;for(const c of cs){if(c.credits!=null)cr+=Number(c.credits)||0;if(c.itemId)need[c.itemId]=(need[c.itemId]||0)+(Number(c.count)||1);}return credits>=cr&&Object.entries(need).every(([id,n])=>free(id)>=n);};
function withPick(cs,st,base=[]){const draws=[];let at=0;const src=st.rng||Math.random,rng=()=>{const i=at++;return draws[i]??(draws[i]=src());},run=pick=>{at=0;return C.evalConds(cs,{...st,rng,...(pick!=null?{pick}:{})});};
 const r=run();if(!r.ok||(r.options||[]).length<2||canPay([...base,...r.costs]))return r;for(let i=1;i<r.options.length;i++){const x=run(i);if(canPay([...base,...x.costs]))return x;}return r;}
function previewConds(cs,st,base=[]){const list=(cs?.list||[]).map(c=>c.type==='chance'?{...c,not:false,value:(c.not?Number(c.value)<100:Number(c.value)>0)?100:0}:c);return withPick({...cs,list},{...st,rng:()=>0},base);}
const rollConds=(cs,st,over={},base=[])=>withPick(cs,{...st,rng:Math.random,...over},base);
const COND_FAILED='条件が成立しませんでした。資金・素材は消費していません（確率条件は実行時に判定します）。';
const name=id=>seen().has(id)?D.unit(id).name:'？？？';
const CMP={ge:'以上',le:'以下',eq:'ちょうど',lt:'未満'};
// Short text for the condition types the samples use; other types fall back to their id.
function condText(c){const n=v=>v+(CMP[c.cmp||'ge']);let t;switch(c.type){case 'credits_use':t='資金'+c.value+'を消費';break;case 'credits_have':t='資金'+n(c.value);break;case 'unit_level':t='Lv'+n(c.value);break;
 case 'unit_owned':t=name(c.unitId)+'を'+n(c.count??1)+'体所持';break;case 'item_has':t='アイテム'+c.itemId+'を'+n(c.count??1)+'個';break;case 'item_use':t='アイテム'+c.itemId+'×'+(c.count||1)+'を消費';break;
 case 'mission_clear':t='作戦「'+missionName(c.missionId)+'」をクリア';break;case 'mission_stars':t='作戦「'+missionName(c.missionId)+'」の★'+n(c.value);break;case 'wins_total':t='勝利'+n(c.value)+'回';break;case 'day':t=n(c.value)+'日目';break;
 case 'chance':t='確率'+c.value+'%（実行時に判定）';break;case 'research_done':t='研究「'+(rById(c.researchId)?.name||c.researchId)+'」が完了';break;case 'flag':t=(c.on===false?'「'+c.flagId+'」が立っていない':'「'+c.flagId+'」が立っている');break;case 'var':{const v=(D.vars?.()||[]).find(x=>x.id===c.varId);t=(v?.name||c.varId)+'が'+n(c.value);break;}default:t=c.type;}return (c.not?'【否定】':'')+t;}
const condsText=cs=>cs?.list?.length?cs.list.map(condText).join(cs.mode==='any'?' または ':' かつ '):'条件なし';
// Production / hire list: registering also counts as an encounter.
function register(id){if(!registered.includes(id))registered.push(id);seen().mark([id],'registered');save();}
const carryText=keep=>keep?'レベル・経験値・スキルポイントを引き継ぐ':'Lv1から（引き継がない）';
// Pays condition costs (credits and items) all at once: when anything is short (reserved and equipped items can't be
// used), nothing changes and false is returned.
function pay(costs){const need={},cr=costs.reduce((n,c)=>n+(c.credits!=null?Number(c.credits)||0:0),0);for(const c of costs)if(c.itemId)need[c.itemId]=(need[c.itemId]||0)+(Number(c.count)||1);
 if(cr>credits||Object.entries(need).some(([id,n])=>free(id)<n))return false;credits-=cr;for(const [id,n] of Object.entries(need)){items[id]-=n;if(items[id]<=0)delete items[id];}showCredits();save();return true;}
const SHORT='資金か素材が足りません（予約中・装備中のアイテムは使えません）。';
function showCredits(){const b=$('hubCredits');if(b)b.textContent=credits.toLocaleString();const u=$('hubUnits');if(u)u.textContent=owned.length.toLocaleString();}
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
 const rows=evos.map(e=>{const r=previewConds(e.conds,state(u)),known=seen().has(e.to)||r.ok;return {e,r,label:'→ '+(known?D.unit(e.to).name:'？？？')+'（'+condsText(e.conds)+(r.ok?' ✓':' ✗')+'）'};});
 win('開発・進化',u.name+' の開発・進化先',['条件を満たした先を選ぶと確認します。'],[...rows.map(x=>[x.label,()=>confirmEvolve(u,x),!x.r.ok,x.e.id]),['閉じる',close]]);}
function confirmEvolve(u,{e,r}){const to=D.unit(e.to),keep=!!e.carry?.level;win('確認',u.name+' → '+to.name,['この内容で開発・進化します。','条件：'+condsText(e.conds),r.costs.length?'消費：'+r.costs.map(c=>c.credits!=null?c.credits+' Cr':c.itemId+'×'+c.count).join('・'):'消費なし',carryText(keep),...(e.carry?.equipment===false?['装備は外れて倉庫に戻ります']:[]),...(e.carry?.skills===false?['アイテムで習得したスキル・武装は引き継ぎません']:[]),e.register?'生産・雇用リストに '+to.name+' を登録します':'生産・雇用リストは変わりません'],
 [['実行する',()=>{const o=owned.find(x=>x.uid===u.uid);if(!o)return;const actual=rollConds(e.conds,state(unitOf(o)));if(!actual.ok){win('開発・進化',to.name,[COND_FAILED],[['閉じる',close]]);return;}if(!pay(actual.costs)){win('開発・進化',to.name,[SHORT],[['閉じる',close]]);return;}o.id=e.to;if(!evolved.includes(e.id))evolved.push(e.id);cleanBoards();if(!keep){o.lv=1;o.exp=0;o.sp=0;}
   // 引き継がない（explicitly off in the maker）: equipment goes back to the storage, item-learned skills / weapons go.
   if(e.carry?.equipment===false)delete o.equip;if(e.carry?.skills===false){delete o.skills;delete o.weapons;}save();seen().mark([e.to],'joined');if(e.register)register(e.to);evoPick=null;renderEvolve();win('完了',to.name,[u.name+' が '+to.name+' に開発・進化しました。',...(e.register?['生産・雇用リストに登録しました。']:[])],[['閉じる',close]]);},false,'run'],['戻る',()=>openEvolve(u)]]);}

/* ---------- design / fusion ---------- */
// The confirm window only opens for a recipe whose conditions hold, so it always names the result (as evolution does).
// First unit: two taps. Then partners that can still complete a recipe (with its conditions met) are bright;
// tapping toggles them. When the picks match a recipe exactly, the confirm window opens.
let anchor=null,picks=[];
const recipes=()=>D.fusions().map(f=>({f,need:f.materials.map(m=>m.unitId)}));
const ids=uids=>uids.map(uid=>owned.find(o=>o.uid===uid)?.id);
// Can the multiset `have` (unit ids) still grow into `need`?
const fits=(have,need)=>{const n=[...need];for(const id of have){const i=n.indexOf(id);if(i<0)return false;n.splice(i,1);}return true;};
const live=()=>{const a=owned.find(o=>o.uid===anchor);if(!a)return [];return recipes().filter(x=>fits([a.id,...ids(picks)],x.need)&&previewConds(x.f.conds,state()).ok);};
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
function confirmFusion(f){const uids=[anchor,...picks],r=previewConds(f.conds,state()),res=f.result.unitId,only=f.result.type==='register',keep=!only&&!!f.carry?.level,first=owned.find(o=>o.uid===anchor);
 // Pair each picked unit with a recipe slot so per-material consume flags apply to the right unit.
 const slots=[...f.materials],plan=uids.map(uid=>{const o=owned.find(x=>x.uid===uid),i=slots.findIndex(m=>m.unitId===o.id);const m=slots.splice(i,1)[0];return {o,keep:m.consume===false};});
 win('確認','設計・合成',[plan.map(p=>D.unit(p.o.id).name+(p.keep?'（消費しない）':'')).join(' ＋ ')+(only?' → 生産・雇用リストに '+D.unit(res).name:' → '+D.unit(res).name+((f.result.count||1)>1?' ×'+f.result.count:'')),'条件：'+condsText(f.conds),r.costs.length?'消費：'+r.costs.map(c=>c.credits!=null?c.credits+' Cr':c.itemId+'×'+c.count).join('・'):'資金の消費なし',...(only?['ユニットは増えません（生産・雇用の解禁のみ）']:[carryText(keep),f.result.register?'生産・雇用リストにも登録します':'生産・雇用リストは変わりません'])],
 [['実行する',()=>{const actual=rollConds(f.conds,state());if(!actual.ok){win('設計・合成',D.unit(res).name,[COND_FAILED],[['閉じる',close]]);return;}if(!pay(actual.costs)){win('設計・合成',D.unit(res).name,[SHORT],[['閉じる',close]]);return;}const base=keep?{lv:first.lv||1,exp:first.exp||0,sp:first.sp||0}:{lv:1,exp:0,sp:0},gone=new Set(plan.filter(p=>!p.keep).map(p=>p.o.uid));owned=owned.filter(o=>!gone.has(o.uid));for(const uid of gone)unboard(uid);
   if(!only){for(let i=0;i<(f.result.count||1);i++)owned.push({uid:res+'#'+serial++,id:res,...base});seen().mark([res],'joined');}if(!fused.includes(f.id))fused.push(f.id);if(f.result.hireId&&!hireUnlocks.includes(f.result.hireId))hireUnlocks.push(f.result.hireId);if(only||f.result.register)register(res);save();anchor=null;picks=[];renderFusion();
   win('完了',D.unit(res).name,[only?D.unit(res).name+' を生産・雇用リストに登録しました。':'設計・合成で '+D.unit(res).name+' が加わりました。',...(!only&&f.result.register?['生産・雇用リストにも登録しました。']:[])],[['閉じる',close]]);},false,'run'],
  ['戻る',()=>{picks.pop();renderFusion();close();}]]);}
/* ---------- production / hire ---------- */
// Entries: the pack's hire entries plus units on the production / hire list without one. A hire entry is available
// when its required missions are cleared and its conditions hold; hidden entries are listed only then.
// Units without a hire entry cost their hireCost (set in the maker), or a provisional price derived from their stats.
// joinVerb (hire / produce) only changes the wording; both are the same process. New units always join at Lv1.
const defaultCost=u=>u.hireCost??Math.max(100,Math.round(((u.hp||0)/4+(u.atk||0)*2+(u.def||0)*2)/100)*100);
const verb=u=>u.joinVerb==='produce'?'生産':u.joinVerb==='hire'?'雇用':'生産・雇用';
function entries(){const hs=D.hires(),out=hs.map(h=>({...h,cost:h.cost??defaultCost(D.unit(h.unitId))}));for(const id of registered)if(!out.some(e=>e.unitId===id)){let u;try{u=D.unit(id);}catch(e){continue;}out.push({id:'reg-'+id,unitId:id,cost:defaultCost(u),registered:true});}return out;}
// A unit's own joining conditions (メーカー「加入の条件」) for hires and drops; joinRoll is the committed check (with costs).
const joinConds=id=>{try{const c=D.unit(id)?.joinConds;return c?.list?.length?c:null;}catch(e){return null;}},joinUnit=id=>{try{return C.levelStats(D.unit(id),1);}catch(e){return undefined;}},joinOk=id=>{const c=joinConds(id);return !c||previewConds(c,state(joinUnit(id))).ok;},joinRoll=id=>{const c=joinConds(id);return c?rollConds(c,state(joinUnit(id))):{ok:true,costs:[]};};/* conditions on the unit (tags, level) see the joining unit */
// A hire from a battlefield production facility: the base's unlock / hidden / joining rules and the hire limit (the
// keep-able units already made in this mission count), not the base's credits (the battlefield funds pay).
function fieldHireBlock(e,pending=0){const st=status(e);if(!st.open)return st.why||'まだ雇えません';if(e.limit!=null&&(hired[e.id]||0)+pending>=e.limit)return '雇える上限（'+e.limit+'）に達しています';return '';}
// Producing that hire: its conditions and the unit's joining conditions are rolled once and their costs paid from the
// base (the battlefield funds pay the price itself). Returns why it failed, or ''.
function fieldHirePay(e){if(!e)return '見つかりません';const r=rollConds(e.conds,state()),j=joinRoll(e.unitId);if(!r.ok||!j.ok)return COND_FAILED;const costs=[...(r.costs||[]),...(j.costs||[])];if(costs.length&&!pay(costs))return SHORT;return '';}
const noteHire=id=>{hired[id]=(hired[id]||0)+1;save();};
function status(e){const req=hireUnlocks.includes(e.id)?{}:e.requires||{},missing=(req.missions||[]).filter(m=>!cleared.includes(m)),needR=(req.research||[]).filter(x=>!done.includes(x)),needDay=Number(req.day)>day?Number(req.day):0,needI=(req.items||[]).filter(x=>!((items[x]||0)>0)),r=previewConds(e.conds,state(),[{credits:e.cost}]),full=e.limit!=null&&(hired[e.id]||0)>=e.limit,afford=credits>=e.cost+r.costs.reduce((n,c)=>n+(c.credits||0),0);
 const why=missing.length?'作戦「'+missing.map(m=>D.mission(m)?.name||m).join('・')+'」のクリアが必要':needR.length?'研究「'+needR.map(x=>D.research().find(r=>r.id===x)?.name||x).join('・')+'」が必要':needDay?needDay+'日目から雇えます':!joinOk(e.unitId)?'加入の条件：'+condsText(joinConds(e.unitId)):needI.length?'キーアイテム「'+needI.map(x=>D.itemName(x)).join('・')+'」が必要':!r.ok?'条件：'+condsText(e.conds):full?'雇える上限（'+e.limit+'）に達しています':!afford?'資金が足りません':'';return {ok:!why,why,r,open:!missing.length&&!needR.length&&!needDay&&!needI.length&&joinOk(e.unitId)&&r.ok};}
/* ---------- variables (変数): numbers kept in the save (scope 'game'; 'mission' ones live in a mission only).
   ops: [{varId, op: add | sub | set, value}]; results are kept within the variable's min / max. ---------- */
const varDef=id=>(D.vars?.()||[]).find(v=>v.id===id);
const varsNow=()=>{const out={};for(const v of D.vars?.()||[])if(v.scope!=='mission')out[v.id]=v.id in vars?Number(vars[v.id])||0:v.initial||0;return out;};
function varStep(cur,o,def){const n=Number(o.value)||0;let v=o.op==='set'?n:o.op==='sub'?cur-n:cur+n;if(def?.min!=null)v=Math.max(def.min,v);if(def?.max!=null)v=Math.min(def.max,v);return v;}
function applyVarOps(ops,base=varsNow()){const out={...base};for(const o of ops||[]){const d=varDef(o.varId);if(!d||d.scope==='mission')continue;out[o.varId]=varStep(out[o.varId]??d.initial??0,o,d);}return out;}
function changeVars(ops){if(!(ops||[]).length)return;Object.assign(vars,applyVarOps(ops));save();}
/* ---------- 鹵獲一覧: units seized in missions wait here; the player makes them their own (with the pilot that was
   aboard, if any) or lets them go. ---------- */
function addCaptives(list){for(const c of list||[])captives.push({id:'cap'+(serial++),unitId:c.unitId,name:c.name,...(c.pilot?{pilot:c.pilot}:{}),from:c.from||''});save();}
function openCaptives(){const pn=c=>{try{return c.pilot?' ＋パイロット '+D.unit(c.pilot.unit).name+' Lv'+(c.pilot.lv||1):'';}catch(e){return '';}};
 win('鹵獲一覧',captives.length+'体',captives.length?captives.map(c=>c.name+pn(c)+(c.from?' ｜ '+c.from:'')):['鹵獲したユニットはいません。'],[...captives.flatMap(c=>[['仲間にする：'+c.name,()=>{captives=captives.filter(x=>x.id!==c.id);join(c.unitId,c.pilot);save();openCaptives();},false,'take-'+c.id],['手放す：'+c.name,()=>{captives=captives.filter(x=>x.id!==c.id);save();openCaptives();},false,'free-'+c.id]]),['閉じる',close]]);}
let prodPick=null;
const pilotOf=e=>{try{const p=e.pilot?.unit&&D.unit(e.pilot.unit);return isPilot(p)?p.name+' Lv'+Math.max(1,Number(e.pilot.lv)||1):'';}catch(x){return '';}};
function renderProduction(){const list=entries().filter(e=>!e.hidden||status(e).open);tell('productionCredits','資金 '+credits.toLocaleString()+' Cr');
 G.render($('productionGrid'),list.map(e=>({...D.unit(e.unitId),id:e.unitId,uid:e.id})),{selected:u=>u.uid===prodPick,reason:u=>status(list.find(e=>e.id===u.uid)).why,badge:u=>list.find(e=>e.id===u.uid).cost.toLocaleString()+'Cr',onPick:u=>{if(prodPick===u.uid){openProduction(list.find(e=>e.id===u.uid));return;}prodPick=u.uid;renderProduction();focusTile('productionGrid',u.uid);}});
 [...$('productionGrid').querySelectorAll('.ug-tile')].forEach((t,i)=>{t.dataset.uid=list[i].id;});
 if(!list.length)$('productionGrid').append(Object.assign(document.createElement('p'),{className:'cmd-hint',textContent:'生産・雇用できるユニットはまだありません。'}));}
function openProduction(e){const u=D.unit(e.unitId),st=status(e),have=counts()[e.unitId]||0;
 win(verb(u),u.name,[(e.registered?'生産・雇用リスト（開発・設計で登録）':verb(u))+' ｜ 費用 '+e.cost.toLocaleString()+' Cr','所持 '+have+'体'+(e.limit!=null?' ｜ 雇用 '+(hired[e.id]||0)+' / '+e.limit:''),...(e.requires?.missions?.length?['必要：作戦「'+e.requires.missions.map(m=>D.mission(m)?.name||m).join('・')+'」のクリア']:[]),...(e.conds?.list?.length?['条件：'+condsText(e.conds)]:[]),...(pilotOf(e)?['パイロット：'+pilotOf(e)+'（費用に込み・乗った状態で加わります）']:crew(u)==='required'?['この機体はパイロットが必要です（加わったあと「搭乗」で乗せてください）']:[]),st.ok?'Lv1で加わります。':'できません：'+st.why],
 [[verb(u)+'する',()=>{if(!status(e).ok)return;const r=rollConds(e.conds,state(),{},[{credits:e.cost}]),j=joinRoll(e.unitId);if(!r.ok||!j.ok){win(verb(u),u.name,[COND_FAILED],[['閉じる',close]]);return;}if(!pay([{credits:e.cost},...r.costs,...j.costs])){win(verb(u),u.name,[SHORT],[['閉じる',close]]);return;}join(e.unitId,e.pilot);hired[e.id]=(hired[e.id]||0)+1;save();prodPick=null;renderProduction();win('完了',u.name,[u.name+' が加わりました。（資金 残り '+credits.toLocaleString()+' Cr）'],[['閉じる',close]]);},!st.ok,'run'],['ユニット情報',()=>window.PROField?.showUnit({...u,id:e.unitId})],['閉じる',close]]);}
/* ---------- research ---------- */
// One research at a time. Start: pay credits, reserve cost.items (they stay owned but can't be used elsewhere).
// The in-game day advances when a mission ends; on the finishing day the reserved items are consumed and the
// unlocks apply. Cancelling refunds the credits and releases the reservation. Completion notes wait in `notices`.
const rById=id=>D.research().find(r=>r.id===id),itemText=o=>Object.entries(o||{}).map(([id,n])=>D.itemName(id)+'×'+n).join('・');
// Usable count: owned minus research reservations minus equipped copies.
const equipped=id=>owned.reduce((n,o)=>n+(o.equip||[]).slice(0,slotsOf(o)).filter(x=>x===id).length,0);
const free=id=>(items[id]||0)-(active?.reserve?.[id]||0)-equipped(id);
function researchPlan(r,c){const costs=[{credits:r.cost?.credits||0},...c.costs,...Object.entries(r.cost?.items||{}).map(([itemId,count])=>({itemId,count}))],split=C.researchCosts(costs),reserve={};for(const x of split.complete)reserve[x.itemId]=(reserve[x.itemId]||0)+x.count;return {paid:split.start.reduce((n,x)=>n+x.credits,0),reserve};}
function researchStatus(r){if(done.includes(r.id))return {state:'done',why:'完了済み'};if(active?.id===r.id)return {state:'active',why:'研究中（あと'+Math.max(0,active.until-day)+'日）'};
 const needR=(r.requires||[]).filter(x=>!done.includes(x)),c=previewConds(r.conds,state()),plan=researchPlan(r,c),lack=Object.entries(plan.reserve).filter(([id,n])=>free(id)<n);
 const why=active?'ほかの研究を進行中':needR.length?'先に「'+needR.map(x=>rById(x)?.name||x).join('・')+'」が必要':!c.ok?'条件：'+condsText(r.conds):credits<plan.paid?'資金が足りません':lack.length?'素材が足りません（'+lack.map(([id,n])=>D.itemName(id)+' '+free(id)+'/'+n).join('・')+'）':'';
 return {state:why?'blocked':'ready',why,open:!needR.length&&c.ok,plan};}
function startResearch(id){const r=rById(id);if(!r||researchStatus(r).state!=='ready')return false;const c=rollConds(r.conds,state());if(!c.ok)return false;const plan=researchPlan(r,c);if(credits<plan.paid||Object.entries(plan.reserve).some(([k,n])=>free(k)<n)||!pay([{credits:plan.paid}]))return false;active={id,start:day,until:day+Math.max(1,r.days||1),paid:plan.paid,reserve:plan.reserve};save();return true;}
function cancelResearch(){if(!active)return false;credits+=active.paid||0;active=null;showCredits();save();return true;}
function completeResearch(){const r=rById(active.id);addBrief('research:'+active.id,'研究「'+(r?.name||active.id)+'」完了',r?.doneText);for(const [id,n] of Object.entries(active.reserve||{}))items[id]=Math.max(0,(items[id]||0)-n);
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
 win('研究',r.name,[r.desc||'',(r.days||1)+'日 ｜ 開始時に '+(st.plan?.paid??active?.paid??r.cost?.credits??0).toLocaleString()+' Cr',Object.keys(st.plan?.reserve||active?.reserve||r.cost?.items||{}).length?'素材（完了時に消費・それまで予約）：'+itemText(st.plan?.reserve||active?.reserve||r.cost.items):'素材なし',...(r.requires?.length?['先に必要：'+r.requires.map(x=>rById(x)?.name||x).join('・')]:[]),'完了すると：'+(gets.join('、')||'なし'),st.state==='ready'?'研究を始められます。':st.why].filter(Boolean),
  [...(st.state==='active'?[['研究を取りやめる',()=>win('確認','研究を取りやめますか？',['資金 '+(active.paid||0).toLocaleString()+' Cr を返金し、素材の予約を解除します。'],[['取りやめる',()=>{cancelResearch();renderResearch();openResearch(id);},false,'cancel'],['戻る',()=>openResearch(id)]]),false,'stop']]:[['研究を始める',()=>{if(startResearch(id)){renderResearch();win('開始',r.name,[r.name+' を始めました。'+(active.until)+'日目に完了します。'],[['閉じる',close]]);}else win('研究を開始できません',r.name,[COND_FAILED],[['閉じる',close]]);},st.state!=='ready','run']]),['閉じる',close]]);}
/* ---------- shop / storage ---------- */
// Listed in the shop when the item has a price and its gates are met: shop.requiresMission cleared,
// shop.requiresResearch done, conds hold, and any research whose unlock.items names it is done. Selling gives half
// the price (rounded down); key items and reserved quantities cannot be sold.
const sellPrice=it=>it.key||it.price==null?null:Math.floor(it.price/2);
function shopGate(it){const s=it.shop||{},gates=D.research().filter(r=>(r.unlock?.items||[]).includes(it.id));
 if(s.requiresMission&&!cleared.includes(s.requiresMission))return '作戦「'+(D.mission(s.requiresMission)?.name||s.requiresMission)+'」のクリアで入荷';
 if(s.requiresResearch&&!done.includes(s.requiresResearch))return '研究「'+(rById(s.requiresResearch)?.name||s.requiresResearch)+'」で入荷';
 if(gates.length&&!gates.some(r=>done.includes(r.id)))return '研究「'+gates.map(r=>r.name).join('・')+'」で入荷';
 if(it.conds?.list?.length&&!previewConds(it.conds,state()).ok)return '条件：'+condsText(it.conds);return '';}
function buy(id,n=1){const it=D.item(id);if(!it||it.price==null||shopGate(it)||credits<it.price*n)return false;const c=rollConds(it.conds,state(),{},[{credits:it.price*n}]);/* the price counts when an 'any' branch is chosen */if(!c.ok||!pay([{credits:it.price*n},...c.costs]))return false;items[id]=(items[id]||0)+n;showCredits();save();return true;}
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
// An item with only variable changes (varOps) is usable at the base too.
// Key items (key: 使わない・売れない) are never used.
const usable=it=>!it.key&&((it.effects||[]).length>0||(it.varOps||[]).length>0)&&(it.effects||[]).every(e=>BASE_EFFECTS.includes(e.type));
// A unit is chosen for unit effects, and also for conditions / limits on the unit (a cash item for humans only).
const UNIT_CONDS=['unit_level','unit_stat','unit_tag'],needsUnit=it=>it.scope!=='party'&&((it.effects||[]).some(e=>!['credits_gain','recruit_unit','loot_box'].includes(e.type))||(it.useConds?.list||[]).some(c=>UNIT_CONDS.includes(c.type))||it.limitPerUnit>0);
// Tag requirements (requires.allTags / anyTags / noneTags) gate using and equipping an item on a unit.
const tagBlock=(it,o)=>{if(!it?.requires||!o)return '';try{const r=C.checkRequirements(it.requires,unitOf(o));return r.ok?'':r.reason;}catch(e){return '';}};
/* Items used in a mission (field): the base's rules for each target — tags (requires), the per-unit limit and the use
   conditions with their costs. t = {unit (its current definition), uid, used (uses so far, for units not owned)}. */
// Uses so far per unit: owned units keep them (o.used), PRO・D units (key 'd:id') in their PRO・D record, others pass used.
const usedOf=(t,id)=>{const o=t.uid?owned.find(x=>x.uid===t.uid):null;if(o)return o.used?.[id]||0;if(String(t.key||'').startsWith('d:'))return dlv[t.key.slice(2)]?.used?.[id]||0;return Number(t.used)||0;};
function noteUse(t,id){const o=t.uid?owned.find(x=>x.uid===t.uid):null;if(o){o.used=o.used||{};o.used[id]=(o.used[id]||0)+1;}else if(String(t.key||'').startsWith('d:')){const k=t.key.slice(2),d=dispatchLevel(k);dlv[k]={...d,used:{...(d.used||{}),[id]:(d.used?.[id]||0)+1}};}}
function fieldBlock(it,t){if(!it)return '不明なアイテムです';if(it.key)return 'キーアイテムは使えません';if(free(it.id)<1)return '使える数がありません';if(it.requires){try{const r=C.checkRequirements(it.requires,t.unit);if(!r.ok)return r.reason;}catch(e){}}
 const n=usedOf(t,it.id);if(it.limitPerUnit&&n>=it.limitPerUnit)return 'このユニットにはもう使えません（'+it.limitPerUnit+'回まで）';
 if(it.useConds?.list?.length&&!previewConds(it.useConds,{...state(t.unit),...(t.ctx||{})}).ok)return '条件：'+condsText(it.useConds);return '';}
// One attempt (party items: all targets share the chance draws). Pays the item and the condition costs; returns the
// uids it works on, or {why}.
// opts.deferVars(ops): the battlefield queues the item's variable changes with the mission's own (applied in order at the end).
function fieldUse(id,targets,opts={}){const it=D.item(id);const ok=targets.filter(t=>!fieldBlock(it,t));if(!ok.length)return {why:targets.length?fieldBlock(it,targets[0]):'対象がいません'};
 const draws=[],check=t=>{let at=0;return rollConds(it.useConds,state(t.unit),{...(t.ctx||{}),rng:()=>{const i=at++;return draws[i]??(draws[i]=Math.random());}});},res=ok.map(t=>({t,r:check(t)})).filter(x=>x.r.ok);if(!res.length)return {why:COND_FAILED};
 if(!pay([{itemId:id,count:1},...(res[0].r.costs||[])]))return {why:SHORT};for(const {t} of res)noteUse(t,id);if((it.varOps||[]).length){if(opts.deferVars)opts.deferVars(C.clone(it.varOps));else Object.assign(vars,applyVarOps(it.varOps));}save();return {uids:res.map(x=>x.t.uid||x.t.key)};}
function useBlock(it,o){if(it.key)return 'キーアイテムは使えません';for(const e of it.effects||[]){if(e.type==='recruit_unit'&&!joinOk(e.unitId))return '加入の条件：'+condsText(joinConds(e.unitId));if(e.type==='add_weapon'&&!tryW(e.weapon))return '追加する武装が見つかりません';if(e.type==='add_skill'&&!tryS(e.skill))return '習得するスキルが見つかりません';
  // Learning the same skill / weapon twice is refused before anything is spent.
  if(o&&e.type==='add_skill'){const k=tryS(e.skill),has=unitOf(o).skills||[];if(k&&has.some(x=>(k.id&&x.id===k.id)||(!k.id&&x.name===k.name)))return '「'+k.name+'」は習得済みです';}
  if(o&&e.type==='add_weapon'){const w=tryW(e.weapon),has=unitOf(o).weapons||[];if(w&&has.some(x=>(w.key&&x.key===w.key)||(!w.key&&x.name===w.name)))return '「'+w.name+'」はもう持っています';}}if(!usable(it))return (it.effects||[]).length?'作戦中に使う効果です（拠点では使えません）':'使えないアイテムです';if(free(it.id)<1)return '使える数がありません';{const t=tagBlock(it,o);if(t)return t;}
 if(o&&it.limitPerUnit&&(o.used?.[it.id]||0)>=it.limitPerUnit)return 'このユニットにはもう使えません（'+it.limitPerUnit+'回まで）';
 if((o||it.scope!=='party')&&it.useConds?.list?.length&&!previewConds(it.useConds,state(o?unitOf(o):undefined)).ok)return '条件：'+condsText(it.useConds);return '';}
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
 const party=it.scope==='party',candidates=party?owned.filter(o=>!useBlock(it,o)):target?[target]:[];if(party&&!candidates.length)return '使えるユニットがいません（使用回数・条件を確認してください）';
 // A party item is one attempt: all targets share each chance draw, while their level / tags / limits differ.
 const draws=[],check=o=>{let at=0;return rollConds(it.useConds,state(o?unitOf(o):undefined),{rng:()=>{const i=at++;return draws[i]??(draws[i]=Math.random());}});},results=candidates.map(o=>({o,r:check(o)})).filter(x=>x.r.ok),global=!party&&!target?check(null):null;
 if((party||target)&&!results.length||global&&!global.ok)return COND_FAILED;
 // A unit joining by the item meets its own joining conditions (and pays them) like a hire or drop.
 const joins=(it.effects||[]).filter(e=>e.type==='recruit_unit').map(e=>joinRoll(e.unitId));if(joins.some(j=>!j.ok))return COND_FAILED;
 const costs=[...((results[0]?.r||global)?.costs||[]),...joins.flatMap(j=>j.costs||[])];if(!pay([{itemId:id,count:1},...costs]))return SHORT;
 const notes=[],targets=results.map(x=>x.o);for(const e of it.effects||[]){if(['credits_gain','recruit_unit','loot_box'].includes(e.type))applyGlobal(e,notes);else for(const o of targets)applyEffect(e,o,notes);}
 if((it.varOps||[]).length){Object.assign(vars,applyVarOps(it.varOps));notes.push('変数が変わった');}
 for(const o of targets){o.used=o.used||{};o.used[id]=(o.used[id]||0)+1;}save();return notes;}
// equip(uid, slot, itemId|null): an item can be equipped only while a free copy remains.
function equip(uid,slot,id){const o=owned.find(x=>x.uid===uid);if(!o||slot<0||slot>=slotsOf(o))return false;const cur=(o.equip||[])[slot]||null;if(id&&id!==cur){const it=D.item(id);if(!it?.equip||free(id)<1||tagBlock(it,o))return false;}o.equip=Array.from({length:slotsOf(o)},(_,i)=>(o.equip||[])[i]||null);o.equip[slot]=id||null;save();return true;}
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
 win('装備','枠'+(slot+1)+'に装備するもの',[cur?'いま：'+D.itemName(cur):'いま：空き'],[...gear.map(it=>{const tb=tagBlock(it,o);return [(it.id===cur?'✓ ':'')+it.name+'（使える '+free(it.id)+'）'+(desc(it)?' '+desc(it):'')+(tb&&it.id!==cur?' — '+tb:''),()=>{equip(uid,slot,it.id);renderEquip();openEquip(uid);},it.id!==cur&&(free(it.id)<1||!!tb),'gear-'+it.id];}),['外す',()=>{equip(uid,slot,null);renderEquip();openEquip(uid);},!cur,'unequip'],['戻る',()=>openEquip(uid)]]);}
/* ---------- missions (Tactical and PRO・D) ---------- */
// Same rules as the published game: requires.flags / missions / items (key items owned) / research, the mission's
// condition set, and allowed weekdays (real weekday). Hidden missions are not listed while locked. Records keep
// clears, best turns and stars; new stars pay starReward (default 20% of the reward) once.
const record=id=>records[id]||{clears:0,best:0,stars:[]};
function missionLock(m){if(m&&window.PROTrialMission===m.id)return '';const r=m.requires||{};
 if(r.flags&&Object.entries(r.flags).some(([k,v])=>!!flags[k]!==!!v))return '分岐条件：'+Object.entries(r.flags).map(([k,v])=>k+(v?'':'（OFF）')).join('・');
 const miss=(r.missions||[]).filter(id=>!cleared.includes(id));if(miss.length)return '前提作戦が未クリア：'+miss.map(id=>missionName(id)).join('・');
 const keys=(r.items||[]).filter(id=>!((items[id]||0)>0));if(keys.length)return '必要なキーアイテム：'+keys.map(D.itemName).join('・');
 const res=(r.research||[]).filter(id=>!done.includes(id));if(res.length)return '必要な研究：'+res.map(id=>rById(id)?.name||id).join('・');
 if(m.conds?.list?.length&&!previewConds(m.conds,state()).ok)return '条件：'+condsText(m.conds);
 if(m.days?.length&&!m.days.includes(new Date().getDay()))return '出撃できる曜日：'+m.days.map(d=>'日月火水木金土'[d]).join('・');return '';}
// Deploy rules (published rules): minimum level, terrain-banned tags, the mission's deploy_tags rule.
// The required level is the squad's highest level (levelProblem, checked on the lineup), not each unit's.
const levelProblem=(m,levels)=>m?.requires?.minLevel&&Math.max(0,...levels.map(Number))<m.requires.minLevel?'Lv'+m.requires.minLevel+'以上のユニットが必要です（部隊の最高Lv）':'';
function deployProblem(m,u,level=1){
 let ban=[];try{ban=C.terrainMods(m).banTags||[];}catch(e){}const tags=u.tags||[],b=ban.filter(t=>tags.includes(t));if(b.length)return '地形「'+(m.terrain||'')+'」では「'+b.join('・')+'」は出撃不可';
 const rule=(m?.rules||[]).find(r=>r&&r.type==='deploy_tags');if(rule){try{const ok=C.checkRequirements(rule,u);if(!ok.ok)return '出撃制限 '+ok.reason;}catch(e){}}return '';}
const missionHidden=m=>!!m.hidden&&!!missionLock(m);
let missionName=id=>D.mission(id)?.name||id;const setMissionNames=f=>{missionName=f;};
// Base menus a pack opens step by step (pack hqUnlock): '' when open, else why it is closed.
// The setting is a tactical mission id (cleared opens it) or a condition set (holds opens it; nothing is spent).
function hqLock(key){const v=D.hqUnlock?.()[key];if(!v)return '';if(typeof v==='string')return cleared.includes(v)?'':'作戦「'+missionName(v)+'」をクリアすると使えます';
 if(!v.list?.length||previewConds(v,state()).ok)return '';return '条件：'+condsText(v);}
// Star checks: clear, no_loss (no deployed unit fell), turns_le, hp_ge (remaining HP % of the deployed units).
function evalStars(m,{win,turns,lost,hpPct}){return C.missionStars(m).map(s=>win&&(s.type==='clear'||(s.type==='no_loss'&&!lost)||(s.type==='turns_le'&&turns<=s.value)||(s.type==='hp_ge'&&hpPct>=s.value)));}
const starText=s=>s.type==='clear'?'クリア':s.type==='no_loss'?'撃破されずにクリア':s.type==='turns_le'?s.value+'ターン以内':s.type==='hp_ge'?'残りHP'+s.value+'%以上':s.type;
// finishMission: credits (win: reward; draw 25%; loss 12%), drops (row conditions, then rate) on a win, stars and
// their first-time bonus, the record, cleared list and win count, and units whose recruit.missionId is this mission.
// Briefing notices (作戦情報のお知らせ): each key once, newest first; kept as the past notices (up to 100).
function addBrief(key,title,text){if(!text||briefs.some(b=>b.key===key))return false;briefs.unshift({key,day,title,text});briefs=briefs.slice(0,100);return true;}
// Pack notices whose conditions hold now, and unlock texts of missions that are open now.
function checkBriefs(){let n=0;for(const x of D.notices?.()||[])if((!x.conds?.list?.length||rollConds(x.conds,state()).ok)&&addBrief('notice:'+x.id,x.name||'お知らせ',x.body))n++;
 const DD=window.PRODispatchData,dm=DD?(DD.listing?.()||[]).map(x=>DD.mission(x.id)).filter(Boolean):[];
 for(const m of [...(D.missions?.()||[]),...dm])if(m.unlockText&&!missionHidden(m)&&!missionLock(m)&&addBrief('unlock:'+m.id,'新しい作戦「'+m.name+'」',m.unlockText))n++;if(n)save();return n;}
function finishMission(m,{outcome,turns,lost=false,hpPct=100,reward=0,itemsWon={},recruitPool=null,itemName=D.itemName}){const win=outcome==='win',rep={credits:0,items:[],stars:[],newStars:0,starCredits:0,recruits:[]};Object.assign(vars,applyVarOps(m.resultVars?.[win?'win':'lose']));
 rep.credits=Math.round(win?reward:reward*(outcome==='draw'?.25:.12));credits+=rep.credits;
 if(win){for(const [id,n] of Object.entries(itemsWon)){items[id]=(items[id]||0)+n;rep.items.push({id,name:itemName(id),count:n});}
  for(const d of m.drops||[]){let valid;try{valid=d.unitId?D.unit(d.unitId):D.item(d.itemId);}catch(e){}if(!valid)continue;const c0=rollConds(d.conds,state()),j=d.unitId?joinRoll(d.unitId):{ok:true,costs:[]};if(!c0.ok||!j.ok)continue;const c={...c0,costs:[...(c0.costs||[]),...j.costs]};let p;try{p=C.dropChance(d);}catch(e){p=(d.chance??100)/100;}if(Math.random()>=p)continue;const n=(d.min??1)+Math.floor(Math.random()*((d.max??d.min??1)-(d.min??1)+1));if(n<=0||!pay(c.costs))continue;
   if(d.unitId){let ok=true;try{D.unit(d.unitId);}catch(e){ok=false;}if(ok){for(let i=0;i<n;i++)owned.push({uid:d.unitId+'#'+serial++,id:d.unitId,lv:1,exp:0,sp:0});seen().mark([d.unitId],'joined');rep.items.push({id:d.unitId,name:D.unit(d.unitId).name+'（ユニット）',count:n});}}
   else{items[d.itemId]=(items[d.itemId]||0)+n;rep.items.push({id:d.itemId,name:itemName(d.itemId),count:n});}}
  const rec={...record(m.id)};rec.clears++;rec.best=rec.best?Math.min(rec.best,turns):turns;rep.stars=evalStars(m,{win,turns,lost,hpPct});rec.stars=rep.stars.map((ok,i)=>{if(ok&&!(rec.stars||[])[i])rep.newStars++;return ok||!!(rec.stars||[])[i];});
  rep.starCredits=rep.newStars*(m.starReward??Math.round(reward*.2));credits+=rep.starCredits;records[m.id]=rec;wins++;if(!cleared.includes(m.id)){cleared.push(m.id);const mm=D.mission?.(m.id)||m;addBrief('clear:'+m.id,'作戦「'+m.name+'」初クリア',mm.clearText);}
  // Recruits: Tactical units join the owned roster; PRO・D units (other data) are only marked recruited.
  for(const u of recruitPool||D.units())if(u.recruit?.missionId===m.id&&!recruited.includes(u.id)){recruited.push(u.id);let mine=true;try{D.unit(u.id);}catch(e){mine=false;}if(mine)owned.push({uid:u.id+'#'+serial++,id:u.id,lv:1,exp:0,sp:0});seen().mark([u.id],'joined');rep.recruits.push(u.name);}
}
 // Result flags: Tactical missions carry the win flags flat (the map merges the lose flags itself); PRO・D missions carry
 // them per outcome {win, lose, draw}. Only the flags of this outcome apply (false turns a flag off).
 {const rf=m.resultFlags||{},split=['win','lose','draw'].some(k=>rf[k]&&typeof rf[k]==='object');for(const [id,v] of Object.entries(split?(rf[outcome]||{}):win?rf:{}))flags[id]=v;}
 showCredits();save();return rep;}
/* ---------- sortie support: supply items, presets, choices ---------- */
// Supply items: items whose effects are all next-sortie buffs (sortie_buff). Consumed when the sortie starts and
// applied to that battle only (stat +value%).
const isSupply=it=>(it.effects||[]).length>0&&it.effects.every(e=>e.type==='sortie_buff');
const supplyItems=()=>D.items().filter(it=>!it.key&&isSupply(it)&&free(it.id)>0);
function applySupply(u,id){const it=D.item(id);if(!it||!isSupply(it))return u;const o={...u};for(const e of it.effects)if(o[e.stat]!=null)o[e.stat]=Math.round(o[e.stat]*(1+e.value/100));return o;}
// Sortie: the sortie cost, the mission's condition costs (credits_use / item_use, checked again now) and the supply items,
// all or nothing. '' when paid, else why not (nothing is spent).
// Supplies: item ids, or {id, unit, uid | key} to apply the item's own rules for that unit (tags, conditions with
// their costs, the per-unit limit); everything is paid together or nothing is.
function payForSortie(m,cost=0,supplies=[]){const r=m?.conds?.list?.length?rollConds(m.conds,state()):{ok:true,costs:[]};if(!r.ok)return '出撃条件を満たしていません：'+condsText(m.conds);
 const sup=supplies.map(x=>typeof x==='string'?{id:x}:x),extra=[];for(const x of sup){if(!x.unit)continue;const it=D.item(x.id),why=fieldBlock(it,x);if(why)return it.name+'：'+why;const c=rollConds(it.useConds,state(x.unit));if(!c.ok)return it.name+'：'+COND_FAILED;extra.push(...(c.costs||[]));}
 if(!pay([...(cost?[{credits:cost}]:[]),...r.costs,...extra,...sup.map(x=>({itemId:x.id,count:1}))]))return SHORT;for(const x of sup){if(x.unit)noteUse(x,x.id);const it=D.item(x.id);if((it?.varOps||[]).length)Object.assign(vars,applyVarOps(it.varOps));}save();return '';}
function consumeItem(id){if(free(id)<1)return false;items[id]-=1;save();return true;}
// Formation presets: 4 slots each for PRO・D lineups and Tactical formations.
const PRESETS=4;
const getPreset=(kind,i)=>C.clone(presets[kind]?.[i]||null);
function setPreset(kind,i,value){if(i<0||i>=PRESETS)return false;presets[kind]=presets[kind]||[];presets[kind][i]=value?{...C.clone(value),savedDay:day}:null;save();return true;}
// pickChoice(title, choices) → Promise of the chosen entry; choices hidden by their display conditions are left out.
function pickChoice(title,choices){const list=(choices||[]).filter(c=>!c.conds?.list?.length||previewConds(c.conds,state()).ok);if(!list.length)return Promise.resolve(null);
 return new Promise(res=>{const draw=()=>win('選択',title,['選んでください。'],list.map((c,i)=>[c.text||'（選択肢）',()=>{const r=rollConds(c.conds,state());if(!r.ok||!pay(r.costs)){win('選択できません',title,[COND_FAILED],[['選び直す',draw]]);return;}close();for(const [k,v] of Object.entries(c.flags||{}))flags[k]=v;Object.assign(vars,applyVarOps(c.vars));save();res(c);},false,'choice'+i]));draw();});}
/* ---------- defeat, recovery, dismissal ---------- */
// A unit that can be dismissed (no noFire) or hired / produced is lost when destroyed in a mission. A key unit
// (noFire and not hireable) is wrecked (machines) or badly injured ('生身' tag) instead and cannot sortie until it is
// repaired / treated (credits, much more than ordinary repairs) or revived with an item (revive_hp_pct effect).
const hireable=id=>D.hires().some(h=>h.unitId===id)||registered.includes(id);
const isKey=u=>!!u?.noFire&&!hireable(u.id);
const downKind=u=>(u?.tags||[]).includes('生身')?'injured':'wrecked',DOWN={wrecked:'大破',injured:'重傷'};
const downText=k=>DOWN[k]||'';
// spare: uids that survived (a pilot that escaped from its destroyed machine is not lost with it).
function handleLosses(uids,spare=[]){const out=[];uids=[...uids,...uids.map(u=>boards[u]).filter(p=>p&&!spare.includes(p))];for(const uid of uids){const o=owned.find(x=>x.uid===uid);if(!o)continue;const u=D.unit(o.id);
 if(isKey(u)){o.down=downKind(u);for(const [k,v] of Object.entries(boards))if(k===uid||v===uid)delete boards[k];out.push({name:u.name,result:'down',text:downText(o.down)+'（出撃不可・修理・治療が必要）'});}else{owned=owned.filter(x=>x!==o);for(const [k,v] of Object.entries(boards))if(k===uid||v===uid)delete boards[k];out.push({name:u.name,result:'lost',text:'失われた'});}}save();return out;}
// PRO・D units: the same rule by unit id (they have no hire entries in the prototype, so only noFire units are kept).
function handleDispatchLosses(units,spare=[]){const out=[],DDd=window.PRODispatchData;units=[...units,...units.map(u=>!spare.includes(dboards[u.id])&&DDd?.defs[dboards[u.id]]).filter(Boolean)];for(const u of units){for(const [k,v] of Object.entries(dboards))if(k===u.id||v===u.id)delete dboards[k];if(u.noFire){ddown[u.id]=downKind(u);out.push({name:u.name,result:'down',text:downText(ddown[u.id])+'（出撃不可・修理・治療が必要）'});}else{if(!dlost.includes(u.id))dlost.push(u.id);out.push({name:u.name,result:'lost',text:'失われた'});}}save();return out;}
const repairCost=u=>Math.max(1000,Math.round(((Number(u.hp)||1000)*5+(u.level||1)*500)/100)*100);
const reviveItems=()=>D.items().filter(it=>(it.effects||[]).some(e=>e.type==='revive_hp_pct')&&free(it.id)>0);
// recover(key, how): key = owned uid, or 'd:'+PRO・D unit id; how = 'credits' or an item id.
function recover(key,how,u){const isD=key.startsWith('d:'),id=isD?key.slice(2):null,o=isD?null:owned.find(x=>x.uid===key);if(isD?!ddown[id]:!o?.down)return '復帰の必要はありません';
 if(how==='credits'){const c=repairCost(u);if(credits<c)return '資金が足りません（'+c.toLocaleString()+' Cr）';credits-=c;showCredits();}else{const it=D.item(how);if(!it||!(it.effects||[]).some(e=>e.type==='revive_hp_pct'))return 'このアイテムは使えません';// the item's own rules (tags, conditions with costs, per-unit limit)
  const r=fieldUse(how,[{unit:u||(o?unitOf(o):window.PRODispatchData?.defs?.[id]),uid:o?o.uid:null,key}]);if(r.why)return r.why;}
 if(isD)delete ddown[id];else delete o.down;save();return '';}
// Dismissal: hire → 解雇, produce → 解体. Key units (noFire) cannot be dismissed. Equipment returns to storage.
const dismissVerb=u=>u.joinVerb==='produce'?'解体':'解雇';
// Boarding pairs that name a unit leaving the roster (as machine or as pilot) are undone.
function unboard(uid){for(const [k,v] of Object.entries(boards))if(k===uid||v===uid)delete boards[k];}
function dismiss(uid){const o=owned.find(x=>x.uid===uid);if(!o)return '見つかりません';const u=D.unit(o.id);if(u.noFire)return '重要ユニットは'+dismissVerb(u)+'できません';owned=owned.filter(x=>x!==o);for(const [k,v] of Object.entries(boards))if(k===uid||v===uid)delete boards[k];save();return '';}
let carePick=null,firePick=null;
function careList(){const DDd=window.PRODispatchData;return [...owned.filter(o=>o.down).map(o=>({key:o.uid,unit:unitOf(o),kind:o.down})),...Object.entries(ddown).filter(([id])=>DDd?.defs[id]).map(([id,k])=>({key:'d:'+id,unit:{...C.levelStats(DDd.defs[id],dispatchLevel(id).lv),id,uid:'d:'+id},kind:k,dispatch:true}))];}
function renderCare(){const list=careList();tell('careCredits','資金 '+credits.toLocaleString()+' Cr');G.render($('careGrid'),list.map(x=>x.unit),{selected:u=>u.uid===carePick,badge:u=>downText(list.find(x=>x.unit.uid===u.uid).kind),onPick:u=>{if(carePick===u.uid){openCare(list.find(x=>x.unit.uid===u.uid));return;}carePick=u.uid;renderCare();focusTile('careGrid',u.uid);}});
 [...$('careGrid').querySelectorAll('.ug-tile')].forEach((t,i)=>{t.dataset.uid=list[i].key;});if(!list.length)$('careGrid').append(Object.assign(document.createElement('p'),{className:'cmd-hint',textContent:'大破・重傷のユニットはいません。'}));}
function openCare(x){const u=x.unit,c=repairCost(u),verb=x.kind==='injured'?'治療':'修理',done=why=>{carePick=null;renderCare();win(verb,u.name,[why||u.name+' が復帰しました。'],[['閉じる',close]]);};
 win(verb,u.name+'（'+downText(x.kind)+'）',[(x.dispatch?'PRO・D ・ ':'')+'Lv'+(u.level||1)+' ・ '+verb+'費 '+c.toLocaleString()+' Cr','資金 '+credits.toLocaleString()+' Cr','復帰すると出撃できるようになります。'],
  [[verb+'する（'+c.toLocaleString()+' Cr）',()=>done(recover(x.key,'credits',u)),credits<c,'care'],...reviveItems().map(it=>{const why=fieldBlock(it,{unit:u,uid:x.dispatch?null:x.key,key:x.key});return [it.name+'で復帰（残り '+free(it.id)+'）'+(why?' — '+why:''),()=>done(recover(x.key,it.id,u)),!!why,'item-'+it.id];}),['閉じる',close]]);}
function renderFire(){const list=owned.map(unitOf);G.render($('fireGrid'),list,{selected:u=>u.uid===firePick,reason:u=>D.unit(u.id).noFire?'重要ユニット':'',badge:u=>dismissVerb(D.unit(u.id))+(u.down?'・'+downText(u.down):''),onPick:u=>{if(firePick===u.uid){openFire(u);return;}firePick=u.uid;renderFire();focusTile('fireGrid',u.uid);}});
 [...$('fireGrid').querySelectorAll('.ug-tile')].forEach((t,i)=>{t.dataset.uid=list[i].uid;});}
function openFire(u){const v=dismissVerb(D.unit(u.id)),why=D.unit(u.id).noFire?'重要ユニットは'+v+'できません':'';
 win(v,u.name,['Lv'+u.level+(u.equip?.some(Boolean)?' ・ 装備は倉庫に戻ります':''),why||v+'すると元に戻せません。'],[[v+'する',()=>{const r=dismiss(u.uid);firePick=null;renderFire();win(v,u.name,[r||u.name+' を'+v+'しました。'],[['閉じる',close]]);},!!why,'fire'],['戻る',close]]);}
/* ---------- skill tree ---------- */
// Learning a node costs its SP and needs the unit's level and the required nodes. Reset returns all spent SP.
// key: owned uid (Tactical) or 'd:'+unit id (PRO・D, kept in dtree / dlv).
function treeOf(key){if(key.startsWith('d:')){const id=key.slice(2),def=window.PRODispatchData?.defs[id];return def&&{def,got:dtree[id]||[],lv:dispatchLevel(id).lv,sp:dispatchLevel(id).sp||0,name:def.name};}
 const o=owned.find(x=>x.uid===key);if(!o)return null;const def=D.unit(o.id);return {def,got:o.tree||[],lv:o.lv||1,sp:o.sp||0,name:def.name,o};}
function nodeBlock(t,n){if(t.got.includes(n.id))return '習得済み';if(t.lv<(n.minLevel||1))return 'Lv'+n.minLevel+'以上が必要';const need=(n.requires||[]).filter(r=>!t.got.includes(r));if(need.length)return '先に「'+need.map(r=>t.def.skillTree.find(x=>x.id===r)?.skill?.name||r).join('・')+'」';if(t.sp<(n.cost??1))return 'SPが足りません';return '';}
function learn(key,nodeId){const t=treeOf(key),n=t?.def.skillTree?.find(x=>x.id===nodeId);if(!n)return '見つかりません';const why=nodeBlock(t,n);if(why)return why;const cost=n.cost??1;
 // What each node cost is kept (paid), so a reset gives back exactly that even if the tree's prices change (evolution).
 if(t.o){t.o.sp=(t.o.sp||0)-cost;t.o.tree=[...t.got,n.id];t.o.paid={...(t.o.paid||{}),[n.id]:cost};}else{const id=key.slice(2),d=dispatchLevel(id);dlv[id]={...d,sp:t.sp-cost,paid:{...(d.paid||{}),[n.id]:cost}};dtree[id]=[...t.got,n.id];}save();return '';}
function resetTree(key){const t=treeOf(key);if(!t||!t.got.length)return 0;const paid=t.o?t.o.paid:dlv[key.slice(2)]?.paid,refund=t.got.reduce((n,id)=>n+(paid?.[id]??t.def.skillTree.find(x=>x.id===id)?.cost??1),0);
 if(t.o){t.o.sp=(t.o.sp||0)+refund;t.o.tree=[];delete t.o.paid;}else{const id=key.slice(2),d={...dispatchLevel(id),sp:t.sp+refund};delete d.paid;dlv[id]=d;delete dtree[id];}save();return refund;}
const dispatchTreeSkills=id=>{const def=window.PRODispatchData?.defs[id];return def?treeSkills(def,dtree[id]):[];};
let treePick=null;
function treeUnits(){const DDd=window.PRODispatchData,ds=DDd?DDd.players().filter(u=>(u.skillTree||[]).length&&!dlost.includes(u.id)&&(!u.recruit?.locked||recruited.includes(u.id))).map(u=>({...C.levelStats(u,dispatchLevel(u.id).lv),id:u.id,uid:'d:'+u.id,sp:dispatchLevel(u.id).sp||0,dispatch:true})):[];return [...owned.map(unitOf),...ds];}
function renderTree(){const list=treeUnits();G.render($('treeGrid'),list,{selected:u=>u.uid===treePick,reason:u=>(treeOf(u.uid)?.def.skillTree||[]).length?'':'スキルツリーなし',badge:u=>(u.dispatch?'D ':'')+'SP '+(u.sp||0),onPick:u=>{if(treePick===u.uid){openTree(u.uid);return;}treePick=u.uid;renderTree();focusTile('treeGrid',u.uid);}});
 [...$('treeGrid').querySelectorAll('.ug-tile')].forEach((t,i)=>{t.dataset.uid=list[i].uid;});}
function openTree(key){const t=treeOf(key);if(!t)return;const nodes=t.def.skillTree||[],sk=n=>n.skill||{};
 win('スキルツリー',t.name+(key.startsWith('d:')?'（PRO・D）':''),['Lv'+t.lv+' ・ SP '+t.sp,nodes.length?'習得 '+t.got.length+' / '+nodes.length:'スキルツリーがありません'],
  [...nodes.map(n=>{const why=nodeBlock(t,n),have=t.got.includes(n.id);return [(have?'✓ ':'')+(sk(n).name||n.id)+'（SP '+(n.cost??1)+'・Lv'+(n.minLevel||1)+(n.requires?.length?'・前提あり':'')+'）'+(why&&!have?' — '+why:''),()=>{const r=learn(key,n.id);if(!r)renderTree();openTree(key);},!!why,'node-'+n.id];}),
   ['リセット（SPを返す）',()=>win('確認','スキルツリーをリセットしますか？',['習得したスキルをすべて外し、使ったSPを返します。'],[['リセットする',()=>{resetTree(key);renderTree();openTree(key);},false,'reset'],['戻る',()=>openTree(key)]]),!t.got.length,'resetask'],['閉じる',close]]);}
/* ---------- boarding ---------- */
// board(key, pilotKey|null): keys are owned uids (Tactical) or 'd:'+id (PRO・D). A pilot rides one unit at a time;
// moving it to another unit leaves the previous one. Down, dismissed or lost units can't board.
function boardBlock(key,pk){const isD=key.startsWith('d:'),DDd=window.PRODispatchData,get=k=>{if(isD)return DDd?.defs[k.slice(2)];const id=owned.find(x=>x.uid===k)?.id;return id&&D.unit(id);},m=get(key),p=pk&&get(pk);
 if(!m)return '見つかりません';if(crew(m)==='none')return 'パイロットが乗れないユニットです';if(isPilot(m)&&(isD?Object.values(dboards):Object.values(boards)).includes(isD?key.slice(2):key))return '搭乗中のパイロットです';if(!pk)return '';if(!p||!isPilot(p))return 'パイロットではありません';if(pk===key)return '自分には乗れません';
 if(isD?(ddown[pk.slice(2)]||dlost.includes(pk.slice(2))):owned.find(x=>x.uid===pk)?.down)return '大破・重傷のため搭乗できません';if((isD?dboards[pk.slice(2)]:boards[pk]))return 'このパイロットは機体に乗せられています（自分が機体扱い）';return '';}
function board(key,pk){const why=boardBlock(key,pk);if(why)return why;const isD=key.startsWith('d:'),map=isD?dboards:boards,k=isD?key.slice(2):key,p=pk&&(isD?pk.slice(2):pk);
 for(const [a,b] of Object.entries(map))if(b===p)delete map[a];if(p)map[k]=p;else delete map[k];save();return '';}
// Sortie problem caused by boarding (riding pilot, missing required pilot).
function crewProblem(key){const isD=key.startsWith('d:'),DDd=window.PRODispatchData,id=isD?key.slice(2):key,map=isD?dboards:boards,oid=owned.find(x=>x.uid===id)?.id,def=isD?DDd?.defs[id]:oid&&D.unit(oid);if(!def)return '';
 // A pair whose machine is gone (an older save) does not count.
 const riding=Object.keys(map).find(k=>map[k]===id&&(isD?!!DDd?.defs[k]:owned.some(x=>x.uid===k)));if(riding)return (isD?DDd?.defs[riding]?.name:unitOf(owned.find(x=>x.uid===riding)).name)+'に搭乗中です（単独では出撃できません）';if(crew(def)==='required'&&!(isD?dispatchPilot(id):map[id]))return 'パイロットが必要です（ユニット → 搭乗）';/* a pilot that is still there */return '';}
const dispatchPilot=id=>{const DDd=window.PRODispatchData,p=dboards[id]&&DDd?.defs[dboards[id]];return p?.pilotProfile&&DDd.defs[id]?{def:p,lv:dispatchLevel(p.id).lv}:null;};
let boardPick=null;
function boardUnits(){const DDd=window.PRODispatchData,ds=DDd?DDd.players().filter(u=>!dlost.includes(u.id)&&(!u.recruit?.locked||recruited.includes(u.id))&&crew(u)!=='none'&&!isPilot(u)).map(u=>({...C.levelStats(u,dispatchLevel(u.id).lv),id:u.id,uid:'d:'+u.id,dispatch:true,pilot:dispatchPilot(u.id)&&{name:dispatchPilot(u.id).def.name}})):[];
 return [...owned.map(unitOf).filter(u=>crew(D.unit(u.id))!=='none'&&!isPilot(D.unit(u.id))),...ds];}
function renderBoard(){const list=boardUnits();G.render($('boardGrid'),list,{selected:u=>u.uid===boardPick,badge:u=>(u.dispatch?'D ':'')+(u.pilot?'乗:'+u.pilot.name:crew(u.dispatch?window.PRODispatchData.defs[u.id]:D.unit(u.id))==='required'?'要パイロット':'空席'),onPick:u=>{if(boardPick===u.uid){openBoard(u.uid);return;}boardPick=u.uid;renderBoard();focusTile('boardGrid',u.uid);}});
 [...$('boardGrid').querySelectorAll('.ug-tile')].forEach((t,i)=>{t.dataset.uid=list[i].uid;});}
function openBoard(key){const isD=key.startsWith('d:'),DDd=window.PRODispatchData,map=isD?dboards:boards,k=isD?key.slice(2):key,m=isD?DDd.defs[k]:D.unit(owned.find(x=>x.uid===k).id),cur=map[k];
 const pilots=isD?DDd.players().filter(u=>isPilot(u)&&!dlost.includes(u.id)&&(!u.recruit?.locked||recruited.includes(u.id))).map(u=>({key:'d:'+u.id,name:u.name,lv:dispatchLevel(u.id).lv,on:cur===u.id})):owned.filter(o=>isPilot(D.unit(o.id))).map(o=>({key:o.uid,name:D.unit(o.id).name,lv:o.lv||1,on:cur===o.uid}));
 const nameOf=x=>isD?DDd.defs[x]?.name:D.unit(owned.find(o=>o.uid===x)?.id)?.name;
 win('搭乗',m.name+(isD?'（PRO・D）':''),['いまのパイロット：'+(cur?nameOf(cur):'なし'),crew(m)==='required'?'この機体はパイロットが必要です。':'パイロットは任意です。','パイロットの能力補正・スキル・適性が機体に加わり、経験値も同じだけ入ります。',...(pilots.length?[]:['パイロットとして乗れるユニットがいません（生産・雇用などで迎えてください）。'])],
  [...pilots.map(p=>{const why=p.on?'':boardBlock(key,p.key);const rides=Object.entries(map).find(([a,b])=>b===(isD?p.key.slice(2):p.key)&&a!==k);return [(p.on?'✓ ':'')+p.name+' Lv'+p.lv+(rides?'（'+nameOf(rides[0])+'から乗り換え）':'')+(why?' — '+why:''),()=>{board(key,p.key);renderBoard();openBoard(key);},!!why||p.on,'pilot-'+p.key];}),['降ろす',()=>{board(key,null);renderBoard();openBoard(key);},!cur,'unboard'],['閉じる',close]]);}
/* ---------- achievements and battle records ---------- */
const ach=()=>D.achievements?.()||[];
function checkAchievements(){const fresh=[];for(const a of ach()){if(achieved[a.id])continue;if(!a.conds?.list?.length)continue;const r=rollConds(a.conds,state());if(!r.ok)continue;/* its spending conditions are paid once, before the reward */if(r.costs.length&&!pay(r.costs))continue;achieved[a.id]=day;
 credits+=a.reward?.credits||0;for(const [id,n] of Object.entries(a.reward?.items||{}))items[id]=(items[id]||0)+n;fresh.push(a);notices.push('実績「'+a.name+'」を達成'+(a.reward?.credits?'（+'+a.reward.credits.toLocaleString()+' Cr）':''));}if(fresh.length)showCredits();return fresh;}
const rewardText=a=>[a.reward?.credits?a.reward.credits.toLocaleString()+' Cr':'',...Object.entries(a.reward?.items||{}).map(([id,n])=>D.itemName(id)+'×'+n)].filter(Boolean).join('・')||'なし';
// Battle records: totals and the last 20 battles (mission, outcome, turns, stars, credits and the battle log).
function recordBattle(m,kind,rep,{outcome,turns,log=[]}){stats.battles++;stats[outcome]=(stats[outcome]||0)+1;history.unshift({day,id:m.id,name:m.name,kind,outcome,turns,stars:(rep?.stars||[]).filter(Boolean).length,credits:rep?.credits||0,log:log.slice(-1500)});history=trimHistory(history.slice(0,20));save();}
// After a mission is fully settled (rewards, losses, EXP, day and research): save, then the one autosave of the mission.
function settled(){save();window.PROSave?.autoSave();}
const OUT={win:'勝利',lose:'敗北',draw:'引き分け'};
function openAchievements(){const list=ach().filter(a=>!a.hidden||achieved[a.id]);const n=ach().filter(a=>achieved[a.id]).length;
 win('実績','実績 '+n+' / '+ach().length,list.map(a=>(achieved[a.id]?'★ ':'☆ ')+a.name+' — '+(a.desc||'')+' ｜ 報酬：'+rewardText(a)+(achieved[a.id]?'（'+achieved[a.id]+'日目に達成）':'')).concat(ach().length>list.length?['？？？（隠し実績 '+(ach().length-list.length)+'件）']:[]),[['閉じる',close]]);}
function openHistory(){win('戦歴','戦歴',['出撃 '+stats.battles+'回 ・ 勝利 '+(stats.win||0)+' ・ 敗北 '+(stats.lose||0)+' ・ 引き分け '+(stats.draw||0),history.length?'最近の戦闘（押すとログ）':'まだ戦闘の記録はありません。'],
 [...history.map((h,i)=>[h.day+'日目 '+(h.kind==='dispatch'?'PRO・D ':'タクティカル ')+h.name+' ／ '+OUT[h.outcome]+' ／ '+h.turns+'TURN'+(h.stars?' ★'+h.stars:''),()=>openLog(i),false,'hist'+i]),['閉じる',close]]);}
function openLog(i){const h=history[i];if(!h)return;win('戦闘ログ',h.name+' ／ '+OUT[h.outcome],h.log.length?h.log:[h.logTrimmed?'ログは新しい'+LOG_KEEP+'戦ぶんだけ残しています（セーブの容量を抑えるため）。':'ログはありません。'],[['ログをコピー',async()=>{try{await navigator.clipboard.writeText(h.log.join('\n'));$('labWinKind').textContent='コピーしました';}catch(e){$('labWinKind').textContent='コピーできませんでした';}},false,'copy'],['戦歴へ戻る',openHistory],['閉じる',close]]);}
const markCleared=id=>{if(id&&!cleared.includes(id)){cleared.push(id);save();}};
function focusTile(grid,uid){$(grid).querySelector('[data-uid="'+uid+'"]')?.focus();}
$('fusionReset').onclick=()=>{anchor=null;picks=[];pending=null;renderFusion();};
$('labWindow').addEventListener('cancel',e=>e.preventDefault());
showCredits();
// EXP for owned units (Tactical) by uid, and for PRO・D units by unit id. entries: [{key, amount}].
// Returns what changed so result screens can show level-ups.
function grant(entries,get,put,nameOf){const out=[];for(const {key,amount} of entries){const cur=get(key);if(!cur)continue;const r=C.gainExp(cur,amount);put(key,r);out.push({key,name:nameOf(key),amount,lv:r.lv,ups:r.ups,sp:r.sp});}save();return out;}
// A riding pilot gets the same EXP as its unit.
const withPilots=(entries,map)=>entries.flatMap(e=>map[e.key]?[e,{key:map[e.key],amount:e.amount}]:[e]);
const gainExp=entries=>grant(withPilots(entries,boards),uid=>{const o=owned.find(x=>x.uid===uid);return o&&{lv:o.lv||1,exp:o.exp||0,sp:o.sp||0};},(uid,r)=>Object.assign(owned.find(x=>x.uid===uid),{lv:r.lv,exp:r.exp,sp:r.sp}),uid=>D.unit(owned.find(x=>x.uid===uid).id).name);
const dispatchLevel=id=>({lv:1,exp:0,sp:0,...(dlv[id]||{})});
const gainDispatchExp=(entries,names={})=>grant(withPilots(entries,dboards),dispatchLevel,(id,r)=>{dlv[id]={...(dlv[id]||{}),lv:r.lv,exp:r.exp,sp:r.sp};}/* keeps uses / paid SP */,id=>names[id]||id);
// Battlefield production (Tactical): the base's production / hire list, default prices, and adding a produced unit.
// Another form of an owned unit (変形 etc.): same level, equipment, pilot and growth, the form's own base data.
const formUnit=(uid,formId)=>{const o=owned.find(x=>x.uid===uid);return o?unitOf({...o,id:formId}):null;};
const hireList=()=>entries().map(e=>({...C.clone(e),...(e.pilot?.unit?{pilot:{...e.pilot}}:{pilot:undefined})}));
// A new unit joins at Lv1; with a pilot spec {unit, lv} (hire entry, placed or produced unit) the pilot joins too, already aboard.
function join(id,pilot){const uid=id+'#'+serial++;owned.push({uid,id,lv:1,exp:0,sp:0});let p=null;try{p=pilot?.unit&&crew(D.unit(id))!=='none'&&D.unit(pilot.unit);}catch(e){p=null;}
 if(isPilot(p)){const pu=pilot.unit+'#'+serial++;owned.push({uid:pu,id:pilot.unit,lv:Math.max(1,Math.min(C.LEVEL_MAX||50,Math.round(Number(pilot.lv)||1))),exp:0,sp:0});boards[uid]=pu;seen().mark([pilot.unit],'joined');}seen().mark([id],'joined');return uid;}
function addOwned(id,pilot){const uid=join(id,pilot);save();return uid;}
// Skill points in total (spent on the tree or not): the 作戦コマンド SP of an owned unit.
const spTotal=uid=>{const o=owned.find(x=>x.uid===uid);if(!o)return 0;let tree=[];try{tree=D.unit(o.id).skillTree||[];}catch(e){}return (o.sp||0)+(o.tree||[]).reduce((n,id)=>n+(o.paid?.[id]??tree.find(t=>t.id===id)?.cost??1),0);};
trimEquip();
window.PROUnitLab=Object.freeze({_t:{checkAchievements,needsUnit},/* test-only */hqLock,settled,payForSortie,spTotal,captives:()=>C.clone(captives),addCaptives,openCaptives,vars:varsNow,changeVars,applyVarOps,varStep,formUnit,hireList,addOwned,defaultCost:u=>defaultCost(u),flush:()=>save(false),levelProblem,supplyBlock:(id,t)=>fieldBlock(D.item(id),t),fieldHireBlock,fieldHirePay,noteHire,fieldBlock:(id,t)=>fieldBlock(D.item(id),t),fieldUse,hqData:()=>JSON.parse(hqJson()),spend:n=>pay([{credits:n}]),recordBattle,openAchievements,openHistory,achieved:()=>({...achieved}),history:()=>C.clone(history),stats:()=>({...stats}),board,crewProblem,dispatchPilot,applyPilot,renderBoard,boards:()=>({...boards}),learn,resetTree,renderTree,dispatchTreeSkills,treeOf,handleLosses,handleDispatchLosses,recover,repairCost,dismiss,renderCare,renderFire,isKey,dispatchState:id=>dlost.includes(id)?'lost':ddown[id]||null,supplyItems,applySupply,consumeItem,getPreset,setPreset,PRESETS,pickChoice,previewConds:(cs,over)=>previewConds(cs,{...state(),...over}),evalConds:(cs,over)=>rollConds(cs,state(),over),mergeFlags:f=>{Object.assign(flags,f||{});save();},deployProblem,missionLock,missionHidden,record,finishMission,evalStars,starText,setMissionNames,recruited:()=>[...recruited],flags:()=>({...flags}),setFlag:(k,v)=>{flags[k]=v;save();},renderUse,renderEquip,useItem,equip,free,setUseItem:id=>{useItemId=id;usePick=null;},renderShop,renderStorage,buy,sell,renderResearch,advanceDay,startResearch,cancelResearch,day:()=>day,items:()=>({...items}),done:()=>[...done],active:()=>active&&{...active},renderEvolve,renderFusion,renderProduction,markCleared,cleared:()=>[...cleared],gainExp,gainDispatchExp,dispatchLevel,registered:()=>[...registered],register,briefs:()=>C.clone(briefs),checkBriefs,owned:()=>owned.map(unitOf),
 // One owned unit without building the whole list (the map asks often: commands, forms).
 ownedOne:uid=>{const o=owned.find(x=>x.uid===uid);return o?unitOf(o):null;},isOwned:uid=>owned.some(x=>x.uid===uid),credits:()=>credits,reset(){try{localStorage.removeItem('PRO_TACTICAL_SUSPEND');}catch(e){}/* a suspended mission belongs to the old progress */aside=[];hireUnlocks=[];serial=1;credits=START_CREDITS;owned=D.roster().map(u=>({uid:u.id,id:u.id}));registered=[];dlv={};hired={};cleared=[];items=D.startItems();day=1;evolved=[];fused=[];weekBase={day:1,weekday:new Date().getDay()};done=[];active=null;notices=[];records={};flags={};vars={};captives=[];recruited=[];wins=0;presets={dispatch:[],tactical:[]};dlost=[];ddown={};dtree={};boards={};dboards={};achieved={};history=[];stats={battles:0,win:0,lose:0,draw:0};briefs=[];evoPick=null;prodPick=null;anchor=null;picks=[];pending=null;showCredits();save();}});
})();
