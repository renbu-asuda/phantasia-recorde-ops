import fs from 'node:fs';import path from 'node:path';import assert from 'node:assert/strict';import {Window} from 'happy-dom';
// Built-in sample pack IDs (old name → current ID).
const SID=JSON.parse(fs.readFileSync('tests/sample-ids.json','utf8')),SX=x=>SID[x]||x;
// Test save (owned units, credits) and the T&D maker draft as a data source, each checked across a page reload.
const file='game/prototypes/tactical_hub.html',html=fs.readFileSync(file,'utf8');
function open(store){const w=new Window({url:'http://localhost/'+file,settings:{enableJavaScriptEvaluation:true,disableJavaScriptFileLoading:true,disableCSSFileLoading:true,suppressInsecureJavaScriptEnvironmentWarning:true}});w.scrollTo=()=>{};
 // Tests run on the built-in sample pack unless a source is given (the game itself starts empty).
 if(!('PRO_TACTICAL_SOURCE' in store)&&!('PRO_TACTICAL_LOAD' in store))w.localStorage.setItem('PRO_TACTICAL_SOURCE','sample');for(const [k,v] of Object.entries(store))w.localStorage.setItem(k,v);w.document.write(html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/g,''));
 for(const dl of w.document.querySelectorAll('dialog')){dl.showModal=()=>dl.setAttribute('open','');dl.close=()=>{dl.removeAttribute('open');dl.dispatchEvent(new w.Event('close'));};}
 for(const m of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/g)){const src=/src=["']([^"']+)["']/.exec(m[1]);w.eval(src?fs.readFileSync(path.resolve(path.dirname(file),src[1]),'utf8'):m[2]);}return w;}
const dump=w=>Object.fromEntries(Object.keys(w.localStorage).map(k=>[k,w.localStorage.getItem(k)]));
// The test draft builds on the built-in sample pack (dependency 'sample').
const draft={format:'PRO_TD_PACK',version:1,packId:'td-test',name:'テストパック',dependencies:['sample'],
 units:[{id:'td-u-a',name:'試作機A',size:'M',move:5,movementAptitude:{ground:'B',air:'none',water:'none',underwater:'none',space:'none'},hp:2000,atk:200,def:100,mob:200,acc:400,weaponIds:['td-w-1'],skillIds:[],deploy:{player:true},catalog:'メーカーで作った試作機。'},
  {id:'td-u-b',name:'試作機B',size:'L',move:4,movementAptitude:{ground:'B',air:'none',water:'none',underwater:'none',space:'none'},hp:2600,atk:260,def:150,mob:180,acc:420,weaponIds:['td-w-1','missing'],skillIds:[],deploy:{player:false}},
  {id:'td-u-a2',name:'試作機A改',base:'td-u-a',separate:false,hp:2400,deploy:{}}],
 weapons:[{id:'td-w-1',name:'試作ライフル',minRange:1,maxRange:3}], terrains:[{id:'td-t-swamp',name:'湿地',meleeHitPt:-10,blockTags:['車両'],tactical:{kind:'water',costs:{ground:3,air:1}}},{id:'td-t-yard',name:'工廠',tactical:{kind:'facility',costs:{ground:1,air:1},facility:{durability:20,functions:{produce:{list:[{unitId:'td-u-b',cost:300}],owned:true,hire:true},gate:{},exit:{}}}}},{id:'td-t-fort',name:'砦',tactical:{kind:'facility',costs:{ground:1,air:1},facility:{durability:10,functions:{income:{amount:700},reward:{credits:500,items:{[SX('fieldkit')]:1},flag:'took'}}}}},{id:'td-t-dispatch',name:'ディスパッチだけ'}],skills:[],evolutions:[{id:'td-e-1',from:'td-u-a',to:'td-u-b',conds:{mode:'all',list:[{type:'credits_use',value:1000}]}}],fusions:[{id:'td-f-bad',materials:[{unitId:'td-u-a'},{unitId:'nope'}],result:{type:'unit',unitId:'td-u-b'}}],
 missions:[],items:[],flags:[],research:[],hires:[]};
// 1) Built-in source: an evolution is saved and restored after reload.
let w=open({});let L=w.PROUnitLab,D=w.PROTacticalData;assert.equal(D.source,'sample');w.location.hash='#evolve';L.renderEvolve();const t=()=>w.document.querySelector(('#evolveGrid [data-unit='+SX('tank')+']'));t().click();t().click();w.document.querySelector(('#labWinActions [data-lab='+SX('evo-tank')+']')).click();w.document.querySelector('#labWinActions [data-lab=run]').click();
assert.equal(L.credits(),21800);let saved=dump(w);assert(JSON.parse(saved.PRO_TACTICAL_HQ).owned.some(o=>o.id===(SX('tank2'))));w.close();
w=open(saved);assert.equal(w.PROUnitLab.credits(),21800);assert(w.PROUnitLab.owned().some(u=>u.id===(SX('tank2'))));assert.equal(w.document.querySelector('#hubCredits').textContent,'21,800');
// The formation list reads the restored units.
assert(w.document.querySelector(('#prepUnitList [data-unit='+SX('tank2')+']')));
// Records menu: resetting the test save restores the starting units and credits.
w.document.querySelector('#resetSave').click();w.document.querySelector('#labWinActions [data-lab=run]').click();assert.equal(w.PROUnitLab.credits(),24800);assert(!w.PROUnitLab.owned().some(u=>u.id===(SX('tank2'))));assert(!JSON.parse(w.localStorage.getItem('PRO_TACTICAL_HQ')).owned.some(o=>o.id===(SX('tank2'))));w.close();
// Levels: PRO rules (100×Lv to next, growth per level), EXP from a won mission, Lv5 unlocks the scout evolution.
{const C=w.PROCore;assert.deepEqual({...C.gainExp({lv:1,exp:0},250)},{lv:2,exp:150,sp:1,ups:1});assert.equal(C.gainExp({lv:2,exp:0,sp:3},700).sp,5);
 assert.equal(C.defeatExp({exp:40}),40);assert.equal(C.defeatExp({hp:1500,atk:200}),15);assert.equal(C.battleExp(100,{win:true,alive:true,kills:15}),115);assert.equal(C.battleExp(100,{win:false,alive:false}),25);assert.equal(C.gainExp({lv:1,exp:0},1000).lv,5);assert.equal(C.gainExp({lv:49,exp:0},99999).lv,50);assert.equal(C.gainExp({lv:49,exp:0},99999).exp,0);
 const u={hp:1000,atk:100,def:100,mob:100,acc:100};assert.equal(C.levelStats(u,3).hp,1080);assert.equal(C.levelStats({...u,growth:{hp:50}},3).hp,1100);assert.equal(C.levelStats(u,3).level,3);}
w=open(dump(w));{const L=w.PROUnitLab,F=w.PROField;const sc=()=>L.owned().find(u=>u.uid===(SX('scout')));assert.equal(sc().level,1);const hp1=sc().hp;
 F.deploy({missionId:(SX('training-01')),groups:[{id:'g1',name:'第1部隊',faction:'player',mode:'auto',members:[{uid:(SX('scout')),unit:sc()}]}]});const st=F._live();st.groups=st.groups.filter(g=>g.faction==='player');st.outcome='victory';F.showResult();
 assert(w.document.querySelector('#fieldResultBody').textContent.includes('+60 EXP ｜ Lv1'));assert.equal(sc().exp,60);L.gainExp([{key:(SX('scout')),amount:1000}]);assert.equal(sc().sp,4);assert.equal(sc().level,5);assert(sc().hp>hp1);
 L.renderEvolve();const g=w.document.querySelector(('#evolveGrid [data-unit='+SX('scout')+']'));g.click();g.click();assert(!w.document.querySelector(('#labWinActions [data-lab='+SX('evo-scout')+']')).disabled);w.document.querySelector(('#labWinActions [data-lab='+SX('evo-scout')+']')).click();w.document.querySelector('#labWinActions [data-lab=run]').click();assert.equal(sc().id,(SX('scout2')));assert.equal(sc().level,5);
 F.showUnit(sc());assert(w.document.querySelector('#fieldUnitBody').textContent.includes('Lv5'));saved=dump(w);w.close();w=open(saved);assert.equal(w.PROUnitLab.owned().find(u=>u.uid===(SX('scout'))).level,5);assert.equal(w.PROUnitLab.owned().find(u=>u.uid===(SX('scout'))).id,(SX('scout2')));}
w.close();
// Evolution / fusion settings: register or not, carry level or not, register-only fusion.
w=open({});{const L=w.PROUnitLab,d=w.document,two=(g,id)=>{const t=d.querySelector('#'+g+' [data-unit='+id+']');t.click();t.click();},run=()=>d.querySelector('#labWinActions [data-lab=run]').click(),closeW=()=>[...d.querySelectorAll('#labWinActions button')].find(b=>b.textContent==='閉じる').click();
 L.gainExp([{key:(SX('tank')),amount:300}]);L.renderEvolve();two('evolveGrid',(SX('tank')));d.querySelector(('#labWinActions [data-lab='+SX('evo-tank')+']')).click();assert(d.querySelector('#labWinBody').textContent.includes('引き継ぐ'));run();closeW();const t2=L.owned().find(u=>u.uid===(SX('tank')));assert.equal(t2.id,(SX('tank2')));assert.equal(t2.level,3);assert.deepEqual([...L.registered()],[(SX('tank2'))]);assert(w.PROUnitsSeen.how((SX('tank2'))).registered);
 L.renderFusion();two('fusionGrid',(SX('scout')));d.querySelector(('#fusionGrid [data-unit='+SX('tank2')+']'));assert(d.querySelector('#fusionStep').textContent.includes('偵察車'));
 // tank was evolved away, so the register-only recipe (scout + tank) is no longer possible; reset and try it with fresh units.
 L.reset();L.renderFusion();two('fusionGrid',(SX('scout')));d.querySelector(('#fusionGrid [data-unit='+SX('tank')+']')).click();assert(d.querySelector('#labWinBody').textContent.includes('生産・雇用リストに エース偵察車'));assert(d.querySelector('#labWinBody').textContent.includes('ユニットは増えません'));run();closeW();assert.equal(L.owned().length,12);assert(L.registered().includes((SX('scout_ace'))));assert.equal(L.credits(),22800);
 L.gainExp([{key:(SX('robot')),amount:1000}]);L.renderFusion();two('fusionGrid',(SX('robot')));d.querySelector(('#fusionGrid [data-unit='+SX('fighter')+']')).click();run();closeW();const cm=L.owned().find(u=>u.id===(SX('commander')));assert.equal(cm.level,5);assert(!L.registered().includes((SX('commander'))));
 L.renderFusion();two('fusionGrid',(SX('infantry')));d.querySelector(('#fusionGrid [data-unit='+SX('medic')+']')).click();run();closeW();assert.equal(L.owned().find(u=>u.id===(SX('ranger'))).level,1);assert(L.registered().includes((SX('ranger'))));
 // PRO・D EXP: kept per unit id in the same test save.
 const got=L.gainDispatchExp([{key:'core-u-jackal',amount:250}],{'core-u-jackal':'ジャッカル'});assert.equal(got[0].lv,2);assert.equal(L.dispatchLevel('core-u-jackal').lv,2);saved=dump(w);}
w.close();w=open(saved);assert.equal(w.PROUnitLab.dispatchLevel('core-u-jackal').exp,150);assert(w.PROUnitLab.registered().includes((SX('ranger'))));w.PROUnitLab.renderProduction();assert(w.document.querySelector('#productionGrid [data-uid="'+'reg-'+SX('ranger')+'"]'));w.location.hash='#facility';w.dispatchEvent(new w.Event('hashchange'));await new Promise(r=>setTimeout(r,50));assert(!w.document.querySelector('#facilityRegistered'));assert(w.document.querySelector('#facilityResearch'));w.close();
// Production / hire: entries with cost, limit, required missions, hidden conditions and registered units.
w=open({});{const L=w.PROUnitLab,d=w.document,tile=id=>d.querySelector('#productionGrid [data-uid="'+id+'"]'),two=id=>{tile(id).click();tile(id).click();},body=()=>d.querySelector('#labWinBody').textContent,run=()=>d.querySelector('#labWinActions [data-lab=run]'),closeW=()=>[...d.querySelectorAll('#labWinActions button')].find(b=>b.textContent==='閉じる').click();
 L.renderProduction();assert(tile((SX('hire-infantry'))));assert(!tile((SX('hire-marine'))));assert(tile((SX('hire-tank'))).classList.contains('blocked'));assert(tile((SX('hire-tank'))).getAttribute('aria-label').includes('機動訓練'));assert(tile((SX('hire-scout'))).textContent.includes('1,500Cr'));
 two((SX('hire-infantry')));assert(body().includes('費用 800 Cr'));run().click();closeW();assert.equal(L.credits(),24000);assert.equal(L.owned().filter(u=>u.id===(SX('infantry'))).length,2);
 for(let i=0;i<3;i++){two((SX('hire-scout')));run().click();closeW();}two((SX('hire-scout')));assert(run().disabled);assert(body().includes('上限'));closeW();
 L.markCleared((SX('training-01')));L.renderProduction();assert(!tile((SX('hire-tank'))).classList.contains('blocked'));
 // Hidden until its condition holds (own 2 patrol boats).
 L.register((SX('boat')));L.renderProduction();two(''+'reg-'+SX('boat')+'');assert(body().includes('生産・雇用リスト'));run().click();closeW();L.renderProduction();assert(tile((SX('hire-marine'))));L.register((SX('scout_ace')));L.renderProduction();assert(tile(''+'reg-'+SX('scout_ace')+'').textContent.includes('4,200Cr'));two(''+'reg-'+SX('scout_ace')+'');assert.equal(run().textContent,'生産する');assert(body().includes('Lv1'));closeW();two((SX('hire-infantry')));assert.equal(run().textContent,'雇用する');closeW();
 saved=dump(w);}
