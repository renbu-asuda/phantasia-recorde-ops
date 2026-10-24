import fs from 'node:fs';import path from 'node:path';import assert from 'node:assert/strict';import {Window} from 'happy-dom';
// T&D maker regressions #454–#456 (a native draft loaded into the maker).
const file='game/prototypes/maker_td.html',html=fs.readFileSync(file,'utf8'),wins=[];
const grid=(w,h)=>Array.from({length:h},()=>Array(w).fill('p'));
const W=(id,name,x={})=>({id,name,attackType:'ranged',damageType:'physical',...x});
const U=(id,x={})=>({id,name:id.toUpperCase(),hp:1000,atk:1,def:1,mob:1,acc:1,size:'M',move:5,weaponIds:[],skillIds:[],...x});
const tmB={id:'t-m',name:'M',kind:'combat',map:{width:8,height:6,grid:grid(8,6)},playerStarts:[{x:0,y:0}],enemies:[{id:'eg',name:'敵',position:{x:7,y:5},members:[{unit:'t-e'}]}],victory:{type:'enemy_wipe'},defeat:{type:'player_wipe'}};
const base={format:'PRO_TD_PACK',version:1,packId:'t',name:'T',skills:[],terrains:[],flags:[],missions:[],research:[],hires:[],evolutions:[],fusions:[],achievements:[],items:[],weapons:[],images:[],vars:[],talks:[],
 units:[U('t-a',{hp:9000,atk:3000,def:500,mob:500,acc:900,deploy:{player:true}}),U('t-e',{hp:1,deploy:{enemy:true}})],tmissions:[tmB]};
function open(draft){const w=new Window({url:'http://localhost/'+file,settings:{enableJavaScriptEvaluation:true,disableJavaScriptFileLoading:true,disableCSSFileLoading:true,suppressInsecureJavaScriptEnvironmentWarning:true}});wins.push(w);w.scrollTo=()=>{};
 w.localStorage.setItem('PRO_TD_MAKER_DRAFT',JSON.stringify(draft));w.document.write(html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/g,''));
 for(const dl of w.document.querySelectorAll('dialog')){dl.showModal=()=>dl.setAttribute('open','');dl.close=()=>{dl.removeAttribute('open');dl.dispatchEvent(new w.Event('close'));};}
 {const C=w.HTMLCanvasElement?.prototype;if(C){C.getContext=()=>({fillRect(){},set fillStyle(v){}});C.toDataURL=()=>'data:image/png;base64,UElY';}}
 for(const m of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/g)){const src=/src=["']([^"']+)["']/.exec(m[1]);w.eval(src?fs.readFileSync(path.resolve(path.dirname(file),src[1]),'utf8'):m[2]);}return w;}
const tick=()=>new Promise(r=>setTimeout(r,50));
try{

 const draft={...base,testState:{name:'試しの状態',credits:0,day:1,wins:0,ownedCounts:{'t-a':2},hiredCounts:{'t-h':2}},flags:[{id:'t-f',name:'F'}],hires:[{id:'t-h',name:'H',unitId:'t-a',cost:0}],
  units:[...base.units,U('t-c',{joinConds:{mode:'all',list:[{type:'flag',flagId:'t-f',on:true}]}})],
  missions:[{id:'t-d',name:'D',enemies:['t-e'],maxDeploy:4,drops:[{unitId:'t-c',chance:100,min:1,max:1}]}],
  tmissions:[{...tmB,objectives:[{id:'ob',name:'OB',success:{type:'enemy_wipe'}}],events:[{id:'oc',name:'oc',trigger:{type:'turn',turns:1},actions:[{type:'objective_change',id:'nope',success:{type:'reach',x:99,y:99,w:1,h:1}}]}]}]};
 const w=open(draft);await tick();const d=w.document,$=id=>d.getElementById(id),M=w.PROMakerTD,button=(root,name)=>[...root.querySelectorAll('button')].find(b=>b.textContent.includes(name));
 // #454: the test state holds counts (2 owned, hired twice).
 {const ctx=M._t.testCtx({rng:()=>0}),C=w.PROCore;assert.equal(ctx.units['t-a'],2,'owned count (#454)');assert.equal(ctx.hires['t-h'],2,'hired count');assert.equal(C.evalConds({mode:'all',list:[{type:'unit_owned',unitId:'t-a',count:2},{type:'hired',hireId:'t-h',count:2}]},ctx).ok,true,'count conditions testable (#454)');
  M.openKind('test','');await tick();const labels=[...d.querySelectorAll('[data-field]')].map(b=>b.dataset.field);assert(labels.includes('ownedCounts')&&labels.includes('hiredCounts'),'fields shown: '+labels);}
 // #455: objective_change needs an existing objective and valid conditions.
 {const iss=M.issues('tmissions',M.find('tmissions','t-m'));assert(iss.some(t=>/条件を変える作戦内ミッション/.test(t)),'objective missing (#455): '+iss.join(' / '));assert(iss.some(t=>/成功条件/.test(t)),'bad success condition (#455)');}
 // #456: a unit drop in the test battle needs the unit's joining conditions.
 {M.openKind('missions','t-d');await tick();$('testBattle').click();for(let i=0;i<150&&!$('msgWin').open;i++)await tick();const t=$('msgBody').textContent;assert(/勝ち 10/.test(t),t);assert(!/ユニット T-C×/.test(t)&&/ドロップ[^：]*：なし/.test(t),'join conditions apply (#456): '+t);button($('msgActions'),'閉じる').click();}
 console.log('PASS: maker batch 8 (#454–#456)');
}finally{for(const w of wins)try{w.close();}catch(e){}}
process.exit(0);
