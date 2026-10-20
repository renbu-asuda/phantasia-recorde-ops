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
 L.register('boat');L.renderProduction();two('reg-boat');assert(body().includes('生産・雇用リスト'));run().click();closeW();L.renderProduction();assert(tile('hire-marine'));L.register('scout_ace');L.renderProduction();assert(tile('reg-scout_ace').textContent.includes('4,200Cr'));two('reg-scout_ace');assert.equal(run().textContent,'生産する');assert(body().includes('Lv1'));closeW();two('hire-infantry');assert.equal(run().textContent,'雇用する');closeW();
 saved=dump(w);}
w.close();w=open(saved);assert.equal(w.PROUnitLab.cleared()[0],'training-01');assert.equal(w.PROUnitLab.owned().filter(u=>u.id==='scout').length,4);w.close();
// Research: credits at start, items reserved until completion, days advance with missions, cancel refunds.
w=open({});{const L=w.PROUnitLab,d=w.document,btn=id=>d.querySelector('#researchList [data-research="'+id+'"]'),act=k=>d.querySelector('#labWinActions [data-lab='+k+']'),closeW=()=>[...d.querySelectorAll('#labWinActions button')].find(b=>b.textContent==='閉じる').click();
 L.renderResearch();assert(btn('r-ace').className.includes('blocked'));assert(btn('r-ace').textContent.includes('装甲改良'));assert.equal(L.items().parts,5);
 btn('r-armor').click();assert(d.querySelector('#labWinBody').textContent.includes('完了時に消費'));act('run').click();closeW();assert.equal(L.credits(),22800);assert.equal(L.active().until,3);assert.equal(L.items().parts,5);
 assert(d.querySelector('#researchReserved').textContent.includes('機械部品×3'));assert(btn('r-data').className.includes('blocked'));
 // Reserved parts can't be used by a condition that consumes them.
 assert(!w.PROCore.evalConds({mode:'all',list:[{type:'item_use',itemId:'parts',count:3}]},{items:L.items(),reserved:{items:L.active().reserve}}).ok);
 // Cancel → refund and release; start again.
 btn('r-armor').click();act('stop').click();act('cancel').click();closeW();assert.equal(L.credits(),24800);assert.equal(L.active(),null);
 btn('r-armor').click();act('run').click();closeW();assert.deepEqual([...L.advanceDay()],[]);d.querySelector('#researchDayTest').click();assert(d.querySelector('#noticeText').textContent.includes('装甲改良 が完了'));d.querySelector('#closeNotice').click();
 assert.equal(L.items().parts,2);assert(L.done().includes('r-armor'));assert(L.registered().includes('tank2'));assert.equal(L.day(),3);
 // Missions advance the day: a Dispatch-free check through the Tactical result screen.
 btn('r-data').click();act('run').click();closeW();const F=w.PROField;F.deploy({missionId:'training-01',groups:[{id:'g1',name:'第1部隊',faction:'player',mode:'auto',members:[{uid:'infantry',unit:L.owned().find(u=>u.uid==='infantry')}]}]});const st=F._live();st.groups=st.groups.filter(g=>g.faction==='player');st.outcome='victory';F.showResult();
 assert(d.querySelector('#fieldResultBody').textContent.includes('戦闘記録の解析 が完了'));assert.equal(L.items().data,2);
 L.renderResearch();assert(!btn('r-ace').className.includes('blocked'),btn('r-ace').textContent);btn('r-ace').click();act('run').click();closeW();L.advanceDay(3);assert(L.owned().some(u=>u.id==='scout_ace'));assert.equal(L.items().alloy,0);assert.equal(L.items().data,1);saved=dump(w);}
