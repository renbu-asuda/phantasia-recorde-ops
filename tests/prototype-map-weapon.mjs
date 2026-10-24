import fs from 'node:fs';import path from 'node:path';import assert from 'node:assert/strict';import {Window} from 'happy-dom';
// Map weapons (マップ兵器, map_weapon.js): shapes, the command flow (aim → fire, before moving only), no counter, enemies
// only, ammo spent once, AI use, and that local battles / PRO・D / the normal attack leave them out.
const file='game/prototypes/tactical_hub.html',html=fs.readFileSync(file,'utf8');
const MAPW={id:'zz-mapw',name:'MAP砲',attackType:'ranged',damageType:'physical',useUnitAtk:true,baseAtk:600,powerPct:100,hitsMin:1,hitsMax:1,hitPowerPct:100,accuracyPt:100,ammo:2,minRange:2,maxRange:4,tactical:{map:{on:true,shape:'point',size:1}}};
// The tutorial pack's Valkis gets the map weapon (and keeps its rifle and blade).
function open(weapon=MAPW,{support=false}={}){const w=new Window({url:'http://localhost/'+file,settings:{enableJavaScriptEvaluation:true,disableJavaScriptFileLoading:true,disableCSSFileLoading:true,suppressInsecureJavaScriptEnvironmentWarning:true}});w.scrollTo=()=>{};
 w.localStorage.setItem('PRO_TACTICAL_LOAD',JSON.stringify({sample:true,maker:false,packs:[]}));w.document.write(html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/g,''));w.sessionStorage.setItem('PRO_TACTICAL_TITLE_SEEN','1');
 for(const dl of w.document.querySelectorAll('dialog')){dl.showModal=()=>dl.setAttribute('open','');dl.show=()=>dl.setAttribute('open','');dl.close=()=>{dl.removeAttribute('open');dl.dispatchEvent(new w.Event('close'));};}
 {const C=w.HTMLCanvasElement?.prototype;if(C){C.getContext=()=>({fillRect(){},set fillStyle(v){}});C.toDataURL=()=>'data:image/png;base64,UElY';}}
 for(const m of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/g)){const src=/src=["']([^"']+)["']/.exec(m[1]);w.eval(src?fs.readFileSync(path.resolve(path.dirname(file),src[1]),'utf8'):m[2]);
  if(src&&src[1]==='tactical_pack_sample.js'){const p=w.PROTacticalSamplePack;p.weapons.push(JSON.parse(JSON.stringify(weapon)));p.units.find(u=>u.name==='ヴァルキス').weaponIds.push(weapon.id);
   // 味方支援 for #192: range 2, ATK +20%, weapon range +2 (held by infantry U2).
   if(support){p.skills.push({id:'zz-sup',name:'テスト支援',tacticalOnly:true,tactical:{support:{on:true,range:2,atk:20,rangeAdd:2}}});p.units.find(u=>u.id===U(2)).skillIds.push('zz-sup');}}
  // Every local / map battle context is kept in window.__ctx.
  if(src&&src[1]==='td_battle.js')w.eval("window.__ctx=[];{const orig=window.PROBattle.createContext;window.PROBattle=Object.freeze({...window.PROBattle,createContext:o=>{const c=orig(o);window.__ctx.push(c);return c;}});}");}return w;}
const id=(code,n)=>'sample-'+code+'-'+String(n).padStart(6,'0'),U=n=>id('U',n),TM=n=>id('TM',n);
const tick=()=>new Promise(r=>setTimeout(r,0));
const hpSum=g=>g.members.reduce((n,m)=>n+(m.currentHp??m.unit.hp),0);
function setup(weapon,opt){const w=open(weapon,opt);const L=w.PROUnitLab,F=w.PROField;const v=L.owned().find(x=>x.id===U(1)),inf=L.owned().find(x=>x.id===U(2));
 F.deploy({missionId:TM(8),groups:[{id:'g0',name:'A',faction:'player',mode:'auto',members:[{uid:v.uid,unit:v}]},{id:'g1',name:'B',faction:'player',mode:'auto',members:[{uid:inf.uid,unit:inf}]}]});
 const s=F._live();s.talkQueue=[];const at=(gid,x,y)=>{s.groups.find(g=>g.id===gid).position={x,y};};at('g0',2,4);at('g1',5,4);at('t8-e1',6,4);at('t8-e2',6,5);at('t8-e3',12,4);F.setSetting('playerBattle','skip');F.setSetting('enemyBattle','skip');return {w,F,s,d:w.document,G:gid=>F._live().groups.find(g=>g.id===gid)};}

