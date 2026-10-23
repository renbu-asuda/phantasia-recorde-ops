import fs from 'node:fs';import path from 'node:path';import assert from 'node:assert/strict';import {Window} from 'happy-dom';
// T&D maker regressions #377–#392 (a native draft loaded into the maker).
const file='game/prototypes/maker_td.html',html=fs.readFileSync(file,'utf8'),wins=[];
const grid=(w,h)=>Array.from({length:h},()=>Array(w).fill('p'));
const W=(id,name)=>({id,name,attackType:'ranged',damageType:'physical'});
const draft={format:'PRO_TD_PACK',version:1,packId:'t',name:'T',skills:[],terrains:[],flags:[],missions:[],research:[],hires:[],evolutions:[],fusions:[],achievements:[],
 units:[{id:'t-a',name:'A',noFire:true,hp:4000,atk:500,def:200,mob:100,acc:500,weaponIds:['t-w0'],skillIds:[],deploy:{player:true,enemy:true}},{id:'t-child',name:'child',base:'t-a'}],
 weapons:[W('t-w0','w0'),W('t-w1','w1'),W('t-w2','w2'),W('t-w3','w3')],items:[{id:'t-gear',name:'装備',price:1,equip:{stats:{},weaponIds:['t-w0','t-w1','t-w2','t-w3']}}],
 images:[{id:'t-img',name:'絵',size:32,palette:['#000000','#ffffff'],px:'.'.repeat(1024)}],
 vars:[{id:'t-v',name:'評判',initial:7}],talks:[],tmissions:[{id:'t-m',name:'M',kind:'combat',map:{width:8,height:6,grid:grid(8,6)},playerStarts:[{x:0,y:0}],enemies:[{id:'eg',name:'敵',position:{x:7,y:5},members:[{unit:'t-a'}]}],areas:[{id:'area-1',name:'旧',x:4,y:4,w:1,h:1}],victory:{type:'reach',area:'area-1',x:4,y:4,w:1,h:1},defeat:{type:'player_wipe'}}]};
function open(store={}){const w=new Window({url:'http://localhost/'+file,settings:{enableJavaScriptEvaluation:true,disableJavaScriptFileLoading:true,disableCSSFileLoading:true,suppressInsecureJavaScriptEnvironmentWarning:true}});wins.push(w);w.scrollTo=()=>{};
 w.localStorage.setItem('PRO_TD_MAKER_DRAFT',JSON.stringify(draft));for(const [k,v] of Object.entries(store))w.localStorage.setItem(k,v);w.document.write(html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/g,''));
 for(const dl of w.document.querySelectorAll('dialog')){dl.showModal=()=>dl.setAttribute('open','');dl.close=()=>{dl.removeAttribute('open');dl.dispatchEvent(new w.Event('close'));};}
 {const C=w.HTMLCanvasElement?.prototype;if(C){C.getContext=()=>({fillRect(){},set fillStyle(v){}});C.toDataURL=()=>'data:image/png;base64,UElY';}}
 for(const m of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/g)){const src=/src=["']([^"']+)["']/.exec(m[1]);w.eval(src?fs.readFileSync(path.resolve(path.dirname(file),src[1]),'utf8'):m[2]);}return w;}