w.close();w=open(saved);assert.equal(w.PROUnitLab.day(),7);assert.equal(w.PROUnitLab.done().length,3);w.close();
// Shop / storage: gated listing (mission, research), buy, sell at half, key items and reserved items not sellable.
w=open({});{const L=w.PROUnitLab,d=w.document,row=(box,id)=>d.querySelector('#'+box+' [data-item="'+id+'"]'),act=k=>d.querySelector('#labWinActions [data-lab='+k+']'),closeW=()=>[...d.querySelectorAll('#labWinActions button')].find(b=>b.textContent==='閉じる').click();
 L.renderShop();assert(row('shopList','parts'));assert(!row('shopList','alloy'));assert(!row('shopList','repair'));assert(!row('shopList','data'));assert(d.querySelector('#shopSoon').textContent.includes('装甲改良'));
 row('shopList','parts').click();act('buy5').click();assert.equal(L.items().parts,10);assert.equal(L.credits(),22800);act('sell1').click();assert.equal(L.items().parts,9);assert.equal(L.credits(),23000);closeW();
 L.markCleared('training-01');L.renderShop();assert(row('shopList','repair'));
 L.startResearch('r-armor');row('shopList','parts').click();for(let i=0;i<6;i++)act('sell1').click();assert.equal(L.items().parts,3);assert(act('sell1').disabled);closeW();
 L.advanceDay(2);L.renderShop();assert(row('shopList','alloy'));
 L.renderStorage();assert(row('storageList','pass').textContent.includes('★'));row('storageList','pass').click();assert(d.querySelector('#labWinBody').textContent.includes('大切なもの'));closeW();assert(!L.sell('pass'));assert(!row('storageList','parts'));
 assert(d.querySelector('#storageCount').textContent.includes('種類'));saved=dump(w);}
w.close();w=open(saved);assert.equal(w.PROUnitLab.items().pass,1);w.close();
// Item use and equipment: permanent boosts with a per-unit limit, EXP items, base-only effects, equip slots and stats.
w=open({});{const L=w.PROUnitLab,d=w.document,u=id=>L.owned().find(x=>x.uid===id),act=k=>d.querySelector('#labWinActions [data-lab='+k+']'),closeW=()=>[...d.querySelectorAll('#labWinActions button')].find(b=>['閉じる','戻る'].includes(b.textContent)).click();
 const atk0=u('tank').atk;assert.deepEqual([...L.useItem('chip','tank')],['ATK+20']);assert.equal(u('tank').atk,atk0+20);assert.equal(L.items().chip,1);
 assert.equal(typeof L.useItem('chip'),'string');assert(L.useItem('repair','tank').includes('ない')||L.useItem('repair','tank').includes('作戦中'));
 L.useItem('manual','tank');assert.equal(u('tank').level,3);assert.equal(u('tank').exp,0);
 // Storage → 使う → unit grid (two taps) → confirm.
 L.renderStorage();d.querySelector('#storageList [data-item=chip]').click();act('use').click();assert.equal(w.location.hash,'#useitem');L.renderUse();const t=d.querySelector('#useGrid [data-uid=scout]');t.click();d.querySelector('#useGrid [data-uid=scout]').click();act('run').click();assert(d.querySelector('#labWinBody').textContent.includes('ATK+20'));closeW();assert.equal(L.items().chip||0,0);
 // limitPerUnit 3: buy more and use until blocked.
 for(let i=0;i<4;i++)L.buy('chip');for(let i=0;i<2;i++)L.useItem('chip','scout');assert(L.useItem('chip','scout').includes('3回まで'));
 // Equipment: stats and weapons; equipped copies can't be sold or equipped twice.
 const acc0=u('robot').acc;assert(L.equip('robot',0,'scope'));assert.equal(u('robot').acc,acc0+60);assert(!L.equip('fighter',0,'scope'));assert.equal(L.free('scope'),0);assert(!L.sell('scope'));
 const mob0=u('robot').mob,def0=u('robot').def;assert(L.equip('robot',1,'plate'));assert.equal(u('robot').mob,mob0-20);assert.equal(u('robot').def,def0+80);L.buy('launcher');assert(!L.equip('robot',2,'launcher'));L.equip('robot',1,'launcher');assert(u('robot').weapons.some(x=>x.name==='ミサイル'));assert.equal(L.free('plate'),1);
 // Equipment screen: two taps, slot → item list → unequip.
 L.renderEquip();const e=d.querySelector('#equipGrid [data-uid=robot]');e.click();d.querySelector('#equipGrid [data-uid=robot]').click();assert(act('slot0').textContent.includes('精密照準器'));act('slot0').click();act('unequip').click();assert.equal(u('robot').equip[0],null);assert.equal(L.free('scope'),1);closeW();
 // Formation and battle use the boosted, equipped unit.
 assert(d.querySelector('#prepUnitList [data-unit=tank]'));saved=dump(w);}
