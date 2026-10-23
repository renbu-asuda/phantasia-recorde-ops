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
const id=(code,n)=>'sample-'+code+'-'+String(n).padStart(6,'0'),T1=id('TM',1),T2=id('TM',2),T3=id('TM',3),T4=id('TM',4),T5=id('TM',5),T6=id('TM',6);
const PACK=(()=>{const x={};new Function('window',fs.readFileSync('game/prototypes/tactical_pack_sample.js','utf8'))(x);return x.PROTacticalSamplePack;})();
assert.equal(PACK.format,'PRO_TD_PACK');assert.equal(PACK.packId,'sample');

// 1) Built-in pack: every mission is read (none skipped), the starting roster leaves out units that join later.
let w=open();let D=w.PROTacticalData,L=w.PROUnitLab;
assert.deepEqual(w.warns.filter(x=>/skipped/.test(x)),[]);assert.equal(D.source,'sample');assert.equal(D.origins().map(o=>o.id).join(),'sample');assert.equal(D.sampleName,'内蔵パック（第零機甲教導隊）');
assert.equal(D.missions().map(m=>m.code).join(),'T1,T2,T3,T4,T5,T6');assert.equal(D.legacySample,false);assert.equal(w.PRODispatchData.listing().length,0,'no published PRO・D missions with the tutorial pack');
assert.equal(D.roster().map(u=>u.name).join(),'ヴァルキス,教導歩兵分隊,ハウンド偵察車');assert.equal(L.owned().length,3);assert(!L.owned().some(o=>o.id===id('U',4)),'the tank joins after T1');
assert.equal(w.document.getElementById('dataSourceText').textContent,'内蔵パック（第零機甲教導隊）');
// Missions open in order.
assert(L.missionLock(D.mission(T2)).includes('初陣'));assert(L.missionLock(D.mission(T3)));assert.equal(L.missionLock(D.mission(T1)),'');

// 2) Base menus: closed until their mission is cleared; a closed page goes back to its menu.
assert(L.hqLock('shop').includes('初陣'));assert(L.hqLock('production').includes('部隊を組む'));assert(L.hqLock('research').includes('拠点を押さえろ'));assert(L.hqLock('equip').includes('増援を断て'));assert(L.hqLock('tree'));assert(L.hqLock('evolve').includes('空と海'));assert.equal(L.hqLock('fusion'),'');
const $=x=>w.document.getElementById(x),btn=h=>w.document.querySelector('.cmd-list [data-go="'+h+'"]');
// Menu buttons set the hash; the page follows on hashchange (dispatched here, as happy-dom does not).
const go=async h=>{w.location.hash=h;w.dispatchEvent(new w.HashChangeEvent('hashchange'));await new Promise(r=>setTimeout(r,30));};
await go('#facility');assert(btn('#shop').disabled);assert(btn('#shop').textContent.includes('🔒'));assert(!btn('#storage').disabled);
await go('#shop');assert.equal(w.location.hash,'#facility','a closed menu goes back');w.dispatchEvent(new w.HashChangeEvent('hashchange'));await new Promise(r=>setTimeout(r,30));assert($('shopView').hidden);assert(!$('facilityView').hidden);
await go('#units');assert(btn('#production').disabled);assert(btn('#tree').disabled);assert(!btn('#fusion').disabled);
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
async function autoPlay(mid,squads,transform){const w=open();const L=w.PROUnitLab,F=w.PROField,T=w.PROTactical,D=w.PROTacticalData;
 const sq=squads.map(list=>list.map(n=>{L.addOwned(U(n));return L.owned().filter(x=>x.id===U(n)).at(-1);}));
 F.deploy({missionId:mid,groups:sq.map((os,i)=>({id:'g'+i,name:'第'+(i+1)+'部隊',faction:'player',mode:'auto',members:os.map(o=>({uid:o.uid,unit:o}))}))});let s=F._live();
 const said=F.opLog().filter(e=>e.k==='event').map(e=>e.s);assert(said[0]?.match(/^(カザマ|ゴウ)「/),mid+': a guide opens the mission');assert(said.some(x=>x.startsWith('リコ「')),mid+': the operator explains');s.talkQueue=[];
 if(transform){const g=s.groups.find(g=>g.members.some(x=>x.unit.id===U(1)));F.pick(g.position.x,g.position.y);w.document.getElementById('fieldTransform').click();const b=w.document.querySelector('[data-form$=">'+U(6)+'"]');assert(b&&!b.disabled,'the Valkis can transform');b.click();
  s=F._live();const m=s.groups.find(x=>x.id===g.id).members[0];assert.equal(m.unit.id,U(6));assert.equal(m.domain,'air','the flying form takes to the air');}
 for(const g of s.groups.filter(g=>g.faction==='player')){g.faction='ally';g.ai={pattern:'assault',target:'lowest_hp'};delete g.guest;}
 const m=D.mission(mid),decoy=T.initializeDomains({id:'decoy',name:'decoy',faction:'player',mode:'auto',members:[{uid:'decoy-0',unit:{...sq[0][0],hp:999999,def:99999,weapons:[]}}]},'ground');decoy.position={x:0,y:m.map.height-1};s.groups.push(decoy);
 for(let t=0;t<16&&!F._live().outcome;t++){F._live().talkQueue=[];await F.endTurn();}
 const st=F._live();return {turn:st.turn,outcome:st.outcome,enemies:st.groups.filter(g=>g.faction==='enemy').length,alive:st.groups.filter(g=>g.faction==='ally').reduce((n,g)=>n+T.living(g).length,0)};}
