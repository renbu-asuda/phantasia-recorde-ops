/* Pixel images (stage: dot pictures). An image is a palette of up to 16 colors plus transparent and one character per dot:
   {id, name, size: 16|24|32, palette: ['#rrggbb', ...], px: '.0123456789abcdef' string of size*size}. '.' is transparent.
   A mission terrain image (地形イメージ) is a 96×32 banner: {w:96, h:32, ...} instead of size.
   Images are kept as data (not drawing commands) and turned into a picture once, then reused (scaled without smoothing). */
(()=>{'use strict';
const SIZES=[16,24,32],MAX_COLORS=16,DIGITS='0123456789abcdef',HEX=/^#[0-9a-f]{6}$/i;
const BANNER={w:96,h:32};
const dims=img=>img&&img.w?{w:img.w,h:img.h}:{w:img?.size,h:img?.size},isBanner=img=>!!img&&img.w===BANNER.w&&img.h===BANNER.h;
const blank=(size,h=size)=>'.'.repeat(size*h);
// Problems with an image (empty list when it can be used).
function issues(img){const out=[];if(!img||typeof img!=='object')return ['画像のデータがありません'];if(!(isBanner(img)&&img.size==null)&&!(SIZES.includes(img.size)&&img.w==null))out.push('大きさは16・24・32か、地形イメージ（96×32）です');
 const pal=img.palette;if(!Array.isArray(pal)||pal.length>MAX_COLORS||pal.some(c=>!HEX.test(String(c))))out.push('色は#rrggbbで16色までです');
 const {w,h}=dims(img);if(typeof img.px!=='string'||img.px.length!==(w||0)*(h||0))out.push('ドットの数が大きさと合いません');
 else if(Array.isArray(pal)){for(const ch of new Set(img.px))if(ch!=='.'&&!(DIGITS.indexOf(ch)>=0&&DIGITS.indexOf(ch)<pal.length)){out.push('使われていない色番号のドットがあります');break;}}return out;}
// Copy of an image with a new canvas size (cropped or padded with transparent dots from the top-left).
function resize(img,size){const from=dims(img),to=size==='banner'?BANNER:{w:size,h:size};let px='';for(let y=0;y<to.h;y++)for(let x=0;x<to.w;x++)px+=x<from.w&&y<from.h?img.px[y*from.w+x]:'.';const {size:_s,w:_w,h:_h,...rest}=img;return size==='banner'?{...rest,w:BANNER.w,h:BANNER.h,px}:{...rest,size,px};}
// Picture cache: one data URL per image content.
const cache=new Map();
function dataUrl(img){if(!img||issues(img).length)return '';const {w,h}=dims(img),k=w+'x'+h+'|'+img.palette.join(',')+'|'+img.px;if(cache.has(k))return cache.get(k);let url='';
 try{const c=document.createElement('canvas');c.width=w;c.height=h;const g=c.getContext('2d');if(g){for(let i=0;i<img.px.length;i++){const ch=img.px[i];if(ch==='.')continue;g.fillStyle=img.palette[DIGITS.indexOf(ch)];g.fillRect(i%w,Math.floor(i/w),1,1);}url=c.toDataURL('image/png');}}catch(e){url='';}
 if(cache.size>500)cache.clear();cache.set(k,url);return url;}
// Shows the image on an element as a crisp background (keeps the element's own content).
function paint(elm,img){const url=dataUrl(img);if(!url)return false;elm.style.backgroundImage='url("'+url+'")';elm.style.backgroundSize='100% 100%';elm.style.imageRendering='pixelated';return true;}
window.PROPixel=Object.freeze({SIZES,BANNER,MAX_COLORS,DIGITS,blank,dims,isBanner,issues,resize,dataUrl,paint});
})();