w.close();w=open(saved);{const u=w.PROUnitLab.owned().find(x=>x.uid==='robot');assert(u.weapons.some(x=>x.name==='ミサイル'));assert.equal(w.PROUnitLab.owned().find(x=>x.uid==='tank').level,3);}w.close();
// Missions: lock / hidden, rewards received on a Tactical victory, stars and first-star bonus, record, recruits,
// PRO・D rewards and recruit-locked units, deploy rules.
w=open({});{const L=w.PROUnitLab,D=w.PROTacticalData,DD=w.PRODispatchData,d=w.document,F=w.PROField;
 assert.equal(L.missionLock(D.mission('training-01')),'');assert(L.missionLock(D.mission('combat-01')).includes('機動訓練'));assert(L.missionHidden(D.mission('combat-02')));
 w.location.hash='#missions';w.dispatchEvent(new w.Event('hashchange'));await new Promise(r=>setTimeout(r,400));assert(!d.querySelector('[aria-label="軌道上の遭遇"]'));d.querySelector('[aria-label="沿岸防衛線"]').click();assert(d.querySelector('#deploy').disabled);assert(!d.querySelector('#detailLock').hidden);
 const c0=L.credits();F.deploy({missionId:'training-01',groups:[{id:'g1',name:'第1部隊',faction:'player',mode:'auto',members:[{uid:'infantry',unit:L.owned().find(u=>u.uid==='infantry')}]}]});const st=F._live();st.groups=st.groups.filter(g=>g.faction==='player');st.outcome='victory';st.turn=4;F.showResult();
 const body=d.querySelector('#fieldResultBody').textContent;assert(body.includes('修理キット ×1'));assert(body.includes('★クリア'));assert(body.includes('★8ターン以内'));assert(body.includes('古参兵'));assert.equal(L.credits(),c0+800+3*160+500);assert(L.achieved()['ach-first']);assert.equal(L.items().repair,1);
 assert.equal(JSON.stringify(L.record('training-01')),JSON.stringify({clears:1,best:4,stars:[true,true,true]}));assert(L.owned().some(u=>u.id==='veteran'));assert.equal(L.missionLock(D.mission('combat-01')),'');assert(L.missionHidden(D.mission('combat-02')));
 // A second clear pays no star bonus again.
 const r2=L.finishMission(D.mission('training-01'),{outcome:'win',turns:9,reward:800});assert.equal(r2.starCredits,0);assert.equal(L.record('training-01').best,4);assert.equal(L.record('training-01').clears,2);
 // Loss: 12% of the reward, no record.
 const r3=L.finishMission(D.mission('combat-01'),{outcome:'lose',turns:3,reward:2400});assert.equal(r3.credits,288);assert.equal(L.record('combat-01').clears,0);
 // PRO・D: recruit-locked unit appears after its mission is cleared; drops and stars go to the save.
 const locked=Object.values(DD.defs).find(u=>u.recruit?.locked&&u.recruit.missionId);if(locked){const m=DD.mission(locked.recruit.missionId);const r=L.finishMission(m,{outcome:'win',turns:5,reward:m.reward,recruitPool:Object.values(DD.defs),itemName:DD.itemName});assert(r.recruits.includes(locked.name));assert(L.recruited().includes(locked.id));}
 // Deploy rules: minimum level.
 assert.equal(L.deployProblem({requires:{minLevel:3}},{tags:[]},2),'Lv3以上が必要');assert.equal(L.deployProblem({requires:{minLevel:3}},{tags:[]},3),'');saved=dump(w);}
