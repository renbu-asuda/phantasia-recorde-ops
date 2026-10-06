/* PRO battle engine 1.5.1 — shared by the game and the makers' simulator. Plain script, file:// compatible.
 * Pure combat rules: no DOM access. Presentation happens through ctx.hooks; randomness through ctx.rng. */
(function(root){'use strict';
const C=root.PROCore;
const MAX_SLOTS=8;
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const num=(v,f)=>{const n=Number(v);return Number.isFinite(n)?n:f;};
const esc=s=>String(s).replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[m]));
function baseHitRate(acc,mob,accuracyPt=0){return clamp((70+(acc-mob)/10+accuracyPt)/100,.05,.95);}
const BASIC_WEAPON=Object.freeze({name:'通常攻撃',attackType:'melee',damageType:'physical',note:'使用可能な武装がない時の攻撃',powerPct:60,accuracyPt:10,critPt:0,targetCount:1,weight:1,minDamage:20,hitsMin:1,hitsMax:1,hitPowerPct:100});
const BUFF_STAT={atk_up_pct:['atk',1],def_up_pct:['def',1],mob_up_pct:['mob',1],acc_up_pct:['acc',1],atk_down_pct:['atk',-1],def_down_pct:['def',-1],mob_down_pct:['mob',-1],acc_down_pct:['acc',-1]};
const NOOP_HOOKS={log(){},logSkill(){},render(){},actionStart:async()=>{},actionEnd:async()=>{},popDamage(){},wait:async()=>{},gate:async()=>{},turnStart:async()=>{},spawned(){}};
function mulberry32(seed){let a=seed>>>0;return ()=>{a=(a+0x6D2B79F5)>>>0;let t=a;t=Math.imul(t^(t>>>15),t|1);t^=t+Math.imul(t^(t>>>7),t|61);return ((t^(t>>>14))>>>0)/4294967296;};}

// ---- combatants ----
function prepare(u){
  if(!u.status)u.status={buffs:[],stun:0,burn:null,taunt:null,shield:0};
  if(!u.weaponState)u.weaponState={};
  if(!u.skillUses)u.skillUses={};
  if(!u.row)u.row='front';
  if(!u.extraActions)u.extraActions=0;
  return u;
}
function combatant(def,side,combatId,extra={}){return prepare({...def,side,currentHp:def.hp,maxHp:def.hp,alive:true,skillUses:{},combatId,...extra});}
function createContext(o){
  const ctx={allies:o.allies,enemies:o.enemies,mission:o.mission||null,terrain:C.terrainMods(o.mission),turn:o.turn||0,stats:o.stats||{},rng:o.rng||(()=>Math.random()),hooks:{...NOOP_HOOKS,...(o.hooks||{})},enemyDefs:o.enemyDefs||{},unitDefs:o.unitDefs||{},killLog:o.killLog||[],pending:[],aborted:false,spawnCount:o.enemies.length,effects:{resistCount:0,resistSaved:0,tagCount:0,tagBonus:0}};
  for(const u of [...ctx.allies,...ctx.enemies])prepare(u);
  return ctx;
}
const alive=u=>u.alive;
function sideOf(ctx,u){return u.side==='ally'?ctx.allies:ctx.enemies;}
function oppOf(ctx,u){return u.side==='ally'?ctx.enemies:ctx.allies;}
function tagsOf(u){return Array.isArray(u?.tags)?u.tags:[];}
function statFor(ctx,u){return ctx.stats[u.combatId]||(ctx.stats[u.combatId]={name:u.name,side:u.side,actions:0,shots:0,hits:0,damage:0,damageTaken:0,kills:0});}
function rand(ctx,min,max){return ctx.rng()*(max-min)+min;}
function chance(ctx,p){return ctx.rng()<p;}
// Effective stat after buffs and terrain. With no modifiers this is exactly the unit's stat.
function eff(ctx,u,stat){let v=num(u[stat],0),pct=0;for(const b of u.status?.buffs||[])if(b.stat===stat)pct+=b.pct;if(pct)v*=Math.max(0,1+pct/100);if(stat==='mob'&&ctx.terrain.mobPct)v*=Math.max(.1,1+ctx.terrain.mobPct/100);return Math.max(0,v);}

// ---- skills ----
function skillUses(u,id){return u.skillUses?.[id]||0;}
function consumeSkill(u,sk){if(!u.skillUses)u.skillUses={};u.skillUses[sk.id]=(u.skillUses[sk.id]||0)+1;}
function condOk(ctx,u,sk,info){const c=sk.cond;if(!c)return true;switch(c.type){
  case 'hp_below':return u.currentHp/u.maxHp*100<=c.value;case 'hp_above':return u.currentHp/u.maxHp*100>=c.value;
  case 'turn_ge':return ctx.turn>=c.value;case 'turn_le':return ctx.turn<=c.value;
  case 'target_tag':return !!info.opponent&&tagsOf(info.opponent).includes(c.tag);
  case 'allies_le':return sideOf(ctx,u).filter(alive).length<=c.value;case 'enemies_le':return oppOf(ctx,u).filter(alive).length<=c.value;}return true;}