w.close();w=open(saved);assert.equal(w.PROUnitLab.cleared()[0],(SX('training-01')));assert.equal(w.PROUnitLab.owned().filter(u=>u.id===(SX('scout'))).length,4);w.close();
// Research: credits at start, items reserved until completion, days advance with missions, cancel refunds.
w=open({});{const L=w.PROUnitLab,d=w.document,btn=id=>d.querySelector('#researchList [data-research="'+id+'"]'),act=k=>d.querySelector('#labWinActions [data-lab='+k+']'),closeW=()=>[...d.querySelectorAll('#labWinActions button')].find(b=>b.textContent==='閉じる').click();
 L.renderResearch();assert(btn((SX('r-ace'))).className.includes('blocked'));assert(btn((SX('r-ace'))).textContent.includes('装甲改良'));assert.equal(L.items()[SX('parts')],5);
 btn((SX('r-armor'))).click();assert(d.querySelector('#labWinBody').textContent.includes('完了時に消費'));act('run').click();closeW();assert.equal(L.credits(),22800);assert.equal(L.active().until,3);assert.equal(L.items()[SX('parts')],5);
 assert(d.querySelector('#researchReserved').textContent.includes('機械部品×3'));assert(btn((SX('r-data'))).className.includes('blocked'));
 // Reserved parts can't be used by a condition that consumes them.
 assert(!w.PROCore.evalConds({mode:'all',list:[{type:'item_use',itemId:(SX('parts')),count:3}]},{items:L.items(),reserved:{items:L.active().reserve}}).ok);
 // Cancel → refund and release; start again.
 btn((SX('r-armor'))).click();act('stop').click();act('cancel').click();closeW();assert.equal(L.credits(),24800);assert.equal(L.active(),null);
 btn((SX('r-armor'))).click();act('run').click();closeW();assert.deepEqual([...L.advanceDay()],[]);d.querySelector('#researchDayTest').click();assert(d.querySelector('#noticeText').textContent.includes('装甲改良 が完了'));d.querySelector('#closeNotice').click();
 assert.equal(L.items()[SX('parts')],2);assert(L.done().includes((SX('r-armor'))));assert(L.registered().includes((SX('tank2'))));assert.equal(L.day(),3);
 // Missions advance the day: a Dispatch-free check through the Tactical result screen.
 btn((SX('r-data'))).click();act('run').click();closeW();const F=w.PROField;F.deploy({missionId:(SX('training-01')),groups:[{id:'g1',name:'第1部隊',faction:'player',mode:'auto',members:[{uid:(SX('infantry')),unit:L.owned().find(u=>u.uid===(SX('infantry')))}]}]});const st=F._live();st.groups=st.groups.filter(g=>g.faction==='player');st.outcome='victory';F.showResult();
 assert(d.querySelector('#fieldResultBody').textContent.includes('戦闘記録の解析 が完了'));assert.equal(L.items()[SX('data')],2);
 L.renderResearch();assert(!btn((SX('r-ace'))).className.includes('blocked'),btn((SX('r-ace'))).textContent);btn((SX('r-ace'))).click();act('run').click();closeW();L.advanceDay(3);assert(L.owned().some(u=>u.id===(SX('scout_ace'))));assert.equal(L.items()[SX('alloy')],0);assert.equal(L.items()[SX('data')],1);saved=dump(w);}
w.close();w=open(saved);assert.equal(w.PROUnitLab.day(),7);assert.equal(w.PROUnitLab.done().length,3);w.close();
// Shop / storage: gated listing (mission, research), buy, sell at half, key items and reserved items not sellable.
w=open({});{const L=w.PROUnitLab,d=w.document,row=(box,id)=>d.querySelector('#'+box+' [data-item="'+id+'"]'),act=k=>d.querySelector('#labWinActions [data-lab='+k+']'),closeW=()=>[...d.querySelectorAll('#labWinActions button')].find(b=>b.textContent==='閉じる').click();
 L.renderShop();assert(row('shopList',(SX('parts'))));assert(!row('shopList',(SX('alloy'))));assert(!row('shopList',(SX('repair'))));assert(!row('shopList',(SX('data'))));assert(d.querySelector('#shopSoon').textContent.includes('装甲改良'));
 row('shopList',(SX('parts'))).click();act('buy5').click();assert.equal(L.items()[SX('parts')],10);assert.equal(L.credits(),22800);act('sell1').click();assert.equal(L.items()[SX('parts')],9);assert.equal(L.credits(),23000);closeW();
 L.markCleared((SX('training-01')));L.renderShop();assert(row('shopList',(SX('repair'))));
 L.startResearch((SX('r-armor')));row('shopList',(SX('parts'))).click();for(let i=0;i<6;i++)act('sell1').click();assert.equal(L.items()[SX('parts')],3);assert(act('sell1').disabled);closeW();
 L.advanceDay(2);L.renderShop();assert(row('shopList',(SX('alloy'))));
 L.renderStorage();assert(row('storageList',(SX('pass'))).textContent.includes('★'));row('storageList',(SX('pass'))).click();assert(d.querySelector('#labWinBody').textContent.includes('大切なもの'));closeW();assert(!L.sell((SX('pass'))));assert(!row('storageList',(SX('parts'))));
 assert(d.querySelector('#storageCount').textContent.includes('種類'));saved=dump(w);}
w.close();w=open(saved);assert.equal(w.PROUnitLab.items()[SX('pass')],1);w.close();
// Item use and equipment: permanent boosts with a per-unit limit, EXP items, base-only effects, equip slots and stats.
w=open({});{const L=w.PROUnitLab,d=w.document,u=id=>L.owned().find(x=>x.uid===id),act=k=>d.querySelector('#labWinActions [data-lab='+k+']'),closeW=()=>[...d.querySelectorAll('#labWinActions button')].find(b=>['閉じる','戻る'].includes(b.textContent)).click();
 const atk0=u((SX('tank'))).atk;assert.deepEqual([...L.useItem((SX('chip')),(SX('tank')))],['ATK+20']);assert.equal(u((SX('tank'))).atk,atk0+20);assert.equal(L.items()[SX('chip')],1);
 assert.equal(typeof L.useItem((SX('chip'))),'string');assert(L.useItem((SX('repair')),(SX('tank'))).includes('ない')||L.useItem((SX('repair')),(SX('tank'))).includes('作戦中'));
 L.useItem((SX('manual')),(SX('tank')));assert.equal(u((SX('tank'))).level,3);assert.equal(u((SX('tank'))).exp,0);
 // Storage → 使う → unit grid (two taps) → confirm.
 L.renderStorage();d.querySelector(('#storageList [data-item='+SX('chip')+']')).click();act('use').click();assert.equal(w.location.hash,'#useitem');L.renderUse();const t=d.querySelector(('#useGrid [data-uid='+SX('scout')+']'));t.click();d.querySelector(('#useGrid [data-uid='+SX('scout')+']')).click();act('run').click();assert(d.querySelector('#labWinBody').textContent.includes('ATK+20'));closeW();assert.equal(L.items()[SX('chip')]||0,0);
 // limitPerUnit 3: buy more and use until blocked.
 for(let i=0;i<4;i++)L.buy((SX('chip')));for(let i=0;i<2;i++)L.useItem((SX('chip')),(SX('scout')));assert(L.useItem((SX('chip')),(SX('scout'))).includes('3回まで'));
 // Equipment: stats and weapons; equipped copies can't be sold or equipped twice.
 const acc0=u((SX('robot'))).acc;assert(L.equip((SX('robot')),0,(SX('scope'))));assert.equal(u((SX('robot'))).acc,acc0+60);assert(!L.equip((SX('fighter')),0,(SX('scope'))));assert.equal(L.free((SX('scope'))),0);assert(!L.sell((SX('scope'))));
 const mob0=u((SX('robot'))).mob,def0=u((SX('robot'))).def;assert(L.equip((SX('robot')),1,(SX('plate'))));assert.equal(u((SX('robot'))).mob,mob0-20);assert.equal(u((SX('robot'))).def,def0+80);L.buy((SX('launcher')));assert(!L.equip((SX('robot')),2,(SX('launcher'))));L.equip((SX('robot')),1,(SX('launcher')));assert(u((SX('robot'))).weapons.some(x=>x.name==='ミサイル'));assert.equal(L.free((SX('plate'))),1);
 // Equipment screen: two taps, slot → item list → unequip.
 L.renderEquip();const e=d.querySelector(('#equipGrid [data-uid='+SX('robot')+']'));e.click();d.querySelector(('#equipGrid [data-uid='+SX('robot')+']')).click();assert(act('slot0').textContent.includes('精密照準器'));act('slot0').click();act('unequip').click();assert.equal(u((SX('robot'))).equip[0],null);assert.equal(L.free((SX('scope'))),1);closeW();
 // Formation and battle use the boosted, equipped unit.
 assert(d.querySelector(('#prepUnitList [data-unit='+SX('tank')+']')));saved=dump(w);}
w.close();w=open(saved);{const u=w.PROUnitLab.owned().find(x=>x.uid===(SX('robot')));assert(u.weapons.some(x=>x.name==='ミサイル'));assert.equal(w.PROUnitLab.owned().find(x=>x.uid===(SX('tank'))).level,3);}w.close();
// Missions: lock / hidden, rewards received on a Tactical victory, stars and first-star bonus, record, recruits,
// PRO・D rewards and recruit-locked units, deploy rules.
w=open({});{const L=w.PROUnitLab,D=w.PROTacticalData,DD=w.PRODispatchData,d=w.document,F=w.PROField;
 assert.equal(L.missionLock(D.mission((SX('training-01')))),'');assert(L.missionLock(D.mission((SX('combat-01')))).includes('機動訓練'));assert(L.missionHidden(D.mission((SX('combat-02')))));
 w.location.hash='#missions';w.dispatchEvent(new w.Event('hashchange'));await new Promise(r=>setTimeout(r,400));assert(!d.querySelector('[aria-label="軌道上の遭遇"]'));d.querySelector('[aria-label="沿岸防衛線"]').click();assert(d.querySelector('#deploy').disabled);assert(!d.querySelector('#detailLock').hidden);
 const c0=L.credits();F.deploy({missionId:(SX('training-01')),groups:[{id:'g1',name:'第1部隊',faction:'player',mode:'auto',members:[{uid:(SX('infantry')),unit:L.owned().find(u=>u.uid===(SX('infantry')))}]}]});const st=F._live();st.groups=st.groups.filter(g=>g.faction==='player');st.outcome='victory';st.turn=4;F.showResult();
 const body=d.querySelector('#fieldResultBody').textContent;assert(body.includes('修理キット ×1'));assert(body.includes('★クリア'));assert(body.includes('★8ターン以内'));assert(body.includes('古参兵'));assert.equal(L.credits(),c0+800+3*160+500);assert(L.achieved()[(SX('ach-first'))]);assert.equal(L.items()[SX('repair')],1);
 assert.equal(JSON.stringify(L.record((SX('training-01')))),JSON.stringify({clears:1,best:4,stars:[true,true,true]}));assert(L.owned().some(u=>u.id===(SX('veteran'))));assert.equal(L.missionLock(D.mission((SX('combat-01')))),'');assert(L.missionHidden(D.mission((SX('combat-02')))));
 // A second clear pays no star bonus again.
 const r2=L.finishMission(D.mission((SX('training-01'))),{outcome:'win',turns:9,reward:800});assert.equal(r2.starCredits,0);assert.equal(L.record((SX('training-01'))).best,4);assert.equal(L.record((SX('training-01'))).clears,2);
 // Loss: 12% of the reward, no record.
 const r3=L.finishMission(D.mission((SX('combat-01'))),{outcome:'lose',turns:3,reward:2400});assert.equal(r3.credits,288);assert.equal(L.record((SX('combat-01'))).clears,0);
 // PRO・D: recruit-locked unit appears after its mission is cleared; drops and stars go to the save.
 const locked=Object.values(DD.defs).find(u=>u.recruit?.locked&&u.recruit.missionId);if(locked){const m=DD.mission(locked.recruit.missionId);const r=L.finishMission(m,{outcome:'win',turns:5,reward:m.reward,recruitPool:Object.values(DD.defs),itemName:DD.itemName});assert(r.recruits.includes(locked.name));assert(L.recruited().includes(locked.id));}
 // Deploy rules: minimum level.
 assert.equal(L.deployProblem({requires:{minLevel:3}},{tags:[]},2),'Lv3以上が必要');assert.equal(L.deployProblem({requires:{minLevel:3}},{tags:[]},3),'');saved=dump(w);}