w.close();w=open(saved);assert.equal(w.PROUnitLab.record('training-01').clears,2);w.close();
// Sortie support: PRO・D auto lineup, win estimate, presets, supply; story choices with display conditions; Tactical presets and supply.
w=open({});{const L=w.PROUnitLab,DD=w.PRODispatchData,X=w.PRODispatch,d=w.document;const mid=DD.listing()[0].id;X.show(mid);
 X.auto();assert(X.chosen().length>0);assert(X.chosen().length<=DD.mission(mid).maxDeploy);await new Promise(r=>setTimeout(r,300));for(let i=0;i<50&&!/推定勝率 \d/.test(d.querySelector('#dispatchEstimate').textContent);i++)await new Promise(r=>setTimeout(r,50));assert(/推定勝率 \d+%/.test(d.querySelector('#dispatchEstimate').textContent),d.querySelector('#dispatchEstimate').textContent);
 const picked=X.chosen();d.querySelector('#dispatchPresets').click();d.querySelector('#labWinActions [data-preset=save1]').click();X.choose([]);d.querySelector('#dispatchPresets').click();d.querySelector('#labWinActions [data-preset=load1]').click();assert.deepEqual([...X.chosen()],[...picked]);
 // Supply: pick for the first unit; consumed when the sortie starts.
 d.querySelector('[data-supply="'+picked[0]+'"]').click();[...d.querySelectorAll('#labWinActions button')].find(b=>b.textContent.startsWith('戦闘糧食')).click();assert.equal(X.supply()[picked[0]],'stim');
 const p=X.start({watch:false});for(let i=0;i<100&&!d.querySelector('#fieldBattle').open&&!d.querySelector('#labWindow').open;i++){if(d.querySelector('#storyWindow').open)d.querySelector('#storySkip').click();await new Promise(r=>setTimeout(r,20));}
 if(d.querySelector('#labWindow').open)d.querySelector('#labWinActions [data-lab=choice0]')?.click();for(let i=0;i<200&&(!d.querySelector('#fieldBattle').open||d.querySelector('#fieldBattleClose').disabled);i++){if(d.querySelector('#storyWindow').open)d.querySelector('#storySkip').click();await new Promise(r=>setTimeout(r,20));}
 d.querySelector('#fieldBattleClose').click();let fin=false;p.then(()=>{fin=true;});for(let i=0;i<200&&!fin;i++){if(d.querySelector('#storyWindow').open)d.querySelector('#storySkip').click();await new Promise(r=>setTimeout(r,20));}await p;assert.equal(L.items().stim,1);assert.equal(JSON.stringify(X.supply()),'{}');
 // Choices: a choice whose display condition fails is left out; the picked choice's flags are saved.
 L.setFlag('f-test',false);const cp=L.pickChoice('テスト',[{text:'A',flags:{a:true}},{text:'B',conds:{mode:'all',list:[{type:'flag',flagId:'f-test',on:true}]}}]);assert.equal(d.querySelectorAll('#labWinActions button').length,1);d.querySelector('#labWinActions [data-lab=choice0]').click();assert.equal((await cp).text,'A');assert.equal(L.flags().a,true);
 // Tactical presets and supply.
 const P=w.PROPreparation;w.location.hash='#prepare';w.dispatchEvent(new w.Event('hashchange'));await new Promise(r=>setTimeout(r,400));P.addUnit('infantry');P.addUnit('scout');d.querySelector('#prepPresets').click();[...d.querySelectorAll('#prepChoices button')].find(b=>b.textContent.startsWith('保存 2')).click();
 d.querySelector('[data-uid=infantry] [data-supply=infantry]').click();[...d.querySelectorAll('#prepChoices button')].find(b=>b.textContent.startsWith('戦闘糧食')).click();const atk=L.owned().find(u=>u.uid==='infantry').atk;d.querySelector('#prepConfirm').click();
 const dep=w.PROField._live().groups.find(g=>g.faction==='player').members.find(m=>m.uid==='infantry');assert.equal(dep.unit.atk,Math.round(atk*1.2));assert.equal(L.items().stim||0,0);
 assert.equal(L.getPreset('tactical',1).groups[0].members.length,2);}
