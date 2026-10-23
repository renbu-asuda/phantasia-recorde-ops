/* 作戦コマンド (battle commands, modelled on Super Robot Wars' 精神コマンド): a command {id, name, costType: sp | tension |
   funds, cost, target, range, duration: now | battle | turn, fx} is used from the map (tactical only). fx keys: the
   味方支援 numbers (hit, evade, dmg, taken, crit, atk, def, mob, acc, move, range) kept for the duration, plus
   sureHit (always hits), dodge (evades one attack), dmgMult (×), takenDiv (1/n), and immediate ones: healHp / healEn /
   healAmmo (%), tension (気力 +, also out of 混乱), again (再動: the targets can act again).
   SP: the holder's skill points in total (spent or not) at the mission start, used up during the mission.
   Battle side: members carry cmdFx [{name, dur, fx}]; combatants carry cmd {sure, dodge, dmgMult, takenDiv}. */
(function(){'use strict';
const KEEP=['hit','evade','dmg','taken','crit','atk','def','mob','acc','move','range'],NOW=['healHp','healEn','healAmmo','tension','again'];
const TARGET={self:'自分',squadOne:'同じ部隊の味方1体',squadAll:'同じ部隊の全員',rangeAllies:'範囲の味方の部隊',allAllies:'味方全員',enemySquad:'範囲の敵の部隊'};
const COST={sp:'SP',tension:'気力',funds:'戦場資金'},DUR={now:'すぐ（回復・気力・再動だけ）',battle:'次の局地戦1回',turn:'次の自陣営ターン開始まで'};
const n=v=>Number.isFinite(Number(v))?Number(v):0;
const all=()=>window.PROTacticalData?.commands?.()||[];
const byId=id=>all().find(c=>c.id===id)||null;
// Commands a holder knows: unit.commands [{id, lv}] up to its level, plus skill parts tactical.commandIds.
function known(holder,skills,level){const ids=new Set();for(const c of holder?.commands||[])if(c?.id&&(n(c.lv)||1)<=(level||1))ids.add(c.id);for(const s of skills||[])for(const id of s?.tactical?.commandIds||[])ids.add(id);return [...ids].map(byId).filter(Boolean);}
const keeps=c=>c.duration!=='now'&&(KEEP.some(k=>n(c.fx?.[k]))||c.fx?.sureHit||c.fx?.dodge||n(c.fx?.dmgMult)>0||n(c.fx?.takenDiv)>0);
// Support-shaped totals of a member's lasting command effects (added to 味方支援).
function totals(list){const t={};for(const k of KEEP)t[k]=0;for(const e of list||[])for(const k of KEEP)t[k]+=n(e.fx?.[k]);return t;}
// Combatant battle extras from the lasting effects.
function battle(list){const out={sure:false,dodge:0,dmgMult:1,takenDiv:1};for(const e of list||[]){const f=e.fx||{};if(f.sureHit)out.sure=true;if(f.dodge)out.dodge++;if(n(f.dmgMult)>0)out.dmgMult*=n(f.dmgMult);if(n(f.takenDiv)>0)out.takenDiv*=n(f.takenDiv);}return out;}
function wrap(hooks){const prev=hooks.tensionMods;hooks.tensionMods=(a,t)=>{const x=prev?prev(a,t):{dmg:1,hit:0,crit:0},ca=a?.cmd,ct=t?.cmd;return {...x,dmg:x.dmg*(ca?ca.dmgMult:1)/(ct?ct.takenDiv:1),sure:!!(x.sure||ca?.sure)};};
 hooks.dodgeOnce=t=>{if(!(t?.cmd?.dodge>0))return false;t.cmd.dodge--;t.cmd.dodged=(t.cmd.dodged||0)+1;hooks.log?.(`<span class="skill">[作戦コマンド]</span> ${t.name} はひらめきで回避`,'sys');return true;};return hooks;}
const fxText=c=>{const f=c.fx||{},L={hit:'命中',evade:'回避',dmg:'与ダメージ%',taken:'被ダメージ%',crit:'クリティカル',atk:'ATK%',def:'DEF%',mob:'MOB%',acc:'ACC%',move:'MOVE',range:'射程',healHp:'HP回復%',healEn:'EN回復%',healAmmo:'弾薬回復%',tension:'気力'},out=[];
 if(f.sureHit)out.push('必中');if(f.dodge)out.push('1回回避');if(n(f.dmgMult)>0)out.push('ダメージ×'+f.dmgMult);if(n(f.takenDiv)>0)out.push('被ダメージ1/'+f.takenDiv);if(f.again)out.push('再動');for(const [k,l] of Object.entries(L))if(n(f[k]))out.push(l+(n(f[k])>0?'+':'')+n(f[k]));return out.join('・')||'効果なし';};
window.PROCommands=Object.freeze({KEEP,NOW,TARGET,COST,DUR,all,byId,known,keeps,totals,battle,wrap,fxText});
})();