const tick=()=>new Promise(r=>setTimeout(r,50));
try{
 const U=(id,x={})=>({id,name:id.toUpperCase(),hp:1000,atk:1,def:1,mob:1,acc:1,weaponIds:[],skillIds:[],...x});
 const tmB=draft.tmissions[0];
 const d2={...draft,flags:[{id:'t-flag',name:'F'}],commands:[{id:'t-cmd',name:'CMD',costType:'sp',cost:0,target:'self',fx:{hit:10}},{id:'t-now',name:'NOW',costType:'funds',cost:100,target:'self',duration:'now',fx:{atk:50}}],
  items:[...draft.items,{id:'t-i2',name:'I2',price:1,useConds:{mode:'all',list:[{type:'flag',flagId:'t-flag',on:true}]}}],startItems:{'t-i2':3},
  terrains:[{id:'t-ter',name:'TER',tactical:{kind:'ground',costs:{ground:1},facility:{durability:10,functions:{storage:{},reward:{items:{'t-i2':2}}}}}}],
  units:[...draft.units,U('t-parent',{weaponIds:['t-w0'],size:'M',move:5,deploy:{player:true}}),{id:'t-kid',name:'kid',base:'t-parent'},U('t-rec',{recruit:{locked:true,missionId:'t-m'}})],
  tmissions:[{...tmB,map:{...tmB.map,grid:tmB.map.grid.map((r,y)=>r.map((k,x)=>x===2&&y===2?'t-ter':k))},victory:{type:'capture_all',key:'t-ter'},resultFlags:{win:{'t-flag':true}},enemies:[{...tmB.enemies[0],aiRules:[{conds:[{type:'game_flag',flagId:'t-flag',on:true}],acts:[{type:'attack',target:{kind:'unit',value:'t-a'}},{type:'command',commandId:'t-cmd'}]}]}]}]};
 {const w=open({PRO_TD_MAKER_DRAFT:JSON.stringify(d2)});await tick();const d=w.document,$=id=>d.getElementById(id),M=w.PROMakerTD,button=(root,name)=>[...root.querySelectorAll('button')].find(b=>b.textContent.includes(name)),ok=()=>button($('inputActions'),'決定').click();
  const rename=async(k,id,v)=>{M.openKind(k,id);await tick();d.querySelector('[data-field=id]').click();$('inputValue').value=v;ok();await tick();};
  // #387: flag sites include tactical missions and condition sets.
  M.openKind('flags','t-flag');await tick();const us=$('editUsage').textContent;assert(/立てる場所：1/.test(us),'set in the tactical mission (#387): '+us);assert(/使う場所：[1-9]/.test(us),'used by the item / AI rule');
  // #388: a derived unit inherits weapons, size, MOVE and use.
  assert.equal(M.issues('units',M.find('units','t-kid')).filter(t=>/武装がありません|サイズ・MOVE|どちらにも使わない/.test(t)).length,0,'no false warnings (#388)');
  // #392: a lasting effect on a 「すぐ」 command is reported.
  assert(M.issues('commands',M.find('commands','t-now')).some(t=>/すぐ/.test(t)),'now + ATK (#392)');
  // #377: AI rule links follow renamed flags / units / commands.
  await rename('flags','t-flag','flag2');const nf=M.data().flags[0].id;await rename('units','t-a','a2');const nu=M.data().units[0].id;await rename('commands','t-cmd','cmd2');const nc=M.data().commands[0].id;
  const r=M.find('tmissions','t-m').enemies[0].aiRules[0];assert.equal(r.conds[0].flagId,nf,'AI flag (#377)');assert.equal(r.acts[0].target.value,nu,'AI target');assert.equal(r.acts[1].commandId,nc,'AI command');
  // #378 / #390: a renamed item keeps the facility reward and the starting items.
  await rename('items','t-i2','i3');const ni=M.data().items.find(i=>i.name==='I2').id;assert.equal(JSON.stringify(M.data().terrains[0].tactical.facility.functions.reward.items),JSON.stringify({[ni]:2}),'reward (#378)');assert.equal(M.data().startItems[ni],3,'start items (#390)');
  // #379: 種類で全占領 follows a renamed terrain.
  await rename('terrains','t-ter','ter2');const nt=M.data().terrains[0].id;assert.equal(M.find('tmissions','t-m').victory.key,nt,'capture_all key (#379)');
  // #380: a kept recruit mission follows a renamed mission.
  await rename('tmissions','t-m','m2');const nm=M.data().tmissions[0].id;assert.equal(M.find('units','t-rec').recruit.missionId,nm,'recruit mission (#380)');}
 console.log('PASS: maker batch 6 (#377–#392)');
}finally{for(const w of wins)try{w.close();}catch(e){}}