w.close();
// Defeat: ordinary units are lost, key units (noFire, not hireable) are wrecked and can't sortie until repaired
// (expensive) or revived with an item; dismissal (解雇 / 解体) and its limits; PRO・D losses.
w=open({});{const L=w.PROUnitLab,d=w.document,F=w.PROField,u=id=>L.owned().find(x=>x.uid===id),act=k=>d.querySelector('#labWinActions [data-lab='+k+']'),closeW=()=>[...d.querySelectorAll('#labWinActions button')].find(b=>['閉じる','戻る'].includes(b.textContent)).click();
 L.equip('robot',0,'scope');F.deploy({missionId:'training-01',groups:[{id:'g1',name:'第1部隊',faction:'player',mode:'auto',members:[{uid:'robot',unit:u('robot')},{uid:'scout',unit:u('scout')},{uid:'infantry',unit:u('infantry')}]}]});const st=F._live();
 st.groups=st.groups.filter(g=>g.faction==='player').map(g=>({...g,members:g.members.filter(m=>m.uid==='infantry')}));st.outcome='victory';F.showResult();const body=d.querySelector('#fieldResultBody').textContent;
 assert(body.includes('撃破：偵察車失われた'));assert(body.includes('撃破：汎用機動兵器大破'));assert(!u('scout'));assert.equal(u('robot').down,'wrecked');assert(L.isKey(w.PROTacticalData.unit('robot')));
 // Wrecked units can't be added to a formation.
 w.location.hash='#formation';w.dispatchEvent(new w.Event('hashchange'));await new Promise(r=>setTimeout(r,400));assert(d.querySelector('#prepUnitList [data-unit=robot]').classList.contains('blocked'));assert(d.querySelector('#prepUnitList [data-unit=robot]').getAttribute('aria-label').includes('大破'));
 // Repair screen: cost is high; credits or an item.
 const cost=L.repairCost(u('robot'));assert(cost>=6000,String(cost));L.renderCare();const t=d.querySelector('#careGrid [data-uid=robot]');t.click();d.querySelector('#careGrid [data-uid=robot]').click();assert(act('care').textContent.includes(cost.toLocaleString()));const c0=L.credits();act('care').click();closeW();assert.equal(L.credits(),c0-cost);assert.equal(u('robot').down,null);
 L.handleLosses(['robot']);L.buy('revive');L.renderCare();d.querySelector('#careGrid [data-uid=robot]').click();d.querySelector('#careGrid [data-uid=robot]').click();act('item-revive').click();closeW();assert.equal(u('robot').down,null);assert.equal(L.items().revive||0,0);
 // Dismissal: hire → 解雇, produce → 解体; key units can't be dismissed; equipment goes back.
 L.renderFire();assert(d.querySelector('#fireGrid [data-uid=robot]').classList.contains('blocked'));const f=d.querySelector('#fireGrid [data-uid=tank]');f.click();d.querySelector('#fireGrid [data-uid=tank]').click();assert(act('fire').textContent.includes('解体'));act('fire').click();closeW();assert(!u('tank'));
 assert(L.dismiss('robot').includes('できません'));L.buy('scope');L.equip('medic',0,'scope');assert.equal(L.free('scope'),0);assert.equal(L.dismiss('medic'),'');assert.equal(L.free('scope'),1);
 // PRO・D: a lost unit leaves the sortie list; a noFire unit is badly injured / wrecked.
 const DD=w.PRODispatchData,key=Object.values(DD.defs).find(x=>x.noFire&&x.deploy?.player),plain=DD.players().find(x=>!x.noFire&&!x.recruit?.locked);const out=L.handleDispatchLosses([plain,...(key?[key]:[])]);assert.equal(out[0].result,'lost');assert.equal(L.dispatchState(plain.id),'lost');
 w.PRODispatch.show(DD.listing()[0].id);assert(!d.querySelector('[data-pick="'+plain.id+'"]'));if(key){assert.equal(out[1].result,'down');L.renderCare();assert(d.querySelector('#careGrid [data-uid="d:'+key.id+'"]'));}saved=dump(w);}
w.close();w=open(saved);assert(!w.PROUnitLab.owned().some(x=>x.uid==='scout'));w.close();
// Skill tree: learn with SP (level and prerequisites), skills apply, reset refunds; PRO・D units too.
w=open({});{const L=w.PROUnitLab,d=w.document,u=id=>L.owned().find(x=>x.uid===id),act=k=>d.querySelector('#labWinActions [data-lab="'+k+'"]');
 assert.equal(L.learn('infantry','inf-aim'),'SPが足りません');L.gainExp([{key:'infantry',amount:600}]);assert.equal(u('infantry').level,4);assert.equal(u('infantry').sp,3);
 L.renderTree();const t=d.querySelector('#treeGrid [data-uid=infantry]');t.click();d.querySelector('#treeGrid [data-uid=infantry]').click();assert(act('node-inf-charge').disabled);act('node-inf-aim').click();assert(u('infantry').skills.some(k=>k.name==='狙いを定める'));
 act('node-inf-charge').click();assert.equal(u('infantry').sp,0);assert(act('node-inf-rally').disabled);assert(act('node-inf-rally').textContent.includes('Lv5'));
 act('resetask').click();act('reset').click();assert.equal(u('infantry').sp,3);assert(!u('infantry').skills.some(k=>k.name==='狙いを定める'));
 const jk=Object.values(w.PRODispatchData.defs).find(x=>(x.skillTree||[]).length&&x.deploy?.player&&!x.recruit?.locked);L.gainDispatchExp([{key:jk.id,amount:100}]);const n0=jk.skillTree[0];assert.equal(L.learn('d:'+jk.id,n0.id),'');assert.equal(L.dispatchTreeSkills(jk.id).length,1);assert.equal(L.dispatchLevel(jk.id).sp,1-(n0.cost??1));saved=dump(w);}
