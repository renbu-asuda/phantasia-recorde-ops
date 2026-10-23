import fs from 'node:fs';import path from 'node:path';import assert from 'node:assert/strict';import {Window} from 'happy-dom';
// The built-in tutorial pack (game/prototypes/tactical_pack_sample.js): loads as the built-in pack, opens base menus
// mission by mission (hqUnlock), its missions are winnable, and the T&D maker opens it without issues.
const hub='game/prototypes/tactical_hub.html',hubHtml=fs.readFileSync(hub,'utf8');
function page(file,html,store){const w=new Window({url:'http://localhost/'+file,settings:{enableJavaScriptEvaluation:true,disableJavaScriptFileLoading:true,disableCSSFileLoading:true,suppressInsecureJavaScriptEnvironmentWarning:true}});w.scrollTo=()=>{};
 const warns=[];w.console.warn=(...a)=>warns.push(a.join(' '));w.warns=warns;for(const [k,v] of Object.entries(store))w.localStorage.setItem(k,v);w.document.write(html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/g,''));w.sessionStorage.setItem('PRO_TACTICAL_TITLE_SEEN','1');
 for(const dl of w.document.querySelectorAll('dialog')){dl.showModal=()=>dl.setAttribute('open','');dl.close=()=>{dl.removeAttribute('open');dl.dispatchEvent(new w.Event('close'));};}
 {const C=w.HTMLCanvasElement?.prototype;if(C){C.getContext=()=>({fillRect(){},set fillStyle(v){}});C.toDataURL=()=>'data:image/png;base64,UElY';}}
 for(const m of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/g)){const src=/src=["']([^"']+)["']/.exec(m[1]);w.eval(src?fs.readFileSync(path.resolve(path.dirname(file),src[1]),'utf8'):m[2]);}return w;}
const open=(store={})=>page(hub,hubHtml,{PRO_TACTICAL_LOAD:JSON.stringify({sample:true,maker:false,packs:[]}),...store});
const dump=w=>Object.fromEntries(Object.keys(w.localStorage).map(k=>[k,w.localStorage.getItem(k)]));
const id=(code,n)=>'sample-'+code+'-'+String(n).padStart(6,'0'),T1=id('TM',1),T2=id('TM',2),T3=id('TM',3),T4=id('TM',4),T5=id('TM',5),T6=id('TM',6),T7=id('TM',7),T8=id('TM',8),T9=id('TM',9),T10=id('TM',10),D1=id('DM',1),D2=id('DM',2),FAME=id('V',1);
const PACK=(()=>{const x={};new Function('window',fs.readFileSync('game/prototypes/tactical_pack_sample.js','utf8'))(x);return x.PROTacticalSamplePack;})();
assert.equal(PACK.format,'PRO_TD_PACK');assert.equal(PACK.packId,'sample');

// 1) Built-in pack: every mission is read (none skipped), the starting roster leaves out units that join later.
let w=open();let D=w.PROTacticalData,L=w.PROUnitLab;
assert.deepEqual(w.warns.filter(x=>/skipped/.test(x)),[]);assert.equal(D.source,'sample');assert.equal(D.origins().map(o=>o.id).join(),'sample');assert.equal(D.sampleName,'内蔵パック（第零機甲教導隊）');
assert.equal(D.missions().map(m=>m.code).join(),'T1,T2,T3,T4,T5,T6,T7,T8,T9,T10');assert.equal(D.legacySample,false);assert.equal(w.PRODispatchData.listing().map(m=>m.id).join(),D1+','+D2,'only the pack\'s PRO・D missions');
assert.equal(D.roster().map(u=>u.name).join(),'ヴァルキス,教導歩兵分隊,ハウンド偵察車');assert.equal(L.owned().length,3);assert(!L.owned().some(o=>o.id===id('U',4)),'the tank joins after T1');
assert.equal(w.document.getElementById('dataSourceText').textContent,'内蔵パック（第零機甲教導隊）');
// Missions open in order.
assert(L.missionLock(D.mission(T2)).includes('初陣'));assert(L.missionLock(D.mission(T3)));assert.equal(L.missionLock(D.mission(T1)),'');

