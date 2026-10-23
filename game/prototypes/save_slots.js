/* Save / load for the prototype: 1 autosave + 3 manual slots, file export / import. A save bundles the progress
   (PRO_TACTICAL_HQ) and the encounter flags (PRO_TACTICAL_ENCOUNTER) with the data source they belong to. Loading
   writes them back and reloads the page. The suspend save of a running map is separate and takes priority: the base
   asks to resume or discard it first, and loading a slot discards it (after a warning). The autosave is written when
   a mission ends and can only be loaded. */
(function(){'use strict';
const $=id=>document.getElementById(id),FORMAT='PRO_TACTICAL_SAVE',SLOTS=3,KEYS={hq:'PRO_TACTICAL_HQ',seen:'PRO_TACTICAL_ENCOUNTER',source:'PRO_TACTICAL_SOURCE'};
const slotKey=i=>i==='auto'?'PRO_TACTICAL_SLOT_AUTO':'PRO_TACTICAL_SLOT_'+(i+1),SUSPEND='PRO_TACTICAL_SUSPEND';
const get=k=>{try{return localStorage.getItem(k);}catch(e){return null;}},put=(k,v)=>{try{if(v==null)localStorage.removeItem(k);else localStorage.setItem(k,v);return true;}catch(e){return false;}};
const parse=t=>{try{return JSON.parse(t);}catch(e){return null;}};
// The current progress as a save bundle.
// Made from the progress in memory (not what the browser storage still holds: a failed save must not export old data).
function snapshot(){const L=window.PROUnitLab;L?.flush();const hq=L?.hqData?.()||parse(get(KEYS.hq))||{};return {format:FORMAT,version:1,savedAt:new Date().toISOString(),source:window.PROTacticalData?.source||'none',load:window.PROTacticalData?.load?.()||null,summary:{day:hq.day||1,credits:hq.credits??null,units:(hq.owned||[]).length,wins:hq.wins||0},hq,seen:window.PROUnitsSeen?.data?.()||parse(get(KEYS.seen))||{}};}
function valid(s){return !!s&&s.format===FORMAT&&s.version===1&&s.hq&&typeof s.hq==='object'&&Array.isArray(s.hq.owned)&&typeof s.seen==='object';}
const read=i=>{const s=parse(get(slotKey(i)));return valid(s)?s:null;};
function describe(s,withTime=true){if(!s)return '空き';const d=new Date(s.savedAt),t=isNaN(d)?'':d.toLocaleString('ja-JP',{month:'numeric',day:'numeric',hour:'2-digit',minute:'2-digit'});return ({maker:'［メーカー］',pack:'［パック］',sample:'［内蔵パック］'}[s.source]||(String(s.source).includes('+')?'［複数パック］':''))+s.summary.day+'日目 ・ 資金 '+(s.summary.credits??0).toLocaleString()+' Cr ・ '+s.summary.units+'体 ・ 勝利'+s.summary.wins+(t&&withTime?'（'+t+'）':'');}
function saveSlot(i){return put(slotKey(i),JSON.stringify(snapshot()));}
// How much this game keeps in the browser (characters of its PRO_ keys; browsers allow about 5 million per site).
function usage(){let n=0;try{for(let i=0;i<localStorage.length;i++){const k=localStorage.key(i);if(k&&k.startsWith('PRO_'))n+=k.length+(localStorage.getItem(k)||'').length;}}catch(e){}return n;}
const usageText=()=>{const n=usage();return '保存しているデータ：約'+(n<10000?(n/10000).toFixed(2):Math.round(n/10000))+'万文字（ブラウザの上限の目安：約500万文字）'+(n>3500000?' ⚠ 残りが少なくなっています':'');};
const autoSave=()=>saveSlot('auto');
const suspended=()=>!!get(SUSPEND);
// apply(save): write progress back (switching the data source if needed) and reload. Returns a reason when refused.
function apply(s,{reload=true}={}){if(!valid(s))return 'セーブデータの形式が違います';
 if(s.source==='maker'&&!window.PROTacticalData?.hasMakerDraft?.())return 'メーカーの下書きがないため、メーカーのデータで作ったセーブは読み込めません';
 if(s.source==='pack'&&!s.load&&!window.PROTacticalData?.hasPack?.())return 'パックファイルが読み込まれていないため、パックのデータで作ったセーブは読み込めません';
 // Saves made with several sources restore the same combination (every pack must still be stored here).
 if(s.load){const have=(window.PROTacticalData?.packs?.()||[]).map(p=>p.packId),miss=(s.load.packs||[]).filter(id=>!have.includes(id));if(miss.length)return 'このセーブに使われたパック（'+miss.join('・')+'）が読み込まれていないため読み込めません';if(s.load.maker&&!window.PROTacticalData?.hasMakerDraft?.())return 'メーカーの下書きがないため、このセーブは読み込めません';}
 // Every write must succeed; otherwise everything (the suspend save included) goes back as it was and nothing reloads.
 const LOAD='PRO_TACTICAL_LOAD',want=[[KEYS.hq,JSON.stringify(s.hq)],[KEYS.seen,JSON.stringify(s.seen)],...(s.load?[[LOAD,JSON.stringify({sample:!!s.load.sample,maker:!!s.load.maker,packs:(s.load.packs||[]).map(String)})],[KEYS.source,null]]:[[LOAD,null],[KEYS.source,['maker','pack','sample','none'].includes(s.source)?s.source:s.source==='builtin'?'sample':'none']])];
 const before=new Map([...want.map(([k])=>[k,get(k)]),[SUSPEND,get(SUSPEND)]]),undo=()=>{for(const k of [...want.map(([k])=>k)].reverse())put(k,before.get(k));put(SUSPEND,before.get(SUSPEND));};
 const write=()=>want.every(([k,v])=>put(k,v));
 // The suspend save is discarded by a load anyway; its space may be what the load needs.
 if(!write()){put(SUSPEND,null);if(!write()){undo();return 'ロードできませんでした（ブラウザの保存領域がいっぱいの可能性があります）。使っていないスロットを削除するか、パックを外してから、もう一度お試しください。いまの進行と中断中の作戦はそのままです。';}}
 put(SUSPEND,null);if(reload)location.reload();return '';}
function exportFile(){const s=snapshot(),a=document.createElement('a');a.href=URL.createObjectURL(new Blob([JSON.stringify(s,null,1)],{type:'application/json'}));a.download='pro-tactical-save-day'+s.summary.day+'.json';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000);}
function importText(text){const s=parse(text);if(!valid(s))return 'セーブデータの形式が違います';return apply(s);}
// Window (shared command window). Each slot: save / load / delete, all with a confirm step.
function win(title,lines,acts){$('labWinKind').textContent='セーブ・ロード';$('labWinTitle').textContent=title;$('labWinBody').replaceChildren(...lines.map(t=>Object.assign(document.createElement('p'),{className:'catalog-line',textContent:t})));
 $('labWinActions').replaceChildren(...acts.map(([label,fn,off,key])=>{const b=document.createElement('button');b.type='button';b.textContent=label;b.onclick=fn;b.disabled=!!off;if(key)b.dataset.save=key;return b;}));const d=$('labWindow');if(!d.open)d.showModal();}
const close=()=>$('labWindow').close();
function confirm(title,lines,label,run){win(title,lines,[[label,run,false,'ok'],['戻る',open]]);}
function open(){const auto=read('auto'),rows=[['オート：'+describe(auto),()=>openSlot('auto'),false,'slotauto']];for(let i=0;i<SLOTS;i++){const s=read(i);rows.push(['スロット'+(i+1)+'：'+describe(s),()=>openSlot(i),false,'slot'+i]);}
 win('セーブ・ロード',[...(suspended()?['⚠ 中断中の作戦があります。拠点に戻ると再開か破棄を先に選びます（中断セーブが優先）。']:[]),'いまの進行：'+describe(snapshot(),false),'スロットを選んで、セーブ・ロード・削除ができます。ファイルへの書き出し・読み込みもできます。',usageText()],[...rows,['ファイルに書き出す',()=>{exportFile();},false,'export'],['ファイルから読み込む',()=>$('saveFile').click(),false,'import'],['閉じる',close]]);}
// A slot save that does not fit says so (the slot keeps what it had).
function slotSaved(i){if(saveSlot(i)){openSlot(i);return;}win('セーブできませんでした',['スロット'+(i+1)+'に保存できませんでした（ブラウザの保存領域がいっぱいの可能性があります）。','使っていないスロットを削除するか、ファイルに書き出してから、もう一度お試しください。',usageText()],[['戻る',()=>openSlot(i)]]);}
function openSlot(i){const s=read(i),isAuto=i==='auto',name=isAuto?'オートセーブ':'スロット'+(i+1);win(name,[describe(s),...(isAuto?['作戦が終わるたびに自動で保存されます（ロードのみ）。']:[])],[...(isAuto?[]:[['ここにセーブ',()=>s?confirm('上書きしますか？',['スロット'+(i+1)+'：'+describe(s),'→ '+describe(snapshot(),false)],'上書きする',()=>{slotSaved(i);}):slotSaved(i),false,'save']]),
 ['ロード',()=>confirm('ロードしますか？',[...(suspended()?['⚠ 中断中の作戦は破棄されます。']:[]),'いまの進行はこのセーブで置き換わります（いまの進行を残すなら先にセーブしてください）。','読み込み後、画面を読み込み直します。'],'ロードする',()=>{const r=apply(s);if(r)win('ロードできません',[r],[['戻る',open]]);}),!s,'load'],
 ...(isAuto?[]:[['削除',()=>confirm('削除しますか？',[name+'：'+describe(s),'元に戻せません。'],'削除する',()=>{put(slotKey(i),null);openSlot(i);}),!s,'delete']]),['戻る',open]]);}
$('saveFile').onchange=()=>{const f=$('saveFile').files[0];$('saveFile').value='';if(!f)return;f.text().then(t=>{const r=importText(t);if(r)win('読み込めません',[r],[['戻る',open]]);});};
$('openSave').onclick=open;
window.PROSave=Object.freeze({describe,autoSave,suspended,snapshot,saveSlot,read,apply,importText,valid,usage,SLOTS});
})();
