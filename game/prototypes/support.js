/* 味方支援 (ally support): a passive skill part (skill.tactical.support {on, range, ...effects}) on any unit — pilot,
   infantry or machine (a radar truck: allies within 3 squares hit +15). It works for the allies of the holder's side
   whose squad is within range squares (walking distance) of the holder's squad, the holder's own squad included but
   not the holder itself. Overlapping supports add up, without a cap. In PRO・D (no map) it works for every ally.
   Effects: hit / evade / crit (pt), dmg (damage dealt %) / taken (damage received %), atk / def / mob / acc (%),
   move / range (+), healHp / healEn / healAmmo (% at the start of the side's turn), tensionTurn (気力 at the start of
   the side's turn, also out of 混乱), tensionGain (added to every rise of 気力). */
(function(){'use strict';
const KEYS=['hit','evade','dmg','taken','crit','atk','def','mob','acc','move','range','healHp','healEn','healAmmo','tensionTurn','tensionGain'];
const LABEL={hit:'命中',evade:'回避',dmg:'与ダメージ%',taken:'被ダメージ%',crit:'クリティカル',atk:'ATK%',def:'DEF%',mob:'MOB%',acc:'ACC%',move:'MOVE',range:'射程',healHp:'HP回復%',healEn:'EN回復%',healAmmo:'弾薬回復%',tensionTurn:'気力（ターン）',tensionGain:'気力の増え方'};
const n=v=>Number.isFinite(Number(v))?Number(v):0;
const empty=()=>Object.fromEntries(KEYS.map(k=>[k,0]));
// Support parts of a skill list: [{reach, hit, ..., range}]. In the data the reach is 'range' and the weapon range
// bonus 'rangeAdd'; in a part, reach is the reach and range the weapon range bonus.
const partsOf=skills=>(skills||[]).map(s=>s?.tactical?.support).filter(x=>x?.on).map(x=>({...Object.fromEntries(KEYS.map(k=>[k,n(k==='range'?x.rangeAdd:x[k])])),reach:Math.max(0,n(x.range))}));
function add(total,part){for(const k of KEYS)total[k]+=n(part[k]);return total;}
const any=s=>!!s&&KEYS.some(k=>s[k]);
const text=s=>KEYS.filter(k=>s?.[k]).map(k=>LABEL[k]+(s[k]>0?'+':'')+s[k]).join('・');
// A unit definition with the stat % applied (local battle combatant).
function boost(def,s){if(!any(s))return def;const o={...def};for(const k of ['atk','def','mob','acc'])if(s[k]&&o[k]!=null)o[k]=Math.max(0,Math.round(o[k]*(1+s[k]/100)));return o;}
// Battle modifiers of attacker a against target t ({dmg, hit, crit} like the tension hook).
function mods(a,t){const sa=a?.sup,st=t?.sup;return {dmg:(1+n(sa?.dmg)/100)*Math.max(0,1+n(st?.taken)/100),hit:(n(sa?.hit)-n(st?.evade))/100,crit:n(sa?.crit)/100};}
// Adds the support modifiers to a battle context's hooks (after PROTension.hooks, if any).
function wrap(hooks){const prev=hooks.tensionMods;hooks.tensionMods=(a,t)=>{const x=prev?prev(a,t):{dmg:1,hit:0,crit:0},y=mods(a,t);return {dmg:x.dmg*y.dmg,hit:x.hit+y.hit,crit:x.crit+y.crit};};return hooks;}
// 気力: the support's gain bonus on every rise.
function tensionConfig(c,s){if(!c||!n(s?.tensionGain))return c;const gain={};for(const [k,v] of Object.entries(c.gain))gain[k]=v>0?v+s.tensionGain:v;return {...c,gain};}
window.PROSupport=Object.freeze({KEYS,LABEL,empty,partsOf,add,any,text,boost,mods,wrap,tensionConfig});
})();
