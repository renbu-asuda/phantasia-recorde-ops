/* Built-in Tactical sample pack. Data only: the prototype program reads it through tactical_data.js.
   The shape is meant to match what a future mission maker will export. */
(function(root){'use strict';
const apt=(o)=>({ground:'none',air:'none',water:'none',underwater:'none',space:'none',...o});
const base={hp:1200,atk:180,def:130,mob:250,acc:500,skills:[],tags:[]};
const gun=(name,minRange,maxRange)=>({name,attackType:'ranged',damageType:'physical',powerPct:100,accuracyPt:10,targetCount:1,minRange,maxRange});
// Skill tree node (published shape): id, cost (SP), minLevel, requires (node ids), skill.
const node=(id,cost,minLevel,requires,skill)=>({id,cost,minLevel,requires,skill:{id:'s-'+id,chance:100,maxUses:0,...skill}});
const blade=(name)=>({name,attackType:'melee',damageType:'physical',powerPct:100,accuracyPt:10,targetCount:1,minRange:1,maxRange:1});
const target=(id,domain)=>({id,name:'訓練標的',size:'M',move:3,movementAptitude:apt({[domain]:'B'}),hp:1000,atk:130,def:100,mob:150,acc:450,weapons:[],skills:[],tags:['標的']});
const ground=['fpppppprpmpp','pppppfprpmpp','pppfmpprpmfp','pfppmpprfmpp','ppppmpfbpppp','ppppmpprpppf','ppfpmpprpfpp','fpppppprpppp','pppppfprpppp'];
const water=Array(9).fill('wwwwwwwddddd');
const space=['xssssssxssss','ssssxssssssx','sxssssssxsss','sssssxssssss','ssxssssssxss','ssssssxsssss','sssxssssssxs','xssssssxssss','ssssxssssssx'];
const starts=[[0,0],[1,0],[2,0],[0,1],[1,1],[2,1],[0,2],[1,2],[2,2]].map(([x,y])=>({x,y}));
const enemyGroup=(id,name,unit,x,y,ai)=>({id,name,position:{x,y},ai,members:[{unit,name:'訓練標的1'},{unit,name:'訓練標的2'}]});
root.PROTacticalBuiltinPack={
 format:'PRO_TACTICAL_PACK',packId:'builtin',version:1,name:'内蔵サンプル',
 // Terrain key = map character. costs: movement cost per domain; a missing domain cannot enter.
 terrains:{
  p:{name:'平原',kind:'ground',costs:{ground:1,air:1}},
  b:{name:'橋',kind:'ground',costs:{ground:1,air:1}},
  f:{name:'森林',kind:'forest',costs:{ground:2,air:1}},
  // blockTags: units with any of these tags cannot enter (a group is blocked if any living member has one).
  m:{name:'山岳',kind:'mountain',costs:{ground:3,air:1},blockTags:['車両']},
  r:{name:'河川',kind:'water',costs:{water:1,underwater:1,air:1}},
  w:{name:'浅瀬',kind:'water',costs:{water:1,underwater:1,air:1}},
  d:{name:'深水',kind:'deep',costs:{water:2,underwater:2,air:1}},
  s:{name:'宇宙',kind:'space',costs:{space:1}},
  x:{name:'デブリ',kind:'debris',costs:{space:2}}
 },
 units:[
  {...base,id:'infantry',skillTree:[node('inf-aim',1,1,[],{name:'狙いを定める',trigger:'before_attack',effect:'hit_up_pt',value:10}),node('inf-charge',2,3,['inf-aim'],{name:'突撃',trigger:'before_attack',effect:'def_pierce_pct',value:20}),node('inf-rally',3,5,['inf-charge'],{name:'鼓舞',trigger:'battle_start',effect:'atk_up_pct',value:10,target:'allies'})],joinVerb:'hire',catalog:'最も数の多い基本戦力。どんな地形でも頼りになる。',name:'歩兵小隊',size:'S',move:5,movementAptitude:apt({ground:'B'}),weapons:[blade('近接武装')]},
  {...base,id:'scout',tags:['車両'],skillTree:[node('sc-eye',1,1,[],{name:'観測',trigger:'before_attack',effect:'hit_up_pt',value:15}),node('sc-ap',2,4,['sc-eye'],{name:'徹甲弾',trigger:'before_attack',effect:'def_pierce_pct',value:30})],joinVerb:'produce',catalog:'長射程の狙撃砲で敵の動きを止める偵察車両。',name:'偵察車',size:'M',move:7,movementAptitude:apt({ground:'A'}),weapons:[gun('狙撃砲',2,6)]},
  {...base,id:'tank',tags:['車両'],joinVerb:'produce',catalog:'厚い装甲と射撃武装を備えた地上戦の要。',name:'主力戦車',size:'L',move:4,movementAptitude:apt({ground:'B'}),weapons:[gun('射撃武装',1,3)]},
  {...base,id:'medic',joinVerb:'hire',catalog:'前線で味方を支える衛生兵。',name:'衛生兵',size:'S',move:5,movementAptitude:apt({ground:'B'}),weapons:[blade('近接武装')]},
  {...base,id:'robot',noFire:true,tags:['機動兵器'],catalog:'地上・空中・宇宙を行き来できる汎用機動兵器。',name:'汎用機動兵器',size:'2XL',move:6,movementAptitude:apt({ground:'B',air:'B',space:'B'}),weapons:[blade('格闘武装'),gun('ビームライフル',1,3)]},
  {...base,id:'fighter',catalog:'空中を高速で移動する戦闘機。',name:'戦闘機',size:'XL',move:8,movementAptitude:apt({air:'A'}),weapons:[gun('射撃武装',1,3)]},
  {...base,id:'heavy',catalog:'巨大な陸戦兵器。動きは遅いが圧倒的な存在感。',name:'大型陸戦兵器',size:'3XL',move:3,movementAptitude:apt({ground:'D'}),weapons:[blade('近接武装')]},
  {...base,id:'boat',joinVerb:'produce',catalog:'沿岸を守る小型の哨戒艇。',name:'哨戒艇',size:'M',move:6,movementAptitude:apt({water:'B'}),weapons:[gun('射撃武装',1,3)]},
  {...base,id:'sub',catalog:'水中から奇襲する潜水艦。',name:'潜水艦',size:'XL',move:5,movementAptitude:apt({water:'B',underwater:'A'}),weapons:[gun('射撃武装',1,3)]},
  {...base,id:'marine',joinVerb:'produce',catalog:'陸と水を行き来する水陸両用機。',name:'水陸両用機',size:'M',move:5,movementAptitude:apt({ground:'B',water:'B',underwater:'B'}),weapons:[blade('近接武装')]},
  {...base,id:'spacecraft',catalog:'宇宙空間専用の戦闘艇。',name:'宇宙戦闘艇',size:'XL',move:7,movementAptitude:apt({space:'A'}),weapons:[gun('射撃武装',1,3)]},
  // Deliberately missing MOVE and aptitude: exercises the "not configured" rejection.
  {...base,id:'unset',catalog:'設定確認用の試験機。',name:'未設定テスト機',size:'M',movementAptitude:apt({}),weapons:[blade('近接武装')]},
  target('target_ground','ground'),
  // Variants: base = the unit they derive from; unset fields come from the base. separate:false shares the
  // base's catalog entry and encounter flag; separate:true gets its own.
  {id:'target_water',base:'target_ground',separate:false,movementAptitude:apt({water:'B'})},
  {id:'target_space',base:'target_ground',separate:false,movementAptitude:apt({space:'B'})},
  {id:'scout_ace',base:'scout',separate:true,joinVerb:'produce',hireCost:4200,name:'エース偵察車',hp:1500,acc:600,catalog:'敵軍のエースが駆る改造偵察車。'},
  // Pilot (pilotProfile): rides a unit whose crew is not 'none'; aptitude % applies to units with those tags.
  {...base,id:'aoi',name:'葵',catalog:'機動兵器の操縦に長けたパイロット。',joinVerb:'hire',hireCost:1500,tags:['生身','パイロット'],size:'S',move:4,hp:900,atk:120,def:80,movementAptitude:apt({ground:'B'}),weapons:[blade('拳銃')],pilotProfile:{stats:{atk:40,acc:60},skills:[{id:'s-aoi-eye',name:'見切り',trigger:'before_attack',effect:'hit_up_pt',value:10,chance:100,maxUses:0}],aptitude:{tags:['機動兵器'],pct:10},growthPct:2}},
  // Joins when the given mission is first cleared (recruit.missionId).
  {...base,id:'veteran',tags:['生身'],pilotProfile:{stats:{atk:30,def:30},skills:[],growthPct:2},name:'古参兵',catalog:'機動訓練の教官。訓練を終えると部隊に加わる。',joinVerb:'hire',recruit:{missionId:'training-01'},size:'S',move:5,hp:1500,atk:220,def:150,movementAptitude:apt({ground:'A'}),weapons:[blade('近接武装'),gun('小銃',1,2)]},
  // Reached only by evolution or fusion (sample).
  {...base,id:'tank2',name:'主力戦車改',catalog:'主力戦車を改修した発展型。',size:'L',move:5,hp:1500,atk:220,def:170,movementAptitude:apt({ground:'B'}),weapons:[gun('改良射撃武装',1,3)]},
  {...base,id:'scout2',name:'高速偵察車',catalog:'偵察車の足回りを強化した高速型。',size:'M',move:9,movementAptitude:apt({ground:'A'}),weapons:[gun('狙撃砲',2,6)]},
  {...base,id:'ranger',joinVerb:'hire',hireCost:1800,name:'特殊歩兵',catalog:'歩兵と衛生兵の技術を併せ持つ精鋭。',size:'S',move:6,hp:1400,movementAptitude:apt({ground:'A'}),weapons:[blade('近接武装')]},
  {...base,id:'commander',crew:'required',tags:['機動兵器'],name:'指揮機動兵器',catalog:'汎用機動兵器と戦闘機の設計を組み合わせた指揮機。',size:'2XL',move:7,hp:1800,movementAptitude:apt({ground:'B',air:'A',space:'B'}),weapons:[blade('格闘武装'),gun('ビームライフル',1,4)]}
 ],
 // Development / evolution (one step from → to) and design / fusion (materials → result), same shapes as T&D.
 // Items (materials) and research, same shapes as T&D. Research takes `days` in-game days (missions advance the day):
 // credits are paid at the start, cost.items are reserved and consumed on completion; cancelling refunds credits.
 // unlock.units join the player, unlock.register adds to the production / hire list, unlock.grantItems are given.
 // price: shop price (unset = not sold); sells for half. shop.requiresMission / shop.requiresResearch gate the listing;
 // research unlock.items also gate it. key items cannot be sold.
 items:[{id:'parts',name:'機械部品',desc:'研究や開発に使う汎用の部品。',price:400},{id:'data',name:'戦闘データ',desc:'戦闘記録を解析したデータ。研究で手に入る。'},
  {id:'alloy',name:'特殊合金',desc:'高性能な装甲材。装甲改良の研究で購入できるようになる。',price:1500,shop:{requiresResearch:'r-armor'}},
  {id:'repair',name:'修理キット',desc:'ユニットの修理に使う。機動訓練をクリアすると購入できる。',price:300,shop:{requiresMission:'training-01'}},
  {id:'pass',name:'通行許可証',desc:'大切なもの。売却できない。',key:true},
  // Usable items (PROCore item effects) and equipment (equip: stats / weapons / skills, one item per slot).
  {id:'revive',name:'緊急修理キット',desc:'大破・重傷のユニットを復帰させる。高価。',price:8000,effects:[{type:'revive_hp_pct',value:100}]},
  {id:'stim',name:'戦闘糧食',desc:'補給アイテム。次の出撃だけATK+20%。',price:400,effects:[{type:'sortie_buff',stat:'atk',value:20}]},
  {id:'chip',name:'強化チップ',desc:'使うとATKが永続的に20上がる。1体3回まで。',price:800,limitPerUnit:3,effects:[{type:'stat_up_flat',stat:'atk',value:20}]},
  {id:'manual',name:'訓練マニュアル',desc:'使うと経験値300を得る。',price:500,effects:[{type:'exp_gain',value:300}]},
  {id:'sp-book',name:'戦術教本',desc:'使うとスキルポイントが1増える。',price:1000,effects:[{type:'skill_point',value:1}]},
  {id:'scope',name:'精密照準器',desc:'装備するとACC+60。',price:1200,equip:{stats:{acc:60}}},
  {id:'plate',name:'増加装甲',desc:'装備するとDEF+80・MOB-20。車両・機動兵器のみ。',requires:{anyTags:['車両','機動兵器']},price:1500,equip:{stats:{def:80,mob:-20}}},
  {id:'launcher',name:'追加ミサイル',desc:'装備すると武装「ミサイル」（射程2〜4）が増える。',price:2000,equip:{weapons:[{name:'ミサイル',attackType:'ranged',damageType:'physical',powerPct:120,accuracyPt:0,targetCount:1,minRange:2,maxRange:4}]}}],
 startItems:{parts:5,alloy:1,pass:1,chip:2,manual:1,scope:1,plate:1,stim:2},
 research:[{id:'r-data',name:'戦闘記録の解析',desc:'過去の戦闘を解析し、戦闘データを得る。',days:1,cost:{credits:500},unlock:{grantItems:{data:2}}},
  {id:'r-armor',name:'装甲改良',desc:'主力戦車改の生産技術。',days:2,cost:{credits:2000,items:{parts:3}},unlock:{register:['tank2']}},
  {id:'r-ace',name:'エース機の再現',desc:'エース偵察車を再現し、部隊に迎える。',days:3,requires:['r-armor'],cost:{credits:3000,items:{alloy:1,data:1}},unlock:{units:['scout_ace']}}],
 // Achievements: a condition set (T&D) checked against the save; reward credits / items once. hidden: not shown until earned.
 achievements:[{id:'ach-first',name:'初勝利',desc:'作戦に1回勝利する',conds:{mode:'all',list:[{type:'wins_total',cmp:'ge',value:1}]},reward:{credits:500}},
  {id:'ach-train',name:'訓練修了',desc:'機動訓練を星3つでクリアする',conds:{mode:'all',list:[{type:'mission_stars',missionId:'training-01',cmp:'ge',value:3}]},reward:{items:{chip:1}}},
  {id:'ach-armor',name:'技術者',desc:'装甲改良の研究を完了する',conds:{mode:'all',list:[{type:'research_done',researchId:'r-armor'}]},reward:{credits:1000}},
  {id:'ach-rich',name:'資産家',desc:'資金を50,000Cr以上ためる',hidden:true,conds:{mode:'all',list:[{type:'credits_have',cmp:'ge',value:50000}]},reward:{items:{revive:1}}}],
 // Production / hire entries (same shape as T&D hires): cost in credits, limit = max hires (unset = no limit),
 // requires.missions = missions to clear first, conds = extra condition set, hidden = not listed until available.
 hires:[{id:'hire-aoi',unitId:'aoi',cost:1500},{id:'hire-infantry',unitId:'infantry',cost:800},{id:'hire-scout',unitId:'scout',cost:1500,limit:3},{id:'hire-tank',unitId:'tank',cost:2500,requires:{missions:['training-01']}},
  {id:'hire-marine',unitId:'marine',cost:2000,hidden:true,conds:{mode:'all',list:[{type:'unit_owned',unitId:'boat',cmp:'ge',count:2}]}}],
 // conds use the T&D condition sets (PROCore.evalConds). consume:false keeps that material. carry.level keeps level /
 // EXP / skill points (fusion: from the first material). register adds the unit to the production / hire list.
 // A fusion with result.type 'register' adds no unit and only registers.
 evolutions:[{id:'evo-tank',from:'tank',to:'tank2',carry:{level:true},register:true,conds:{mode:'all',list:[{type:'credits_use',value:3000}]}},{id:'evo-scout',from:'scout',to:'scout2',carry:{level:true},conds:{mode:'all',list:[{type:'unit_level',cmp:'ge',value:5}]}}],
 fusions:[{id:'fu-ranger',materials:[{unitId:'infantry'},{unitId:'medic',consume:false}],result:{type:'unit',unitId:'ranger',count:1,register:true}},{id:'fu-commander',materials:[{unitId:'robot'},{unitId:'fighter'}],carry:{level:true},result:{type:'unit',unitId:'commander',count:1},conds:{mode:'all',list:[{type:'credits_use',value:5000}]}},
  {id:'fu-ace',materials:[{unitId:'scout',consume:false},{unitId:'tank',consume:false}],result:{type:'register',unitId:'scout_ace'},conds:{mode:'all',list:[{type:'credits_use',value:2000}]}}],
 roster:['infantry','scout','tank','medic','robot','fighter','heavy','boat','sub','marine','spacecraft','unset'],
 // Missions: requires (missions / items / flags / research), hidden (not listed while locked), stars (default: clear,
 // no losses, 10 turns), result credits / exp / items (received on victory).
 /* AI patterns (prototype): assault | ambush (waits until a foe is within triggerRange) | hold (never moves)
    | cautious (retreats below retreatHpPct). target: lowest_hp | nearest | strongest. */
 missions:[
  {id:'training-01',code:'TR-01',kind:'training',name:'機動訓練',desc:'平原を舞台に、部隊の移動と交戦の流れを確認する訓練作戦。',goal:'敵部隊の全滅',terrainLabel:'地上・空中',formation:'地上対応の部隊',reward:'800 Cr',color:'#29453e',
   surface:'ground',map:{width:12,height:9,rows:ground},playerStarts:starts,victory:'enemy_wipe',defeat:'player_wipe',result:{credits:800,exp:60,items:{repair:1}},stars:[{type:'clear'},{type:'no_loss'},{type:'turns_le',value:8}],
   enemies:[enemyGroup('enemy-0','敵第1部隊','target_ground',5,4,{pattern:'assault',target:'lowest_hp'}),enemyGroup('enemy-1','敵第2部隊','target_ground',9,4,{pattern:'assault',target:'lowest_hp'})]},
  {id:'combat-01',code:'OP-01',kind:'combat',name:'沿岸防衛線',desc:'海岸線に展開する敵部隊を迎撃。水上・水中に対応する編成を想定したサンプル。',goal:'敵部隊の全滅',terrainLabel:'水上・水中・空中',formation:'水域対応の部隊',reward:'2,400 Cr',color:'#23434e',
   surface:'water',map:{width:12,height:9,rows:water},playerStarts:starts,victory:'enemy_wipe',defeat:'player_wipe',result:{credits:2400,exp:150,items:{parts:2}},requires:{missions:['training-01']},
   enemies:[enemyGroup('enemy-0','敵第1部隊','target_water',5,4,{pattern:'ambush',target:'nearest',triggerRange:5}),enemyGroup('enemy-1','敵第2部隊','target_water',9,4,{pattern:'hold',target:'lowest_hp'})]},
  {id:'combat-02',code:'OP-02',kind:'combat',name:'軌道上の遭遇',desc:'宇宙空間で遭遇した敵部隊を排除する。宇宙適性を確認するためのサンプル。',goal:'敵部隊の全滅',terrainLabel:'宇宙',formation:'宇宙対応の部隊',reward:'3,600 Cr',color:'#222d48',
   surface:'space',map:{width:12,height:9,rows:space},playerStarts:starts,victory:'enemy_wipe',defeat:'player_wipe',result:{credits:3600,exp:220,items:{alloy:1}},hidden:true,requires:{missions:['combat-01']},
   enemies:[enemyGroup('enemy-0','敵第1部隊','target_space',5,4,{pattern:'cautious',target:'strongest',retreatHpPct:50}),enemyGroup('enemy-1','敵第2部隊','target_space',9,4,{pattern:'assault',target:'nearest'})]}
 ]
};
})(window);
