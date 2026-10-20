/* PRO・D (Dispatch) missions inside the prototype: pick units from the built-in data (or auto / a preset), assign
   supply items, run the published auto battle (PROBattle.runBattle) in the shared battle window after the story and
   its choices, and settle rewards, EXP and flags in the test save (PROUnitLab). */
(function(){'use strict';
const C=window.PROCore,T=window.PROTactical,B=window.PROBattle,DD=window.PRODispatchData,$=id=>document.getElementById(id);
let missionId=null,chosen=[],rows={},supply={},estimateSeq=0;
const el=(tag,text,cls)=>{const e=document.createElement(tag);if(text!=null)e.textContent=text;if(cls)e.className=cls;return e;};
const mission=()=>DD.mission(missionId);
function show(id){if(id&&id!==missionId){missionId=id;chosen=[];rows={};supply={};}render();}
// Units locked behind a mission (recruit.locked) appear once recruited. Units fight at their saved PRO・D level.
const lvOf=id=>window.PROUnitLab?.dispatchLevel(id).lv||1;
const players=()=>DD.players().filter(u=>(!u.recruit?.locked||window.PROUnitLab?.recruited().includes(u.id))&&window.PROUnitLab?.dispatchState(u.id)!=='lost');
const rowOf=u=>rows[u.id]||u.row||'front';
// Same squad capacity as Tactical (8 units, total size 8) plus the mission's sortie limit. Built-in PRO・D units have
// no size yet, so they count as M (size 1) here.
const sized=u=>u.size?u:{...u,size:'M'},lineup=()=>chosen.map(id=>sized(DD.defs[id]));
function render(){const m=mission();if(!m)return;const c=DD.conditions(m);$('dispatchMissionName').textContent=m.name;$('dispatchMissionInfo').textContent=[c.win,c.lose,'地形：'+(m.terrain||'標準'),'出撃'+m.maxDeploy+'体まで・体数8・総サイズ8'].filter(Boolean).join(' ｜ ');
 const list=$('dispatchUnits');list.replaceChildren();for(const u of players()){const on=chosen.includes(u.id),crew=DD.needsCrew(u),why=on?'':T.joinReason(lineup(),sized(u),{maxDeploy:m.maxDeploy})||(window.PROUnitLab?.dispatchState(u.id)?(window.PROUnitLab.dispatchState(u.id)==='injured'?'重傷':'大破')+'のため出撃できません':'')||window.PROUnitLab?.deployProblem(m,u,lvOf(u.id))||'',card=el('article',null,'prep-unit'+(on?' assigned':''));card.dataset.unit=u.id;const h=el('header');h.append(el('h3',u.name),el('small',(u.role||'')+' / サイズ'+(u.size?u.size+'('+T.unitSize(u)+')':'未設定(M扱い)')+' / HP '+u.hp+' / ATK '+u.atk+' / DEF '+u.def+' / MOB '+u.mob+' / ACC '+u.acc));card.append(h,el('p','武装：'+u.weapons.map(w=>w.name).join('・'),'prep-help'));if(crew)card.append(el('p','搭乗員が必要な機体（プロトタイプでは搭乗未対応）','prep-reason'));
  if(on){const sb=el('button','補給：'+(supply[u.id]?window.PROTacticalData.itemName(supply[u.id]):'なし'),'secondary');sb.type='button';sb.dataset.supply=u.id;sb.onclick=()=>pickSupply(u);card.append(sb);}
  if(on){const rb=el('button','隊列：'+(rowOf(u)==='back'?'後衛':'前衛')+'（切替）','secondary');rb.type='button';rb.dataset.row=u.id;rb.onclick=()=>{rows[u.id]=rowOf(u)==='back'?'front':'back';render();};card.append(rb);}
  const b=el('button',on?'✓ 出撃メンバー（外す）':crew?'出撃不可':why?why:'＋ 出撃メンバーに加える',on?'secondary':'primary');b.type='button';b.dataset.pick=u.id;b.disabled=!on&&(crew||!!why);b.onclick=()=>{chosen=on?chosen.filter(x=>x!==u.id):[...chosen,u.id];if(on)delete supply[u.id];render();};card.append(b);list.append(card);}
 {const f=T.squadUsage(lineup());$('dispatchSummary').textContent='出撃 '+f.count+' / '+m.maxDeploy+'体（体数上限'+T.SQUAD.count+'） ｜ 総サイズ '+f.size+' / '+T.SQUAD.size+(chosen.length?'':' ｜ 最低1体を選んでください');}$('dispatchStart').disabled=!chosen.length;estimate();}
// Power for auto selection (simple stat sum at the saved level).
const power=u=>{const x=C.levelStats(u,lvOf(u.id));return (x.hp||0)/10+(x.atk||0)+(x.def||0)+((x.mob||0)+(x.acc||0))/4;};
// おまかせ編成: strongest usable units within the sortie limit, size and deploy rules (crew-required units skipped).
function autoPick(){const m=mission(),ids=[];if(!m)return ids;for(const u of players().filter(u=>!DD.needsCrew(u)).sort((a,b)=>power(b)-power(a))){if(T.joinReason(ids.map(id=>sized(DD.defs[id])),sized(u),{maxDeploy:m.maxDeploy})||window.PROUnitLab?.deployProblem(m,u,lvOf(u.id)))continue;ids.push(u.id);}return ids;}
function auto(){chosen=autoPick();rows={};supply={};render();}
// Win estimate with the published simulator (20 trials, fixed seed) for the current lineup, or the auto lineup.
async function estimate(){const m=mission(),seq=++estimateSeq,out=$('dispatchEstimate');if(!m||!out)return;let ids=chosen,autoUsed=false;if(!ids.length){ids=autoPick();autoUsed=true;}
 if(!ids.length){out.textContent='';return;}out.textContent='推定勝率を計算中…';try{const r=await B.simulate({allies:ids.map(id=>({...C.levelStats(DD.defs[id],lvOf(id)),row:rowOf(DD.defs[id])})),enemies:m.enemies,mission:m,enemyDefs:DD.defs,unitDefs:DD.defs,trials:20,seed:7});if(seq!==estimateSeq)return;const p=Math.round(r.winRate*100);out.textContent='推定勝率 '+p+'%（'+(p>=80?'余裕':p>=50?'互角':p>=20?'苦戦':'危険')+(autoUsed?'・おまかせ編成で計算':'')+'）';}catch(e){if(seq===estimateSeq)out.textContent='';}}
// Supply: one next-sortie item per unit, consumed when the sortie starts.
function pickSupply(u){const L=window.PROUnitLab,list=L.supplyItems().filter(it=>it.id===supply[u.id]||!Object.values(supply).filter(x=>x===it.id).length||L.free(it.id)>Object.values(supply).filter(x=>x===it.id).length);
 const d=$('labWindow');$('labWinKind').textContent='補給';$('labWinTitle').textContent=u.name+' の補給アイテム';$('labWinBody').replaceChildren(el('p','次の出撃だけ効くアイテムを1つ持たせます。出撃時に消費します。','catalog-line'));
 const acts=[...list.map(it=>[it.name+'（'+(it.desc||'')+'）',()=>{supply[u.id]=it.id;}]),['なし',()=>{delete supply[u.id];}]];$('labWinActions').replaceChildren(...acts.map(([t,f])=>{const b=el('button',t);b.type='button';b.onclick=()=>{f();d.close();render();};return b;}),Object.assign(el('button','戻る'),{type:'button',onclick:()=>d.close()}));if(!d.open)d.showModal();}
// Presets (4 slots): lineup, rows and supply.
function presets(){const L=window.PROUnitLab,d=$('labWindow');$('labWinKind').textContent='編成プリセット';$('labWinTitle').textContent='PRO・D 編成';$('labWinBody').replaceChildren(el('p','呼び出すと、使えないユニットは外れます。','catalog-line'));
 const rowsBtn=[];for(let i=0;i<L.PRESETS;i++){const p=L.getPreset('dispatch',i),name=p?p.ids.map(id=>DD.defs[id]?.name||id).join('・'):'空き';const call=el('button','呼び出す '+(i+1)+'：'+name);call.type='button';call.disabled=!p;call.dataset.preset='load'+i;call.onclick=()=>{const m=mission();chosen=[];rows={...(p.rows||{})};supply={};for(const id of p.ids){const u=players().find(x=>x.id===id);if(u&&!DD.needsCrew(u)&&!T.joinReason(lineup(),sized(u),{maxDeploy:m.maxDeploy})&&!L.deployProblem(m,u,lvOf(id)))chosen.push(id);}d.close();render();};
  const put=el('button','保存 '+(i+1));put.type='button';put.disabled=!chosen.length;put.dataset.preset='save'+i;put.onclick=()=>{L.setPreset('dispatch',i,{ids:[...chosen],rows:{...rows}});presets();};rowsBtn.push(call,put);}
 $('labWinActions').replaceChildren(...rowsBtn,Object.assign(el('button','閉じる'),{type:'button',onclick:()=>d.close()}));if(!d.open)d.showModal();}
// Story lines in a centered command-style window.
function story(title,lines){return new Promise(resolve=>{if(!lines?.length){resolve();return;}const d=$('storyWindow');let i=0;const draw=()=>{$('storyTitle').textContent=title;$('storySpeaker').textContent=lines[i].speaker||'';$('storyText').textContent=lines[i].text||'';$('storyProgress').textContent=(i+1)+' / '+lines.length;$('storyNext').textContent=i>=lines.length-1?'閉じる':'次へ';};const done=()=>{d.close();resolve();};$('storyNext').onclick=()=>{i++;if(i>=lines.length)done();else draw();};$('storySkip').onclick=done;draw();if(!d.open)d.showModal();$('storyNext').focus();});}
function askWatch(m){const pref=window.PROField?.settings?.().dispatchBattle||'ask';if(pref!=='ask')return Promise.resolve(pref==='watch');return new Promise(resolve=>{const d=$('dispatchAsk');$('dispatchAskText').textContent=m.name+' を開始します。';$('dispatchWatch').onclick=()=>{d.close();resolve(true);};$('dispatchSkip').onclick=()=>{d.close();resolve(false);};d.showModal();$('dispatchWatch').focus();});}
const closed=()=>$('fieldBattle').open?new Promise(r=>$('fieldBattle').addEventListener('close',r,{once:true})):Promise.resolve();
async function start({watch}={}){const m=mission();if(!m||!chosen.length||window.PROUnitLab?.missionLock(m))return null;window.PROUnitsSeen?.mark(chosen,'ally');window.PROUnitsSeen?.mark([...m.enemies,...(m.waves||[]).flatMap(w=>w.enemies||[])],'enemy');await story(m.name+' / 作戦前',m.story?.before);
 // Story choice (display conditions apply); its flags go to the save, then its lines play.
 if(m.story?.choices?.length&&window.PROUnitLab){const ch=await window.PROUnitLab.pickChoice(m.name+' / 選択',m.story.choices);if(ch?.lines?.length)await story(m.name+' / 選択',ch.lines);}
 if(watch===undefined)watch=await askWatch(m);
 // Supply items are consumed now and boost their unit for this battle.
 const L=window.PROUnitLab,used={};for(const id of chosen){const it=supply[id];if(it&&L?.consumeItem(it))used[id]=it;}supply={};
  const ctx=B.buildBattle({flags:L?.flags()||{},allies:chosen.map(id=>{const base=C.levelStats(DD.defs[id],lvOf(id)),u={...base,skills:[...(base.skills||[]),...(L?.dispatchTreeSkills(id)||[])]};return used[id]?L.applySupply(u,used[id]):u;}),rows:chosen.map(id=>rowOf(DD.defs[id])),mission:m,enemyDefs:DD.defs,unitDefs:DD.defs},B.mulberry32(Date.now()%1000000));
 // Event condition sets (T&D) are checked against the save; event flags are kept after the battle.
 ctx.hooks.eventOk=e=>!e.conds?.list?.length||!L||L.evalConds(e.conds);
 $('fieldBattleSpeed').value=window.PROField?.settings?.().dispatchSpeed||'1';const c=DD.conditions(m),names=Object.fromEntries(Object.entries(DD.defs).map(([k,d])=>[k,d.name]));
 const label={win:'MISSION COMPLETE',lose:'MISSION FAILED',draw:'DRAW / 300TURN'};
 // The battle window opens behind a fade; the fight itself runs after the fade-in.
 let battle;await (window.PROTransition?window.PROTransition.run(()=>{battle=window.PROBattleScreen.play({title:m.name+' / RANK '+(m.diff||'C')+' / PRO・D',allies:ctx.allies,enemies:ctx.enemies,watch,closeLabel:'結果へ',speedSetting:'dispatchSpeed',sideLabels:{ally:'派遣部隊',enemy:'敵部隊'},info:()=>[c.win,hud(B.objectiveStatus(ctx))].filter(Boolean).join(' ｜ '),intro:['OPERATION START: '+m.name,c.win,c.lose,c.draw,'地形: '+(m.terrain||'標準'),...ruleTexts(m,names).map(t=>'RULE: '+t),...(m.waves||[]).map((w,i)=>'WAVE: '+C.waveText(w,i,names))].filter(Boolean),summary:r=>label[r.outcome]+' / '+r.turns+'TURN',run:hooks=>{Object.assign(ctx.hooks,hooks);return B.runBattle(ctx);}});}):null);const result=await battle;
 await closed();L?.mergeFlags(ctx.flags);if(result.outcome==='win')await story(m.name+' / 作戦後',m.story?.after);showResult(m,ctx,result,grantExp(m,ctx,result));return result;}
// EXP with the published rules: mission EXP (halved unless won, halved again if the unit fell) + defeat EXP of its kills.
function grantExp(m,ctx,r){const kills={};for(const k of ctx.killLog||[])if(k.killerSide==='ally'&&k.victimSide==='enemy'){const a=ctx.allies.find(x=>x.combatId===k.killer);if(a)kills[a.id]=(kills[a.id]||0)+C.defeatExp(ctx.enemies.find(x=>x.combatId===k.victim));}
 const rows=ctx.allies.filter(u=>!u.escort&&chosen.includes(u.id)).map(u=>({key:u.id,name:u.name,alive:u.alive,kills:kills[u.id]||0,amount:C.battleExp(C.missionExp(m),{win:r.outcome==='win',alive:u.alive,kills:kills[u.id]||0})}));
 const got=Object.fromEntries((window.PROUnitLab?.gainDispatchExp(rows.map(x=>({key:x.key,amount:x.amount})),Object.fromEntries(rows.map(x=>[x.key,x.name])))||[]).map(x=>[x.key,x]));return rows.map(x=>({...x,...(got[x.key]||{})}));}
// Same wording as the published game's objective HUD and rule list.
function hud(st){if(!st)return '';const p=[];if(st.totalWaves>1)p.push('第'+st.wave+'波／全'+st.totalWaves+'波');if(st.boss)p.push(st.boss.pending?'ボス: まだ出ていない':'ボス「'+st.boss.name+'」残り'+st.boss.hpPct+'%');if(st.defenseLeft!=null)p.push('防衛 あと'+st.defenseLeft+'TURN');if(st.escort)p.push('護衛「'+st.escort.name+'」'+(st.escort.alive?st.escort.hpPct+'%':'撃破'));if(st.nextWave)p.push('次の波: '+st.nextWave);if(st.turnsLeft!=null)p.push('制限まで あと'+st.turnsLeft+'TURN');p.push('敵 残り'+st.enemiesLeft+'体');return p.join(' ・ ');}
function ruleTexts(m,names){return (m.rules||[]).map(r=>{if(typeof r==='string')return r;if(r.type==='turn_limit')return r.value+'TURN以内に勝利しないと敗北';if(r.type==='reinforce')return r.turn+'TURN目に援軍 '+r.enemies.map(id=>names[id]||id).join('・');if(r.type==='deploy_tags')return '出撃制限 '+C.requirementText(r);return r.name||r.type||'特殊ルール';});}
// Result: credits, drops, stars, records, recruits and EXP go to the test save (PROUnitLab).
function showResult(m,ctx,r,exp=[]){const win=r.outcome==='win',draw=r.outcome==='draw',body=$('fieldResultBody'),add=(a,b)=>{const row=el('div',null,'result-row');row.append(el('span',a),el('b',b));body.append(row);};$('fieldResultTitle').textContent=win?'作戦成功':draw?'引き分け':'作戦失敗';$('fieldResultTitle').className=win?'win':'lose';$('fieldResultLead').textContent=m.name+' ・ '+r.turns+'TURN';body.replaceChildren();
 // Rewards are received into the test save: credits, drops, stars (first-time bonus), record and recruits.
 const all=ctx.allies.filter(u=>!u.escort),hpMax=all.reduce((n,u)=>n+u.maxHp,0),hpNow=all.reduce((n,u)=>n+Math.max(0,u.currentHp),0);
 const rep=window.PROUnitLab?.finishMission(m,{outcome:r.outcome,turns:r.turns,lost:all.some(u=>!u.alive),hpPct:hpMax?hpNow/hpMax*100:0,reward:m.reward||0,recruitPool:Object.values(DD.defs),itemName:DD.itemName});
 for(const x of window.PROUnitLab?.handleDispatchLosses(all.filter(u=>!u.alive).map(u=>DD.defs[u.id]).filter(Boolean))||[])add('撃破：'+x.name,x.text);
 if(rep){add(win?'報酬':'回収資金',rep.credits.toLocaleString()+' Cr');for(const it of rep.items)add('ドロップ',it.name+' ×'+it.count);if(win){const st=C.missionStars(m);add('作戦評価',rep.stars.map((ok,i)=>(ok?'★':'☆')+window.PROUnitLab.starText(st[i])).join(' ／ '));if(rep.starCredits)add('初獲得の星ボーナス','+'+rep.starCredits.toLocaleString()+' Cr（'+rep.newStars+'個）');for(const n of rep.recruits)add('加入',n);}}for(const u of ctx.allies.filter(u=>!u.escort))add(u.name,u.alive?'HP '+Math.max(0,Math.ceil(u.currentHp))+' / '+u.maxHp:'撃破');for(const t of window.PROUnitLab?.advanceDay()||[])add('研究完了',t);for(const x of exp)add(x.name+' 経験値','+'+x.amount+' EXP'+(x.kills?'（撃破 +'+x.kills+'）':'')+(x.lv?' ｜ Lv'+x.lv+(x.ups?'（'+x.ups+'上昇・SP+'+x.ups+'）':''):''));
 $('fieldResultMap').hidden=true;$('fieldResult').showModal();$('fieldResult').addEventListener('close',()=>{$('fieldResultMap').hidden=false;},{once:true});}
$('dispatchStart').onclick=()=>start();
$('dispatchAuto').onclick=auto;$('dispatchPresets').onclick=presets;
window.PRODispatch=Object.freeze({show,start,auto,estimate,supply:()=>({...supply}),choose:ids=>{chosen=[...ids];render();},chosen:()=>[...chosen],rows:()=>({...rows})});
})();
