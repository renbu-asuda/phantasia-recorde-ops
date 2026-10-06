/* PRO shared data contract 2.3.0 — plain script, file:// compatible.
 * 1.9.0 adds Unit Schema 3 / Item Schema 3 / Mission Schema 2 / Bundle Schema 2 fields.
 * 1.10.1 adds weapon effects (before / after use) to Unit Schema 3.
 * 1.10.2 merges pilots into units (crew / pilotProfile → Unit Schema 4, Bundle Schema 3); legacy pilots convert to units.
 * 1.12.0: objective + add-on conditions, wave objects with triggers/rows, 300-turn draw, pack terrains → Mission Schema 3, Bundle Schema 4.
 * Packs that use none of the new fields keep their previous schema number so older games still read them. */
(function(root){'use strict';
const clone=x=>JSON.parse(JSON.stringify(x));
const stats={hp:'最大HP',atk:'攻撃',def:'防御',mob:'機動',acc:'照準'};
const STAT_KEYS=['hp','atk','def','mob','acc'];
const triggers={before_attack:'攻撃直前',when_targeted:'攻撃対象時',turn_start:'ターン開始',turn_end:'ターン終了',after_attack:'攻撃後',after_damaged:'被ダメージ後',on_kill:'撃破時',battle_start:'戦闘開始時',on_evade:'回避成功時',on_crit:'クリティカル時',ally_down:'味方撃破時',on_death:'撃破される時'};
const skillEffects={damage_up_pct:'与ダメージ上昇 %',hit_up_pt:'命中上昇 pt',crit_up_pt:'クリティカル上昇 pt',enemy_hit_down_pt:'敵命中低下 pt',damage_reduce_pct:'被ダメージ軽減 %',weapon_resist_pct:'属性耐性 %',heal_maxhp_pct:'最大HP割合回復 %',heal_flat:'固定HP回復',
  def_pierce_pct:'DEF貫通 %',tag_damage_up_pct:'タグ特効 %',guts:'根性（HPを値で残す）',counter:'反撃（威力 %）',shield:'バリア（吸収量）',extra_action:'再行動',taunt:'挑発（狙われ率 +%）',
  atk_up_pct:'ATK上昇 %',def_up_pct:'DEF上昇 %',mob_up_pct:'MOB上昇 %',acc_up_pct:'ACC上昇 %',atk_down_pct:'ATK低下 %',def_down_pct:'DEF低下 %（装甲破壊）',mob_down_pct:'MOB低下 %',acc_down_pct:'ACC低下 %',stun:'スタン（行動不能）',burn:'炎上（毎ターン固定ダメージ）'};
const LEGACY_TRIGGERS=['before_attack','when_targeted','turn_start','turn_end','after_attack','after_damaged','on_kill'];
const LEGACY_EFFECTS=['damage_up_pct','hit_up_pt','crit_up_pt','enemy_hit_down_pt','damage_reduce_pct','weapon_resist_pct','heal_maxhp_pct','heal_flat'];
const EVENT_EFFECTS=['heal_maxhp_pct','heal_flat','shield','extra_action','taunt','atk_up_pct','def_up_pct','mob_up_pct','acc_up_pct','atk_down_pct','def_down_pct','mob_down_pct','acc_down_pct','stun','burn'];
const allowed={before_attack:['damage_up_pct','hit_up_pt','crit_up_pt','def_pierce_pct','tag_damage_up_pct'],when_targeted:['enemy_hit_down_pt','damage_reduce_pct','weapon_resist_pct']};
for(const t of ['turn_start','turn_end','after_attack','on_kill','battle_start','on_crit','ally_down'])allowed[t]=[...EVENT_EFFECTS];
allowed.after_damaged=['counter',...EVENT_EFFECTS];allowed.on_evade=['counter',...EVENT_EFFECTS];allowed.on_death=['guts',...EVENT_EFFECTS];
const conditions={hp_below:'自分のHPが値%以下',hp_above:'自分のHPが値%以上',turn_ge:'値TURN目以降',turn_le:'値TURN目まで',target_tag:'相手が指定タグを持つ',allies_le:'生存味方が値体以下',enemies_le:'生存敵が値体以下'};
const skillTargets={self:'自分',allies:'味方全体',weakest_ally:'HP割合が最も低い味方',enemies:'敵全体',opponent:'攻撃相手',random_enemy:'ランダムな敵1体'};
const DURATION_EFFECTS=['taunt','atk_up_pct','def_up_pct','mob_up_pct','acc_up_pct','atk_down_pct','def_down_pct','mob_down_pct','acc_down_pct','stun','burn'];
const TARGETED_EFFECTS=['heal_maxhp_pct','heal_flat','shield',...DURATION_EFFECTS];
const HOSTILE_EFFECTS=['atk_down_pct','def_down_pct','mob_down_pct','acc_down_pct','stun','burn'];
const effects={heal_hp_flat:'HP固定回復',heal_hp_pct:'HP割合回復',heal_hp_full:'HP全回復',revive_hp_pct:'撃破から復帰',stat_up_flat:'能力固定強化',stat_up_pct:'能力割合強化',all_stats_up_flat:'全能力固定強化',add_skill:'スキル習得',add_weapon:'武装追加',credits_gain:'資金獲得',
  add_tag:'タグ追加（改造）',remove_tag:'タグ削除',sortie_buff:'次の出撃だけ能力アップ',loot_box:'ランダム箱',remove_skill:'習得スキルを外す',remove_weapon:'追加武装を外す',recruit_unit:'ユニット加入',equip_slot:'装備枠の増減',exp_gain:'経験値獲得',skill_point:'スキルポイント獲得'};
const LEGACY_ITEM_EFFECTS=['heal_hp_flat','heal_hp_pct','heal_hp_full','revive_hp_pct','stat_up_flat','stat_up_pct','all_stats_up_flat','add_skill','add_weapon','credits_gain'];
const aiTargets={random:'ランダム',lowest_hp:'HPが最も低い相手',highest_atk:'ATKが最も高い相手',tag:'指定タグを優先'};
const rows={front:'前衛',back:'後衛'};
const objectives={annihilate:'殲滅',boss:'ボス撃破',defense:'防衛（指定TURN耐える）',escort:'護衛',chain:'連戦'};
const ruleTypes={turn_limit:'TURN制限（超えたら敗北）',reinforce:'援軍',deploy_tags:'出撃タグ制限'};
const starTypes={clear:'勝利',no_loss:'撃破された味方なし',turns_le:'値TURN以内に勝利',hp_ge:'残りHP合計が値%以上'};
const days=['日','月','火','水','木','金','土'];
const TERRAINS={'標準':{},'市街地':{meleeHitPt:10},'森林':{rangedHitPt:-5,mobPct:5},'砂漠':{mobPct:-10},'夜間':{rangedHitPt:-10},'雪原':{mobPct:-5,rangedHitPt:-5},'島嶼':{mobPct:-5},'月面':{mobPct:-10},'宇宙':{banTags:['生身']},'水中':{rangedHitPt:-15}};
const safeId=id=>typeof id==='string'&&/^[a-zA-Z0-9_-]+$/.test(id)&&!['__proto__','constructor','prototype'].includes(id);
const has=(o,k)=>o&&Object.hasOwn(o,k)&&o[k]!==undefined&&o[k]!==null&&o[k]!=='';
function need(ok,msg){if(!ok)throw new Error(msg)}
function number(v,label,min=0,max=Number.MAX_SAFE_INTEGER,integer=false){need(v!==''&&v!==null&&v!==undefined,`${label}: 数値が必要です`);const n=Number(v);need(Number.isFinite(n)&&n>=min&&n<=max&&(!integer||Number.isSafeInteger(n)),`${label}: ${min}～${max}${integer?'の整数':''}で指定してください`);return n;}
function idList(raw,label,max=64){if(raw===undefined||raw===null)return [];need(Array.isArray(raw)&&raw.length<=max,label+'は'+max+'件以下の配列で指定してください');for(const id of raw)need(safeId(id),label+'のIDは英数字・_・-で指定してください: '+id);return [...raw];}
function parse(text,marker){if(text.trim().startsWith('{'))return JSON.parse(text);const at=text.indexOf(marker);need(at>=0,marker+' が見つかりません');const start=text.indexOf('{',at);need(start>=0,'データがありません');let depth=0,str=false,escape=false;for(let i=start;i<text.length;i++){const c=text[i];if(str){if(escape)escape=false;else if(c==='\\')escape=true;else if(c==='"')str=false;}else if(c==='"')str=true;else if(c==='{')depth++;else if(c==='}'&&!--depth)return JSON.parse(text.slice(start,i+1));}throw new Error('データ終端がありません');}
const MAX_TAGS=16,MAX_TAG_LENGTH=32;
function tagList(raw,label='タグ'){
  need(Array.isArray(raw),label+'は配列で指定してください');need(raw.length<=MAX_TAGS,label+'は16個以下にしてください');
  const result=[];for(const value of raw){need(typeof value==='string',label+'は文字列で指定してください');const tag=value.trim();need(tag.length>0&&tag.length<=MAX_TAG_LENGTH,label+'は1～32文字で指定してください');need(!result.includes(tag),label+'が重複しています: '+tag);result.push(tag);}return result;
}
function tagValue(v,label){need(typeof v==='string'&&v.trim().length>0&&v.trim().length<=MAX_TAG_LENGTH,label+'は1～32文字で指定してください');return v.trim();}
function statMap(raw,label,allowNegative=false){const o={};if(raw===undefined||raw===null)return o;need(typeof raw==='object'&&!Array.isArray(raw),label+'が不正です');for(const k of STAT_KEYS)if(has(raw,k)){const v=number(raw[k],label+' '+k,allowNegative?-1000000:0,1000000);if(v)o[k]=v;}return o;}
// ---- skills ----
// ---- attack attributes (1.12.3) ----
// damageType values, and the targets a resist skill can name (the attributes plus melee / ranged).
const DAMAGE_TYPES={physical:'物理',beam:'ビーム',special:'特殊',fantasy:'幻想'};
const RESIST_TYPES={...DAMAGE_TYPES,melee:'近接',ranged:'射撃'};
function skillExt(s,label='スキル'){
  const o={};
  if(has(s,'cond')){const c=s.cond;need(c&&typeof c==='object'&&Object.hasOwn(conditions,c.type),label+': 発動条件の種類が不正です');const cond={type:c.type};if(c.type==='target_tag')cond.tag=tagValue(c.tag,label+' 条件タグ');else cond.value=number(c.value,label+' 条件値',0,1000000);o.cond=cond;}
  if(has(s,'target')){need(Object.hasOwn(skillTargets,s.target),label+': 効果対象が不正です');o.target=s.target;}
  if(has(s,'duration'))o.duration=number(s.duration,label+' 持続TURN',1,99,true);
  if(has(s,'tag'))o.tag=tagValue(s.tag,label+' 特効タグ');
  if(s.effect==='tag_damage_up_pct')need(o.tag,label+': タグ特効には特効タグが必要です');
  return o;
}
function skill(s){need(s&&safeId(s.id)&&String(s.name||'').trim(),'スキルID・名前が必要です');need(allowed[s.trigger]?.includes(s.effect),'スキルの発動条件と効果の組み合わせが未対応です');const o={id:s.id,name:String(s.name),trigger:s.trigger,effect:s.effect,value:number(s.value,'効果値',0),chance:number(s.chance??100,'発動率',0,100),maxUses:number(s.maxUses??0,'発動回数',0,999,true),note:String(s.note||'')};if(s.effect==='weapon_resist_pct'){need(Object.hasOwn(RESIST_TYPES,s.resistType),'耐性対象が不正です（'+Object.values(RESIST_TYPES).join('・')+'から選んでください）');o.resistType=s.resistType;}Object.assign(o,skillExt(s,s.name));return o;}
function skillIsExtended(s){return !!s&&(!LEGACY_TRIGGERS.includes(s.trigger)||!LEGACY_EFFECTS.includes(s.effect)||['cond','target','duration','tag'].some(k=>has(s,k)));}
// ---- weapons ----
const weaponDefaults={"name":"E90","attackType":"ranged","damageType":"physical","note":"","powerPct":100,"accuracyPt":15,"critPt":0,"targetCount":1,"weight":1,"minDamage":50,"hitsMin":1,"hitsMax":4,"hitPowerPct":25};
// ---- weapon effects (1.10.1) ----
const weaponTimings={before:'使用前',after:'使用後'};
const WEAPON_BEFORE_ONLY=['damage_up_pct','hit_up_pt','crit_up_pt','def_pierce_pct','tag_damage_up_pct'];
const WEAPON_AFTER_ONLY=['drain_pct','recoil_pct'];
const weaponEffectsAllowed={before:[...WEAPON_BEFORE_ONLY,...EVENT_EFFECTS],after:[...EVENT_EFFECTS,...WEAPON_AFTER_ONLY]};
const weaponEffectTargets={targets:'この攻撃の対象全員',...skillTargets};
const weaponWhen={always:'いつでも',hit:'1発以上命中したとき',crit:'クリティカルが出たとき',kill:'撃破したとき'};
const WEAPON_EFFECT_MAX=4;
const weaponEffectLabels={...skillEffects,drain_pct:'HP吸収（与ダメージの %）',recoil_pct:'反動（最大HPの %）'};
function weaponEffect(e,label='追加効果'){
  need(e&&typeof e==='object'&&!Array.isArray(e),label+': 形式が不正です');
  need(Object.hasOwn(weaponTimings,e.timing),label+': タイミングは使用前（before）か使用後（after）で指定してください');
  need(weaponEffectsAllowed[e.timing].includes(e.effect),label+': このタイミングでは使えない効果です（'+(weaponEffectLabels[e.effect]||e.effect)+'）');
  const o={timing:e.timing,effect:e.effect,value:number(e.value??0,label+' 効果値',0,e.effect==='recoil_pct'||e.effect==='drain_pct'?100:1000000)};
  const c=number(e.chance??100,label+' 発動率',0,100);if(c!==100)o.chance=c;
  if(has(e,'target')){need(Object.hasOwn(weaponEffectTargets,e.target),label+': 効果対象が不正です');o.target=e.target;}
  if(has(e,'when')){need(e.timing==='after',label+': 発動のきっかけ（when）は使用後の効果だけに指定できます');need(Object.hasOwn(weaponWhen,e.when),label+': 発動のきっかけが不正です');if(e.when!=='always')o.when=e.when;}
  if(has(e,'duration'))o.duration=number(e.duration,label+' 持続TURN',1,99,true);
  const ext=skillExt({cond:e.cond,tag:e.tag,effect:e.effect},label);if(ext.cond)o.cond=ext.cond;if(ext.tag)o.tag=ext.tag;
  return o;
}
function weaponEffectHostile(e){return HOSTILE_EFFECTS.includes(e.effect);}
function weaponEffectText(e){
  const v=e.value,lab={damage_up_pct:`与ダメージ+${v}%`,hit_up_pt:`命中+${v}pt`,crit_up_pt:`CRIT+${v}pt`,def_pierce_pct:`DEF貫通${v}%`,tag_damage_up_pct:`対「${e.tag}」ダメージ+${v}%`,drain_pct:`与ダメージの${v}%を吸収`,recoil_pct:`反動で最大HPの${v}%ダメージ`,heal_maxhp_pct:`最大HPの${v}%回復`,heal_flat:`HP${v}回復`,shield:`バリア${v}`,extra_action:'再行動',taunt:`挑発（狙われ率+${v}%）`,stun:'スタン',burn:`炎上（毎TURN${v}）`};
  let body=lab[e.effect];if(!body){const m=/^(atk|def|mob|acc)_(up|down)_pct$/.exec(e.effect);body=m?`${m[1].toUpperCase()}${m[2]==='up'?'+':'-'}${v}%`:(weaponEffectLabels[e.effect]||e.effect);}
  const own=WEAPON_BEFORE_ONLY.includes(e.effect)||WEAPON_AFTER_ONLY.includes(e.effect)||e.effect==='extra_action';
  const tk=e.target||(weaponEffectHostile(e)?'targets':'self');
  const tg=own?'':tk==='targets'&&e.timing==='after'&&e.when==='hit'?'命中した相手':tk==='targets'&&e.timing==='after'&&e.when==='crit'?'クリティカルを受けた相手':weaponEffectTargets[tk];
  const dur=DURATION_EFFECTS.includes(e.effect)?`（${e.duration||(e.effect==='stun'?1:2)}TURN）`:'';
  const when=e.timing==='after'&&e.when&&e.when!=='always'?weaponWhen[e.when].replace('とき','ら')+'、':'';
  const cond=e.cond?'['+conditions[e.cond.type].replace('値',e.cond.value??'').replace('指定タグ','「'+(e.cond.tag||'')+'」')+'] ':'';
  const ch=e.chance!==undefined&&e.chance<100?`${e.chance}%の確率で`:'';
  return `${weaponTimings[e.timing]}: ${cond}${when}${ch}${tg?tg+'の':''}${body}${dur}`;
}
function weaponEffectsText(w){return (w?.effects||[]).map(weaponEffectText);}
function weaponExt(w,label='武装'){const o={};if(has(w,'usesPerBattle')){const v=number(w.usesPerBattle,label+' 1戦の使用回数',0,99,true);if(v)o.usesPerBattle=v;}if(has(w,'cooldown')){const v=number(w.cooldown,label+' 再使用待ちTURN',0,99,true);if(v)o.cooldown=v;}if(has(w,'defPiercePct')){const v=number(w.defPiercePct,label+' DEF貫通%',0,100);if(v)o.defPiercePct=v;}if(has(w,'fxColor')){need(/^#[0-9a-fA-F]{6}$/.test(w.fxColor),label+': 演出色は #RRGGBB で指定してください');o.fxColor=w.fxColor;}if(has(w,'effects')){need(Array.isArray(w.effects)&&w.effects.length<=WEAPON_EFFECT_MAX,label+': 追加効果は'+WEAPON_EFFECT_MAX+'個までです');const list=w.effects.map((e,i)=>weaponEffect(e,label+' 追加効果'+(i+1)));if(list.length)o.effects=list;}return o;}
function weaponIsExtended(w){return !!w&&(['usesPerBattle','cooldown','defPiercePct','fxColor'].some(k=>has(w,k)&&w[k]!==0)||(Array.isArray(w.effects)&&w.effects.length>0));}
function weapon(raw){need(raw&&String(raw.name||'').trim(),'武装名が必要です');const w={...weaponDefaults,...raw};need(['melee','ranged'].includes(w.attackType)&&Object.hasOwn(DAMAGE_TYPES,w.damageType),'武装分類が不正です（属性は'+Object.values(DAMAGE_TYPES).join('・')+'から選んでください）');const o={name:String(w.name),attackType:w.attackType,damageType:w.damageType,note:String(w.note||'')};for(const k of ['powerPct','accuracyPt','critPt','targetCount','weight','minDamage','hitsMin','hitsMax','hitPowerPct']){const limits={accuracyPt:[-100,100],critPt:[-100,100],targetCount:[1,8,true],weight:[.01,100000],hitsMin:[1,100,true],hitsMax:[1,100,true]};o[k]=number(w[k],k,...(limits[k]||[0,1000000]));}need(o.hitsMax>=o.hitsMin,'最大HIT数は最小HIT数以上にしてください');Object.assign(o,weaponExt(raw,o.name));return o;}
// ---- units ----
const IMAGE_MAX=400000;
function image(v,label){need(typeof v==='string'&&/^data:image\/(png|jpeg|webp|gif);base64,[A-Za-z0-9+/=]+$/.test(v),label+': 画像はPNG/JPEG/WebP/GIFのdata URLで指定してください');need(v.length<=IMAGE_MAX,label+': 画像データが大きすぎます（約300KBまで）');return v;}
function treeNode(n,label){need(n&&typeof n==='object'&&safeId(n.id),label+': スキルツリーのノードIDが必要です');const o={id:n.id,skill:skill(n.skill),cost:number(n.cost??1,label+' 必要SP',0,99,true),minLevel:number(n.minLevel??1,label+' 必要レベル',1,99,true),requires:idList(n.requires,label+' 前提ノード',16)};return o;}
function unitExt(u,label=u?.id||'ユニット'){
  const o={};
  if(has(u,'image'))o.image=image(u.image,label);
  if(has(u,'ai')){const a=u.ai;need(a&&Object.hasOwn(aiTargets,a.target),label+': AIの狙い方が不正です');o.ai={target:a.target};if(a.target==='tag')o.ai.tag=tagValue(a.tag,label+' AI優先タグ');}
  if(has(u,'row')){need(Object.hasOwn(rows,u.row),label+': 隊列は front / back です');o.row=u.row;}
  if(has(u,'growth')){const g=statMap(u.growth,label+' 成長値');if(Object.keys(g).length)o.growth=g;}
  if(has(u,'exp'))o.exp=number(u.exp,label+' 撃破経験値',0,1000000,true);
  if(has(u,'skillTree')){need(Array.isArray(u.skillTree)&&u.skillTree.length<=32,label+': スキルツリーは32ノードまでです');const nodes=u.skillTree.map((n,i)=>treeNode(n,label+' ノード'+(i+1)));const ids=new Set(nodes.map(n=>n.id));need(ids.size===nodes.length,label+': スキルツリーのノードIDが重複しています');for(const n of nodes)for(const r of n.requires)need(ids.has(r)&&r!==n.id,label+': 前提ノードが見つかりません: '+r);if(nodes.length)o.skillTree=nodes;}
  if(has(u,'crew')){need(Object.hasOwn(crews,u.crew),label+': パイロットの扱い（crew）は required / optional / none です');if(u.crew!=='optional')o.crew=u.crew;}
  if(has(u,'pilotProfile')){need(u.crew!=='required',label+': パイロットが必要な機体は、パイロットにはなれません');o.pilotProfile=pilotProfile(u.pilotProfile,label);}
  // 1.13.0: sortie cost, equipment slots, cannot be dismissed
  if(has(u,'sortieCost')){const v=number(u.sortieCost,label+' 出撃費用',0,1e9,true);if(v)o.sortieCost=v;}
  if(has(u,'equipSlots')){const v=number(u.equipSlots,label+' 装備枠',0,6,true);if(v!==2)o.equipSlots=v;}
  if(u.noFire===true)o.noFire=true;
  if(has(u,'recruit')){const r=u.recruit;need(r&&typeof r==='object',label+': 加入条件が不正です');if(r.locked){o.recruit={locked:true};if(has(r,'missionId')){need(safeId(r.missionId),label+': 加入作戦IDが不正です');o.recruit.missionId=r.missionId;}if(has(r,'note'))o.recruit.note=String(r.note).slice(0,200);}}
  return o;
}
// ---- pilots as units (1.10.2) ----
const crews={none:'自分で戦う（パイロットは乗れない）',optional:'パイロットを乗せられる（任意）',required:'パイロットが必要（機体）'};
function pilotProfile(raw,label){need(raw&&typeof raw==='object'&&!Array.isArray(raw),label+': パイロット設定が不正です');const p=pilot({id:'p',name:label,stats:raw.stats,skills:raw.skills,aptitude:raw.aptitude});need(p.skills.length<=8,label+': パイロットスキルは8個までです');const o={stats:p.stats,skills:p.skills};if(p.aptitude)o.aptitude=p.aptitude;o.growthPct=has(raw,'growthPct')?number(raw.growthPct,label+' パイロット補正の成長%',0,20):2;return o;}
function unitIsV4(u){return !!u&&(has(u,'pilotProfile')||(has(u,'crew')&&u.crew!=='optional'));}
function crewOf(u){return u?.crew||'optional';}
// Stat bonus a pilot unit gives the unit it rides: profile stats grow by growthPct% per pilot level above 1.
function pilotBonus(profile,lv=1){const f=1+(profile?.growthPct??2)/100*Math.max(0,(lv||1)-1),o={};for(const [k,v] of Object.entries(profile?.stats||{}))o[k]=Math.round(v*f);return o;}
const PILOT_UNIT_STATS={hp:3000,atk:500,def:0,mob:500,acc:500};
const PILOT_UNIT_WEAPON={name:'ハンドガン',attackType:'ranged',damageType:'physical',note:'',powerPct:90,accuracyPt:10,critPt:5,targetCount:1,weight:1,minDamage:30,hitsMin:1,hitsMax:2,hitPowerPct:60};
// Legacy pilots (bonus-only data) become standard infantry-class units that can also ride other units. IDs are kept so saves keep their assignments.
function pilotToUnit(raw,taken){const p=pilot(raw);let id=p.id;while(taken.has(id))id+='_pilot';taken.add(id);const tags=[...p.tags];for(const t of ['生身','パイロット'])if(!tags.includes(t))tags.push(t);return {id,name:p.name,mark:'',pilot:'',role:'パイロット',tags:tags.slice(0,MAX_TAGS),ability:'',...PILOT_UNIT_STATS,skills:[],weapons:[clone(PILOT_UNIT_WEAPON)],deploy:{player:true,enemy:false},crew:'none',pilotProfile:{stats:p.stats,skills:p.skills,...(p.aptitude?{aptitude:p.aptitude}:{}),growthPct:2},...(p.image?{image:p.image}:{}),...(p.note?{note:p.note}:{})};}
function pilotsToUnits(units,pilots){const taken=new Set((units||[]).map(u=>u.id)),idMap={},out=[];for(const p of pilotList(pilots)){const u=pilotToUnit(p,taken);idMap[p.id]=u.id;out.push(u);}return {units:[...(units||[]),...out],converted:out,idMap};}
function unitIsExtended(u){return !!u&&(Object.keys(unitExtSafe(u)).length>0||(u.skills||[]).some(skillIsExtended)||(u.weapons||[]).some(weaponIsExtended));}
function unitExtSafe(u){try{return unitExt(u)}catch(e){return {invalid:true}}}
function pilot(p){need(p&&safeId(p.id)&&String(p.name||'').trim(),'パイロットID・名前が必要です');const o={id:p.id,name:String(p.name),tags:tagList(p.tags??[],p.name+' タグ'),stats:statMap(p.stats,p.name+' 能力補正'),skills:(Array.isArray(p.skills)?p.skills:[]).map(skill),note:String(p.note||'')};need(new Set(o.skills.map(s=>s.id)).size===o.skills.length,p.name+': スキルIDが重複しています');if(has(p,'aptitude')){const a=p.aptitude;need(a&&typeof a==='object',p.name+': 適性が不正です');o.aptitude={tags:tagList(a.tags??[],p.name+' 適性タグ'),pct:number(a.pct??0,p.name+' 適性ボーナス%',0,200)};}if(has(p,'image'))o.image=image(p.image,p.name);return o;}
function unitTags(unit){
  if(Array.isArray(unit?.tags))return tagList(unit.tags);
  // Unit Schema 1/2 files before tags existed stored classification as role text.
  const legacy=String(unit?.role||'').split(/[／/・|]/).map(x=>x.trim()).filter(Boolean);
  return tagList([...new Set(legacy.filter(x=>x.length<=MAX_TAG_LENGTH).slice(0,MAX_TAGS))]);
}
function parseTags(text){const tags=String(text||'').split(/[,、\n]/).map(x=>x.trim()).filter(Boolean);return tagList(tags);}
function requirements(raw){
  if(raw===undefined||raw===null)return null;
  need(raw&&typeof raw==='object'&&!Array.isArray(raw),'使用条件 requires が不正です');
  const allTags=tagList(raw.allTags??[],'必須タグ'),anyTags=tagList(raw.anyTags??[],'いずれかのタグ'),noneTags=tagList(raw.noneTags??[],'除外タグ');
  need(!allTags.some(x=>noneTags.includes(x)),'必須タグと除外タグが重複しています');
  need(!anyTags.length||anyTags.some(x=>!noneTags.includes(x)),'いずれかのタグがすべて除外されています');
  return allTags.length||anyTags.length||noneTags.length?{...(allTags.length?{allTags}:{}),...(anyTags.length?{anyTags}:{}),...(noneTags.length?{noneTags}:{})}:null;
}
function checkRequirements(requires,unit){
  if(!requires)return {ok:true,reason:''};
  const tags=unitTags(unit),missing=(requires.allTags||[]).filter(x=>!tags.includes(x));
  if(missing.length)return {ok:false,reason:'必要タグ: '+missing.join('・')};
  if(requires.anyTags?.length&&!requires.anyTags.some(x=>tags.includes(x)))return {ok:false,reason:'いずれかのタグが必要: '+requires.anyTags.join(' / ')};
  const forbidden=(requires.noneTags||[]).filter(x=>tags.includes(x));
  if(forbidden.length)return {ok:false,reason:'使用不可のタグ: '+forbidden.join('・')};
  return {ok:true,reason:''};
}
function requirementText(requires){if(!requires)return '使用制限なし';return [requires.allTags?.length?'必須: '+requires.allTags.join('・'):'',requires.anyTags?.length?'いずれか: '+requires.anyTags.join(' / '):'',requires.noneTags?.length?'不可: '+requires.noneTags.join('・'):''].filter(Boolean).join(' / ');}
// ---- items ----
function lootTable(raw){need(Array.isArray(raw)&&raw.length>=1&&raw.length<=32,'ランダム箱の中身は1～32件です');return raw.map((r,i)=>{need(r&&safeId(r.itemId),'ランダム箱 '+(i+1)+': アイテムIDが不正です');const min=number(r.min??1,'ランダム箱 最小個数',1,999,true),max=number(r.max??min,'ランダム箱 最大個数',1,999,true);need(max>=min,'ランダム箱: 最大個数は最小個数以上にしてください');return {itemId:r.itemId,weight:number(r.weight??1,'ランダム箱 重み',.01,100000),min,max};});}
function effect(e){need(e&&Object.hasOwn(effects,e.type),'未対応のアイテム効果です');const o={type:e.type};
  switch(e.type){
  case 'add_skill':o.skill=skill(e.skill);break;
  case 'add_weapon':o.weapon=weapon(e.weapon);break;
  case 'heal_hp_full':break;
  case 'add_tag':case 'remove_tag':o.tag=tagValue(e.tag,'効果のタグ');break;
  case 'sortie_buff':need(Object.hasOwn(stats,e.stat)&&e.stat!=='hp','次の出撃バフの対象能力は atk / def / mob / acc です');o.stat=e.stat;o.value=number(e.value,'効果値 %',1,500,true);break;
  case 'loot_box':o.table=lootTable(e.table);break;
  case 'remove_skill':if(has(e,'skillId')){need(safeId(e.skillId),'外すスキルIDが不正です');o.skillId=e.skillId;}break;
  case 'remove_weapon':if(has(e,'name'))o.name=String(e.name);break;
  case 'recruit_unit':need(safeId(e.unitId),'加入ユニットIDが不正です');o.unitId=e.unitId;break;
  case 'equip_slot':o.value=number(e.value,'装備枠の増減',-3,3,true);need(o.value!==0,'装備枠の増減は -3～3（0以外）です');break;
  default:o.value=number(e.value,'効果値',1,e.type.endsWith('_pct')?100:Number.MAX_SAFE_INTEGER,true);if(e.type.startsWith('stat_up_')){need(Object.hasOwn(stats,e.stat),'対象能力が不正です');o.stat=e.stat;}
  }return o;}
function equipData(raw,label){need(raw&&typeof raw==='object','装備データが不正です');const o={slot:'accessory',stats:statMap(raw.stats,label+' 装備補正'),skills:(Array.isArray(raw.skills)?raw.skills:[]).map(skill),weapons:(Array.isArray(raw.weapons)?raw.weapons:[]).map(weapon)};need(o.skills.length<=8&&o.weapons.length<=4,label+': 装備のスキルは8個、武装は4個までです');return o;}
function itemExt(i){const o={};
  if(has(i,'price')){const v=number(i.price,i.id+' 価格',0,1e12,true);if(v)o.price=v;}
  if(has(i,'limitPerUnit')){const v=number(i.limitPerUnit,i.id+' 1体あたり使用回数',0,999,true);if(v)o.limitPerUnit=v;}
  if(has(i,'scope')){need(['unit','party'].includes(i.scope),i.id+': 使用範囲は unit / party です');if(i.scope==='party')o.scope='party';}
  if(has(i,'equip'))o.equip=equipData(i.equip,i.id);
  if(i.key===true)o.key=true;
  if(has(i,'shop')){const s=i.shop;need(s&&typeof s==='object',i.id+': ショップ条件が不正です');const shop={};if(has(s,'requiresResearch')){need(safeId(s.requiresResearch),i.id+': 研究IDが不正です');shop.requiresResearch=s.requiresResearch;}if(has(s,'requiresMission')){need(safeId(s.requiresMission),i.id+': 作戦IDが不正です');shop.requiresMission=s.requiresMission;}if(Object.keys(shop).length)o.shop=shop;}
  return o;}
function item(i){need(i&&safeId(i.id),'アイテムIDは英数字・_・-で指定してください');need(String(i.name||'').trim(),i.id+': 名前がありません');need(!(i.effect&&i.effects),i.id+': effect と effects は併用できません');const ext=itemExt(i),list=i.effects??(i.effect?[i.effect]:[]);need(Array.isArray(list)&&list.length<=8,i.id+': 効果は8個までです');need(list.length>0||ext.equip||ext.key,i.id+': 効果は1～8個です（装備品・キーアイテムは0個でも可）');const normalized=list.map(effect),requires=requirements(i.requires);return {id:i.id,name:String(i.name),desc:String(i.desc||''),...(requires?{requires}:{}),...(normalized.length===1?{effect:normalized[0]}:normalized.length?{effects:normalized}:{}),...ext};}
const itemEffects=i=>i.effects||(i.effect?[i.effect]:[]);
// 1.12.3: data that uses the fantasy attribute needs a game that knows it (Unit Schema 5 / Item Schema 4 / Bundle Schema 5).
// ---- 1.13.0: drops with exact odds, hire offers, new-field detection ----
function drop(d,label='ドロップ'){need(d&&safeId(d.itemId),label+': アイテムIDは英数字・_・-で指定してください');const min=number(d.min??1,label+' 最小個数',1,999,true),max=number(d.max??min,label+' 最大個数',1,999,true);need(max>=min,label+': 最大個数は最小個数以上にしてください');const o={itemId:d.itemId};
  if(has(d,'odds')){need(Array.isArray(d.odds)&&d.odds.length===2,label+': 分数の確率は [分子, 分母] です');const n=number(d.odds[0],label+' 分子',0,1000000,true),den=number(d.odds[1],label+' 分母',1,1000000,true);need(n<=den,label+': 分子は分母以下にしてください');o.odds=[n,den];}
  else o.chance=number(d.chance??0,label+' 確率',0,100);o.min=min;o.max=max;return o;}
function dropChance(d){return d?.odds?d.odds[0]/d.odds[1]:Math.max(0,Math.min(100,Number(d?.chance)||0))/100;}
function dropRateText(d){const pct=Math.round(dropChance(d)*100000)/1000;return d?.odds?`${d.odds[0]}/${d.odds[1]}（${pct}%）`:`${pct}%`;}
// "50" / "50%" / "1/8" / "１／８" -> {chance} or {odds}; null when it cannot be read
function parseDropRate(text){const t=String(text??'').replace(/[０-９]/g,c=>String.fromCharCode(c.charCodeAt(0)-0xFEE0)).replace(/[／]/g,'/').replace(/[％]/g,'%').replace(/\s/g,'');let m=t.match(/^(\d+)\/(\d+)$/);if(m){const n=+m[1],d=+m[2];return d>=1&&n<=d?{odds:[n,d]}:null;}m=t.match(/^(\d+(?:\.\d+)?)%?$/);if(m){const v=+m[1];return v<=100?{chance:v}:null;}return null;}
function hire(h,label){label=label||'雇用候補 '+(h?.id||'');need(h&&safeId(h.id),label+': IDは英数字・_・-で指定してください');need(safeId(h.unitId),label+': 雇うユニットIDが必要です');const o={id:h.id,unitId:h.unitId,cost:number(h.cost??0,label+' 雇用費',0,1e12,true)};
  const lim=number(h.limit??0,label+' 上限',0,99,true);if(lim)o.limit=lim;
  if(has(h,'requires')){const r=h.requires;need(r&&typeof r==='object'&&!Array.isArray(r),label+': 解放条件が不正です');const q={};const ms=idList(r.missions,label+' 必要な作戦'),rs=idList(r.research,label+' 必要な研究'),is=idList(r.items,label+' 必要なキーアイテム');if(ms.length)q.missions=ms;if(rs.length)q.research=rs;if(is.length)q.items=is;if(has(r,'day')){const v=number(r.day,label+' 経過日数',0,99999,true);if(v)q.day=v;}if(Object.keys(q).length)o.requires=q;}
  if(h.hidden===true)o.hidden=true;if(has(h,'note')&&String(h.note).trim())o.note=String(h.note).slice(0,200);return o;}
function hireList(raw){if(raw===undefined||raw===null)return [];need(Array.isArray(raw)&&raw.length<=200,'雇用候補は200件までです');const list=raw.map(x=>hire(x)),ids=new Set();for(const h of list){need(!ids.has(h.id),'雇用候補のIDが重複しています: '+h.id);ids.add(h.id);}return list;}
function hireRequirementText(h,names={}){const r=h?.requires||{},p=[];if(r.missions?.length)p.push('作戦クリア: '+r.missions.map(id=>names[id]||id).join('・'));if(r.research?.length)p.push('研究: '+r.research.map(id=>names[id]||id).join('・'));if(r.items?.length)p.push('キーアイテム: '+r.items.map(id=>names[id]||id).join('・'));if(r.day)p.push(r.day+'日目以降');return p.join(' ／ ')||'いつでも雇える';}
const unitIsV6=u=>!!u&&(Number(u.sortieCost)>0||(has(u,'equipSlots')&&Number(u.equipSlots)!==2)||u.noFire===true);
const missionIsV4=m=>!!m&&(m.hidden===true||(m.drops||[]).some(d=>d&&has(d,'odds')));
const itemIsV5=i=>!!i&&itemEffects(i).some(e=>e?.type==='equip_slot');
const researchIsV5=r=>!!r&&r.hidden===true;
const weaponIsFantasy=w=>!!w&&w.damageType==='fantasy';
const skillIsFantasy=s=>!!s&&s.resistType==='fantasy';
const unitIsFantasy=u=>!!u&&((u.weapons||[]).some(weaponIsFantasy)||(u.skills||[]).some(skillIsFantasy)||(u.skillTree||[]).some(n=>skillIsFantasy(n?.skill))||(u.pilotProfile?.skills||[]).some(skillIsFantasy));
const itemIsFantasy=i=>!!i&&(itemEffects(i).some(e=>(e?.type==='add_skill'&&skillIsFantasy(e.skill))||(e?.type==='add_weapon'&&weaponIsFantasy(e.weapon)))||(i.equip?.skills||[]).some(skillIsFantasy)||(i.equip?.weapons||[]).some(weaponIsFantasy));
function itemIsExtended(i){return !!i&&(['price','limitPerUnit','equip','key','shop'].some(k=>has(i,k))||i.scope==='party'||itemEffects(i).some(e=>!LEGACY_ITEM_EFFECTS.includes(e?.type)||(e?.type==='add_skill'&&skillIsExtended(e.skill))||(e?.type==='add_weapon'&&weaponIsExtended(e.weapon))));}
function research(r){need(r&&safeId(r.id)&&String(r.name||'').trim(),'研究ID・名前が必要です');const cost=r.cost||{},items={};if(cost.items){need(typeof cost.items==='object'&&!Array.isArray(cost.items),r.name+': 必要素材が不正です');for(const [id,n] of Object.entries(cost.items)){need(safeId(id),r.name+': 素材IDが不正です: '+id);items[id]=number(n,r.name+' 素材数',1,999,true);}}const u=r.unlock||{},grant={};if(u.grantItems){need(typeof u.grantItems==='object'&&!Array.isArray(u.grantItems),r.name+': 支給アイテムが不正です');for(const [id,n] of Object.entries(u.grantItems)){need(safeId(id),r.name+': 支給アイテムIDが不正です');grant[id]=number(n,r.name+' 支給数',1,999,true);}}return {id:r.id,name:String(r.name),desc:String(r.desc||''),cost:{credits:number(cost.credits??0,r.name+' 研究費',0,1e12,true),items},requires:idList(r.requires,r.name+' 前提研究',16),unlock:{units:idList(u.units,r.name+' 解放ユニット'),items:idList(u.items,r.name+' 解放ショップ品'),grantItems:grant},...(r.hidden===true?{hidden:true}:{})};}
function researchList(raw){if(raw===undefined||raw===null)return [];need(Array.isArray(raw)&&raw.length<=200,'研究は200件までです');const list=raw.map(research),ids=new Set();for(const r of list){need(!ids.has(r.id),'研究ID重複: '+r.id);ids.add(r.id);}for(const r of list)for(const q of r.requires)need(ids.has(q)&&q!==r.id,r.name+': 前提研究が見つかりません: '+q);return list;}
function pilotList(raw){if(raw===undefined||raw===null)return [];need(Array.isArray(raw)&&raw.length<=200,'パイロットは200人までです');const list=raw.map(pilot),ids=new Set();for(const p of list){need(!ids.has(p.id),'パイロットID重複: '+p.id);ids.add(p.id);}return list;}
function itemPack(p){need(p&&p.format==='VAIS_OUTER_OPS_ITEM_PACK'&&[1,2,3,4,5].includes(Number(p.schemaVersion))&&String(p.packId||'').trim()&&Array.isArray(p.items),'対応するItem Pack Schema 1～5ではありません');const items=p.items.map(item),ids=new Set();for(const i of items){need(!ids.has(i.id),'アイテムID重複: '+i.id);ids.add(i.id);}const res=researchList(p.research);const ext=res.length||items.some(itemIsExtended);return {format:p.format,schemaVersion:items.some(itemIsV5)||res.some(researchIsV5)?5:items.some(itemIsFantasy)?4:ext?3:2,packId:String(p.packId),packName:String(p.packName||p.packId),items,...(res.length?{research:res}:{})};}
// ---- missions ----
function story(raw,label){if(raw===undefined||raw===null)return null;need(typeof raw==='object'&&!Array.isArray(raw),label+': ストーリーが不正です');const lines=(arr,part)=>{if(arr===undefined||arr===null)return [];need(Array.isArray(arr)&&arr.length<=100,label+' '+part+': 会話は100行までです');return arr.map(l=>{need(l&&typeof l==='object'&&String(l.text||'').trim(),label+' '+part+': 会話の本文が必要です');return {speaker:String(l.speaker||'').slice(0,40),text:String(l.text).slice(0,500)};});};const o={before:lines(raw.before,'作戦前'),after:lines(raw.after,'勝利後')};return o.before.length||o.after.length?o:null;}
function rule(r,label){if(typeof r==='string')return r;need(r&&typeof r==='object','特殊ルールが不正です');if(!Object.hasOwn(ruleTypes,r.type))return clone(r);// unknown object rules are preserved as display data
  if(r.type==='turn_limit')return {type:r.type,value:number(r.value,label+' TURN制限',1,300,true)};
  if(r.type==='reinforce'){const enemies=idList(r.enemies,label+' 援軍',8);need(enemies.length>0,label+': 援軍の敵を1体以上指定してください');return {type:r.type,turn:number(r.turn,label+' 援軍TURN',1,99,true),enemies};}
  const req=requirements({allTags:r.allTags,anyTags:r.anyTags,noneTags:r.noneTags});return {type:r.type,...(req||{})};}
function missionExt(m,label=m?.id||'作戦'){
  const o={};
  if(has(m,'enemyRows')){need(Array.isArray(m.enemyRows)&&m.enemyRows.length<=8&&m.enemyRows.every(x=>Object.hasOwn(rows,x)),label+': 敵の隊列は front / back の配列です');if(m.enemyRows.some(x=>x==='back'))o.enemyRows=[...m.enemyRows];}
  if(has(m,'objective')){const ob=m.objective;need(ob&&Object.hasOwn(objectives,ob.type),label+': 勝利条件が不正です');const out={type:ob.type};
    if(ob.type==='defense')out.turns=number(ob.turns??10,label+' 防衛TURN',1,300,true);
    if(ob.type==='boss'){out.bossIndex=number(ob.bossIndex??0,label+' ボス番号',0,7,true);if(has(ob,'bossWave')){const w=number(ob.bossWave,label+' ボスの出る波',0,9,true);if(w)out.bossWave=w;}}
    if(ob.type==='escort'||has(ob,'escortUnitId')){need(safeId(ob.escortUnitId),label+': 護衛対象のユニットIDが必要です');out.escortUnitId=ob.escortUnitId;}
    if(out.type!=='annihilate'||out.escortUnitId)o.objective=out;}
  if(has(m,'waves')){need(Array.isArray(m.waves)&&m.waves.length<=9,label+': 追加ウェーブは9個までです');const waves=m.waves.map((w,i)=>wave(w,label+' 第'+(i+2)+'波'));if(waves.length)o.waves=waves;}
  if(o.objective?.bossWave){need(o.waves&&o.waves.length>=o.objective.bossWave,label+': ボスの出る波がありません');const wv=normalizeWave(o.waves[o.objective.bossWave-1]);need(o.objective.bossIndex<wv.enemies.length,label+': ボス番号がその波の敵の数を超えています');}
  else if(o.objective?.type==='boss')need(o.objective.bossIndex<(m.enemies||[]).length,label+': ボス番号が敵編成の数を超えています');
  if(o.objective?.type==='chain')need(o.waves?.length,label+': 連戦には追加ウェーブが必要です');
  if(has(m,'terrainMods')){const t=m.terrainMods;need(typeof t==='object'&&!Array.isArray(t),label+': 地形補正が不正です');const out={};for(const k of ['meleeHitPt','rangedHitPt'])if(has(t,k))out[k]=number(t[k],label+' '+k,-100,100);if(has(t,'mobPct'))out.mobPct=number(t.mobPct,label+' mobPct',-90,200);if(has(t,'banTags'))out.banTags=tagList(t.banTags,label+' 出撃禁止タグ');if(Object.keys(out).length)o.terrainMods=out;}
  if(has(m,'requires')){const r=m.requires;need(typeof r==='object'&&!Array.isArray(r),label+': 出撃条件が不正です');const out={};const ms=idList(r.missions,label+' 前提作戦'),is=idList(r.items,label+' 必要キーアイテム');if(ms.length)out.missions=ms;if(is.length)out.items=is;if(has(r,'minLevel'))out.minLevel=number(r.minLevel,label+' 必要レベル',1,99,true);if(Object.keys(out).length)o.requires=out;}
  const st=story(m.story,label);if(st)o.story=st;
  if(has(m,'stars')){need(Array.isArray(m.stars)&&m.stars.length<=3,label+': 星条件は3個までです');const s=m.stars.map(x=>{need(x&&Object.hasOwn(starTypes,x.type),label+': 星条件の種類が不正です');return ['turns_le','hp_ge'].includes(x.type)?{type:x.type,value:number(x.value,label+' 星条件値',1,100,true)}:{type:x.type};});if(s.length)o.stars=s;}
  if(has(m,'starReward'))o.starReward=number(m.starReward,label+' 星報酬',0,1e12,true);
  if(has(m,'days')){need(Array.isArray(m.days)&&m.days.length<=7&&m.days.every(d=>Number.isInteger(d)&&d>=0&&d<=6),label+': 曜日は0(日)～6(土)の配列です');if(m.days.length&&m.days.length<7)o.days=[...new Set(m.days)].sort();}
  if(has(m,'exp'))o.exp=number(m.exp,label+' 出撃経験値',0,1000000,true);
  if(m.hidden===true)o.hidden=true;
  if(has(m,'drops')){need(Array.isArray(m.drops)&&m.drops.length<=32,label+': ドロップは32件までです');const ds=m.drops.map((d,i)=>drop(d,label+' ドロップ'+(i+1)));if(ds.some(d=>d.odds))o.drops=ds;}
  return o;
}
function missionIsExtended(m){try{return Object.keys(missionExt(m)).length>0||(m.rules||[]).some(r=>r&&typeof r==='object'&&Object.hasOwn(ruleTypes,r.type));}catch(e){return true}}
// ---- waves, conditions (1.12.0) ----
const waveTriggers={cleared:'前の敵がいなくなったら',turn:'指定TURNの開始時',remaining:'敵が残りN体以下になったら',bossHp:'ボスのHPがN%以下になったら'};
function wave(w,label){
  if(Array.isArray(w)){const ids=idList(w,label,8);need(ids.length>0,label+'が空です');return ids;}
  need(w&&typeof w==='object',label+': 形式が不正です');const enemies=idList(w.enemies,label,8);need(enemies.length>0,label+'の敵がいません');
  const when=w.when||'cleared';need(Object.hasOwn(waveTriggers,when),label+': 出現条件が不正です');
  const o={enemies,when};
  if(has(w,'rows')){need(Array.isArray(w.rows)&&w.rows.length<=8&&w.rows.every(x=>Object.hasOwn(rows,x)),label+': 隊列は front / back の配列です');if(w.rows.some(x=>x==='back'))o.rows=w.rows.slice(0,enemies.length);}
  if(when==='turn')o.value=number(w.value,label+' 出現TURN',1,300,true);
  if(when==='remaining')o.value=number(w.value??0,label+' 残り体数',0,8,true);
  if(when==='bossHp')o.value=number(w.value??50,label+' ボスHP%',1,99,true);
  if(has(w,'label'))o.label=String(w.label).slice(0,40);
  return (when==='cleared'&&!o.rows&&!o.label)?enemies:o;
}
function normalizeWave(w){if(Array.isArray(w))return {enemies:[...w],rows:[],when:'cleared'};return {enemies:[...(w?.enemies||[])],rows:[...(w?.rows||[])],when:w?.when||'cleared',...(w?.value!==undefined?{value:w.value}:{}),...(w?.label?{label:w.label}:{})};}
function waveIsExtended(w){return !Array.isArray(w);}
function groupNames(ids,names){const counts=new Map();for(const id of ids){const n=names?.[id]||id;counts.set(n,(counts.get(n)||0)+1);}return [...counts].map(([n,c])=>c>1?`${n}×${c}`:n).join('・');}
function formationText(ids,rowsArr,names){const f=[],b=[];ids.forEach((id,i)=>((rowsArr||[])[i]==='back'?b:f).push(id));return [f.length?'前衛 '+groupNames(f,names):'',b.length?'後衛 '+groupNames(b,names):''].filter(Boolean).join('／')||'なし';}
function waveWhenText(w){const n=normalizeWave(w);return n.when==='turn'?`${n.value}TURN目に`:n.when==='remaining'?`敵が残り${n.value}体以下になったら`:n.when==='bossHp'?`ボスのHPが${n.value}%以下になったら`:'前の敵がいなくなったら';}
function waveText(w,index,names){const n=normalizeWave(w);return `第${index+2}波${n.label?'「'+n.label+'」':''}（${waveWhenText(n)}）：${formationText(n.enemies,n.rows,names)}`;}
function bossOf(m){const ob=m?.objective;if(!ob||ob.type!=='boss')return null;const wv=ob.bossWave||0;const list=wv?normalizeWave((m.waves||[])[wv-1]).enemies:(m.enemies||[]);return {wave:wv,index:ob.bossIndex||0,id:list[ob.bossIndex||0]};}
const DRAW_TURNS=300;
function missionConditions(m,names={}){
  const ob=m?.objective||{type:'annihilate'},type=ob.type==='escort'||ob.type==='chain'?'annihilate':ob.type,waves=(m?.waves||[]).length,rules=(m?.rules||[]).filter(r=>r&&typeof r==='object');
  const limit=rules.find(r=>r.type==='turn_limit')?.value||0,boss=bossOf(m);
  const win=type==='boss'?`ボス「${names[boss?.id]||boss?.id||'?'}」を倒す${boss?.wave?`（第${boss.wave+1}波で出現）`:''}`:type==='defense'?`${ob.turns||10}TURN耐える（敵を全滅させても勝利）`:waves?`全${waves+1}波の敵をすべて倒す`:'敵をすべて倒す';
  const lose=['味方が全滅する'];if(ob.escortUnitId)lose.push(`護衛対象「${names[ob.escortUnitId]||ob.escortUnitId}」が倒される`);if(limit)lose.push(`${limit}TURNを過ぎる`);
  const drawTurns=limit?0:(type==='defense'?Math.max(DRAW_TURNS,ob.turns||10):DRAW_TURNS);
  return {win:'勝利: '+win,lose:'敗北: '+lose.join('・'),draw:drawTurns?`引き分け: ${drawTurns}TURNで決着がつかない`:'引き分け: なし（TURN制限で敗北）',type,escort:ob.escortUnitId||null,limit};
}
// ---- terrains (1.12.0): built-in presets + pack-defined terrains ----
function terrain(t,label='地形'){need(t&&typeof t==='object',label+': 形式が不正です');const name=String(t.name||'').trim();need(name.length>0&&name.length<=20,label+': 名前は1～20文字です');const o={name};
  if(has(t,'desc'))o.desc=String(t.desc).slice(0,200);for(const k of ['meleeHitPt','rangedHitPt'])if(has(t,k)){const v=number(t[k],label+' '+k,-100,100);if(v)o[k]=v;}if(has(t,'mobPct')){const v=number(t.mobPct,label+' mobPct',-90,200);if(v)o.mobPct=v;}if(has(t,'banTags')){const b=tagList(t.banTags,label+' 出撃禁止タグ');if(b.length)o.banTags=b;}return o;}
function terrainList(raw){if(raw===undefined||raw===null)return [];need(Array.isArray(raw)&&raw.length<=50,'地形は50個までです');const list=raw.map((t,i)=>terrain(t,'地形'+(i+1))),names=new Set();for(const t of list){need(!names.has(t.name),'地形の名前が重複しています: '+t.name);names.add(t.name);}return list;}
let CUSTOM_TERRAINS={};
function registerTerrains(list){CUSTOM_TERRAINS={};for(const t of list||[]){const {name,desc,...mods}=t;CUSTOM_TERRAINS[name]=mods;}}
function terrainDef(name){const n=String(name||'標準');return CUSTOM_TERRAINS[n]||TERRAINS[n]||null;}
function terrainEffectText(mods){const t=mods||{},parts=[];if(t.meleeHitPt)parts.push(`近接命中${t.meleeHitPt>0?'+':''}${t.meleeHitPt}`);if(t.rangedHitPt)parts.push(`射撃命中${t.rangedHitPt>0?'+':''}${t.rangedHitPt}`);if(t.mobPct)parts.push(`MOB${t.mobPct>0?'+':''}${t.mobPct}%`);if(t.banTags?.length)parts.push(`「${t.banTags.join('・')}」出撃不可`);return parts.join(' / ')||'効果なし';}
const defaultStars=[{type:'clear'},{type:'no_loss'},{type:'turns_le',value:10}];
function missionStars(m){return m.stars?.length?m.stars:defaultStars;}
function starText(s){return s.type==='turns_le'?`${s.value}TURN以内に勝利`:s.type==='hp_ge'?`残りHP合計${s.value}%以上で勝利`:starTypes[s.type]||s.type;}
function terrainMods(m){const base=terrainDef(m?.terrain)||{};return {...base,...(m?.terrainMods||{})};}
function missionEnemyIds(m){const ids=[...(m.enemies||[]),...(m.waves||[]).flatMap(w=>normalizeWave(w).enemies)];for(const r of m.rules||[])if(r&&r.type==='reinforce')ids.push(...(r.enemies||[]));return [...new Set(ids)];}
// ---- bundles ----
const BUNDLE_FORMAT='VAIS_OUTER_OPS_BUNDLE_PACK',BUNDLE_SCHEMA=6,BUNDLE_SCHEMAS=[1,2,3,4,5,6];
function bundlePack(raw){
  need(raw&&raw.format===BUNDLE_FORMAT&&BUNDLE_SCHEMAS.includes(Number(raw.schemaVersion))&&String(raw.packId||'').trim(),'対応する統合パック Schema 1～6ではありません');
  for(const type of ['units','missions','items'])need(Array.isArray(raw[type]),type+' 配列が必要です');
  const unique=(rows,type)=>{const ids=new Set();for(const row of rows){need(row&&safeId(row.id),type+' IDは英数字・_・-で指定してください');need(!ids.has(row.id),type+' ID重複: '+row.id);ids.add(row.id);}};
  unique(raw.units,'unit');unique(raw.missions,'mission');
  const items=raw.items.map(item);unique(items,'item');
  const conv=pilotsToUnits(clone(raw.units),raw.pilots),units=conv.units,res=researchList(raw.research);
  const terrains=terrainList(raw.terrains),hires=hireList(raw.hires);
  const ext=res.length>0||units.some(unitIsExtended)||raw.missions.some(missionIsExtended)||items.some(itemIsExtended);
  const schema=hires.length||units.some(unitIsV6)||raw.missions.some(missionIsV4)||items.some(itemIsV5)||res.some(researchIsV5)?6:units.some(unitIsFantasy)||items.some(itemIsFantasy)?5:terrains.length||raw.missions.some(missionIsV3)?4:units.some(unitIsV4)?3:ext?2:1;
  return {format:BUNDLE_FORMAT,schemaVersion:schema,packId:String(raw.packId),packName:String(raw.packName||raw.packId),units,missions:clone(raw.missions),items,...(res.length?{research:res}:{}),...(terrains.length?{terrains}:{}),...(hires.length?{hires}:{})};
}
function unitSchemaFor(units,pilots,hires){return (hires&&hires.length)||units.some(unitIsV6)?6:units.some(unitIsFantasy)||(pilots||[]).some(p=>(p?.skills||[]).some(skillIsFantasy))?5:(pilots&&pilots.length)||units.some(unitIsV4)?4:units.some(unitIsExtended)?3:2;}
function missionIsV3(m){const ob=m?.objective;return !!m&&((m.waves||[]).some(waveIsExtended)||!!(ob&&ob.type!=='escort'&&ob.escortUnitId)||!!ob?.bossWave||(m.rules||[]).some(r=>r&&r.type==='turn_limit'&&r.value>99)||(ob?.type==='defense'&&ob.turns>99));}
function missionSchemaFor(missions,terrains){return missions.some(missionIsV4)?4:(terrains&&terrains.length)||missions.some(missionIsV3)?3:missions.some(missionIsExtended)?2:1;}
// ---- text ----
function effectText(e){const v=e.value;switch(e.type){case 'heal_hp_flat':return `HPを${v}回復`;case 'heal_hp_pct':return `最大HPの${v}%回復`;case 'heal_hp_full':return 'HP全回復';case 'revive_hp_pct':return `HP 0から最大HPの${v}%で復帰`;case 'stat_up_flat':return `${stats[e.stat]} +${v}（恒久）`;case 'stat_up_pct':return `${stats[e.stat]} +${v}%（使用時の値から切り上げ・恒久）`;case 'all_stats_up_flat':return `全能力 +${v}（恒久）`;case 'add_skill':return `スキル「${e.skill.name}」習得`;case 'add_weapon':return `武装「${e.weapon.name}」追加`;case 'credits_gain':return `資金 +${v}`;
  case 'equip_slot':return `装備枠 ${v>0?'+':''}${v}（恒久）`;case 'add_tag':return `タグ「${e.tag}」を追加`;case 'remove_tag':return `タグ「${e.tag}」を削除`;case 'sortie_buff':return `次の出撃だけ${stats[e.stat]} +${v}%`;case 'loot_box':return `ランダム箱（${e.table.length}種から1つ）`;case 'remove_skill':return e.skillId?`習得スキル「${e.skillId}」を外す`:'習得スキルをすべて外す';case 'remove_weapon':return e.name?`追加武装「${e.name}」を外す`:'追加武装をすべて外す';case 'recruit_unit':return `ユニット「${e.unitId}」が加入`;case 'exp_gain':return `経験値 +${v}`;case 'skill_point':return `スキルポイント +${v}`;default:return '不明';}}
function itemSummary(i){const parts=itemEffects(i).map(effectText);if(i.equip){const s=Object.entries(i.equip.stats||{}).map(([k,v])=>`${stats[k]}+${v}`);parts.push('装備: '+[...s,...(i.equip.skills||[]).map(x=>'「'+x.name+'」'),...(i.equip.weapons||[]).map(x=>'武装「'+x.name+'」')].join(' / '));}if(i.key)parts.push('キーアイテム');if(i.scope==='party')parts.push('部隊全体');if(i.limitPerUnit)parts.push(`1体${i.limitPerUnit}回まで`);return parts.join(' ／ ');}
function skillText(s){const c=s.cond?' ['+conditions[s.cond.type].replace('値',s.cond.value??'').replace('指定タグ','「'+(s.cond.tag||'')+'」')+']':'';const t=s.target?' → '+skillTargets[s.target]:'';const d=s.duration?` ${s.duration}TURN`:'';return `${triggers[s.trigger]||s.trigger}${c}: ${skillEffects[s.effect]||s.effect} ${s.value}${s.effect==='tag_damage_up_pct'?'（対「'+s.tag+'」）':''}${t}${d}`;}
function serialize(marker,p){return '/* PRO data pack */\nwindow.'+marker+' = '+JSON.stringify(p,null,2)+';\n';}
root.PROCore=Object.freeze({version:'2.5.0',drop,dropChance,dropRateText,parseDropRate,hire,hireList,hireRequirementText,unitIsV6,missionIsV4,itemIsV5,researchIsV5,DAMAGE_TYPES,RESIST_TYPES,weaponIsFantasy,skillIsFantasy,unitIsFantasy,itemIsFantasy,waveTriggers,wave,normalizeWave,waveIsExtended,waveText,waveWhenText,formationText,groupNames,bossOf,DRAW_TURNS,missionConditions,missionIsV3,terrain,terrainList,registerTerrains,terrainDef,terrainEffectText,crews,pilotProfile,unitIsV4,crewOf,pilotBonus,pilotToUnit,pilotsToUnits,PILOT_UNIT_STATS,weaponTimings,weaponEffectLabels,weaponEffectsAllowed,weaponEffectTargets,weaponWhen,WEAPON_BEFORE_ONLY,WEAPON_AFTER_ONLY,WEAPON_EFFECT_MAX,weaponEffect,weaponEffectHostile,weaponEffectText,weaponEffectsText,clone,stats,STAT_KEYS,triggers,skillEffects,allowed,conditions,skillTargets,DURATION_EFFECTS,TARGETED_EFFECTS,HOSTILE_EFFECTS,effects,aiTargets,rows,objectives,ruleTypes,starTypes,days,TERRAINS,safeId,parse,skill,skillExt,skillIsExtended,weapon,weaponExt,weaponIsExtended,weaponDefaults,unitExt,unitIsExtended,pilot,pilotList,image,effect,item,itemExt,itemIsExtended,itemPack,itemEffects,itemSummary,effectText,skillText,research,researchList,serialize,tagList,parseTags,unitTags,requirements,checkRequirements,requirementText,missionExt,missionIsExtended,missionStars,starText,terrainMods,missionEnemyIds,rule,BUNDLE_FORMAT,BUNDLE_SCHEMA,bundlePack,unitSchemaFor,missionSchemaFor});
})(window);
