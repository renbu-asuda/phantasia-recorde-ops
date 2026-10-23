/* Map weapons (マップ兵器): a weapon with tactical.map.on hits every hostile squad in an area of the map, without a
   local battle or counter. Used only before moving; never in PRO・D or in a local battle.
   tactical.map: {on, shape: point | self | line | cone, size, width}
     point: a square within the weapon's range (minRange〜maxRange), every square within size of it (size 0 = that square)
     self : every square within size of the squad (not its own square)
     line : a direction (up / down / left / right), size squares long, width squares wide (odd widths centre on the squad)
     cone : a direction, size squares long, 1 square wide at the first step and 2 wider at each further step
   Sizes are squares of the mission map (the map scale doesn't change them). */
(function(root){'use strict';
const SHAPES=Object.freeze({point:'着弾点',self:'自分中心',line:'直線',cone:'扇形'});
const DIRS=Object.freeze({up:[0,-1,'上'],down:[0,1,'下'],left:[-1,0,'左'],right:[1,0,'右']});
const cfg=w=>w?.tactical?.map?.on?w.tactical.map:null;
const isMap=w=>!!cfg(w);
// Weapons for local battles and PRO・D: map weapons left out.
const normal=ws=>(ws||[]).filter(w=>!isMap(w));
const shapeOf=w=>Object.hasOwn(SHAPES,cfg(w)?.shape)?cfg(w).shape:'point';
function sizeOf(w){const v=cfg(w)?.size,n=Math.floor(Number(v));return v!==''&&v!=null&&Number.isFinite(n)&&n>=0?Math.min(n,20):shapeOf(w)==='point'?1:3;}
const widthOf=w=>Math.max(1,Math.min(9,Math.floor(Number(cfg(w)?.width)||1)));
// What the player chooses: a square (point), a direction (line / cone) or nothing (self).
const aimKind=w=>({point:'square',line:'dir',cone:'dir',self:'none'})[shapeOf(w)];
// Squares hit from origin o (the squad) with aim ({x,y} for point, a DIRS key for line / cone). Not clipped to the map.
function area(w,o,aim){const s=sizeOf(w),out=[];switch(shapeOf(w)){
 case 'self':for(let dy=-s;dy<=s;dy++)for(let dx=-s;dx<=s;dx++){const d=Math.abs(dx)+Math.abs(dy);if(d>=1&&d<=s)out.push({x:o.x+dx,y:o.y+dy});}return out;
 case 'line':case 'cone':{const d=DIRS[aim];if(!d)return out;const [fx,fy]=d,w1=widthOf(w),lo=-Math.floor((w1-1)/2),hi=lo+w1-1;
  for(let k=1;k<=s;k++){const [a,b]=shapeOf(w)==='cone'?[-(k-1),k-1]:[lo,hi];for(let side=a;side<=b;side++)out.push({x:o.x+fx*k+(fx?0:side),y:o.y+fy*k+(fy?0:side)});}return out;}
 default:{if(!aim||!Number.isInteger(aim.x)||!Number.isInteger(aim.y))return out;for(let dy=-s;dy<=s;dy++)for(let dx=-s;dx<=s;dx++)if(Math.abs(dx)+Math.abs(dy)<=s)out.push({x:aim.x+dx,y:aim.y+dy});return out;}}}
// The direction of square p seen from o (the longer axis; null on o itself or on an exact diagonal).
function dirTo(o,p){const dx=p.x-o.x,dy=p.y-o.y;if(Math.abs(dx)===Math.abs(dy))return null;return Math.abs(dx)>Math.abs(dy)?(dx>0?'right':'left'):(dy>0?'down':'up');}
function text(w){const c=cfg(w);if(!c)return '';const s=sizeOf(w);return 'マップ兵器・'+SHAPES[shapeOf(w)]+({point:'（射程'+(w.minRange??1)+'〜'+(w.maxRange??1)+'・半径'+s+'）',self:'（周囲'+s+'マス）',line:'（長さ'+s+'・幅'+widthOf(w)+'）',cone:'（長さ'+s+'）'})[shapeOf(w)];}
root.PROMapWeapon=Object.freeze({SHAPES,DIRS,isMap,normal,shapeOf,sizeOf,widthOf,aimKind,area,dirTo,text});
})(window);