function skillReady(ctx,u,sk,info){if(sk.maxUses>0&&skillUses(u,sk.id)>=sk.maxUses)return false;if(!condOk(ctx,u,sk,info))return false;return chance(ctx,clamp(sk.chance,0,100)/100);}
// Signed HP effects bypass DEF/shields; damage still uses death/guts/kill accounting.
function healAmount(u,sk){if(!u.alive||!sk.value||(sk.value<0&&u.currentHp<=0))return 0;const raw=sk.effect==='heal_maxhp_pct'?u.maxHp*sk.value/100:sk.value;const amount=Math.sign(raw)*Math.max(1,Math.round(Math.abs(raw)));const before=u.currentHp;u.currentHp=clamp(u.currentHp+amount,0,u.maxHp);return Math.round(u.currentHp-before);}
function applyHpEvent(ctx,u,sk,info){
  if((ctx.hpEffectDepth||0)>=16)return '';ctx.hpEffectDepth=(ctx.hpEffectDepth||0)+1;
  try{const ts=skillTargets(ctx,u,sk,info),affected=[];let total=0;
    for(const t of ts){const delta=healAmount(t,sk);if(!delta)continue;affected.push(t);total+=Math.abs(delta);
      if(delta<0){const damage=-delta;statFor(ctx,t).damageTaken+=damage;const killer=u.side!==t.side?u:null;if(killer)statFor(ctx,killer).damage+=damage;
        ctx.hooks.popDamage(t,damage,false,1);if(t.currentHp<=0&&handleDeath(ctx,t,killer)&&killer&&killer.alive)triggerSkills(ctx,killer,'on_kill',{kills:1,opponent:t,hpEffect:true});}
    }
    if(!total)return '';ctx.hooks.render();const action=sk.value<0?'ダメージ':'HP回復';return affected.length===1&&affected[0]===u?`${total} ${action}`:`${names(affected)} に合計${total} ${action}`;
  }finally{ctx.hpEffectDepth--;}
}
function pickRandom(ctx,arr){return arr.length?arr[Math.floor(ctx.rng()*arr.length)]:null;}
function skillTargets(ctx,u,sk,info){
  const hostile=C.HOSTILE_EFFECTS.includes(sk.effect)||(C.SIGNED_HP_EFFECTS.includes(sk.effect)&&sk.value<0),mode=sk.target||(C.HOSTILE_EFFECTS.includes(sk.effect)?'opponent':'self');
  const own=sideOf(ctx,u).filter(alive),opp=oppOf(ctx,u).filter(alive);
  switch(mode){
  case 'self':return u.alive?[u]:[];
  case 'allies':return own;
  case 'weakest_ally':{let best=null;for(const x of own)if(!best||x.currentHp/x.maxHp<best.currentHp/best.maxHp)best=x;return best?[best]:[];}
  case 'enemies':return opp;
  case 'random_enemy':{const t=pickRandom(ctx,opp);return t?[t]:[];}
  case 'targets':return (info.targets||[]).filter(alive);
  case 'opponent':{const o=info.opponent;if(o&&o.alive&&o.side!==u.side)return [o];if(o&&o.alive&&!hostile)return [o];const t=hostile?pickRandom(ctx,opp):null;return t?[t]:[];}}
  return [];
}
const names=list=>list.map(x=>x.name).join('・');
function applyEvent(ctx,u,sk,info){
  const e=sk.effect,dur=sk.duration||(e==='stun'?1:2);
  if(C.SIGNED_HP_EFFECTS.includes(e))return applyHpEvent(ctx,u,sk,info);
  if(e==='shield'){const ts=skillTargets(ctx,u,sk,info);if(!ts.length||sk.value<=0)return '';for(const t of ts)t.status.shield=(t.status.shield||0)+Math.round(sk.value);return `${names(ts)} にバリア ${Math.round(sk.value)}`;}
  if(e==='extra_action'){if(u.extraTurn===ctx.turn||u.extraActions>0)return '';u.extraActions=1;return '再行動';}
  if(e==='taunt'){const ts=skillTargets(ctx,u,sk,info);if(!ts.length)return '';for(const t of ts)t.status.taunt={pct:Math.max(0,sk.value),turns:dur};return `${names(ts)} が挑発（${dur}TURN）`;}
  if(BUFF_STAT[e]){const [stat,sign]=BUFF_STAT[e],ts=skillTargets(ctx,u,sk,info);if(!ts.length)return '';for(const t of ts){t.status.buffs=t.status.buffs.filter(b=>b.src!==u.combatId+':'+sk.id);t.status.buffs.push({stat,pct:sign*Math.abs(sk.value),turns:dur,src:u.combatId+':'+sk.id});}return `${names(ts)} の${stat.toUpperCase()} ${sign>0?'+':'-'}${Math.abs(sk.value)}%（${dur}TURN）`;}
  if(e==='stun'){const ts=skillTargets(ctx,u,sk,info);if(!ts.length)return '';for(const t of ts)t.status.stun=Math.max(t.status.stun||0,dur);return `${names(ts)} をスタン（${dur}回行動不能）`;}
  if(e==='burn'){const ts=skillTargets(ctx,u,sk,info);if(!ts.length||sk.value<=0)return '';for(const t of ts)t.status.burn={dmg:Math.round(sk.value),turns:dur};return `${names(ts)} が炎上（毎TURN ${Math.round(sk.value)}・${dur}TURN）`;}
  return '';
}
function triggerSkills(ctx,u,trigger,info={}){
  const result={damageMult:1,hitAdd:0,critAdd:0,incomingHitAdd:0,damageTakenMult:1,resistMult:1,defPierce:0,tagBonus:[]};
  if(!u.alive)return result;
  for(const sk of u.skills||[]){
    if(!u.alive)break;
    if(sk.trigger!==trigger||!skillReady(ctx,u,sk,info))continue;
    let applied=false,detail='',preConsumed=false;
    if(trigger==='before_attack'){
      if(sk.effect==='damage_up_pct'){result.damageMult*=Math.max(0,1+sk.value/100);detail=`与ダメージ +${sk.value}%`;applied=true;}
      else if(sk.effect==='hit_up_pt'){result.hitAdd+=sk.value/100;detail=`命中 +${sk.value}pt`;applied=true;}
      else if(sk.effect==='crit_up_pt'){result.critAdd+=sk.value/100;detail=`CRIT +${sk.value}pt`;applied=true;}
      else if(sk.effect==='def_pierce_pct'){result.defPierce+=sk.value;detail=`DEF貫通 ${sk.value}%`;applied=true;}
      else if(sk.effect==='tag_damage_up_pct'&&sk.tag){if((info.targets||[]).some(t=>tagsOf(t).includes(sk.tag))){result.tagBonus.push({tag:sk.tag,pct:sk.value});detail=`対「${sk.tag}」 +${sk.value}%`;applied=true;}}
    }else if(trigger==='when_targeted'){
      if(sk.effect==='enemy_hit_down_pt'){result.incomingHitAdd-=Math.abs(sk.value)/100;detail=`敵命中 -${Math.abs(sk.value)}pt`;applied=true;}
      else if(sk.effect==='damage_reduce_pct'){result.damageTakenMult=Math.max(.05,result.damageTakenMult*Math.max(0,1-Math.abs(sk.value)/100));detail=`全ダメージ -${Math.abs(sk.value)}%`;applied=true;}
      else if(sk.effect==='weapon_resist_pct'&&weaponMatchesResist(info.weapon,sk.resistType)){const rm=Math.max(0,1-Math.abs(sk.value)/100);result.resistMult*=rm;result.damageTakenMult=Math.max(.05,result.damageTakenMult*rm);detail=`${resistTypeLabel(sk.resistType)}耐性 ${Math.abs(sk.value)}%`;applied=true;}
    }else if(sk.effect==='guts'){
      if(trigger==='on_death'&&u.currentHp<=0){u.currentHp=Math.max(1,Math.min(u.maxHp,Math.round(sk.value||1)));detail=`根性で踏みとどまった（HP ${u.currentHp}）`;applied=true;}
    }else if(sk.effect==='counter'){
      const target=info.opponent;if(target&&target.alive&&target.side!==u.side&&!info.counter){ctx.pending.push({unit:u,target,scale:Math.max(0,sk.value)/100});detail=`反撃 ${sk.value}%`;applied=true;}
    }else{if(C.SIGNED_HP_EFFECTS.includes(sk.effect)&&sk.value){consumeSkill(u,sk);preConsumed=true;}detail=applyEvent(ctx,u,sk,info);applied=!!detail;}
    if(preConsumed&&!applied)u.skillUses[sk.id]--;if(applied){if(!preConsumed)consumeSkill(u,sk);ctx.hooks.logSkill(u,sk,detail);}
  }
  return result;
}
function triggerRoundSkills(ctx,units,trigger){for(const u of units)if(u.alive)triggerSkills(ctx,u,trigger,{});}
function damageTypeLabel(type){return Object.hasOwn(C.DAMAGE_TYPES,type)?C.DAMAGE_TYPES[type]:'不明';}
function attackTypeLabel(type){return type==='melee'?'近接':type==='ranged'?'射撃':'不明';}
function resistTypeLabel(type){return Object.hasOwn(C.DAMAGE_TYPES,type)?C.DAMAGE_TYPES[type]:attackTypeLabel(type);}
function weaponMatchesResist(w,type){return Object.hasOwn(C.DAMAGE_TYPES,type)?w?.damageType===type:['melee','ranged'].includes(type)?w?.attackType===type:false;}
function weaponTypeLabel(w){return `${attackTypeLabel(w.attackType)}・${damageTypeLabel(w.damageType)}`;}