w.close();w=open(saved);assert.equal(w.PROUnitLab.record((SX('training-01'))).clears,2);w.close();
// Sortie support: PRO・D auto lineup, win estimate, presets, supply; story choices with display conditions; Tactical presets and supply.
w=open({});{const L=w.PROUnitLab,DD=w.PRODispatchData,X=w.PRODispatch,d=w.document;const mid=DD.listing()[0].id;X.show(mid);
 X.auto();assert(X.chosen().length>0);assert(X.chosen().length<=DD.mission(mid).maxDeploy);await new Promise(r=>setTimeout(r,300));for(let i=0;i<50&&!/推定勝率 \d/.test(d.querySelector('#dispatchEstimate').textContent);i++)await new Promise(r=>setTimeout(r,50));assert(/推定勝率 \d+%/.test(d.querySelector('#dispatchEstimate').textContent),d.querySelector('#dispatchEstimate').textContent);
 const picked=X.chosen();d.querySelector('#dispatchPresets').click();d.querySelector('#labWinActions [data-preset=save1]').click();X.choose([]);d.querySelector('#dispatchPresets').click();d.querySelector('#labWinActions [data-preset=load1]').click();assert.deepEqual([...X.chosen()],[...picked]);
 // Supply: pick for the first unit; consumed when the sortie starts.
 d.querySelector('[data-supply="'+picked[0]+'"]').click();[...d.querySelectorAll('#labWinActions button')].find(b=>b.textContent.startsWith('戦闘糧食')).click();assert.equal(X.supply()[picked[0]],(SX('stim')));
 const p=X.start({watch:false});for(let i=0;i<100&&!d.querySelector('#fieldBattle').open&&!d.querySelector('#labWindow').open;i++){if(d.querySelector('#storyWindow').open)d.querySelector('#storySkip').click();await new Promise(r=>setTimeout(r,20));}
 if(d.querySelector('#labWindow').open)d.querySelector('#labWinActions [data-lab=choice0]')?.click();for(let i=0;i<200&&(!d.querySelector('#fieldBattle').open||d.querySelector('#fieldBattleClose').disabled);i++){if(d.querySelector('#storyWindow').open)d.querySelector('#storySkip').click();await new Promise(r=>setTimeout(r,20));}
 d.querySelector('#fieldBattleClose').click();let fin=false;p.then(()=>{fin=true;});for(let i=0;i<200&&!fin;i++){if(d.querySelector('#storyWindow').open)d.querySelector('#storySkip').click();await new Promise(r=>setTimeout(r,20));}await p;assert.equal(L.items()[SX('stim')],1);assert.equal(JSON.stringify(X.supply()),'{}');
 // Choices: a choice whose display condition fails is left out; the picked choice's flags are saved.
 L.setFlag('f-test',false);const cp=L.pickChoice('テスト',[{text:'A',flags:{a:true}},{text:'B',conds:{mode:'all',list:[{type:'flag',flagId:'f-test',on:true}]}}]);assert.equal(d.querySelectorAll('#labWinActions button').length,1);d.querySelector('#labWinActions [data-lab=choice0]').click();assert.equal((await cp).text,'A');assert.equal(L.flags().a,true);
 // Tactical presets and supply.
 const P=w.PROPreparation;w.location.hash='#prepare';w.dispatchEvent(new w.Event('hashchange'));await new Promise(r=>setTimeout(r,400));P.addUnit((SX('infantry')));P.addUnit((SX('scout')));d.querySelector('#prepPresets').click();[...d.querySelectorAll('#prepChoices button')].find(b=>b.textContent.startsWith('保存 2')).click();
 d.querySelector(('[data-uid='+SX('infantry')+'] [data-supply='+SX('infantry')+']')).click();[...d.querySelectorAll('#prepChoices button')].find(b=>b.textContent.startsWith('戦闘糧食')).click();const atk=L.owned().find(u=>u.uid===(SX('infantry'))).atk;d.querySelector('#prepConfirm').click();
 const dep=w.PROField._live().groups.find(g=>g.faction==='player').members.find(m=>m.uid===(SX('infantry')));assert.equal(dep.unit.atk,Math.round(atk*1.2));assert.equal(L.items()[SX('stim')]||0,0);
 assert.equal(L.getPreset('tactical',1).groups[0].members.length,2);}
w.close();
// Defeat: ordinary units are lost, key units (noFire, not hireable) are wrecked and can't sortie until repaired
// (expensive) or revived with an item; dismissal (解雇 / 解体) and its limits; PRO・D losses.
w=open({});{const L=w.PROUnitLab,d=w.document,F=w.PROField,u=id=>L.owned().find(x=>x.uid===id),act=k=>d.querySelector('#labWinActions [data-lab='+k+']'),closeW=()=>[...d.querySelectorAll('#labWinActions button')].find(b=>['閉じる','戻る'].includes(b.textContent)).click();
 L.equip((SX('robot')),0,(SX('scope')));F.deploy({missionId:(SX('training-01')),groups:[{id:'g1',name:'第1部隊',faction:'player',mode:'auto',members:[{uid:(SX('robot')),unit:u((SX('robot')))},{uid:(SX('scout')),unit:u((SX('scout')))},{uid:(SX('infantry')),unit:u((SX('infantry')))}]}]});const st=F._live();
 st.groups=st.groups.filter(g=>g.faction==='player').map(g=>({...g,members:g.members.filter(m=>m.uid===(SX('infantry')))}));st.outcome='victory';F.showResult();const body=d.querySelector('#fieldResultBody').textContent;
 assert(body.includes('撃破：偵察車失われた'));assert(body.includes('撃破：汎用機動兵器大破'));assert(!u((SX('scout'))));assert.equal(u((SX('robot'))).down,'wrecked');assert(L.isKey(w.PROTacticalData.unit((SX('robot')))));
 // Wrecked units can't be added to a formation.
 w.location.hash='#formation';w.dispatchEvent(new w.Event('hashchange'));await new Promise(r=>setTimeout(r,400));assert(d.querySelector(('#prepUnitList [data-unit='+SX('robot')+']')).classList.contains('blocked'));assert(d.querySelector(('#prepUnitList [data-unit='+SX('robot')+']')).getAttribute('aria-label').includes('大破'));
 // Repair screen: cost is high; credits or an item.
 const cost=L.repairCost(u((SX('robot'))));assert(cost>=6000,String(cost));L.renderCare();const t=d.querySelector(('#careGrid [data-uid='+SX('robot')+']'));t.click();d.querySelector(('#careGrid [data-uid='+SX('robot')+']')).click();assert(act('care').textContent.includes(cost.toLocaleString()));const c0=L.credits();act('care').click();closeW();assert.equal(L.credits(),c0-cost);assert.equal(u((SX('robot'))).down,null);
 L.handleLosses([(SX('robot'))]);L.buy((SX('revive')));L.renderCare();d.querySelector(('#careGrid [data-uid='+SX('robot')+']')).click();d.querySelector(('#careGrid [data-uid='+SX('robot')+']')).click();act(''+'item-'+SX('revive')+'').click();closeW();assert.equal(u((SX('robot'))).down,null);assert.equal(L.items()[SX('revive')]||0,0);
 // Dismissal: hire → 解雇, produce → 解体; key units can't be dismissed; equipment goes back.
 L.renderFire();assert(d.querySelector(('#fireGrid [data-uid='+SX('robot')+']')).classList.contains('blocked'));const f=d.querySelector(('#fireGrid [data-uid='+SX('tank')+']'));f.click();d.querySelector(('#fireGrid [data-uid='+SX('tank')+']')).click();assert(act('fire').textContent.includes('解体'));act('fire').click();closeW();assert(!u((SX('tank'))));
 assert(L.dismiss((SX('robot'))).includes('できません'));L.buy((SX('scope')));L.equip((SX('medic')),0,(SX('scope')));assert.equal(L.free((SX('scope'))),0);assert.equal(L.dismiss((SX('medic'))),'');assert.equal(L.free((SX('scope'))),1);
 // PRO・D: a lost unit leaves the sortie list; a noFire unit is badly injured / wrecked.
 const DD=w.PRODispatchData,key=Object.values(DD.defs).find(x=>x.noFire&&x.deploy?.player),plain=DD.players().find(x=>!x.noFire&&!x.recruit?.locked);const out=L.handleDispatchLosses([plain,...(key?[key]:[])]);assert.equal(out[0].result,'lost');assert.equal(L.dispatchState(plain.id),'lost');
 w.PRODispatch.show(DD.listing()[0].id);assert(!d.querySelector('[data-pick="'+plain.id+'"]'));if(key){assert.equal(out[1].result,'down');L.renderCare();assert(d.querySelector('#careGrid [data-uid="d:'+key.id+'"]'));}saved=dump(w);}
w.close();w=open(saved);assert(!w.PROUnitLab.owned().some(x=>x.uid===(SX('scout'))));w.close();
// Skill tree: learn with SP (level and prerequisites), skills apply, reset refunds; PRO・D units too.
w=open({});{const L=w.PROUnitLab,d=w.document,u=id=>L.owned().find(x=>x.uid===id),act=k=>d.querySelector('#labWinActions [data-lab="'+k+'"]');
 assert.equal(L.learn((SX('infantry')),'inf-aim'),'SPが足りません');L.gainExp([{key:(SX('infantry')),amount:600}]);assert.equal(u((SX('infantry'))).level,4);assert.equal(u((SX('infantry'))).sp,3);
 L.renderTree();const t=d.querySelector(('#treeGrid [data-uid='+SX('infantry')+']'));t.click();d.querySelector(('#treeGrid [data-uid='+SX('infantry')+']')).click();assert(act('node-inf-charge').disabled);act('node-inf-aim').click();assert(u((SX('infantry'))).skills.some(k=>k.name==='狙いを定める'));
 act('node-inf-charge').click();assert.equal(u((SX('infantry'))).sp,0);assert(act('node-inf-rally').disabled);assert(act('node-inf-rally').textContent.includes('Lv5'));
 act('resetask').click();act('reset').click();assert.equal(u((SX('infantry'))).sp,3);assert(!u((SX('infantry'))).skills.some(k=>k.name==='狙いを定める'));
 const jk=Object.values(w.PRODispatchData.defs).find(x=>(x.skillTree||[]).length&&x.deploy?.player&&!x.recruit?.locked);L.gainDispatchExp([{key:jk.id,amount:100}]);const n0=jk.skillTree[0];assert.equal(L.learn('d:'+jk.id,n0.id),'');assert.equal(L.dispatchTreeSkills(jk.id).length,1);assert.equal(L.dispatchLevel(jk.id).sp,1-(n0.cost??1));saved=dump(w);}
w.close();w=open(saved);assert.equal(w.PROUnitLab.owned().find(x=>x.uid===(SX('infantry'))).sp,3);w.close();
// Boarding: pilot bonus, skills and aptitude; riding pilots and pilot-required machines can't sortie alone;
// shared EXP and shared fate; PRO・D boarding in the battle.
w=open({});{const L=w.PROUnitLab,d=w.document,u=id=>L.owned().find(x=>x.uid===id),act=k=>d.querySelector('#labWinActions [data-lab="'+k+'"]'),closeW=()=>[...d.querySelectorAll('#labWinActions button')].find(b=>b.textContent==='閉じる').click();
 L.renderProduction();const h=d.querySelector(('#productionGrid [data-uid='+SX('hire-aoi')+']'));h.click();d.querySelector(('#productionGrid [data-uid='+SX('hire-aoi')+']')).click();act('run').click();closeW();const aoi=L.owned().find(x=>x.id===(SX('aoi'))).uid;
 const r0=u((SX('robot')));L.renderBoard();assert(!d.querySelector('#boardGrid [data-uid="'+aoi+'"]'));const t=d.querySelector(('#boardGrid [data-uid='+SX('robot')+']'));t.click();d.querySelector(('#boardGrid [data-uid='+SX('robot')+']')).click();act('pilot-'+aoi).click();closeW();
 const r1=u((SX('robot')));assert.equal(r1.pilot.name,'葵');assert.equal(r1.acc,Math.round((r0.acc+60)*1.1));assert.equal(r1.atk,Math.round((r0.atk+40)*1.1));assert.equal(r1.def,r0.def);assert(r1.skills.some(k=>k.name==='見切り'));
 assert(L.crewProblem(aoi).includes('搭乗中'));w.location.hash='#formation';w.dispatchEvent(new w.Event('hashchange'));await new Promise(r=>setTimeout(r,400));assert(d.querySelector('#prepUnitList [data-uid="'+aoi+'"]')?.classList.contains('blocked')??d.querySelector(('#prepUnitList [data-unit='+SX('aoi')+']')).classList.contains('blocked'));
 // Shared EXP.
 L.gainExp([{key:(SX('robot')),amount:250}]);assert.equal(u(aoi).level,2);assert.equal(u((SX('robot'))).level,2);
 // Pilot-required machine (fusion result) and shared fate (robot is a key unit → wrecked; the pilot is lost).
 assert.equal(L.crewProblem('nope'),'');L.handleLosses([(SX('robot'))]);assert.equal(u((SX('robot'))).down,'wrecked');assert(!L.owned().some(x=>x.uid===aoi));assert.equal(JSON.stringify(L.boards()),'{}');
 // PRO・D: a pilot unit boards a crew-required machine; the machine can then sortie.
 const DD=w.PRODispatchData,mech=DD.players().find(x=>x.crew==='required'),pil=DD.players().find(x=>x.pilotProfile&&!x.recruit?.locked);if(mech&&pil){assert(L.crewProblem('d:'+mech.id).includes('パイロットが必要'));assert.equal(L.board('d:'+mech.id,'d:'+pil.id),'');assert.equal(L.crewProblem('d:'+mech.id),'');assert(L.crewProblem('d:'+pil.id).includes('搭乗中'));assert.equal(L.dispatchPilot(mech.id).def.id,pil.id);}
 saved=dump(w);}
w.close();
// Tags: terrain blockTags stop a group with a tagged member; item requires gate equip and use; grid search by name / #tag.
w=open({});{const L=w.PROUnitLab,d=w.document,F=w.PROField,u=id=>L.owned().find(x=>x.uid===id);
 F.deploy({missionId:(SX('training-01')),groups:[w.PROTactical.initializeDomains({id:'g1',name:'第1部隊',faction:'player',mode:'auto',members:[{uid:(SX('tank')),unit:u((SX('tank')))}]},'ground')]});const st=F._live(),me=st.groups.find(g=>g.faction==='player');me.position={x:3,y:1};F.focusGroup('g1');
 const mt=[];for(let y=0;y<9;y++)for(let x=0;x<12;x++)if(w.PROTacticalData.tile((SX('training-01')),x,y).kind==='mountain')mt.push(x+','+y);assert(mt.length>0);
 const keys=F.reachable().map(r=>r.key);assert(!mt.some(k=>keys.includes(k)),(SX('tank')+' must not enter mountains'));
 me.members[0].unit={...me.members[0].unit,tags:[]};const keys2=F.reachable().map(r=>r.key);assert(mt.some(k=>keys2.includes(k)),'untagged unit can climb');
 assert(!L.equip((SX('infantry')),0,(SX('plate'))));assert(L.equip((SX('tank')),0,(SX('plate'))));L.renderEquip();const t=d.querySelector(('#equipGrid [data-uid='+SX('infantry')+']'));t.click();d.querySelector(('#equipGrid [data-uid='+SX('infantry')+']')).click();d.querySelector('#labWinActions [data-lab=slot0]').click();const g=d.querySelector('#labWinActions [data-lab='+'gear-'+SX('plate')+']');assert(!g||g.disabled);
 // Grid search.
 w.location.hash='#roster';w.dispatchEvent(new w.Event('hashchange'));await new Promise(r=>setTimeout(r,400));const s=d.querySelector('#unitRoster').previousElementSibling.querySelector('.ug-search');s.value='#車両';s.dispatchEvent(new w.Event('input'));
 const vis=[...d.querySelectorAll('#unitRoster .ug-tile')].filter(t=>!t.hidden).map(t=>t.dataset.unit).sort();assert.deepEqual(vis,[(SX('scout')),(SX('tank'))]);s.value='戦車 #車両';s.dispatchEvent(new w.Event('input'));assert.equal([...d.querySelectorAll('#unitRoster .ug-tile')].filter(t=>!t.hidden).length,1);
 assert(w.PROUnitGrid.matches({name:'葵',tags:['生身','パイロット']},'#生身'));assert(!w.PROUnitGrid.matches({name:'葵',tags:['生身']},'#車両'));}
