/* Save / load for the prototype: 3 slots, file export / import. A save bundles the progress (PRO_TACTICAL_HQ) and the
   encounter flags (PRO_TACTICAL_ENCOUNTER) with the data source they belong to. Loading writes them back and reloads
   the page (the suspend save of a running map is separate and is not part of a slot). */
(function(){'use strict';
const $=id=>document.getElementById(id),FORMAT='PRO_TACTICAL_SAVE',SLOTS=3,KEYS={hq:'PRO_TACTICAL_HQ',seen:'PRO_TACTICAL_ENCOUNTER',source:'PRO_TACTICAL_SOURCE'};
const slotKey=i=>'PRO_TACTICAL_SLOT_'+(i+1);
const get=k=>{try{return localStorage.getItem(k);}catch(e){return null;}},put=(k,v)=>{try{if(v==null)localStorage.removeItem(k);else localStorage.setItem(k,v);return true;}catch(e){return false;}};
const parse=t=>{try{return JSON.parse(t);}catch(e){return null;}};
// The current progress as a save bundle.
function snapshot(){window.PROUnitLab?.flush();const hq=parse(get(KEYS.hq))||{};return {format:FORMAT,version:1,savedAt:new Date().toISOString(),source:window.PROTacticalData?.source||'builtin',summary:{day:hq.day||1,credits:hq.credits??null,units:(hq.owned||[]).length,wins:hq.wins||0},hq,seen:parse(get(KEYS.seen))||{}};}
function valid(s){return !!s&&s.format===FORMAT&&s.version===1&&s.hq&&typeof s.hq==='object'&&Array.isArray(s.hq.owned)&&typeof s.seen==='object';}
const read=i=>{const s=parse(get(slotKey(i)));return valid(s)?s:null;};
function describe(s,withTime=true){if(!s)return '空き';const d=new Date(s.savedAt),t=isNaN(d)?'':d.toLocaleString('ja-JP',{month:'numeric',day:'numeric',hour:'2-digit',minute:'2-digit'});return (s.source==='maker'?'［メーカー］':'')+s.summary.day+'日目 ・ 資金 '+(s.summary.credits??0).toLocaleString()+' Cr ・ '+s.summary.units+'体 ・ 勝利'+s.summary.wins+(t&&withTime?'（'+t+'）':'');}
function saveSlot(i){return put(slotKey(i),JSON.stringify(snapshot()));}
// apply(save): write progress back (switching the data source if needed) and reload. Returns a reason when refused.
function apply(s,{reload=true}={}){if(!valid(s))return 'セーブデータの形式が違います';
 if(s.source==='maker'&&!window.PROTacticalData?.hasMakerDraft?.())return 'メーカーの下書きがないため、メーカーのデータで作ったセーブは読み込めません';
 put(KEYS.hq,JSON.stringify(s.hq));put(KEYS.seen,JSON.stringify(s.seen));put(KEYS.source,s.source==='maker'?'maker':'builtin');if(reload)location.reload();return '';}
function exportFile(){const s=snapshot(),a=document.createElement('a');a.href=URL.createObjectURL(new Blob([JSON.stringify(s,null,1)],{type:'application/json'}));a.download='pro-tactical-save-day'+s.summary.day+'.json';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000);}
function importText(text){const s=parse(text);if(!valid(s))return 'セーブデータの形式が違います';return apply(s);}
// Window (shared command window). Each slot: save / load / delete, all with a confirm step.
function win(title,lines,acts){$('labWinKind').textContent='セーブ・ロード';$('labWinTitle').textContent=title;$('labWinBody').replaceChildren(...lines.map(t=>Object.assign(document.createElement('p'),{className:'catalog-line',textContent:t})));
 $('labWinActions').replaceChildren(...acts.map(([label,fn,off,key])=>{const b=document.createElement('button');b.type='button';b.textContent=label;b.onclick=fn;b.disabled=!!off;if(key)b.dataset.save=key;return b;}));const d=$('labWindow');if(!d.open)d.showModal();}
const close=()=>$('labWindow').close();
function confirm(title,lines,label,run){win(title,lines,[[label,run,false,'ok'],['戻る',open]]);}
function open(){const rows=[];for(let i=0;i<SLOTS;i++){const s=read(i);rows.push(['スロット'+(i+1)+'：'+describe(s),()=>openSlot(i),false,'slot'+i]);}
 win('セーブ・ロード',['いまの進行：'+describe(snapshot(),false),'スロットを選んで、セーブ・ロード・削除ができます。ファイルへの書き出し・読み込みもできます。'],[...rows,['ファイルに書き出す',()=>{exportFile();},false,'export'],['ファイルから読み込む',()=>$('saveFile').click(),false,'import'],['閉じる',close]]);}
function openSlot(i){const s=read(i);win('スロット'+(i+1),[describe(s)],[['ここにセーブ',()=>s?confirm('上書きしますか？',['スロット'+(i+1)+'：'+describe(s),'→ '+describe(snapshot(),false)],'上書きする',()=>{saveSlot(i);openSlot(i);}):(saveSlot(i),openSlot(i)),false,'save'],
 ['ロード',()=>confirm('ロードしますか？',['いまの進行はこのセーブで置き換わります（いまの進行を残すなら先にセーブしてください）。','読み込み後、画面を読み込み直します。'],'ロードする',()=>{const r=apply(s);if(r)win('ロードできません',[r],[['戻る',open]]);}),!s,'load'],
 ['削除',()=>confirm('削除しますか？',['スロット'+(i+1)+'：'+describe(s),'元に戻せません。'],'削除する',()=>{put(slotKey(i),null);openSlot(i);}),!s,'delete'],['戻る',open]]);}
$('saveFile').onchange=()=>{const f=$('saveFile').files[0];$('saveFile').value='';if(!f)return;f.text().then(t=>{const r=importText(t);if(r)win('読み込めません',[r],[['戻る',open]]);});};
$('openSave').onclick=open;
window.PROSave=Object.freeze({snapshot,saveSlot,read,apply,importText,valid,SLOTS});
})();
