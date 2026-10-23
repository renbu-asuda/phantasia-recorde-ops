import fs from 'node:fs';import path from 'node:path';import assert from 'node:assert/strict';import {Window} from 'happy-dom';
// T&D maker regressions #300–#304, #315–#317, #319 (a native draft loaded into the maker).
const file='game/prototypes/maker_td.html',html=fs.readFileSync(file,'utf8'),wins=[];
const grid=(w,h)=>Array.from({length:h},()=>Array(w).fill('p'));
const W=(id,name)=>({id,name,attackType:'ranged',damageType:'physical'});
const draft={format:'PRO_TD_PACK',version:1,packId:'t',name:'T',skills:[],terrains:[],flags:[],missions:[],research:[],hires:[],evolutions:[],fusions:[],achievements:[],
 units:[{id:'t-a',name:'A',hp:4000,atk:500,def:200,mob:100,acc:500,weaponIds:['t-w0'],skillIds:[],deploy:{player:true,enemy:true}},{id:'t-child',name:'child',base:'t-a'}],
 weapons:[W('t-w0','w0'),W('t-w1','w1'),W('t-w2','w2'),W('t-w3','w3')],items:[{id:'t-gear',name:'装備',price:1,equip:{stats:{},weaponIds:['t-w0','t-w1','t-w2','t-w3']}}],
 images:[{id:'t-img',name:'絵',size:16,palette:['#000000','#ffffff'],px:'.'.repeat(256)}],
 vars:[{id:'t-v',name:'評判',initial:7}],talks:[],tmissions:[{id:'t-m',name:'M',kind:'combat',map:{width:8,height:6,grid:grid(8,6)},playerStarts:[{x:0,y:0}],enemies:[{id:'eg',name:'敵',position:{x:7,y:5},members:[{unit:'t-a'}]}],areas:[{id:'area-1',name:'旧',x:4,y:4,w:1,h:1}],victory:{type:'reach',area:'area-1',x:4,y:4,w:1,h:1},defeat:{type:'player_wipe'}}]};
function open(store={}){const w=new Window({url:'http://localhost/'+file,settings:{enableJavaScriptEvaluation:true,disableJavaScriptFileLoading:true,disableCSSFileLoading:true,suppressInsecureJavaScriptEnvironmentWarning:true}});wins.push(w);w.scrollTo=()=>{};
 w.localStorage.setItem('PRO_TD_MAKER_DRAFT',JSON.stringify(draft));for(const [k,v] of Object.entries(store))w.localStorage.setItem(k,v);w.document.write(html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/g,''));
 for(const dl of w.document.querySelectorAll('dialog')){dl.showModal=()=>dl.setAttribute('open','');dl.close=()=>{dl.removeAttribute('open');dl.dispatchEvent(new w.Event('close'));};}
 {const C=w.HTMLCanvasElement?.prototype;if(C){C.getContext=()=>({fillRect(){},set fillStyle(v){}});C.toDataURL=()=>'data:image/png;base64,UElY';}}
 for(const m of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/g)){const src=/src=["']([^"']+)["']/.exec(m[1]);w.eval(src?fs.readFileSync(path.resolve(path.dirname(file),src[1]),'utf8'):m[2]);}return w;}
