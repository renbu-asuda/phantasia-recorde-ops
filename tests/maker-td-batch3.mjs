import fs from 'node:fs';import path from 'node:path';import assert from 'node:assert/strict';import {Window} from 'happy-dom';
// T&D maker regressions #257–#261, #271, #273, #274 (a native draft loaded into the maker).
const file='game/prototypes/maker_td.html',html=fs.readFileSync(file,'utf8'),wins=[];
const grid=(w,h)=>Array.from({length:h},()=>Array(w).fill('p'));
const W=(id,name)=>({id,name,attackType:'ranged',damageType:'physical'});
const draft={format:'PRO_TD_PACK',version:1,packId:'t',name:'T',skills:[],terrains:[],flags:[],missions:[],research:[],hires:[],evolutions:[],fusions:[],achievements:[],
 units:[{id:'t-a',name:'A',hp:4000,atk:500,def:200,mob:100,acc:500,weaponIds:['t-w0'],skillIds:[],deploy:{player:true,enemy:true}},{id:'t-child',name:'child',base:'t-a'}],
 weapons:[W('t-w0','w0'),W('t-w1','w1'),W('t-w2','w2'),W('t-w3','w3')],items:[{id:'t-gear',name:'装備',price:1,equip:{stats:{},weaponIds:['t-w0','t-w1','t-w2','t-w3']}}],
 images:[{id:'t-img',name:'絵',size:16,palette:['#000000','#ffffff'],px:'.'.repeat(256)}],
 tmissions:[{id:'t-m',name:'M',kind:'combat',map:{width:8,height:6,grid:grid(8,6)},playerStarts:[{x:0,y:0}],enemies:[{id:'eg',name:'敵',position:{x:7,y:5},members:[{unit:'t-a'}]}],areas:[{id:'area-1',name:'旧',x:4,y:4,w:1,h:1}],victory:{type:'reach',area:'area-1',x:4,y:4,w:1,h:1},defeat:{type:'player_wipe'}}]};
function open(store={}){const w=new Window({url:'http://localhost/'+file,settings:{enableJavaScriptEvaluation:true,disableJavaScriptFileLoading:true,disableCSSFileLoading:true,suppressInsecureJavaScriptEnvironmentWarning:true}});wins.push(w);w.scrollTo=()=>{};
 w.localStorage.setItem('PRO_TD_MAKER_DRAFT',JSON.stringify(draft));for(const [k,v] of Object.entries(store))w.localStorage.setItem(k,v);w.document.write(html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/g,''));
 for(const dl of w.document.querySelectorAll('dialog')){dl.showModal=()=>dl.setAttribute('open','');dl.close=()=>{dl.removeAttribute('open');dl.dispatchEvent(new w.Event('close'));};}
 {const C=w.HTMLCanvasElement?.prototype;if(C){C.getContext=()=>({fillRect(){},set fillStyle(v){}});C.toDataURL=()=>'data:image/png;base64,UElY';}}
 for(const m of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/g)){const src=/src=["']([^"']+)["']/.exec(m[1]);w.eval(src?fs.readFileSync(path.resolve(path.dirname(file),src[1]),'utf8'):m[2]);}return w;}
