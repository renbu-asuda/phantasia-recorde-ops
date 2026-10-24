import fs from 'node:fs';import path from 'node:path';import assert from 'node:assert/strict';import {Window} from 'happy-dom';
// T&D maker regressions #408–#414, #431–#435 (a native draft loaded into the maker).
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
 const flagOn={mode:'all',list:[{type:'flag',flagId:'t-f',on:true}]};
 const draft={...base,flags:[{id:'t-f',name:'F'}],items:[{id:'t-i',name:'ITEM',price:1}],images:[{id:'t-img',name:'絵',size:32,palette:['#000000','#ffffff'],px:'.'.repeat(1024)}],
  weapons:[W('t-w','shared',{ammo:1,enCost:50,tactical:{tensionMin:'super'}})],
  units:[...base.units,U('t-in',{weaponIds:undefined,skillIds:undefined,weapons:[{name:'inlinegun',attackType:'ranged',damageType:'physical',baseAtk:999,useUnitAtk:false}],skills:[{id:'t-isk',name:'inline',trigger:'when_targeted',effect:'enemy_hit_down_pt',value:20,chance:100}]}),U('t-sh',{weaponIds:['t-w']}),
   U('t-ban',{tags:['ban'],hp:9000,atk:3000,deploy:{player:true}}),U('t-ep',{deploy:{enemy:true}}),{id:'t-child',name:'child',base:'t-ep'},U('t-pp',{pilotProfile:{stats:{atk:10}}}),{id:'t-pchild',name:'pchild',base:'t-pp'},U('t-mech',{crew:'required',deploy:{enemy:true}}),U('t-pic',{imageId:'t-img'}),U('t-noimg',{imageId:'nope'})],
  terrains:[{id:'t-fac',name:'基地',tactical:{kind:'ground',costs:{ground:1},facility:{durability:10,functions:{reward:{flag:'taken'}}}}},{id:'t-dock',name:'ドック',tactical:{kind:'ground',costs:{ground:1},facility:{durability:10,functions:{storage:{count:1,size:1,tags:['ship']}}}}}],
  missions:[{id:'t-d',name:'D',enemies:['t-e'],maxDeploy:4,rules:[{type:'deploy_tags',noneTags:['ban']}],events:[{id:'ev',when:'turn',value:1,lines:[{speaker:'',text:'on'}],flags:{'t-f':true}}],drops:[{itemId:'t-i',chance:100,min:1,max:1,conds:flagOn}]},{id:'t-d2',name:'D2',enemies:['t-child'],maxDeploy:4},{id:'t-d3',name:'D3',enemies:['t-e'],maxDeploy:4,drops:[{itemId:'t-i',chance:50,min:1,max:1}]}],
  tmissions:[{...tmB,events:[{id:'off',name:'off',trigger:{type:'turn',turns:1},actions:[{type:'game_flag',flagId:'t-f',value:false}]}]},
   {...tmB,id:'t-cap',name:'CAP',map:{...tmB.map,grid:tmB.map.grid.map((r,y)=>r.map((k,x)=>x===3&&y===3?'t-fac':k))},victory:{type:'flag',flag:'taken'}},
   {...tmB,id:'t-st',name:'ST',map:{...tmB.map,grid:tmB.map.grid.map((r,y)=>r.map((k,x)=>x===5&&y===5?'t-dock':k))},facilities:{'5,5':'enemy'},enemies:[{id:'eg',name:'敵1',position:{x:5,y:5},stored:true,members:[{unit:'t-e'}]},{id:'eg2',name:'敵2',position:{x:5,y:5},stored:true,members:[{unit:'t-e'}]}]},
   {...tmB,id:'t-pl',name:'PL',enemies:[{id:'eg',name:'敵',position:{x:7,y:5},members:[{unit:'t-mech',pilot:{unit:'t-pchild',lv:1}}]}]},
   {...tmB,id:'t-boss',name:'BOSS',enemies:[],victory:{type:'boss',groupId:'enemy-1'}}]};
 const w=open(draft);await tick();const d=w.document,$=id=>d.getElementById(id),M=w.PROMakerTD,button=(root,name)=>[...root.querySelectorAll('button')].find(b=>b.textContent.includes(name));
 // #408: inline weapons / skills of a native unit reach the test battle.
 {const b=M.battleDef(M.find('units','t-in'));assert.equal(b.weapons[0].name,'inlinegun','inline weapon (#408): '+b.weapons.map(x=>x.name));assert.equal(b.skills.length,1,'inline skill (#408)');}
 // #431: a shared weapon keeps its ammo / EN cost / 気力 condition in the test definition.
 {const x=M.battleDef(M.find('units','t-sh')).weapons[0];assert.equal(x.ammo,1,'ammo (#431)');assert.equal(x.enCost,50,'EN cost');assert.equal(x.tactical?.tensionMin,'super','tensionMin');}
 // #410: the test squad follows the mission's deploy tags.
 {const sq=M._t.testSquad(M.find('missions','t-d')).map(u=>u.id);assert(!sq.some(id=>/t-ban$/.test(id)),'banned unit left out (#410): '+sq);assert(sq.some(id=>/t-a$/.test(id)));}
 // #432: an enemy setting inherited from the parent counts for PRO・D missions.
 assert(!M.issues('missions',M.find('missions','t-d2')).some(t=>/敵として使う/.test(t)),'inherited enemy use (#432)');
 // #412: an event turning a game flag OFF is shown as OFF.
 {M.openKind('flags','t-f');await tick();const us=$('editUsage').textContent;assert(/イベントでOFF/.test(us),'OFF event (#412): '+us);}
 // #433: a facility's capture reward flag counts as a place where the flag is set.
 assert(!M.issues('tmissions',M.find('tmissions','t-cap')).some(t=>/どこでも立たない/.test(t)),'capture reward flag (#433)');
 // #434: stored-at-start squads are checked against the facility's count / size / tags.
 assert(M.issues('tmissions',M.find('tmissions','t-st')).some(t=>/格納/.test(t)&&/マップに置かれます/.test(t)),'stored capacity / tags (#434): '+M.issues('tmissions',M.find('tmissions','t-st')).join(' / '));
 // #435: a unit inheriting its pilot settings can be a pilot.
 assert(!M.issues('tmissions',M.find('tmissions','t-pl')).some(t=>/乗れるユニットではありません/.test(t)),'inherited pilot (#435)');
 // #411: image links are listed and checked.
 assert(M.issues('units',M.find('units','t-noimg')).some(t=>/nope/.test(t)),'missing image reported (#411)');
 {M.openKind('images','t-img');await tick();const us=$('editUsage').textContent;assert(/使っているデータ：1件/.test(us),'image usage (#411): '+us);}
 // #414: the test battle's drops see the battle's event flags.
 {M.openKind('missions','t-d');await tick();$('testBattle').click();for(let i=0;i<150&&!$('msgWin').open;i++)await tick();const t=$('msgBody').textContent;assert(/勝ち 10/.test(t),t);assert(/ITEM×/.test(t),'drop with the event flag (#414): '+t);button($('msgActions'),'閉じる').click();}
 // #409: an invalid fraction is refused and the old rate stays.
 {M.openKind('missions','t-d3');await tick();d.querySelector('[data-field=drops]').click();const rt=d.querySelector('[data-drop-rate="0"]');rt.value='1/0';rt.dispatchEvent(new w.Event('input'));button($('inputActions'),'決定').click();assert(/確率/.test($('inputError').textContent),'refused (#409): '+$('inputError').textContent);assert.equal(M.find('missions','t-d3').drops[0].chance,50,'rate kept');button($('inputActions'),'戻る')?.click();}
 // #413: a new enemy squad doesn't take an id a condition still names.
 {M.openKind('tmissions','t-boss');await tick();d.querySelector('[data-field=enemies]').click();button($('inputActions'),'部隊を追加').click();for(let i=0;i<3&&!button($('inputActions'),'決定');i++)button($('inputActions'),'戻る')?.click();button($('inputActions'),'決定').click();const ids=M.find('tmissions','t-boss').enemies.map(g=>g.id);assert(ids.length===1&&ids[0]!=='enemy-1','id not reused (#413): '+ids);}
 console.log('PASS: maker batch 7 (#408–#414, #431–#435)');
}finally{for(const w of wins)try{w.close();}catch(e){}}
process.exit(0);
