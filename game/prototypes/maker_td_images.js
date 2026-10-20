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
const imageText=x=>x?x.size+'×'+x.size+' ・ '+x.palette.length+'色':'なし';
const thumb=(x,px=40)=>{const t=el('span',null,'pix-thumb');t.style.width=t.style.height=px+'px';PX.paint(t,x);return t;};

// Drawing window. Edits a copy; 決定 stores it.
function editor(x){let S={size:x.size,palette:[...x.palette],px:x.px},tool='dot',color=x.palette.length?'0':'.',rectStart=null;const undo=[],redo=[],snap=()=>JSON.stringify(S),push=()=>{undo.push(snap());if(undo.length>100)undo.shift();redo.length=0;};
 const setDot=(a,b,ch)=>{const i=b*S.size+a;S.px=S.px.slice(0,i)+ch+S.px.slice(i+1);};
 const get=(a,b)=>S.px[b*S.size+a];
 const fill=(a,b)=>{const from=get(a,b);if(from===color)return;const arr=S.px.split(''),q=[[a,b]];while(q.length){const [i,j]=q.pop();if(i<0||j<0||i>=S.size||j>=S.size||arr[j*S.size+i]!==from)continue;arr[j*S.size+i]=color;q.push([i+1,j],[i-1,j],[i,j+1],[i,j-1]);}S.px=arr.join('');};
 const transform=f=>{push();const n=S.size,arr=S.px.split(''),out=new Array(n*n).fill('.');for(let j=0;j<n;j++)for(let i=0;i<n;i++){const [a,b]=f(i,j,n);if(a>=0&&b>=0&&a<n&&b<n)out[b*n+a]=arr[j*n+i];}S.px=out.join('');draw();};
 const tap=(a,b)=>{if(tool==='pick'){color=get(a,b);tool='dot';return draw();}if(tool==='rect'&&!rectStart){rectStart={x:a,y:b};return draw();}push();
  if(tool==='dot')setDot(a,b,color);else if(tool==='fill')fill(a,b);else if(tool==='rect'){for(let j=Math.min(b,rectStart.y);j<=Math.max(b,rectStart.y);j++)for(let i=Math.min(a,rectStart.x);i<=Math.max(a,rectStart.x);i++)setDot(i,j,color);rectStart=null;}draw();};
 // Color: a color picker and the same value as #rrggbb text (either can be used; they follow each other).
 const colorPrompt=(cur,done)=>win('色を選ぶ','カラーピッカーで選ぶか、#rrggbb で入れます。',body=>{const p=el('input');p.type='color';p.id='inputColor';p.value=cur||'#808080';const t=el('input');t.id='inputValue';t.value=cur||'#808080';t.maxLength=7;const sw=el('span',null,'pix-thumb');sw.style.width=sw.style.height='40px';sw.style.background=p.value;
  p.oninput=p.onchange=()=>{t.value=p.value;sw.style.background=p.value;};t.oninput=()=>{const c=t.value.startsWith('#')?t.value:'#'+t.value;if(/^#[0-9a-fA-F]{6}$/.test(c)){p.value=c.toLowerCase();sw.style.background=c;}};const r=el('div',null,'pix-preview');r.append(p,sw,t);body.append(r);},
  [['決定',()=>{const v=document.getElementById('inputValue').value.trim(),c=v.startsWith('#')?v:'#'+v;if(/^#[0-9a-fA-F]{6}$/.test(c))done(c.toLowerCase());else draw();}],['戻る',draw]]);
 const save=()=>{commit(o=>{o.size=S.size;o.palette=S.palette;o.px=S.px;});closeWin();};
 const draw=()=>win((x.name||'画像')+'（'+S.size+'×'+S.size+'）','道具と色を選んでドットを押します。四角は始点と終点の2回押し。スポイトは押したドットの色を拾います。',body=>{
  const row=(cls)=>{const r=el('div',null,cls||'td-nums');body.append(r);return r;};
  const tools=row('tmap-modes');for(const [k,label] of [['dot','1ドット'],['rect','四角'],['fill','塗りつぶし'],['pick','スポイト']]){const b=btn((tool===k?'✓ ':'')+label,()=>{tool=k;rectStart=null;draw();});b.dataset.ptool=k;tools.append(b);}
  const ops=row();for(const [k,label,fn,dis] of [['undo','元に戻す',()=>{redo.push(snap());S=JSON.parse(undo.pop());draw();},!undo.length],['redo','やり直し',()=>{undo.push(snap());S=JSON.parse(redo.pop());draw();},!redo.length],
   ['fliph','左右反転',()=>transform((i,j,n)=>[n-1-i,j])],['flipv','上下反転',()=>transform((i,j,n)=>[i,n-1-j])],['up','↑ずらす',()=>transform((i,j)=>[i,j-1])],['down','↓ずらす',()=>transform((i,j)=>[i,j+1])],['left','←ずらす',()=>transform((i,j)=>[i-1,j])],['right','→ずらす',()=>transform((i,j)=>[i+1,j])],
   ['size','大きさ '+S.size,()=>pick('大きさ（小さくすると右と下が切れます）',Object.fromEntries(PX.SIZES.map(n=>[String(n),n+'×'+n])),String(S.size),k=>{push();S={...S,...PX.resize({...S},Number(k))};draw();},draw)]]){const b=btn(label,fn);b.dataset.ptool=k;b.disabled=!!dis;ops.append(b);}
  const pal=row('tmap-palette');const sw=(ch,label,bg)=>{const b=btn((color===ch?'✓ ':'')+label,()=>{color=ch;if(tool==='pick')tool='dot';draw();},'tmap-swatch pix-swatch');b.dataset.color=ch;if(bg)b.style.background=bg;pal.append(b);};
  sw('.','透明');S.palette.forEach((c,i)=>sw(PX.DIGITS[i],String(i+1),c));
  if(S.palette.length<PX.MAX_COLORS){const b=btn('＋ 色を足す',()=>colorPrompt('#808080',c=>{push();S.palette=[...S.palette,c];color=PX.DIGITS[S.palette.length-1];draw();}));b.dataset.ptool='addcolor';pal.append(b);}
  if(color!=='.'){const i=PX.DIGITS.indexOf(color);const b=btn('選んだ色を変える',()=>colorPrompt(S.palette[i],c=>{push();S.palette=S.palette.map((x,j)=>j===i?c:x);draw();}));b.dataset.ptool='editcolor';pal.append(b);}
  if(tool==='rect'&&rectStart)body.append(el('p','始点 ('+(rectStart.x+1)+','+(rectStart.y+1)+') — 終点のドットを押してください','cmd-hint'));
  const grid=el('div',null,'pix-grid');grid.style.setProperty('--cols',S.size);for(let j=0;j<S.size;j++)for(let i=0;i<S.size;i++){const ch=get(i,j),b=el('button',null,'pix-cell'+(ch==='.'?' pix-clear':''));b.type='button';b.dataset.px=i+','+j;if(ch!=='.')b.style.background=S.palette[PX.DIGITS.indexOf(ch)];b.setAttribute('aria-label',(i+1)+','+(j+1));b.onclick=()=>tap(i,j);grid.append(b);}body.append(grid);
  const pv=row('pix-preview');pv.append(el('span','マスでの見え方：'));for(const n of PREVIEW){const t=thumb(S,n);t.classList.add('field-tile');t.dataset.preview=n;t.title=n+'px'+(n===BASE_TILE?'（基準）':'');pv.append(t);}
 },[['決定',save],['戻る',closeWin]]);
 draw();}

X.registerKind('images',{label:'画像（ドット絵）',en:'PIXEL IMAGES',prefix:'img'},blankImage,[
 {key:'name',label:'画像名',type:'text',max:20,group:'基本'},{key:'id',label:'ID',type:'id',group:'基本'},{key:'pixels',label:'描く',type:'pixedit',group:'基本'}],
 {display:{pixedit:(v,x)=>imageText(x),imgref:v=>{const x=v&&data().images.find(i=>i.id===v);return x?x.name+'（'+imageText(x)+'）':v?'⚠ '+v:'なし';}},
  edit:{pixedit:(f,x)=>editor(x),imgref:(f,x)=>pick('画像',{'':'なし',...Object.fromEntries(data().images.map(i=>[i.id,i.name]))},x.imageId||'',k=>{commit(o=>{if(k)o.imageId=k;else delete o.imageId;});closeWin();},closeWin)},
  issues:x=>PX.issues(x),
  mapRefs:(k,fn)=>{if(k!=='images')return;for(const kk of ['units','terrains'])for(const o of data()[kk]||[])if(o.imageId){const n=fn(o.imageId);if(n)o.imageId=n;else delete o.imageId;}}});
window.PROMakerImages=Object.freeze({editor,thumb,imageText});
})();
