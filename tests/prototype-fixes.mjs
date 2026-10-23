import fs from 'node:fs';import path from 'node:path';import assert from 'node:assert/strict';import {Window} from 'happy-dom';
// Regression tests for issues #160〜#166 (settlement, result flags, boarding after fusion, condition costs, squad
// refresh and sortie checks), on the former built-in sample pack (tests/fixtures/legacy_sample_pack.js).
const SID=JSON.parse(fs.readFileSync('tests/sample-ids.json','utf8')),SX=x=>SID[x]||x;
const file='game/prototypes/tactical_hub.html',html=fs.readFileSync(file,'utf8');
function open(store={}){const w=new Window({url:'http://localhost/'+file,settings:{enableJavaScriptEvaluation:true,disableJavaScriptFileLoading:true,disableCSSFileLoading:true,suppressInsecureJavaScriptEnvironmentWarning:true}});w.scrollTo=()=>{};
 w.localStorage.setItem('PRO_TACTICAL_SOURCE','sample');for(const [k,v] of Object.entries(store))w.localStorage.setItem(k,v);w.document.write(html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/g,''));w.sessionStorage.setItem('PRO_TACTICAL_TITLE_SEEN','1');
 for(const dl of w.document.querySelectorAll('dialog')){dl.showModal=()=>dl.setAttribute('open','');dl.close=()=>{dl.removeAttribute('open');dl.dispatchEvent(new w.Event('close'));};}
 {const C=w.HTMLCanvasElement?.prototype;if(C){C.getContext=()=>({fillRect(){},set fillStyle(v){}});C.toDataURL=()=>'data:image/png;base64,UElY';}}
 for(const m of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/g)){const src=/src=["']([^"']+)["']/.exec(m[1]);w.eval(src?fs.readFileSync(src[1]==='tactical_pack_sample.js'?'tests/fixtures/legacy_sample_pack.js':path.resolve(path.dirname(file),src[1]),'utf8'):m[2]);}
 w.PROUnitLab.spend(-20000);return w;}
const wait=ms=>new Promise(r=>setTimeout(r,ms));
// Runs a PRO・D sortie to its result (stories skipped, battle closed).
async function runDispatch(w,opts={watch:false}){const d=w.document,p=w.PRODispatch.start(opts);let fin=false,out;p.then(r=>{fin=true;out=r;});
 for(let i=0;i<400&&!fin;i++){if(d.querySelector('#storyWindow').open)d.querySelector('#storySkip').click();if(d.querySelector('#labWindow').open)d.querySelector('#labWinActions [data-lab=choice0]')?.click();if(d.querySelector('#fieldBattle').open&&!d.querySelector('#fieldBattleClose').disabled)d.querySelector('#fieldBattleClose').click();await wait(20);}await p;return out;}
const mid=SX('training-01');

// #160: the mission's autosave is made once everything is settled (EXP, day, research), Tactical and PRO・D.
{const w=open();const L=w.PROUnitLab,F=w.PROField,T=w.PROTactical,S=w.PROSave;const o=L.owned().find(x=>x.id===SX('scout'));
 F.deploy({missionId:mid,groups:[T.initializeDomains({id:'g',name:'A',faction:'player',mode:'auto',members:[{uid:o.uid,unit:o}]},'ground')]});const s=F._live();s.talkQueue=[];s.groups=s.groups.filter(g=>g.faction==='player');
 assert.equal(F.checkOutcome(),'victory');F.showResult();const auto=S.read('auto').hq;assert.equal(auto.day,L.day(),'autosave after the day advanced');assert.equal(auto.day,2);
 assert.equal(auto.owned.find(x=>x.uid===o.uid).exp,L.owned().find(x=>x.uid===o.uid).exp,'autosave has the EXP');assert(L.owned().find(x=>x.uid===o.uid).exp>0);}
{const w=open();const L=w.PROUnitLab,DD=w.PRODispatchData,X=w.PRODispatch,S=w.PROSave;X.show(DD.listing()[0].id);X.auto();await runDispatch(w);
 assert.equal(L.day(),2);assert.equal(S.read('auto').hq.day,2,'PRO・D autosave after the day advanced');}

