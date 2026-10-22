/* Tension (気力): modelled on G Generation's tension. A number 0..max per unit (max up to 400, 200 when unset), starting
   each mission at half the max. States: 混乱 (0) / 弱気 / 通常 / 強気 / 超強気 (= max); the 通常 and 強気 lower bounds are
   set per unit (default 30 % / 70 % of max). With a pilot aboard the pilot's settings are used.
   Changes: attack, evade, kill, a kill by a squad mate (same side in a local battle) raise it; being hit lowers it
   (amounts: pack settings + skills). Effects per state (pack settings): damage %, hit / evade pt, crit pt; 混乱 can't
   attack. Weapons and skills can require a state (tactical.tensionMin). Skills change the settings with tactical.tension
   {max, normalMin, strongMin, initial, attack, hit, evade, kill, allyKill} (all added).
   Battle side: PROTension.hooks(ctx) gives the optional PROBattle hooks; combatants carry tension / tcfg. */
(function(){'use strict';
const STATES=['confused','weak','normal','strong','super'],LABEL={confused:'混乱',weak:'弱気',normal:'通常',strong:'強気',super:'超強気'},MAX_CAP=400;
const DEFAULTS={defaultMax:200,normalPct:30,strongPct:70,gain:{attack:5,hit:-5,evade:5,kill:20,allyKill:10},
 effects:{confused:{dmg:0,hit:0,evade:0,crit:0},weak:{dmg:-20,hit:-10,evade:-10,crit:0},normal:{dmg:0,hit:0,evade:0,crit:0},strong:{dmg:10,hit:5,evade:5,crit:0},super:{dmg:20,hit:10,evade:10,crit:10}}};
const n=(v,d)=>v===''||v==null||!Number.isFinite(Number(v))?d:Number(v);
// Pack settings (first loaded pack that sets them) over the defaults.
function settings(){const p=window.PROTacticalData?.tensionSettings?.()||{},g={...DEFAULTS.gain},e={};for(const k of Object.keys(g))g[k]=n(p.gain?.[k],g[k]);
 for(const st of STATES){e[st]={};for(const k of ['dmg','hit','evade','crit'])e[st][k]=n(p.effects?.[st]?.[k],DEFAULTS.effects[st][k]);}
 return {defaultMax:Math.min(MAX_CAP,Math.max(1,n(p.defaultMax,DEFAULTS.defaultMax))),normalPct:n(p.normalPct,DEFAULTS.normalPct),strongPct:n(p.strongPct,DEFAULTS.strongPct),gain:g,effects:e};}
// Settings of one unit: holder = the pilot aboard (else the unit), skills = the unit's skills (pilot and gear included).
function config(holder,skills){const S=settings(),t=holder?.tension||{},add={max:0,normalMin:0,strongMin:0,initial:0,attack:0,hit:0,evade:0,kill:0,allyKill:0};
 for(const s of skills||[]){const x=s?.tactical?.tension;if(!x)continue;for(const k of Object.keys(add))add[k]+=n(x[k],0);}
 const max=Math.min(MAX_CAP,Math.max(1,Math.round(n(t.max,S.defaultMax)+add.max))),clampB=v=>Math.min(max,Math.max(1,Math.round(v)));
 const normalMin=clampB(n(t.normalMin,max*S.normalPct/100)+add.normalMin),strongMin=Math.max(normalMin,clampB(n(t.strongMin,max*S.strongPct/100)+add.strongMin));
 const gain={};for(const k of Object.keys(S.gain))gain[k]=S.gain[k]+add[k];
 return {max,normalMin,strongMin,initial:Math.min(max,Math.max(0,Math.round(max/2+add.initial))),gain};}
function stateOf(v,c){if(!c)return 'normal';if(v<=0)return 'confused';if(v>=c.max)return 'super';if(v>=c.strongMin)return 'strong';if(v>=c.normalMin)return 'normal';return 'weak';}
const rank=s=>STATES.indexOf(s);
const meets=(v,c,min)=>!min||rank(stateOf(v,c))>=rank(min);
const text=(v,c)=>c?LABEL[stateOf(v,c)]+' '+v+'/'+c.max:'';
// PROBattle hooks for a context whose combatants carry tension (number) and tcfg (config).
function hooks(ctx){const S=settings(),has=u=>!!u?.tcfg,eff=u=>S.effects[stateOf(u.tension,u.tcfg)];
 const change=(u,d)=>{if(!has(u)||!d||!u.alive)return;const before=stateOf(u.tension,u.tcfg);u.tension=Math.max(0,Math.min(u.tcfg.max,u.tension+d));const after=stateOf(u.tension,u.tcfg);if(after!==before)ctx.hooks.log(`<span class="skill">[気力]</span> ${u.name}：${LABEL[after]}（${u.tension}）`,'sys');};
 const sideOf=u=>u.side==='ally'?ctx.allies:ctx.enemies;
 return {tensionMods:(a,t)=>{const ea=has(a)?eff(a):null,et=has(t)?eff(t):null;return {dmg:1+(ea?ea.dmg:0)/100,hit:((ea?ea.hit:0)-(et?et.evade:0))/100,crit:(ea?ea.crit:0)/100};},
  tensionEvent:(type,u)=>{if(!has(u))return;if(type==='kill'){change(u,u.tcfg.gain.kill);for(const x of sideOf(u))if(x!==u&&x.alive&&has(x))change(x,x.tcfg.gain.allyKill);return;}change(u,u.tcfg.gain[type]||0);},
  canAttack:u=>!has(u)||u.tension>0,
  weaponOk:(u,w)=>!has(u)||meets(u.tension,u.tcfg,w?.tactical?.tensionMin),
  skillOk:(u,s)=>!has(u)||meets(u.tension,u.tcfg,s?.tactical?.tensionMin)};}
window.PROTension=Object.freeze({STATES,LABEL,DEFAULTS,MAX_CAP,settings,config,stateOf,meets,text,hooks});
})();