// ---- weapons and targets ----
function weaponReady(ctx,u,w){const st=u.weaponState?.[w.name];if(!st)return true;if(w.usesPerBattle&&st.used>=w.usesPerBattle)return false;if(w.cooldown&&ctx.turn<st.readyTurn)return false;return true;}
function chooseWeapon(ctx,attacker){
  const ws=(attacker.weapons||[]).filter(w=>weaponReady(ctx,attacker,w));if(!ws.length)return attacker.weapons?.length?BASIC_WEAPON:{...BASIC_WEAPON,name:'標準攻撃'};
  const total=ws.reduce((sum,w)=>sum+Math.max(.01,num(w.weight,1)),0);let r=ctx.rng()*total;
  for(const w of ws){r-=Math.max(.01,num(w.weight,1));if(r<=0)return w;}return ws[ws.length-1];
}
function markWeaponUsed(ctx,u,w){if(!w.usesPerBattle&&!w.cooldown)return;const st=u.weaponState[w.name]||(u.weaponState[w.name]={used:0,readyTurn:0});st.used++;if(w.cooldown)st.readyTurn=ctx.turn+w.cooldown+1;}
function chooseTargets(ctx,attacker,opponents,count,weapon){
  let pool=opponents.filter(alive);if(!pool.length)return [];
  // Melee cannot reach the back row while anyone stands in front.
  if(weapon?.attackType==='melee'&&pool.some(u=>u.row!=='back'))pool=pool.filter(u=>u.row!=='back');
  const limit=Math.min(Math.max(1,Math.floor(num(count,1))),pool.length),ai=attacker.ai;
  if(ai&&(ai.target==='lowest_hp'||ai.target==='highest_atk')){const key=ai.target==='lowest_hp'?u=>u.currentHp:u=>-eff(ctx,u,'atk');return [...pool].sort((a,b)=>key(a)-key(b)).slice(0,limit);}
  const mixedRows=pool.some(u=>u.row==='back')&&pool.some(u=>u.row!=='back');
  const weight=u=>{let w=mixedRows?(u.row==='back'?1:3):1;if(u.status?.taunt)w*=1+u.status.taunt.pct/100;if(ai?.target==='tag'&&tagsOf(u).includes(ai.tag))w*=10;return w;};
  const out=[],items=pool.map(u=>({u,w:weight(u)}));
  while(items.length&&out.length<limit){const total=items.reduce((s,x)=>s+x.w,0);let r=ctx.rng()*total,i=0;for(;i<items.length-1;i++){r-=items[i].w;if(r<0)break;}out.push(items.splice(i,1)[0].u);}
  return out;
}

