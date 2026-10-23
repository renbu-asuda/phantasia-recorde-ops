import fs from 'node:fs';import path from 'node:path';import assert from 'node:assert/strict';import {Window} from 'happy-dom';
// Regression tests for #262–#270, #272, #275, #276 on native T&D packs (maker draft as the data source).
const file='game/prototypes/tactical_hub.html',html=fs.readFileSync(file,'utf8'),windows=[];
const dump=w=>{const s=w.localStorage,o={};for(let i=0;i<s.length;i++){const k=s.key(i);o[k]=s.getItem(k);}return o;};
function open(pack,store={},query=''){const w=new Window({url:'http://localhost/'+file+query,settings:{enableJavaScriptEvaluation:true,disableJavaScriptFileLoading:true,disableCSSFileLoading:true,suppressInsecureJavaScriptEnvironmentWarning:true}});windows.push(w);w.scrollTo=()=>{};
 if(pack){w.localStorage.setItem('PRO_TACTICAL_SOURCE','maker');w.localStorage.setItem('PRO_TD_MAKER_DRAFT',JSON.stringify(pack));}for(const [k,v] of Object.entries(store))w.localStorage.setItem(k,v);w.sessionStorage.setItem('PRO_TACTICAL_TITLE_SEEN','1');w.document.write(html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/g,''));
 for(const dl of w.document.querySelectorAll('dialog')){dl.showModal=()=>dl.setAttribute('open','');dl.show=()=>dl.setAttribute('open','');dl.close=()=>{dl.removeAttribute('open');dl.dispatchEvent(new w.Event('close'));};}
 const cp=w.HTMLCanvasElement.prototype;cp.getContext=()=>({fillRect(){},set fillStyle(v){}});cp.toDataURL=()=>'data:image/png;base64,UElY';
 for(const m of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/g)){const src=/src=["']([^"']+)["']/.exec(m[1]);w.eval(src?fs.readFileSync(path.resolve(path.dirname(file),src[1]),'utf8'):m[2]);}return w;}
