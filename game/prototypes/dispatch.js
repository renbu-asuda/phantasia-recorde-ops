/* PRO・D (Dispatch) missions inside the prototype: pick units from the built-in data, run the published
   auto battle (PROBattle.runBattle) in the shared battle window, show a display-only result. No storage. */
(function(){'use strict';
const C=window.PROCore,B=window.PROBattle,DD=window.PRODispatchData,$=id=>document.getElementById(id);
let missionId=null,chosen=[],rows={};
const el=(tag,text,cls)=>{const e=document.createElement(tag);if(text!=null)e.textContent=text;if(cls)e.className=cls;return e;};
const mission=()=>DD.mission(missionId);
function show(id){if(id&&id!==missionId){missionId=id;chosen=[];rows={};}render();}
const rowOf=u=>rows[u.id]||u.row||'front';
function render(){const m=mission();if(!m)return;const c=DD.conditions(m);$('dispatchMissionName').textContent=m.name;$('dispatchMissionInfo').textContent=[c.win,c.lose,'地形：'+(m.terrain||'標準'),'最大'+m.maxDeploy+'体'].filter(Boolean).join(' ｜ ');
 const list=$('dispatchUnits');list.replaceChildren();for(const u of DD.players()){const on=chosen.includes(u.id),crew=DD.needsCrew(u),full=!on&&chosen.length>=m.maxDeploy,card=el('article',null,'prep-unit'+(on?' assigned':''));card.dataset.unit=u.id;const h=el('header');h.append(el('h3',u.name),el('small',(u.role||'')+' / HP '+u.hp+' / ATK '+u.atk+' / DEF '+u.def+' / MOB '+u.mob+' / ACC '+u.acc));card.append(h,el('p','武装：'+u.weapons.map(w=>w.name).join('・'),'prep-help'));if(crew)card.append(el('p','搭乗員が必要な機体（プロトタイプでは搭乗未対応）','prep-reason'));
  if(on){const rb=el('button','隊列：'+(rowOf(u)==='back'?'後衛':'前衛')+'（切替）','secondary');rb.type='button';rb.dataset.row=u.id;rb.onclick=()=>{rows[u.id]=rowOf(u)==='back'?'front':'back';render();};card.append(rb);}
  const b=el('button',on?'✓ 出撃メンバー（外す）':crew?'出撃不可':full?'出撃枠がいっぱい':'＋ 出撃メンバーに加える',on?'secondary':'primary');b.type='button';b.dataset.pick=u.id;b.disabled=!on&&(crew||full);b.onclick=()=>{chosen=on?chosen.filter(x=>x!==u.id):[...chosen,u.id];render();};card.append(b);list.append(card);}
 $('dispatchSummary').textContent=chosen.length+' / '+m.maxDeploy+'体を選択'+(chosen.length?'':' ｜ 最低1体を選んでください');$('dispatchStart').disabled=!chosen.length;}
// Story lines in a centered command-style window.
function story(title,lines){return new Promise(resolve=>{if(!lines?.length){resolve();return;}const d=$('storyWindow');let i=0;const draw=()=>{$('storyTitle').textContent=title;$('storySpeaker').textContent=lines[i].speaker||'';$('storyText').textContent=lines[i].text||'';$('storyProgress').textContent=(i+1)+' / '+lines.length;$('storyNext').textContent=i>=lines.length-1?'閉じる':'次へ';};const done=()=>{d.close();resolve();};$('storyNext').onclick=()=>{i++;if(i>=lines.length)done();else draw();};$('storySkip').onclick=done;draw();if(!d.open)d.showModal();$('storyNext').focus();});}
function askWatch(m){const pref=window.PROField?.settings?.().dispatchBattle||'ask';if(pref!=='ask')return Promise.resolve(pref==='watch');return new Promise(resolve=>{const d=$('dispatchAsk');$('dispatchAskText').textContent=m.name+' を開始します。';$('dispatchWatch').onclick=()=>{d.close();resolve(true);};$('dispatchSkip').onclick=()=>{d.close();resolve(false);};d.showModal();$('dispatchWatch').focus();});}
const closed=()=>$('fieldBattle').open?new Promise(r=>$('fieldBattle').addEventListener('close',r,{once:true})):Promise.resolve();
async function start({watch}={}){const m=mission();if(!m||!chosen.length)return null;await story(m.name+' / 作戦前',m.story?.before);if(watch===undefined)watch=await askWatch(m);
 const ctx=B.buildBattle({allies:chosen.map(id=>DD.defs[id]),rows:chosen.map(id=>rowOf(DD.defs[id])),mission:m,enemyDefs:DD.defs,unitDefs:DD.defs},B.mulberry32(Date.now()%1000000));
 $('fieldBattleSpeed').value=window.PROField?.settings?.().dispatchSpeed||'1';const c=DD.conditions(m),names=Object.fromEntries(Object.entries(DD.defs).map(([k,d])=>[k,d.name]));
 const label={win:'MISSION COMPLETE',lose:'MISSION FAILED',draw:'DRAW / 300TURN'};
 const result=await window.PROBattleScreen.play({title:m.name+' / RANK '+(m.diff||'C')+' / PRO・D',allies:ctx.allies,enemies:ctx.enemies,watch,closeLabel:'結果へ',speedSetting:'dispatchSpeed',sideLabels:{ally:'派遣部隊',enemy:'敵部隊'},info:()=>[c.win,hud(B.objectiveStatus(ctx))].filter(Boolean).join(' ｜ '),intro:['OPERATION START: '+m.name,c.win,c.lose,c.draw,'地形: '+(m.terrain||'標準'),...ruleTexts(m,names).map(t=>'RULE: '+t),...(m.waves||[]).map((w,i)=>'WAVE: '+C.waveText(w,i,names))].filter(Boolean),summary:r=>label[r.outcome]+' / '+r.turns+'TURN',run:hooks=>{Object.assign(ctx.hooks,hooks);return B.runBattle(ctx);}});
 await closed();if(result.outcome==='win')await story(m.name+' / 作戦後',m.story?.after);showResult(m,ctx,result);return result;}
// Same wording as the published game's objective HUD and rule list.
function hud(st){if(!st)return '';const p=[];if(st.totalWaves>1)p.push('第'+st.wave+'波／全'+st.totalWaves+'波');if(st.boss)p.push(st.boss.pending?'ボス: まだ出ていない':'ボス「'+st.boss.name+'」残り'+st.boss.hpPct+'%');if(st.defenseLeft!=null)p.push('防衛 あと'+st.defenseLeft+'TURN');if(st.escort)p.push('護衛「'+st.escort.name+'」'+(st.escort.alive?st.escort.hpPct+'%':'撃破'));if(st.nextWave)p.push('次の波: '+st.nextWave);if(st.turnsLeft!=null)p.push('制限まで あと'+st.turnsLeft+'TURN');p.push('敵 残り'+st.enemiesLeft+'体');return p.join(' ・ ');}
function ruleTexts(m,names){return (m.rules||[]).map(r=>{if(typeof r==='string')return r;if(r.type==='turn_limit')return r.value+'TURN以内に勝利しないと敗北';if(r.type==='reinforce')return r.turn+'TURN目に援軍 '+r.enemies.map(id=>names[id]||id).join('・');if(r.type==='deploy_tags')return '出撃制限 '+C.requirementText(r);return r.name||r.type||'特殊ルール';});}
// Display-only result: nothing is granted or saved.
function showResult(m,ctx,r){const win=r.outcome==='win',draw=r.outcome==='draw',body=$('fieldResultBody'),add=(a,b)=>{const row=el('div',null,'result-row');row.append(el('span',a),el('b',b));body.append(row);};$('fieldResultTitle').textContent=win?'作戦成功':draw?'引き分け':'作戦失敗';$('fieldResultTitle').className=win?'win':'lose';$('fieldResultLead').textContent=m.name+' ・ '+r.turns+'TURN';body.replaceChildren();
 add(win?'報酬':'回収資金',Math.round(win?m.reward:m.reward*(draw?0.25:0.12)).toLocaleString()+' Cr');if(win)for(const d of m.drops||[])add('ドロップ候補',(d.itemId||'')+'（'+(d.chance??100)+'%）');for(const u of ctx.allies.filter(u=>!u.escort))add(u.name,u.alive?'HP '+Math.max(0,Math.ceil(u.currentHp))+' / '+u.maxHp:'撃破');
 $('fieldResultMap').hidden=true;$('fieldResult').showModal();$('fieldResult').addEventListener('close',()=>{$('fieldResultMap').hidden=false;},{once:true});}
$('dispatchStart').onclick=()=>start();
window.PRODispatch=Object.freeze({show,start,choose:ids=>{chosen=[...ids];render();},chosen:()=>[...chosen],rows:()=>({...rows})});
})();
