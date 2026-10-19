/* Battle window shared by Tactical local battles and PRO・D dispatch battles.
   Layout follows the PRO・D battle screen: allied / hostile fields, turn orb, action box, shot lane, log. */
(function(){'use strict';
const $=id=>document.getElementById(id);
let paused=false;
const speed=()=>Number($('fieldBattleSpeed').value||1);
const strip=h=>String(h).replace(/<[^>]*>/g,'').replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&quot;/g,'"').replace(/&#39;/g,"'").replace(/&amp;/g,'&');
function line(text,cls){const p=document.createElement('p');p.textContent=text;if(cls)p.className=cls;return p;}
/* o: {title, allies, enemies, watch, headless, closeLabel, turnLabel(t), summary(result), run(hooks)=>Promise<result>}
   run builds the context with the given hooks and resolves with the engine result. */
async function play(o){
 const watch=!!o.watch&&!o.headless,logs=[],visual={activeId:null,targetIds:[],weaponById:{}},mode={skip:!watch};paused=false;
 if(!o.headless){$('fieldBattleTitle').textContent=o.title||'局地戦';$('fieldBattleLog').replaceChildren();$('fieldBattleSummary').textContent='戦闘中…';$('fieldBattleClose').disabled=true;$('fieldBattleClose').textContent=o.closeLabel||'マップへ戻る';$('fieldBattlePause').textContent='一時停止';$('fieldBattleArena').hidden=!watch;$('fieldBattleControls').hidden=!watch;$('localTurnNumber').textContent='--';for(const id of ['localActor','localWeapon','localTarget','localResult'])$(id).textContent='';$('localActor').textContent='SYSTEM STANDBY';if(!$('fieldBattle').open)$('fieldBattle').showModal();}
 const wait=async ms=>{if(mode.skip)return;while(paused&&!mode.skip)await new Promise(r=>setTimeout(r,80));if(mode.skip)return;await new Promise(r=>setTimeout(r,ms/speed()));};
 const update=window.PROBattleView.createRenderer($('localAllyTeam'),$('localEnemyTeam'));
 const render=(force=false)=>{if(!watch||mode.skip&&!force)return;update(o.allies,o.enemies,visual);};
 const fire=(u,weapon)=>{if(mode.skip)return;const lane=$('localShotLane');lane.className='shot-lane';void lane.offsetWidth;lane.style.setProperty('--shot-duration',(380/speed())+'ms');lane.style.setProperty('--fx',weapon.fxColor||(u.side==='ally'?'#7fc3ff':'#ff8f89'));lane.className='shot-lane '+(u.side==='ally'?'ally-shot':'enemy-shot')+' fire';};
 const append=(text,cls)=>{const t=strip(text);logs.push({t,cls});if(watch&&!mode.skip){$('fieldBattleLog').append(line(t,cls));$('fieldBattleLog').scrollTop=$('fieldBattleLog').scrollHeight;}};
 $('fieldBattleSkip').onclick=()=>{mode.skip=true;paused=false;$('fieldBattleSummary').textContent='結果までスキップ中…';$('localShotLane').className='shot-lane';};
 $('fieldBattlePause').onclick=()=>{paused=!paused;$('fieldBattlePause').textContent=paused?'再開':'一時停止';};
 render();
 const hooks={log:(h,c)=>append(h,c==='turn'?'turn':c==='sys'?'sys':''),logSkill:(u,skill,text)=>append(u.name+' / '+skill.name+'：'+text,'skill'),render,spawned:()=>render(),
  turnStart:async t=>{$('localTurnNumber').textContent=t;append(o.turnLabel?o.turnLabel(t):'TURN '+t,'turn');await wait(350);},
  actionStart:async(u,weapon,targets)=>{if(mode.skip)return;visual.activeId=u.combatId;visual.targetIds=targets.map(t=>t.combatId);visual.weaponById[u.combatId]=weapon.name;$('localActor').textContent=u.name;$('localWeapon').textContent=weapon.name;$('localTarget').textContent='TARGET: '+targets.map(t=>t.name).join(' / ');$('localResult').textContent='FIRING';render();fire(u,weapon);await wait(380);},
  actionEnd:async(u,weapon,targets,result)=>{if(mode.skip)return;$('localResult').textContent=String(result);render();await wait(220);visual.activeId=null;visual.targetIds=[];delete visual.weaponById[u.combatId];render();}};
 try{const result=await o.run(hooks);if(o.headless)return {...result,logs:logs.map(l=>l.t)};
  $('fieldBattleSummary').textContent=o.summary?o.summary(result):'';visual.activeId=null;visual.targetIds=[];visual.weaponById={};$('fieldBattleLog').replaceChildren(...logs.map(l=>line(l.t,l.cls)));render(true);return result;}
 finally{if(!o.headless){$('fieldBattleControls').hidden=true;$('fieldBattleClose').disabled=false;paused=false;}}}
window.PROBattleScreen=Object.freeze({play});
})();