// #165: PRO・D result flags apply per outcome; Tactical win flags (flat) still apply on a win only.
{const w=open();const L=w.PROUnitLab,m=o=>({id:'flag-test',name:'flag-test',resultFlags:{win:{audit_win:true,old:false},lose:{audit_lose:true},draw:{audit_draw:true}}});
 L.mergeFlags({old:true});L.finishMission(m(),{outcome:'win',turns:1});assert.deepEqual({...L.flags()},{old:false,audit_win:true});
 L.finishMission(m(),{outcome:'lose',turns:1});assert.equal(L.flags().audit_lose,true);assert.equal('win' in L.flags(),false);L.finishMission(m(),{outcome:'draw',turns:1});assert.equal(L.flags().audit_draw,true);
 L.finishMission({id:'t',name:'t',resultFlags:{flat:true}},{outcome:'lose',turns:1});assert.equal(L.flags().flat,undefined,'flat (Tactical) flags only on a win');L.finishMission({id:'t',name:'t',resultFlags:{flat:true}},{outcome:'win',turns:1});assert.equal(L.flags().flat,true);
 // Saved and read back.
 const w2=open(Object.fromEntries(Object.keys(w.localStorage).map(k=>[k,w.localStorage.getItem(k)])));assert.equal(w2.PROUnitLab.flags().audit_win,true);assert.equal(w2.PROUnitLab.flags().old,false);}

// #161: a boarded machine used up by fusion leaves no boarding behind; the pilot is free again.
{const w=open();const L=w.PROUnitLab,d=w.document;L.addOwned(SX('aoi'));const robot=L.owned().find(x=>x.id===SX('robot')),aoi=L.owned().find(x=>x.id===SX('aoi'));assert.equal(L.board(robot.uid,aoi.uid),'');
 L.renderFusion();const tap=id=>d.querySelector('#fusionGrid [data-unit='+id+']').click();tap(SX('robot'));tap(SX('robot'));tap(SX('fighter'));tap(SX('fighter'));d.querySelector('#labWinActions [data-lab=run]').click();
 assert(!L.owned().some(x=>x.uid===robot.uid),'the machine was used up');assert.deepEqual({...L.boards()},{});assert.equal(L.crewProblem(aoi.uid),'');
 // An older save with a stale pair loads cleanly.
 const st=JSON.parse(w.localStorage.getItem('PRO_TACTICAL_HQ'));st.boards={'gone-uid':aoi.uid};const w2=open({PRO_TACTICAL_HQ:JSON.stringify(st)});assert.deepEqual({...w2.PROUnitLab.boards()},{});assert.equal(w2.PROUnitLab.crewProblem(aoi.uid),'');}

// #163: condition costs pay items too (production / hire, evolution, fusion), all or nothing.
{const w=open();const L=w.PROUnitLab;const parts=SX('parts');const before=L.items()[parts]||0;assert(before>=2,'fixture parts: '+before);
 const credits=L.credits();assert.equal(L.payForSortie({conds:{mode:'all',list:[{type:'credits_use',value:100},{type:'item_use',itemId:parts,count:2}]}}),'');
 assert.equal(L.credits(),credits-100);assert.equal(L.items()[parts]||0,before-2);
 const c2=L.credits(),i2=L.items()[parts]||0;assert(L.payForSortie({conds:{mode:'all',list:[{type:'credits_use',value:100}]}},0,[parts,parts,parts,parts,parts,parts,parts,parts,parts,parts]),'short');assert.equal(L.credits(),c2,'nothing spent when short');assert.equal(L.items()[parts]||0,i2);}