w.close();
// Achievements (reward once, hidden until earned) and battle records with logs.
w=open({});{const L=w.PROUnitLab,d=w.document,F=w.PROField,D=w.PROTacticalData,u=id=>L.owned().find(x=>x.uid===id);Object.defineProperty(w.navigator,'clipboard',{configurable:true,value:{writeText:async t=>{w._copied=t;}}});
 F.deploy({missionId:(SX('training-01')),groups:[w.PROTactical.initializeDomains({id:'g1',name:'第1部隊',faction:'player',mode:'auto',members:[{uid:(SX('infantry')),unit:u((SX('infantry')))}]},'ground')]});const st=F._live();st.groups=st.groups.filter(g=>g.faction==='player');st.outcome='victory';st.turn=3;st.opLog.push({t:3,k:'battle',s:'テストのログ行'});F.showResult();
 assert(L.achieved()[(SX('ach-first'))]);assert(L.achieved()[(SX('ach-train'))]);assert.equal(L.items()[SX('chip')],3);const h=L.history()[0];assert.equal(h.id,(SX('training-01')));assert.equal(h.outcome,'win');assert.equal(h.stars,3);assert(h.log.includes('[第3T] テストのログ行'));assert(h.log.some(l=>l.includes('作戦開始')));assert.deepEqual({...L.stats()},{battles:1,win:1,lose:0,draw:0});
 const c=L.credits();L.finishMission(D.mission((SX('training-01'))),{outcome:'win',turns:9,reward:0});assert.equal(L.credits(),c);
 d.querySelector('#openAchievements').click();const b=d.querySelector('#labWinBody').textContent;assert(b.includes('★ 初勝利'));assert(!b.includes('資産家'));assert(b.includes('隠し実績 1件'));d.querySelector('#labWinActions button').click();
 d.querySelector('#openHistory').click();assert(d.querySelector('#labWinBody').textContent.includes('出撃 1回'));d.querySelector('#labWinActions [data-lab=hist0]').click();assert(d.querySelector('#labWinBody').textContent.includes('テストのログ行'));d.querySelector('#labWinActions [data-lab=copy]').click();await new Promise(r=>setTimeout(r,20));assert(w._copied.includes('テストのログ行'));
 saved=dump(w);}
w.close();w=open(saved);assert.equal(w.PROUnitLab.history().length,1);assert(w.PROUnitLab.achieved()[(SX('ach-first'))]);w.close();
// Save / load: 3 slots with confirm, export bundle, import validation, maker-source guard.
w=open({});{const L=w.PROUnitLab,S=w.PROSave,d=w.document,btn=k=>d.querySelector('#labWinActions [data-save="'+k+'"]');
 L.buy((SX('chip')));const c1=L.credits();d.querySelector('#openSave').click();btn('slot0').click();btn('save').click();assert(S.read(0));assert.equal(S.read(0).summary.credits,c1);assert(btn('load')&&!btn('load').disabled);
 L.buy((SX('chip')));assert(L.credits()<c1);btn('save').click();assert(d.querySelector('#labWinTitle').textContent.includes('上書き'));btn('ok').click();assert.equal(S.read(0).summary.credits,L.credits());
 const s1=S.snapshot();assert(S.valid(s1));assert.equal(S.importText('{"format":"x"}'),'セーブデータの形式が違います');assert(S.apply({...s1,source:'maker'},{reload:false}).includes('メーカーの下書き'));
 // Load a slot into a fresh browser: progress and encounters come back.
 const slot=S.read(0);w.close();w=open({});assert.equal(w.PROSave.apply(slot,{reload:false}),'');saved=dump(w);w.close();w=open(saved);assert.equal(w.PROUnitLab.credits(),slot.summary.credits);assert(w.PROUnitsSeen.has((SX('infantry'))));
 // Delete.
 w.PROSave.saveSlot(1);w.document.querySelector('#openSave').click();w.document.querySelector('#labWinActions [data-save="slot1"]').click();w.document.querySelector('#labWinActions [data-save="delete"]').click();w.document.querySelector('#labWinActions [data-save="ok"]').click();assert.equal(w.PROSave.read(1),null);}
w.close();
// Autosave (written at mission end, load only) and suspend priority (loading a slot discards the suspend save).
w=open({});{const L=w.PROUnitLab,S=w.PROSave,d=w.document,btn=k=>d.querySelector('#labWinActions [data-save="'+k+'"]');
 assert.equal(S.read('auto'),null);L.finishMission(w.PROTacticalData.mission((SX('training-01'))),{outcome:'win',turns:4,reward:800});L.recordBattle(w.PROTacticalData.mission((SX('training-01'))),'tactical',null,{outcome:'win',turns:4});assert(S.read('auto'));assert.equal(S.read('auto').summary.wins,1);
 d.querySelector('#openSave').click();btn('slotauto').click();assert(!btn('save'));assert(!btn('delete'));assert(btn('load'));
 w.localStorage.setItem('PRO_TACTICAL_SUSPEND','{"x":1}');d.querySelector('#openSave').click();assert(d.querySelector('#labWinBody').textContent.includes('中断中の作戦'));btn('slotauto').click();btn('load').click();assert(d.querySelector('#labWinBody').textContent.includes('破棄されます'));
 assert.equal(S.apply(S.read('auto'),{reload:false}),'');assert.equal(w.localStorage.getItem('PRO_TACTICAL_SUSPEND'),null);}