w.close();w=open(saved);assert.equal(w.PROUnitLab.owned().find(x=>x.uid==='infantry').sp,3);w.close();
// Boarding: pilot bonus, skills and aptitude; riding pilots and pilot-required machines can't sortie alone;
// shared EXP and shared fate; PRO・D boarding in the battle.
w=open({});{const L=w.PROUnitLab,d=w.document,u=id=>L.owned().find(x=>x.uid===id),act=k=>d.querySelector('#labWinActions [data-lab="'+k+'"]'),closeW=()=>[...d.querySelectorAll('#labWinActions button')].find(b=>b.textContent==='閉じる').click();
 L.renderProduction();const h=d.querySelector('#productionGrid [data-uid=hire-aoi]');h.click();d.querySelector('#productionGrid [data-uid=hire-aoi]').click();act('run').click();closeW();const aoi=L.owned().find(x=>x.id==='aoi').uid;
 const r0=u('robot');L.renderBoard();assert(!d.querySelector('#boardGrid [data-uid="'+aoi+'"]'));const t=d.querySelector('#boardGrid [data-uid=robot]');t.click();d.querySelector('#boardGrid [data-uid=robot]').click();act('pilot-'+aoi).click();closeW();
 const r1=u('robot');assert.equal(r1.pilot.name,'葵');assert.equal(r1.acc,Math.round((r0.acc+60)*1.1));assert.equal(r1.atk,Math.round((r0.atk+40)*1.1));assert.equal(r1.def,r0.def);assert(r1.skills.some(k=>k.name==='見切り'));
 assert(L.crewProblem(aoi).includes('搭乗中'));w.location.hash='#formation';w.dispatchEvent(new w.Event('hashchange'));await new Promise(r=>setTimeout(r,400));assert(d.querySelector('#prepUnitList [data-uid="'+aoi+'"]')?.classList.contains('blocked')??d.querySelector('#prepUnitList [data-unit=aoi]').classList.contains('blocked'));
 // Shared EXP.
 L.gainExp([{key:'robot',amount:250}]);assert.equal(u(aoi).level,2);assert.equal(u('robot').level,2);
 // Pilot-required machine (fusion result) and shared fate (robot is a key unit → wrecked; the pilot is lost).
 assert.equal(L.crewProblem('nope'),'');L.handleLosses(['robot']);assert.equal(u('robot').down,'wrecked');assert(!L.owned().some(x=>x.uid===aoi));assert.equal(JSON.stringify(L.boards()),'{}');
 // PRO・D: a pilot unit boards a crew-required machine; the machine can then sortie.
 const DD=w.PRODispatchData,mech=DD.players().find(x=>x.crew==='required'),pil=DD.players().find(x=>x.pilotProfile&&!x.recruit?.locked);if(mech&&pil){assert(L.crewProblem('d:'+mech.id).includes('パイロットが必要'));assert.equal(L.board('d:'+mech.id,'d:'+pil.id),'');assert.equal(L.crewProblem('d:'+mech.id),'');assert(L.crewProblem('d:'+pil.id).includes('搭乗中'));assert.equal(L.dispatchPilot(mech.id).def.id,pil.id);}
 saved=dump(w);}