// #164: a mission's condition costs are paid at sortie (Tactical), and not when the sortie fails.
{const w=open();const L=w.PROUnitLab,D=w.PROTacticalData,d=w.document,parts=SX('parts');const m=D.mission(mid);m.conds={mode:'all',list:[{type:'credits_use',value:1000},{type:'item_use',itemId:parts,count:2}]};
 const c0=L.credits(),i0=L.items()[parts]||0;const P=w.PROPreparation;P.setMission(mid);assert(P.addUnit(L.owned().find(x=>x.id===SX('scout')).uid));
 // Short of items: nothing is paid and nothing deploys.
 const keep=L.items()[parts];L.sell?.(parts,keep-1);if((L.items()[parts]||0)<2){const c1=L.credits();d.querySelector('#prepConfirm').click();assert(!w.PROField._live(),'no sortie when short');assert.equal(L.credits(),c1);L.spend(-0);}
 for(let i=L.items()[parts]||0;i<5;i++)L.buy(parts);const i1=L.items()[parts];d.querySelector('#prepConfirm').click();
 assert(w.PROField._live(),'deployed');assert.equal(L.items()[parts]||0,i1-2,'items paid at sortie');assert(L.credits()<=c0-1000,'credits paid at sortie');}

// #162: the squads take the latest unit data (equipment, pilot, wrecked) and a wrecked member blocks the sortie.
{const w=open();const L=w.PROUnitLab,d=w.document,P=w.PROPreparation;const key=L.owned().find(x=>w.PROTacticalData.unit(x.id).noFire)||L.owned()[0];
 P.setMission(mid);assert(P.addUnit(key.uid));assert.equal(P.snapshot().groups[0].members.length,1);
 const acc0=P.snapshot().groups[0].members[0].unit.acc,scope=SX('sample-I-000012');assert(L.equip(key.uid,0,scope),'equip');P.setMission(mid);assert.equal(P.snapshot().groups[0].members[0].unit.acc,acc0+60,'equipment reaches the squad');
 L.handleLosses([key.uid],[]);P.setMission(mid);const o=L.owned().find(x=>x.uid===key.uid);
 assert(o?.down,'the key unit is wrecked or injured');{assert(d.querySelector('#prepConfirm').disabled,'a wrecked member blocks the sortie');assert(d.querySelector('#prepSummary').textContent.includes(o.down==='injured'?'重傷':'大破'));}}

// #166: おまかせ, presets and the start skip / refuse wrecked and injured PRO・D units; manual add is refused too.
{const w=open();const L=w.PROUnitLab,DD=w.PRODispatchData,X=w.PRODispatch,d=w.document;const mid2=DD.listing()[0].id;X.show(mid2);X.auto();const picked=X.chosen();assert(picked.length>0);
 d.querySelector('#dispatchPresets').click();d.querySelector('#labWinActions [data-preset=save0]').click();
 const key=Object.values(DD.defs).find(x=>x.noFire&&x.deploy?.player&&picked.includes(x.id))||Object.values(DD.defs).find(x=>x.noFire&&x.deploy?.player);assert(key,'a key unit');
 if(!picked.includes(key.id)){X.choose([...picked.slice(0,0),key.id]);}const lineup=X.chosen();
 L.handleDispatchLosses([key]);assert(L.dispatchState(key.id),'wrecked or injured');
 X.auto();assert(!X.chosen().includes(key.id),'おまかせ skips it');X.choose([]);d.querySelector('#dispatchPresets').click();d.querySelector('#labWinActions [data-preset=load0]').click();assert(!X.chosen().includes(key.id),'presets skip it');
 X.choose([key.id]);const day=L.day(),r=await X.start({watch:false});assert.equal(r,null,'the start refuses it');assert.equal(L.day(),day);assert(d.querySelector('#dispatchSummary').textContent.includes('出撃できません'));
 X.choose([]);assert(d.querySelector('[data-pick="'+key.id+'"]').disabled,'manual add refused');}
console.log('PASS: prototype fixes — settled autosave, result flags per outcome, boarding after fusion, condition costs (items, sortie), squad refresh and wrecked checks, PRO・D sortie checks');
