/* T&D maker: pixel images (kind 'images'). Drawn here with dot / rectangle / fill / eyedropper tools on a 16, 24 or 32 dot
   canvas with up to 16 colors plus transparent; units and terrains choose an image by ID (imageId). */
(()=>{'use strict';
const X=window.PROMakerTD.extend,PX=window.PROPixel;
const {el,win,closeWin,commit,data,clone}=X;
const BASE_TILE=56,PREVIEW=[28,56,84];
const btn=(label,fn,cls='secondary')=>{const b=el('button',label,cls);b.type='button';b.onclick=fn;return b;};
function pick(title,choices,cur,done,back){win(title,'',body=>{const l=el('div',null,'cmd-list');for(const [k,label] of Object.entries(choices)){const b=btn((k===cur?'✓ ':'')+label,()=>done(k),'');b.dataset.choice=k;l.append(b);}body.append(l);},[['戻る',back]]);}
function textPrompt(title,value,done,back,max=40){win(title,'',body=>{const t=el('input');t.id='inputValue';t.value=value||'';t.maxLength=max;body.append(t);},[['決定',()=>done(document.getElementById('inputValue').value.trim())],['戻る',back]]);}
const blankImage=()=>({name:'新しい画像',size:16,palette:['#000000','#ffffff'],px:PX.blank(16)});
const imageText=x=>{if(!x)return 'なし';const {w,h}=PX.dims(x);return w+'×'+h+(PX.isBanner(x)?'（地形イメージ）':'')+' ・ '+x.palette.length+'色';};
const thumb=(x,px=40)=>{const t=el('span',null,'pix-thumb');t.style.width=t.style.height=px+'px';PX.paint(t,x);return t;};

// Drawing window. Edits a copy; 決定 stores it.
function editor(x){let S={...(x.w?{w:x.w,h:x.h}:{size:x.size}),palette:[...x.palette],px:x.px},tool='dot',color=x.palette.length?'0':'.',rectStart=null;const undo=[],redo=[],snap=()=>JSON.stringify(S),
  // After undo / redo the chosen colour must still be in the palette (else back to the first colour, or clear).
  fixColor=()=>{if(color!=='.'&&PX.DIGITS.indexOf(color)>=S.palette.length)color=S.palette.length?PX.DIGITS[0]:'.';},push=()=>{undo.push(snap());if(undo.length>100)undo.shift();redo.length=0;};
 const W=()=>PX.dims(S).w,H=()=>PX.dims(S).h;
 const setDot=(a,b,ch)=>{if(a<0||b<0||a>=W()||b>=H())return;/* never outside the picture */const i=b*W()+a;S.px=S.px.slice(0,i)+ch+S.px.slice(i+1);};
 const get=(a,b)=>S.px[b*W()+a];
 const fill=(a,b)=>{const from=get(a,b);if(from===color)return;const arr=S.px.split(''),q=[[a,b]];while(q.length){const [i,j]=q.pop();if(i<0||j<0||i>=W()||j>=H()||arr[j*W()+i]!==from)continue;arr[j*W()+i]=color;q.push([i+1,j],[i-1,j],[i,j+1],[i,j-1]);}S.px=arr.join('');};
 const transform=f=>{push();const w=W(),h=H(),arr=S.px.split(''),out=new Array(w*h).fill('.');for(let j=0;j<h;j++)for(let i=0;i<w;i++){const [a,b]=f(i,j,w,h);if(a>=0&&b>=0&&a<w&&b<h)out[b*w+a]=arr[j*w+i];}S.px=out.join('');draw();};
 const tap=(a,b)=>{if(tool==='pick'){color=get(a,b);tool='dot';return draw();}if(tool==='rect'&&!rectStart){rectStart={x:a,y:b};return draw();}push();
  if(tool==='dot')setDot(a,b,color);else if(tool==='fill')fill(a,b);else if(tool==='rect'){for(let j=Math.min(b,rectStart.y);j<=Math.max(b,rectStart.y);j++)for(let i=Math.min(a,rectStart.x);i<=Math.max(a,rectStart.x);i++)setDot(i,j,color);rectStart=null;}draw();};
 // Color: a color picker and the same value as #rrggbb text (either can be used; they follow each other).
 const colorPrompt=(cur,done)=>win('色を選ぶ','カラーピッカーで選ぶか、#rrggbb で入れます。',body=>{const p=el('input');p.type='color';p.id='inputColor';p.value=cur||'#808080';const t=el('input');t.id='inputValue';t.value=cur||'#808080';t.maxLength=7;const sw=el('span',null,'pix-thumb');sw.style.width=sw.style.height='40px';sw.style.background=p.value;
  p.oninput=p.onchange=()=>{t.value=p.value;sw.style.background=p.value;};t.oninput=()=>{const c=t.value.startsWith('#')?t.value:'#'+t.value;if(/^#[0-9a-fA-F]{6}$/.test(c)){p.value=c.toLowerCase();sw.style.background=c;}};const r=el('div',null,'pix-preview');r.append(p,sw,t);body.append(r);},
  [['決定',()=>{const v=document.getElementById('inputValue').value.trim(),c=v.startsWith('#')?v:'#'+v;if(/^#[0-9a-fA-F]{6}$/.test(c))done(c.toLowerCase());else draw();}],['戻る',draw]]);
 const save=()=>{commit(o=>{delete o.size;delete o.w;delete o.h;Object.assign(o,S.w?{w:S.w,h:S.h}:{size:S.size});o.palette=S.palette;o.px=S.px;});closeWin();};
 const draw=()=>win((x.name||'画像')+'（'+W()+'×'+H()+'）','道具と色を選んでドットを押します。四角は始点と終点の2回押し。スポイトは押したドットの色を拾います。',body=>{
  const row=(cls)=>{const r=el('div',null,cls||'td-nums');body.append(r);return r;};
  const tools=row('tmap-modes');for(const [k,label] of [['dot','1ドット'],['rect','四角'],['fill','塗りつぶし'],['pick','スポイト']]){const b=btn((tool===k?'✓ ':'')+label,()=>{tool=k;rectStart=null;draw();});b.dataset.ptool=k;tools.append(b);}
  const ops=row();for(const [k,label,fn,dis] of [['undo','元に戻す',()=>{redo.push(snap());S=JSON.parse(undo.pop());rectStart=null;fixColor();draw();},!undo.length],['redo','やり直し',()=>{undo.push(snap());S=JSON.parse(redo.pop());rectStart=null;fixColor();draw();},!redo.length],
   ['fliph','左右反転',()=>transform((i,j,w)=>[w-1-i,j])],['flipv','上下反転',()=>transform((i,j,w,h)=>[i,h-1-j])],['up','↑ずらす',()=>transform((i,j)=>[i,j-1])],['down','↓ずらす',()=>transform((i,j)=>[i,j+1])],['left','←ずらす',()=>transform((i,j)=>[i-1,j])],['right','→ずらす',()=>transform((i,j)=>[i+1,j])],
   ['size','大きさ '+(S.w?'96×32':S.size),()=>pick('大きさ（小さくすると右と下が切れます）',{...Object.fromEntries(PX.SIZES.map(n=>[String(n),n+'×'+n+'（ユニット・地形）'])),banner:'96×32（ミッション選択の地形イメージ）'},S.w?'banner':String(S.size),k=>{push();rectStart=null;/* a pending 四角 start belongs to the old size */const {palette,px}=PX.resize({...S},k==='banner'?'banner':Number(k));S=k==='banner'?{w:96,h:32,palette,px}:{size:Number(k),palette,px};draw();},draw)]]){const b=btn(label,fn);b.dataset.ptool=k;b.disabled=!!dis;ops.append(b);}
  const pal=row('tmap-palette');const sw=(ch,label,bg)=>{const b=btn((color===ch?'✓ ':'')+label,()=>{color=ch;if(tool==='pick')tool='dot';draw();},'tmap-swatch pix-swatch');b.dataset.color=ch;if(bg)b.style.background=bg;pal.append(b);};
  sw('.','透明');S.palette.forEach((c,i)=>sw(PX.DIGITS[i],String(i+1),c));
  if(S.palette.length<PX.MAX_COLORS){const b=btn('＋ 色を足す',()=>colorPrompt('#808080',c=>{push();S.palette=[...S.palette,c];color=PX.DIGITS[S.palette.length-1];draw();}));b.dataset.ptool='addcolor';pal.append(b);}
  if(color!=='.'){const i=PX.DIGITS.indexOf(color);const b=btn('選んだ色を変える',()=>colorPrompt(S.palette[i],c=>{push();S.palette=S.palette.map((x,j)=>j===i?c:x);draw();}));b.dataset.ptool='editcolor';pal.append(b);}
  if(tool==='rect'&&rectStart)body.append(el('p','始点 ('+(rectStart.x+1)+','+(rectStart.y+1)+') — 終点のドットを押してください','cmd-hint'));
  const grid=el('div',null,'pix-grid');grid.style.setProperty('--cols',W());if(S.w)grid.classList.add('pix-wide');for(let j=0;j<H();j++)for(let i=0;i<W();i++){const ch=get(i,j),b=el('button',null,'pix-cell'+(ch==='.'?' pix-clear':''));b.type='button';b.dataset.px=i+','+j;if(ch!=='.')b.style.background=S.palette[PX.DIGITS.indexOf(ch)];b.setAttribute('aria-label',(i+1)+','+(j+1));b.onclick=()=>tap(i,j);grid.append(b);}body.append(grid);
  const pv=row('pix-preview');if(S.w){pv.append(el('span','ミッション選択での見え方：'));for(const [n,w,h] of [['pc',435,115],['phone',180,90]]){const t=el('span',null,'pix-banner');t.style.width=w+'px';t.style.height=h+'px';PX.paint(t,S);t.style.backgroundSize='cover';t.style.backgroundPosition='center';t.dataset.preview=n;t.title=n==='pc'?'PC（実寸の半分）':'スマホ（実寸の半分）';pv.append(t);}}else pv.append(el('span','マスでの見え方：'));if(!S.w)for(const n of PREVIEW){const t=thumb(S,n);t.classList.add('field-tile');t.dataset.preview=n;t.title=n+'px'+(n===BASE_TILE?'（基準）':'');pv.append(t);}
 },[['決定',save],['戻る',closeWin]]);
 draw();}

X.registerKind('images',{label:'画像（ドット絵）',en:'PIXEL IMAGES',prefix:'img'},blankImage,[
 {key:'name',label:'画像名',type:'text',max:20,group:'基本'},{key:'id',label:'ID',type:'id',group:'基本'},{key:'pixels',label:'描く',type:'pixedit',group:'基本'}],
 {display:{pixedit:(v,x)=>imageText(x),imgref:v=>{const x=v&&data().images.find(i=>i.id===v);return x?x.name+'（'+imageText(x)+'）':v?'⚠ '+v:'なし';}},
  edit:{pixedit:(f,x)=>editor(x),imgref:(f,x)=>pick('画像',{'':'なし',...Object.fromEntries(data().images.filter(i=>!PX.isBanner(i)).map(i=>[i.id,i.name]))},x.imageId||'',k=>{commit(o=>{if(k)o.imageId=k;else delete o.imageId;});closeWin();},closeWin)},
  issues:x=>PX.issues(x),
  refsFor:{units:o=>o.imageId?[['images',o.imageId]]:[],terrains:o=>o.imageId?[['images',o.imageId]]:[],tmissions:o=>o.mapImageId?[['images',o.mapImageId]]:[]},
  mapRefs:(k,fn)=>{if(k!=='images')return;for(const kk of ['units','terrains'])for(const o of data()[kk]||[])if(o.imageId){const n=fn(o.imageId);if(n)o.imageId=n;else delete o.imageId;}for(const m of data().tmissions||[])if(m.mapImageId){const n=fn(m.mapImageId);if(n)m.mapImageId=n;else delete m.mapImageId;}const L=data().terrainLooks;if(L)for(const [t,v] of Object.entries(L)){const n=fn(v.imageId);if(n)v.imageId=n;else delete L[t];}}});
// Pack setting: pixel images replacing the look of standard (built-in, one-letter) terrains: terrainLooks {key:{imageId}}.
const BUILTIN=window.PROTacticalTerrains||{};
function looksWindow(){const L=clone(data().terrainLooks||{}),img=id=>data().images.find(i=>i.id===id);
 const draw=()=>win('標準地形の見た目','このパックを読み込むと、標準の地形がここで選んだ画像で表示されます（性能は変わりません）。',body=>{const l=el('div',null,'cmd-list');for(const [k,t] of Object.entries(BUILTIN)){const cur=L[k]?.imageId,b=btn('',()=>pick(t.name+'の画像',{'':'なし（標準の色）',...Object.fromEntries(data().images.map(i=>[i.id,i.name]))},cur||'',v=>{if(v)L[k]={imageId:v};else delete L[k];draw();},draw),'unit-row setting-row td-row');b.dataset.look=k;const x=cur&&img(cur);if(x)b.append(thumb(x,28));b.append(el('span',t.name),el('b',x?x.name:cur?'⚠ '+cur:'標準の色'));l.append(b);}body.append(l);},
  [['決定',()=>{commit(o=>{if(Object.keys(L).length)o.terrainLooks=L;else delete o.terrainLooks;});closeWin();}],['戻る',closeWin]]);draw();}
X.registerType('tlooks',{display:v=>{const n=Object.keys(v||{}).length;return n?n+'種類を上書き':'上書きなし';},edit:()=>looksWindow()});
// Mission terrain image (ミッション選択の地形イメージ): a 96×32 image chosen on a tactical mission.
X.registerType('bannerref',{display:v=>{const x=v&&data().images.find(i=>i.id===v);return x?x.name:v?'⚠ '+v:'なし（作戦の色）';},edit:(f,x)=>{const list=data().images.filter(i=>PX.isBanner(i));pick(list.length?'地形イメージ（96×32の画像）':'96×32の画像がありません（画像で大きさを 96×32 にして作ります）',{'':'なし（作戦の色）',...Object.fromEntries(list.map(i=>[i.id,i.name]))},x.mapImageId||'',k=>{commit(o=>{if(k)o.mapImageId=k;else delete o.mapImageId;});closeWin();},closeWin);}});
window.PROMakerImages=Object.freeze({editor,thumb,imageText});
})();
