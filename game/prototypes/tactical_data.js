/* Reads the Tactical pack (built-in for now) and exposes normalized lookups. No storage access. */
(function(){'use strict';
const C=window.PROCore,raw=window.PROTacticalBuiltinPack;
if(!raw||raw.format!=='PRO_TACTICAL_PACK')throw Error('Tactical pack missing');
// Weapons go through PROCore.weapon so ranges and defaults are validated exactly like maker data.
const normUnit=u=>({...C.clone(u),weapons:(u.weapons||[]).map(w=>C.weapon(w))});
const units=new Map(raw.units.map(u=>[u.id,normUnit(u)])),missions=new Map(raw.missions.map(m=>[m.id,m]));
for(const m of raw.missions){if(m.map.rows.length!==m.map.height||m.map.rows.some(r=>r.length!==m.map.width))throw Error(m.id+': map size mismatch');for(const r of m.map.rows)for(const ch of r)if(!raw.terrains[ch])throw Error(m.id+': unknown terrain '+ch);}
const unit=id=>{const u=units.get(id);if(!u)throw Error('Unknown unit '+id);return C.clone(u);};
const mission=id=>missions.get(id)||null;
function tile(missionId,x,y){const m=missions.get(missionId),t=raw.terrains[m.map.rows[y][x]];return {kind:t.kind,name:t.name,costs:{...t.costs}};}
// Enemy groups for a deployment; each member gets a unique uid and its surface domain.
function enemies(missionId){const m=missions.get(missionId);return m.enemies.map(g=>({id:g.id,name:g.name,faction:'enemy',position:{...g.position},ai:{...g.ai},members:g.members.map((e,n)=>{const u=unit(e.unit);if(e.name)u.name=e.name;return {uid:g.id+'-'+n,domain:m.surface,unit:u};})}));}
window.PROTacticalData=Object.freeze({packId:raw.packId,version:raw.version,name:raw.name,missions:()=>raw.missions.map(m=>({...m})),mission,unit,roster:()=>raw.roster.map(unit),tile,enemies,size:id=>{const m=missions.get(id);return {width:m.map.width,height:m.map.height};},starts:id=>missions.get(id).playerStarts.map(p=>({...p}))});
})();
