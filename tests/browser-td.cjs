// Real-browser checks for PRO・T&D (game/prototypes): title screen, pixel images actually drawn by canvas, area overlays,
// display settings, phone / PC widths without sideways scrolling, and the T&D maker's pixel editor.
// Screenshots go to PRO_SCREENSHOT_DIR when it is set.
const fs=require('node:fs'),path=require('node:path'),http=require('node:http'),assert=require('node:assert/strict');
const {chromium}=require(process.env.PRO_PLAYWRIGHT_MODULE||'playwright');
const RED={id:'td-img-red',name:'赤',size:16,palette:['#ff0000'],px:'0'.repeat(256)};
const BANNER={id:'td-img-banner',name:'荒野',w:96,h:32,palette:['#806040','#2050a0'],px:'0'.repeat(96*16)+'1'.repeat(96*16)};
const grid=Array.from({length:6},()=>Array(8).fill('p'));
const draft={format:'PRO_TD_PACK',version:1,packId:'bt',name:'実ブラウザ確認',dependencies:[],images:[RED,BANNER],terrainLooks:{f:{imageId:'td-img-red'}},
 units:[{id:'bt-a',name:'赤い機体',imageId:'td-img-red',size:'M',move:5,hp:3000,atk:300,def:100,mob:100,acc:400,weaponIds:[],skillIds:[],deploy:{player:true}},{id:'bt-b',name:'敵機',hp:500,atk:50,def:50,mob:50,acc:300,weaponIds:[],skillIds:[],deploy:{enemy:true}}],
 tmissions:[{id:'bt-m',name:'確認作戦',mapImageId:'td-img-banner',map:{width:8,height:6,grid:grid.map((r,y)=>r.map((k,x)=>x===2&&y===0?'f':k))},playerStarts:[{x:0,y:0}],areas:[{id:'area-1',name:'前線',x:4,y:0,w:2,h:2,game:true}],exitAreas:[{id:'exit-1',x:0,y:5,w:2,h:1,name:'脱出'}],
  enemies:[{id:'e1',name:'敵A',position:{x:7,y:5},members:[{unit:'bt-b'}],ai:{pattern:'hold'}}],victory:{type:'enemy_wipe'},defeat:{type:'player_wipe'},result:{credits:100,exp:10}}]};