// Shapes (squares hit, before clipping to the map).
{const w=open(),M=w.PROMapWeapon,o={x:5,y:5},mk=map=>({...MAPW,tactical:{map:{on:true,...map}}});
 assert.equal(M.area(mk({shape:'point',size:1}),o,{x:7,y:5}).length,5,'point radius 1');assert.equal(M.area(mk({shape:'point',size:0}),o,{x:7,y:5}).length,1,'point radius 0');
 assert.equal(M.area(mk({shape:'self',size:2}),o).length,12,'self 2 (own square left out)');assert(!M.area(mk({shape:'self',size:2}),o).some(p=>p.x===5&&p.y===5));
 const line=M.area(mk({shape:'line',size:3,width:3}),o,'right');assert.equal(line.length,9,'line 3×3');assert(line.every(p=>p.x>5&&p.x<=8&&Math.abs(p.y-5)<=1));
 const cone=M.area(mk({shape:'cone',size:3}),o,'up');assert.equal(cone.length,9,'cone 1+3+5');assert(cone.some(p=>p.x===3&&p.y===2)&&!cone.some(p=>p.y>=5));
 assert.equal(M.dirTo(o,{x:5,y:1}),'up');assert.equal(M.dirTo(o,{x:7,y:7}),null,'diagonal: no direction');
 assert.equal(M.normal([MAPW,{name:'x'}]).length,1);assert.match(M.text(MAPW),/着弾点（射程2〜4・半径1）/);}

// The command: aim at a square in range, fire; enemies in the area only, no counter, ammo once, the action ends.
{const {w,F,s,d,G}=setup();const e1=hpSum(G('t8-e1')),e2=hpSum(G('t8-e2')),e3=hpSum(G('t8-e3')),b=hpSum(G('g1')),a=hpSum(G('g0'));
 assert(!F.canAttack(G('g0'),G('t8-e1')),'the normal attack leaves the map weapon out (distance 4 > rifle 3)');
 F.pick(2,4);F.pick(2,4);assert(!d.getElementById('fieldMapw').hidden,'マップ兵器 command');d.getElementById('fieldMapw').click();
 const btn=[...d.querySelectorAll('#fieldChoiceBody button')].find(x=>x.dataset.mapw);assert(btn&&!btn.disabled&&/MAP砲/.test(btn.textContent),'weapon listed');btn.click();assert.equal(F.state().mode,'mapw');
 F.pick(1,4);assert.equal(F.mapwState().aim,null,'out of range: no aim');F.pick(6,4);assert.deepEqual({...F.mapwState().aim},{x:6,y:4});
 const fire=d.getElementById('fieldMapwFire');assert(fire&&!fire.disabled,'fire button');assert.equal(d.querySelectorAll('.field-tile.mapw-area').length,5,'area shown');
 assert.deepEqual(F.mapwHits(G('g0'),G('g0').members[0].unit.weapons.find(x=>x.name==='MAP砲'),{x:6,y:4}).map(g=>g.id).sort().join(),'t8-e1,t8-e2','enemies only (the player squad B is in the area)');
 await F.fireMapw({watch:false});
 assert(!G('t8-e1')||hpSum(G('t8-e1'))<e1,'e1 hit');assert(!G('t8-e2')||hpSum(G('t8-e2'))<e2,'e2 hit');assert.equal(hpSum(G('t8-e3')),e3,'e3 outside');assert.equal(hpSum(G('g1')),b,'own squad not hit');
 assert.equal(hpSum(G('g0')),a,'no counter');assert.equal(G('g0').members[0].ammo['zz-mapw'],1,'ammo spent once');assert(!w.PROTactical.canAct(G('g0')),'action ended');
 assert(F.opLog().some(l=>/マップ兵器「MAP砲」/.test(l.s)),'logged');}

