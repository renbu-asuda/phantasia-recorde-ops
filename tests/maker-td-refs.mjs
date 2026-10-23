import fs from 'node:fs';import path from 'node:path';import assert from 'node:assert/strict';import {Window} from 'happy-dom';
// #229: renaming an ID in the T&D maker follows it into nested conditions (all / any), unitIds lists, objective
// changes and other condition sets (an item's useConds).
const file='game/prototypes/maker_td.html',html=fs.readFileSync(file,'utf8');
const draft={format:'PRO_TD_PACK',version:1,packId:'t',name:'T',units:[{id:'t-a',name:'A',hp:1000,atk:1,def:1,mob:1,acc:1,weaponIds:[],skillIds:[],deploy:{player:true}},{id:'t-e',name:'E',hp:1000,atk:1,def:1,mob:1,acc:1,weaponIds:[],skillIds:[],deploy:{enemy:true}}],weapons:[],skills:[],terrains:[],flags:[],missions:[],research:[],hires:[],evolutions:[],fusions:[],achievements:[],
 items:[{id:'t-i',name:'I',price:1,useConds:{mode:'all',list:[{type:'unit_owned',unitId:'t-a'}]}}],
 tmissions:[{id:'t-m',name:'M',kind:'combat',map:{width:4,height:4,grid:Array.from({length:4},()=>Array(4).fill('p'))},playerStarts:[{x:0,y:0}],enemies:[{id:'eg',name:'敵',position:{x:3,y:3},members:[{unit:'t-e'}]}],
  victory:{type:'all',conds:[{type:'reach',unitIds:['t-a'],x:3,y:3},{type:'turn',turns:2}]},defeat:{type:'player_wipe'},objectives:[{id:'o',name:'O',success:{type:'reach',unitIds:['t-a'],x:1,y:1}}],
  events:[{id:'ev',name:'EV',trigger:{type:'unit_down',unitId:'t-a'},actions:[{type:'objective_change',id:'o',success:{type:'reach',unitId:'t-a',x:2,y:2}}]}]}]};
const w=new Window({url:'http://localhost/'+file,settings:{enableJavaScriptEvaluation:true,disableJavaScriptFileLoading:true,disableCSSFileLoading:true,suppressInsecureJavaScriptEnvironmentWarning:true}});w.scrollTo=()=>{};
w.localStorage.setItem('PRO_TD_MAKER_DRAFT',JSON.stringify(draft));w.document.write(html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/g,''));
for(const dl of w.document.querySelectorAll('dialog')){dl.showModal=()=>dl.setAttribute('open','');dl.close=()=>{dl.removeAttribute('open');dl.dispatchEvent(new w.Event('close'));};}
{const C=w.HTMLCanvasElement?.prototype;if(C){C.getContext=()=>({fillRect(){},set fillStyle(v){}});C.toDataURL=()=>'data:image/png;base64,UElY';}}
for(const m of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/g)){const src=/src=["']([^"']+)["']/.exec(m[1]);w.eval(src?fs.readFileSync(path.resolve(path.dirname(file),src[1]),'utf8'):m[2]);}
const d=w.document,$=id=>d.getElementById(id),M=w.PROMakerTD,button=(root,name)=>[...root.querySelectorAll('button')].find(b=>b.textContent.includes(name));
await new Promise(r=>setTimeout(r,50));assert.equal(M.data().units.length,2,'draft loaded');
M.openKind('units','t-a');await new Promise(r=>setTimeout(r,50));d.querySelector('[data-field=id]').click();$('inputValue').value='renamed';button($('inputActions'),'決定').click();
const D=M.data(),nid=D.units.find(u=>u.name==='A').id,m=D.tmissions[0];assert.notEqual(nid,'t-a');
assert.equal(m.victory.conds[0].unitIds.join(),nid,'reach inside all');assert.equal(m.objectives[0].success.unitIds.join(),nid,'objective reach list');assert.equal(m.events[0].actions[0].success.unitId,nid,'objective change');assert.equal(m.events[0].trigger.unitId,nid,'event trigger');assert.equal(D.items[0].useConds.list[0].unitId,nid,'item useConds');
console.log('PASS: T&D maker ID rename follows nested conditions, unitIds lists, objective changes and other condition sets (#229)');
await w.happyDOM.cancelAsync();w.close();
