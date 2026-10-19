/* Unit grid: units laid out on square tiles like the tactical map, left to right and then the next row.
   Shared by the roster and future pickers (formation, evolution, fusion). No storage, no game rules.
   PROUnitGrid.render(root, units, {onPick(u), selected:id=>bool, reason:u=>'' (non-empty dims the tile),
   badge:u=>'' (small corner text), label:u=>name, unknown:u=>bool (not met yet: dark ??? tile, no details), tile:px}) → root. Tiles are buttons; aria-label carries details. */
(function(root){'use strict';
const SIZES=root.PROCore?.UNIT_SIZES||{};
function render(box,units,{onPick,selected,reason,badge,label,unknown,tile}={}){box.classList.add('unit-grid');if(tile)box.style.setProperty('--ug-tile',tile+'px');
 box.replaceChildren(...units.map(u=>{const b=document.createElement('button'),hide=!!unknown?.(u),why=hide?'':reason?.(u)||'',on=!!selected?.(u),size=hide?'':u.size||'';b.type='button';b.className='ug-tile'+(on?' selected':'')+(why?' blocked':'')+(hide?' unknown':'');b.dataset.unit=u.id;
  const name=document.createElement('strong');name.textContent=hide?'？？？':label?label(u):u.name;const sz=document.createElement('span');sz.className='ug-size';sz.textContent=hide?'':size||'?';b.append(sz,name);
  const extra=hide?'':badge?.(u);if(extra){const s=document.createElement('small');s.textContent=extra;b.append(s);}
  b.setAttribute('aria-label',hide?['未遭遇のユニット',on?'選択中':''].filter(Boolean).join(' ・ '):[u.name,size?'サイズ'+size+(SIZES[size]!=null?'('+SIZES[size]+')':''):'サイズ未設定',on?'選択中':'',why,extra].filter(Boolean).join(' ・ '));if(on)b.setAttribute('aria-pressed','true');
  b.onclick=()=>onPick?.(u,b);return b;}));return box;}
root.PROUnitGrid=Object.freeze({render});
})(typeof window!=='undefined'?window:globalThis);