w.close();
// Tags: terrain blockTags stop a group with a tagged member; item requires gate equip and use; grid search by name / #tag.
w=open({});{const L=w.PROUnitLab,d=w.document,F=w.PROField,u=id=>L.owned().find(x=>x.uid===id);
 F.deploy({missionId:'training-01',groups:[w.PROTactical.initializeDomains({id:'g1',name:'第1部隊',faction:'player',mode:'auto',members:[{uid:'tank',unit:u('tank')}]},'ground')]});const st=F._live(),me=st.groups.find(g=>g.faction==='player');me.position={x:3,y:1};F.focusGroup('g1');
 const mt=[];for(let y=0;y<9;y++)for(let x=0;x<12;x++)if(w.PROTacticalData.tile('training-01',x,y).kind==='mountain')mt.push(x+','+y);assert(mt.length>0);
 const keys=F.reachable().map(r=>r.key);assert(!mt.some(k=>keys.includes(k)),'tank must not enter mountains');
 me.members[0].unit={...me.members[0].unit,tags:[]};const keys2=F.reachable().map(r=>r.key);assert(mt.some(k=>keys2.includes(k)),'untagged unit can climb');
 assert(!L.equip('infantry',0,'plate'));assert(L.equip('tank',0,'plate'));L.renderEquip();const t=d.querySelector('#equipGrid [data-uid=infantry]');t.click();d.querySelector('#equipGrid [data-uid=infantry]').click();d.querySelector('#labWinActions [data-lab=slot0]').click();const g=d.querySelector('#labWinActions [data-lab=gear-plate]');assert(!g||g.disabled);
 // Grid search.
 w.location.hash='#roster';w.dispatchEvent(new w.Event('hashchange'));await new Promise(r=>setTimeout(r,400));const s=d.querySelector('#unitRoster').previousElementSibling.querySelector('.ug-search');s.value='#車両';s.dispatchEvent(new w.Event('input'));
 const vis=[...d.querySelectorAll('#unitRoster .ug-tile')].filter(t=>!t.hidden).map(t=>t.dataset.unit).sort();assert.deepEqual(vis,['scout','tank']);s.value='戦車 #車両';s.dispatchEvent(new w.Event('input'));assert.equal([...d.querySelectorAll('#unitRoster .ug-tile')].filter(t=>!t.hidden).length,1);
 assert(w.PROUnitGrid.matches({name:'葵',tags:['生身','パイロット']},'#生身'));assert(!w.PROUnitGrid.matches({name:'葵',tags:['生身']},'#車両'));}
w.close();
// Achievements (reward once, hidden until earned) and battle records with logs.
w=open({});{const L=w.PROUnitLab,d=w.document,F=w.PROField,D=w.PROTacticalData,u=id=>L.owned().find(x=>x.uid===id);Object.defineProperty(w.navigator,'clipboard',{configurable:true,value:{writeText:async t=>{w._copied=t;}}});
 F.deploy({missionId:'training-01',groups:[w.PROTactical.initializeDomains({id:'g1',name:'第1部隊',faction:'player',mode:'auto',members:[{uid:'infantry',unit:u('infantry')}]},'ground')]});const st=F._live();st.groups=st.groups.filter(g=>g.faction==='player');st.outcome='victory';st.turn=3;st.missionLog=['テストのログ行'];F.showResult();
 assert(L.achieved()['ach-first']);assert(L.achieved()['ach-train']);assert.equal(L.items().chip,3);const h=L.history()[0];assert.equal(h.id,'training-01');assert.equal(h.outcome,'win');assert.equal(h.stars,3);assert(h.log.includes('テストのログ行'));assert.deepEqual({...L.stats()},{battles:1,win:1,lose:0,draw:0});
 const c=L.credits();L.finishMission(D.mission('training-01'),{outcome:'win',turns:9,reward:0});assert.equal(L.credits(),c);
 d.querySelector('#openAchievements').click();const b=d.querySelector('#labWinBody').textContent;assert(b.includes('★ 初勝利'));assert(!b.includes('資産家'));assert(b.includes('隠し実績 1件'));d.querySelector('#labWinActions button').click();
 d.querySelector('#openHistory').click();assert(d.querySelector('#labWinBody').textContent.includes('出撃 1回'));d.querySelector('#labWinActions [data-lab=hist0]').click();assert(d.querySelector('#labWinBody').textContent.includes('テストのログ行'));d.querySelector('#labWinActions [data-lab=copy]').click();await new Promise(r=>setTimeout(r,20));assert(w._copied.includes('テストのログ行'));
 saved=dump(w);}
