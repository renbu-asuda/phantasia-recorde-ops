/* PRO・D (Dispatch) data: the published game's built-in unit and mission packs (with the built-in pack only) plus the
   ディスパッチ作戦 of loaded packs (PROTacticalData.dispatchMissions), whose units come from the packs. Expansion files and the
   published game's save are never read. Pack data is added on first use (this file loads before tactical_data.js). */
(function(){'use strict';
const C=window.PROCore,U=window.VAIS_UNIT_PACK,M=window.VAIS_MISSION_PACK;
if(!U||!M)throw Error('PRO・D base data missing');
// Same conversion as the makers' test battle (PROEditor.battleUnit / battleMission), kept here so the
// prototype does not load the maker UI.
function battleUnit(u,masters,skills){u=C.resolveUnitData(u,masters,skills);const s=x=>{try{return C.skill(x);}catch(e){return null;}},w=x=>{try{return C.weapon(x);}catch(e){return null;}};let tags=[];try{tags=C.unitTags(u);}catch(e){}let ext={};try{ext=C.unitExt(u);}catch(e){}
 const weapons=(u.weapons||[]).map(w).filter(Boolean);return {...u,...ext,tags,hp:Math.max(1,Math.floor(Number(u.hp)||3000)),atk:Number(u.atk)||0,def:Number(u.def)||0,mob:Number(u.mob)||0,acc:Number(u.acc)||0,skills:(u.skills||[]).map(s).filter(Boolean),weapons:weapons.length?weapons:[C.weapon({name:'標準攻撃'})],deploy:{player:u.deploy?.player!==false,enemy:!!u.deploy?.enemy}};}
function battleMission(m){let ext={};try{ext=C.missionExt(m);}catch(e){}const rules=(m.rules||[]).map(r=>{try{return C.rule(r,m.id);}catch(e){return null;}}).filter(Boolean);return {...m,...ext,rules,enemies:(m.enemies||[]).filter(Boolean),maxDeploy:Math.max(1,Math.min(8,Math.floor(Number(m.maxDeploy)||8)))};}
const skills=C.skillList(U.skills),units=C.pilotsToUnits(U.units,U.pilots).units.map(u=>battleUnit(u,U.weapons||[],skills));
const defs=Object.fromEntries(units.map(u=>[u.id,u])),names=Object.fromEntries(units.map(u=>[u.id,u.name]));
const missions=[];let ready=false;
// Pack units (Tactical format: weapons / skills already objects) as PRO・D battle units.
const packUnit=u=>({...u,weapons:(u.weapons||[]).length?u.weapons:[C.weapon({name:'標準攻撃'})],deploy:{player:true,enemy:true}});
function ensure(){if(ready)return;const D=window.PROTacticalData;if(!D)return;ready=true;if(D.usesSample)missions.push(...M.missions.map(m=>({...battleMission(m),origin:{id:'sample',name:'内蔵パック（サンプル）'}})));
 for(const m of D.dispatchMissions?.()||[])missions.push(battleMission(m));
 for(const id of D.packUnitIds?.()||[])if(!defs[id])try{defs[id]=packUnit(D.unit(id));names[id]=defs[id].name;}catch(err){}}
const conditions=m=>{try{return C.missionConditions(m,names);}catch(e){return {win:'勝利条件：敵の全滅',lose:'',draw:''};}};
// Mission-list entries in the same shape as Tactical missions, kind "dispatch".
const listing=()=>{ensure();return missions.map(m=>({id:m.id,origin:m.origin,code:'PRO・D / RANK '+(m.diff||'C'),kind:'dispatch',name:m.name,desc:m.desc,goal:conditions(m).win.replace(/^勝利(条件)?[:：]\s*/,''),terrainLabel:m.terrain||'標準',formation:'出撃'+m.maxDeploy+'体まで・総サイズ8',reward:(m.reward||0).toLocaleString()+' Cr',color:'#33304a'}));};
// Item names from the published item pack, when it is loaded (drops are received into the test save).
const itemNames=Object.fromEntries((window.VAIS_ITEM_PACK?.items||[]).map(i=>[i.id,i.name]));
window.PRODispatchData=Object.freeze({itemName:id=>itemNames[id]||id,packName:M.packName,defs,// PRO・D player units come from the published data, i.e. with the built-in sample pack only (an empty start has none).
players:()=>{ensure();const D=window.PROTacticalData;return [...(D&&!D.usesSample?[]:units.filter(u=>u.deploy.player)),...(D?.packPlayers?.()||[]).map(id=>defs[id]).filter(Boolean)].map(u=>C.clone(u));},mission:id=>{ensure();return missions.find(m=>m.id===id)||null;},conditions:m=>{ensure();return conditions(m);},listing,needsCrew:u=>u.crew==='required'});
})();