// 2) Base menus: closed until their mission is cleared; a closed page goes back to its menu.
assert(L.hqLock('shop').includes('初陣'));assert(L.hqLock('production').includes('部隊を組む'));assert(L.hqLock('research').includes('拠点を押さえろ'));assert(L.hqLock('equip').includes('増援を断て'));assert(L.hqLock('tree'));assert(L.hqLock('evolve').includes('空と海'));assert(L.hqLock('fusion').includes('格納庫奪取'));assert(L.hqLock('captives').includes('包囲せよ'));
const $=x=>w.document.getElementById(x),btn=h=>w.document.querySelector('.cmd-list [data-go="'+h+'"]');
// Menu buttons set the hash; the page follows on hashchange (dispatched here, as happy-dom does not).
const go=async h=>{w.location.hash=h;w.dispatchEvent(new w.HashChangeEvent('hashchange'));await new Promise(r=>setTimeout(r,30));};
await go('#facility');assert(btn('#shop').disabled);assert(btn('#shop').textContent.includes('🔒'));assert(!btn('#storage').disabled);
await go('#shop');assert.equal(w.location.hash,'#facility','a closed menu goes back');w.dispatchEvent(new w.HashChangeEvent('hashchange'));await new Promise(r=>setTimeout(r,30));assert($('shopView').hidden);assert(!$('facilityView').hidden);
await go('#units');assert(btn('#production').disabled);assert(btn('#tree').disabled);assert(btn('#fusion').disabled);assert($('openCaptives').disabled);assert(!btn('#board').disabled);
// Clearing T1 opens the shop and brings the tank.
const rep=L.finishMission(D.mission(T1),{outcome:'win',turns:3,reward:1200});assert.deepEqual([...rep.recruits],['ガルム戦車']);assert(L.owned().some(o=>o.id===id('U',4)));
assert.equal(L.hqLock('shop'),'');assert.equal(L.missionLock(D.mission(T2)),'');await go('#facility');assert(!btn('#shop').disabled);assert(!btn('#shop').textContent.includes('🔒'));
await go('#shop');assert.equal(w.location.hash,'#shop');assert(!$('shopView').hidden);
// The state survives a reload.
w=open(dump(w));D=w.PROTacticalData;L=w.PROUnitLab;assert.equal(L.hqLock('shop'),'');assert(L.hqLock('production'));assert.equal(L.owned().length,4);
// The shop sells the repair kit now; the extra armour waits for T3.
L.renderShop();assert(w.document.getElementById('shopView').textContent.includes('修理キット'));