w.close();w=open(saved);assert.equal(w.PROUnitLab.history().length,1);assert(w.PROUnitLab.achieved()['ach-first']);w.close();
// Save / load: 3 slots with confirm, export bundle, import validation, maker-source guard.
w=open({});{const L=w.PROUnitLab,S=w.PROSave,d=w.document,btn=k=>d.querySelector('#labWinActions [data-save="'+k+'"]');
 L.buy('chip');const c1=L.credits();d.querySelector('#openSave').click();btn('slot0').click();btn('save').click();assert(S.read(0));assert.equal(S.read(0).summary.credits,c1);assert(btn('load')&&!btn('load').disabled);
 L.buy('chip');assert(L.credits()<c1);btn('save').click();assert(d.querySelector('#labWinTitle').textContent.includes('上書き'));btn('ok').click();assert.equal(S.read(0).summary.credits,L.credits());
 const s1=S.snapshot();assert(S.valid(s1));assert.equal(S.importText('{"format":"x"}'),'セーブデータの形式が違います');assert(S.apply({...s1,source:'maker'},{reload:false}).includes('メーカーの下書き'));
 // Load a slot into a fresh browser: progress and encounters come back.
 const slot=S.read(0);w.close();w=open({});assert.equal(w.PROSave.apply(slot,{reload:false}),'');saved=dump(w);w.close();w=open(saved);assert.equal(w.PROUnitLab.credits(),slot.summary.credits);assert(w.PROUnitsSeen.has('infantry'));
 // Delete.
 w.PROSave.saveSlot(1);w.document.querySelector('#openSave').click();w.document.querySelector('#labWinActions [data-save="slot1"]').click();w.document.querySelector('#labWinActions [data-save="delete"]').click();w.document.querySelector('#labWinActions [data-save="ok"]').click();assert.equal(w.PROSave.read(1),null);}
w.close();
// Autosave (written at mission end, load only) and suspend priority (loading a slot discards the suspend save).
w=open({});{const L=w.PROUnitLab,S=w.PROSave,d=w.document,btn=k=>d.querySelector('#labWinActions [data-save="'+k+'"]');
 assert.equal(S.read('auto'),null);L.finishMission(w.PROTacticalData.mission('training-01'),{outcome:'win',turns:4,reward:800});L.recordBattle(w.PROTacticalData.mission('training-01'),'tactical',null,{outcome:'win',turns:4});assert(S.read('auto'));assert.equal(S.read('auto').summary.wins,1);
 d.querySelector('#openSave').click();btn('slotauto').click();assert(!btn('save'));assert(!btn('delete'));assert(btn('load'));
 w.localStorage.setItem('PRO_TACTICAL_SUSPEND','{"x":1}');d.querySelector('#openSave').click();assert(d.querySelector('#labWinBody').textContent.includes('中断中の作戦'));btn('slotauto').click();btn('load').click();assert(d.querySelector('#labWinBody').textContent.includes('破棄されます'));
 assert.equal(S.apply(S.read('auto'),{reload:false}),'');assert.equal(w.localStorage.getItem('PRO_TACTICAL_SUSPEND'),null);}
w.close();
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
console.log('PASS: test save (owned units, credits, levels) across reload, level and EXP rules, mission EXP, level-gated evolution, register / carry settings, register-only fusion, PRO・D EXP, research (days, reservation, cancel, unlocks), shop and storage (gated listing, buy, sell, key and reserved items), save / load (autosave, suspend priority, slots, confirm, import validation, source guard), achievements and battle records (logs, copy), tags (terrain blockTags, item requires, grid search), boarding (pilot bonus, aptitude, skills, sortie limits, shared EXP and fate, PRO・D), skill tree (learn, prerequisites, level, reset, PRO・D), defeat (lost / wrecked, repair, revive, dismissal, PRO・D), sortie support (auto lineup, estimate, presets, supply, choices), missions (lock, hidden, rewards, stars, records, recruits, deploy rules), item use (boosts, limits, EXP, base-only effects) and equipment (slots, stats, weapons), production / hire (cost, limit, missions, hidden conditions, registered units), maker draft as data source');
