/* Built-in pack: the tutorial pack 「第零機甲教導隊」 (PRO_TD_PACK, read like a pack file). A new commander joins the
   training corps and learns the game one feature at a time, guided by three characters (spec 26):
   教官 カザマ (orders and command basics), オペレーター リコ (map, battle and command help), 整備班長 ゴウ (the base).
   Stage 1: the base data and T1〜T3. Base menus open as missions are cleared (hqUnlock). Not loaded by default: the game
   starts empty and this pack is chosen in パック管理 (or named as the dependency 'sample' by a T&D pack).
   IDs follow the ID rules: <packId>-<CODE>-<6 digits>. */
(function(){'use strict';
const id=(code,n)=>'sample-'+code+'-'+String(n).padStart(6,'0');
// Units, weapons, items, missions, ... by a short name.
const U={valkis:id('U',1),infantry:id('U',2),hound:id('U',3),garm:id('U',4),sleip:id('U',5),
 dummy:id('U',10),aggressor:id('U',11),rustInf:id('U',12),technical:id('U',13),bogle:id('U',14)};
const W={rifle:id('W',1),blade:id('W',2),assault:id('W',3),autocannon:id('W',4),mainGun:id('W',5),sleipRifle:id('W',6),
 paint:id('W',10),drill:id('W',11),oldRifle:id('W',12),hmg:id('W',13),fist:id('W',14),scatter:id('W',15)};
const I={repair:id('I',1),armor:id('I',2),record:id('I',3)};
const M={t1:id('TM',1),t2:id('TM',2),t3:id('TM',3)};
const V={fame:id('V',1)};
const KAZAMA='カザマ',RIKO='リコ',GOU='ゴウ';
const say=(speaker,text)=>({speaker,text});
const talk=(...lines)=>({type:'talk',lines});
const grid=rows=>({width:rows[0].length,height:rows.length,grid:rows.map(r=>[...r])});
const ground=r=>({ground:r,air:'none',water:'none',underwater:'none',space:'none'});
const squad=(sid,name,x,y,unit,n,ai,extra={})=>({id:sid,name,position:{x,y},ai,members:Array.from({length:n},()=>({unit})),...extra});

window.PROTacticalSamplePack={
 format:'PRO_TD_PACK',version:1,packId:'sample',name:'第零機甲教導隊',author:'PHANTASIA RECORD OPS',packVersion:'1（T1〜T3）',
 desc:'チュートリアルパック。新人指揮官として教導隊に配属され、演習から実戦へ。作戦を進めるごとに、ゲームの機能をひとつずつ体験できます。',
 // Base menus open as the tutorial goes on.
 hqUnlock:{shop:M.t1,production:M.t2,research:M.t3},
 notices:[{id:'sample-N-000001',name:'第零機甲教導隊へようこそ',body:'新人指揮官どの、着任おめでとうございます。オペレーターのリコです。\nまずは「ミッション選択」から「T1 初陣」へどうぞ。拠点の機能は、作戦を進めるごとに使えるようになります。'}],
 vars:[{id:V.fame,name:'評判',desc:'教導隊の評判。作戦の結果で上がり下がりする。',scope:'game',initial:0,min:0,max:99}],
 units:[
  {id:U.valkis,name:'ヴァルキス',role:'主役機',size:'XL',move:5,movementAptitude:ground('A'),hp:4000,atk:300,def:150,mob:520,acc:560,weaponIds:[W.rifle,W.blade],skillIds:[],tags:['機動兵器'],crew:'optional',sortieCost:300,deploy:{player:true},noFire:true,
   catalog:'教導隊に配備された試作の機動兵器。射撃と格闘をこなす万能機。'},
  {id:U.infantry,name:'教導歩兵分隊',role:'歩兵',size:'S',move:4,movementAptitude:ground('A'),hp:3200,atk:250,def:80,mob:520,acc:520,weaponIds:[W.assault],skillIds:[],tags:['生身','歩兵'],capture:10,sortieCost:80,deploy:{player:true},
   catalog:'教導隊の歩兵。施設の占領が得意（占領力10）。'},
  {id:U.hound,name:'ハウンド偵察車',role:'偵察',size:'M',move:7,movementAptitude:ground('A'),hp:3200,atk:230,def:100,mob:600,acc:560,weaponIds:[W.autocannon],skillIds:[],tags:['車両'],sortieCost:120,deploy:{player:true},
   catalog:'足の速い偵察車。長距離機関砲で離れた敵を撃てる（射程2〜5）。'},
  {id:U.garm,name:'ガルム戦車',role:'戦車',size:'L',move:4,movementAptitude:ground('B'),hp:5000,atk:300,def:300,mob:350,acc:500,weaponIds:[W.mainGun],skillIds:[],tags:['車両'],sortieCost:200,deploy:{player:true},recruit:{locked:true,missionId:M.t1},
   catalog:'重装甲の主力戦車。動きは遅いが、打たれ強い。T1をクリアすると加入する。'},
  {id:U.sleip,name:'スレイプ',role:'量産機',size:'L',move:5,movementAptitude:ground('B'),hp:4000,atk:280,def:200,mob:450,acc:520,weaponIds:[W.sleipRifle],skillIds:[],tags:['機動兵器'],crew:'optional',sortieCost:180,deploy:{player:true},recruit:{locked:true},
   catalog:'量産型の機動兵器。研究「量産機の配備計画」で生産できるようになる。'},
  {id:U.dummy,name:'標的機',size:'M',move:3,movementAptitude:ground('B'),hp:1800,atk:150,def:0,mob:300,acc:400,weaponIds:[W.paint],skillIds:[],tags:['標的'],exp:20,deploy:{enemy:true},
   catalog:'演習用の標的機。ペイント弾で撃ち返してくる。'},
  {id:U.aggressor,name:'仮想敵機',size:'M',move:4,movementAptitude:ground('B'),hp:2400,atk:200,def:80,mob:430,acc:460,weaponIds:[W.drill],skillIds:[],tags:['機動兵器'],exp:30,deploy:{enemy:true},
   catalog:'演習で敵役を務める機体。本気で向かってくる。'},
  {id:U.rustInf,name:'赤錆団の歩兵',size:'S',move:4,movementAptitude:ground('A'),hp:2400,atk:220,def:0,mob:480,acc:460,weaponIds:[W.oldRifle],skillIds:[],tags:['生身','歩兵'],exp:25,deploy:{enemy:true},
   catalog:'武装勢力「赤錆団」の兵士。'},
  {id:U.technical,name:'赤錆団テクニカル',size:'M',move:6,movementAptitude:ground('A'),hp:2600,atk:210,def:60,mob:480,acc:460,weaponIds:[W.hmg],skillIds:[],tags:['車両'],exp:30,deploy:{enemy:true},
   catalog:'荷台に重機関銃を積んだ改造トラック。'},
  {id:U.bogle,name:'ボーグル',role:'旧式機',size:'XL',move:4,movementAptitude:ground('B'),hp:6000,atk:320,def:200,mob:380,acc:480,weaponIds:[W.fist,W.scatter],skillIds:[],tags:['機動兵器'],exp:80,deploy:{enemy:true},
   catalog:'赤錆団が持ち出した旧式の機動兵器。'}],
 weapons:[
  {id:W.rifle,name:'ビームライフル',attackType:'ranged',damageType:'beam',useUnitAtk:true,baseAtk:400,powerPct:100,hitsMin:1,hitsMax:2,hitPowerPct:60,accuracyPt:15,minRange:1,maxRange:3},
  {id:W.blade,name:'プラズマブレード',attackType:'melee',damageType:'beam',useUnitAtk:true,baseAtk:300,powerPct:160,hitsMin:2,hitsMax:3,hitPowerPct:45,accuracyPt:20,critPt:10,minRange:1,maxRange:1},
  {id:W.assault,name:'アサルトライフル',attackType:'ranged',useUnitAtk:true,baseAtk:250,powerPct:100,hitsMin:1,hitsMax:4,hitPowerPct:25,accuracyPt:15,minRange:1,maxRange:2},
  {id:W.autocannon,name:'長距離機関砲',attackType:'ranged',useUnitAtk:true,baseAtk:380,powerPct:90,hitsMin:2,hitsMax:4,hitPowerPct:30,accuracyPt:10,minRange:2,maxRange:5},
  {id:W.mainGun,name:'主砲',attackType:'ranged',useUnitAtk:true,baseAtk:500,powerPct:120,hitsMin:1,hitsMax:1,hitPowerPct:100,accuracyPt:5,minDamage:80,minRange:1,maxRange:3},
  {id:W.sleipRifle,name:'マシンライフル',attackType:'ranged',useUnitAtk:true,baseAtk:350,powerPct:100,hitsMin:2,hitsMax:4,hitPowerPct:30,accuracyPt:10,minRange:1,maxRange:2},
  {id:W.paint,name:'ペイント弾',attackType:'ranged',useUnitAtk:true,baseAtk:200,powerPct:80,hitsMin:1,hitsMax:2,hitPowerPct:40,minDamage:10,minRange:1,maxRange:2},
  {id:W.drill,name:'演習用ライフル',attackType:'ranged',useUnitAtk:true,baseAtk:200,powerPct:90,hitsMin:1,hitsMax:4,hitPowerPct:25,accuracyPt:10,minRange:1,maxRange:2},
  {id:W.oldRifle,name:'旧式小銃',attackType:'ranged',useUnitAtk:true,baseAtk:220,powerPct:90,hitsMin:1,hitsMax:4,hitPowerPct:25,accuracyPt:5,minRange:1,maxRange:2},
  {id:W.hmg,name:'重機関銃',attackType:'ranged',useUnitAtk:true,baseAtk:240,powerPct:90,hitsMin:2,hitsMax:5,hitPowerPct:20,minRange:1,maxRange:2},
  {id:W.fist,name:'鉄拳',attackType:'melee',useUnitAtk:true,baseAtk:300,powerPct:170,hitsMin:1,hitsMax:2,hitPowerPct:60,accuracyPt:10,minRange:1,maxRange:1},
  {id:W.scatter,name:'散弾砲',attackType:'ranged',useUnitAtk:true,baseAtk:350,powerPct:100,hitsMin:2,hitsMax:4,hitPowerPct:25,minRange:1,maxRange:2}],
 skills:[],
 items:[
  {id:I.repair,name:'修理キット',desc:'ユニット1体のHPを最大HPの30%回復する。',effects:[{type:'heal_hp_pct',value:30}],scope:'unit',price:300},
  {id:I.armor,name:'増加装甲',desc:'装備するとDEF+40。T3をクリアするとショップに並ぶ。',price:1200,equip:{stats:{def:40}},shop:{requiresMission:M.t3}},
  {id:I.record,name:'演習記録',desc:'演習の戦闘記録。研究の材料になる。T2の報酬。',key:true}],
 hires:[
  {id:id('H',1),name:'教導歩兵分隊',unitId:U.infantry,cost:600,note:'占領が得意な歩兵。'},
  {id:id('H',2),name:'ハウンド偵察車',unitId:U.hound,cost:900,note:'足が速く、遠くから撃てる偵察車。'},
  {id:id('H',3),name:'ガルム戦車',unitId:U.garm,cost:1500,requires:{missions:[M.t1]},note:'打たれ強い主力戦車。'}],
 research:[
  {id:id('R',1),name:'量産機の配備計画',desc:'量産型の機動兵器「スレイプ」を生産できるようにする。',days:1,cost:{credits:1500,items:{[I.record]:1}},requires:[],unlock:{register:[U.sleip]}}],
 evolutions:[],fusions:[],achievements:[],flags:[],commands:[],terrains:[],missions:[],
 tmissions:[
  {id:M.t1,code:'T1',kind:'training',name:'初陣',desc:'演習場で、部隊の移動・攻撃・待機を確かめる。標的機は動かないが撃ち返してくる。',surface:'ground',color:'#29453e',
   map:grid(['pppppfpppp','ppfpppppfp','pppppppppp','pppfpppppp','pppppppfpp','ppfppppppp','pppppfpppp','pppppppppp']),
   playerStarts:[{x:1,y:2},{x:1,y:4},{x:1,y:6},{x:0,y:3}],
   enemies:[squad('t1-e1','標的第1班',6,2,U.dummy,2,{pattern:'hold',target:'lowest_hp'}),squad('t1-e2','標的第2班',7,5,U.dummy,2,{pattern:'hold',target:'lowest_hp'})],
   victory:{type:'enemy_wipe'},defeat:{type:'player_wipe'},result:{credits:1200,exp:60,items:{[I.repair]:2}},
   stars:[{type:'clear'},{type:'no_loss'},{type:'turns_le',value:5}],
   clearText:'ショップが使えるようになりました（研究・倉庫・ショップ → ショップ）。ガルム戦車が加入しました。',
   events:[
    {id:'t1-start',name:'着任',trigger:{type:'start'},actions:[talk(say(KAZAMA,'第零機甲教導隊へようこそ。隊長のカザマだ。今日から君がこの隊の指揮官になる。'),say(RIKO,'オペレーターのリコです！ まずは演習場で、基本の動かし方をおさらいしましょう。'),
     say(RIKO,'味方の部隊のマスを押すと選べて、もう一度押すとコマンドが開きます。「移動」を選ぶと、光ったマスが動ける範囲。行き先のマスを押して、移動を決めてください。'),say(RIKO,'敵の部隊が武装の射程に入っていれば、コマンドの「攻撃（射程内）」で局地戦が始まります。'),
     say(RIKO,'動かし終わった部隊は「待機・行動終了」。全部の部隊が動いたら、上の「ターン終了」で敵のターンになります。'),say(KAZAMA,'標的機は動かないが、撃ち返してくるぞ。油断するな。'))]},
    {id:'t1-turn2',name:'ヒント',trigger:{type:'turn',turns:2},actions:[talk(say(RIKO,'迷ったら、部隊のコマンドの「部隊詳細」を開いてみてください。HPや武装の射程を確かめられます。'))]},
    {id:'t1-e1',name:'第1班撃破',trigger:{type:'squad_down',groupId:'t1-e1'},actions:[talk(say(RIKO,'標的第1班、撃破！ その調子です！'),say(KAZAMA,'残りも片付けろ。'))]},
    {id:'t1-win',name:'演習終了',trigger:{type:'victory'},actions:[talk(say(KAZAMA,'見事だ。初陣としては上出来だな。'),say(GOU,'よう、整備班長のゴウだ。拠点のショップを開けといたぜ。修理キットくらいは買っておきな。'),say(GOU,'それと、うちの戦車「ガルム」も君の指揮下に入る。次の演習で使ってやってくれ。'))]}]},
  {id:M.t2,code:'T2',kind:'training',name:'部隊を組む',desc:'部隊の編成・合流・分離・移管と、武装の射程・地形を学ぶ演習。仮想敵部隊が向かってくる。',surface:'ground',color:'#2f4a3a',
   requires:{missions:[M.t1]},unlockText:'次の演習「T2 部隊を組む」が始まります。今回は仮想敵部隊が向かってきます。',
   map:grid(['ppppfrrpppmm','pfppfrrppfmp','ppppprrppppp','ppfppbbpppfp','pppppbbppppp','ppfpprrpfppp','pppfprrppppp','ppfpprrpppmp','pppffrrppmmm']),
   playerStarts:[{x:1,y:3},{x:1,y:4},{x:0,y:2},{x:0,y:5}],
   enemies:[squad('t2-e1','仮想敵A隊',9,3,U.aggressor,2,{pattern:'assault',target:'lowest_hp'}),squad('t2-e2','仮想敵B隊',9,6,U.aggressor,2,{pattern:'ambush',target:'lowest_hp'}),squad('t2-e3','仮想敵C隊',8,0,U.dummy,3,{pattern:'hold',target:'lowest_hp'})],
   victory:{type:'enemy_wipe'},defeat:{type:'player_wipe'},result:{credits:1800,exp:90,items:{[I.record]:1}},
   stars:[{type:'clear'},{type:'no_loss'},{type:'turns_le',value:7}],
   clearText:'生産・雇用が使えるようになりました（ユニット → 生産・雇用）。',
   events:[
    {id:'t2-start',name:'部隊の組み方',trigger:{type:'start'},actions:[talk(say(KAZAMA,'今日は部隊の組み方だ。ユニットは部隊にまとめて動かす。'),say(RIKO,'出撃準備で、ユニットを同じ部隊にまとめられます。1つの部隊は合計サイズ8まで。歩兵や車両はサイズ1、ヴァルキスは2です。'),
     say(RIKO,'マップでも、隣り合った味方の部隊とは「合流」「分離」「移管・交換」ができます。部隊のコマンドから選んでください。'),say(KAZAMA,'まとまれば局地戦で一緒に戦える。分かれれば多くのマスを押さえられる。使い分けろ。'))]},
    {id:'t2-range',name:'射程',trigger:{type:'turn',turns:2},actions:[talk(say(RIKO,'偵察車の長距離機関砲は射程2〜5。隣の敵は撃てませんが、離れた敵を撃てます。'),say(RIKO,'武装の射程は部隊の詳細で確かめられます。射程の長い武装で先に削りましょう。'))]},
    {id:'t2-terrain',name:'地形',trigger:{type:'turn',turns:3},actions:[talk(say(RIKO,'地形にも注目！ 森は動きにくく、川は地上のユニットでは渡れません。橋を使いましょう。'),say(RIKO,'山は車両が入れません。マスを押すと、マップの下の「インフォ」に地形の名前と移動消費が出ます。'))]},
    {id:'t2-a',name:'A隊撃破',trigger:{type:'squad_down',groupId:'t2-e1'},actions:[talk(say(KAZAMA,'A隊を退けたか。B隊は待ち伏せ型だ。近づくと動き出すぞ。'))]},
    {id:'t2-win',name:'演習終了',trigger:{type:'victory'},actions:[talk(say(KAZAMA,'部隊運用の基本は身についたな。'),say(GOU,'人手が足りねえだろ。拠点の「生産・雇用」を開けといた。資金で新しいユニットを迎えられるぜ。'),say(GOU,'それと演習記録を回収しといた。研究に使うから取っときな。'))]}]},
  {id:M.t3,code:'T3',kind:'combat',name:'拠点を押さえろ',desc:'武装勢力「赤錆団」が占拠した町を奪い返す。施設の占領・収入・修理と、作戦の評価（★）を学ぶ。',surface:'ground',color:'#4a3a2a',
   requires:{missions:[M.t2]},unlockText:'初めての実戦「T3 拠点を押さえろ」が発令されました。',
   map:grid(['pppppcpppfppmm','ppfpppppfppppm','pppfpppppppfpp','ppppppfppppppp','ppppfppppcpppp','pppppppfpppfpp','pppyppppppfppp','ppfpppfppppppm','pppppppppppmmm','ppppfpppppppmm']),
   playerStarts:[{x:1,y:6},{x:1,y:7},{x:0,y:5},{x:0,y:8}],
   facilities:{'9,4':'enemy'},
   enemies:[squad('t3-e1','赤錆団 町の守備隊',9,4,U.rustInf,3,{pattern:'hold',target:'lowest_hp'}),
    {id:'t3-boss',name:'赤錆団 ボーグル隊',position:{x:10,y:3},ai:{pattern:'ambush',target:'lowest_hp'},members:[{unit:U.bogle},{unit:U.rustInf}]},
    squad('t3-e3','赤錆団 遊撃隊',7,7,U.technical,2,{pattern:'assault',target:'lowest_hp'}),squad('t3-e4','赤錆団 北の見張り',6,1,U.rustInf,2,{pattern:'hold',target:'lowest_hp'})],
   victory:{type:'capture',x:9,y:4},defeat:{type:'player_wipe'},victoryLabel:'東の町（10,5）を占領する',result:{credits:2500,exp:120,items:{[I.repair]:1}},
   objectives:[{id:'t3-ob1',name:'ボーグルを止めろ',success:{type:'squad_down',groupId:'t3-boss'},label:'ボーグル隊を撃破する',reward:{credits:800}},
    {id:'t3-ob2',name:'北の町も解放',success:{type:'capture',x:5,y:0},label:'北の町（6,1）を占領する',reward:{credits:500}}],
   stars:[{type:'clear'},{type:'no_loss'},{type:'turns_le',value:12}],
   clearText:'研究が使えるようになりました（研究・倉庫・ショップ → 研究）。ショップに増加装甲が並びました。',
   events:[
    {id:'t3-start',name:'出撃',trigger:{type:'start'},actions:[talk(say(KAZAMA,'ここからは実戦だ。武装勢力「赤錆団」が東の町を占拠している。'),
     say(RIKO,'勝利条件は東の町の占領です。施設のマスに止まって「占領」を選ぶと、施設の耐久が減って、0になると自分のものになります。'),say(RIKO,'占領力は歩兵が10、ほかは5。歩兵を連れていくと早いですよ。敵が施設にいる間は入れないので、先に倒してください。'),
     say(KAZAMA,'気をつけろ。東にいる旧式機ボーグルの鉄拳は、歩兵には重い。歩兵は戦車やヴァルキスと同じ部隊にまとめて守ってやれ。'),
     say(RIKO,'南西の補給基地も、占領すればこちらのもの。止まっている部隊は、ターンの初めにHPが回復します。'),
     say(KAZAMA,'作戦の評価は★3つ。勝つこと、誰も失わないこと、早く終わらせること。初めて取った★には報酬が出るぞ。'))]},
    {id:'t3-north',name:'北の町',trigger:{type:'capture',x:5,y:0},actions:[talk(say(RIKO,'北の町を解放！ 占領した町からは、ターンの初めに資金が入ります。'))]},
    {id:'t3-boss',name:'ボーグル撃破',trigger:{type:'squad_down',groupId:'t3-boss'},actions:[talk(say(RIKO,'ボーグルの反応、消失！'),say(KAZAMA,'よし、町まで一気に押し込め。'))]},
    {id:'t3-win',name:'町の奪還',trigger:{type:'victory'},actions:[{type:'var',varId:V.fame,op:'add',value:1},talk(say(KAZAMA,'町を取り戻した。住民も喜んでいるぞ。教導隊の評判も上がった（評判 {評判}）。'),
     say(GOU,'研究も開けといたぜ。資金と素材を使って、日数をかけて新しい技術を手に入れるんだ。作戦に出るたびに1日進む。'),say(GOU,'演習記録があれば「量産機の配備計画」ができる。量産機スレイプを生産できるようになるぜ。'))]}]}]
};
})();