const tick=()=>new Promise(r=>setTimeout(r,50));
try{
 {const w=open();await tick();const d=w.document,$=id=>d.getElementById(id),M=w.PROMakerTD,button=(root,name)=>[...root.querySelectorAll('button')].find(b=>b.textContent.includes(name)),ok=()=>button($('inputActions'),'決定').click();
  // #274: a loop in the skill tree's prerequisites is reported.
  assert(M.issues('units',{name:'u',skillTree:[{id:'n1',skillId:'s',requires:['n2']},{id:'n2',skillId:'s',requires:['n1']}]}).some(t=>t.includes('循環')),'loop');assert(!M.issues('units',{name:'u',skillTree:[{id:'n1',requires:[]},{id:'n2',requires:['n1']},{id:'n3',requires:['n1','n2']}]}).some(t=>t.includes('循環')),'no loop');
  // #260: the test battle reads a derived unit like the game (inherited stats / weapons).
  const def=M.battleDef(M.find('units','t-child'));assert.equal(def.hp,4000);assert.equal(def.atk,500);assert.equal(def.weapons[0].name,'w0');
  // #259: IDs renamed because of a clash with another kind keep their links.
  const r=M.convert({weapons:[{id:'same',name:'gun',type:'beam',power:1}],units:[{id:'same',name:'unit',hp:1000}],missions:[{id:'m',name:'m',enemies:['same']}]});const uid=r.data.units[0].id;assert.notEqual(uid,'same');assert.equal(r.data.missions[0].enemies[0],uid,'enemy link follows');assert(r.report.converted.some(t=>t.includes(uid)));
  // #258: 「新しく作ってつなぐ」 keeps the 4-weapon limit.
  M.openKind('items','t-gear');await tick();d.querySelector('[data-field="equip.weaponIds"]').click();const n0=M.data().weapons.length;button($('inputActions'),'作ってつなぐ').click();assert.equal(M.find('items','t-gear').equip.weaponIds.length,4);assert.equal(M.data().weapons.length,n0,'nothing created');for(const dl of d.querySelectorAll('dialog[open]'))dl.close();
  // #257: after undoing an added colour the chosen colour is a valid one again.
  M.openKind('images','t-img');await tick();d.querySelector('[data-field=pixels]').click();const tool=k=>d.querySelector('#inputBody [data-ptool='+k+']').click();tool('addcolor');$('inputValue').value='#00ff00';ok();assert.equal(d.querySelectorAll('#inputBody [data-color]').length>=3,true);
  d.querySelector('#inputBody [data-ptool=undo]').click();d.querySelector('#inputBody [data-px="0,0"]').click();ok();const img=M.find('images','t-img');assert.equal(img.palette.length,2);assert('0'.includes(img.px[0])||img.px[0]==='.','valid colour: '+img.px[0]);assert(!M.issues('images',img).some(t=>t.includes('色番号')));
  // #261 / #273: a resize drops cut squad positions; a deleted area's ID isn't given to a new one.
  M.openKind('tmissions','t-m');await tick();d.querySelector('[data-field=map]').click();d.querySelector('[data-maptool=resize]').click();d.querySelector('#inputBody [data-choice=right]').click();$('inputValue').value='6';ok();button($('inputActions'),'変更する').click();
  d.querySelector('[data-mode=area]').click();d.querySelector('[data-maptool=delarea]').click();d.querySelector('[data-maptool=newarea]').click();$('inputValue').value='新';ok();d.querySelector('#inputBody [data-x="0"][data-y="0"]').click();d.querySelector('#inputBody [data-x="1"][data-y="0"]').click();ok();
  const tm=M.find('tmissions','t-m');assert.equal(tm.map.width,6);assert(!tm.enemies[0].position,'cut position removed (#261): '+JSON.stringify(tm.enemies[0].position));assert.equal(tm.areas.length,1);assert.notEqual(tm.areas[0].id,'area-1','new ID (#273)');assert.notEqual(tm.victory.area,tm.areas[0].id,'old link not moved onto the new area');}
 // #271: a test play whose way back can't be saved doesn't start (source settings unchanged).
 {const w=open({PRO_TACTICAL_SOURCE:'sample',PRO_TACTICAL_HQ:'{"credits":5}'});await tick();const d=w.document,$=id=>d.getElementById(id),M=w.PROMakerTD,button=(root,name)=>[...root.querySelectorAll('button')].find(b=>b.textContent.includes(name));
  const real=w.localStorage,fake={get length(){return real.length;},key:i=>real.key(i),getItem:k=>real.getItem(k),removeItem:k=>real.removeItem(k),clear:()=>real.clear(),setItem:(k,v)=>{if(k==='PRO_TACTICAL_TESTPLAY')throw new w.DOMException('full','QuotaExceededError');return real.setItem(k,v);}};Object.defineProperty(w,'localStorage',{configurable:true,get:()=>fake});
  M.openKind('tmissions','t-m');await tick();if(!d.querySelector('[data-field=trial]'))d.querySelector('[data-group="試し"]')?.click();d.querySelector('[data-field=trial]').click();const href=w.location.href;button($('inputActions'),'試しプレイを始める').click();
  assert.equal(real.getItem('PRO_TACTICAL_SOURCE'),'sample','source kept');assert.equal(real.getItem('PRO_TACTICAL_LOAD'),null,'load unchanged');assert.equal(real.getItem('PRO_TACTICAL_TESTPLAY'),null);assert.equal(w.location.href,href,'stays in the maker');}
 console.log('PASS: maker batch 3 — pixel undo colour (#257), create-and-link limit (#258), legacy ID clashes (#259), test battle inheritance (#260), cut positions (#261), test play start safety (#271), area IDs (#273), skill tree loops (#274)');
}finally{for(const w of wins){await w.happyDOM.cancelAsync();w.close();}}
