import fs from 'node:fs';import path from 'node:path';import assert from 'node:assert/strict';import {Window} from 'happy-dom';
// T&D maker regressions #329–#361 (a native draft loaded into the maker).
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
 const d2={...draft,skills:[{id:'t-s',name:'S',trigger:'before_attack',effect:'hit_up_pt',value:10},{id:'t-o',name:'O',trigger:'before_attack',effect:'hit_up_pt',value:5}],
  items:[...draft.items,{id:'t-rm',name:'Sだけ外す',price:1,effects:[{type:'remove_skill',skillId:'t-s'}]}],commands:[{id:'t-cm',name:'CM',costType:'funds',cost:10,target:'enemySquad',fx:{healHp:-50}}],
  units:[...draft.units,U('t-ph',{weaponIds:['t-w0'],phases:[{id:'p',name:'P',cond:{type:'turn_ge',value:1},weaponIds:['t-w0'],skillIds:['t-s']}],commands:[{id:'t-cm',lv:99}]}),
   U('t-par',{deploy:{player:true},crew:'required',pilotProfile:{stats:{atk:100}}}),U('t-c1',{base:'t-par',deploy:{player:true}}),U('t-c2',{base:'t-par'}),U('t-par2',{deploy:{player:true}}),U('t-c3',{base:'t-par2'}),U('t-free',{deploy:{player:true}}),U('t-pp',{pilotProfile:{stats:{atk:100}}}),U('t-pc',{base:'t-pp'})],
  mapScales:[{id:'scale-1',name:'old',ratio:32}]};
 d2.units=d2.units.map(u=>u.id==='t-a'?{...u,moveScale:'scale-1'}:u);
 {const w=open({PRO_TD_MAKER_DRAFT:JSON.stringify(d2)});await tick();const d=w.document,$=id=>d.getElementById(id),M=w.PROMakerTD,button=(root,name)=>[...root.querySelectorAll('button')].find(b=>b.textContent.includes(name)),ok=()=>button($('inputActions'),'決定').click(),field=k=>d.querySelector('[data-field="'+k+'"]'),openF=(f,g)=>{if(!field(f))d.querySelector('[data-group="'+g+'"]')?.click();field(f).click();};
  // #329: the test state's cleared missions include tactical missions. #350: stars per mission.
  M.openKind('test');await tick();openF('cleared','持っているもの');assert(d.querySelector('#inputBody').textContent.includes('M'),'tactical mission listed (#329)');for(const dl of d.querySelectorAll('dialog[open]'))dl.close();
  M._t.set(M.data(),'x',undefined);assert.equal(w.PROCore.evalConds({mode:'all',list:[{type:'mission_stars',missionId:'t-m',value:1}]},M._t.testCtx({stars:{'t-m':3}})).ok,true);
  M.openKind('test');await tick();openF('stars','持っているもの');button($('inputActions'),'行を追加').click();ok();assert.equal(w.PROCore.evalConds({mode:'all',list:[{type:'mission_stars',missionId:d2.missions[0]?.id||'t-m',value:1}]},M._t.testCtx()).ok,true,'stars from the test state (#350)');
  // #335: deleting a skill drops a 'remove that skill' effect (it would remove every skill).
  M.openKind('skills','t-s');await tick();$('editDelete').click();button($('msgActions'),'削除').click();await tick();assert.equal(M.find('items','t-rm').effects.length,0,'effect dropped (#335)');
  // #340: phase links follow a weapon's new ID; a missing one is reported.
  assert.equal((M.find('units','t-ph').phases[0].skillIds||[]).join(),'','the deleted skill leaves the phase too (#340)');assert(M.issues('units',{name:'u',phases:[{id:'p',name:'P',weaponIds:['nope']}]}).some(t=>/段階変化/.test(t)),'a missing phase weapon is reported (#340)');
  // #361: a command learnt at Lv99 is reported. #349: negative effects reported.
  assert(M.issues('units',M.find('units','t-ph')).some(t=>/覚えるレベル99/.test(t)),'Lv99 command (#361)');assert(M.issues('commands',M.find('commands','t-cm')).some(t=>/マイナス/.test(t)),'negative heal (#349)');
  // #346: the test squad reads inherited settings (t-c1 / t-c2: crew required by their base → out; t-c3: player by its base → in).
  {const sq=M._t.testSquad({maxDeploy:8}).map(u=>u.id);assert(!sq.includes('t-c1'),'inherited crew (#346): '+sq);assert(!sq.includes('t-c2'));assert(sq.includes('t-c3'),'inherited deploy (#346): '+sq);}
  // #347: a derived unit can switch off the base's pilot setting.
  M.openKind('units','t-pc');await tick();openF('pilotProfile','パイロット');assert.equal(M.find('units','t-pc').pilotProfile,false,'pilot off kept as false (#347)');assert.match(field('pilotProfile').textContent,/OFF/);
  // #330: a removed scale's links are cleared; a new scale gets another ID.
  M.openKind('pack');await tick();openF('mapScales','マップスケール');d.querySelector('[data-efield=scale0]').click();button($('inputActions'),'この縮尺を消す').click();button($('inputActions'),'縮尺を追加').click();button($('inputActions'),'決定').click();
  assert.notEqual(M.data().mapScales[0].id,'scale-1','new ID (#330)');assert.equal(M.find('units','t-a').moveScale,undefined,'link cleared');
  // #345: a pending 四角 start is dropped when the picture gets smaller.
  M.openKind('images','t-img');await tick();field('pixels').click();const tool=k=>d.querySelector('#inputBody [data-ptool='+k+']').click();tool('rect');d.querySelector('#inputBody [data-px="31,31"]').click();tool('size');d.querySelector('#inputBody [data-choice="16"]').click();d.querySelector('#inputBody [data-px="0,0"]')?.click();ok();assert.equal(M.find('images','t-img').px.length,256,'dots = 16×16 (#345)');
  // #331: a draft that can't be saved doesn't start a test play.
  {const real=w.localStorage,fake={getItem:k=>real.getItem(k),removeItem:k=>real.removeItem(k),setItem:(k,v)=>{if(k==='PRO_TD_MAKER_DRAFT')throw new Error('QuotaExceededError');real.setItem(k,v);},key:i=>real.key(i),get length(){return real.length;}};
   M.openKind('tmissions','t-m');await tick();Object.defineProperty(w,'localStorage',{value:fake,configurable:true});openF('trial','試し');try{button($('inputActions'),'試しプレイを始める').click();}catch(e){}Object.defineProperty(w,'localStorage',{value:real,configurable:true});
   assert.equal(w.localStorage.getItem('PRO_TACTICAL_TESTPLAY'),null,'no test play (#331)');assert.match($('msgBody').textContent,/下書きを保存できません/);}}
 console.log('PASS: maker batch 5 (#329–#361)');
}finally{for(const w of wins)try{w.close();}catch(e){}}
