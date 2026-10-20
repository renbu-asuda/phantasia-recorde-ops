/* Pixel images (stage: dot pictures). An image is a palette of up to 16 colors plus transparent and one character per dot:
   {id, name, size: 16|24|32, palette: ['#rrggbb', ...], px: '.0123456789abcdef' string of size*size}. '.' is transparent.
   Images are kept as data (not drawing commands) and turned into a picture once, then reused (scaled without smoothing). */
(()=>{'use strict';
const SIZES=[16,24,32],MAX_COLORS=16,DIGITS='0123456789abcdef',HEX=/^#[0-9a-f]{6}$/i;
const blank=size=>'.'.repeat(size*size);
// Problems with an image (empty list when it can be used).
function issues(img){const out=[];if(!img||typeof img!=='object')return ['画像のデータがありません'];if(!SIZES.includes(img.size))out.push('大きさは16・24・32のどれかです');
 const pal=img.palette;if(!Array.isArray(pal)||pal.length>MAX_COLORS||pal.some(c=>!HEX.test(String(c))))out.push('色は#rrggbbで16色までです');
 if(typeof img.px!=='string'||img.px.length!==(img.size||0)**2)out.push('ドットの数が大きさと合いません');
 else if(Array.isArray(pal)){for(const ch of new Set(img.px))if(ch!=='.'&&!(DIGITS.indexOf(ch)>=0&&DIGITS.indexOf(ch)<pal.length)){out.push('使われていない色番号のドットがあります');break;}}return out;}
// Copy of an image with a new canvas size (cropped or padded with transparent dots from the top-left).
function resize(img,size){let px='';for(let y=0;y<size;y++)for(let x=0;x<size;x++)px+=x<img.size&&y<img.size?img.px[y*img.size+x]:'.';return {...img,size,px};}
// Picture cache: one data URL per image content.
const cache=new Map();
function dataUrl(img){if(!img||issues(img).length)return '';const k=img.size+'|'+img.palette.join(',')+'|'+img.px;if(cache.has(k))return cache.get(k);let url='';
 try{const c=document.createElement('canvas');c.width=c.height=img.size;const g=c.getContext('2d');if(g){for(let i=0;i<img.px.length;i++){const ch=img.px[i];if(ch==='.')continue;g.fillStyle=img.palette[DIGITS.indexOf(ch)];g.fillRect(i%img.size,Math.floor(i/img.size),1,1);}url=c.toDataURL('image/png');}}catch(e){url='';}
 if(cache.size>500)cache.clear();cache.set(k,url);return url;}
// Shows the image on an element as a crisp background (keeps the element's own content).
function paint(elm,img){const url=dataUrl(img);if(!url)return false;elm.style.backgroundImage='url("'+url+'")';elm.style.backgroundSize='100% 100%';elm.style.imageRendering='pixelated';return true;}
window.PROPixel=Object.freeze({SIZES,MAX_COLORS,DIGITS,blank,issues,resize,dataUrl,paint});
})();