const tick=()=>new Promise(r=>setTimeout(r,50));
try{
 {const w=open();await tick();const d=w.document,$=id=>d.getElementById(id),M=w.PROMakerTD,B=w.PROBattle,button=(root,name)=>[...root.querySelectorAll('button')].find(b=>b.textContent.includes(name)),ok=()=>button($('inputActions'),'決定').click(),field=k=>d.querySelector('[data-field="'+k+'"]');
  // #300: 「本体ATKを使う」 OFF is saved as false (unset means ON).
  M.openKind('weapons','t-w0');await tick();assert.match(field('useUnitAtk').textContent,/ON/,'unset shows ON');field('useUnitAtk').click();assert.equal(M.find('weapons','t-w0').useUnitAtk,false,'explicit false (#300)');field('useUnitAtk').click();assert.equal(M.find('weapons','t-w0').useUnitAtk,true);
  // #301: a derived unit can switch off an inherited ON (noFire).
  {const x={base:'t-a',noFire:true};M._t.set(x,'noFire',undefined);assert.equal('noFire' in x,false);M.openKind('units','t-child');await tick();const nf=field('noFire');if(nf){nf.click();nf.click();assert.equal(M.find('units','t-child').noFire,false,'explicit false on a derived unit (#301)');}}
  // #302: clearing the last nested key drops the empty container.
  {const x={growth:{atk:10}};M._t.set(x,'growth.atk','');assert.equal('growth' in x,false,'no empty growth (#302)');const y={a:{b:{c:1},k:2}};M._t.set(y,'a.b.c',undefined);assert.equal(JSON.stringify(y),'{"a":{"k":2}}');}
  console.log('PASS: maker batch 4 (UI part)');}

 // A second draft: variables in texts, PRO・D mission events, big units and a support skill.
 {const big=n=>({id:'t-big'+n,name:'B'+n,size:'3XL',hp:1000,atk:1,def:1,mob:1,acc:1,weaponIds:[],skillIds:[],deploy:{player:true}});
  const d2={...draft,flags:[{id:'t-gate',name:'gate'},{id:'t-f',name:'f'}],skills:[{id:'t-sup',name:'支援',tacticalOnly:true,tactical:{support:{on:true,atk:100}}},{id:'t-ctr',name:'集中',trigger:'before_attack',effect:'hit_up_pt',value:10,tactical:{support:{on:true,atk:100}}}],
   units:[...draft.units,{id:'t-ua',name:'UA',hp:1000,atk:500,def:0,mob:1,acc:1,weaponIds:[],skillIds:[],deploy:{player:true}},{id:'t-ub',name:'UB',hp:1000,atk:500,def:0,mob:1,acc:1,weaponIds:[],skillIds:['t-sup','t-ctr'],deploy:{player:true}},big(1),big(2),big(3),big(4)],
   vars:[{id:'t-v',name:'評判',initial:7}],tmissions:[{...draft.tmissions[0],events:[{id:'te',when:'turn',value:1,lines:[{speaker:'',text:'評判={評判}'}]}]}],
   missions:[{id:'t-dm',name:'DM',enemies:['t-a'],maxDeploy:4,events:[{id:'ev',when:'turn',value:1,conds:{mode:'all',list:[{type:'flag',flagId:'t-gate',on:true}]},flags:{'t-f':true}}]}]};
  const w=open({PRO_TD_MAKER_DRAFT:JSON.stringify(d2)});await tick();const d=w.document,$=id=>d.getElementById(id),M=w.PROMakerTD,B=w.PROBattle,button=(root,name)=>[...root.querySelectorAll('button')].find(b=>b.textContent.includes(name)),ok=()=>button($('inputActions'),'決定').click(),field=k=>d.querySelector('[data-field="'+k+'"]');
  // #303: renaming a variable updates {name} tokens in texts.
  M.openKind('vars','t-v');await tick();field('name').click();$('inputValue').value='名声';ok();await tick();assert.equal(M.find('vars','t-v').name,'名声');assert.equal(M.data().tmissions[0].events[0].lines[0].text,'評判={名声}','token follows (#303)');
  // #315: conditions see the variables' initial values.
  assert.equal(w.PROCore.evalConds({mode:'all',list:[{type:'var',varId:'t-v',cmp:'eq',value:7}]},M._t.testCtx({rng:()=>0})).ok,true,'initial 7 (#315)');
  // #317: the test squad fits the sortie (one 3XL fills total size 8).
  {const sq=M._t.testSquad({maxDeploy:4});assert.equal(sq.filter(u=>/^t-big/.test(u.id)).length<=1,true,'size limit (#317)');let size=0;const S={S:.5,M:1,L:2,XL:3,'2XL':4,'3XL':8};}
  // #316: an event's extra conditions are checked in the test battle. #319: support works there.
  {const m=M.find('missions','t-dm'),defs={'t-a':M.battleDef(M.find('units','t-a')),'t-ua':M.battleDef(M.find('units','t-ua')),'t-ub':M.battleDef(M.find('units','t-ub'))};
   assert(defs['t-ub'].skills.some(k=>k.tactical?.support?.on),'tactical part kept (#319)');
   const ctx=B.buildBattle({allies:[defs['t-ua'],defs['t-ub']],mission:m,enemyDefs:defs,unitDefs:defs},()=>.5);M._t.testPrepare(ctx,defs,M._t.testCtx(),['t-ua','t-ub']);ctx.turn=1;await ctx.hooks.turnStart(1);await B.checkpoint(ctx);
   assert.equal(!!ctx.flags['t-f'],false,'gate OFF: no event (#316)');assert.equal(ctx.allies[0].atk,1500,'UB supports UA ×2 skills (#319)');}}
console.log('PASS: maker batch 4 (#300–#319)');
}finally{for(const w of wins)try{w.close();}catch(e){}}
