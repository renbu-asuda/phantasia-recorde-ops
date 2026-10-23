import fs from 'node:fs';import path from 'node:path';import assert from 'node:assert/strict';import {Window} from 'happy-dom';
// Regression tests for #182 (stored squads count as alive) and #183 (the PRO・D estimate fights the same squad, under the
// same rules, as the real battle), on the built-in tutorial pack.
const file='game/prototypes/tactical_hub.html',html=fs.readFileSync(file,'utf8');
// after(src, w): runs right after a script file is read (used to watch PROBattle).
function open(after){const w=new Window({url:'http://localhost/'+file,settings:{enableJavaScriptEvaluation:true,disableJavaScriptFileLoading:true,disableCSSFileLoading:true,suppressInsecureJavaScriptEnvironmentWarning:true}});w.scrollTo=()=>{};
 w.localStorage.setItem('PRO_TACTICAL_LOAD',JSON.stringify({sample:true,maker:false,packs:[]}));w.document.write(html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/g,''));w.sessionStorage.setItem('PRO_TACTICAL_TITLE_SEEN','1');
 for(const dl of w.document.querySelectorAll('dialog')){dl.showModal=()=>dl.setAttribute('open','');dl.close=()=>{dl.removeAttribute('open');dl.dispatchEvent(new w.Event('close'));};}
 {const C=w.HTMLCanvasElement?.prototype;if(C){C.getContext=()=>({fillRect(){},set fillStyle(v){}});C.toDataURL=()=>'data:image/png;base64,UElY';}}
 for(const m of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/g)){const src=/src=["']([^"']+)["']/.exec(m[1]);w.eval(src?fs.readFileSync(path.resolve(path.dirname(file),src[1]),'utf8'):m[2]);if(src&&after)after(src[1],w);}return w;}
const id=(code,n)=>'sample-'+code+'-'+String(n).padStart(6,'0'),U=n=>id('U',n),TM=n=>id('TM',n);

// #182: a living squad stored in a facility is not a loss: 'loss' / 'unit_down' stay false and 'no_loss' holds.
{const w=open();const L=w.PROUnitLab,F=w.PROField,D=w.PROTacticalData,d=w.document,m=D.mission(TM(8));
 m.victory={type:'enemy_wipe'};m.objectives=[{id:'A',name:'A',success:{type:'turn',turns:50},fail:{type:'loss'}},{id:'B',name:'B',success:{type:'turn',turns:50},fail:{type:'unit_down',unitId:U(2)}},{id:'C',name:'C',success:{type:'no_loss'}}];
 m.events=[{id:'lost',name:'lost',trigger:{type:'loss'},actions:[{type:'flag',flag:'lost'}]}];
 const inf=L.owned().find(x=>x.id===U(2)),hound=L.owned().find(x=>x.id===U(3));
 F.deploy({missionId:TM(8),groups:[{id:'g0',name:'A',faction:'player',mode:'auto',members:[{uid:inf.uid,unit:inf}]},{id:'g1',name:'B',faction:'player',mode:'auto',members:[{uid:hound.uid,unit:hound}]}]});
 const s=F._live();s.talkQueue=[];s.stored={};F.fac(11,4).st.owner='player';s.groups.find(g=>g.id==='g0').position={x:11,y:4};
 F.pick(11,4);assert(!d.getElementById('fieldStore').hidden,'store command');d.getElementById('fieldStore').click();[...d.querySelectorAll('#fieldChoiceBody button')].find(b=>b.textContent==='格納する').click();
 const st=F._live();assert.equal(Object.values(st.stored).flat().length,1,'stored');assert.equal(st.objectives.A,'open');assert.equal(st.objectives.B,'open');assert(!st.flags?.lost,'no loss event');
 st.groups=st.groups.filter(g=>g.faction==='player');st.pending=[];assert.equal(F.checkOutcome(),'victory');assert.equal(F._live().objectives.C,'done','no_loss holds with a stored squad');
 // A real loss still counts.
 const w2=open();const F2=w2.PROField,m2=w2.PROTacticalData.mission(TM(8));m2.victory={type:'enemy_wipe'};m2.objectives=[{id:'A',name:'A',success:{type:'turn',turns:50},fail:{type:'loss'}}];const i2=w2.PROUnitLab.owned().find(x=>x.id===U(2)),h2=w2.PROUnitLab.owned().find(x=>x.id===U(3));
 F2.deploy({missionId:TM(8),groups:[{id:'g0',name:'A',faction:'player',mode:'auto',members:[{uid:i2.uid,unit:i2}]},{id:'g1',name:'B',faction:'player',mode:'auto',members:[{uid:h2.uid,unit:h2}]}]});const s2=F2._live();s2.talkQueue=[];
 s2.groups=s2.groups.filter(g=>g.id!=='g0');await F2.endTurn();assert.equal(F2._live().objectives.A,'failed','a destroyed squad is a loss');}