w.close();
// 2) Maker source: draft units, evolutions and variants join the built-in data; invalid links are dropped.
w=open({...saved,PRO_TACTICAL_SOURCE:'maker',PRO_TD_MAKER_DRAFT:JSON.stringify(draft)});D=w.PROTacticalData;L=w.PROUnitLab;
assert.equal(D.source,'maker');assert.equal(D.makerName,'テストパック');assert(D.roster().some(u=>u.id==='td-u-a'));assert(!D.roster().some(u=>u.id==='td-u-b'));assert(D.roster().some(u=>u.id===(SX('infantry'))));
assert.equal(D.unit('td-u-a').weapons[0].name,'試作ライフル');assert.equal(D.unit('td-u-b').weapons.length,1);assert.equal(D.unit('td-u-a2').hp,2400);assert.equal(D.catalogId('td-u-a2'),'td-u-a');assert.equal(D.unit('td-u-a').catalog,'メーカーで作った試作機。');
assert(D.evolutions().some(e=>e.id==='td-e-1'));{const tt=D.terrainTypes();assert.equal(tt['td-t-swamp'].costs.ground,3);assert.deepEqual([...tt['td-t-swamp'].blockTags],['車両']);assert.equal(tt['td-t-swamp'].effects.meleeHitPt,-10);assert(!tt['td-t-dispatch']);assert(tt.p);}assert(!D.fusions().some(f=>f.id==='td-f-bad'));
// The built-in save is not used for the maker source: owned units start from the merged roster.
assert.equal(L.credits(),24800);assert(L.owned().some(u=>u.id===(SX('tank'))));assert(L.owned().some(u=>u.id==='td-u-a'));
assert(w.document.querySelector('#dataSourceText').textContent.includes('テストパック'));w.close();
// T&D Tactical missions: loaded with custom terrain squares; win / lose conditions; test play selection.
{const grid=Array.from({length:6},(_,y)=>Array.from({length:8},(_,x)=>x===4&&y===0?'td-t-swamp':'p'));const tm=(id,victory,defeat)=>({id,name:'試作作戦'+id,map:{width:8,height:6,grid},playerStarts:[{x:0,y:0}],enemies:[{id:'e1',name:'敵A',position:{x:7,y:5},members:[{unit:'td-u-b'}],ai:{pattern:'hold'}},{id:'e2',name:'敵B',position:{x:7,y:0},members:[{unit:'td-u-b',name:'隊長'}],ai:{pattern:'hold'}}],victory,defeat,result:{credits:300,exp:10}});
 const d2={...draft,tmissions:[tm('tm-boss',{type:'boss',groupId:'e2'},{type:'player_wipe'}),tm('tm-reach',{type:'reach',x:2,y:0},{type:'turn_limit',turns:2}),tm('tm-def',{type:'defend',turns:1},{type:'unit_down',unitId:'td-u-a'}),{...tm('tm-bad',{type:'enemy_wipe'}),map:{width:8,height:6,grid:[['zz']]}},
  {...tm('tm-ev',{type:'enemy_wipe'},{type:'player_wipe'}),allies:[{id:'a1',name:'護衛隊',reinforce:true,position:{x:0,y:0},members:[{unit:'td-u-a'}]}],
   enemies:[{id:'e1',name:'敵A',position:{x:7,y:5},members:[{unit:'td-u-b'}],ai:{pattern:'hold'}},{id:'e2',name:'敵増援',reinforce:true,position:{x:7,y:0},members:[{unit:'td-u-b'}],ai:{pattern:'hold'}}],
   events:[{id:'ev-1',name:'開始',trigger:{type:'start'},actions:[{type:'talk',lines:[{speaker:'隊長',text:'作戦開始'}]},{type:'choice',text:'どうする？',options:[{label:'進む',flag:'go'},{label:'待つ',flag:'stay'}]}]},
    {id:'ev-2',name:'第2ターン',trigger:{type:'turn',turns:2},actions:[{type:'spawn',groupId:'e2'},{type:'spawn',groupId:'a1'},{type:'terrain',x:1,y:1,w:2,h:1,key:'td-t-swamp'},{type:'victory',cond:{type:'flag',flag:'win'}}]},
    {id:'ev-3',name:'分岐',trigger:{type:'flag',flag:'go'},actions:[{type:'flag',flag:'went'}]},{id:'ev-4',name:'撤退',trigger:{type:'squad_down',groupId:'e1'},actions:[{type:'withdraw',groupId:'e2'}]}],
   objectives:[{id:'ob-1',name:'無傷',success:{type:'no_loss'},reward:{credits:700,exp:5}},{id:'ob-2',name:'急行',success:{type:'reach',x:5,y:5},fail:{type:'turn',turns:2},reward:{credits:900}}]},
  {...tm('tm-chain',{type:'enemy_wipe'},{type:'player_wipe'}),map:{width:8,height:6,grid:Array.from({length:6},()=>Array.from({length:8},(_,x)=>x===4?'g':'p'))},
   enemies:[{id:'e1',name:'歩哨',position:{x:2,y:5},members:[{unit:'td-u-b'}],ai:{pattern:'hold'}},{id:'e2',name:'本隊',position:{x:7,y:5},members:[{unit:'td-u-b'}],ai:{pattern:'hold'}}],
   objectives:[{id:'ob-a',name:'歩哨を倒す',success:{type:'squad_down',groupId:'e1'},reward:{credits:100}},{id:'ob-b',name:'本隊を討て',appear:'event',limit:2,success:{type:'squad_down',groupId:'e2'},reward:{credits:400}},{id:'ob-c',name:'隠し',appear:'event',success:{type:'enemy_wipe'}}],
   events:[{id:'ev-a',name:'開門',trigger:{type:'objective_done',objectiveId:'ob-a'},actions:[{type:'terrain',x:4,y:0,w:1,h:6,key:'o'},{type:'flag',flag:'opened'}]},
    {id:'ev-b',name:'突入',trigger:{type:'reach',x:5,y:0,w:3,h:6},actions:[{type:'objective',id:'ob-b',result:'start'},{type:'ai',groupId:'e2',pattern:'assault'}]}]},
  {...tm('tm-prod',{type:'enemy_wipe'},{type:'player_wipe'}),map:{width:8,height:6,grid:Array.from({length:6},(_,y)=>Array.from({length:8},(_,x)=>y===0&&x>=2&&x<=5?'td-t-yard':'p'))},
   facilities:{'2,0':'player','3,0':'player','4,0':'player','5,0':'player'},funds:{player:2000},reserveMax:1,produceKeep:true,production:[{unitId:'td-u-a'}]},
  {...tm('tm-ai',{type:'enemy_wipe'},{type:'player_wipe'}),map:{width:8,height:6,grid:Array.from({length:6},(_,y)=>Array.from({length:8},(_,x)=>x===7&&y===5?'td-t-yard':x===4&&y===2?'td-t-fort':'p'))},
   facilities:{'7,5':'enemy'},funds:{enemy:500},aiProduce:{enemy:{mode:'cheapest',pattern:'hold'}},enemies:[{id:'e1',name:'占領隊',position:{x:5,y:2},members:[{unit:'td-u-b'}],ai:{pattern:'capture'}}]},
  {...tm('tm-fac',{type:'enemy_wipe'},{type:'player_wipe'}),map:{width:8,height:6,grid:Array.from({length:6},(_,y)=>Array.from({length:8},(_,x)=>x===1&&y===0?'td-t-fort':(x===0&&y===1)||(x===6&&y===5)?'q':'p'))},
   facilities:{'0,1':'player','6,5':'enemy'},funds:{player:1000,returnPct:50},events:[{id:'c1',name:'c1',trigger:{type:'captured',x:1,y:0},actions:[{type:'flag',flag:'cap'}]}]},
  {...tm('tm-f',{type:'enemy_wipe'},{type:'player_wipe'}),allies:[{id:'a1',name:'客将隊',position:{x:0,y:1},members:[{unit:'td-u-b'}]},{id:'a2',name:'友軍隊',faction:'ally',position:{x:3,y:3},members:[{unit:'td-u-b'}],ai:{pattern:'assault'}}],
   enemies:[{id:'e1',name:'敵A',position:{x:6,y:3},members:[{unit:'td-u-b'}],ai:{pattern:'hold'}},{id:'t1',name:'野盗',faction:'third',position:{x:7,y:0},members:[{unit:'td-u-b'}],ai:{pattern:'hold'}}]},
  {...tm('tm-rules',{type:'enemy_wipe'},{type:'player_wipe'}),map:{width:8,height:6,grid:Array.from({length:6},(_,y)=>Array.from({length:8},(_,x)=>(x===6&&y===0)||(x===7&&y===5)?'td-t-fort':(x===3&&y===3)?'c':'p'))},facilityTags:{'6,0':['補給所'],'7,5':['補給所']},
   enemies:[{id:'e1',name:'敵A',position:{x:0,y:5},members:[{unit:'td-u-b'}],ai:{pattern:'hold'},aiRules:[{conds:[{type:'appeared_le',turns:3}],acts:[{type:'wait'}]},{conds:[{type:'appeared_ge',turns:4},{type:'not_reach',x:4,y:2,w:2,h:2}],acts:[{type:'move',x:4,y:2,w:2,h:2}]},{conds:[],acts:[{type:'capture',tag:'補給所'}]}]},
    {id:'e2',name:'敵B',position:{x:7,y:2},members:[{unit:'td-u-b'}],ai:{pattern:'hold'},aiRules:[{conds:[],acts:[{type:'wait'},{type:'attack',target:{kind:'squad',value:'g2'}}]}]}]},
  {...tm('tm-g',{type:'enemy_wipe'},{type:'player_wipe'}),stars:[{type:'clear'},{type:'turns_le',value:2}],starReward:111,drops:[{itemId:(SX('fieldkit')),chance:100,min:2,max:2}],resultFlags:{win:{'gf-3':true},lose:{'gf-4':true}},
   events:[{id:'g1',name:'g1',trigger:{type:'game_flag',flagId:'gf-1'},actions:[{type:'flag',flag:'seen'}]},{id:'g2',name:'g2',trigger:{type:'start'},actions:[{type:'game_flag',flagId:'gf-2'}]},
    {id:'g3',name:'g3',trigger:{type:'game_flag',flagId:'gf-2'},actions:[{type:'flag',flag:'pending'}]},{id:'g4',name:'g4',trigger:{type:'game_cond',conds:{list:[{type:'flag',flagId:'gf-1',on:true}]}},actions:[{type:'flag',flag:'cond'}]}]}]};
 w=open({PRO_TACTICAL_SOURCE:'maker',PRO_TD_MAKER_DRAFT:JSON.stringify(d2)});const D=w.PROTacticalData,F=w.PROField,L=w.PROUnitLab;assert(D.mission('tm-boss'));assert(!D.mission('tm-bad'));assert.equal(D.tile('tm-boss',4,0).name,'湿地');assert.equal(D.mission('tm-boss').goal,'敵Bの撃破');assert.equal(D.enemies('tm-boss')[1].members[0].unit.name,'隊長');
 const sq=uid=>w.PROTactical.initializeDomains({id:'g1',name:'第1部隊',faction:'player',mode:'auto',members:[{uid,unit:L.owned().find(x=>x.uid===uid)||L.owned()[0]}]},'ground');
  // Use the exposed state to check each rule through the shared outcome() (called by showResult / turn end).
 const check=(id,mut)=>{F.deploy({missionId:id,groups:[sq((SX('infantry')))]});const s=F._live();mut(s);return F.checkOutcome();};
 assert.equal(check('tm-boss',s=>{s.groups=s.groups.filter(g=>g.id!=='e2');}),'victory');assert(!check('tm-boss',s=>{s.groups=s.groups.filter(g=>g.id!=='e1');}));
 assert.equal(check('tm-reach',s=>{s.groups.find(g=>g.faction==='player').position={x:2,y:0};}),'victory');assert.equal(check('tm-reach',s=>{s.turn=3;}),'defeat');
 assert.equal(check('tm-def',s=>{s.turn=2;}),'victory');
 const aId=L.owned().find(x=>x.id==='td-u-a').uid;F.deploy({missionId:'tm-def',groups:[w.PROTactical.initializeDomains({id:'g1',name:'第1部隊',faction:'player',mode:'auto',members:[{uid:aId,unit:L.owned().find(x=>x.uid===aId)},{uid:(SX('infantry')),unit:L.owned().find(x=>x.uid===(SX('infantry')))}]},'ground')]});const s2=F._live();s2.groups.find(g=>g.faction==='player').members=s2.groups.find(g=>g.faction==='player').members.filter(m=>m.uid!==aId);assert.equal(F.checkOutcome(),'defeat');w.close();
 // Round 2: start talk and a choice (flag → event), reinforcements (enemy and allied guest), terrain change, victory
 // change, withdrawal, objectives with result rewards.
 {w=open({PRO_TACTICAL_SOURCE:'maker',PRO_TD_MAKER_DRAFT:JSON.stringify(d2)});const F=w.PROField,L=w.PROUnitLab,$=id=>w.document.getElementById(id),tick=()=>new Promise(r=>setTimeout(r,0));
  const next=async(label='次へ')=>{await tick();const b=[...$('fieldChoiceBody').querySelectorAll('button')].find(x=>x.textContent===label);assert(b,'no '+label+' in '+$('fieldChoiceBody').textContent);b.click();await tick();};
  F.deploy({missionId:'tm-ev',groups:[w.PROTactical.initializeDomains({id:'g1',name:'第1部隊',faction:'player',mode:'auto',members:[{uid:(SX('infantry')),unit:L.owned().find(x=>x.uid===(SX('infantry')))}]},'ground')]});const s=F._live();
  assert.equal($('fieldChoiceTitle').textContent,'隊長');assert($('fieldChoiceClose').hidden);await next();assert($('fieldChoiceBody').textContent.includes('どうする？'));await next('進む');assert(s.flags.go&&s.flags.went);assert(!$('fieldChoiceClose').hidden);
  assert(!s.groups.some(g=>g.id==='e2'||g.id==='a1'));assert.deepEqual([...s.pending],['e2','a1']);assert(!s.deployed.some(x=>x.uid.startsWith('guest')));
  s.turn=2;assert(!F.checkOutcome());assert(s.groups.some(g=>g.id==='e2'&&g.faction==='enemy'));const a1=s.groups.find(g=>g.id==='a1');assert.equal(a1.faction,'player');assert.equal(a1.position.x+','+a1.position.y,'1,0');
  assert.equal(s.terrain['1,1'],'td-t-swamp');assert.equal(s.terrain['2,1'],'td-t-swamp');assert.equal(s.victory.type,'flag');assert.equal(s.objectives['ob-2'],'failed');
  s.groups.push({id:'e9',name:'残党',faction:'enemy',position:{x:7,y:3},members:[{uid:'e9-0',domain:'ground',unit:w.PROTacticalData.unit('td-u-b')}]});s.groups=s.groups.filter(g=>g.id!=='e1');assert(!F.checkOutcome());assert(!s.groups.some(g=>g.id==='e2'));assert(s.withdrawn.includes('e2'));
  F.openGoals();assert($('fieldChoiceBody').textContent.includes('フラグ「win」'));assert($('fieldChoiceBody').textContent.includes('失敗'));$('fieldChoice').close();
  s.flags.win=true;assert.equal(F.checkOutcome(),'victory');assert.equal(s.objectives['ob-1'],'done');
  const c0=L.credits();F.showResult();for(let i=0;i<10&&$('fieldChoice').hasAttribute('open');i++)await next();await tick();
  const body=$('fieldResultBody').textContent;assert(body.includes('作戦内ミッション：無傷達成 +700 Cr +5 EXP'),body);assert(body.includes('作戦内ミッション：急行失敗'));assert(L.credits()-c0>=1000,String(L.credits()-c0));assert(body.includes('+15 EXP'));w.close();}
 // Round 3: objective chain (sentry → gate opens → entering an area starts the next objective with a turn limit),
 // impassable squares, AI change, map marks and the mission list.
 {w=open({PRO_TACTICAL_SOURCE:'maker',PRO_TD_MAKER_DRAFT:JSON.stringify(d2)});const F=w.PROField,L=w.PROUnitLab,D=w.PROTacticalData,$=id=>w.document.getElementById(id);
  assert.equal(Object.keys(D.tile('tm-chain',4,0).costs).length,0);
  F.deploy({missionId:'tm-chain',groups:[w.PROTactical.initializeDomains({id:'g1',name:'第1部隊',faction:'player',mode:'auto',members:[{uid:(SX('infantry')),unit:L.owned().find(x=>x.uid===(SX('infantry')))}]},'ground')]});const s=F._live();F.show();
  assert(![...F.reachable()].some(r=>r.key.startsWith('4,')));assert($('fieldGrid').querySelector('[data-x="2"][data-y="5"]').className.includes('target-squad'));assert.equal(s.objectives['ob-b'],'hidden');
  s.groups=s.groups.filter(g=>g.id!=='e1');assert(!F.checkOutcome());assert.equal(s.objectives['ob-a'],'done');assert.equal(s.terrain['4,3'],'o');assert(s.flags.opened);assert.equal(s.objectives['ob-b'],'hidden');
  s.groups.find(g=>g.id==='g1').position={x:6,y:2};assert(!F.checkOutcome());assert.equal(s.objectives['ob-b'],'open');assert.equal(s.groups.find(g=>g.id==='e2').ai.pattern,'assault');assert(s.talkQueue.some(t=>t.text?.includes('ミッション発生')));
  F.openMissions();assert($('fieldChoiceBody').querySelector('[data-mission="ob-b"]'));assert(!$('fieldChoiceBody').querySelector('[data-mission="ob-c"]'));assert($('fieldChoiceBody').textContent.includes('残り2ターン'));
  $('fieldChoiceBody').querySelector('[data-tab=done]').click();assert($('fieldChoiceBody').querySelector('[data-mission="ob-a"]'));$('fieldChoice').close();
  s.turn=3;assert(!F.checkOutcome());assert.equal(s.objectives['ob-b'],'failed');w.close();}
 // Operation log: start, sortie, talk and choice, enemy phase and turn start, events; viewer tabs and copy.
 {w=open({PRO_TACTICAL_SOURCE:'maker',PRO_TD_MAKER_DRAFT:JSON.stringify(d2)});const F=w.PROField,L=w.PROUnitLab,$=id=>w.document.getElementById(id),tick=()=>new Promise(r=>setTimeout(r,0));let copied='';w.navigator.clipboard.writeText=t=>{copied=t;return Promise.resolve();};
  F.deploy({missionId:'tm-ev',groups:[w.PROTactical.initializeDomains({id:'g1',name:'第1部隊',faction:'player',mode:'auto',members:[{uid:(SX('infantry')),unit:L.owned().find(x=>x.uid===(SX('infantry')))}]},'ground')]});
  for(const label of ['次へ','待つ']){await tick();[...$('fieldChoiceBody').querySelectorAll('button')].find(b=>b.textContent===label).click();await tick();}
  await F.endTurn();const text=F.opLog().map(e=>e.k+':'+e.s).join('\n');
  for(const x of ['system:作戦開始：試作作戦tm-ev','system:出撃：第1部隊（1体）','event:隊長「作戦開始」','event:選択：どうする？ → 待つ','system:ターン終了・敵フェイズ','system:— 第2ターン開始 —','event:敵の増援：敵増援が'])assert(text.includes(x),x+'\n'+text);
  assert(F.opLog().find(e=>e.s.startsWith('敵の増援')).t===2);
  while($('fieldChoice').hasAttribute('open'))$('fieldChoice').close();F.openLog();assert($('fieldOpLog').textContent.includes('第2ターン'));$('fieldChoiceBody').querySelector('[data-tab=event]').click();assert(!$('fieldOpLog').textContent.includes('ターン終了'));assert($('fieldOpLog').textContent.includes('隊長「作戦開始」'));
  [...$('fieldChoiceBody').querySelectorAll('button')].find(b=>b.textContent==='コピー').click();await tick();assert(copied.includes('[第1T] 隊長「作戦開始」'));w.close();}
 // In-mission items (heal, revive), terrain effects for local battles, game-wide flags and condition sets.
 {w=open({PRO_TACTICAL_SOURCE:'maker',PRO_TD_MAKER_DRAFT:JSON.stringify(d2)});const F=w.PROField,L=w.PROUnitLab,D=w.PROTacticalData,$=id=>w.document.getElementById(id);
  assert.equal(D.tile('tm-boss',4,0).effects.meleeHitPt,-10);assert.deepEqual({...D.tile('tm-boss',0,0).effects},{});
  const inf=L.owned().find(x=>x.uid===(SX('infantry'))),sc=L.owned().find(x=>x.uid!==(SX('infantry'))&&x.size==='S'&&x.movementAptitude?.ground&&x.movementAptitude.ground!=='none');F.deploy({missionId:'tm-boss',groups:[w.PROTactical.initializeDomains({id:'g1',name:'第1部隊',faction:'player',mode:'auto',members:[{uid:(SX('infantry')),unit:inf},{uid:sc.uid,unit:sc}]},'ground')]});F.show();
  F.pick(4,0);assert($('fieldTileInfo').textContent.includes('地形効果'),$('fieldTileInfo').textContent);
  const s=F._live(),g=()=>s.groups.find(x=>x.id==='g1');g().members[0].currentHp=100;const kits=L.free((SX('fieldkit')));assert(kits>=1);
  // Items only on a supply facility square.
  F.focusGroup('g1');assert($('fieldItem').disabled);$('fieldChoice').close();F.openItems();assert(!$('fieldChoiceBody').querySelector('[data-item]'));
  s.terrain={'0,0':'y'};assert(D.terrain('y').facility.functions.supply);F.focusGroup('g1');assert($('fieldItem').disabled,'neutral supply facility');F.fac(0,0).st.owner='player';F.focusGroup('g1');assert(!$('fieldItem').disabled);F.pick(0,0);assert($('fieldTileInfo').textContent.includes('施設：味方'),$('fieldTileInfo').textContent);assert($('fieldTileInfo').textContent.includes('補給'));
  F.focusGroup('g1');F.openItems();$('fieldChoiceBody').querySelector(('[data-item='+SX('fieldkit')+']')).click();$('fieldChoiceBody').querySelector(('[data-target='+SX('infantry')+']')).click();
  const max=g().members[0].unit.hp||1200;assert.equal(g().members[0].currentHp,100+Math.round(max/2));assert.equal(L.free((SX('fieldkit'))),kits-1);assert(!w.PROTactical.canAct(g()));assert(F.opLog().some(e=>e.s.includes('応急修理キットを使用')));
  // Revive: a member destroyed in this mission comes back to its group.
  assert(L.buy((SX('revive'))));const lost=g().members.splice(1,1)[0];s.fallen=[{groupId:'g1',faction:'player',member:lost}];g().members.forEach(m=>m.action={});F.focusGroup('g1');F.openItems();$('fieldChoiceBody').querySelector(('[data-item='+SX('revive')+']')).click();$('fieldChoiceBody').querySelector('[data-target="'+lost.uid+'"]').click();
  assert.equal(g().members.length,2);assert(g().members[1].currentHp>0);assert.equal(s.fallen.length,0);w.close();
  // Game flags: triggers read the game's flags (and flags set earlier in this mission), condition sets; result flags.
  w=open({PRO_TACTICAL_SOURCE:'maker',PRO_TD_MAKER_DRAFT:JSON.stringify(d2)});const F2=w.PROField,L2=w.PROUnitLab;L2.setFlag('gf-1',true);
  F2.deploy({missionId:'tm-g',groups:[w.PROTactical.initializeDomains({id:'g1',name:'第1部隊',faction:'player',mode:'auto',members:[{uid:(SX('infantry')),unit:L2.owned().find(x=>x.uid===(SX('infantry')))}]},'ground')]});const s2=F2._live();
  assert(s2.flags.seen&&s2.flags.pending&&s2.flags.cond);const on=id=>L2.evalConds({list:[{type:'flag',flagId:id,on:true}]}).ok;assert(!on('gf-2'));
  s2.outcome='defeat';s2.talkQueue=[];F2.showResult();assert(on('gf-2'));assert(on('gf-4'));assert(!on('gf-3'));w.close();
  // Factions: AI ally (green), third force (yellow, hostile to all), guests (light blue) merging with own squads.
  {w=open({PRO_TACTICAL_SOURCE:'maker',PRO_TD_MAKER_DRAFT:JSON.stringify(d2)});const F=w.PROField,L=w.PROUnitLab,$=id=>w.document.getElementById(id),n0=L.owned().length;
   F.deploy({missionId:'tm-f',groups:[w.PROTactical.initializeDomains({id:'g1',name:'第1部隊',faction:'player',mode:'auto',members:[{uid:(SX('infantry')),unit:L.owned().find(x=>x.uid===(SX('infantry')))}]},'ground')]});const s=F._live(),G=id=>s.groups.find(g=>g.id===id);F.show();
   assert.equal(G('a1').faction,'player');assert.equal(G('a2').faction,'ally');assert.equal(G('t1').faction,'third');assert.equal(G('e1').faction,'enemy');
   const cls=(x,y)=>$('fieldGrid').querySelector('[data-x="'+x+'"][data-y="'+y+'"]').className;assert(cls(3,3).includes('f-ally'));assert(cls(7,0).includes('f-third'));assert(cls(0,1).includes('f-guest'));assert(cls(6,3).includes('hostile'));
   // Guest + own squad merge into one group; the guest squad still counts as alive.
   F.focusGroup('g1');F.startMerge();F.pick(0,1);[...$('fieldChoiceBody').querySelectorAll('button')].find(b=>b.textContent==='合流を確定').click();
   const mixed=s.groups.find(g=>g.members.length===2);assert(mixed&&mixed.members.some(m=>m.uid===(SX('infantry')))&&mixed.members.some(m=>m.uid.startsWith('guest-a1-')));F.show();assert(cls(mixed.position.x,mixed.position.y).includes('f-mixed'));
   assert(!F.checkOutcome());
   // Phases: player → ally → enemy → third.
   await F.endTurn();const lg=F.opLog().map(e=>e.s).join('\n');assert(lg.includes('友軍フェイズ'));assert(lg.includes('第三勢力フェイズ'));assert(lg.includes('友軍隊→敵A'),lg);
   // Enemy wipe wins even with the third force left; guests do not join the roster.
   s.groups=s.groups.filter(g=>g.faction!=='enemy');assert.equal(F.checkOutcome(),'victory');s.talkQueue=[];F.showResult();assert.equal(L.owned().length,n0);assert(!L.owned().some(u=>String(u.uid).startsWith('guest-')));w.close();}
  // Facilities: capture over two turns, first-capture reward, capture trigger, income, repair, HQ loss, funds returned on a win.
  {w=open({PRO_TACTICAL_SOURCE:'maker',PRO_TD_MAKER_DRAFT:JSON.stringify(d2)});const F=w.PROField,L=w.PROUnitLab,$=id=>w.document.getElementById(id);
   const dep=()=>{F.deploy({missionId:'tm-fac',groups:[w.PROTactical.initializeDomains({id:'g1',name:'第1部隊',faction:'player',mode:'auto',members:[{uid:(SX('infantry')),unit:L.owned().find(x=>x.uid===(SX('infantry')))}]},'ground')]});return F._live();};
   let s=dep();const g=()=>s.groups.find(x=>x.id==='g1');assert.equal(s.funds.player,1000);assert.equal(F.fac(1,0).owner,'neutral');assert.equal(F.fac(0,1).owner,'player');assert.equal(F.fac(6,5).owner,'enemy');
   g().position={x:1,y:0};F.show();F.focusGroup('g1');assert(!$('fieldCapture').hidden&&!$('fieldCapture').disabled);assert($('fieldCapture').textContent.includes('占領力5'),$('fieldCapture').textContent);
   F.capture();assert.equal(F.fac(1,0).st.dur,5);assert.equal(F.fac(1,0).owner,'neutral');assert(!w.PROTactical.canAct(g()));g().members.forEach(m=>m.action={});
   F.focusGroup('g1');F.capture();assert.equal(F.fac(1,0).owner,'player');assert.equal(s.funds.player,1500);assert(s.flags.took);assert.equal(s.rewardItems[SX('fieldkit')],1);F.checkOutcome();assert(s.flags.cap);
   F.focusGroup('g1');assert($('fieldCapture').hidden);
   F.facilityTurn('player');assert.equal(s.funds.player,1500+700+2000);
   g().position={x:0,y:1};g().members[0].currentHp=100;F.facilityTurn('player');const max=g().members[0].unit.hp||1200;assert.equal(g().members[0].currentHp,Math.min(max,100+Math.round(max*.2)));
   assert.equal(F.fxFor(g()).rangedHitPt,-15);F.fac(0,1).st.owner='neutral';assert.equal(F.fxFor(g()).rangedHitPt,undefined);
   F.fac(0,1).st.owner='enemy';assert.equal(F.checkOutcome(),'defeat');
   s=dep();s.funds.player=2000;const c0=L.credits(),k0=L.free((SX('fieldkit')));s.rewardItems={[SX('fieldkit')]:1};s.groups=s.groups.filter(x=>x.faction==='player');s.outcome='victory';s.talkQueue=[];F.showResult();
   assert($('fieldResultBody').textContent.includes('戦場資金の持ち帰り+1,000 CR'),$('fieldResultBody').textContent);assert(L.credits()-c0>=1000);assert.equal(L.free((SX('fieldkit'))),k0+1);w.close();}
  // Production (mission-only list, mission list, owned units, base list kept after a win), sortie gate with a reserve squad, exit.
  {w=open({PRO_TACTICAL_SOURCE:'maker',PRO_TD_MAKER_DRAFT:JSON.stringify(d2)});const F=w.PROField,L=w.PROUnitLab,$=id=>w.document.getElementById(id),sq=(id,uid,reserve)=>({...w.PROTactical.initializeDomains({id,name:id+'隊',faction:'player',mode:'auto',members:[{uid,unit:L.owned().find(x=>x.uid===uid)}]},'ground'),...(reserve?{reserve:true}:{})});
   const other=L.owned().find(u=>u.uid!==(SX('infantry'))&&u.size==='S'&&u.movementAptitude?.ground&&u.movementAptitude.ground!=='none').uid,n0=L.owned().length;
   F.deploy({missionId:'tm-prod',groups:[sq('g1',(SX('infantry'))),sq('r1',other,true)]});const s=F._live();F.show();assert(!s.groups.some(g=>g.id==='r1'));assert.equal(s.reserves.length,1);assert(!s.deployed.some(d=>d.uid===other));
   F.pick(2,0);F.pick(2,0);assert(!$('fieldProduce').hidden);assert(!$('fieldGate').hidden&&!$('fieldGate').disabled);$('fieldMapCommand').close();
   F.openProduce();const opts=[...$('fieldChoiceBody').querySelectorAll('[data-prod]')].map(b=>b.dataset.prod);assert(opts.includes('list:td-u-b')&&opts.includes('list:td-u-a'),opts.join());assert(opts.some(o=>o.startsWith('owned:')));assert(opts.some(o=>o.startsWith('hire:')));
   $('fieldChoiceBody').querySelector('[data-prod="list:td-u-b"]').click();const p1=s.groups.find(g=>g.position.x===2&&g.position.y===0);assert(p1&&p1.members[0].uid==='guest-prod-1-0');assert.equal(s.funds.player,1700);assert(!w.PROTactical.canAct(p1));
   F.pick(3,0);F.pick(3,0);$('fieldMapCommand').close();F.openGate();$('fieldChoiceBody').querySelector('[data-reserve=r1]').click();assert(s.groups.some(g=>g.id==='r1'&&g.position.x===3));assert.equal(s.gateLeft,0);assert(s.deployed.some(d=>d.uid===other));
   F.pick(4,0);F.pick(4,0);$('fieldMapCommand').close();F.openProduce();const hb=$('fieldChoiceBody').querySelector('[data-prod^="hire:"]:not([disabled])');assert(hb,'hire option affordable');const hid=hb.dataset.prod.slice(5);hb.click();assert(s.produced.some(p=>p.keep&&p.unitId===hid));
   s.groups.find(g=>g.id==='g1').position={x:5,y:0};F.focusGroup('g1');assert(!$('fieldRetreat').hidden);F.retreat();[...$('fieldChoiceBody').querySelectorAll('button')].find(b=>b.textContent==='撤退する').click();assert(!s.groups.some(g=>g.id==='g1'));assert(s.retreated.some(r=>r.uid===(SX('infantry'))));
   s.groups=s.groups.filter(g=>g.faction==='player');assert.equal(F.checkOutcome(),'victory');s.talkQueue=[];F.showResult();const body=$('fieldResultBody').textContent;
   assert(body.includes('加入（戦場で生産）'),body);assert.equal(L.owned().length,n0+1);assert(L.owned().some(u=>u.id===hid&&u.uid.includes('#')));assert(!body.includes('（撃破された）'),body);w.close();}
  // Preparation: a squad can be marked as reserve (up to the mission's limit); reserves are not placed at the start.
  {w=open({PRO_TACTICAL_SOURCE:'maker',PRO_TD_MAKER_DRAFT:JSON.stringify(d2)});const P=w.PROPreparation,L=w.PROUnitLab,$=id=>w.document.getElementById(id);P.setMission('tm-prod');P.addUnit((SX('infantry')));$('prepAddGroup').click();
   const other=L.owned().find(u=>u.uid!==(SX('infantry'))&&u.size==='S'&&u.movementAptitude?.ground&&u.movementAptitude.ground!=='none').uid;P.addUnit(other);const rbs=[...w.document.querySelectorAll('#prepGroups [data-reserve]')];assert.equal(rbs.length,2);rbs[1].click();
   assert(P.snapshot().groups[1].reserve);assert($('prepSummary').textContent.includes('控え1'),$('prepSummary').textContent);w.document.querySelectorAll('#prepGroups [data-reserve]')[0].click();assert(!P.snapshot().groups[0].reserve,'limit 1');
   $('prepConfirm').click();const st=w.PROField._live();assert(st&&st.reserves.length===1&&!st.groups.some(g=>g.members.some(m=>m.uid===other)));w.close();}
  // AI capture (capture pattern) over two enemy phases; AI production from an owned facility with its funds.
  {w=open({PRO_TACTICAL_SOURCE:'maker',PRO_TD_MAKER_DRAFT:JSON.stringify(d2)});const F=w.PROField,L=w.PROUnitLab;
   F.deploy({missionId:'tm-ai',groups:[w.PROTactical.initializeDomains({id:'g1',name:'第1部隊',faction:'player',mode:'auto',members:[{uid:(SX('infantry')),unit:L.owned().find(x=>x.uid===(SX('infantry')))}]},'ground')]});const s=F._live();
   assert.equal(F.planEnemy('e1').x+','+F.planEnemy('e1').y,'4,2');await F.endTurn();const e1=()=>s.groups.find(g=>g.id==='e1');assert.equal(e1().position.x+','+e1().position.y,'4,2');assert.equal(F.fac(4,2).st.dur,5);assert.equal(F.fac(4,2).owner,'neutral');
   const pg=s.groups.find(g=>g.id.startsWith('enemy-prod-'));assert(pg&&pg.position.x===7&&pg.position.y===5&&pg.ai.pattern==='hold');assert.equal(s.funds.enemy,200);assert(!w.PROTactical.canAct(pg));
   await F.endTurn();assert.equal(F.fac(4,2).owner,'enemy');assert(F.opLog().some(e=>e.s.includes('［敵］占領隊が占領')||e.s.includes('占領（中立→敵）')),F.opLog().map(e=>e.s).join('\n'));
   assert(!s.groups.some(g=>g.id.startsWith('enemy-prod-2')),'no funds for a second unit');w.close();}
  // Stage 9: ammo / EN used in local battles (shared battle code, only with ammo / enCost), resupply by facility, supply line,
  // supplier command, supply request; unavailable commands are hidden.
  {w=open({PRO_TACTICAL_SOURCE:'maker',PRO_TD_MAKER_DRAFT:JSON.stringify(d2)});const F=w.PROField,B=w.PROBattle,$=id=>w.document.getElementById(id);
   const gun={name:'弾薬砲',minRange:1,maxRange:3,ammo:2,enCost:10},a=B.combatant({hp:5000,atk:300,def:100,mob:200,acc:900,weapons:[gun],skills:[],tags:[]},'ally','a',{ammo:{},en:25}),e=B.combatant({hp:99999,atk:1,def:100,mob:10,acc:10,weapons:[],skills:[],tags:[]},'enemy','e',{});
   await B.runLocalBattle(B.createContext({allies:[a],enemies:[e],rng:B.mulberry32(1)}),{maxTurns:3,distance:1});assert.equal(a.ammo['弾薬砲'],0,JSON.stringify(a.ammo));assert.equal(a.en,5);
   const b2=B.combatant({hp:5000,atk:300,def:100,mob:200,acc:900,weapons:[gun],skills:[],tags:[]},'ally','b',{ammo:{'弾薬砲':0},en:30});const hp0=e.currentHp;await B.runLocalBattle(B.createContext({allies:[b2],enemies:[e],rng:B.mulberry32(2)}),{maxTurns:2,distance:1});assert.equal(e.currentHp,hp0,'no ammo, no shot');
   const L=w.PROUnitLab,u=()=>({...L.owned().find(x=>x.uid===(SX('infantry'))),weapons:[gun],en:30,supplier:20});
   F.deploy({missionId:'tm-boss',groups:[w.PROTactical.initializeDomains({id:'g1',name:'第1部隊',faction:'player',mode:'auto',members:[{uid:(SX('infantry')),unit:u()}]},'ground')]});const s=F._live(),g=()=>s.groups.find(x=>x.id==='g1'),m=()=>g().members[0];
   m().ammo={'弾薬砲':0};m().en=0;s.terrain={'0,0':'y'};F.fac(0,0).st.owner='player';F.facilityTurn('player');assert.equal(m().ammo['弾薬砲'],2);assert.equal(m().en,30);
   m().ammo={'弾薬砲':0};m().en=0;g().position={x:0,y:2};F.facilityTurn('player');assert.equal(m().ammo['弾薬砲'],1);assert.equal(m().en,9);
   // Supplier command to an adjacent group, then the supply request with battlefield funds.
   s.groups.push(w.PROTactical.initializeDomains({id:'g2',name:'第2部隊',faction:'player',mode:'auto',position:{x:1,y:2},members:[{uid:(SX('scout2')),unit:u(),ammo:{'弾薬砲':0},en:0}]},'ground'));F.show();F.focusGroup('g1');assert(!$('fieldResupply').hidden);F.openSupply();$('fieldChoiceBody').querySelector('[data-supply=g2]').click();
   const g2=()=>s.groups.find(x=>x.id==='g2');assert.equal(g2().members[0].en,30);assert(!w.PROTactical.canAct(g()));F.focusGroup('g1');assert($('fieldMove').hidden,'ended group hides move');assert($('fieldResupply').hidden);
   g2().members[0].en=0;s.funds.player=2500;F.openRequest();$('fieldChoiceBody').querySelector('[data-request=g2]').click();assert.equal(g2().members[0].en,30);assert.equal(s.funds.player,1500);
   // A map battle spends ammo / EN and keeps the rest on the member.
   m().ammo={};m().en=30;g().members.forEach(x=>x.action={});g().position={x:6,y:5};F.focusGroup('g1');await F.attackTarget('e1',{watch:false});assert(m().ammo['弾薬砲']<2,JSON.stringify(m().ammo));assert(m().en<30);w.close();}
  // Stage 9 part 2: load inside the group, board another carrier group by moving, launch any carried units, ready again
  // next turn, eject when the carrier is destroyed.
  {w=open({PRO_TACTICAL_SOURCE:'maker',PRO_TD_MAKER_DRAFT:JSON.stringify(d2)});const F=w.PROField,L=w.PROUnitLab,T=w.PROTactical,$=id=>w.document.getElementById(id),inf=L.owned().find(x=>x.uid===(SX('infantry')));
   const car={...inf,name:'輸送車',carry:{count:2,maxSize:'L'}},pas=n=>({...inf,name:'歩兵'+n,eject:true});
   F.deploy({missionId:'tm-boss',groups:[T.initializeDomains({id:'g1',name:'第1部隊',faction:'player',mode:'auto',members:[{uid:'car',unit:car},{uid:'p1',unit:pas(1)}]},'ground'),T.initializeDomains({id:'g2',name:'第2部隊',faction:'player',mode:'auto',members:[{uid:'p2',unit:pas(2)}]},'ground')]});
   const s=F._live(),G=id=>s.groups.find(g=>g.id===id),carM=()=>G('g1').members.find(m=>m.uid==='car');s.groups.find(g=>g.id==='g2').position={x:2,y:0};F.show();
   F.focusGroup('g1');assert(!$('fieldCarry').hidden);F.openCarry();$('fieldChoiceBody').querySelector('[data-load=p1]').click();assert.equal(G('g1').members.length,1);assert.equal(carM().cargo.length,1);assert.equal(T.formation(G('g1')).count,1);$('fieldChoice').close();
   F.focusGroup('g2');assert(!$('fieldBoard').hidden);F.startBoard();F.pick(0,0);[...$('fieldChoiceBody').querySelectorAll('button')].find(b=>b.textContent==='搭載する').click();assert(!G('g2'));assert.equal(carM().cargo.length,2);assert(F.allMembers(G('g1')).some(m=>m.uid==='p2'));
   F.focusGroup('g1');assert(!$('fieldLaunch').hidden);F.openLaunch();const boxes=[...$('fieldChoiceBody').querySelectorAll('input[name=launch]')];assert.deepEqual(boxes.map(b=>b.value),['p1'],'boarded unit has acted');boxes[0].checked=true;[...$('fieldChoiceBody').querySelectorAll('button')].find(b=>b.textContent==='発進先を選ぶ').click();
   const spot=F.reachable().find(r=>r.key!=='0,0');const [lx,ly]=spot.key.split(',').map(Number);F.pick(lx,ly);const lg=s.groups.find(g=>g.id.startsWith('launch-'));assert(lg&&lg.position.x===lx&&lg.position.y===ly&&lg.members[0].uid==='p1');assert(T.canAct(lg)&&!T.beforeAction(lg));assert.equal(carM().cargo.length,1);
   F.facilityTurn('player');assert(!carM().cargo[0].action?.ended);
   // Carrier destroyed in a battle: the carried unit (eject) escapes next to it.
   s.groups=s.groups.filter(g=>g.faction!=='player'||g.id==='g1');G('g1').position={x:6,y:5};carM().currentHp=1;carM().action={};F.focusGroup('g1');await F.attackTarget('e1',{watch:false});
   assert(!s.groups.some(g=>g.members.some(m=>m.uid==='car')),'carrier destroyed');const ej=s.groups.find(g=>g.members.some(m=>m.uid==='p2'));assert(ej&&ej.name.includes('脱出'),F.opLog().map(e=>e.s).slice(-5).join('|'));w.close();}
  // Stage 9 part 3: map-only skills (carrier, eject device, EN regen), AI launch, AI heading for resupply when dry.
  {w=open({PRO_TACTICAL_SOURCE:'maker',PRO_TD_MAKER_DRAFT:JSON.stringify(d2)});const F=w.PROField,L=w.PROUnitLab,T=w.PROTactical,D=w.PROTacticalData,inf=L.owned().find(x=>x.uid===(SX('infantry')));
   const hangar={id:'sk-hangar',name:'格納庫',tacticalOnly:true,tactical:{carry:{count:2,maxSize:'L'},eject:true}},regen={id:'sk-regen',name:'EN回復',tacticalOnly:true,tactical:{enRegen:50}};
   F.deploy({missionId:'tm-boss',groups:[T.initializeDomains({id:'g1',name:'第1部隊',faction:'player',mode:'auto',members:[{uid:(SX('infantry')),unit:{...inf,en:40,skills:[...(inf.skills||[]),regen]}}]},'ground')]});const s=F._live(),G=id=>s.groups.find(g=>g.id===id);
   G('g1').members[0].en=0;F.facilityTurn('player');assert.equal(G('g1').members[0].en,20);
   // Enemy carrier (skill) launches its unit toward the player during the enemy phase.
   const e1=G('e1'),cu=D.unit('td-u-b');e1.members[0].unit={...e1.members[0].unit,skills:[...(e1.members[0].unit.skills||[]),hangar]};e1.members[0].cargo=[{uid:'ec1',domain:'ground',unit:{...cu,name:'艦載機'},action:{}}];
   await F.endTurn();const lg=s.groups.find(g=>g.id.startsWith('enemy-launch-'));assert(lg&&lg.members[0].uid==='ec1',F.opLog().map(e=>e.s).slice(-6).join('|'));assert(F.opLog().some(e=>e.s.includes('艦載機')||e.s.includes('発進')));
   // Eject device on the carrier: carried units escape when it falls (the carried unit itself has no eject flag).
   const e2=G('e2');e2.members[0].unit={...e2.members[0].unit,skills:[hangar]};e2.members[0].cargo=[{uid:'ec2',domain:'ground',unit:{...cu,name:'脱出機'},action:{}}];e2.members[0].currentHp=1;
   G('g1').position={x:6,y:0};G('g1').members.forEach(m=>m.action={});G('g1').members[0].unit={...G('g1').members[0].unit,atk:5000,acc:5000};F.focusGroup('g1');await F.attackTarget('e2',{watch:false});
   assert(!s.groups.some(g=>g.members.some(m=>m.uid==='e2-0')),'carrier destroyed');assert(s.groups.some(g=>g.members.some(m=>m.uid==='ec2')&&g.name.includes('脱出')),F.opLog().map(e=>e.s).slice(-5).join('|'));
   // A dry enemy group heads for its side's resupply facility.
   s.terrain={'0,5':'y'};F.fac(0,5).st.owner='enemy';const dry=s.groups.find(g=>g.id===lg.id)||G('e1');const gun={name:'弾薬砲',minRange:1,maxRange:1,ammo:1};dry.members.forEach(m=>{m.unit={...m.unit,weapons:[gun]};m.ammo={'弾薬砲':0};m.action={};});
   const d0=Math.abs(dry.position.x-0)+Math.abs(dry.position.y-5),pl=F.planEnemy(dry.id);assert(Math.abs(pl.x-0)+Math.abs(pl.y-5)<d0||d0===0,JSON.stringify(pl));w.close();}
  // Stage 10 part 1: AI rules — wait 3 turns from appearing, then move to an area, then capture facilities with a tag
  // (one after another); a targeted attack; carrier care only with the skill.
  {w=open({PRO_TACTICAL_SOURCE:'maker',PRO_TD_MAKER_DRAFT:JSON.stringify(d2)});const F=w.PROField,L=w.PROUnitLab,T=w.PROTactical,inf=L.owned().find(x=>x.uid===SX('infantry'));
   F.deploy({missionId:'tm-rules',groups:[T.initializeDomains({id:'g1',name:'第1部隊',faction:'player',mode:'auto',members:[{uid:SX('infantry'),unit:inf}]},'ground')]});const s=F._live(),G=id=>s.groups.find(g=>g.id===id);
   const at=p=>p.x+','+p.y;assert.equal(at(F.planEnemy('e1')),'0,5','waits for 3 turns');s.turn=3;assert.equal(at(F.planEnemy('e1')),'0,5');
   s.turn=4;const p1=F.planEnemy('e1'),d=p=>Math.max(0,4-p.x)+Math.max(0,2-p.y)+Math.max(0,p.y-3);assert(d(p1)<d({x:0,y:5}),'moves toward the area '+at(p1));
   G('e1').position={x:4,y:3};const p2=F.planEnemy('e1'),near=(p,f)=>Math.abs(p.x-f[0])+Math.abs(p.y-f[1]);assert(near(p2,[6,0])<near({x:4,y:3},[6,0])||near(p2,[7,5])<near({x:4,y:3},[7,5]),'heads for a tagged facility '+at(p2));assert(near(p2,[3,3])>=1&&!(p2.x===3&&p2.y===3),'ignores the untagged city');
   G('e1').position={x:6,y:0};F.fac(6,0).st.owner='enemy';const p3=F.planEnemy('e1');assert(near(p3,[7,5])<near({x:6,y:0},[7,5]),'next tagged facility '+at(p3));
   // Targeted attack: e2 hits 第2部隊 although 第1部隊 is weaker.
   s.groups.push(T.initializeDomains({id:'g2',name:'第2部隊',faction:'player',mode:'auto',position:{x:7,y:1},members:[{uid:'p9',unit:{...inf}}]},'ground'));G('g1').position={x:6,y:2};G('g1').members[0].currentHp=50;G('e1').position={x:0,y:5};
   await F.endTurn();assert(F.opLog().some(e=>e.s.startsWith('敵B→第2部隊')),F.opLog().map(e=>e.s).slice(-6).join('|'));
   // Carrier care: recovery only when the carrier has the care skill.
   const care={id:'sk-care',name:'整備班',tacticalOnly:true,tactical:{carryCare:{on:true,hp:20}}},hangar={id:'sk-h',name:'格納庫',tacticalOnly:true,tactical:{carry:{count:2,maxSize:'L'}}};
   const car=G('g1').members[0];car.unit={...car.unit,skills:[hangar]};car.cargo=[{uid:'cg1',domain:'ground',unit:{...inf,hp:1000},currentHp:100,action:{}}];F.facilityTurn('player');assert.equal(car.cargo[0].currentHp,100,'no care skill, no recovery');
   car.unit={...car.unit,skills:[hangar,care]};F.facilityTurn('player');assert.equal(car.cargo[0].currentHp,300);w.close();}
  // Stage 10 part 2: smart targeting (forecast, hopeless fights avoided) and domain switching to get past water.
  {w=open({PRO_TACTICAL_SOURCE:'maker',PRO_TD_MAKER_DRAFT:JSON.stringify(d2)});const F=w.PROField,L=w.PROUnitLab,T=w.PROTactical,D=w.PROTacticalData,inf=L.owned().find(x=>x.uid===SX('infantry'));
   const mk=(id,name,pos,unit,hp)=>({...T.initializeDomains({id,name,faction:'player',mode:'auto',members:[{uid:id+'-u',unit,currentHp:hp}]},'ground'),position:pos});
   const run=async(smart,withB)=>{F.deploy({missionId:'tm-reach',groups:[mk('ga','A隊',{x:6,y:5},{...inf,hp:3000,atk:5000},2000)]});const s=F._live();s.groups.find(g=>g.id==='ga').position={x:6,y:5};if(withB)s.groups.push(mk('gb','B隊',{x:7,y:4},{...inf,hp:3000,atk:1},3000));const e1=s.groups.find(g=>g.id==='e1');e1.ai={pattern:'assault'};if(smart)e1.smart={target:true};s.groups=s.groups.filter(g=>g.id!=='e2');await F.endTurn();return F.opLog().map(e=>e.s);};
   let lg=await run(false,true);assert(lg.some(x=>x.startsWith('敵A→A隊')),'default: lowest HP '+lg.slice(-5).join('|'));lg=await run(true,true);assert(lg.some(x=>x.startsWith('敵A→B隊')),'smart: avoids the dangerous A, attacks B '+lg.slice(-4).join('|'));
   lg=await run(true,false);assert(!lg.some(x=>x.startsWith('敵A→')),'smart: hopeless fight not started');
   // Domain switching: an air-capable enemy flies over a water line it can't cross on the ground.
   const air={...D.unit('td-u-b'),movementAptitude:{ground:'B',air:'B',water:'none',underwater:'none',space:'none'},move:6};
   const go=async smart=>{F.deploy({missionId:'tm-reach',groups:[mk('ga','A隊',{x:0,y:2},{...inf},1200)]});const s=F._live();s.terrain=Object.fromEntries([0,1,2,3,4,5].map(y=>['4,'+y,'w']));const e1=s.groups.find(g=>g.id==='e1');e1.members=[{...e1.members[0],unit:air,domain:'ground'}];e1.position={x:6,y:2};e1.ai={pattern:'assault'};if(smart)e1.smart={domain:true};s.groups=s.groups.filter(g=>g.id!=='e2');await F.endTurn();return {x:s.groups.find(g=>g.id==='e1').position.x,log:F.opLog().map(e=>e.s)};};
   const g0=await go(false),g1=await go(true);assert(g0.x>4,'stays behind the water on the ground');assert(g1.x<4,'crosses by air '+g1.x);assert(g1.log.some(x=>x.includes('空中へ切替')));w.close();}
  // Maker star conditions, first-star bonus and drops on a win.
  {w=open({PRO_TACTICAL_SOURCE:'maker',PRO_TD_MAKER_DRAFT:JSON.stringify(d2)});const F=w.PROField,L=w.PROUnitLab,$=id=>w.document.getElementById(id);const k0=L.free((SX('fieldkit')));
   F.deploy({missionId:'tm-g',groups:[w.PROTactical.initializeDomains({id:'g1',name:'第1部隊',faction:'player',mode:'auto',members:[{uid:(SX('infantry')),unit:L.owned().find(x=>x.uid===(SX('infantry')))}]},'ground')]});const s=F._live();s.groups=s.groups.filter(g=>g.faction==='player');s.outcome='victory';s.talkQueue=[];F.showResult();
   const body=$('fieldResultBody').textContent;assert(body.includes('★クリア'),body);assert(body.includes('2TURN以内')||body.includes('2ターン以内'),body);assert(body.includes('+222 CR'),body);assert.equal(L.free((SX('fieldkit'))),k0+2);w.close();}}
 w=open({PRO_TACTICAL_SOURCE:'maker',PRO_TD_MAKER_DRAFT:JSON.stringify(d2)});}