// After moving: not usable. With no target in the area: no fire.
{const {w,F,d,G}=setup();const s=F._live();s.groups=s.groups.map(g=>g.id==='g0'?w.PROTactical.markMoved(g):g);F.pick(2,4);F.pick(2,4);assert(d.getElementById('fieldMapw').hidden,'hidden after moving');
 const g=G('g0'),m=g.members[0],wp=m.unit.weapons.find(x=>x.name==='MAP砲');F.openMapw();const btn=[...d.querySelectorAll('#fieldChoiceBody button')].find(x=>x.dataset.mapw);assert(btn.disabled&&/移動後は使えません/.test(btn.textContent));}
{const {F,d,G}=setup();F.pick(2,4);F.pick(2,4);d.getElementById('fieldMapw').click();[...d.querySelectorAll('#fieldChoiceBody button')].find(x=>x.dataset.mapw).click();F.pick(2,7);
 assert(d.getElementById('fieldMapwFire').disabled,'no enemy: fire disabled');const before=JSON.stringify(F._live().groups);await F.fireMapw();assert.equal(JSON.stringify(F._live().groups),before,'nothing happens');}

// A line: choose the direction with the buttons (or a square), watch it on the battle screen.
{const {w,F,d,G}=setup({...MAPW,tactical:{map:{on:true,shape:'line',size:4,width:3}}});const e1=hpSum(G('t8-e1'));F.pick(2,4);F.pick(2,4);d.getElementById('fieldMapw').click();[...d.querySelectorAll('#fieldChoiceBody button')].find(x=>x.dataset.mapw).click();
 assert.equal(F.mapwState().aim,'right','starts facing the most enemies');d.querySelector('[data-mapw-dir="up"]').click();assert.equal(F.mapwState().aim,'up');assert(d.getElementById('fieldMapwFire').disabled);
 F.pick(4,4);assert.equal(F.mapwState().aim,'right','a square sets the direction');assert.equal(d.querySelectorAll('.field-tile.mapw-area').length,12);
 const p=F.fireMapw({watch:true});for(let i=0;i<400&&!d.querySelector('#fieldBattle').hasAttribute('open');i++)await tick();
 for(let i=0;i<400;i++){if(d.querySelector('#fieldBattle').hasAttribute('open')&&!d.querySelector('#fieldBattleClose').disabled){d.querySelector('#fieldBattleSkip')?.click();}await new Promise(r=>setTimeout(r,10));if(/撃破/.test(d.querySelector('#fieldBattleSummary').textContent))break;}
 d.querySelector('#fieldBattleClose').click();await p;assert(!G('t8-e1')||hpSum(G('t8-e1'))<e1,'hit through the battle screen');assert(/マップ兵器/.test(d.querySelector('#fieldBattleSummary').textContent));}

// #190: stunned (行動不能 from a local battle) — firing does nothing but use up one stunned action, like a normal attack;
// the next turn it fires. The AI does not fire while stunned.
{const {w,F,d,G}=setup();const st=()=>({buffs:[],stun:1,burn:null,taunt:null,shield:0});G('g0').members[0].combatState={status:st()};const e=hpSum(G('t8-e1'))+hpSum(G('t8-e2'));
 F.pick(2,4);F.pick(2,4);d.getElementById('fieldMapw').click();const btn=[...d.querySelectorAll('#fieldChoiceBody button')].find(x=>x.dataset.mapw);assert(!btn.disabled&&/スタン中/.test(btn.textContent),'stun shown');btn.click();F.pick(6,4);
 await F.fireMapw({watch:false});assert.equal(hpSum(G('t8-e1'))+hpSum(G('t8-e2')),e,'no damage while stunned');assert.equal(G('g0').members[0].ammo?.['zz-mapw']??2,2,'no ammo spent');
 assert.equal(G('g0').members[0].combatState.status.stun,0,'one stunned action used');assert(!w.PROTactical.canAct(G('g0')),'the action ends');assert(F.opLog().some(l=>/スタンで行動できなかった/.test(l.s)));
 const s=F._live();s.groups=s.groups.map(g=>g.faction==='player'?{...g,members:g.members.map(m=>({...m,action:{}}))}:g);// next turn
 F.pick(2,4);F.pick(2,4);d.getElementById('fieldMapw').click();[...d.querySelectorAll('#fieldChoiceBody button')].find(x=>x.dataset.mapw).click();F.pick(6,4);await F.fireMapw({watch:false});assert(hpSum(G('t8-e1')??{members:[]})+hpSum(G('t8-e2')??{members:[]})<e,'fires once the stun is over');}
{const {F,s,G}=setup();const wp=JSON.parse(JSON.stringify(G('g0').members[0].unit.weapons.find(x=>x.name==='MAP砲')));const e=G('t8-e3');e.members[0].unit.weapons.push(wp);e.members.forEach(m=>{m.combatState={status:{buffs:[],stun:1,burn:null,taunt:null,shield:0}};});
 s.groups.find(g=>g.id==='g0').position={x:9,y:4};s.groups.find(g=>g.id==='g1').position={x:9,y:5};assert.equal(F.aiMapw(G('t8-e3')),null,'a stunned AI unit does not fire its map weapon');}