// #183: the estimate and the battle get the same allies (pilot aboard, skills) and the same rules (気力, 味方支援).
{let sim=null,run=null;const w=open((src,w)=>{if(src.endsWith('shared/pro_battle.js'))w.eval("window.PROBattle=Object.freeze({...window.PROBattle,simulate:async o=>{window.__sim=o;return {winRate:0.5}},runBattle:async ctx=>{window.__run=ctx;return {outcome:'lose',turns:1}}})");});
 const L=w.PROUnitLab,X=w.PRODispatch,DD=w.PRODispatchData,d=w.document,B=w.PROBattle;for(let n=1;n<=7;n++)L.finishMission(w.PROTacticalData.mission(TM(n)),{outcome:'win',turns:3});
 assert.equal(L.board('d:'+U(1),'d:'+U(30)),'','the captain boards the Valkis (PRO・D)');X.show(id('DM',2));X.choose([U(1),U(9),U(4)]);await X.estimate();sim=w.__sim;assert(sim,'estimate ran');
 const est=B.buildBattle(sim,B.mulberry32(7));sim.prepare(est);
 const p=X.start({watch:false});for(let i=0;i<300&&!w.__run;i++){if(d.querySelector('#storyWindow').open)d.querySelector('#storySkip').click();if(d.querySelector('#dispatchAsk')?.open)d.querySelector('#dispatchSkip').click();await new Promise(r=>setTimeout(r,20));}run=w.__run;assert(run,'battle ran');
 for(let i=0;i<300;i++){if(d.querySelector('#storyWindow').open)d.querySelector('#storySkip').click();if(d.querySelector('#fieldBattle').open&&!d.querySelector('#fieldBattleClose').disabled)d.querySelector('#fieldBattleClose').click();await new Promise(r=>setTimeout(r,20));if(d.querySelector('#fieldResult').open)break;}
 const view=ctx=>ctx.allies.map(u=>({id:u.id,atk:u.atk,acc:u.acc,mob:u.mob,skills:(u.skills||[]).map(s=>s.name).sort().join(),sup:JSON.stringify(u.sup||null),tension:u.tension,tmax:u.tcfg?.max}));
 const a=view(est),b=view(run);assert.deepEqual(a,b,'same allies in the estimate and the battle');
 const valkis=a.find(x=>x.id===U(1)),tank=a.find(x=>x.id===U(4));assert(valkis.skills.includes('指揮'),'the pilot skill rides along');assert(valkis.atk>300,'pilot bonus');assert(JSON.parse(tank.sup).hit>=25,'support from the radar and the captain');assert(valkis.tmax>0,'気力 is set');
 assert(typeof est.hooks.tensionMods==='function'&&est.hooks.replaceOnDeath,'the estimate runs under the battle rules');}
console.log('PASS: audit battle fixes — stored squads are alive for loss / unit_down / no_loss, PRO・D estimate matches the battle (pilot, skills, support, 気力)');