// ---- weapon effects (1.10.1): fire once per action, before damage or after the attack ----
function emptyMods(){return {damageMult:1,hitAdd:0,critAdd:0,defPierce:0,tagBonus:[]};}
function weaponEffects(ctx,u,weapon,timing,info={}){
  const result=emptyMods(),list=weapon?.effects;if(!u.alive||!Array.isArray(list)||!list.length)return result;
  list.forEach((e,i)=>{
    if(e.timing!==timing||!u.alive)return;
    if(timing==='after'){const w=e.when||'always';if(w==='hit'&&!(info.hits>0))return;if(w==='crit'&&!(info.crits>0))return;if(w==='kill'&&!(info.kills>0))return;}
    const sk={id:'w:'+weapon.name+':'+i,name:weapon.name,weaponEffect:true,effect:e.effect,value:num(e.value,0),chance:e.chance??100,maxUses:0,cond:e.cond,tag:e.tag,duration:e.duration,target:e.target||(C.HOSTILE_EFFECTS.includes(e.effect)?'targets':'self')};
    // "When hit / crit" effects aimed at this attack's targets only reach the targets that were hit / critted.
    const einfo=timing==='after'&&(e.when==='hit'||e.when==='crit')?{...info,targets:e.when==='hit'?info.hitTargets||info.targets:info.critTargets||info.targets}:info;
    if(!skillReady(ctx,u,sk,einfo))return;
    let detail='';const v=sk.value;
    switch(e.effect){
    case 'damage_up_pct':result.damageMult*=Math.max(0,1+v/100);detail=`与ダメージ +${v}%`;break;
    case 'hit_up_pt':result.hitAdd+=v/100;detail=`命中 +${v}pt`;break;
    case 'crit_up_pt':result.critAdd+=v/100;detail=`CRIT +${v}pt`;break;
    case 'def_pierce_pct':result.defPierce+=v;detail=`DEF貫通 ${v}%`;break;
    case 'tag_damage_up_pct':if(sk.tag&&(info.targets||[]).some(t=>tagsOf(t).includes(sk.tag))){result.tagBonus.push({tag:sk.tag,pct:v});detail=`対「${sk.tag}」 +${v}%`;}break;
    case 'drain_pct':{const amount=Math.round((info.damage||0)*v/100);if(amount>0&&u.currentHp<u.maxHp){const before=u.currentHp;u.currentHp=Math.min(u.maxHp,u.currentHp+amount);const h=Math.round(u.currentHp-before);if(h>0)detail=`${h} HP吸収`;}break;}
    case 'recoil_pct':{const dmg=Math.max(1,Math.round(u.maxHp*v/100));if(v>0&&u.currentHp>1){const before=u.currentHp;u.currentHp=Math.max(1,u.currentHp-dmg);statFor(ctx,u).damageTaken+=before-u.currentHp;detail=`反動 ${before-u.currentHp} ダメージ`;}break;}
    default:detail=applyEvent(ctx,u,sk,einfo);
    }
    if(detail)ctx.hooks.logSkill(u,sk,detail);
  });
  return result;
}
function mergeMods(a,b){return {...a,damageMult:a.damageMult*b.damageMult,hitAdd:a.hitAdd+b.hitAdd,critAdd:a.critAdd+b.critAdd,defPierce:a.defPierce+b.defPierce,tagBonus:[...a.tagBonus,...b.tagBonus]};}