w.close();
// 3) Maker source selected but no draft: an empty start (the sample pack is not loaded by default).
w=open({PRO_TACTICAL_SOURCE:'maker'});assert.equal(w.PROTacticalData.source,'none');w.close();
// Empty start: standard terrains only, no units / missions / items; the mission list explains how to load data; the
// sample pack can be chosen from the data source window.
w=open({PRO_TACTICAL_SOURCE:'none'});{const D=w.PROTacticalData,L=w.PROUnitLab,$=id=>w.document.getElementById(id);assert.equal(D.source,'none');assert.equal(D.missions().length,0);assert.equal(D.units().length,0);assert.equal(L.owned().length,0);assert.deepEqual({...L.items()},{});assert(Object.keys(D.terrainTypes()).includes('p'));
 // No PRO・D units from the published data either (skill tree, boarding, …).
 assert.equal(w.PRODispatchData.players().length,0);w.location.hash='#tree';w.dispatchEvent(new w.Event('hashchange'));assert.equal(w.document.querySelectorAll('#treeGrid .ug-tile').length,0);w.location.hash='#board';w.dispatchEvent(new w.Event('hashchange'));assert.equal(w.document.querySelectorAll('#boardGrid .ug-tile').length,0);
 w.location.hash='#missions';w.dispatchEvent(new w.Event('hashchange'));assert($('missionList').textContent.includes('作戦がありません'));assert($('deploy').disabled);
 $('dataSource').click();$('labWinActions').querySelector('[data-lab=src-sample]').click();assert($('labWinActions').querySelector('[data-lab=src-sample]').textContent.startsWith('✓'));$('labWinActions').querySelector('[data-lab=apply]').click();$('labWinActions').querySelector('[data-lab=run]').click();assert.deepEqual(JSON.parse(w.localStorage.getItem('PRO_TACTICAL_LOAD')),{sample:true,maker:false,packs:[]});assert.equal(w.localStorage.getItem('PRO_TACTICAL_SOURCE'),null);}w.close();
