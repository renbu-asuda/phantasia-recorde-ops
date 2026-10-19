import fs from 'node:fs';import path from 'node:path';import assert from 'node:assert/strict';import {Window} from 'happy-dom';
// Test save (owned units, credits) and the T&D maker draft as a data source, each checked across a page reload.
const file='game/prototypes/tactical_hub.html',html=fs.readFileSync(file,'utf8');
function open(store){const w=new Window({url:'http://localhost/'+file,settings:{enableJavaScriptEvaluation:true,disableJavaScriptFileLoading:true,disableCSSFileLoading:true,suppressInsecureJavaScriptEnvironmentWarning:true}});w.scrollTo=()=>{};
 for(const [k,v] of Object.entries(store))w.localStorage.setItem(k,v);w.document.write(html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/g,''));
 for(const dl of w.document.querySelectorAll('dialog')){dl.showModal=()=>dl.setAttribute('open','');dl.close=()=>{dl.removeAttribute('open');dl.dispatchEvent(new w.Event('close'));};}
 for(const m of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/g)){const src=/src=["']([^"']+)["']/.exec(m[1]);w.eval(src?fs.readFileSync(path.resolve(path.dirname(file),src[1]),'utf8'):m[2]);}return w;}
const dump=w=>Object.fromEntries(Object.keys(w.localStorage).map(k=>[k,w.localStorage.getItem(k)]));
const draft={format:'PRO_TD_PACK',version:1,packId:'td-test',name:'テストパック',
 units:[{id:'td-u-a',name:'試作機A',size:'M',move:5,movementAptitude:{ground:'B',air:'none',water:'none',underwater:'none',space:'none'},hp:2000,atk:200,def:100,mob:200,acc:400,weaponIds:['td-w-1'],skillIds:[],deploy:{player:true},catalog:'メーカーで作った試作機。'},
  {id:'td-u-b',name:'試作機B',size:'L',move:4,movementAptitude:{ground:'B',air:'none',water:'none',underwater:'none',space:'none'},hp:2600,atk:260,def:150,mob:180,acc:420,weaponIds:['td-w-1','missing'],skillIds:[],deploy:{player:false}},
  {id:'td-u-a2',name:'試作機A改',base:'td-u-a',separate:false,hp:2400,deploy:{}}],
 weapons:[{id:'td-w-1',name:'試作ライフル',minRange:1,maxRange:3}],skills:[],evolutions:[{id:'td-e-1',from:'td-u-a',to:'td-u-b',conds:{mode:'all',list:[{type:'credits_use',value:1000}]}}],fusions:[{id:'td-f-bad',materials:[{unitId:'td-u-a'},{unitId:'nope'}],result:{type:'unit',unitId:'td-u-b'}}],
 missions:[],items:[],flags:[],terrains:[],research:[],hires:[]};
// 1) Built-in source: an evolution is saved and restored after reload.
let w=open({});let L=w.PROUnitLab,D=w.PROTacticalData;assert.equal(D.source,'builtin');w.location.hash='#evolve';L.renderEvolve();const t=()=>w.document.querySelector('#evolveGrid [data-unit=tank]');t().click();t().click();w.document.querySelector('#labWinActions [data-lab=evo-tank]').click();w.document.querySelector('#labWinActions [data-lab=run]').click();
assert.equal(L.credits(),21800);let saved=dump(w);assert(JSON.parse(saved.PRO_TACTICAL_HQ).owned.some(o=>o.id==='tank2'));w.close();
w=open(saved);assert.equal(w.PROUnitLab.credits(),21800);assert(w.PROUnitLab.owned().some(u=>u.id==='tank2'));assert.equal(w.document.querySelector('#hubCredits').textContent,'21,800');
// The formation list reads the restored units.
assert(w.document.querySelector('#prepUnitList [data-unit=tank2]'));
// Records menu: resetting the test save restores the starting units and credits.
w.document.querySelector('#resetSave').click();w.document.querySelector('#labWinActions [data-lab=run]').click();assert.equal(w.PROUnitLab.credits(),24800);assert(!w.PROUnitLab.owned().some(u=>u.id==='tank2'));assert(!JSON.parse(w.localStorage.getItem('PRO_TACTICAL_HQ')).owned.some(o=>o.id==='tank2'));w.close();
// Levels: PRO rules (100×Lv to next, growth per level), EXP from a won mission, Lv5 unlocks the scout evolution.
{const C=w.PROCore;assert.deepEqual({...C.gainExp({lv:1,exp:0},250)},{lv:2,exp:150,sp:1,ups:1});assert.equal(C.gainExp({lv:2,exp:0,sp:3},700).sp,5);
 assert.equal(C.defeatExp({exp:40}),40);assert.equal(C.defeatExp({hp:1500,atk:200}),15);assert.equal(C.battleExp(100,{win:true,alive:true,kills:15}),115);assert.equal(C.battleExp(100,{win:false,alive:false}),25);assert.equal(C.gainExp({lv:1,exp:0},1000).lv,5);assert.equal(C.gainExp({lv:49,exp:0},99999).lv,50);assert.equal(C.gainExp({lv:49,exp:0},99999).exp,0);
 const u={hp:1000,atk:100,def:100,mob:100,acc:100};assert.equal(C.levelStats(u,3).hp,1080);assert.equal(C.levelStats({...u,growth:{hp:50}},3).hp,1100);assert.equal(C.levelStats(u,3).level,3);}
