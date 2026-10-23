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
// A battle without a map (PRO・D, the maker's test battle): every living holder supports its whole side (not itself).
// Recomputed at each turn start and on each death (a fallen holder stops at once); stats from the unit's own values
// (u._st, updated by 段階変化); HP / EN / ammo and 気力 at the turn start.
function battle(ctx,{skillsOf=u=>u.skills||[],enMax=()=>0}={}){const S=window.PROSupport,partsOf=u=>S.partsOf(skillsOf(u));
 const apply=()=>{for(const list of [ctx.allies,ctx.enemies])for(const u of list){if(!u.alive)continue;const t=S.empty();for(const o of list)if(o!==u&&o.alive)for(const p of partsOf(o))S.add(t,p);u._st=u._st||{atk:u.atk,def:u.def,mob:u.mob,acc:u.acc};u._set=u._set||{};for(const k of ['atk','def','mob','acc']){/* changed since the last apply (段階変化) → the new base */if(k in u._set&&u[k]!==u._set[k])u._st[k]=u[k];if(u._st[k]!=null)u[k]=u._set[k]=Math.max(0,Math.round(u._st[k]*(1+t[k]/100)));}if(S.any(t))u.sup=t;else delete u.sup;if(u.tcfg){u._tc=u._tc||u.tcfg;u.tcfg=S.tensionConfig(u._tc,t);}}};
 apply();S.wrap(ctx.hooks);const ts=ctx.hooks.turnStart;ctx.hooks.turnStart=async t=>{apply();if(t>1)for(const u of [...ctx.allies,...ctx.enemies]){const s=u.sup;if(!s||!u.alive)continue;if(s.healHp>0)u.currentHp=Math.min(u.maxHp,u.currentHp+Math.round(u.maxHp*s.healHp/100));const em=enMax(u);if(s.healEn>0&&em>0&&u.en!=null)u.en=Math.min(em,u.en+Math.ceil(em*s.healEn/100));if(s.healAmmo>0&&u.ammo)for(const w of u.weapons||[])if(w.ammo>0)u.ammo[w.key||w.name]=Math.min(w.ammo,(u.ammo[w.key||w.name]??w.ammo)+Math.ceil(w.ammo*s.healAmmo/100));if(s.tensionTurn&&u.tcfg)u.tension=Math.max(0,Math.min(u.tcfg.max,u.tension+s.tensionTurn));}return ts(t);};
 const sp=ctx.hooks.spawned;ctx.hooks.spawned=made=>{apply();return sp(made);};
 // A supporter destroyed or replaced (脱出) mid-turn: its support ends at once.
 const dd=ctx.hooks.died;ctx.hooks.died=u=>{apply();dd?.(u);};
 // A 段階変化 sets new base values (even one equal to the supported value).
 const ph=ctx.hooks.phased;ctx.hooks.phased=(u,p)=>{for(const k of Object.keys(p.stats||{}))if(u._st&&k in u._st){u._st[k]=u[k];if(u._set)delete u._set[k];}apply();ph?.(u,p);};}
window.PROSupport=Object.freeze({KEYS,LABEL,empty,partsOf,add,any,text,boost,mods,wrap,tensionConfig,battle});
})();