// 4) Pack file loaded in the hub: data source, colored custom squares, separate test save; sortie cost (rate % of the sum).
{const pk={...draft,name:'読み込みパック',packId:'pk-test',tacticalSortieRate:50,units:[{...draft.units[0],sortieCost:300},...draft.units.slice(1)],terrains:[{...draft.terrains[0],tactical:{...draft.terrains[0].tactical,color:'#123456'}},draft.terrains[1]]};
 w=open({});const D=w.PROTacticalData,$=id=>w.document.getElementById(id);assert(D.setPackText('{"x":1}'));assert.equal(D.setPackText(JSON.stringify(pk)),'');assert.equal(D.packInfo().name,'読み込みパック');
 $('dataSource').click();const tg=$('labWinActions').querySelector('[data-lab="src-pack-pk-test"]');assert(tg&&tg.textContent.includes('読み込みパック'));tg.click();$('labWinActions').querySelector('[data-lab=apply]').click();$('labWinActions').querySelector('[data-lab=run]').click();
 assert.deepEqual(JSON.parse(w.localStorage.getItem('PRO_TACTICAL_LOAD')).packs,['pk-test']);const st=dump(w);w.close();
 w=open(st);const D2=w.PROTacticalData,L=w.PROUnitLab;assert.equal(D2.source,'sample+pack:pk-test','sample (already on) + the pack');assert.equal(D2.origins().map(o=>o.name).join(),'内蔵サンプル,読み込みパック');assert.equal(D2.sortieRate,50);assert.equal(D2.terrainTypes()['td-t-swamp'].color,'#123456');assert(L.owned().some(u=>u.id==='td-u-a'));assert(w.document.querySelector('#dataSourceText').textContent.includes('読み込みパック'));assert.equal(w.PROSave.snapshot().source,'sample+pack:pk-test');assert.equal(w.PROSave.snapshot().load.packs.join(),'pk-test');
 const P=w.PROPreparation;w.location.hash='#prepare';w.dispatchEvent(new w.Event('hashchange'));await new Promise(r=>setTimeout(r,300));const uid=L.owned().find(u=>u.id==='td-u-a').uid;P.addUnit(uid);await new Promise(r=>setTimeout(r,50));
 assert(w.document.querySelector('#prepSummary').textContent.includes('出撃費用 150 Cr'),w.document.querySelector('#prepSummary').textContent);const c0=L.credits();w.document.querySelector('#prepConfirm').click();assert.equal(L.credits(),c0-150);
 D2.clearPack();assert(!D2.hasPack());assert.equal(JSON.parse(w.localStorage.getItem('PRO_TACTICAL_LOAD')).packs.length,0);w.close();}