// ---- resolution ----
function handleDeath(ctx,u,killer){
  if(!u.alive||u._resolvingDeath)return false;u._resolvingDeath=true;
  try{triggerSkills(ctx,u,'on_death',{opponent:killer});}finally{delete u._resolvingDeath;}
  if(u.currentHp>0)return false;
  u.currentHp=0;u.alive=false;
  ctx.killLog.push({killer:killer?.combatId||null,killerSide:killer?.side||null,victim:u.combatId,victimKey:u.key||u.id,victimName:u.name,victimSide:u.side,turn:ctx.turn});
  if(killer)statFor(ctx,killer).kills++;
  for(const x of sideOf(ctx,u))if(x.alive)triggerSkills(ctx,x,'ally_down',{opponent:killer});
  return true;
}
async function resolveWeapon(ctx,attacker,weapon,targets,opts={}){
  const H=ctx.hooks;
  await H.actionStart(attacker,weapon,targets,opts);
  let actionResist=0,actionTag=0,actionHits=0,actionDmg=0,killCount=0,actionCrits=0,lastKilled=null,lastCritTarget=null;
  const attackerStat=statFor(ctx,attacker);if(!opts.counter){attackerStat.actions++;markWeaponUsed(ctx,attacker,weapon);}
  let attackMods=opts.counter?emptyMods():triggerSkills(ctx,attacker,'before_attack',{weapon,targets,allies:ctx.allies,enemies:ctx.enemies,opponent:targets[0]});
  if(!opts.counter&&weapon.effects?.length)attackMods=mergeMods(attackMods,weaponEffects(ctx,attacker,weapon,'before',{weapon,targets,opponent:targets[0]}));
  const terrainHit=(weapon.attackType==='melee'?ctx.terrain.meleeHitPt:ctx.terrain.rangedHitPt)||0;
  const targetResults=[];
  for(const target of targets){
    if(!attacker.alive)break;
    if(!target.alive)continue;
    const attempts=Math.max(1,Math.floor(rand(ctx,weapon.hitsMin,weapon.hitsMax+1)));
    attackerStat.shots+=attempts;
    const defenseMods=triggerSkills(ctx,target,'when_targeted',{attacker,weapon,allies:ctx.allies,enemies:ctx.enemies,opponent:attacker});
    if(!attacker.alive)break;if(!target.alive)continue;
    const baseHit=clamp(baseHitRate(eff(ctx,attacker,'acc'),eff(ctx,target,'mob'),weapon.accuracyPt+terrainHit)+attackMods.hitAdd+defenseMods.incomingHitAdd,.05,.95);
    const pierce=clamp(num(weapon.defPiercePct,0)+attackMods.defPierce,0,100);
    let targetHits=0,targetDmg=0,targetCrits=0,absorbed=0;
    for(let shot=0;shot<attempts;shot++){
      if(!target.alive||!attacker.alive)break;
      if(!chance(ctx,baseHit))continue;
      const critRate=clamp(.05+weapon.critPt/100+attackMods.critAdd,.01,.50),crit=chance(ctx,critRate);
      const perHitMin=Math.max(0,Math.round(weapon.minDamage));
      const def=eff(ctx,target,'def')*(1-pierce/100);
      let raw=Math.max(perHitMin,(C.weaponAttack(weapon,eff(ctx,attacker,'atk'))-def)*(weapon.hitPowerPct/100)*rand(ctx,.90,1.10));
      raw*=attackMods.damageMult;
      {const before=raw;for(const b of attackMods.tagBonus)if(tagsOf(target).includes(b.tag))raw*=Math.max(0,1+b.pct/100);if(raw>before+.5){const g=Math.round(raw-before);ctx.effects.tagCount++;ctx.effects.tagBonus+=g;actionTag+=g;}}
      if(opts.scale!==undefined)raw*=opts.scale;
      if(crit){raw*=1.5;targetCrits++;actionCrits++;lastCritTarget=target;}
      {const rm=defenseMods.resistMult||1,withoutResist=raw*(defenseMods.damageTakenMult/rm);raw*=defenseMods.damageTakenMult;if(rm<1&&withoutResist>raw+.5){const sv=Math.round(withoutResist-raw);ctx.effects.resistCount++;ctx.effects.resistSaved+=sv;actionResist+=sv;}}
      let dmg=Math.max(0,Math.round(raw));
      if(target.status?.shield>0){const ab=Math.min(target.status.shield,dmg);target.status.shield-=ab;dmg-=ab;absorbed+=ab;}
      target.currentHp-=dmg;targetHits++;targetDmg+=dmg;actionHits++;actionDmg+=dmg;attackerStat.hits++;attackerStat.damage+=dmg;statFor(ctx,target).damageTaken+=dmg;
      if(target.currentHp<=0&&target.alive){if(handleDeath(ctx,target,attacker)){killCount++;lastKilled=target;break;}}
    }
    if(targetHits>0){H.popDamage(target,targetDmg,targetCrits>0,targetHits,weapon);if(target.alive)triggerSkills(ctx,target,'after_damaged',{attacker,weapon,damage:targetDmg,opponent:attacker,counter:opts.counter});}
    else if(target.alive)triggerSkills(ctx,target,'on_evade',{attacker,weapon,opponent:attacker,counter:opts.counter});
    targetResults.push({target,hits:targetHits,damage:targetDmg,crits:targetCrits,attempts,down:!target.alive,absorbed});
    H.render();await H.wait(.35);
  }
  const targetNames=targets.map(t=>esc(t.name)).join(' / ');
  const absorbedTotal=targetResults.reduce((s,r)=>s+r.absorbed,0);
  const summary=actionHits?`${actionHits} HIT / ${actionDmg} TOTAL DMG${killCount?` / ${killCount} DOWN`:''}${absorbedTotal?` / バリア吸収 ${absorbedTotal}`:''}${actionResist?` / 耐性で -${actionResist}`:''}${actionTag?` / 特効 +${actionTag}`:''}`:`0 HIT / MISS`;
  H.log(`<span class="weapon">[${opts.counter?'反撃 ':''}${esc(weapon.name)} / ${esc(weaponTypeLabel(weapon))}]</span> ${esc(attacker.name)} → ${targetNames} : ${summary}`,actionCrits?'crit':'hit');
  if(targetResults.length>1){for(const r of targetResults){H.log(`　${esc(r.target.name)} : ${r.hits} HIT / ${r.damage} DMG${r.down?' / DOWN':''}`,r.down?'kill':'hit');}}
  if(!opts.counter&&weapon.effects?.length)weaponEffects(ctx,attacker,weapon,'after',{weapon,targets,hitTargets:targetResults.filter(r=>r.hits>0).map(r=>r.target),critTargets:targetResults.filter(r=>r.crits>0).map(r=>r.target),hits:actionHits,damage:actionDmg,crits:actionCrits,kills:killCount,opponent:targets.find(t=>t.alive)||targets[0]});
  if(!opts.counter){
    triggerSkills(ctx,attacker,'after_attack',{weapon,targets,hits:actionHits,damage:actionDmg,opponent:targets[0]});
    if(killCount>0)triggerSkills(ctx,attacker,'on_kill',{kills:killCount,weapon,opponent:lastKilled});
    if(actionCrits>0)triggerSkills(ctx,attacker,'on_crit',{weapon,opponent:lastCritTarget});
  }
  await H.actionEnd(attacker,weapon,targets,summary);
  return {hits:actionHits,damage:actionDmg,kills:killCount,crits:actionCrits};
}
async function processPending(ctx){
  while(ctx.pending.length){const p=ctx.pending.shift();if(!p.unit.alive||!p.target.alive)continue;const w=(p.unit.weapons||[])[0]||BASIC_WEAPON;await resolveWeapon(ctx,p.unit,w,[p.target],{counter:true,scale:p.scale});}
}
async function attack(ctx,attacker){
  if(!attacker.alive)return;
  if(attacker.status?.stun>0){attacker.status.stun--;ctx.hooks.log(`<span class="skill">[STUN]</span> ${esc(attacker.name)} は行動できない`,'sys');return;}
  for(let round=0;round<2;round++){
    const opp=oppOf(ctx,attacker);if(!opp.some(alive)||!attacker.alive)return;
    if(round===1){if(!(attacker.extraActions>0))return;attacker.extraActions=0;attacker.extraTurn=ctx.turn;ctx.hooks.log(`<span class="skill">[再行動]</span> ${esc(attacker.name)}`,'sys');}
    const weapon=chooseWeapon(ctx,attacker),targets=chooseTargets(ctx,attacker,opp,weapon.targetCount,weapon);if(!targets.length)return;
    await resolveWeapon(ctx,attacker,weapon,targets);await processPending(ctx);
  }
}

