/* Unit grid: units laid out on square tiles like the tactical map, left to right and then the next row.
   Shared by the roster and future pickers (formation, evolution, fusion). No storage, no game rules.
   PROUnitGrid.render(root, units, {onPick(u), selected:id=>bool, reason:u=>'' (non-empty dims the tile),
   badge:u=>'' (small corner text), label:u=>name, unknown:u=>bool (not met yet: dark ??? tile, no details), tile:px, search:true}) → root. Tiles are buttons; aria-label carries details.
   Search: a search box is placed before the grid (search:false turns it off). Words match the name, size and tags;
   a word starting with # matches tags only (#生身 #車両); several words must all match. Unknown units match only '？？？'. */
(function(root){'use strict';
const SIZES=root.PROCore?.UNIT_SIZES||{};
// matches(unit, query): name / size / tags, '#tag' for tags only.
function matches(u,q,hide){const words=String(q||'').trim().toLowerCase().split(/\s+/).filter(Boolean);if(!words.length)return true;if(hide)return words.every(w=>'？？？'.includes(w));
 const tags=(u.tags||[]).map(t=>String(t).toLowerCase()),text=[u.name,u.size,...tags].join(' ').toLowerCase();return words.every(w=>w.startsWith('#')?tags.some(t=>t.includes(w.slice(1))):text.includes(w));}
function applySearch(box){const q=box._ugSearch?.value||'';let n=0;for(const t of box.querySelectorAll('.ug-tile')){const ok=matches(t._unit,q,t.classList.contains('unknown'));t.hidden=!ok;if(ok)n++;}if(box._ugCount)box._ugCount.textContent=q.trim()?n+'件':'';}
function searchBox(box){if(box._ugSearch)return;const wrap=document.createElement('div'),i=document.createElement('input'),c=document.createElement('small');wrap.className='ug-searchbar';i.type='search';i.className='ug-search';i.placeholder='名前・サイズ・タグで検索（#タグ）';i.setAttribute('aria-label','ユニットを検索');c.className='ug-count';wrap.append(i,c);box.before(wrap);box._ugSearch=i;box._ugCount=c;i.oninput=()=>applySearch(box);}
function render(box,units,{onPick,selected,reason,badge,label,unknown,tile,search=true}={}){box.classList.add('unit-grid');if(tile)box.style.setProperty('--ug-tile',tile+'px');if(search&&box.isConnected!==false&&box.parentNode)searchBox(box);
 box.replaceChildren(...units.map(u=>{const b=document.createElement('button'),hide=!!unknown?.(u),why=hide?'':reason?.(u)||'',on=!!selected?.(u),size=hide?'':u.size||'';b.type='button';b.className='ug-tile'+(on?' selected':'')+(why?' blocked':'')+(hide?' unknown':'');b.dataset.unit=u.id;
  const name=document.createElement('strong');name.textContent=hide?'？？？':label?label(u):u.name;const sz=document.createElement('span');sz.className='ug-size';sz.textContent=hide?'':size||'?';b.append(sz,name);
  const extra=hide?'':badge?.(u);if(extra){const s=document.createElement('small');s.textContent=extra;b.append(s);}
  b.setAttribute('aria-label',hide?['未遭遇のユニット',on?'選択中':''].filter(Boolean).join(' ・ '):[u.name,size?'サイズ'+size+(SIZES[size]!=null?'('+SIZES[size]+')':''):'サイズ未設定',on?'選択中':'',why,extra].filter(Boolean).join(' ・ '));if(on)b.setAttribute('aria-pressed','true');
  b._unit=u;b.onclick=()=>onPick?.(u,b);return b;}));applySearch(box);return box;}
root.PROUnitGrid=Object.freeze({render,matches});
})(typeof window!=='undefined'?window:globalThis);