// 3) Each mission starts with the guide's talk and can be won: the player's squads are run by the ally AI
// (a stand-in for the player), with a far, tough decoy keeping the player side on the map. In T6 the Valkis transforms
// into its flying form first (through the map command), as the AI does not.
const U=n=>id('U',n);
async function autoPlay(mid,squads,transform,pilots){const w=open();const L=w.PROUnitLab,F=w.PROField,T=w.PROTactical,D=w.PROTacticalData;
 const sq=squads.map(list=>list.map(n=>{L.addOwned(U(n));return L.owned().filter(x=>x.id===U(n)).at(-1);}));
 // From T7 the captain rides the Valkis and the operator the tank (boarded at the base).
 if(pilots){for(const n of [30,31])L.addOwned(U(n));const o=L.owned(),uid=n=>o.find(x=>x.id===U(n)).uid;assert.equal(L.board(uid(1),uid(30)),'');assert.equal(L.board(uid(4),uid(31)),'');for(const l of sq)for(let i=0;i<l.length;i++)l[i]=L.owned().find(x=>x.uid===l[i].uid);}
 F.deploy({missionId:mid,groups:sq.map((os,i)=>({id:'g'+i,name:'第'+(i+1)+'部隊',faction:'player',mode:'auto',members:os.map(o=>({uid:o.uid,unit:o}))}))});let s=F._live();
 const said=F.opLog().filter(e=>e.k==='event').map(e=>e.s);assert(said[0]?.match(/^(カザマ|ゴウ)「/),mid+': a guide opens the mission');assert(said.some(x=>x.startsWith('リコ「')),mid+': the operator explains');s.talkQueue=[];
 if(transform){const g=s.groups.find(g=>g.members.some(x=>x.unit.id===U(1)));F.pick(g.position.x,g.position.y);w.document.getElementById('fieldTransform').click();const b=w.document.querySelector('[data-form$=">'+U(6)+'"]');assert(b&&!b.disabled,'the Valkis can transform');b.click();
  s=F._live();const m=s.groups.find(x=>x.id===g.id).members[0];assert.equal(m.unit.id,U(6));assert.equal(m.domain,'air','the flying form takes to the air');}
 for(const g of s.groups.filter(g=>g.faction==='player')){g.faction='ally';g.ai={pattern:'assault',target:'lowest_hp'};delete g.guest;}
 const m=D.mission(mid),decoy=T.initializeDomains({id:'decoy',name:'decoy',faction:'player',mode:'auto',members:[{uid:'decoy-0',unit:{...sq[0][0],hp:999999,def:99999,weapons:[]}}]},'ground');decoy.position={x:0,y:m.map.height-1};s.groups.push(decoy);
 for(let t=0;t<16&&!F._live().outcome;t++){F._live().talkQueue=[];await F.endTurn();}
 const st=F._live();return {turn:st.turn,outcome:st.outcome,enemies:st.groups.filter(g=>g.faction==='enemy').length,alive:st.groups.filter(g=>g.faction==='ally').reduce((n,g)=>n+T.living(g).length,0)};}
// [mission, squads (unit numbers), turns at most, units alive at least, transform]
for(const [mid,squads,maxTurn,minAlive,tf,pl] of [[T10,[[1,4,3,2],[23,9],[2,2],[7]],15,2,false,true],[T7,[[1,4,3,2],[9,2]],11,4,false,true],[T8,[[1,4,3,2],[9,2]],10,4,false,true],[T9,[[1,4,3],[23,2],[9,2]],12,4,false,true],[T1,[[1],[2],[3]],5,3],[T2,[[1],[2],[3],[4]],8,3],[T3,[[1,2],[4,3],[2]],10,3],[T4,[[1,4,3,2],[2,2]],10,3],[T5,[[1,4,3,2],[7]],16,4],[T6,[[4,3,2,2],[1],[8]],8,4,true]]){
 const r=await autoPlay(mid,squads,tf,pl);assert.equal(r.outcome,'victory',mid+' not won: '+JSON.stringify(r));assert(r.turn<=maxTurn,mid+' too slow: '+JSON.stringify(r));assert(r.alive>=minAlive,mid+' too many losses: '+JSON.stringify(r));}
// A water unit can sortie on a ground map from a sea start, and enemy aircraft and boats start in their own domains.
{const w=open();const L=w.PROUnitLab,F=w.PROField;L.addOwned(U(8));const boat=L.owned().find(x=>x.id===U(8)),inf=L.owned().find(x=>x.id===U(2));
 F.deploy({missionId:T6,groups:[{id:'a',name:'A',faction:'player',mode:'auto',members:[{uid:boat.uid,unit:boat}]},{id:'b',name:'B',faction:'player',mode:'auto',members:[{uid:inf.uid,unit:inf}]}]});const s=F._live();
 const a=s.groups.find(g=>g.id==='a'),b=s.groups.find(g=>g.id==='b');assert.deepEqual([a.position.x,a.position.y],[4,4],'the boat takes the sea start');assert.equal(a.members[0].domain,'water');assert.equal(b.members[0].domain,'ground');
 assert.equal(s.groups.find(g=>g.id==='t6-h1').members[0].domain,'air');assert.equal(s.groups.find(g=>g.id==='t6-boss').members[0].domain,'water');}