// ---- battle flow ----
function spawnEnemies(ctx,ids,label,rows){
  const made=[];ids.forEach((key,n)=>{const def=ctx.enemyDefs[key];if(!def)return;const i=ctx.spawnCount++;const u=ctx.hooks.makeEnemy?ctx.hooks.makeEnemy(key,i):combatant(def,'enemy',`e_${key}_${i}`,{id:`${key}_${i}`,key});prepare(u);u.id=`${key}_${i}`;u.key=key;if(rows&&rows[n])u.row=rows[n];ctx.enemies.push(u);made.push(u);});
  if(made.length){ctx.hooks.log(`<span class="skill">[${esc(label)}]</span> ${esc(made.map(u=>u.name+(u.row==='back'?'〔後衛〕':'')).join(' / '))} が出現`,'sys');ctx.hooks.spawned(made);}
  return made;
}
function tickStatuses(ctx){
  for(const u of [...ctx.allies,...ctx.enemies]){if(!u.status)continue;u.status.buffs=u.status.buffs.filter(b=>--b.turns>0);if(u.status.taunt&&--u.status.taunt.turns<=0)u.status.taunt=null;if(u.status.burn&&--u.status.burn.turns<=0)u.status.burn=null;}
}
function burnTick(ctx){
  for(const u of [...ctx.allies,...ctx.enemies]){if(!u.alive||!u.status?.burn)continue;const dmg=u.status.burn.dmg;u.currentHp-=dmg;statFor(ctx,u).damageTaken+=dmg;ctx.hooks.log(`<span class="skill">[炎上]</span> ${esc(u.name)} に ${dmg} DMG`,'hit');if(u.currentHp<=0)handleDeath(ctx,u,null);}
}
function battleRules(m){const rules=(m?.rules||[]).filter(r=>r&&typeof r==='object');return {limit:rules.find(r=>r.type==='turn_limit')?.value||0,reinforce:rules.filter(r=>r.type==='reinforce')};}
const DRAW_TURNS=300;
// Battle plan for a mission: waves with triggers, the boss (possibly inside a wave) and the escort add-on. (1.12.0)
function battlePlan(ctx){
  const m=ctx.mission||{},ob=m.objective||{type:'annihilate'},type=ob.type==='escort'||ob.type==='chain'?'annihilate':ob.type;
  const waves=(m.waves||[]).map(w=>({...C.normalizeWave(w),spawned:false,units:[]}));
  return {type,ob,waves,bossWave:type==='boss'?(ob.bossWave||0):-1,bossIndex:ob.bossIndex||0,boss:type==='boss'&&!(ob.bossWave)?ctx.enemies[ob.bossIndex||0]||null:null};
}
function spawnWave(ctx,plan,i){const w=plan.waves[i];if(!w||w.spawned)return;w.spawned=true;w.units=spawnEnemies(ctx,w.enemies,`第${i+2}波${w.label?'「'+w.label+'」':''}`,w.rows);if(plan.bossWave===i+1)plan.boss=w.units[plan.bossIndex]||null;}
function checkWaves(ctx,plan,phase){
  const left=ctx.enemies.filter(u=>u.alive).length;
  plan.waves.forEach((w,i)=>{if(w.spawned)return;
    if(w.when==='turn'&&phase==='turn'&&ctx.turn>=w.value)spawnWave(ctx,plan,i);
    else if(w.when==='remaining'&&phase!=='turn'&&left<=w.value&&left>0)spawnWave(ctx,plan,i);
    else if(w.when==='bossHp'&&plan.boss&&plan.boss.alive&&plan.boss.currentHp/plan.boss.maxHp*100<=w.value)spawnWave(ctx,plan,i);});
  // At the end of a turn, an empty field brings in the next unspawned wave, whatever its trigger (same timing as the classic 連戦).
  if(phase==='end'&&!ctx.enemies.some(alive)){const next=plan.waves.findIndex(w=>!w.spawned);if(next>=0)spawnWave(ctx,plan,next);}
}
function objectiveStatus(ctx){const plan=ctx.plan;if(!plan)return null;const m=ctx.mission||{},{limit}=battleRules(m);
  const total=plan.waves.length+1,spawned=1+plan.waves.filter(w=>w.spawned).length,next=plan.waves.find(w=>!w.spawned);
  const escort=ctx.allies.find(u=>u.escort);
  return {wave:spawned,totalWaves:total,boss:plan.type==='boss'?(plan.boss?{name:plan.boss.name,hpPct:Math.max(0,Math.round(plan.boss.currentHp/plan.boss.maxHp*100)),alive:plan.boss.alive}:{pending:true}):null,
    defenseLeft:plan.type==='defense'?Math.max(0,(plan.ob.turns||10)-(ctx.turn||0)):null,escort:escort?{name:escort.name,hpPct:Math.max(0,Math.round(escort.currentHp/escort.maxHp*100)),alive:escort.alive}:null,
    nextWave:next?C.waveWhenText(next):null,turnsLeft:limit?Math.max(0,limit-(ctx.turn||0)):null,enemiesLeft:ctx.enemies.filter(alive).length};}
