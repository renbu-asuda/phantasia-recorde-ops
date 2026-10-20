/* Reads the Tactical pack (built-in for now) and exposes normalized lookups. No storage access. */
(function(){'use strict';
const C=window.PROCore,builtin=window.PROTacticalBuiltinPack;
if(!builtin||builtin.format!=='PRO_TACTICAL_PACK')throw Error('Tactical pack missing');
/* Data source: the built-in sample, or the built-in sample plus the T&D maker's draft in this browser
   (units, evolutions, fusions). Missions and terrains stay built-in until a Tactical mission maker exists.
   The choice is a browser setting (PRO_TACTICAL_SOURCE); the draft is only read, never written. */
// A third source is a pack file loaded in the hub (PRO_TACTICAL_PACK_FILE, the maker's pack output or T&D export).
const SOURCE_KEY='PRO_TACTICAL_SOURCE',DRAFT_KEY='PRO_TD_MAKER_DRAFT',PACK_KEY='PRO_TACTICAL_PACK_FILE';
const read=k=>{try{return localStorage.getItem(k);}catch(e){return null;}};
const parsePack=t=>{try{const d=JSON.parse(t||'null');return d&&d.format==='PRO_TD_PACK'&&typeof d==='object'?d:null;}catch(e){return null;}};
function makerDraft(){return parsePack(read(DRAFT_KEY));}
function packFile(){return parsePack(read(PACK_KEY));}
// Condition text for win / lose conditions, event triggers and in-mission objectives (T&D Tactical missions).
function condText(m,c,role){c=c||{};const sq=id=>[...(m.enemies||[]),...(m.allies||[])].find(x=>x.id===id)?.name||'部隊',at=c.x!=null?'('+(c.x+1)+','+(c.y+1)+')'+((c.w||1)>1||(c.h||1)>1?'〜('+(c.x+(c.w||1))+','+(c.y+(c.h||1))+')':''):'',ob=id=>(m.objectives||[]).find(o=>o.id===id)?.name||'ミッション';
 switch(c.type){case 'boss':return sq(c.groupId)+'の撃破';case 'squad_down':return sq(c.groupId)+'の撃破';case 'reach':return at+'への到達';case 'objective_done':return 'ミッション「'+ob(c.objectiveId)+'」の成功';case 'objective_failed':return 'ミッション「'+ob(c.objectiveId)+'」の失敗';case 'enemy_reach':return '敵部隊の'+at+'への到達';case 'defend':return c.turns+'ターン防衛';case 'turn':return '第'+c.turns+'ターン';case 'turn_limit':return c.turns+'ターン以内に勝てない';case 'within':return c.turns+'ターン以内に勝利';case 'flag':return 'フラグ「'+c.flag+'」';case 'unit_down':return (c.unitName||c.unitId)+'の撃破';case 'loss':return '味方ユニットの撃破';case 'game_flag':return 'ゲームのフラグ「'+c.flagId+'」が'+(c.on===false?'OFF':'ON');case 'game_cond':return 'ゲームの条件（'+(c.conds?.list||[]).length+'件）';case 'no_loss':return '味方ユニットの撃破なしで勝利';case 'start':return '作戦開始時';case 'victory':return '作戦成功時';case 'defeat':return '作戦失敗時';case 'player_wipe':return '味方の全滅';default:return role==='defeat'?'味方の全滅':'敵部隊の全滅';}}
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
 // Dispatch combat effects kept for later use in local battles. Terrains without a Tactical square are skipped; one with a kind but no costs is impassable.
 const terrains=Object.fromEntries((d.terrains||[]).filter(t=>t.id&&(t.tactical?.kind||Object.keys(t.tactical?.costs||{}).length)).map(t=>[t.id,{name:t.name||t.id,kind:t.tactical.kind||'ground',costs:{...(t.tactical.costs||{})},...(t.tactical.facility?{facility:t.tactical.facility}:{}),...(/^#[0-9a-f]{6}$/i.test(t.tactical.color||'')?{color:t.tactical.color}:{}),blockTags:[...(t.blockTags||[])],desc:t.desc||'',effects:{meleeHitPt:t.meleeHitPt,rangedHitPt:t.rangedHitPt,mobPct:t.mobPct},custom:true}]));
 // Tactical missions (T&D): map grid of terrain keys (built-in letters or custom terrain ids), starts, enemy squads,
 // victory / defeat objects. Missions whose map or squads don't fit the data are skipped (reported in the console).
 const AI_OK=['assault','ambush','hold','cautious'],VT={enemy_wipe:'敵部隊の全滅',boss:'敵部隊の撃破',reach:'指定マスへの到達',defend:'防衛'};
 // Squads (enemy, or allied guests controlled by the player). reinforce: not on the map until an event spawns it.
 const squads=list=>(list||[]).filter(sq=>sq.position&&sq.members?.length).map(sq=>({id:sq.id,name:sq.name,position:{...sq.position},reinforce:!!sq.reinforce,ai:{...sq.ai,pattern:AI_OK.includes(sq.ai?.pattern)?sq.ai.pattern:'assault',target:sq.ai?.target||'lowest_hp'},members:sq.members.map(e=>({unit:e.unit,...(e.name?{name:e.name}:{})}))}));
 const tmissions=(d.tmissions||[]).map(m=>{try{const g=m.map?.grid,w=m.map?.width,h=m.map?.height;if(!Array.isArray(g)||g.length!==h||g.some(r=>r.length!==w)||w<6||h<6||w>30||h>30)throw Error('map');
  for(const sq of [...(m.enemies||[]),...(m.allies||[])])for(const e of sq.members||[])if(!ids.has(e.unit))throw Error('unit '+e.unit);for(const r of g)for(const k of r)if(!builtin.terrains[k]&&!terrains[k])throw Error('terrain '+k);const v=m.victory||{type:'enemy_wipe'};
  const goal=condText(m,v,'victory');
  return {id:m.id,code:m.code||'TD',kind:m.kind||'combat',name:m.name||m.id,desc:m.desc||'',goal,terrainLabel:{ground:'地上',water:'水上',space:'宇宙'}[m.surface]||'地上',formation:'メーカーの作戦',reward:((m.result?.credits)||0).toLocaleString()+' Cr',color:m.color||'#29453e',surface:m.surface||'ground',
   map:{width:w,height:h,grid:g.map(r=>[...r])},playerStarts:(m.playerStarts||[]).map(p=>({...p})),victory:{...v},defeat:{...(m.defeat||{type:'player_wipe'})},result:{credits:m.result?.credits||0,exp:m.result?.exp||0,items:{...(m.result?.items||{})}},requires:m.requires,hidden:m.hidden,conds:m.conds,stars:m.stars,starReward:m.starReward,drops:C.clone(m.drops||[]),resultFlags:{...(m.resultFlags?.win||{})},resultFlagsLose:{...(m.resultFlags?.lose||{})},
   enemies:squads(m.enemies),allies:squads(m.allies),events:C.clone(m.events||[]),objectives:C.clone(m.objectives||[]),maker:true};}catch(e){console.warn('T&D tactical mission skipped',m?.id,e.message);return null;}}).filter(Boolean);
 return {sortieRate:d.tacticalSortieRate,units,terrains,tmissions,achievements:(d.achievements||[]).filter(a=>a.id),roster:units.filter(u=>u._player).map(u=>u.id),// Maker items keep their use effects, scope, per-unit limit and equipment; equipment weapon / skill IDs become objects.
 items:(d.items||[]).filter(i=>i.id).map(i=>({id:i.id,name:i.name||i.id,desc:i.desc||'',requires:i.requires,price:i.price,key:!!i.key,shop:i.shop,conds:i.conds,useConds:i.useConds,effects:i.effects||(i.effect?[i.effect]:[]),scope:i.scope,limitPerUnit:i.limitPerUnit,equip:i.equip?{...i.equip,weapons:(i.equip.weaponIds||[]).map(id=>find('weapons',id)).filter(Boolean).map(w=>ok(C.weapon,w)).filter(Boolean).concat(i.equip.weapons||[]),skills:(i.equip.skillIds||[]).map(id=>find('skills',id)).filter(Boolean).concat(i.equip.skills||[])}:undefined})),research:(d.research||[]).filter(r=>r.id),hires:(d.hires||[]).filter(h=>h.id&&has(h.unitId)),evolutions:(d.evolutions||[]).filter(e=>has(e.from)&&has(e.to)),// A fusion that unlocks a hire becomes a register-only fusion for the hire's unit.
 fusions:(d.fusions||[]).map(f=>f.result?.type==='hire'?{...f,result:{type:'register',unitId:find('hires',f.result.hireId)?.unitId}}:f).filter(f=>['unit','register',undefined].includes(f.result?.type)&&has(f.result?.unitId)&&(f.materials||[]).length>=2&&f.materials.every(m=>has(m.unitId))),name:d.name||d.packId};}
const want=read(SOURCE_KEY),draft=want==='maker'?makerDraft():want==='pack'?packFile():null,extra=draft?fromMaker(draft):null,sourceName=extra?want:'builtin';
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
// effects: hit / MOB modifiers of the square for local battles (custom terrains, or built-in terrains that set them).
const fx=t=>{const e={};for(const k of ['meleeHitPt','rangedHitPt','mobPct']){const v=Number(t.effects?.[k]??t[k]);if(v)e[k]=v;}return e;};
function tile(missionId,x,y){const m=missions.get(missionId),t=raw.terrains[cellKey(m,x,y)];return {kind:t.kind,name:t.name,costs:{...t.costs},blockTags:[...(t.blockTags||[])],effects:fx(t),...(t.facility?{facility:t.facility}:{}),...(t.color?{color:t.color}:{})};}
// Enemy groups for a deployment; each member gets a unique uid and its surface domain.
function enemies(missionId){const m=missions.get(missionId);return m.enemies.map(g=>({id:g.id,name:g.name,faction:'enemy',position:{...g.position},ai:{...g.ai},...(g.reinforce?{reinforce:true}:{}),members:g.members.map((e,n)=>{const u=unit(e.unit);if(e.name)u.name=e.name;return {uid:g.id+'-'+n,domain:m.surface,unit:u};})}));}
// Allied guest squads (T&D): player-controlled, not owned (no EXP, no loss handling).
function allies(missionId){const m=missions.get(missionId);return (m.allies||[]).map(g=>({id:g.id,name:g.name,faction:'player',guest:true,position:{...g.position},...(g.reinforce?{reinforce:true}:{}),members:g.members.map((e,n)=>{const u=unit(e.unit);if(e.name)u.name=e.name;return {uid:'guest-'+g.id+'-'+n,domain:m.surface,unit:u};})}));}
// A square type by key (terrain changes from events).
function terrain(k){const t=raw.terrains[k];return t?{kind:t.kind,name:t.name,costs:{...t.costs},blockTags:[...(t.blockTags||[])],effects:fx(t),...(t.facility?{facility:t.facility}:{}),...(t.color?{color:t.color}:{})}:null;}
// Catalog: a variant that is not separate shares its base's entry (and encounter flag).
const catalogId=id=>{let u=rawById.get(id);while(u?.base&&!u.separate)u=rawById.get(u.base);return u?.id||id;};
const catalog=()=>raw.units.filter(u=>catalogId(u.id)===u.id).map(u=>unit(u.id));
// Tactical sortie cost: the sum of the deployed units' sortie costs × this % (pack setting; 50% by default).
const sortieRate=Number.isFinite(Number(extra?.sortieRate))&&extra?.sortieRate!==''&&extra?.sortieRate!=null?Number(extra.sortieRate):50;
function setPackText(text){const d=parsePack(text);if(!d)return 'T&D形式のパック（JSON）ではありません';try{fromMaker(d);}catch(e){return '読み込めません：'+e.message;}try{localStorage.setItem(PACK_KEY,text);}catch(e){return '保存できません（大きすぎる可能性があります）';}return '';}
window.PROTacticalData=Object.freeze({source:sourceName,makerName:extra?.name||null,hasMakerDraft:()=>!!makerDraft(),hasPack:()=>!!packFile(),packInfo:()=>{const p=packFile();return p?{name:p.name||p.packId||'パック',packId:p.packId||'',exportedAt:p.exportedAt||''}:null;},setPackText,clearPack(){try{localStorage.removeItem(PACK_KEY);if(read(SOURCE_KEY)==='pack')localStorage.setItem(SOURCE_KEY,'builtin');}catch(e){}},sortieRate,
 setSource(v){try{localStorage.setItem(SOURCE_KEY,['maker','pack'].includes(v)?v:'builtin');}catch(e){}},catalogId,catalog,units:()=>raw.units.map(u=>unit(u.id)),evolutions:()=>C.clone(raw.evolutions||[]),hires:()=>C.clone(raw.hires||[]),terrainTypes:()=>C.clone(raw.terrains||{}),achievements:()=>C.clone(raw.achievements||[]),items:()=>C.clone(raw.items||[]),itemName:id=>(raw.items||[]).find(i=>i.id===id)?.name||id,item:id=>C.clone((raw.items||[]).find(i=>i.id===id)||null),research:()=>C.clone(raw.research||[]),startItems:()=>({...(raw.startItems||{})}),fusions:()=>C.clone(raw.fusions||[]),packId:raw.packId,version:raw.version,name:raw.name,missions:()=>raw.missions.map(m=>({...m})),mission,unit,roster:()=>raw.roster.map(unit),tile,terrain,enemies,allies,condText:(id,c,role)=>condText(missions.get(id)||{},c?.unitId&&units.has(c.unitId)?{...c,unitName:units.get(c.unitId).name}:c,role),size:id=>{const m=missions.get(id);return {width:m.map.width,height:m.map.height};},starts:id=>missions.get(id).playerStarts.map(p=>({...p}))});
})();