// The captain's 指揮 rides with him: the Valkis he boards supports its squad (map part of a pilot skill).
{const w=open();const L=w.PROUnitLab;for(const n of [30])L.addOwned(U(n));const o=L.owned(),v=o.find(x=>x.id===U(1));assert.equal(L.board(v.uid,o.find(x=>x.id===U(30)).uid),'');
 const vu=L.owned().find(x=>x.uid===v.uid);assert.equal(w.PROSupport.partsOf(vu.skills).length,1,'the support part reaches the machine');assert.equal(w.PROSupport.partsOf(vu.skills)[0].reach,3);}
// T8: capturing the hangar seizes the squads still inside.
{const w=open();const L=w.PROUnitLab,F=w.PROField,T=w.PROTactical;for(let i=0;i<2;i++)L.addOwned(U(2));const inf=L.owned().filter(x=>x.id===U(2));
 F.deploy({missionId:T8,groups:[{id:'g',name:'歩兵隊',faction:'player',mode:'auto',members:inf.map(o=>({uid:o.uid,unit:o}))}]});const s=F._live();s.talkQueue=[];s.groups=s.groups.filter(g=>g.faction==='player'||g.stored||F._live().stored);
 const g=s.groups.find(x=>x.id==='g');g.position={x:11,y:4};F.pick(11,4);F.capture();assert.equal(F.fac(11,4).owner,'player','three infantry squads take the hangar in one go');
 assert.equal((F._live().seized||[]).length,4,'the two squads inside are seized: '+JSON.stringify(F._live().seized));assert.equal(F.checkOutcome(),'victory');}
// T9: surrounding the ace's squad on four sides lets a squad seize it, pilot included.
{const w=open();const L=w.PROUnitLab,F=w.PROField;for(let i=0;i<3;i++)L.addOwned(U(2));const inf=L.owned().filter(x=>x.id===U(2));
 F.deploy({missionId:T9,groups:inf.map((o,i)=>({id:'g'+i,name:'第'+(i+1)+'部隊',faction:'player',mode:'auto',members:[{uid:o.uid,unit:o}]}))});const s=F._live();s.talkQueue=[];
 [[6,4],[8,4],[7,3],[7,5]].forEach(([x,y],i)=>{s.groups.find(g=>g.id==='g'+i).position={x,y};});const ace=s.groups.find(g=>g.id==='t9-ace');ace.members[0].currentHp=1;
 w.Math.random=()=>0;F.pick(6,4);assert(!w.document.getElementById('fieldSeize').hidden,'seize command shown');w.document.getElementById('fieldSeize').click();w.document.querySelector('[data-seize="t9-ace"]').click();
 const got=F._live().seized||[];assert.equal(got.length,1);assert.equal(got[0].unitId,U(40));assert.equal(got[0].pilot?.unit,U(41),'the ace comes along');assert(!F._live().groups.some(g=>g.id==='t9-ace'));
 const boss=F._live().groups.find(g=>g.id==='t9-boss');assert(boss.members.some(m=>m.unit.noCapture),'the commander cannot be captured');}