// 5) Several packs at once (no sample): missions and units from both; the mission filter has one item per pack.
{const grid=Array.from({length:6},()=>Array(8).fill('p')),pk=(id,name,uid,mid)=>({format:'PRO_TD_PACK',version:1,packId:id,name,units:[{id:uid,name:name+'機',size:'M',move:5,movementAptitude:{ground:'B',air:'none',water:'none',underwater:'none',space:'none'},hp:2000,atk:200,def:100,mob:200,acc:400,weaponIds:[],skillIds:[],deploy:{player:true}}],
  tmissions:[{id:mid,name:name+'作戦',kind:'combat',map:{width:8,height:6,grid},playerStarts:[{x:0,y:0}],enemies:[{id:'e1',name:'敵',position:{x:7,y:5},members:[{unit:uid}]}],victory:{type:'enemy_wipe'},defeat:{type:'player_wipe'},result:{credits:100,exp:10}}],weapons:[],skills:[],items:[],terrains:[],flags:[],missions:[],research:[],hires:[],evolutions:[],fusions:[],achievements:[]});
 w=open({PRO_TACTICAL_SOURCE:'none'});const D=w.PROTacticalData;assert.equal(D.setPackText(JSON.stringify(pk('real','リアルパック','real-U-000000','real-TM-000000'))),'');assert.equal(D.setPackText(JSON.stringify(pk('other','別パック','other-U-000000','other-TM-000000'))),'');assert.equal(D.packs().length,2);
 D.setLoad({sample:false,maker:false,packs:['real','other']});const st=dump(w);w.close();w=open(st);{const D=w.PROTacticalData;
  assert.equal(D.missions().map(m=>m.id).join(),'real-TM-000000,other-TM-000000');assert(D.units().some(u=>u.id==='real-U-000000')&&D.units().some(u=>u.id==='other-U-000000'));assert(!D.usesSample);
  const filters=[...w.document.querySelectorAll('[data-filter]')].map(b=>b.textContent);assert.equal(filters.join(),'すべて,タクティカル,ディスパッチ,リアルパック,別パック');
  w.location.hash='#missions';w.dispatchEvent(new w.Event('hashchange'));assert.equal(w.document.querySelectorAll('.mission').length,2);w.document.querySelector('[data-filter="origin:pack:real"]').click();assert.equal([...w.document.querySelectorAll('.mission')].map(b=>b.getAttribute('aria-label')).join(),'リアルパック作戦');
  D.removePack('real');assert.equal(D.packs().map(p=>p.packId).join(),'other');assert.equal(JSON.parse(w.localStorage.getItem('PRO_TACTICAL_LOAD')).packs.join(),'other');}w.close();}
console.log(('PASS: test save (owned units, credits, levels) across reload, several packs at once, mission filter by pack, pack file source, sortie cost, terrain colors, level and EXP rules, mission EXP, level-gated evolution, register / carry settings, register-only fusion, PRO・D EXP, research (days, reservation, cancel, unlocks), shop and storage (gated listing, buy, sell, key and reserved items), save / load (autosave, suspend priority, slots, confirm, import validation, source guard), achievements and battle records (logs, copy), tags (terrain blockTags, item requires, grid search), boarding (pilot bonus, aptitude, skills, sortie limits, shared EXP and fate, PRO・D), skill tree (learn, prerequisites, level, reset, PRO・D), defeat (lost / wrecked, '+SX('repair')+', '+SX('revive')+', dismissal, PRO・D), sortie support (auto lineup, estimate, presets, supply, choices), missions (lock, hidden, rewards, stars, records, recruits, deploy rules), item use (boosts, limits, EXP, base-only effects) and equipment (slots, stats, weapons), production / hire (cost, limit, missions, hidden conditions, registered units), maker draft as '+SX('data')+' source, T&D tactical missions (custom squares, boss / reach / defend / turn limit / unit down, events, talk, choices, reinforcements, withdrawal, terrain and condition changes, objectives, objective chains, areas, impassable squares, AI change, mission list, operation log, in-mission items on supply facilities, terrain effects, game flags and condition sets, maker stars and drops, AI allies, third force, guest merging, facilities: capture, rewards, income, '+SX('repair')+', HQ, battlefield funds, production, sortie gate, exit, AI capture and production, ammo / EN and resupply, carrying, boarding, launch, eject, map-only skills, AI launch and resupply, AI rules (appear turns, areas, tagged capture, targets), carrier care skill, smart targeting, domain switching)'));
