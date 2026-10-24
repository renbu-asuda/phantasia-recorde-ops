/* PRO・D (Dispatch) missions inside the prototype: pick owned units (the same units as Tactical: level, EXP, SP, gear,
   skill tree, pilot aboard, wreck / injury) by hand, auto or a preset, assign
   supply items, run the published auto battle (PROBattle.runBattle) in the shared battle window after the story and
   its choices, and settle rewards, EXP and flags in the test save (PROUnitLab). */
(function(){'use strict';
const C=window.PROCore,T=window.PROTactical,B=window.PROBattle,DD=window.PRODispatchData,$=id=>document.getElementById(id);
let missionId=null,chosen=[],rows={},supply={},estimateSeq=0;
const el=(tag,text,cls)=>{const e=document.createElement(tag);if(text!=null)e.textContent=text;if(cls)e.className=cls;return e;};
const mission=()=>DD.mission(missionId);
function show(id){if(id&&id!==missionId){missionId=id;chosen=[];rows={};supply={};}render();}
// The sortie list: the owned units (PROUnitLab.owned, as Tactical shows them), chosen by uid.
const LAB=()=>window.PROUnitLab,players=()=>LAB()?.owned()||[],byUid=uid=>players().find(u=>u.uid===uid),lvOf=uid=>byUid(uid)?.level||1;
const rowOf=u=>rows[u.uid]||u.row||'front';
// One sortie check for adding by hand, おまかせ, presets and the start: pilot (crew), wrecked / injured, mission rules.
function unitProblem(u,m){const L=LAB();return (L?.crewProblem(u.uid)||'')||(u.down?(u.down==='injured'?'重傷':'大破')+'のため出撃できません':'')||(m&&L?.deployProblem(m,u,u.level||1))||'';}
// Same squad capacity as Tactical (8 units, total size 8) plus the mission's sortie limit. Built-in PRO・D units have
// no size yet, so they count as M (size 1) here.
const sized=u=>u.size?u:{...u,size:'M'},lineup=()=>chosen.map(byUid).filter(Boolean).map(sized);
function render(){const m=mission();if(!m)return;const c=DD.conditions(m);$('dispatchMissionName').textContent=m.name;$('dispatchMissionInfo').textContent=[c.win,c.lose,'地形：'+(m.terrain||'標準'),'出撃'+m.maxDeploy+'体まで・体数8・総サイズ8'].filter(Boolean).join(' ｜ ');
 const list=$('dispatchUnits');list.replaceChildren();for(const u of players()){const on=chosen.includes(u.uid),crew=C.crewOf(u)==='required',why=on?'':(LAB()?.crewProblem(u.uid)||'')||T.joinReason(lineup(),sized(u),{maxDeploy:m.maxDeploy})||unitProblem(u,m),card=el('article',null,'prep-unit'+(on?' assigned':''));card.dataset.unit=u.uid;const h=el('header');{const im=window.PROTacticalData?.unitImage?.(u);if(im){const p=el('span',null,'pic-thumb');if(window.PROPixel?.paint(p,im))h.append(p);}}h.append(el('h3',u.name),el('small','Lv'+(u.level||1)+' / '+(u.role||'')+' / サイズ'+(u.size?u.size+'('+T.unitSize(u)+')':'未設定(M扱い)')+' / HP '+u.hp+' / ATK '+u.atk+' / DEF '+u.def+' / MOB '+u.mob+' / ACC '+u.acc));card.append(h,el('p','武装：'+u.weapons.map(w=>w.name).join('・'),'prep-help'));{const pl=u.pilot;if(pl)card.append(el('p','パイロット：'+pl.name+' Lv'+pl.lv,'prep-help'));else if(crew)card.append(el('p','パイロットが必要な機体（ユニット → 搭乗）','prep-reason'));}
  if(on){const sb=el('button','補給：'+(supply[u.uid]?window.PROTacticalData.itemName(supply[u.uid]):'なし'),'secondary');sb.type='button';sb.dataset.supply=u.uid;sb.onclick=()=>pickSupply(u);card.append(sb);}
  if(on){const rb=el('button','隊列：'+(rowOf(u)==='back'?'後衛':'前衛')+'（切替）','secondary');rb.type='button';rb.dataset.row=u.uid;rb.onclick=()=>{rows[u.uid]=rowOf(u)==='back'?'front':'back';render();};card.append(rb);}
  const b=el('button',on?'✓ 出撃メンバー（外す）':crew&&!u.pilot?'出撃不可（パイロットが必要）':why?why:'＋ 出撃メンバーに加える',/* a boarded crew machine can go */on?'secondary':'primary');b.type='button';b.dataset.pick=u.uid;b.disabled=!on&&!!why;b.onclick=()=>{chosen=on?chosen.filter(x=>x!==u.uid):[...chosen,u.uid];if(on)delete supply[u.uid];render();};card.append(b);list.append(card);}
 {const f=T.squadUsage(lineup());$('dispatchSummary').textContent='出撃 '+f.count+' / '+m.maxDeploy+'体（体数上限'+T.SQUAD.count+'） ｜ 総サイズ '+f.size+' / '+T.SQUAD.size+(chosen.length?'':' ｜ 最低1体を選んでください');}$('dispatchStart').disabled=!chosen.length;estimate();}
// The allies of a battle, the same for the battle and the estimate: the owned unit as Tactical has it (level, gear,
// pilot aboard, tree skills) and the supply item (sup: uid → item id; the estimate uses the items picked without
// spending them). The combatant keeps the uid (EXP, losses) and the unit id (its definition, forms).
function allyDefs(uids,sup={}){const L=LAB();return uids.map(byUid).filter(Boolean).map(o=>{const id=o.uid,u={...C.clone(o),uid:o.uid};if(window.PROMapWeapon&&u.weapons?.some(window.PROMapWeapon.isMap)){const ws=window.PROMapWeapon.normal(u.weapons);u.weapons=ws.length?ws:[C.weapon({name:'標準攻撃'})];}return sup[id]&&L?{...L.applySupply(u,sup[id]),boost:sup[id]}:u;});}
// PRO・D rules on top of the caller's hooks, for the battle and each estimate trial: automatic パージ, 脱出, 気力 and 味方支援.
function prepareBattle(ctx){ctx.counterSpends=true;ctx.hitClampLate=true;ctx.endRecheck=true;ctx.tdRules=true;const ts=ctx.hooks.turnStart;ctx.hooks.turnStart=async t=>{autoPurge(ctx);return ts(t);};ctx.hooks.replaceOnDeath=dispatchEscape;
 if(window.PROTension){Object.assign(ctx.hooks,window.PROTension.hooks(ctx));for(const u of [...ctx.allies,...ctx.enemies])initTension(u);const sp=ctx.hooks.spawned;ctx.hooks.spawned=made=>{for(const u of made)initTension(u);return sp(made);};}
 if(window.PROSupport)initSupport(ctx);
 // A 段階変化 may bring 気力 skills: the settings are built again (before the support adds its bonus on top).
 {const ph=ctx.hooks.phased;ctx.hooks.phased=(u,p)=>{if(u.tcfg||tensionFor(u)){delete u._tc;delete u.tcfg;initTension(u);}ph?.(u,p);};}return ctx;}
// Event condition sets (T&D) checked against the save: one draw per event and turn, whether checked once or many times
// (the battle and each estimate trial alike; rand: the battle's or the trial's random source).
function eventGate(ctx,ids,rand){const L=window.PROUnitLab,draws=new Map();return e=>{if(!e.conds?.list?.length||!L)return true;const key=e.id+':'+ctx.turn;let d=draws.get(key);if(!d){d=[];draws.set(key,d);}let at=0;return L.evalConds(e.conds,{flags:ctx.flags,deployed:ids,rng:()=>{const i=at++;return d[i]??(d[i]=rand());}}).ok;};}
// Power for auto selection (simple stat sum at the saved level).
const power=x=>(x.hp||0)/10+(x.atk||0)+(x.def||0)+((x.mob||0)+(x.acc||0))/4;
// おまかせ編成: strongest usable units within the sortie limit, size and deploy rules (crew-required units skipped).
function autoPick(){const m=mission(),ids=[];if(!m)return ids;for(const u of players().filter(u=>!unitProblem(u,m)).sort((a,b)=>power(b)-power(a))){if(T.joinReason(ids.map(byUid).map(sized),sized(u),{maxDeploy:m.maxDeploy}))continue;ids.push(u.uid);}return ids;}
function auto(){chosen=autoPick();rows={};supply={};render();}
// Win estimate with the published simulator (20 trials, fixed seed) for the current lineup, or the auto lineup.
async function estimate(){const m=mission(),seq=++estimateSeq,out=$('dispatchEstimate');if(!m||!out)return;let ids=chosen,autoUsed=false;if(!ids.length){ids=autoPick();autoUsed=true;}
 if(!ids.length){out.textContent='';return;}out.textContent='推定勝率を計算中…';try{const L=window.PROUnitLab;const r=await B.simulate({flags:L?.flags()||{},allies:allyDefs(ids,autoUsed?{}:supply),rows:ids.map(id=>rowOf(byUid(id)||{})),enemies:m.enemies,mission:m,enemyDefs:DD.defs,unitDefs:DD.defs,trials:20,seed:7,
  // Each trial runs under the battle's rules; event conditions are checked without spending or changing anything.
  prepare:ctx=>{ctx.hooks.eventOk=eventGate(ctx,ids,ctx.rng);prepareBattle(ctx);}});if(seq!==estimateSeq)return;const p=Math.round(r.winRate*100);out.textContent='推定勝率 '+p+'%（'+(p>=80?'余裕':p>=50?'互角':p>=20?'苦戦':'危険')+(autoUsed?'・おまかせ編成で計算':'')+'）';}catch(e){if(seq===estimateSeq)out.textContent='';}}
// Supply: one next-sortie item per unit, consumed when the sortie starts.
function pickSupply(u){const L=window.PROUnitLab,list=L.supplyItems().filter(it=>it.id===supply[u.id]||!Object.values(supply).filter(x=>x===it.id).length||L.free(it.id)>Object.values(supply).filter(x=>x===it.id).length);
 const d=$('labWindow');$('labWinKind').textContent='補給';$('labWinTitle').textContent=u.name+' の補給アイテム';$('labWinBody').replaceChildren(el('p','次の出撃だけ効くアイテムを1つ持たせます。出撃時に消費します。','catalog-line'));
 const acts=[...list.filter(it=>!L.supplyBlock?.(it.id,{unit:allyDefs([u.uid])[0]||u,uid:u.uid,key:u.uid})).map(it=>[it.name+'（'+(it.desc||'')+'）',()=>{supply[u.uid]=it.id;}]),['なし',()=>{delete supply[u.uid];}]];$('labWinActions').replaceChildren(...acts.map(([t,f])=>{const b=el('button',t);b.type='button';b.onclick=()=>{f();d.close();render();};return b;}),Object.assign(el('button','戻る'),{type:'button',onclick:()=>d.close()}));if(!d.open)d.showModal();}
// Presets (4 slots): lineup, rows and supply.
function presets(){const L=window.PROUnitLab,d=$('labWindow');$('labWinKind').textContent='編成プリセット';$('labWinTitle').textContent='PRO・D 編成';$('labWinBody').replaceChildren(el('p','呼び出すと、使えないユニットは外れます。','catalog-line'));
 const rowsBtn=[];for(let i=0;i<L.PRESETS;i++){const p=L.getPreset('dispatch',i),name=p?p.ids.map(id=>byUid(id)?.name||'（いない）').join('・'):'空き';const call=el('button','呼び出す '+(i+1)+'：'+name);call.type='button';call.disabled=!p;call.dataset.preset='load'+i;call.onclick=()=>{const m=mission();chosen=[];rows={...(p.rows||{})};supply={};for(const id of p.ids){const u=byUid(id);if(u&&!unitProblem(u,m)&&!T.joinReason(lineup(),sized(u),{maxDeploy:m.maxDeploy}))chosen.push(id);}d.close();render();};
  const put=el('button','保存 '+(i+1));put.type='button';put.disabled=!chosen.length;put.dataset.preset='save'+i;put.onclick=()=>{L.setPreset('dispatch',i,{ids:[...chosen],rows:{...rows}});presets();};rowsBtn.push(call,put);}
 $('labWinActions').replaceChildren(...rowsBtn,Object.assign(el('button','閉じる'),{type:'button',onclick:()=>d.close()}));if(!d.open)d.showModal();}
// Story lines in a centered command-style window.
// {変数名} in story lines shows the game variable's current value.
const fillVars=t=>String(t??'').replace(/\{([^{}]{1,40})\}/g,(all,n)=>{const d=(window.PROTacticalData?.vars?.()||[]).find(v=>(v.name===n||v.id===n)&&v.scope!=='mission');return d?String(window.PROUnitLab?.vars()[d.id]??d.initial??0):all;});
function story(title,lines){return new Promise(resolve=>{if(!lines?.length){resolve();return;}const d=$('storyWindow');let i=0;const draw=()=>{$('storyTitle').textContent=title;$('storySpeaker').textContent=lines[i].speaker||'';$('storyText').textContent=fillVars(lines[i].text||'');$('storyProgress').textContent=(i+1)+' / '+lines.length;$('storyNext').textContent=i>=lines.length-1?'閉じる':'次へ';};// Closed any way (Escape too) = skipped; resolved once.
 let over=false;const onClose=()=>{if(over)return;over=true;d.removeEventListener('close',onClose);resolve();},done=()=>{if(d.open)d.close();onClose();};$('storyNext').onclick=()=>{i++;if(i>=lines.length)done();else draw();};$('storySkip').onclick=done;draw();if(!d.open)d.showModal();d.addEventListener('close',onClose);$('storyNext').focus();});}
function askWatch(m){const pref=window.PROField?.settings?.().dispatchBattle||'ask';if(pref!=='ask')return Promise.resolve(pref==='watch');return new Promise(resolve=>{const d=$('dispatchAsk');$('dispatchAskText').textContent=m.name+' を開始します。';let over=false;const fin=v=>{if(over)return;over=true;d.removeEventListener('close',onClose);if(d.open)d.close();resolve(v);},onClose=()=>fin(false);// closed without choosing (Escape) = skip the presentation
 $('dispatchWatch').onclick=()=>fin(true);$('dispatchSkip').onclick=()=>fin(false);d.showModal();d.addEventListener('close',onClose);$('dispatchWatch').focus();});}
const closed=()=>$('fieldBattle').open?new Promise(r=>$('fieldBattle').addEventListener('close',r,{once:true})):Promise.resolve();
// Forms in PRO・D battles (T&D pack units): 脱出 when destroyed and automatic パージ at a turn start, in place.
// Player units keep their id (EXP, records); u.formId is the form shown. A pilot that escapes has its own id and
// u.escapedFrom = the machine (counted as destroyed, the pilot survives). No restoring in PRO・D (no carriers).
// Enemies get a numbered id (e_0…): their definition is found by key. The skills that count are the definition's, the
// PRO・D skill tree's (allies) and the pilot's aboard.
// An ally's pilot is the owned unit boarded on it (unitOf's pilot: {uid, name, lv}); its definition holds the 気力 settings.
const tdUnit=id=>{try{return window.PROTacticalData.unit(id);}catch(e){return null;}},defOf=u=>DD.defs[u.formId||u.id]||DD.defs[u.key]||tdUnit(u.formId||u.id),pilotOf=u=>{if(u.side!=='ally'||u.escapedFrom||!u.pilot?.uid)return null;const p=LAB()?.ownedOne(u.pilot.uid);return p?{def:p,lv:u.pilot.lv||p.level||1,uid:u.pilot.uid}:null;};
// The combatant's current skills: unit + pilot + tree skills (allyDefs / formDef) as changed by phases since.
const skillsOf=u=>u.skills||defOf(u)?.skills||[];
const tacSkill=(u,k)=>skillsOf(u).find(s=>s.tactical?.[k]?.on)?.tactical[k]||null;
// An ally in another form is the same owned unit in that form (level, gear, pilot, tree: PROUnitLab.ownedForm).
function formDef(u,toId){if(u.side!=='ally'){const to=DD.defs[toId]||tdUnit(toId);return to?{...C.clone(to)}:null;}const L=LAB(),o=u.uid&&L?.ownedForm?.(u.uid,toId);if(!o)return null;let d={...o,uid:u.uid,formId:toId};if(window.PROMapWeapon){const ws=window.PROMapWeapon.normal(d.weapons);d.weapons=ws.length?ws:[C.weapon({name:'標準攻撃'})];}// the sortie supply lasts the whole battle
 if(u.boost&&L?.applySupply)d={...L.applySupply(d,u.boost),boost:u.boost};return d;}
// 気力 in PRO・D: each combatant starts at half its max; the pilot aboard holds the settings.
function tensionFor(u){const T2=window.PROTension;if(!T2)return null;const pl=pilotOf(u),def=defOf(u)||u;return T2.config(pl?pl.def:def,skillsOf(u));}
function initTension(u){const c=tensionFor(u);if(!c)return;u.tcfg=c;u.tension=Math.min(c.max,u.tension??c.initial);}
// 味方支援 in PRO・D: no map, so every living holder supports its whole side (PROSupport.battle).
function initSupport(ctx){window.PROSupport.battle(ctx,{skillsOf,enMax:u=>Number(defOf(u)?.en)||0});}
function dispatchEscape(u){if(u.escaped)return null;const sk=tacSkill(u,'escape');if(!sk)return null;let def=null;
 if((sk.mode||'unit')==='unit'){def=formDef(u,defOf(u)?.escapeTo);}else if(u.side==='ally'&&!u.escapedFrom){const pl=pilotOf(u);if(pl)def={...C.clone(pl.def),uid:pl.uid,escapedFrom:u.uid};}/* the owned pilot gets out */
 if(!def)return null;const from=u.name;const T2=window.PROTension,pl2=u.side==='ally'&&!def.escapedFrom&&def.pilot?.uid?{def:LAB()?.ownedOne(def.pilot.uid)}:null,tc=u.tcfg&&T2?T2.config(def.escapedFrom?DD.defs[def.id]||def:pl2?pl2.def:DD.defs[def.formId||def.id]||def,def.skills):null;return {def,extra:{escaped:true,...(tc?{tension:Math.min(tc.max,u.tension),tcfg:tc}:{}),...(def.escapedFrom?{escapedFrom:def.escapedFrom}:{}),...(def.formId?{formId:def.formId}:{}),...(def.uid?{uid:def.uid}:{})},text:from+'が撃破された！ '+(def.escapedFrom?'パイロット'+def.name+'が脱出':def.name+'で脱出')};}
function autoPurge(ctx){for(const u of [...ctx.allies,...ctx.enemies]){if(!u.alive||u.purged)continue;const sk=tacSkill(u,'purge'),to=defOf(u)?.purgeTo;if(!sk||!to||u.currentHp*100>u.maxHp*Number(sk.autoPct??50))continue;const def=formDef(u,to);if(!def)continue;const from=u.name,keep={escaped:u.escaped,escapedFrom:u.escapedFrom,escort:u.escort};const tv=u.tension;
  // As a form change on the map: EN left (up to the new maximum), ammo left (per weapon, up to its maximum), statuses and skill uses stay.
  const en=def.en>0?Math.min(def.en,u.en??def.en):undefined,am={...(u.ammo||{})};for(const w of def.weapons||[]){const k=w.key||w.name;if(w.ammo>0&&am[k]!=null)am[k]=Math.min(w.ammo,am[k]);}const status=C.clone(u.status),uses={...(u.skillUses||{})};
  B.replaceCombatant(u,def,{purged:true,status,skillUses:uses,ammo:am,...(en!=null?{en}:{}),...(tv!=null?{tension:tv}:{}),...(def.formId?{formId:def.formId}:{}),...(keep.escaped?{escaped:true}:{}),...(keep.escapedFrom?{escapedFrom:keep.escapedFrom}:{}),...(keep.escort?{escort:true}:{})});initTension(u);ctx.hooks.replaced?.(u);/* the support is applied again to the new form */ctx.hooks.log('<span class="skill">'+from+'がパージ：'+u.name+'に</span>');}}
// The lineup checked again right before the sortie (a unit may have been wrecked or boarded since it was chosen).
function lineupProblem(m){{const lp=LAB()?.levelProblem?.(m,chosen.map(lvOf));if(lp)return lp;}const ids=[];for(const id of chosen){const u=byUid(id);if(!u)return '選んだユニットがいません';const why=unitProblem(u,m)||T.joinReason(ids.map(x=>sized(byUid(x))),sized(u),{maxDeploy:m.maxDeploy});if(why)return u.name+'：'+why;ids.push(id);}return '';}
async function start({watch}={}){const m=mission();if(!m||!chosen.length||window.PROUnitLab?.missionLock(m))return null;
 {const why=lineupProblem(m);if(why){render();$('dispatchSummary').textContent='出撃できません：'+why;return null;}}
 // The mission's condition costs and the supply items are paid together now (nothing is spent when short).
 const L=window.PROUnitLab,used={};{const list=chosen.filter(id=>supply[id]);const why=L?.payForSortie?.(m,0,list.map(id=>({id:supply[id],unit:allyDefs([id])[0],uid:id,key:id})))||'';if(why){$('dispatchSummary').textContent='出撃できません：'+why;return null;}for(const id of list)used[id]=supply[id];supply={};}window.PROUnitsSeen?.mark(chosen.map(id=>byUid(id)?.id).filter(Boolean),'ally');window.PROUnitsSeen?.mark([...m.enemies,...(m.waves||[]).flatMap(w=>w.enemies||[])],'enemy');await story(m.name+' / 作戦前',m.story?.before);
 // Story choice (display conditions apply); its flags go to the save, then its lines play.
 if(m.story?.choices?.length&&window.PROUnitLab){const ch=await window.PROUnitLab.pickChoice(m.name+' / 選択',m.story.choices);if(ch?.lines?.length)await story(m.name+' / 選択',ch.lines);}
 if(watch===undefined)watch=await askWatch(m);
 // Supply items (paid at the start) boost their unit for this battle.
  const ctx=B.buildBattle({flags:L?.flags()||{},allies:allyDefs(chosen,used),rows:chosen.map(id=>rowOf(byUid(id)||{})),mission:m,enemyDefs:DD.defs,unitDefs:DD.defs},B.mulberry32(Date.now()%1000000));
 // Event condition sets (T&D) are checked against the save; event flags are kept after the battle.
 ctx.hooks.eventOk=eventGate(ctx,[...chosen],Math.random);
 $('fieldBattleSpeed').value=window.PROField?.settings?.().dispatchSpeed||'1';const c=DD.conditions(m),names=Object.fromEntries(Object.entries(DD.defs).map(([k,d])=>[k,d.name]));
 const label={win:'MISSION COMPLETE',lose:'MISSION FAILED',draw:'DRAW / 300TURN'};
 // The battle window opens behind a fade; the fight itself runs after the fade-in.
 let battle;await (window.PROTransition?window.PROTransition.run(()=>{battle=window.PROBattleScreen.play({title:m.name+' / RANK '+(m.diff||'C')+' / PRO・D',allies:ctx.allies,enemies:ctx.enemies,watch,closeLabel:'結果へ',speedSetting:'dispatchSpeed',sideLabels:{ally:'派遣部隊',enemy:'敵部隊'},info:()=>[c.win,hud(B.objectiveStatus(ctx))].filter(Boolean).join(' ｜ '),intro:['OPERATION START: '+m.name,c.win,c.lose,c.draw,'地形: '+(m.terrain||'標準'),...ruleTexts(m,names).map(t=>'RULE: '+t),...(m.waves||[]).map((w,i)=>'WAVE: '+C.waveText(w,i,names))].filter(Boolean),summary:r=>label[r.outcome]+' / '+r.turns+'TURN',run:hooks=>{Object.assign(ctx.hooks,hooks);prepareBattle(ctx);return B.runBattle(ctx);}});}):null);const result=await battle;
 await closed();L?.mergeFlags(ctx.flags);// After the battle: 作戦後 on a win, 敗北後 otherwise (a draw is not a win either).
  if(result.outcome==='win')await story(m.name+' / 作戦後',m.story?.after);else await story(m.name+' / 敗北後',m.story?.defeat);showResult(m,ctx,result,grantExp(m,ctx,result));return result;}
// EXP with the published rules: mission EXP (halved unless won, halved again if the unit fell) + defeat EXP of its kills.
function grantExp(m,ctx,r){const kills={};for(const k of ctx.killLog||[])if(k.killerSide==='ally'&&k.victimSide==='enemy'){const a=ctx.allies.find(x=>x.combatId===k.killer);if(a?.uid)kills[a.uid]=(kills[a.uid]||0)+(k.exp??C.defeatExp(ctx.enemies.find(x=>x.combatId===k.victim)));}
 const key=u=>u.escapedFrom||u.uid,rows=ctx.allies.filter(u=>!u.escort&&chosen.includes(key(u))).map(u=>{const k=key(u),up=u.alive&&!u.escapedFrom,n=kills[u.uid]||0;return {key:k,name:byUid(k)?.name||u.name,alive:up,kills:n,amount:C.battleExp(C.missionExp(m),{win:r.outcome==='win',alive:up,kills:n})};});
 const got=Object.fromEntries((LAB()?.gainExp(rows.map(x=>({key:x.key,amount:x.amount})))||[]).map(x=>[x.key,x]));/* the owned units' EXP (the pilot aboard shares it) */return rows.map(x=>({...x,...(got[x.key]||{})}));}
// Same wording as the published game's objective HUD and rule list.
function hud(st){if(!st)return '';const p=[];if(st.totalWaves>1)p.push('第'+st.wave+'波／全'+st.totalWaves+'波');if(st.boss)p.push(st.boss.pending?'ボス: まだ出ていない':'ボス「'+st.boss.name+'」残り'+st.boss.hpPct+'%');if(st.defenseLeft!=null)p.push('防衛 あと'+st.defenseLeft+'TURN');if(st.escort)p.push('護衛「'+st.escort.name+'」'+(st.escort.alive?st.escort.hpPct+'%':'撃破'));if(st.nextWave)p.push('次の波: '+st.nextWave);if(st.turnsLeft!=null)p.push('制限まで あと'+st.turnsLeft+'TURN');p.push('敵 残り'+st.enemiesLeft+'体');return p.join(' ・ ');}
function ruleTexts(m,names){return (m.rules||[]).map(r=>{if(typeof r==='string')return r;if(r.type==='turn_limit')return r.value+'TURN以内に勝利しないと敗北';if(r.type==='reinforce')return r.turn+'TURN目に援軍 '+r.enemies.map(id=>names[id]||id).join('・');if(r.type==='deploy_tags')return '出撃制限 '+C.requirementText(r);return r.name||r.type||'特殊ルール';});}
// Result: credits, drops, stars, records, recruits and EXP go to the test save (PROUnitLab).
function showResult(m,ctx,r,exp=[]){const win=r.outcome==='win',draw=r.outcome==='draw',body=$('fieldResultBody'),add=(a,b)=>{const row=el('div',null,'result-row');row.append(el('span',a),el('b',b));body.append(row);};$('fieldResultTitle').textContent=win?'作戦成功':draw?'引き分け':'作戦失敗';$('fieldResultTitle').className=win?'win':'lose';$('fieldResultLead').textContent=m.name+' ・ '+r.turns+'TURN';body.replaceChildren();
 // Rewards are received into the test save: credits, drops, stars (first-time bonus), record and recruits.
 const all=ctx.allies.filter(u=>!u.escort),hpMax=all.reduce((n,u)=>n+u.maxHp,0),hpNow=all.reduce((n,u)=>n+Math.max(0,u.currentHp),0);
 const down=u=>!u.alive||!!u.escapedFrom,rep=window.PROUnitLab?.finishMission(m,{outcome:r.outcome,turns:r.turns,lost:all.some(down),hpPct:hpMax?hpNow/hpMax*100:0,reward:m.reward||0,recruitPool:Object.values(DD.defs),itemName:DD.itemName});
 for(const x of LAB()?.handleLosses(all.filter(down).map(u=>u.escapedFrom||u.uid).filter(Boolean),all.filter(u=>u.alive&&u.escapedFrom).map(u=>u.uid))||[])/* owned units: wrecked / injured key units, the rest lost (as in Tactical) */add('撃破：'+x.name,x.text);
 window.PROUnitLab?.recordBattle(m,'dispatch',rep,{outcome:r.outcome,turns:r.turns,log:[...($('fieldBattleLog')?.children||[])].map(p=>p.textContent)});
 if(rep){add(win?'報酬':'回収資金',rep.credits.toLocaleString()+' Cr');for(const it of rep.items)add('ドロップ',it.name+' ×'+it.count);if(win){const st=C.missionStars(m);add('作戦評価',rep.stars.map((ok,i)=>(ok?'★':'☆')+window.PROUnitLab.starText(st[i])).join(' ／ '));if(rep.starCredits)add('初獲得の星ボーナス','+'+rep.starCredits.toLocaleString()+' Cr（'+rep.newStars+'個）');for(const n of rep.recruits)add('加入',n);}}for(const u of ctx.allies.filter(u=>!u.escort))add(u.name,u.alive?'HP '+Math.max(0,Math.ceil(u.currentHp))+' / '+u.maxHp:'撃破');for(const t of window.PROUnitLab?.advanceDay()||[])add('研究完了',t);for(const x of exp)add(x.name+' 経験値','+'+x.amount+' EXP'+(x.kills?'（撃破 +'+x.kills+'）':'')+(x.lv?' ｜ Lv'+x.lv+(x.ups?'（'+x.ups+'上昇・SP+'+x.ups+'）':''):''));
 window.PROUnitLab?.settled?.();$('fieldResultMap').hidden=true;$('fieldResult').showModal();$('fieldResult').addEventListener('close',()=>{$('fieldResultMap').hidden=false;},{once:true});}
$('dispatchStart').onclick=()=>start();
$('dispatchAuto').onclick=auto;$('dispatchPresets').onclick=presets;
window.PRODispatch=Object.freeze({show,start,auto,estimate,allyDefs,prepareBattle,eventGate,supply:()=>({...supply}),choose:ids=>{chosen=[...ids];render();},chosen:()=>[...chosen],rows:()=>({...rows})});
})();
