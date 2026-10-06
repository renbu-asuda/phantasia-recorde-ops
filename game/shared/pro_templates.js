/* PRO maker templates 1.2.0 — ready-made units, skills, weapons, items, missions, pilots and research.
 * Every template produces data that passes PROCore validation (tests/test_maker_friendly.cjs). */
(function(root){'use strict';
const C=root.PROCore;
const clone=x=>JSON.parse(JSON.stringify(x));
// ---- weapons ----
const W=(o)=>({attackType:'ranged',damageType:'physical',note:'',powerPct:100,accuracyPt:15,critPt:0,targetCount:1,weight:1,minDamage:50,hitsMin:1,hitsMax:1,hitPowerPct:100,...o});
const weapons=[
  {key:'handgun',label:'ハンドガン',desc:'軽くて扱いやすい拳銃。1～2発。',weapon:W({name:'ハンドガン',powerPct:90,accuracyPt:10,critPt:5,hitsMin:1,hitsMax:2,hitPowerPct:60,minDamage:30})},
  {key:'rifle',label:'アサルトライフル',desc:'標準的な連射銃（E90相当）。1～4発。',weapon:W({name:'アサルトライフル',hitsMin:1,hitsMax:4,hitPowerPct:25})},
  {key:'smg',label:'サブマシンガン',desc:'命中は少し低いが弾数が多い。2～5発。',weapon:W({name:'サブマシンガン',powerPct:90,accuracyPt:5,hitsMin:2,hitsMax:5,hitPowerPct:20,minDamage:30})},
  {key:'sniper',label:'狙撃銃',desc:'高威力・高命中の単発。クリティカルも出やすい。',weapon:W({name:'狙撃銃',powerPct:160,accuracyPt:25,critPt:10,minDamage:80})},
  {key:'knife',label:'ナイフ',desc:'近接武器。2～3回切りつける。後衛には届かない。',weapon:W({name:'ナイフ',attackType:'melee',powerPct:80,accuracyPt:20,critPt:10,hitsMin:2,hitsMax:3,hitPowerPct:45,minDamage:30})},
  {key:'fist',label:'格闘',desc:'素手の連撃。3～4回。後衛には届かない。',weapon:W({name:'格闘',attackType:'melee',accuracyPt:10,critPt:5,hitsMin:3,hitsMax:4,hitPowerPct:35,minDamage:30})},
  {key:'grenade',label:'グレネード',desc:'最大3体をまとめて攻撃。1戦闘に2回まで。',weapon:W({name:'グレネード',powerPct:120,accuracyPt:0,targetCount:3,weight:.6,hitPowerPct:80,minDamage:40,usesPerBattle:2,fxColor:'#ff9a3c'})},
  {key:'rocket',label:'ロケットランチャー',desc:'装甲に強い大威力弾。DEFを30%無視。1戦闘に2回まで。',weapon:W({name:'ロケットランチャー',powerPct:250,accuracyPt:0,weight:.8,minDamage:100,usesPerBattle:2,defPiercePct:30,fxColor:'#ffb347'})},
  {key:'autocannon',label:'機関砲',desc:'車両用の連射砲。2～4発。',weapon:W({name:'機関砲',accuracyPt:10,hitsMin:2,hitsMax:4,hitPowerPct:30})},
  {key:'maingun',label:'主砲',desc:'一撃が重い主砲。DEFを40%無視。撃った次のTURNは使えない。',weapon:W({name:'主砲',powerPct:220,accuracyPt:0,critPt:5,weight:2,minDamage:100,cooldown:1,defPiercePct:40,fxColor:'#ffd23c'})},
  {key:'beamrifle',label:'ビームライフル',desc:'ビーム属性の主力武器。1～2発。',weapon:W({name:'ビームライフル',damageType:'beam',powerPct:130,critPt:5,hitsMin:1,hitsMax:2,hitPowerPct:70,minDamage:80,fxColor:'#5ad8ff'})},
  {key:'missile',label:'ミサイル',desc:'最大4体を同時に狙う特殊弾。1戦闘に3回まで。',weapon:W({name:'ミサイル',damageType:'special',powerPct:110,accuracyPt:5,targetCount:4,hitPowerPct:60,minDamage:40,usesPerBattle:3,fxColor:'#ff4fd8'})},
  // 1.10.1: weapons with effects before / after use.
  {key:'chargecannon',label:'チャージ砲',desc:'撃つ前にATK+30%で力をため、撃った後に反動で最大HPの5%を受ける。',weapon:W({name:'チャージ砲',damageType:'beam',powerPct:150,accuracyPt:5,weight:.7,minDamage:80,cooldown:1,fxColor:'#7fd6ff',effects:[{timing:'before',effect:'atk_up_pct',value:30,duration:1},{timing:'after',effect:'recoil_pct',value:5}]})},
  {key:'armorbreaker',label:'アーマーブレイカー',desc:'当たると相手のDEFを20%下げる（2TURN）。装甲車に+30%。',weapon:W({name:'アーマーブレイカー',powerPct:180,accuracyPt:5,weight:.8,minDamage:80,usesPerBattle:3,fxColor:'#ffb347',effects:[{timing:'before',effect:'tag_damage_up_pct',value:30,tag:'装甲車'},{timing:'after',effect:'def_down_pct',value:20,when:'hit',duration:2}]})},
  {key:'shocklance',label:'ショックランス',desc:'近接の電撃槍。当たると30%の確率で相手をスタン。',weapon:W({name:'ショックランス',attackType:'melee',damageType:'special',powerPct:110,accuracyPt:15,hitsMin:1,hitsMax:2,hitPowerPct:60,minDamage:50,fxColor:'#c9a0ff',effects:[{timing:'after',effect:'stun',value:0,when:'hit',chance:30}]})},
  {key:'napalm',label:'ナパーム弾',desc:'最大3体を攻撃し、当たった敵を炎上させる（毎TURN 80・3TURN）。1戦闘2回まで。',weapon:W({name:'ナパーム弾',damageType:'special',powerPct:90,accuracyPt:0,targetCount:3,weight:.6,hitPowerPct:70,minDamage:40,usesPerBattle:2,fxColor:'#ff6a2a',effects:[{timing:'after',effect:'burn',value:80,when:'hit',duration:3}]})},
  {key:'fantasybarrage',label:'幻想弾幕',desc:'最大3体を狙う幻想属性の弾幕。幻想耐性のある相手には効きにくい。1戦闘に3回まで。',weapon:W({name:'幻想弾幕',damageType:'fantasy',powerPct:110,accuracyPt:10,targetCount:3,weight:.8,hitPowerPct:55,minDamage:50,usesPerBattle:3,fxColor:'#ff9ae6'})},
  {key:'drainblade',label:'ドレインブレード',desc:'近接の連撃。与えたダメージの30%を回復する。',weapon:W({name:'ドレインブレード',attackType:'melee',powerPct:90,accuracyPt:15,critPt:5,hitsMin:2,hitsMax:3,hitPowerPct:45,minDamage:30,fxColor:'#ff4f6d',effects:[{timing:'after',effect:'drain_pct',value:30}]})},
  {key:'commandflag',label:'指揮用信号弾',desc:'攻撃のあと、味方全体のACCを15%上げる（2TURN）。',weapon:W({name:'指揮用信号弾',powerPct:60,accuracyPt:10,weight:.5,minDamage:30,cooldown:2,fxColor:'#9cff6a',effects:[{timing:'after',effect:'acc_up_pct',value:15,target:'allies',duration:2}]})},
  {key:'focusrifle',label:'集中狙撃銃',desc:'撃つ前に命中+20pt・CRIT+10pt。撃破したら再行動。',weapon:W({name:'集中狙撃銃',powerPct:150,accuracyPt:15,critPt:10,minDamage:80,fxColor:'#e8f06a',effects:[{timing:'before',effect:'hit_up_pt',value:20},{timing:'before',effect:'crit_up_pt',value:10},{timing:'after',effect:'extra_action',value:0,when:'kill'}]})}
];
// ---- skills ----
const S=(o)=>({chance:100,maxUses:0,note:'',...o});
const skills=[
  {key:'command',label:'号令',desc:'戦闘開始時、味方全体のATKを15%上げる（3TURN）。',skill:S({name:'号令',trigger:'battle_start',effect:'atk_up_pct',value:15,maxUses:1,target:'allies',duration:3})},
  {key:'firstaid',label:'応急手当',desc:'毎TURNの終わりに、HPが一番減っている味方を最大HPの12%回復。',skill:S({name:'応急手当',trigger:'turn_end',effect:'heal_maxhp_pct',value:12,target:'weakest_ally'})},
  {key:'regen',label:'再生',desc:'毎TURNの終わりに、自分の最大HPの7%を回復。',skill:S({name:'再生',trigger:'turn_end',effect:'heal_maxhp_pct',value:7})},
  {key:'guts',label:'根性',desc:'倒されそうになっても1度だけHP1で踏みとどまる。',skill:S({name:'根性',trigger:'on_death',effect:'guts',value:1,maxUses:1})},
  {key:'counter',label:'反撃',desc:'ダメージを受けたあと、30%の確率で威力60%の反撃。',skill:S({name:'反撃',trigger:'after_damaged',effect:'counter',value:60,chance:30})},
  {key:'evadecounter',label:'見切り',desc:'攻撃をかわしたとき、50%の確率で威力70%の反撃。',skill:S({name:'見切り',trigger:'on_evade',effect:'counter',value:70,chance:50})},
  {key:'dodge',label:'回避運動',desc:'攻撃されるとき、相手の命中率を10ポイント下げる。',skill:S({name:'回避運動',trigger:'when_targeted',effect:'enemy_hit_down_pt',value:10})},
  {key:'taunt',label:'挑発',desc:'毎TURNのはじめに、敵に狙われやすくなる（味方を守る）。',skill:S({name:'挑発',trigger:'turn_start',effect:'taunt',value:200,duration:1})},
  {key:'barrier',label:'バリア',desc:'戦闘開始時に1500ダメージを防ぐバリアを張る。',skill:S({name:'バリア',trigger:'battle_start',effect:'shield',value:1500,maxUses:1})},
  {key:'extra',label:'再行動',desc:'敵を倒すと、もう一度行動できる（1戦闘2回まで）。',skill:S({name:'再行動',trigger:'on_kill',effect:'extra_action',value:1,maxUses:2})},
  {key:'aim',label:'精密射撃',desc:'攻撃するとき、命中率を12ポイント上げる。',skill:S({name:'精密射撃',trigger:'before_attack',effect:'hit_up_pt',value:12})},
  {key:'power',label:'火力強化',desc:'攻撃するとき、与えるダメージを10%上げる。',skill:S({name:'火力強化',trigger:'before_attack',effect:'damage_up_pct',value:10})},
  {key:'pierce',label:'装甲貫通',desc:'攻撃するとき、相手のDEFを30%無視する。',skill:S({name:'装甲貫通',trigger:'before_attack',effect:'def_pierce_pct',value:30})},
  {key:'antiarmor',label:'対装甲',desc:'「装甲車」タグの相手へのダメージを40%上げる。',skill:S({name:'対装甲',trigger:'before_attack',effect:'tag_damage_up_pct',value:40,tag:'装甲車'})},
  {key:'laststand',label:'背水の陣',desc:'自分のHPが30%以下のとき、与えるダメージを30%上げる。',skill:S({name:'背水の陣',trigger:'before_attack',effect:'damage_up_pct',value:30,cond:{type:'hp_below',value:30}})},
  {key:'stun',label:'スタン攻撃',desc:'攻撃したあと、20%の確率で相手を1回行動不能にする。',skill:S({name:'スタン攻撃',trigger:'after_attack',effect:'stun',value:1,chance:20,duration:1})},
  {key:'burn',label:'炎上弾',desc:'攻撃したあと、30%の確率で相手を炎上させる（毎TURN150ダメージ・2TURN）。',skill:S({name:'炎上弾',trigger:'after_attack',effect:'burn',value:150,chance:30,duration:2})},
  {key:'ironwall',label:'鉄壁',desc:'攻撃されるとき、30%の確率で受けるダメージを20%減らす。',skill:S({name:'鉄壁',trigger:'when_targeted',effect:'damage_reduce_pct',value:20,chance:30})},
  {key:'physresist',label:'物理耐性',desc:'物理武器から受けるダメージを30%減らす。',skill:S({name:'物理耐性',trigger:'when_targeted',effect:'weapon_resist_pct',value:30,resistType:'physical'})},
  {key:'beamresist',label:'ビーム耐性',desc:'ビーム武器から受けるダメージを30%減らす。',skill:S({name:'ビーム耐性',trigger:'when_targeted',effect:'weapon_resist_pct',value:30,resistType:'beam'})},
  {key:'specialresist',label:'特殊耐性',desc:'特殊属性の武器から受けるダメージを30%減らす。',skill:S({name:'特殊耐性',trigger:'when_targeted',effect:'weapon_resist_pct',value:30,resistType:'special'})},
  {key:'fantasyresist',label:'幻想耐性',desc:'幻想属性の武器から受けるダメージを30%減らす。',skill:S({name:'幻想耐性',trigger:'when_targeted',effect:'weapon_resist_pct',value:30,resistType:'fantasy'})},
  {key:'meleeresist',label:'近接耐性',desc:'近接武器から受けるダメージを30%減らす。',skill:S({name:'近接耐性',trigger:'when_targeted',effect:'weapon_resist_pct',value:30,resistType:'melee'})},
  {key:'rangedresist',label:'射撃耐性',desc:'射撃武器から受けるダメージを30%減らす。',skill:S({name:'射撃耐性',trigger:'when_targeted',effect:'weapon_resist_pct',value:30,resistType:'ranged'})},
  {key:'rage',label:'激昂',desc:'HPが50%以下になると、ATKが30%上がる（戦闘終了まで）。',skill:S({name:'激昂',trigger:'turn_start',effect:'atk_up_pct',value:30,maxUses:1,duration:99,cond:{type:'hp_below',value:50}})},
  {key:'jamming',label:'ジャミング',desc:'毎TURNのはじめに50%の確率で、敵全体の命中を10%下げる。',skill:S({name:'ジャミング',trigger:'turn_start',effect:'acc_down_pct',value:10,chance:50,target:'enemies',duration:1})}
];
// ---- units ----
const units=[
  {key:'infantry',label:'歩兵',desc:'標準的な兵士。基準になる強さ。',role:'歩兵',mark:'INF',tags:['歩兵','生身'],stats:[3000,500,0,500,500],weapons:['rifle'],skills:[]},
  {key:'assault',label:'突撃兵',desc:'前に出て近接で戦う。HPが減ると強くなる。',role:'突撃兵',mark:'AST',tags:['歩兵','生身'],stats:[3300,560,30,560,480],weapons:['knife','smg'],skills:['laststand']},
  {key:'sniper',label:'狙撃兵',desc:'後衛から弱った敵を狙い撃つ。',role:'狙撃兵',mark:'SNP',tags:['歩兵','生身'],stats:[2600,600,0,480,650],weapons:['sniper','handgun'],skills:['aim'],row:'back',ai:{target:'lowest_hp'}},
  {key:'medic',label:'衛生兵',desc:'後衛から味方を回復する。',role:'衛生兵',mark:'MED',tags:['歩兵','生身','衛生兵'],stats:[3000,420,0,520,520],weapons:['smg'],skills:['firstaid'],row:'back'},
  {key:'heavy',label:'重装兵',desc:'硬くてロケットで装甲を撃ち抜く。',role:'重装兵',mark:'HVY',tags:['歩兵','生身'],stats:[4200,560,150,380,480],weapons:['smg','armorbreaker'],skills:['ironwall']},
  {key:'scout',label:'偵察兵',desc:'素早く回避し、かわすと反撃する。',role:'偵察兵',mark:'SCT',tags:['歩兵','生身','偵察'],stats:[2800,500,0,760,600],weapons:['knife','handgun'],skills:['evadecounter']},
  {key:'apc',label:'装甲車',desc:'高い耐久で味方の盾になる。',role:'装甲車',mark:'APC',tags:['装甲車','機械'],stats:[7000,600,300,350,480],weapons:['autocannon','grenade'],skills:['taunt','counter']},
  {key:'tank',label:'戦車',desc:'重装甲と主砲の大火力。',role:'戦車',mark:'TNK',tags:['戦車','装甲車','機械'],stats:[9000,800,450,300,500],weapons:['maingun','autocannon'],skills:['physresist']},
  {key:'drone',label:'ドローン',desc:'機動力が高く、ミサイルで複数を攻撃。',role:'ドローン',mark:'DRN',tags:['機械','飛行'],stats:[2000,450,0,700,550],weapons:['missile','smg'],skills:['dodge']},
  // 1.10.2: a unit that needs a pilot, and a pilot who can fight alone or ride it.
  {key:'mech',label:'人型機動兵器（要パイロット）',desc:'パイロットが乗らないと出撃できない機体。パイロットの補正で強くなる。',role:'機動兵器',mark:'MEC',tags:['機動兵器','機械'],stats:[6000,700,200,550,520],weapons:['beamrifle','shocklance'],skills:[],crew:'required'},
  {key:'pilot',label:'パイロット（生身・機体に乗れる）',desc:'自分でも戦え、機体に乗るとACC+40・MOB+20、「機動兵器」で+10%。',role:'パイロット',mark:'PLT',tags:['歩兵','生身','パイロット'],stats:[2600,450,0,550,560],weapons:['handgun'],skills:[],crew:'none',pilotProfile:{stats:{acc:40,mob:20},aptitude:{tags:['機動兵器'],pct:10},skills:[],growthPct:2}},
  {key:'commander',label:'指揮官機（ボス向け）',desc:'バリアと激昂を持つ大型機。作戦のボスに。',role:'指揮官機',mark:'CMD',tags:['機械','指揮官'],stats:[12000,850,250,520,600],weapons:['beamrifle','missile','napalm'],skills:['barrier','rage','jamming'],row:'back'}
];
const tiers=[
  {key:'weak',label:'弱い',desc:'序盤の雑魚敵向け（能力×0.8）',hp:.8,other:.8},
  {key:'normal',label:'普通',desc:'テンプレートの基準値',hp:1,other:1},
  {key:'strong',label:'強い',desc:'中盤の主力（能力×1.25）',hp:1.25,other:1.25},
  {key:'ace',label:'エース',desc:'主人公・強敵向け（能力×1.6）',hp:1.6,other:1.6},
  {key:'boss',label:'ボス',desc:'HP×3・その他×1.5',hp:3,other:1.5}
];
const factions={player:{label:'味方として使う',deploy:{player:true,enemy:false}},enemy:{label:'敵として出す',deploy:{player:false,enemy:true}},both:{label:'味方・敵の両方',deploy:{player:true,enemy:true}}};
function autoId(prefix,existing){const custom=root.PROEditor?.patternId(prefix,existing);if(custom)return custom;const used=new Set(existing||[]);for(let n=1;n<100000;n++){const id=`${prefix}-${String(n).padStart(4,'0')}`;if(!used.has(id))return id;}return `${prefix}-${Date.now().toString(36)}`;}
function weaponByKey(k){const t=weapons.find(x=>x.key===k);if(!t)return null;const w=clone(t.weapon);w.useUnitAtk=true;w.baseAtk=w.attackType==='melee'?0:250;if(w.attackType==='melee')w.powerPct*=2;return w;}
function skillByKey(k,existingIds=[]){const t=skills.find(x=>x.key===k);if(!t)return null;return {id:autoId('skill-'+k,existingIds),...clone(t.skill)};}
function makeUnit(key,tierKey='normal',factionKey='both',name='',existingIds=[]){
  const t=units.find(x=>x.key===key)||units[0],tier=tiers.find(x=>x.key===tierKey)||tiers[1],f=factions[factionKey]||factions.both;
  const [hp,atk,def,mob,acc]=t.stats,r=(v,m,step)=>Math.max(0,Math.round(v*m/step)*step);
  const skillIds=[];const sk=t.skills.map(k=>{const s=skillByKey(k,skillIds);skillIds.push(s.id);return s;});
  return {id:autoId('unit',existingIds),name:name||t.label.replace(/（.*?）/,''),role:t.role,pilot:'',mark:t.mark,tags:[...t.tags],ability:'',deploy:{...f.deploy},
    hp:Math.max(100,r(hp,tier.hp,100)),atk:r(atk/2,tier.other,5),def:r(def,tier.other,10),mob:r(mob,tierKey==='boss'?1:tier.other,10),acc:r(acc,tierKey==='boss'?1.1:tier.other,10),
    skills:sk,weapons:t.weapons.map(k=>{const w=weaponByKey(k);if(w.attackType==='ranged')w.baseAtk=r(atk/2,tier.other,5);return w;}),...(t.row?{row:t.row}:{}),...(t.ai?{ai:clone(t.ai)}:{}),...(t.crew?{crew:t.crew}:{}),...(t.pilotProfile?{pilotProfile:clone(t.pilotProfile)}:{})};
}
// ---- items (ctx: {itemIds, units:[{id,recruit}], researchIds}) ----
const I=(o)=>({desc:'',...o});
const items=[
  {key:'potion_s',label:'回復薬（小）',desc:'HPを1000回復。ショップ価格200。',make:()=>I({name:'回復薬（小）',desc:'HPを1000回復する。',effect:{type:'heal_hp_flat',value:1000},price:200})},
  {key:'potion_l',label:'回復薬（大）',desc:'HPを3000回復。ショップ価格600。',make:()=>I({name:'回復薬（大）',desc:'HPを3000回復する。',effect:{type:'heal_hp_flat',value:3000},price:600})},
  {key:'full',label:'全回復キット',desc:'HPを全回復。',make:()=>I({name:'全回復キット',desc:'HPを全回復する。',effect:{type:'heal_hp_full'},price:1200})},
  {key:'revive',label:'復活薬',desc:'撃破されたユニットをHP50%で復帰。',make:()=>I({name:'復活薬',desc:'撃破されたユニットをHP50%で復帰させる。',effect:{type:'revive_hp_pct',value:50},price:1500})},
  {key:'boost_atk',label:'攻撃強化薬',desc:'ATKを永久に+20。',make:()=>I({name:'攻撃強化薬',desc:'ATKを永久に20上げる。',effect:{type:'stat_up_flat',stat:'atk',value:20},price:2000})},
  {key:'boost_hp',label:'体力強化薬',desc:'最大HPを永久に+300。',make:()=>I({name:'体力強化薬',desc:'最大HPを永久に300上げる。',effect:{type:'stat_up_flat',stat:'hp',value:300},price:2000})},
  {key:'boost_all',label:'全能力強化薬',desc:'全能力を永久に+10。',make:()=>I({name:'全能力強化薬',desc:'全能力を永久に10上げる。',effect:{type:'all_stats_up_flat',value:10},price:4000})},
  {key:'skillbook',label:'スキル教本',desc:'スキル「精密射撃」を習得。',make:()=>I({name:'スキル教本：精密射撃',desc:'スキル「精密射撃」を習得する。',effect:{type:'add_skill',skill:skillByKey('aim')}})},
  {key:'weaponkit',label:'武装キット',desc:'武装「グレネード」を追加。',make:()=>I({name:'武装キット：グレネード',desc:'武装「グレネード」を追加する。',effect:{type:'add_weapon',weapon:weaponByKey('grenade')}})},
  {key:'money',label:'資金袋',desc:'使うと資金+1000。',make:()=>I({name:'資金袋',desc:'資金を1000得る。',effect:{type:'credits_gain',value:1000}})},
  {key:'weaponkit_fx',label:'武装キット：チャージ砲',desc:'追加効果付きの武装「チャージ砲」を追加。',make:()=>I({name:'武装キット：チャージ砲',desc:'撃つ前にATKが上がる武装「チャージ砲」を追加する。',effect:{type:'add_weapon',weapon:weaponByKey('chargecannon')}})},
  {key:'equip_atk',label:'装備：攻撃アクセサリ',desc:'装備中ATK+40。',make:()=>I({name:'攻撃アクセサリ',desc:'装備中ATK+40。',equip:{slot:'accessory',stats:{atk:40},skills:[],weapons:[]},price:1500})},
  {key:'equip_def',label:'装備：防御アクセサリ',desc:'装備中DEF+60・最大HP+300。',make:()=>I({name:'防御アクセサリ',desc:'装備中DEF+60・最大HP+300。',equip:{slot:'accessory',stats:{def:60,hp:300},skills:[],weapons:[]},price:1500})},
  {key:'equip_acc',label:'装備：照準器',desc:'装備中ACC+40。',make:()=>I({name:'照準器',desc:'装備中ACC+40。',equip:{slot:'accessory',stats:{acc:40},skills:[],weapons:[]},price:1500})},
  {key:'ration',label:'出撃前レーション',desc:'部隊全員の次の出撃だけATK+15%。',make:()=>I({name:'出撃前レーション',desc:'部隊全員の次の出撃だけATK+15%。',effect:{type:'sortie_buff',stat:'atk',value:15},scope:'party',price:600})},
  {key:'crate',label:'補給コンテナ（ランダム箱）',desc:'パック内のアイテムから1つがランダムで出る。',make:ctx=>{const ids=(ctx?.itemIds||[]).slice(0,4);const pool=ids.length?ids:['item-0001'];return I({name:'補給コンテナ',desc:'何が入っているかは開けてのお楽しみ。',effect:{type:'loot_box',table:pool.map((id,i)=>({itemId:id,weight:Math.max(1,4-i),min:1,max:1}))}});}},
  {key:'key',label:'キーアイテム',desc:'使えないアイテム。作戦の出撃条件に使う。',make:()=>I({name:'カードキー',desc:'特定の作戦に必要。',key:true})},
  {key:'recruit',label:'スカウト契約書',desc:'加入条件付きのユニットを仲間にする。',make:ctx=>{const u=(ctx?.units||[]).find(x=>x.recruit?.locked)||(ctx?.units||[])[0];return I({name:'スカウト契約書',desc:'ユニットが仲間に加わる。',effect:{type:'recruit_unit',unitId:u?.id||'unit-0001'}});}},
  {key:'exp',label:'戦闘記録',desc:'経験値+300。',make:()=>I({name:'戦闘記録',desc:'経験値を300得る。',effect:{type:'exp_gain',value:300},price:900})},
  {key:'cyber',label:'改造手術',desc:'生身タグを機械タグに変え、DEF+60。',make:()=>I({name:'改造手術',desc:'生身を機械に改造する。',requires:{allTags:['生身']},effects:[{type:'remove_tag',tag:'生身'},{type:'add_tag',tag:'機械'},{type:'stat_up_flat',stat:'def',value:60}]})}
];
function makeItem(key,name,ctx={},existingIds=[]){const t=items.find(x=>x.key===key)||items[0];const it=t.make(ctx);return {id:autoId('item',existingIds),...it,...(name?{name}:{})};}
// ---- missions (ctx: {enemyIds, unitIds, escortIds, itemIds, keyItemIds, missionIds}) ----
const ranks=[{key:'E',reward:800,maxDeploy:4,count:2},{key:'D',reward:1200,maxDeploy:4,count:3},{key:'C',reward:1800,maxDeploy:5,count:3},{key:'B',reward:2500,maxDeploy:6,count:4},{key:'A',reward:3500,maxDeploy:6,count:4},{key:'S',reward:5000,maxDeploy:8,count:5},{key:'SS',reward:8000,maxDeploy:8,count:6}];
const pickEnemies=(ids,n)=>Array.from({length:Math.min(8,n)},(_,i)=>ids[i%ids.length]);
const missions=[
  {key:'annihilate',label:'殲滅作戦',desc:'敵を全員倒せば勝利。いちばん基本の作戦。',make:(ctx,r)=>({objective:null,enemies:pickEnemies(ctx.enemyIds,r.count)})},
  {key:'boss',label:'ボス撃破',desc:'先頭の敵（ボス）を倒せば勝利。護衛は残っていてもOK。',make:(ctx,r)=>({objective:{type:'boss',bossIndex:0},enemies:pickEnemies(ctx.enemyIds,r.count),enemyRows:['back',...Array(Math.max(0,Math.min(8,r.count)-1)).fill('front')]})},
  {key:'defense',label:'防衛作戦',desc:'6TURN耐えれば勝利。3TURN目に援軍が来る。',make:(ctx,r)=>({objective:{type:'defense',turns:6},enemies:pickEnemies(ctx.enemyIds,r.count),rules:[{type:'reinforce',turn:3,enemies:pickEnemies(ctx.enemyIds,2)}]})},
  {key:'escort',label:'護衛作戦',desc:'護衛対象を守りながら敵を倒す。護衛対象が倒れると失敗。',make:(ctx,r)=>({objective:{type:'escort',escortUnitId:(ctx.escortIds||[])[0]||(ctx.unitIds||[])[0]||''},enemies:pickEnemies(ctx.enemyIds,r.count)})},
  {key:'chain',label:'連戦',desc:'敵の部隊が2回追加で出てくる。HPは持ち越し。',make:(ctx,r)=>({objective:{type:'chain'},enemies:pickEnemies(ctx.enemyIds,Math.max(2,r.count-1)),waves:[pickEnemies(ctx.enemyIds,Math.max(2,r.count-1)),pickEnemies(ctx.enemyIds.slice().reverse(),Math.max(1,r.count-2))]})},
  {key:'reinforce',label:'援軍あり殲滅',desc:'3TURN目に敵の援軍が来る殲滅作戦。',make:(ctx,r)=>({enemies:pickEnemies(ctx.enemyIds,r.count),rules:[{type:'reinforce',turn:3,enemies:pickEnemies(ctx.enemyIds,2)}]})},
  {key:'weekend',label:'曜日限定作戦',desc:'土日だけ出撃できる。経験値が多め。',make:(ctx,r)=>({enemies:pickEnemies(ctx.enemyIds,r.count),days:[0,6],exp:Math.round(r.reward/10)})}
];
function makeMission(key,rankKey='E',name='',ctx={},existingIds=[]){
  const t=missions.find(x=>x.key===key)||missions[0],r=ranks.find(x=>x.key===rankKey)||ranks[0];
  const enemyIds=(ctx.enemyIds||[]).length?ctx.enemyIds:[];const body=t.make({...ctx,enemyIds},r);
  const m={id:autoId('mission',existingIds),name:name||t.label,diff:r.key,reward:r.reward,desc:t.desc,enemies:body.enemies||[],maxDeploy:r.maxDeploy,terrain:'標準',tags:[],rules:body.rules||[],drops:[]};
  for(const k of ['objective','enemyRows','waves','days','exp'])if(body[k])m[k]=body[k];
  if((ctx.itemIds||[]).length)m.drops=[{itemId:ctx.itemIds[0],chance:50,min:1,max:1}];
  return m;
}
// ---- pilots / research ----
const pilots=[
  {key:'gunner',label:'射撃型',desc:'ACC+40。攻撃時の命中アップスキル。',make:()=>({name:'射撃手',tags:['パイロット'],stats:{acc:40},skills:[skillByKey('aim')]})},
  {key:'evader',label:'回避型',desc:'MOB+40。攻撃されにくくなるスキル。',make:()=>({name:'回避の名手',tags:['パイロット'],stats:{mob:40},skills:[skillByKey('dodge')]})},
  {key:'mech',label:'機械適性型',desc:'「機械」タグの機体でATK・MOB・ACC+15%。',make:()=>({name:'メカニック',tags:['パイロット'],stats:{acc:20},aptitude:{tags:['機械'],pct:15},skills:[]})}
];
function makePilot(key,name,existingIds=[]){const t=pilots.find(x=>x.key===key)||pilots[0];return {id:autoId('pilot',existingIds),...t.make(),...(name?{name}:{})};}
// Pilot templates as units (1.10.2): standard infantry-class body plus the pilot bonuses.
function makePilotUnit(key,name,existingIds=[]){const p=makePilot(key,name,[]);const u=C.pilotToUnit({...p,id:'p'},new Set());return {...u,atk:Math.round(u.atk/2),weapons:u.weapons.map(w=>({...w,baseAtk:250,useUnitAtk:true})),id:autoId('unit',existingIds)};}
const research=[
  {key:'shop',label:'ショップ解放',desc:'完了するとアイテムがショップに並ぶ。',make:ctx=>({name:'新装備の開発',desc:'ショップに新しいアイテムが並ぶ。',cost:{credits:1500},requires:[],unlock:{items:(ctx.pricedItemIds||[]).slice(0,1)}})},
  {key:'recruit',label:'ユニット加入',desc:'完了すると加入条件付きのユニットが仲間になる。',make:ctx=>({name:'新戦力の配備',desc:'新しいユニットが加入する。',cost:{credits:3000},requires:[],unlock:{units:(ctx.lockedUnitIds||[]).slice(0,1)}})}
];
function makeResearch(key,name,ctx={},existingIds=[]){const t=research.find(x=>x.key===key)||research[0];return {id:autoId('research',existingIds),...t.make(ctx),...(name?{name}:{})};}
function makeTreeNode(skillKey,existingIds=[]){return {id:autoId('node',existingIds),cost:1,minLevel:1,requires:[],skill:skillByKey(skillKey)};}
root.PROTemplates=Object.freeze({version:'1.4.1',makePilotUnit,weapons,skills,units,tiers,factions,ranks,items,missions,pilots,research,autoId,weaponByKey,skillByKey,makeUnit,makeItem,makeMission,makePilot,makeResearch,makeTreeNode});
})(window);