// [mission, squads (unit numbers), turns at most, units alive at least, transform]
for(const [mid,squads,maxTurn,minAlive,tf] of [[T1,[[1],[2],[3]],5,3],[T2,[[1],[2],[3],[4]],8,3],[T3,[[1,2],[4,3],[2]],10,3],[T4,[[1,4,3,2],[2,2]],10,3],[T5,[[1,4,3,2],[7]],16,4],[T6,[[4,3,2,2],[1],[8]],8,4,true]]){
 const r=await autoPlay(mid,squads,tf);assert.equal(r.outcome,'victory',mid+' not won: '+JSON.stringify(r));assert(r.turn<=maxTurn,mid+' too slow: '+JSON.stringify(r));assert(r.alive>=minAlive,mid+' too many losses: '+JSON.stringify(r));}
// A water unit can sortie on a ground map from a sea start, and enemy aircraft and boats start in their own domains.
{const w=open();const L=w.PROUnitLab,F=w.PROField;L.addOwned(U(8));const boat=L.owned().find(x=>x.id===U(8)),inf=L.owned().find(x=>x.id===U(2));
 F.deploy({missionId:T6,groups:[{id:'a',name:'A',faction:'player',mode:'auto',members:[{uid:boat.uid,unit:boat}]},{id:'b',name:'B',faction:'player',mode:'auto',members:[{uid:inf.uid,unit:inf}]}]});const s=F._live();
 const a=s.groups.find(g=>g.id==='a'),b=s.groups.find(g=>g.id==='b');assert.deepEqual([a.position.x,a.position.y],[4,4],'the boat takes the sea start');assert.equal(a.members[0].domain,'water');assert.equal(b.members[0].domain,'ground');
 assert.equal(s.groups.find(g=>g.id==='t6-h1').members[0].domain,'air');assert.equal(s.groups.find(g=>g.id==='t6-boss').members[0].domain,'water');}

// 4) The T&D maker opens the pack as a draft and finds nothing to fix.
{const file='game/prototypes/maker_td.html',mw=page(file,fs.readFileSync(file,'utf8'),{PRO_TD_MAKER_DRAFT:JSON.stringify(PACK)});await new Promise(r=>setTimeout(r,50));const M=mw.PROMakerTD;
 const out=[];for(const k of ['units','weapons','skills','items','research','hires','evolutions','terrains','vars','tmissions'])for(const x of M.data()[k]||[])for(const e of M.issues(k,x))out.push(k+' '+(x.name||x.id)+'：'+e);
 assert.deepEqual(out,[]);assert.equal(M.data().hqUnlock.shop,T1);assert.equal(M.data().hqUnlock.evolve,T6);assert.equal(M.data().tmissions.length,6);}
console.log('tutorial pack: PASS');
