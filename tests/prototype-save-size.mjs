import fs from 'node:fs';import path from 'node:path';import assert from 'node:assert/strict';import {Window} from 'happy-dom';
// Save size and full storage: battle logs kept for the newest battles only, a failed save is reported (progress, slots),
// and the save window shows how much the game keeps in the browser. On the built-in tutorial pack.
const file='game/prototypes/tactical_hub.html',html=fs.readFileSync(file,'utf8');
function open(store={}){const w=new Window({url:'http://localhost/'+file,settings:{enableJavaScriptEvaluation:true,disableJavaScriptFileLoading:true,disableCSSFileLoading:true,suppressInsecureJavaScriptEnvironmentWarning:true}});w.scrollTo=()=>{};
 w.localStorage.setItem('PRO_TACTICAL_LOAD',JSON.stringify({sample:true,maker:false,packs:[]}));for(const [k,v] of Object.entries(store))w.localStorage.setItem(k,v);w.document.write(html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/g,''));w.sessionStorage.setItem('PRO_TACTICAL_TITLE_SEEN','1');
 for(const dl of w.document.querySelectorAll('dialog')){dl.showModal=()=>dl.setAttribute('open','');dl.close=()=>{dl.removeAttribute('open');dl.dispatchEvent(new w.Event('close'));};}
 {const C=w.HTMLCanvasElement?.prototype;if(C){C.getContext=()=>({fillRect(){},set fillStyle(v){}});C.toDataURL=()=>'data:image/png;base64,UElY';}}
 for(const m of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/g)){const src=/src=["']([^"']+)["']/.exec(m[1]);w.eval(src?fs.readFileSync(path.resolve(path.dirname(file),src[1]),'utf8'):m[2]);}return w;}
const dump=w=>{const s=w.localStorage,o={};for(let i=0;i<s.length;i++){const k=s.key(i);o[k]=s.getItem(k);}return o;};
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
 d.querySelector('#openSave').click();assert(d.getElementById('labWinBody').textContent.includes('保存しているデータ：約'),'usage shown, the file / slot snapshot from memory (#188), a load that does not fit changes nothing (#189)');
 d.querySelector('#labWinActions [data-save="slot0"]').click();d.querySelector('#labWinActions [data-save="save"]').click();
 assert(d.getElementById('labWinTitle').textContent.includes('セーブできませんでした'),d.getElementById('labWinTitle').textContent);full=false;}
// A storage that only refuses what does not fit (PRO_ keys up to limit characters), or refuses the given keys.
function quota(w,{limit=Infinity,refuse=[]}={}){const real=w.localStorage,size=()=>{let n=0;for(let i=0;i<real.length;i++){const k=real.key(i);if(k.startsWith('PRO_'))n+=k.length+(real.getItem(k)||'').length;}return n;};
 const fake={get length(){return real.length;},key:i=>real.key(i),getItem:k=>real.getItem(k),removeItem:k=>real.removeItem(k),clear:()=>real.clear(),setItem:(k,v)=>{const old=real.getItem(k);if(refuse.includes(k)||size()-(old==null?0:k.length+old.length)+k.length+String(v).length>fake.limit)throw new w.DOMException('full','QuotaExceededError');return real.setItem(k,v);},limit,size};
 Object.defineProperty(w,'localStorage',{configurable:true,get:()=>fake});return fake;}
// #188: with the progress no longer saved, the file / slot snapshot still has the latest progress (from memory).
{const w=open();const L=w.PROUnitLab,S=w.PROSave;L.flush();const q=quota(w);q.limit=q.size()+10;const units=L.owned().length;
 L.spend(-123);L.addOwned(L.owned()[0].id);await wait(10);const stored=JSON.parse(w.localStorage.getItem('PRO_TACTICAL_HQ'));assert.equal(stored.owned.length,units,'the progress did not fit');
 const snap=S.snapshot();assert.equal(snap.hq.credits,L.hqData().credits,'credits from memory');assert.equal(snap.hq.owned.length,units+1,'units from memory');assert.equal(snap.summary.units,units+1);
 assert.deepEqual(Object.keys(snap.seen).sort().join(),w.PROUnitsSeen.all().sort().join(),'encounters from memory');}
// #189: a load that does not fit changes nothing (progress, encounters, source, suspend); one that fits after the
// suspend save goes, or fits anyway, discards the suspend save only once everything is written.
{const big=(w,n)=>{const s=w.PROSave.snapshot();s.hq={...s.hq,credits:77777,pad:'x'.repeat(n)};return s;};
 const SUS='PRO_TACTICAL_SUSPEND',sus='{"state":"'+'s'.repeat(3000)+'"}';
 {const w=open({[SUS]:sus});const S=w.PROSave;w.PROUnitLab.flush();const before=dump(w),q=quota(w);q.limit=q.size()+1000;
  const r=S.apply(big(w,8000),{reload:false});assert.match(r,/ロードできませんでした/);assert.deepEqual(dump(w),before,'nothing changed (suspend kept)');}
 for(const key of ['PRO_TACTICAL_HQ','PRO_TACTICAL_ENCOUNTER','PRO_TACTICAL_LOAD']){const w=open({[SUS]:sus});const S=w.PROSave;w.PROUnitLab.flush();const s=big(w,10),before=dump(w);quota(w,{refuse:[key]});
  assert.match(S.apply(s,{reload:false}),/ロードできませんでした/,key);assert.deepEqual(dump(w),before,'all restored when '+key+' fails');}
 {const w=open({[SUS]:sus});const S=w.PROSave;w.PROUnitLab.flush();const q=quota(w);q.limit=q.size()+1000;
  assert.equal(S.apply(big(w,2500),{reload:false}),'','fits once the suspend save goes');assert.equal(w.localStorage.getItem(SUS),null);assert.equal(JSON.parse(w.localStorage.getItem('PRO_TACTICAL_HQ')).credits,77777);}
 {const w=open({[SUS]:sus});const S=w.PROSave;w.PROUnitLab.flush();assert.equal(S.apply(big(w,10),{reload:false}),'');assert.equal(w.localStorage.getItem(SUS),null,'a normal load discards the suspend save');assert.equal(JSON.parse(w.localStorage.getItem('PRO_TACTICAL_HQ')).credits,77777);}}
console.log('PASS: save size — logs for the newest battles only (and on load), worst case within storage, a full storage is reported (progress, slots), usage shown, the file / slot snapshot from memory (#188), a load that does not fit changes nothing (#189)');