// Base menus with condition sets (and an older pack's mission id): closed until the set holds; nothing is spent.
{const pack={format:'PRO_TD_PACK',version:1,packId:'hq-test',name:'解放テスト',dependencies:[],units:[{id:'hq-u',name:'試験機',hp:1000,atk:100,def:50,mob:100,acc:400,weaponIds:[],skillIds:[],deploy:{player:true}}],tmissions:[],
  hqUnlock:{shop:'hq-missing',fusion:{mode:'all',list:[{type:'credits_have',value:50000}]},tree:{mode:'any',list:[{type:'flag',flagId:'hq-f'},{type:'wins_total',value:3}]}}};
 const w=open({PRO_TACTICAL_LOAD:JSON.stringify({sample:false,maker:false,packs:['hq-test']}),PRO_TACTICAL_PACK_FILES:JSON.stringify([pack])});const L=w.PROUnitLab;
 assert(L.hqLock('shop').includes('hq-missing'),L.hqLock('shop'));assert.equal(L.hqLock('fusion'),'条件：資金50000以上');assert(L.hqLock('tree').includes('「hq-f」が立っている')&&L.hqLock('tree').includes('または'),L.hqLock('tree'));assert.equal(L.hqLock('equip'),'');
 L.spend(-60000);assert.equal(L.hqLock('fusion'),'');const before=w.document.getElementById('hubCredits').textContent;L.hqLock('fusion');assert.equal(w.document.getElementById('hubCredits').textContent,before,'nothing is spent');}

// T10: the mercenaries turn on the player at turn 3; the ending follows 評判 (the game value plus this mission's changes).
{const w=open();const L=w.PROUnitLab,F=w.PROField;const o=L.owned()[0];F.deploy({missionId:T10,groups:[{id:'g',name:'A',faction:'player',mode:'auto',members:[{uid:o.uid,unit:o}]}]});let s=F._live();s.talkQueue=[];
 assert.equal(s.groups.find(g=>g.id==='t10-merc').faction,'ally');assert(F.opLog().some(e=>/評判はいま \d+/.test(e.s)),'{評判} is filled in');
 for(let t=0;t<2;t++){F._live().talkQueue=[];await F.endTurn();}assert.equal(F._live().groups.find(g=>g.id==='t10-merc')?.faction??'enemy','enemy','betrayal at turn 3');assert(F.opLog().some(e=>e.s.includes('寝返')));}
async function ending(fame){const w=open();const L=w.PROUnitLab,F=w.PROField;L.changeVars([{varId:FAME,op:'set',value:fame}]);const o=L.owned()[0];F.deploy({missionId:T10,groups:[{id:'g',name:'A',faction:'player',mode:'auto',members:[{uid:o.uid,unit:o}]}]});const s=F._live();s.talkQueue=[];
 s.groups=s.groups.filter(g=>g.id!=='t10-boss');s.pending=[];assert.equal(F.checkOutcome(),'victory');return F.opLog().filter(e=>e.k==='event').map(e=>e.s).join('\n');}
{const hi=await ending(9),mid=await ending(6),lo=await ending(2);assert(hi.includes('正式な独立部隊'),hi);assert(!hi.includes('次の新人'));assert(mid.includes('次の新人'),mid);assert(lo.includes('名声のために戦ったわけではない'),lo);assert(hi.includes('評判は 10'),'the win adds 1 before the ending');}
// D1 / D2: PRO・D missions of the pack, opened by T3 / T7; a win raises 評判. Achievements follow the save.
{const w=open();const L=w.PROUnitLab,DD=w.PRODispatchData,X=w.PRODispatch,d=w.document;assert(L.missionLock(DD.mission(D1)),'D1 waits for T3');for(const m of [T1,T2,T3])L.finishMission(w.PROTacticalData.mission(m),{outcome:'win',turns:3});assert.equal(L.missionLock(DD.mission(D1)),'');assert(L.missionLock(DD.mission(D2)));
 assert(L.achieved()[id('A',1)],'achievement 初陣');const fame0=L.vars()[FAME]||0;X.show(D1);X.auto();assert(X.chosen().length>0);w.Math.random=()=>0.5;
 const p=X.start({watch:false});let fin=false;p.then(()=>{fin=true;});for(let i=0;i<400&&!fin;i++){if(d.querySelector('#storyWindow').open)d.querySelector('#storySkip').click();if(d.querySelector('#fieldBattle').open&&!d.querySelector('#fieldBattleClose').disabled)d.querySelector('#fieldBattleClose').click();await new Promise(r=>setTimeout(r,20));}const r=await p;
 assert.equal(r?.outcome,'win','D1 is won with the starting units: '+JSON.stringify(r));assert.equal(L.vars()[FAME],fame0+1,'評判 +1');assert(L.achieved()[id('A',3)],'achievement 派遣の心得');
 // The medal raises 評判 when used at the base.
 L.finishMission({id:'medal',name:'medal'},{outcome:'win',turns:1,itemsWon:{[id('I',5)]:1}});const f1=L.vars()[FAME];assert(Array.isArray(L.useItem(id('I',5))),'the medal is used');assert.equal(L.vars()[FAME],f1+1);assert.equal(L.items()[id('I',5)]||0,0);}

