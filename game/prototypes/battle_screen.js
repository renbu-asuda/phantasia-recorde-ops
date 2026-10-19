/* Battle window shared by Tactical local battles and PRO・D dispatch battles.
   Layout follows the PRO・D battle screen: allied / hostile fields, turn orb, action box, shot lane, log. */
(function(){'use strict';
const $=id=>document.getElementById(id);
let paused=false,steps=0,logFilter='all';
const speed=()=>Number($('fieldBattleSpeed').value||1);
const strip=h=>String(h).replace(/<[^>]*>/g,'').replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&quot;/g,'"').replace(/&#39;/g,"'").replace(/&amp;/g,'&');
const LOG_TYPES={turn:'turn',sys:'system',skill:'skill'};
function line(t,cls){const p=document.createElement('p');p.textContent=t;p.className=cls||'attack';p.dataset.logType=LOG_TYPES[cls]||'attack';return p;}
function applyFilter(){$('fieldBattleLog').dataset.filter=logFilter;for(const b of $('fieldBattleLogTools').querySelectorAll('[data-log-filter]'))b.setAttribute('aria-pressed',String(b.dataset.logFilter===logFilter));}
const hpOf=u=>Math.max(0,Math.ceil(u.currentHp));
/* o: {title, allies, enemies, watch, headless, closeLabel, sideLabels:{ally,enemy}, turnMax, info()->text, intro:[lines],
       outOfRange(u)->bool, speedSetting, summary(result), run(hooks)=>Promise<result>}
   run builds the context with the given hooks and resolves with the engine result. */
async function play(o){
 const watch=!!o.watch&&!o.headless,logs=[],visual={activeId:null,targetIds:[],weaponById:{}},mode={skip:!watch},before=new Map([...o.allies,...o.enemies].map(u=>[u.combatId,{name:u.name,side:u.side,hp:hpOf(u)}]));paused=false;steps=0;
 const side=(key,arr)=>{const live=arr.filter(u=>u.alive).length;return (o.sideLabels?.[key]||(key==='ally'?'派遣部隊':'敵部隊'))+' ・ 生存 '+live+'/'+arr.length;};
 const info=()=>{if(o.headless)return;$('localAllyLabel').textContent=side('ally',o.allies);$('localEnemyLabel').textContent=side('enemy',o.enemies);$('fieldBattleInfo').textContent=o.info?o.info():'';};
 if(!o.headless){$('fieldBattleTitle').textContent=o.title||'局地戦';$('fieldBattleLog').replaceChildren();$('fieldBattleDiff').replaceChildren();$('fieldBattleSummary').textContent='戦闘中…';$('fieldBattleClose').disabled=true;$('fieldBattleClose').textContent=o.closeLabel||'マップへ戻る';$('fieldBattlePause').textContent='一時停止';$('fieldBattleStep').disabled=true;$('fieldBattleArena').hidden=!watch;$('fieldBattleControls').hidden=!watch;$('localTurnNumber').textContent='--';$('localTurnMax').textContent=o.turnMax?'TURN / '+o.turnMax:'TURN';for(const id of ['localWeapon','localTarget','localResult'])$(id).textContent='';$('localActor').textContent='SYSTEM STANDBY';$('fieldBattleSpeed').onchange=()=>{if(o.speedSetting)window.PROField?.setSetting?.(o.speedSetting,$('fieldBattleSpeed').value);};applyFilter();info();if(!$('fieldBattle').open)$('fieldBattle').showModal();$('fieldBattle').scrollTop=0;}
 const wait=async ms=>{if(mode.skip)return;await new Promise(r=>setTimeout(r,ms/speed()));};
 // One action at a time: blocks while paused unless a step was requested.
 const gate=async()=>{while(paused&&!mode.skip&&!steps)await new Promise(r=>setTimeout(r,60));if(steps)steps--;};
 const update=window.PROBattleView.createRenderer($('localAllyTeam'),$('localEnemyTeam'));
 const mark=()=>{if(!o.outOfRange)return;for(const u of [...o.allies,...o.enemies]){const c=$('card_'+u.combatId);if(c)c.classList.toggle('out-of-range',!!u.alive&&o.outOfRange(u));}};
 const render=(force=false)=>{if(!watch||mode.skip&&!force)return;update(o.allies,o.enemies,visual);mark();info();};
 const fire=(u,weapon)=>{if(mode.skip)return;const lane=$('localShotLane');lane.className='shot-lane';void lane.offsetWidth;lane.style.setProperty('--shot-duration',(380/speed())+'ms');lane.style.setProperty('--fx',weapon.fxColor||(u.side==='ally'?'#7fc3ff':'#ff8f89'));lane.className='shot-lane '+(u.side==='ally'?'ally-shot':'enemy-shot')+' fire';};
 const pop=(t,dmg,crit)=>{if(mode.skip||!watch)return;const c=$('card_'+t.combatId);if(!c)return;const s=document.createElement('span');s.className='dmg-pop'+(crit?' crit':'')+(dmg<0?' heal':'');s.textContent=dmg<0?'+'+Math.round(-dmg):Math.round(dmg);c.append(s);setTimeout(()=>s.remove(),900/speed());};
 const append=(text,cls)=>{const t=strip(text);logs.push({t,cls});if(watch&&!mode.skip){$('fieldBattleLog').append(line(t,cls));$('fieldBattleLog').scrollTop=$('fieldBattleLog').scrollHeight;}};
 $('fieldBattleSkip').onclick=()=>{mode.skip=true;paused=false;$('fieldBattleSummary').textContent='結果までスキップ中…';$('localShotLane').className='shot-lane';};
 $('fieldBattlePause').onclick=()=>{paused=!paused;$('fieldBattlePause').textContent=paused?'再開':'一時停止';$('fieldBattleStep').disabled=!paused;};
 $('fieldBattleStep').onclick=()=>{if(paused)steps++;};
 for(const l of o.intro||[])append(l,'sys');
 render();
 const hooks={log:(h,c)=>append(h,c==='turn'?'turn':c==='sys'?'sys':''),logSkill:(u,skill,text)=>append(u.name+' / '+skill.name+'：'+text,'skill'),render,gate,popDamage:(t,d,c)=>pop(t,d,c),
  spawned:()=>{append('増援出現！','sys');if(!mode.skip&&watch)$('localResult').textContent='REINFORCEMENT';render();},
  turnStart:async t=>{$('localTurnNumber').textContent=t;append(o.turnMax?'TURN '+t+' / '+o.turnMax:'TURN '+t,'turn');info();await wait(350);},
  actionStart:async(u,weapon,targets)=>{if(mode.skip)return;visual.activeId=u.combatId;visual.targetIds=targets.map(t=>t.combatId);visual.weaponById[u.combatId]=weapon.name;$('localActor').textContent=u.name;$('localWeapon').textContent=weapon.name;$('localTarget').textContent='TARGET: '+targets.map(t=>t.name).join(' / ');$('localResult').textContent='FIRING';render();fire(u,weapon);await wait(380);},
  actionEnd:async(u,weapon,targets,result)=>{if(mode.skip)return;$('localResult').textContent=String(result);render();await wait(220);visual.activeId=null;visual.targetIds=[];delete visual.weaponById[u.combatId];render();}};
 try{const result=await o.run(hooks);if(o.headless)return {...result,logs:logs.map(l=>l.t)};
  $('fieldBattleSummary').textContent=o.summary?o.summary(result):'';visual.activeId=null;visual.targetIds=[];visual.weaponById={};$('fieldBattleLog').replaceChildren(...logs.map(l=>line(l.t,l.cls)));render(true);info();
  // Before → after for every unit whose HP changed.
  const diff=$('fieldBattleDiff');for(const u of [...o.allies,...o.enemies]){const b=before.get(u.combatId);if(!b)continue;const now=hpOf(u);if(now===b.hp&&u.alive)continue;const row=document.createElement('div');row.className='result-row '+(u.side==='enemy'?'enemy':'ally');const a=document.createElement('span'),v=document.createElement('b');a.textContent=(u.side==='enemy'?'敵 ':'')+u.name;v.textContent='HP '+b.hp+' → '+(u.alive?now:'撃破');row.append(a,v);diff.append(row);}
  return result;}
 finally{if(!o.headless){$('fieldBattleControls').hidden=true;$('fieldBattleClose').disabled=false;paused=false;steps=0;}}}
for(const b of document.querySelectorAll('#fieldBattleLogTools [data-log-filter]'))b.onclick=()=>{logFilter=b.dataset.logFilter;applyFilter();};
$('fieldBattleCopy').onclick=async()=>{const text=[...$('fieldBattleLog').children].map(p=>p.textContent).join('\n');try{await navigator.clipboard.writeText(text);$('fieldBattleCopy').textContent='コピーしました';}catch(e){$('fieldBattleCopy').textContent='コピーできませんでした';}setTimeout(()=>{$('fieldBattleCopy').textContent='ログをコピー';},1500);};
window.PROBattleScreen=Object.freeze({play});
})();