w=open(dump(w));{const L=w.PROUnitLab,F=w.PROField;const sc=()=>L.owned().find(u=>u.uid==='scout');assert.equal(sc().level,1);const hp1=sc().hp;
 F.deploy({missionId:'training-01',groups:[{id:'g1',name:'第1部隊',faction:'player',mode:'auto',members:[{uid:'scout',unit:sc()}]}]});const st=F._live();st.groups=st.groups.filter(g=>g.faction==='player');st.outcome='victory';F.showResult();
 assert(w.document.querySelector('#fieldResultBody').textContent.includes('+60 EXP ｜ Lv1'));assert.equal(sc().exp,60);L.gainExp([{key:'scout',amount:1000}]);assert.equal(sc().sp,4);assert.equal(sc().level,5);assert(sc().hp>hp1);
 L.renderEvolve();const g=w.document.querySelector('#evolveGrid [data-unit=scout]');g.click();g.click();assert(!w.document.querySelector('#labWinActions [data-lab=evo-scout]').disabled);w.document.querySelector('#labWinActions [data-lab=evo-scout]').click();w.document.querySelector('#labWinActions [data-lab=run]').click();assert.equal(sc().id,'scout2');assert.equal(sc().level,5);
 F.showUnit(sc());assert(w.document.querySelector('#fieldUnitBody').textContent.includes('Lv5'));saved=dump(w);w.close();w=open(saved);assert.equal(w.PROUnitLab.owned().find(u=>u.uid==='scout').level,5);assert.equal(w.PROUnitLab.owned().find(u=>u.uid==='scout').id,'scout2');}
w.close();
// Evolution / fusion settings: register or not, carry level or not, register-only fusion.
w=open({});{const L=w.PROUnitLab,d=w.document,two=(g,id)=>{const t=d.querySelector('#'+g+' [data-unit='+id+']');t.click();t.click();},run=()=>d.querySelector('#labWinActions [data-lab=run]').click(),closeW=()=>[...d.querySelectorAll('#labWinActions button')].find(b=>b.textContent==='閉じる').click();
 L.gainExp([{key:'tank',amount:300}]);L.renderEvolve();two('evolveGrid','tank');d.querySelector('#labWinActions [data-lab=evo-tank]').click();assert(d.querySelector('#labWinBody').textContent.includes('引き継ぐ'));run();closeW();const t2=L.owned().find(u=>u.uid==='tank');assert.equal(t2.id,'tank2');assert.equal(t2.level,3);assert.deepEqual([...L.registered()],['tank2']);assert(w.PROUnitsSeen.how('tank2').registered);
 L.renderFusion();two('fusionGrid','scout');d.querySelector('#fusionGrid [data-unit=tank2]');assert(d.querySelector('#fusionStep').textContent.includes('偵察車'));
 // tank was evolved away, so the register-only recipe (scout + tank) is no longer possible; reset and try it with fresh units.
 L.reset();L.renderFusion();two('fusionGrid','scout');d.querySelector('#fusionGrid [data-unit=tank]').click();assert(d.querySelector('#labWinBody').textContent.includes('生産・雇用リストに エース偵察車'));assert(d.querySelector('#labWinBody').textContent.includes('ユニットは増えません'));run();closeW();assert.equal(L.owned().length,12);assert(L.registered().includes('scout_ace'));assert.equal(L.credits(),22800);
 L.gainExp([{key:'robot',amount:1000}]);L.renderFusion();two('fusionGrid','robot');d.querySelector('#fusionGrid [data-unit=fighter]').click();run();closeW();const cm=L.owned().find(u=>u.id==='commander');assert.equal(cm.level,5);assert(!L.registered().includes('commander'));
 L.renderFusion();two('fusionGrid','infantry');d.querySelector('#fusionGrid [data-unit=medic]').click();run();closeW();assert.equal(L.owned().find(u=>u.id==='ranger').level,1);assert(L.registered().includes('ranger'));
 // PRO・D EXP: kept per unit id in the same test save.
 const got=L.gainDispatchExp([{key:'core-u-jackal',amount:250}],{'core-u-jackal':'ジャッカル'});assert.equal(got[0].lv,2);assert.equal(L.dispatchLevel('core-u-jackal').lv,2);saved=dump(w);}