async function runBattle(ctx,opts={}){
  const H=ctx.hooks,m=ctx.mission||{},{limit,reinforce}=battleRules(m);
  const plan=battlePlan(ctx);ctx.plan=plan;
  const maxTurns=limit||(plan.type==='defense'?Math.max(opts.maxTurns||DRAW_TURNS,plan.ob.turns||10):(opts.maxTurns||DRAW_TURNS));
  const fighters=()=>ctx.allies.filter(alive);
  const evaluate=()=>{
    if(!fighters().length)return 'lose';
    if(ctx.allies.some(u=>u.escort&&!u.alive))return 'lose';
    if(plan.type==='boss'&&plan.boss&&!plan.boss.alive)return 'win';
    if(plan.type!=='boss'&&!ctx.enemies.some(alive)&&plan.waves.every(w=>w.spawned))return 'win';
    return null;
  };
  triggerRoundSkills(ctx,[...ctx.allies,...ctx.enemies],'battle_start');await processPending(ctx);
  let turn=1,outcome=evaluate();
  while(!outcome&&turn<=maxTurns){
    ctx.turn=turn;await H.turnStart(turn);
    for(const r of reinforce)if(r.turn===turn)spawnEnemies(ctx,r.enemies,'援軍');
    checkWaves(ctx,plan,'turn');
    burnTick(ctx);outcome=evaluate();if(outcome)break;
    triggerRoundSkills(ctx,[...ctx.allies,...ctx.enemies],'turn_start');await processPending(ctx);H.render();
    const order=[...ctx.allies,...ctx.enemies].filter(alive).map(u=>({u,init:eff(ctx,u,'mob')+rand(ctx,0,100)})).sort((a,b)=>b.init-a.init).map(x=>x.u);
    for(const a of order){
      if(!a.alive)continue;if(!oppOf(ctx,a).some(alive))break;
      await H.gate();if(ctx.aborted)break;await attack(ctx,a);
      outcome=evaluate();if(outcome)break;
      checkWaves(ctx,plan,'action');outcome=evaluate();
      if(outcome||!ctx.allies.some(alive)||!ctx.enemies.some(alive))break;await H.wait(.35);
    }
    if(ctx.aborted)break;
    triggerRoundSkills(ctx,[...ctx.allies,...ctx.enemies],'turn_end');await processPending(ctx);tickStatuses(ctx);
    outcome=outcome||evaluate();
    if(!outcome){checkWaves(ctx,plan,'end');outcome=evaluate();}
    if(!outcome&&plan.type==='defense'&&turn>=(plan.ob.turns||10)&&fighters().length)outcome='win';
    H.render();turn++;if(!outcome)await H.wait(.4);
  }
  const turns=Math.max(1,outcome?ctx.turn||1:turn-1);
  if(!outcome)outcome=limit?'lose':'draw';
  return {outcome,turns,timeUp:!evaluate()&&turn>maxTurns,limit};
}