const shot=async(page,name)=>{const dir=process.env.PRO_SCREENSHOT_DIR;if(dir){fs.mkdirSync(dir,{recursive:true});await page.screenshot({path:path.join(dir,name+'.png'),fullPage:false});}};
const noSideScroll=page=>page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth+1&&document.documentElement.scrollHeight<=window.innerHeight+1);
// The color of a data URL picture at (x, y), read back through a canvas in the page.
const pixelAt=(page,url,x,y)=>page.evaluate(([u,x,y])=>new Promise(res=>{const i=new Image();i.onload=()=>{const c=document.createElement('canvas');c.width=i.width;c.height=i.height;const g=c.getContext('2d');g.drawImage(i,0,0);res([...g.getImageData(x,y,1,1).data]);};i.src=u;}),[url,x,y]);
const bgUrl=(page,sel)=>page.$eval(sel,e=>(getComputedStyle(e).backgroundImage.match(/url\("?(data:[^")]+)"?\)/)||[])[1]||'');
(async()=>{
 const root=process.cwd();const server=http.createServer((req,res)=>{const file=path.join(root,decodeURIComponent(req.url.split('?')[0]));if(!file.startsWith(root+path.sep)){res.writeHead(403).end();return;}try{const type={'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json'}[path.extname(file)]||'application/octet-stream';res.setHeader('Content-Type',type);res.end(fs.readFileSync(file));}catch(e){res.writeHead(404).end();}});await new Promise(r=>server.listen(0,'127.0.0.1',r));const base='http://127.0.0.1:'+server.address().port;
 const exe=process.env.PRO_CHROMIUM_PATH||(fs.existsSync('/opt/pw-browsers/chromium')?'/opt/pw-browsers/chromium':'');
 const browser=await chromium.launch({headless:true,...(exe?{executablePath:exe,args:['--no-sandbox','--disable-gpu']}:{})});
 const errors=[];const hub=base+'/game/prototypes/tactical_hub.html';
 try{
  for(const [label,viewport] of [['phone',{width:390,height:844}],['pc',{width:1280,height:800}]]){
   const page=await browser.newPage({viewport});page.on('pageerror',e=>errors.push(label+': '+e.message));
   // Title screen on a fresh tab.
   await page.goto(hub);await page.evaluate(()=>localStorage.clear());await page.reload();
   assert(await page.isVisible('#titleScreen'),label+' title');assert(await noSideScroll(page),label+' title width');await shot(page,label+'-title');
   await page.click('#titleStart');assert.deepEqual(await page.$$eval('#titleMenu button',b=>b.map(x=>x.textContent)),['はじめから','つづきから','設定']);
   // Load the pack (maker draft) and skip the title for the rest.
   await page.evaluate(d=>{localStorage.setItem('PRO_TACTICAL_LOAD',JSON.stringify({sample:false,maker:true,packs:[]}));localStorage.setItem('PRO_TD_MAKER_DRAFT',JSON.stringify(d));sessionStorage.setItem('PRO_TACTICAL_TITLE_SEEN','1');},draft);await page.goto(hub+'#base');await page.reload();
   assert(!(await page.isVisible('#titleScreen')));assert(await page.isVisible('#hubUnits'),label+' unit count in the header');assert(await noSideScroll(page),label+' base width');await shot(page,label+'-base');
   // Mission list: the 96×32 terrain image is drawn (top half brown, bottom half blue).
   await page.goto(hub+'#missions');await page.click('[aria-label="確認作戦"]');const banner=await bgUrl(page,'#detailMap');assert(banner.startsWith('data:image/png'),label+' banner');
   assert.deepEqual((await pixelAt(page,banner,10,5)).slice(0,3),[0x80,0x60,0x40]);assert.deepEqual((await pixelAt(page,banner,10,25)).slice(0,3),[0x20,0x50,0xa0]);assert(await noSideScroll(page),label+' missions width');await shot(page,label+'-missions');
   // Map: forest square restyled by the pack, the squad's unit picture, area overlays with names.
   await page.evaluate(()=>{const L=window.PROUnitLab,T=window.PROTactical,u=L.owned().find(x=>x.id==='bt-a');window.PROField.deploy({missionId:'bt-m',groups:[T.initializeDomains({id:'g1',name:'第1部隊',faction:'player',mode:'auto',members:[{uid:u.uid,unit:u}]},'ground')]});location.hash='#map';});
   await page.waitForSelector('#fieldGrid [data-x="2"][data-y="0"]');await page.waitForTimeout(700);const tile=await bgUrl(page,'#fieldGrid [data-x="2"][data-y="0"]');assert(tile.startsWith('data:image/png'),label+' terrain look');assert.deepEqual((await pixelAt(page,tile,3,3)).slice(0,3),[255,0,0]);
   assert(await page.$('#fieldGrid [data-x="0"][data-y="0"] .unit-pic'),label+' unit picture');assert.equal(await page.textContent('#fieldGrid [data-x="4"][data-y="0"] .area-name'),'前線');
   const ov=await page.$eval('#fieldGrid [data-x="5"][data-y="1"] .area-ov',e=>getComputedStyle(e).backgroundColor);assert(/rgba\(74, 163, 255, 0\.3/.test(ov),label+' overlay '+ov);assert(await page.$('#fieldGrid [data-x="0"][data-y="5"].exit-zone'));
   await shot(page,label+'-map');
   // Long lists in windows scroll inside the window; the bottom buttons stay visible (squad list with many squads).
   await page.evaluate(()=>{const s=window.PROField._live();for(let i=0;i<40;i++)s.groups.push({...JSON.parse(JSON.stringify(s.groups[0])),id:'x'+i,name:'追加'+i,position:{x:i%8,y:4}});window.PROField.openList();});
   {const r=await page.evaluate(()=>{const d=document.getElementById('fieldList'),c=document.getElementById('fieldListClose'),db=d.getBoundingClientRect(),cb=c.getBoundingClientRect(),sc=d.querySelector('.cmd-scroll');return {inside:cb.top>=db.top&&cb.bottom<=db.bottom+1,h:cb.height,scrolls:sc.scrollHeight>sc.clientHeight};});assert(r.inside&&r.h>=30,label+' close button visible '+JSON.stringify(r));assert(r.scrolls,label+' squad list scrolls');}
   await page.evaluate(()=>document.getElementById('fieldList').close());
   // Fixed page: long lists scroll inside their frame (built-in pack: shop, storage, roster), the page itself does not move.
   if(label==='phone'){await page.evaluate(()=>{localStorage.setItem('PRO_TACTICAL_LOAD',JSON.stringify({sample:true,maker:false,packs:[]}));});await page.goto(hub+'#base');await page.reload();await page.evaluate(()=>{const L=window.PROUnitLab;for(const u of window.PROTacticalData.roster())for(let i=0;i<3;i++)L.addOwned(u.id);});
    for(const [h,list] of [['#shop','#shopList'],['#storage','#storageList'],['#roster','#unitRoster']]){await page.goto(hub+h);await page.waitForTimeout(400);assert(await noSideScroll(page),h+' page stays');const r=await page.$eval(list,e=>({sh:e.scrollHeight,ch:e.clientHeight,oy:getComputedStyle(e).overflowY}));assert(r.sh>r.ch&&['auto','scroll'].includes(r.oy),h+' list scrolls in its frame '+JSON.stringify(r));if(h==='#roster'){const gap=await page.$eval(list,g=>{const t=[...g.querySelectorAll('.ug-tile')],a=t[0].getBoundingClientRect(),cols=t.filter(x=>Math.abs(x.getBoundingClientRect().top-a.top)<1).length;return t[cols].getBoundingClientRect().top-a.bottom;});assert(gap>=0,'unit tiles do not overlap ('+gap+')');}await shot(page,'phone-'+h.slice(1));}
    await page.goto(hub+'#base');await page.reload();await page.evaluate(()=>{localStorage.setItem('PRO_TACTICAL_LOAD',JSON.stringify({sample:false,maker:true,packs:[]}));});await page.reload();await page.evaluate(()=>{const L=window.PROUnitLab,T=window.PROTactical,u=L.owned().find(x=>x.id==='bt-a');window.PROField.deploy({missionId:'bt-m',groups:[T.initializeDomains({id:'g1',name:'第1部隊',faction:'player',mode:'auto',members:[{uid:u.uid,unit:u}]},'ground')]});location.hash='#map';});await page.waitForTimeout(500);}
   // Unit window: the large picture.
   await page.evaluate(()=>{const u=window.PROUnitLab.owned().find(x=>x.id==='bt-a');window.PROField.showUnit(u);});assert((await bgUrl(page,'#fieldUnitBody .unit-big-pic')).startsWith('data:image/png'));await page.evaluate(()=>document.getElementById('fieldUnitWindow').close());
   await page.close();}
  // Display settings: large text and PC view are applied after the reload.
  {const page=await browser.newPage({viewport:{width:390,height:844}});page.on('pageerror',e=>errors.push('settings: '+e.message));await page.goto(hub);await page.evaluate(()=>{localStorage.clear();sessionStorage.setItem('PRO_TACTICAL_TITLE_SEEN','1');localStorage.setItem('PRO_TACTICAL_SETTINGS',JSON.stringify({viewMode:'pc',textSize:'large'}));});await page.reload();
   assert.equal(await page.$eval('meta[name=viewport]',m=>m.content),'width=1280');assert.equal(await page.evaluate(()=>getComputedStyle(document.body).zoom),'1.15');await shot(page,'phone-pc-view');await page.close();}
  // Maker: the pixel editor draws, the preview shows the picture; no sideways scrolling on a phone.
  {const page=await browser.newPage({viewport:{width:390,height:844}});page.on('pageerror',e=>errors.push('maker: '+e.message));await page.goto(base+'/game/prototypes/maker_td.html');await page.evaluate(()=>localStorage.clear());await page.reload();
   assert(await page.isVisible('#menuView'));await page.click('[data-open=images]');await page.click('#listNew');await page.click('[data-field=pixels]');await page.click('#inputBody [data-color="0"]');await page.click('#inputBody [data-px="0,0"]');
   const pv=await bgUrl(page,'#inputBody [data-preview="56"]');assert(pv.startsWith('data:image/png'),'maker preview');assert.equal((await pixelAt(page,pv,0,0))[3],255,'drawn dot is opaque');assert.equal((await pixelAt(page,pv,5,5))[3],0,'untouched dot is transparent');
   assert(await noSideScroll(page),'maker width');await shot(page,'maker-pixel-editor');await page.close();}
  assert.deepEqual(errors,[]);console.log('PASS: real browser — title, pixel images drawn (banner, terrain look, unit), area overlays, display settings, phone / PC widths, maker pixel editor');
 }finally{await browser.close();server.close();}
})().catch(e=>{console.error(e);process.exit(1);});