// 4) The T&D maker opens the pack as a draft and finds nothing to fix.
{const file='game/prototypes/maker_td.html',mw=page(file,fs.readFileSync(file,'utf8'),{PRO_TD_MAKER_DRAFT:JSON.stringify(PACK)});await new Promise(r=>setTimeout(r,50));const M=mw.PROMakerTD;
 const out=[];for(const k of ['units','weapons','skills','items','research','hires','evolutions','fusions','commands','achievements','missions','terrains','vars','tmissions'])for(const x of M.data()[k]||[])for(const e of M.issues(k,x))out.push(k+' '+(x.name||x.id)+'：'+e);
 assert.deepEqual(out,[]);assert.equal(M.data().hqUnlock.shop.list[0].missionId,T1);assert.equal(M.data().hqUnlock.captives.list[0].missionId,T9);assert.equal(M.data().tmissions.length,10);assert.equal(M.data().missions.length,2);
 for(const k of ['fusions','commands'])for(const x of M.data()[k])assert.equal(M.issues(k,x).join(),'',k+' '+x.name);}
// An older draft's mission id becomes a condition set (that mission cleared).
{const file='game/prototypes/maker_td.html',draft={...PACK,hqUnlock:{shop:T1}},mw=page(file,fs.readFileSync(file,'utf8'),{PRO_TD_MAKER_DRAFT:JSON.stringify(draft)});await new Promise(r=>setTimeout(r,50));const M=mw.PROMakerTD;
 assert.deepEqual(JSON.parse(JSON.stringify(M.data().hqUnlock.shop)),{mode:'all',list:[{type:'mission_clear',missionId:T1}]});
 // Pack settings: a menu's condition set; 作戦をクリア済み lists tactical missions and names them.
 const d=mw.document,$=x=>d.getElementById(x),btn=(root,name)=>[...root.querySelectorAll('button')].find(b=>b.textContent.includes(name));
 M.openKind('pack');await new Promise(r=>setTimeout(r,400));d.querySelector('[data-field="hqUnlock.fusion"]').click();btn($('inputActions'),'条件を追加').click();d.querySelector('[data-ctype=mission_clear]').click();d.querySelector('[data-cfield=missionId]').click();
 const opt=d.querySelector('[data-choice="'+T8+'"]');assert(opt&&opt.textContent.includes('［タクティカル］格納庫奪取'),opt?.textContent);opt.click();assert(d.querySelector('[data-cfield=missionId]').textContent.includes('格納庫奪取'));
 btn($('inputActions'),'戻る').click();btn($('inputActions'),'決定').click();assert.equal(M.data().hqUnlock.fusion.list.at(-1).missionId,T8);
 // A dispatch mission's 'clear first' list shows and offers tactical missions.
 M.openKind('missions',D1);await new Promise(r=>setTimeout(r,400));const rf=d.querySelector('[data-field="requires.missions"]');assert(rf.textContent.includes('拠点を押さえろ'),rf.textContent);rf.click();assert(d.getElementById('inputBody').textContent.includes('［タクティカル］初陣'));btn($('inputActions'),'戻る').click();assert.equal(M.issues('tmissions',M.find('tmissions',T8)).join(),'');}
console.log('tutorial pack: PASS');