const grid=(w,h)=>Array.from({length:h},()=>Array(w).fill('p'));
const unit=(id,x={})=>({id,name:id,size:'M',move:5,movementAptitude:{ground:'B',air:'none',water:'none',underwater:'none',space:'none'},hp:4000,atk:300,def:100,mob:200,acc:400,weaponIds:[],skillIds:[],deploy:{player:true},...x});
const tm=(x={})=>({id:'m',name:'M',kind:'combat',map:{width:8,height:6,grid:grid(8,6)},playerStarts:[{x:0,y:0},{x:1,y:0},{x:0,y:1},{x:1,y:1}],enemies:[{id:'eg',name:'敵',position:{x:7,y:5},members:[{unit:'e'}]}],victory:{type:'enemy_wipe'},defeat:{type:'player_wipe'},result:{credits:100,exp:10},...x});
const pack=x=>({format:'PRO_TD_PACK',version:1,packId:'t',name:'T',units:[unit('a'),unit('b'),unit('e',{deploy:{enemy:true}})],weapons:[],skills:[],items:[],terrains:[],flags:[],missions:[],tmissions:[tm()],research:[],hires:[],evolutions:[],fusions:[],achievements:[],...x});
// Deploys owned units (by unit id), one squad each.
function deploy(w,ids,mid='m'){const L=w.PROUnitLab,F=w.PROField,used=new Set();const groups=ids.map((id,i)=>{const o=L.owned().find(u=>u.id===id&&!used.has(u.uid));used.add(o.uid);return {id:'g'+i,name:'G'+i,faction:'player',mode:'auto',members:[{uid:o.uid,unit:o}]};});F.deploy({missionId:mid,groups});const s=F._live();s.talkQueue=[];return s;}
const G=(w,id)=>w.PROField._live().groups.find(g=>g.id===id);
try{

 const apt=(x={})=>({ground:'none',air:'none',water:'none',underwater:'none',space:'none',...x});
 const gun=(id,x={})=>({id,name:'銃',attackType:'ranged',damageType:'physical',useUnitAtk:true,baseAtk:100,powerPct:100,hitsMin:1,hitsMax:1,hitPowerPct:100,minRange:1,maxRange:1,...x});
 // #276: two weapons with the same name but different IDs keep their own ammo / uses. #275: a counter spends them (T&D).
 {const w=open(pack({weapons:[gun('x',{ammo:1,usesPerBattle:1}),gun('y',{ammo:5,usesPerBattle:1,enCost:20})],units:[unit('a',{weaponIds:['x','y'],en:50}),unit('b'),unit('e',{deploy:{enemy:true}})]}));const B=w.PROBattle,D=w.PROTacticalData;
  const def=D.unit('a'),mk=(o,side,id)=>B.combatant({hp:1000,atk:100,def:0,mob:1,acc:999,weapons:[],skills:[],tags:[],...o},side,id),a=mk({...def,ammo:{}},'ally','a'),e=mk({name:'E',hp:99999},'enemy','e');a.ammo={};a.en=50;
  const ctx=B.createContext({allies:[a],enemies:[e]});const [wx,wy]=a.weapons;assert.equal(wx.name,wy.name);await B.resolveWeapon(ctx,a,wx,[e]);assert.equal(a.ammo.x,0);assert.equal(a.ammo.y,undefined,'y untouched (#276)');assert.equal(a.weaponState.y,undefined);
  ctx.counterSpends=true;await B.resolveWeapon(ctx,a,wy,[e],{counter:true});assert.equal(a.ammo.y,4,'counter spends ammo (#275)');assert.equal(a.en,30,'and EN');assert.equal(a.weaponState.y.used,1);
  const pub=mk({name:'P',weapons:[{name:'g',attackType:'ranged',damageType:'physical',powerPct:100,hitsMin:1,hitsMax:1,hitPowerPct:100,ammo:3}]},'ally','p');pub.ammo={};const c2=B.createContext({allies:[pub],enemies:[e]});await B.resolveWeapon(c2,pub,pub.weapons[0],[e],{counter:true});assert.equal(pub.ammo.g,undefined,'published rules unchanged');}
 // #262: 再動 on one member frees the whole squad. #263: a squadmate gets 気力 for a map weapon kill.
 {const mw=gun('mw',{name:'MAP',baseAtk:99999,tactical:{map:{on:true,shape:'self',size:2}}});
  const w=open(pack({weapons:[mw],units:[unit('a',{weaponIds:['mw'],commands:[{id:'again',lv:1}]}),unit('b'),unit('e',{hp:1,def:0,mob:0,deploy:{enemy:true}})],commands:[{id:'again',name:'再動',costType:'funds',cost:0,target:'self',duration:'now',fx:{again:true}}]}));const F=w.PROField,T=w.PROTactical,d=w.document;const s=deploy(w,['a','b']);
  const g0=G(w,'g0'),g1=G(w,'g1');g0.members.push(...g1.members);s.groups=s.groups.filter(g=>g!==g1);G(w,'eg').position={x:1,y:1};for(const m of g0.members)m.tension=100;const m=g0.members[0];
  await F.mapAttack(g0,m,m.unit.weapons[0],null,{headless:true});const b=G(w,'g0').members.find(x=>x.unit.id==='b');assert(b.tension>100,'squadmate 気力 (#263): '+b.tension);assert(!T.canAct(G(w,'g0')),'acted');
  F.pick(0,0);F.pick(0,0);d.getElementById('fieldCmd').click();d.querySelector('#fieldChoiceBody [data-cmd$=">again"]').click();assert(T.canAct(G(w,'g0')),'the squad can act again (#262)');}
 // #264: a pilot who escaped its destroyed machine still gets the shared EXP.
 {const w=open(pack({units:[unit('a',{noFire:true,crew:'optional'}),unit('p',{pilotProfile:{stats:{atk:10}}}),unit('e',{deploy:{enemy:true}})]}));const L=w.PROUnitLab,F=w.PROField;const a=L.owned().find(u=>u.id==='a'),p=L.owned().find(u=>u.id==='p');assert.equal(L.board(a.uid,p.uid),'');
  const s=deploy(w,['a']);const g0=G(w,'g0'),pm={uid:p.uid,unit:w.PROTacticalData.unit('p')};s.fallen=[{groupId:'g0',mates:[a.uid],faction:'player',member:g0.members[0]}];g0.members=[pm];s.escapedPilots=[{from:a.uid,to:p.uid,faction:'player'}];s.groups=s.groups.filter(g=>g.faction==='player');
  assert.equal(F.checkOutcome(),'victory');F.showResult();assert((L.owned().find(u=>u.uid===p.uid).exp||0)>0||(L.owned().find(u=>u.uid===p.uid).level||1)>1,'pilot shares EXP');}
 // #265: preset with a gap, then a new squad: IDs stay unique.
 {const w=open(pack({units:[unit('a'),unit('b'),unit('c'),unit('e',{deploy:{enemy:true}})]}));const L=w.PROUnitLab,d=w.document,P=w.PROPreparation;L.setPreset('tactical',0,{groups:[{id:'group-1',name:'第1部隊',mode:'auto',members:['a']},{id:'group-3',name:'第3部隊',mode:'auto',members:['b']}]});P.setMission('m');
  d.getElementById('prepPresets').click();const call=[...d.querySelectorAll('#prepChoices button')].find(b=>b.textContent.includes('呼び出')||b.textContent.includes('読み込'));assert(call,'preset button: '+[...d.querySelectorAll('#prepChoices button')].map(b=>b.textContent).join('|'));call.click();
  d.getElementById('prepAddGroup').click();const ids=P.snapshot().groups.map(g=>g.id);assert.equal(new Set(ids).size,ids.length,'unique: '+ids.join());}
 // #266: a pilot placed at Lv99 is the game's maximum level (50).
 {const w=open(pack({units:[unit('a',{atk:500,crew:'optional'}),unit('p',{pilotProfile:{stats:{atk:100},growthPct:2}}),unit('e',{deploy:{enemy:true}})]}));const L=w.PROUnitLab,C=w.PROCore;const uid=L.addOwned('a',{unit:'p',lv:99});const pl=L.owned().find(u=>u.id==='p'&&u.uid!=='p');
  assert.equal(pl.level??pl.lv,C.LEVEL_MAX,'capped');const bonus=C.pilotBonus(w.PROTacticalData.unit('p').pilotProfile,C.LEVEL_MAX).atk;assert.equal(L.owned().find(u=>u.uid===uid).atk,500+bonus);}
 // #267: a destroyed guest unit makes unit_down true. #268: owned units in a guest squad withdrawn by an event survive.
 {const w=open(pack({units:[unit('a'),unit('b'),unit('e',{deploy:{enemy:true}})],tmissions:[tm({defeat:{type:'unit_down',unitId:'b'}})]}));const F=w.PROField;const s=deploy(w,['a']);const bdef=w.PROTacticalData.unit('b');
  s.fallen=[{groupId:'gs',faction:'player',member:{uid:'gs-1',unit:bdef}}];assert.equal(F.checkOutcome(),'defeat','guest b down (#267)');}
 {const w=open(pack({tmissions:[tm({events:[{id:'wd',name:'wd',trigger:{type:'flag',flag:'go'},actions:[{type:'withdraw',groupId:'guest'}]}]})]}));const L=w.PROUnitLab,F=w.PROField;const s=deploy(w,['a','b']);const g0=G(w,'g0');
  s.groups.push({id:'guest',name:'ゲスト',faction:'player',guest:true,position:{x:3,y:3},members:[...g0.members]});s.groups=s.groups.filter(g=>g!==g0);s.flags.go=true;F.checkOutcome();assert(!s.groups.some(g=>g.id==='guest'),'withdrawn');assert(s.retreated.some(r=>r.id==='a'),'a left safely (#268)');
  s.groups=s.groups.filter(g=>g.faction==='player');F.checkOutcome();F.showResult();assert(L.owned().some(u=>u.id==='a'),'a kept');}
 // #270: a water-only squad comes out of a sortie gate at sea on a ground mission.
 {const sea={id:'sea',name:'海',tactical:{kind:'water',costs:{water:1}}},g=grid(8,6);g[2][2]='sea';const w=open(pack({terrains:[sea],units:[unit('a'),unit('boat',{movementAptitude:apt({water:'A'})}),unit('e',{deploy:{enemy:true}})],tmissions:[tm({map:{width:8,height:6,grid:g}})]}));const F=w.PROField;deploy(w,['a']);
  const out=F.placeGroup({id:'r',name:'艇',faction:'player',mode:'auto',members:[{uid:'boat',unit:w.PROTacticalData.unit('boat')}]},2,2);assert.equal(out.members[0].domain,'water');}
 // #272: a maker test squad is split by size (2XL ×4 → two squads).
 {const tp={missionId:'m',party:'maker',units:['big','big','big','big'],snapshot:{}};const w=open(pack({units:[unit('a'),unit('big',{size:'2XL'}),unit('e',{deploy:{enemy:true}})]}),{PRO_TACTICAL_TESTPLAY:JSON.stringify(tp)},'?trial=m');w.dispatchEvent(new w.Event('load'));
  const st=w.PROField._live();assert(st,'deployed');assert.equal(st.groups.filter(g=>g.faction==='player').length,2);}
 // #269: back on the normal URL with an unfinished test play: the original progress is put back.
 {const orig='{"credits":12345,"day":3,"owned":[]}',tp={missionId:'m',party:'save',units:[],snapshot:{PRO_TACTICAL_HQ:orig,PRO_TACTICAL_SOURCE:'maker'}};const w=open(pack({}),{PRO_TACTICAL_TESTPLAY:JSON.stringify(tp),PRO_TACTICAL_HQ:'{"credits":99,"day":9,"owned":[]}'});
  assert.equal(w.localStorage.getItem('PRO_TACTICAL_HQ'),orig,'restored');assert.equal(w.localStorage.getItem('PRO_TACTICAL_TESTPLAY'),null);assert.equal(w.sessionStorage.getItem('PRO_TACTICAL_TP_RESTORED'),'1');}
 console.log('PASS: audit batch 3 — squad 再動 (#262), map weapon 気力 for squadmates (#263), escaped pilot EXP (#264), preset squad IDs (#265), pilot level cap (#266), guest unit_down (#267), guest withdraw keeps owned units (#268), abandoned test play restored (#269), sortie gate at sea (#270), test squads by size (#272), counter spending (#275), same-name weapons (#276)');
}finally{for(const w of windows){await w.happyDOM.cancelAsync();w.close();}}
