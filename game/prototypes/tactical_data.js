/* Reads the Tactical pack (built-in for now) and exposes normalized lookups. No storage access. */
(function(){'use strict';
const C=window.PROCore,builtin=window.PROTacticalBuiltinPack;
if(!builtin||builtin.format!=='PRO_TACTICAL_PACK')throw Error('Tactical pack missing');
/* Data source: the built-in sample, or the built-in sample plus the T&D maker's draft in this browser
   (units, evolutions, fusions). Missions and terrains stay built-in until a Tactical mission maker exists.
   The choice is a browser setting (PRO_TACTICAL_SOURCE); the draft is only read, never written. */
const SOURCE_KEY='PRO_TACTICAL_SOURCE',DRAFT_KEY='PRO_TD_MAKER_DRAFT';
const read=k=>{try{return localStorage.getItem(k);}catch(e){return null;}};
function makerDraft(){try{const d=JSON.parse(read(DRAFT_KEY)||'null');return d&&d.format==='PRO_TD_PACK'?d:null;}catch(e){return null;}}
// T&D unit → Tactical unit: weapon / skill IDs become objects (invalid ones are dropped, as in the maker's test battle).
function fromMaker(d){const find=(k,id)=>(d[k]||[]).find(x=>x.id===id),ok=(f,x)=>{try{return f(x);}catch(e){return null;}};
 const taken=new Set(builtin.units.map(u=>u.id)),units=(d.units||[]).filter(u=>u.id&&!taken.has(u.id)).map(u=>{const {weaponIds,skillIds,deploy,...rest}=u;const weapons=(weaponIds||[]).map(id=>find('weapons',id)).filter(Boolean).map(w=>ok(C.weapon,w)).filter(Boolean);
  // Skill tree nodes may reference pack skills by skillId.
  // Pilot profile skills may be pack skill IDs.
  const pilotProfile=u.pilotProfile&&{...u.pilotProfile,skills:[...(u.pilotProfile.skills||[]),...(u.pilotProfile.skillIds||[]).map(id=>find('skills',id)).filter(Boolean)]};
  const skillTree=(u.skillTree||[]).map(n=>({...n,skill:n.skill||(n.skillId?find('skills',n.skillId):null)})).filter(n=>n.id&&n.skill);
  return {...rest,skillTree,...(pilotProfile?{pilotProfile}:{}),hp:Number(u.hp)||3000,atk:Number(u.atk)||0,def:Number(u.def)||0,mob:Number(u.mob)||0,acc:Number(u.acc)||0,weapons,skills:(skillIds||[]).map(id=>find('skills',id)).filter(Boolean).map(x=>ok(C.skill,{...x})).filter(Boolean),tags:u.tags||[],_player:!!deploy?.player};});
 const ids=new Set([...taken,...units.map(u=>u.id)]),has=id=>ids.has(id);
 // Custom terrains (T&D) usable as Tactical squares: keyed by terrain id, with kind, costs, blockTags and the
 // Dispatch combat effects kept for later use in local battles. Terrains without movement costs are skipped.
 const terrains=Object.fromEntries((d.terrains||[]).filter(t=>t.id&&Object.keys(t.tactical?.costs||{}).length).map(t=>[t.id,{name:t.name||t.id,kind:t.tactical.kind||'ground',costs:{...t.tactical.costs},blockTags:[...(t.blockTags||[])],desc:t.desc||'',effects:{meleeHitPt:t.meleeHitPt,rangedHitPt:t.rangedHitPt,mobPct:t.mobPct},custom:true}]));
 // Tactical missions (T&D): map grid of terrain keys (built-in letters or custom terrain ids), starts, enemy squads,
 // victory / defeat objects. Missions whose map or squads don't fit the data are skipped (reported in the console).
 const AI_OK=['assault','ambush','hold','cautious'],VT={enemy_wipe:'敵部隊の全滅',boss:'敵部隊の撃破',reach:'指定マスへの到達',defend:'防衛'};
 const tmissions=(d.tmissions||[]).map(m=>{try{const g=m.map?.grid,w=m.map?.width,h=m.map?.height;if(!Array.isArray(g)||g.length!==h||g.some(r=>r.length!==w)||w<6||h<6||w>30||h>30)throw Error('map');
  for(const sq of m.enemies||[])for(const e of sq.members||[])if(!ids.has(e.unit))throw Error('unit '+e.unit);for(const r of g)for(const k of r)if(!builtin.terrains[k]&&!terrains[k])throw Error('terrain '+k);const v=m.victory||{type:'enemy_wipe'};
  const goal=v.type==='boss'?((m.enemies||[]).find(x=>x.id===v.groupId)?.name||'敵部隊')+'の撃破':v.type==='reach'?'('+(v.x+1)+','+(v.y+1)+')への到達':v.type==='defend'?v.turns+'ターン防衛':'敵部隊の全滅';
  return {id:m.id,code:m.code||'TD',kind:m.kind||'combat',name:m.name||m.id,desc:m.desc||'',goal,terrainLabel:{ground:'地上',water:'水上',space:'宇宙'}[m.surface]||'地上',formation:'メーカーの作戦',reward:((m.result?.credits)||0).toLocaleString()+' Cr',color:m.color||'#29453e',surface:m.surface||'ground',
   map:{width:w,height:h,grid:g.map(r=>[...r])},playerStarts:(m.playerStarts||[]).map(p=>({...p})),victory:{...v},defeat:{...(m.defeat||{type:'player_wipe'})},result:{credits:m.result?.credits||0,exp:m.result?.exp||0,items:{...(m.result?.items||{})}},requires:m.requires,hidden:m.hidden,conds:m.conds,stars:m.stars,
   enemies:(m.enemies||[]).filter(sq=>sq.position&&sq.members?.length).map(sq=>({id:sq.id,name:sq.name,position:{...sq.position},ai:{...sq.ai,pattern:AI_OK.includes(sq.ai?.pattern)?sq.ai.pattern:'assault',target:sq.ai?.target||'lowest_hp'},members:sq.members.map(e=>({unit:e.unit,...(e.name?{name:e.name}:{})}))})),maker:true};}catch(e){console.warn('T&D tactical mission skipped',m?.id,e.message);return null;}}).filter(Boolean);
 return {units,terrains,tmissions,achievements:(d.achievements||[]).filter(a=>a.id),roster:units.filter(u=>u._player).map(u=>u.id),// Maker items keep their use effects, scope, per-unit limit and equipment; equipment weapon / skill IDs become objects.
 items:(d.items||[]).filter(i=>i.id).map(i=>({id:i.id,name:i.name||i.id,desc:i.desc||'',requires:i.requires,price:i.price,key:!!i.key,shop:i.shop,conds:i.conds,useConds:i.useConds,effects:i.effects||(i.effect?[i.effect]:[]),scope:i.scope,limitPerUnit:i.limitPerUnit,equip:i.equip?{...i.equip,weapons:(i.equip.weaponIds||[]).map(id=>find('weapons',id)).filter(Boolean).map(w=>ok(C.weapon,w)).filter(Boolean).concat(i.equip.weapons||[]),skills:(i.equip.skillIds||[]).map(id=>find('skills',id)).filter(Boolean).concat(i.equip.skills||[])}:undefined})),research:(d.research||[]).filter(r=>r.id),hires:(d.hires||[]).filter(h=>h.id&&has(h.unitId)),evolutions:(d.evolutions||[]).filter(e=>has(e.from)&&has(e.to)),// A fusion that unlocks a hire becomes a register-only fusion for the hire's unit.
 fusions:(d.fusions||[]).map(f=>f.result?.type==='hire'?{...f,result:{type:'register',unitId:find('hires',f.result.hireId)?.unitId}}:f).filter(f=>['unit','register',undefined].includes(f.result?.type)&&has(f.result?.unitId)&&(f.materials||[]).length>=2&&f.materials.every(m=>has(m.unitId))),name:d.name||d.packId};}
const draft=read(SOURCE_KEY)==='maker'?makerDraft():null,extra=draft?fromMaker(draft):null;
const raw=extra?{...builtin,missions:[...builtin.missions,...extra.tmissions.filter(m=>!builtin.missions.some(b=>b.id===m.id))],terrains:{...extra.terrains,...builtin.terrains},units:[...builtin.units,...extra.units],roster:[...builtin.roster,...extra.roster],evolutions:[...(builtin.evolutions||[]),...extra.evolutions],hires:[...(builtin.hires||[]),...extra.hires],achievements:[...(builtin.achievements||[]),...extra.achievements],items:[...(builtin.items||[]),...extra.items.filter(i=>!(builtin.items||[]).some(b=>b.id===i.id))],research:[...(builtin.research||[]),...extra.research],fusions:[...(builtin.fusions||[]),...extra.fusions]}:builtin;
// Weapons go through PROCore.weapon so ranges and defaults are validated exactly like maker data.
const normUnit=u=>({...C.clone(u),weapons:(u.weapons||[]).map(w=>C.weapon(w))});

// Variants inherit every field they leave unset from their base (recursively); id, base and separate stay their own.
const rawById=new Map(raw.units.map(u=>[u.id,u]));
function resolve(u,seen=new Set()){if(!u.base)return u;if(seen.has(u.id)||!rawById.has(u.base))throw Error(u.id+': bad base unit');seen.add(u.id);const b=resolve(rawById.get(u.base),seen),{id:_i,base:_b,separate:_s,...inherit}=b;return {...inherit,...u};}
const units=new Map(raw.units.map(u=>[u.id,normUnit(resolve(u))])),missions=new Map(raw.missions.map(m=>[m.id,m]));
// Maps are rows of one-letter keys (built-in) or a grid of keys (T&D, custom terrain ids allowed).
const cellKey=(m,x,y)=>m.map.grid?m.map.grid[y][x]:m.map.rows[y][x];
for(const m of raw.missions){const rows=m.map.grid||m.map.rows;if(rows.length!==m.map.height||rows.some(r=>r.length!==m.map.width))throw Error(m.id+': map size mismatch');for(const r of rows)for(const ch of r)if(!raw.terrains[ch])throw Error(m.id+': unknown terrain '+ch);}
const unit=id=>{const u=units.get(id);if(!u)throw Error('Unknown unit '+id);return C.clone(u);};
const mission=id=>missions.get(id)||null;
function tile(missionId,x,y){const m=missions.get(missionId),t=raw.terrains[cellKey(m,x,y)];return {kind:t.kind,name:t.name,costs:{...t.costs},blockTags:[...(t.blockTags||[])]};}
// Enemy groups for a deployment; each member gets a unique uid and its surface domain.
function enemies(missionId){const m=missions.get(missionId);return m.enemies.map(g=>({id:g.id,name:g.name,faction:'enemy',position:{...g.position},ai:{...g.ai},members:g.members.map((e,n)=>{const u=unit(e.unit);if(e.name)u.name=e.name;return {uid:g.id+'-'+n,domain:m.surface,unit:u};})}));}
// Catalog: a variant that is not separate shares its base's entry (and encounter flag).
const catalogId=id=>{let u=rawById.get(id);while(u?.base&&!u.separate)u=rawById.get(u.base);return u?.id||id;};
const catalog=()=>raw.units.filter(u=>catalogId(u.id)===u.id).map(u=>unit(u.id));
window.PROTacticalData=Object.freeze({source:extra?'maker':'builtin',makerName:extra?.name||null,hasMakerDraft:()=>!!makerDraft(),setSource(v){try{localStorage.setItem(SOURCE_KEY,v==='maker'?'maker':'builtin');}catch(e){}},catalogId,catalog,units:()=>raw.units.map(u=>unit(u.id)),evolutions:()=>C.clone(raw.evolutions||[]),hires:()=>C.clone(raw.hires||[]),terrainTypes:()=>C.clone(raw.terrains||{}),achievements:()=>C.clone(raw.achievements||[]),items:()=>C.clone(raw.items||[]),itemName:id=>(raw.items||[]).find(i=>i.id===id)?.name||id,item:id=>C.clone((raw.items||[]).find(i=>i.id===id)||null),research:()=>C.clone(raw.research||[]),startItems:()=>({...(raw.startItems||{})}),fusions:()=>C.clone(raw.fusions||[]),packId:raw.packId,version:raw.version,name:raw.name,missions:()=>raw.missions.map(m=>({...m})),mission,unit,roster:()=>raw.roster.map(unit),tile,enemies,size:id=>{const m=missions.get(id);return {width:m.map.width,height:m.map.height};},starts:id=>missions.get(id).playerStarts.map(p=>({...p}))});
})();
