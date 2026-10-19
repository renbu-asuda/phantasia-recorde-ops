/* PRO Tactical foundations. Opt-in only: deliberately not loaded by the current game. */
(function(root){'use strict';
const C=root.PROCore;
if(!C)throw Error('PROCore is required');
const clone=C.clone,own=(o,k)=>Object.hasOwn(o||{},k);
const need=(ok,msg)=>{if(!ok)throw Error(msg);};
const ready=()=>({moved:false,ended:false});
function living(g){need(Array.isArray(g?.members),'部隊のmembersが必要です');return g.members.filter(m=>m.currentHp===undefined||m.currentHp>0);}
function identity(g){const ids=new Set();for(const m of g.members){need(typeof m.uid==='string'&&m.uid.length&&!ids.has(m.uid),'個体UIDが重複または未設定です');ids.add(m.uid);}return ids;}
// Squad capacity shared by Tactical groups and Dispatch lineups: at most 8 units and total size 8;
// maxDeploy (Dispatch) adds a sortie count limit. Returns '' when unit u can join units.
const SQUAD={count:8,size:8};
function unitSize(u){return own(C.UNIT_SIZES,u?.size)?C.UNIT_SIZES[u.size]:null;}
function squadUsage(units){return {count:units.length,size:units.reduce((n,u)=>n+(unitSize(u)??0),0)};}
function joinReason(units,u,{maxDeploy}={}){const f=squadUsage(units),need=unitSize(u);if(need==null)return 'サイズが未設定です';if(maxDeploy!=null&&f.count>=maxDeploy)return '出撃数の上限'+maxDeploy+'に達しています';if(f.count>=SQUAD.count)return '体数上限'+SQUAD.count+'に達しています';if(f.size+need>SQUAD.size)return '残りサイズ'+(SQUAD.size-f.size)+'に対し、必要サイズ'+need;return '';}
function formation(g){identity(g);const members=living(g);let size=0;for(const m of members){need(own(C.UNIT_SIZES,m.unit?.size),'サイズ未設定・不正です');size+=C.UNIT_SIZES[m.unit.size];}return {count:members.length,size,valid:members.length>0&&members.length<=8&&size<=8};}
function requireFormation(g){need(formation(g).valid,'部隊は1～8体・総サイズ8以内です');}
function configured(m){need(m.unit&&own(m.unit,'move')&&own(m.unit,'movementAptitude'),'MOVE・地形移動適性が未設定です');C.unitExt(m.unit);}
function supports(m,domain){return own(C.MOVEMENT_DOMAINS,domain)&&own(m.unit?.movementAptitude,domain)&&m.unit.movementAptitude[domain]!=='none';}
function canAct(g){return living(g).length>0&&living(g).every(m=>!m.action?.ended);}
function beforeAction(g){return canAct(g)&&living(g).every(m=>!m.action?.moved);}
function defaultDomain(m,surface){configured(m);need(['ground','water','space'].includes(surface),'地表領域はground / water / spaceで指定してください');if(surface==='space'){need(supports(m,'space'),'宇宙適性がありません');return 'space';}
 if(supports(m,surface))return surface;
 if(surface==='water'&&supports(m,'underwater'))return 'underwater';
 need(supports(m,'air'),'現在地に対応する適性がありません');return 'air';}
function initializeDomains(g,surface){requireFormation(g);const out=clone(g);for(const m of living(out))m.domain=defaultDomain(m,surface);return out;}
function canSwitch(g,domain){return beforeAction(g)&&living(g).every(m=>{configured(m);return supports(m,domain);});}
function switchDomain(g,domain){need(canSwitch(g,domain),'行動前かつ全員が対応する領域にのみ切替可能です');const out=clone(g);for(const m of living(out))m.domain=domain;return out;}
function groupMove(g){requireFormation(g);return Math.min(...living(g).map(m=>{configured(m);return m.unit.move;}));}
// Caller supplies explicit cost per supported movement domain for each destination tile.
// Missing terrain cost is impassable; no guesses about mixed surfaces or obstacles.
function stepCost(g,costs){requireFormation(g);const values=living(g).map(m=>{configured(m);need(own(C.MOVEMENT_DOMAINS,m.domain),'個体の移動領域を初期化してください');if(!supports(m,m.domain)||!own(costs,m.domain))return Infinity;const n=costs[m.domain];need(typeof n==='number'&&Number.isFinite(n)&&n>0,'地形基本コストは正の有限数です');return n*C.MOVEMENT_APTITUDES[m.unit.movementAptitude[m.domain]];});return Math.max(...values);}
function pathCost(g,steps){need(Array.isArray(steps),'経路コスト配列が必要です');return steps.reduce((sum,t)=>sum+stepCost(g,t),0);}
function canTravel(g,steps){return beforeAction(g)&&pathCost(g,steps)<=groupMove(g);}
function markMoved(g){need(beforeAction(g),'移動は行動前のみです');const out=clone(g);for(const m of living(out))m.action={...m.action,moved:true};return out;}
function endAction(g){need(canAct(g),'行動終了済みです');const out=clone(g);for(const m of living(out))m.action={...m.action,ended:true};return out;}
function grantReactivation(g){const out=clone(g);for(const m of living(out))m.action=ready();return out;}
function sameFaction(a,b){need(a.faction&&a.faction===b.faction,'同じ陣営の部隊のみ再編成できます');}
function separateIds(a,b){need(typeof a.id==='string'&&a.id&&typeof b.id==='string'&&b.id&&a.id!==b.id,'異なる部隊IDが必要です');const ids=identity(a);identity(b);need(!b.members.some(m=>ids.has(m.uid)),'部隊間で個体UIDが重複しています');}
function split(g,uids,newId){requireFormation(g);need(beforeAction(g),'分離は行動前のみです');need(typeof newId==='string'&&newId&&newId!==g.id,'新部隊IDが必要です');need(Array.isArray(uids)&&new Set(uids).size===uids.length,'分離UIDが不正です');const live=new Set(living(g).map(m=>m.uid));need(uids.length>0&&uids.length<live.size&&uids.every(id=>live.has(id)),'生存個体の一部を選んでください');const chosen=new Set(uids),a=clone(g),b=clone(g);a.members=a.members.filter(m=>!chosen.has(m.uid));b.id=newId;b.members=b.members.filter(m=>chosen.has(m.uid));requireFormation(a);requireFormation(b);return {source:a,detached:b};}
// Pure partition above does not place a second group on the map. Map layer must commit
// partition + normal movement atomically after checking detached group's reachable tiles.
function merge(a,b){sameFaction(a,b);separateIds(a,b);need(beforeAction(a)&&beforeAction(b),'合流は双方が行動前の場合のみです');const out=clone(b);out.members=[...clone(a.members),...out.members];requireFormation(out);return {removedId:a.id,group:endAction(out)};}
// Exchange is atomic, so a full squad can swap with another full squad.
function transfer(a,b,toB,toA=[]){sameFaction(a,b);separateIds(a,b);need(beforeAction(a)&&beforeAction(b),'移管は双方が行動前の場合のみです');
 const select=(g,ids)=>{need(Array.isArray(ids)&&new Set(ids).size===ids.length,'移管UIDが不正です');const live=new Set(living(g).map(m=>m.uid));need(ids.every(id=>live.has(id)),'移管対象の個体がありません');return new Set(ids);};
 const ab=select(a,toB),ba=select(b,toA);need(ab.size+ba.size>0,'移管対象を選んでください');const x=clone(a),y=clone(b);x.members=[...clone(a.members.filter(m=>!ab.has(m.uid))),...clone(b.members.filter(m=>ba.has(m.uid)))];y.members=[...clone(b.members.filter(m=>!ba.has(m.uid))),...clone(a.members.filter(m=>ab.has(m.uid)))];requireFormation(x);requireFormation(y);return {source:x,target:y};}
// Geometry is deliberately supplied by map integration; no square/hex convention is invented.
function mergeAt(a,b,{reachable}={}){need(typeof reachable==='function'&&reachable(a,b.position)===true,'合流先への移動可能判定が必要です');return merge(a,b);}
function transferAdjacent(a,b,toB,toA, {adjacent}={}){need(typeof adjacent==='function'&&adjacent(a.position,b.position)===true,'隣接判定が必要です');return transfer(a,b,toB,toA);}
function createTurnOrder(factions){need(Array.isArray(factions)&&factions.length>0&&factions.every(x=>typeof x==='string'&&x)&&new Set(factions).size===factions.length,'陣営順を重複なしで指定してください');return {factions:[...factions],index:0,round:1};}
function beginFaction(groups,faction){return groups.map(g=>g.faction===faction?grantReactivation(g):clone(g));}
function advanceTurn(order,groups){need(order&&Array.isArray(order.factions),'陣営順が必要です');createTurnOrder(order.factions);need(Number.isInteger(order.index)&&order.index>=0&&order.index<order.factions.length,'陣営インデックスが不正です');const next=clone(order);next.index=(next.index+1)%next.factions.length;if(next.index===0)next.round++;return {order:next,groups:beginFaction(groups,next.factions[next.index])};}
root.PROTactical=Object.freeze({version:'0.1.0',SQUAD,unitSize,squadUsage,joinReason,living,formation,configured,supports,canAct,beforeAction,defaultDomain,initializeDomains,canSwitch,switchDomain,groupMove,stepCost,pathCost,canTravel,markMoved,endAction,grantReactivation,split,merge,transfer,mergeAt,transferAdjacent,createTurnOrder,beginFaction,advanceTurn});
})(typeof window==='undefined'?globalThis:window);
