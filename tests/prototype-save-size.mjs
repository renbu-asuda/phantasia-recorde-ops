import fs from 'node:fs';import path from 'node:path';import assert from 'node:assert/strict';import {Window} from 'happy-dom';
// Save size and full storage: battle logs kept for the newest battles only, a failed save is reported (progress, slots),
// and the save window shows how much the game keeps in the browser. On the built-in tutorial pack.
const file='game/prototypes/tactical_hub.html',html=fs.readFileSync(file,'utf8');
function open(store={}){const w=new Window({url:'http://localhost/'+file,settings:{enableJavaScriptEvaluation:true,disableJavaScriptFileLoading:true,disableCSSFileLoading:true,suppressInsecureJavaScriptEnvironmentWarning:true}});w.scrollTo=()=>{};
 w.localStorage.setItem('PRO_TACTICAL_LOAD',JSON.stringify({sample:true,maker:false,packs:[]}));for(const [k,v] of Object.entries(store))w.localStorage.setItem(k,v);w.document.write(html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/g,''));w.sessionStorage.setItem('PRO_TACTICAL_TITLE_SEEN','1');
 for(const dl of w.document.querySelectorAll('dialog')){dl.showModal=()=>dl.setAttribute('open','');dl.close=()=>{dl.removeAttribute('open');dl.dispatchEvent(new w.Event('close'));};}
 {const C=w.HTMLCanvasElement?.prototype;if(C){C.getContext=()=>({fillRect(){},set fillStyle(v){}});C.toDataURL=()=>'data:image/png;base64,UElY';}}
 for(const m of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/g)){const src=/src=["']([^"']+)["']/.exec(m[1]);w.eval(src?fs.readFileSync(path.resolve(path.dirname(file),src[1]),'utf8'):m[2]);}return w;}
const dump=w=>Object.fromEntries(Object.keys(w.localStorage).map(k=>[k,w.localStorage.getItem(k)]));
const wait=ms=>new Promise(r=>setTimeout(r,ms));
const T1='sample-TM-000001';

// Battle logs: full logs for the newest 5 battles; older records keep their summary (also when an older save loads).
{const w=open();const L=w.PROUnitLab,d=w.document,m=w.PROTacticalData.mission(T1);const long=Array.from({length:1500},(_,i)=>'ログの行 '+i+' '.repeat(30));
 for(let i=0;i<7;i++)L.recordBattle(m,'dispatch',null,{outcome:'win',turns:i+1,log:long});const h=L.history();assert.equal(h.length,7);
 assert.equal(h.map(x=>x.log.length).join(),'1500,1500,1500,1500,1500,0,0');assert(h[6].logTrimmed&&h[6].turns===1,'the summary stays');
 L.openHistory();d.querySelector('#labWinActions [data-lab=hist6]').click();assert(d.getElementById('labWinBody').textContent.includes('新しい5戦ぶん'));
 const st=JSON.parse(w.localStorage.getItem('PRO_TACTICAL_HQ'));st.history=Array.from({length:12},(_,i)=>({day:1,id:T1,name:'x',kind:'tactical',outcome:'win',turns:i,stars:0,credits:0,log:['a','b']}));
 const w2=open({PRO_TACTICAL_HQ:JSON.stringify(st)});assert.equal(w2.PROUnitLab.history().map(x=>x.log.length).join(),'2,2,2,2,2,0,0,0,0,0,0,0','an older save is trimmed on load');
 // Worst case stays well inside the browser's storage: the save with 20 long records, copied to the autosave and 3 slots.
 for(let i=0;i<20;i++)L.recordBattle(m,'dispatch',null,{outcome:'draw',turns:300,log:long});L.settled();const S=w.PROSave;for(let i=0;i<S.SLOTS;i++)assert(S.saveSlot(i));
 const used=S.usage();assert(used<2500000,'worst case '+used+' characters');}

// A save that does not fit is reported once (progress), and a slot save that does not fit says so.
{const w=open();const L=w.PROUnitLab,d=w.document,real=w.localStorage;let full=true;
 // A full storage: writing the progress or a slot throws, as a browser does.
 const fake={get length(){return real.length;},key:i=>real.key(i),getItem:k=>real.getItem(k),removeItem:k=>real.removeItem(k),clear:()=>real.clear(),setItem:(k,v)=>{if(full&&(k==='PRO_TACTICAL_HQ'||k.startsWith('PRO_TACTICAL_SLOT')))throw new w.DOMException('full','QuotaExceededError');return real.setItem(k,v);}};
 Object.defineProperty(w,'localStorage',{configurable:true,get:()=>fake});
 L.spend(-10);await wait(10);assert(d.getElementById('labWindow').open,'warning shown');assert.equal(d.getElementById('labWinKind').textContent,'セーブできませんでした');
 d.getElementById('labWindow').close();L.spend(-10);await wait(10);assert(!d.getElementById('labWindow').open,'only once');
 d.querySelector('#openSave').click();assert(d.getElementById('labWinBody').textContent.includes('保存しているデータ：約'),'usage shown');
 d.querySelector('#labWinActions [data-save="slot0"]').click();d.querySelector('#labWinActions [data-save="save"]').click();
 assert(d.getElementById('labWinTitle').textContent.includes('セーブできませんでした'),d.getElementById('labWinTitle').textContent);full=false;}
console.log('PASS: save size — logs for the newest battles only (and on load), worst case within storage, a full storage is reported (progress, slots), usage shown');