// #192: each local battle builds the units from the current support (ATK, weapon range, sup), not from the last battle.
for(const firstIn of [true,false]){const {w,F,s,G}=setup(MAPW,{support:true});const far={x:12,y:0},near={x:3,y:3};
 for(const id of ['t8-e1'])G(id).members.forEach(m=>{m.unit={...m.unit,hp:999999,def:99999};delete m.currentHp;});s.groups.find(g=>g.id==='t8-e1').position={x:2,y:5};
 const fight=async inSupport=>{const st=F._live();st.groups.find(g=>g.id==='g1').position=inSupport?near:far;st.groups=st.groups.map(g=>g.faction==='player'?{...g,members:g.members.map(m=>({...m,action:{}}))}:g);F.focusGroup?.('g0');F.pick(2,4);
  const n=w.__ctx.length;await F.attackTarget('t8-e1');const ctx=w.__ctx[n],v=ctx.allies.find(u=>u.name==='ヴァルキス');return {atk:v.atk,range:v.weapons.find(x=>x.name==='ビームライフル').maxRange,sup:v.sup?.atk||0};};
 const a=await fight(firstIn),b=await fight(!firstIn),inn=firstIn?a:b,out=firstIn?b:a;
 assert.equal(inn.sup,20,'supported battle');assert.equal(out.sup,0,'no support left over / missing ('+(firstIn?'leaving':'entering')+')');assert(inn.atk>out.atk,'ATK follows the support');assert.equal(inn.range,out.range+2,'range follows the support');
 assert.deepEqual(Object.keys(G('g0').members[0].combatState).filter(k=>!['status','extraActions','extraTurn','weaponState','skillUses'].includes(k)),[],'only battle state is kept');}

// Local battles and PRO・D leave the map weapon out.
{const {w,F,G}=setup();const s=F._live();s.groups.find(g=>g.id==='t8-e1').position={x:3,y:4};F.pick(2,4);await F.attackTarget('t8-e1');
 assert(![...w.document.querySelectorAll('#fieldBattleLog p, #fieldBattleLog div')].some(p=>/MAP砲/.test(p.textContent)),'not used in a local battle');assert.equal(G('g0').members[0].ammo?.['zz-mapw']??2,2,'ammo kept');
 w.PRODispatchData.players();const def=w.PRODispatchData.defs[U(1)];assert(def&&def.weapons.length&&!def.weapons.some(x=>x.name==='MAP砲'),'PRO・D leaves it out');}

// AI: an enemy fires its map weapon before moving when it hits 2+ squads.
{const {w,F,s,G}=setup();const wp=JSON.parse(JSON.stringify(G('g0').members[0].unit.weapons.find(x=>x.name==='MAP砲')));const e=G('t8-e3');e.members[0].unit.weapons.push(wp);
 s.groups.find(g=>g.id==='g0').position={x:9,y:4};s.groups.find(g=>g.id==='g1').position={x:9,y:5};const a=hpSum(G('g0'))+hpSum(G('g1'));
 const pick=F.aiMapw(G('t8-e3'));assert(pick&&pick.squads===2,'AI picks the aim with both squads');await F.endTurn();
 assert(F.opLog().some(l=>/マップ兵器/.test(JSON.stringify(l))),'AI fired');assert((G('g0')?hpSum(G('g0')):0)+(G('g1')?hpSum(G('g1')):0)<a,'player squads hit');}
console.log('PASS: map weapons — shapes, aim and fire before moving, enemies only, no counter, ammo once, not in local battles / PRO・D, AI use, stun (#190), support rebuilt each local battle (#192)');