w.close();w=open(saved);assert.equal(w.PROUnitLab.dispatchLevel('core-u-jackal').exp,150);assert(w.PROUnitLab.registered().includes('ranger'));w.location.hash='#facility';w.dispatchEvent(new w.Event('hashchange'));await new Promise(r=>setTimeout(r,50));assert(w.document.querySelector('#facilityRegistered').textContent.includes('特殊歩兵'));w.close();
// Production / hire: entries with cost, limit, required missions, hidden conditions and registered units.
w=open({});{const L=w.PROUnitLab,d=w.document,tile=id=>d.querySelector('#productionGrid [data-uid="'+id+'"]'),two=id=>{tile(id).click();tile(id).click();},body=()=>d.querySelector('#labWinBody').textContent,run=()=>d.querySelector('#labWinActions [data-lab=run]'),closeW=()=>[...d.querySelectorAll('#labWinActions button')].find(b=>b.textContent==='閉じる').click();
 L.renderProduction();assert(tile('hire-infantry'));assert(!tile('hire-marine'));assert(tile('hire-tank').classList.contains('blocked'));assert(tile('hire-tank').getAttribute('aria-label').includes('機動訓練'));assert(tile('hire-scout').textContent.includes('1,500Cr'));
 two('hire-infantry');assert(body().includes('費用 800 Cr'));run().click();closeW();assert.equal(L.credits(),24000);assert.equal(L.owned().filter(u=>u.id==='infantry').length,2);
 for(let i=0;i<3;i++){two('hire-scout');run().click();closeW();}two('hire-scout');assert(run().disabled);assert(body().includes('上限'));closeW();
 L.markCleared('training-01');L.renderProduction();assert(!tile('hire-tank').classList.contains('blocked'));
 // Hidden until its condition holds (own 2 patrol boats).
 L.register('boat');L.renderProduction();two('reg-boat');assert(body().includes('生産・雇用リスト'));run().click();closeW();L.renderProduction();assert(tile('hire-marine'));
 saved=dump(w);}
w.close();w=open(saved);assert.equal(w.PROUnitLab.cleared()[0],'training-01');assert.equal(w.PROUnitLab.owned().filter(u=>u.id==='scout').length,4);w.close();
// 2) Maker source: draft units, evolutions and variants join the built-in data; invalid links are dropped.
w=open({...saved,PRO_TACTICAL_SOURCE:'maker',PRO_TD_MAKER_DRAFT:JSON.stringify(draft)});D=w.PROTacticalData;L=w.PROUnitLab;
assert.equal(D.source,'maker');assert.equal(D.makerName,'テストパック');assert(D.roster().some(u=>u.id==='td-u-a'));assert(!D.roster().some(u=>u.id==='td-u-b'));assert(D.roster().some(u=>u.id==='infantry'));
assert.equal(D.unit('td-u-a').weapons[0].name,'試作ライフル');assert.equal(D.unit('td-u-b').weapons.length,1);assert.equal(D.unit('td-u-a2').hp,2400);assert.equal(D.catalogId('td-u-a2'),'td-u-a');assert.equal(D.unit('td-u-a').catalog,'メーカーで作った試作機。');
assert(D.evolutions().some(e=>e.id==='td-e-1'));assert(!D.fusions().some(f=>f.id==='td-f-bad'));
// The built-in save is not used for the maker source: owned units start from the merged roster.
assert.equal(L.credits(),24800);assert(L.owned().some(u=>u.id==='tank'));assert(L.owned().some(u=>u.id==='td-u-a'));
assert(w.document.querySelector('#dataSourceText').textContent.includes('テストパック'));w.close();
// 3) Maker source selected but no draft: falls back to the built-in data.
w=open({PRO_TACTICAL_SOURCE:'maker'});assert.equal(w.PROTacticalData.source,'builtin');w.close();
console.log('PASS: test save (owned units, credits, levels) across reload, level and EXP rules, mission EXP, level-gated evolution, register / carry settings, register-only fusion, PRO・D EXP, production / hire (cost, limit, missions, hidden conditions, registered units), maker draft as data source');