// ---- tools ----
function enemyRow(m,i,def){return m?.enemyRows?.[i]||def?.row||'front';}
function buildBattle(o,rng){
  const allies=o.allies.map((d,i)=>combatant(d,'ally',`a_${d.id}_${i}`,{row:o.rows?.[i]||d.row||'front'}));
  const m=o.mission||null,enemyIds=m?m.enemies.slice(0,MAX_SLOTS):o.enemies;
  const enemies=enemyIds.map((k,i)=>{const d=o.enemyDefs[k];return combatant(d,'enemy',`e_${k}_${i}`,{id:`${k}_${i}`,key:k,row:enemyRow(m,i,d)});});
  if(m?.objective?.escortUnitId){const d=o.unitDefs?.[m.objective.escortUnitId];if(d)allies.push(combatant(d,'ally','escort_'+d.id,{escort:true,row:'back'}));}
  return createContext({allies,enemies,mission:m,rng,enemyDefs:o.enemyDefs,unitDefs:o.unitDefs});
}
async function simulate(o){
  const trials=Math.max(1,Math.min(2000,Math.floor(num(o.trials,100)))),rng=mulberry32(num(o.seed,1));
  const out={trials,win:0,lose:0,draw:0,turns:[],allyDowns:0,perUnit:{}};
  for(let t=0;t<trials;t++){
    const ctx=buildBattle(o,rng);
    const r=await runBattle(ctx,{maxTurns:o.maxTurns});out[r.outcome]++;out.turns.push(r.turns);
    for(const u of ctx.allies){const s=ctx.stats[u.combatId]||{damage:0};const p=out.perUnit[u.combatId]||(out.perUnit[u.combatId]={name:u.name,damage:0,downs:0});p.damage+=s.damage;if(!u.alive){p.downs++;out.allyDowns++;}}
  }
  const turns=out.turns;return {trials,win:out.win,lose:out.lose,draw:out.draw,winRate:out.win/trials,meanTurns:turns.reduce((a,b)=>a+b,0)/trials,minTurns:Math.min(...turns),maxTurns:Math.max(...turns),allyDownsMean:out.allyDowns/trials,perUnit:Object.values(out.perUnit).map(p=>({name:p.name,meanDamage:p.damage/trials,downRate:p.downs/trials}))};
}
function damagePreview(att,weapon,def,mission){
  const ctx=createContext({allies:[prepare({...att,side:'ally',currentHp:att.hp,maxHp:att.hp,alive:true})],enemies:[prepare({...def,side:'enemy',currentHp:def.hp,maxHp:def.hp,alive:true})],mission});
  const a=ctx.allies[0],d=ctx.enemies[0],terrainHit=(weapon.attackType==='melee'?ctx.terrain.meleeHitPt:ctx.terrain.rangedHitPt)||0;
  // Weapon effects used before the attack are counted when they always fire (100%, no condition).
  const sure=(weapon.effects||[]).filter(e=>e.timing==='before'&&(e.chance??100)>=100&&!e.cond);
  const m=sure.length?weaponEffects(ctx,a,{...weapon,effects:sure},'before',{weapon,targets:[d],opponent:d}):emptyMods();let tagMult=1;for(const b of m.tagBonus)if(tagsOf(d).includes(b.tag))tagMult*=Math.max(0,1+b.pct/100);
  const hit=clamp(baseHitRate(eff(ctx,a,'acc'),eff(ctx,d,'mob'),weapon.accuracyPt+terrainHit)+m.hitAdd,.05,.95),crit=clamp(.05+weapon.critPt/100+m.critAdd,.01,.5);
  const defv=eff(ctx,d,'def')*(1-clamp(num(weapon.defPiercePct,0)+m.defPierce,0,100)/100),core=(C.weaponAttack(weapon,eff(ctx,a,'atk'))-defv)*(weapon.hitPowerPct/100)*m.damageMult*tagMult;
  const per=[.9,1,1.1].map(f=>Math.max(weapon.minDamage,core*f));const avgHit=per[1]*(1+.5*crit);
  const avgHits=(weapon.hitsMin+weapon.hitsMax)/2*hit,expected=avgHit*avgHits;
  return {hitRate:hit,critRate:crit,perHitMin:Math.round(per[0]),perHitAvg:Math.round(per[1]),perHitMax:Math.round(per[2]),critHit:Math.round(per[1]*1.5),avgHits,expected:Math.round(expected),actionsToKill:expected>0?Math.ceil(d.hp/expected):Infinity,terrainHit};
}
// ---- strength estimate (1.11.0, shared by the game and the makers) ----
// damage per action × actions survived against standard infantry; sqrt keeps the scale intuitive (2.0 ≈ two standard soldiers).
const STANDARD_UNIT=Object.freeze({id:'standard',name:'標準歩兵',tags:['歩兵','生身'],hp:3000,atk:250,def:0,mob:500,acc:500,skills:[],weapons:[C.weapon({...C.weaponDefaults,baseAtk:250,useUnitAtk:true})],deploy:{player:true,enemy:true}});
function unitPower(a){const ws=(a.weapons&&a.weapons.length)?a.weapons:[BASIC_WEAPON],total=ws.reduce((s,w)=>s+Math.max(.01,w.weight),0);
  let dmg=0;for(const w of ws)dmg+=damagePreview(a,w,STANDARD_UNIT).expected*Math.min(w.targetCount,3)*(Math.max(.01,w.weight)/total)*(1+.04*Math.min(4,w.effects?.length||0));
  const taken=Math.max(1,damagePreview(STANDARD_UNIT,STANDARD_UNIT.weapons[0],a).expected);return dmg*(a.hp/taken);}
let STD_POWER=0;
function powerRatio(a){if(!STD_POWER)STD_POWER=unitPower(STANDARD_UNIT);return Math.sqrt(unitPower(a)/STD_POWER);}
function starCount(r){return r<.75?1:r<.95?2:r<1.3?3:r<2.5?4:5;}
root.PROBattle=Object.freeze({version:'1.5.1',DRAW_TURNS,buildBattle,objectiveStatus,battlePlan,STANDARD_UNIT,unitPower,powerRatio,starCount,weaponEffects,MAX_SLOTS,BASIC_WEAPON,baseHitRate,mulberry32,esc,prepare,combatant,createContext,eff,statFor,triggerSkills,triggerRoundSkills,resolveWeapon,chooseWeapon,chooseTargets,attack,processPending,handleDeath,runBattle,spawnEnemies,simulate,damagePreview,weaponTypeLabel,damageTypeLabel,attackTypeLabel,resistTypeLabel,weaponMatchesResist});
})(window);

