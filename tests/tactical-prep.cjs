const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const ctx=vm.createContext({window:{},console,setTimeout,clearTimeout});
for(const f of ['pro_core.js','pro_battle.js','pro_features.js'])vm.runInContext(fs.readFileSync('game/shared/'+f,'utf8'),ctx);
const C=ctx.window.PROCore,B=ctx.window.PROBattle,plain=x=>JSON.parse(JSON.stringify(x));
const tactical={move:0,movementAptitude:{ground:'S',air:'A',water:'B',underwater:'C',space:'none'}};
assert.deepEqual(plain(C.unitExt(tactical)),tactical);
assert.deepEqual(plain(C.unitExt({})),{});
assert.equal(C.MOVEMENT_APTITUDES.D,1.25);assert.equal(C.MOVEMENT_APTITUDES.none,null);
for(const x of [{move:-1},{move:1.5},{move:Infinity},{movementAptitude:[]},{movementAptitude:{ground:'E'}},{movementAptitude:{AAAA:'A'}}])assert.throws(()=>C.unitExt(x));
const u={id:'a',name:'a',hp:3000,atk:500,def:0,mob:500,acc:500,tags:[],skills:[],weapons:[{name:'test'}],deploy:{player:true,enemy:true}};
const bundle={format:C.BUNDLE_FORMAT,schemaVersion:9,packId:'prep',units:[{...u,...tactical}],missions:[],items:[]};
const round=C.bundlePack(C.parse(C.serialize('VAIS_BUNDLE_PACK',C.bundlePack(bundle)),'VAIS_BUNDLE_PACK'));
assert.deepEqual(plain(round.units[0].movementAptitude),tactical.movementAptitude);assert.equal(round.units[0].move,0);
assert.equal(C.materializeUnit(round.units[0]).move,0);
(async()=>{
 const opts={enemies:['enemy'],enemyDefs:{enemy:{...u,id:'enemy'}},mission:{id:'m',enemies:['enemy']},trials:8,seed:42};
 const a=await B.simulate({...opts,allies:[u]}),b=await B.simulate({...opts,allies:[{...u,...tactical,move:999}]});
 assert.deepEqual(plain(a),plain(b));console.log('PASS: tactical preparation validation, serialization and unchanged seeded combat');
})().catch(e=>{console.error(e);process.exitCode=1;});
