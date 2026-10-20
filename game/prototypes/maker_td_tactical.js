/* T&D maker: Tactical missions (round 1) — basics, map painting (built-in terrains + custom terrains with a Tactical
   square), player starts, enemy squads with AI, win / lose conditions, rewards and test play. Loaded after
   maker_td.js; it registers its kind, fields, editors and checks through PROMakerTD.extend. */
(function(){'use strict';
const X=window.PROMakerTD.extend,C=window.PROCore,B=window.PROTacticalBuiltinPack;
const {el,win,closeWin,commit,numberPrompt,find,data,clone,message}=X;
const MAP_MIN=6,MAP_MAX=30,SIZES=C.UNIT_SIZES;
const BUILTIN=B?.terrains||{};
// Terrain palette: built-in square types (one-letter keys) + custom terrains that have Tactical movement costs.
function palette(){return [...Object.entries(BUILTIN).map(([k,t])=>({key:k,name:t.name,kind:t.kind})),...data().terrains.filter(t=>Object.keys(t.tactical?.costs||{}).length).map(t=>({key:t.id,name:t.name,kind:t.tactical.kind||'ground',custom:true}))];}
const terrainOf=key=>palette().find(p=>p.key===key);
const SURFACE_FILL={ground:'p',water:'w',space:'s'};
const AI={assault:'突撃',ambush:'待ち伏せ',hold:'拠点防衛',cautious:'慎重'},TARGET={lowest_hp:'残りHPが少ない相手',nearest:'近い相手',strongest:'強い相手'};
const VICTORY={enemy_wipe:'敵の全滅',boss:'指定した敵部隊の撃破',reach:'指定マスへの到達',defend:'○ターン防衛（生き残る）'},DEFEAT={player_wipe:'味方の全滅',turn_limit:'○ターン以内に勝てない',unit_down:'指定ユニットの撃破'};
function blankMission(){const w=12,h=9;return {name:'新しいタクティカル作戦',code:'',kind:'combat',surface:'ground',color:'#29453e',map:{width:w,height:h,grid:Array.from({length:h},()=>Array(w).fill('p'))},playerStarts:[{x:0,y:0},{x:1,y:0},{x:2,y:0}],enemies:[],victory:{type:'enemy_wipe'},defeat:{type:'player_wipe'},result:{credits:1000,exp:60}};}
const groupName=(m,id)=>m.enemies.find(g=>g.id===id)?.name||'⚠'+id;
function victoryText(m){const v=m.victory||{};return v.type==='boss'?groupName(m,v.groupId)+'の撃破':v.type==='reach'?'('+(v.x+1)+','+(v.y+1)+')への到達':v.type==='defend'?(v.turns||'?')+'ターン防衛':'敵部隊の全滅';}
function defeatText(m){const f=m.defeat||{};return f.type==='turn_limit'?(f.turns||'?')+'ターン以内に勝てない':f.type==='unit_down'?(find('units',f.unitId)?.name||'⚠'+f.unitId)+'の撃破':'味方の全滅';}

/* ---------- map editor ---------- */
function mapWindow(m){const map=clone(m.map),starts=clone(m.playerStarts||[]),pos=Object.fromEntries((m.enemies||[]).map(g=>[g.id,{...g.position}]));let mode='paint',brush=palette()[0]?.key||'p',rectStart=null,group=m.enemies[0]?.id||null;
 const save=()=>{commit(o=>{o.map=map;o.playerStarts=starts;for(const g of o.enemies||[])if(pos[g.id])g.position=pos[g.id];});closeWin();};
 const resize=(w,h)=>{const fill=SURFACE_FILL[m.surface]||'p';map.grid=Array.from({length:h},(_,y)=>Array.from({length:w},(_,x)=>map.grid[y]?.[x]??fill));map.width=w;map.height=h;for(let i=starts.length-1;i>=0;i--)if(starts[i].x>=w||starts[i].y>=h)starts.splice(i,1);for(const k of Object.keys(pos))if(pos[k].x>=w||pos[k].y>=h)pos[k]={x:Math.min(pos[k].x,w-1),y:Math.min(pos[k].y,h-1)};};
 const fillFrom=(x,y)=>{const from=map.grid[y][x];if(from===brush)return;const q=[[x,y]];while(q.length){const [a,b]=q.pop();if(a<0||b<0||a>=map.width||b>=map.height||map.grid[b][a]!==from)continue;map.grid[b][a]=brush;q.push([a+1,b],[a-1,b],[a,b+1],[a,b-1]);}};
 const tap=(x,y)=>{if(mode==='paint')map.grid[y][x]=brush;else if(mode==='fill')fillFrom(x,y);else if(mode==='row')for(let i=0;i<map.width;i++)map.grid[y][i]=brush;
  else if(mode==='rect'){if(!rectStart){rectStart={x,y};}else{for(let b=Math.min(y,rectStart.y);b<=Math.max(y,rectStart.y);b++)for(let a=Math.min(x,rectStart.x);a<=Math.max(x,rectStart.x);a++)map.grid[b][a]=brush;rectStart=null;}}
  else if(mode==='start'){const i=starts.findIndex(s=>s.x===x&&s.y===y);if(i>=0)starts.splice(i,1);else if(starts.length<9)starts.push({x,y});}
  else if(mode==='enemy'&&group)pos[group]={x,y};draw();};
 const draw=()=>win('マップ（'+map.width+'×'+map.height+'）','地形を塗り、味方の初期位置と敵部隊の位置を置きます。四角形は2マス目を押した範囲を塗ります。',body=>{
  const sizes=el('div',null,'td-nums');for(const [k,label] of [['width','幅'],['height','高さ']]){const b=el('button',label+' '+map[k],'secondary');b.type='button';b.dataset.mapsize=k;b.onclick=()=>numberPrompt(label+'（'+MAP_MIN+'〜'+MAP_MAX+'）',map[k],MAP_MIN,MAP_MAX,v=>{if(v!=null)resize(k==='width'?v:map.width,k==='height'?v:map.height);draw();},draw);sizes.append(b);}body.append(sizes);
  const modes=el('div',null,'tmap-modes');for(const [k,label] of [['paint','1マス'],['row','行'],['rect','四角形'],['fill','塗りつぶし'],['start','味方の初期位置'],['enemy','敵部隊の位置']]){const b=el('button',(mode===k?'✓ ':'')+label,'secondary');b.type='button';b.dataset.mode=k;b.onclick=()=>{mode=k;rectStart=null;draw();};modes.append(b);}body.append(modes);
  if(['paint','row','rect','fill'].includes(mode)){const pal=el('div',null,'tmap-palette');for(const p of palette()){const b=el('button',(brush===p.key?'✓ ':'')+p.name+(p.custom?'＊':''),'tmap-swatch field-tile '+p.kind);b.type='button';b.dataset.brush=p.key;b.onclick=()=>{brush=p.key;draw();};pal.append(b);}body.append(pal);}
  if(mode==='enemy'){const gs=el('div',null,'tmap-palette');if(!m.enemies.length)gs.append(el('p','先に「敵部隊」で部隊を作ってください。','cmd-hint'));for(const g of m.enemies){const b=el('button',(group===g.id?'✓ ':'')+g.name,'secondary');b.type='button';b.dataset.group=g.id;b.onclick=()=>{group=g.id;draw();};gs.append(b);}body.append(gs);}
  if(mode==='rect'&&rectStart)body.append(el('p','始点 ('+(rectStart.x+1)+','+(rectStart.y+1)+') — 終点のマスを押してください','cmd-hint'));
  const grid=el('div',null,'tmap-grid');grid.style.setProperty('--cols',map.width);for(let y=0;y<map.height;y++)for(let x=0;x<map.width;x++){const key=map.grid[y][x],t=terrainOf(key),b=el('button',null,'tmap-cell field-tile '+(t?.kind||'ground')+(t?'':' tmap-bad'));b.type='button';b.dataset.x=x;b.dataset.y=y;
   const si=starts.findIndex(s=>s.x===x&&s.y===y),eg=m.enemies.find(g=>pos[g.id]?.x===x&&pos[g.id]?.y===y);if(si>=0)b.append(el('strong','味'+(si+1)));if(eg)b.append(el('strong',eg.name.slice(0,3),'tmap-enemy'));b.title=(t?.name||'⚠'+key)+' ('+(x+1)+','+(y+1)+')';b.setAttribute('aria-label',b.title);b.onclick=()=>tap(x,y);grid.append(b);}
  body.append(grid);},[['決定',save],['戻る',closeWin]]);
 draw();}

/* ---------- enemy squads ---------- */
function enemiesWindow(m){const list=clone(m.enemies||[]);const save=()=>{commit(o=>{o.enemies=list;});closeWin();};
 const size=g=>g.members.reduce((n,e)=>n+(SIZES[find('units',e.unit)?.size]||1),0);
 const top=()=>win('敵部隊','1部隊に最大8体・総サイズ8。位置は「マップ」の「敵部隊の位置」で置きます。',body=>{const l=el('div',null,'cmd-list');list.forEach((g,i)=>{const b=el('button',(i+1)+'. '+g.name+' ／ '+g.members.length+'体・サイズ'+size(g)+' ／ '+AI[g.ai?.pattern||'assault']+(g.position?' ／ ('+(g.position.x+1)+','+(g.position.y+1)+')':' ／ 位置未設定'));b.type='button';b.dataset.squad=i;b.onclick=()=>one(i);l.append(b);});if(!list.length)l.append(el('p','敵部隊はありません。','cmd-hint'));body.append(l);},
  [['＋ 敵部隊を追加',()=>{if(list.length>=16)return;const ids=new Set(list.map(g=>g.id));let k=1;while(ids.has('enemy-'+k))k++;list.push({id:'enemy-'+k,name:'敵第'+k+'部隊',members:[],ai:{pattern:'assault',target:'lowest_hp'}});one(list.length-1);}],['決定',save],['戻る',closeWin]]);
 const one=i=>{const g=list[i];win(g.name,'',body=>{const l=el('div',null,'cmd-list');const row=(label,val,fn,key)=>{const b=el('button',null,'unit-row setting-row td-row');b.type='button';b.dataset.efield=key;b.append(el('span',label),el('b',val));b.onclick=fn;l.append(b);};
  row('部隊名',g.name,()=>win('部隊名','',b=>{const t=el('input');t.id='inputValue';t.value=g.name;t.maxLength=20;b.append(t);},[['決定',()=>{const v=$('inputValue').value.trim();if(v)g.name=v;one(i);}],['戻る',()=>one(i)]]),'name');
  row('AI',AI[g.ai?.pattern||'assault'],()=>{const ks=Object.keys(AI);g.ai={...g.ai,pattern:ks[(ks.indexOf(g.ai?.pattern||'assault')+1)%ks.length]};one(i);},'pattern');
  row('狙う相手',TARGET[g.ai?.target||'lowest_hp'],()=>{const ks=Object.keys(TARGET);g.ai={...g.ai,target:ks[(ks.indexOf(g.ai?.target||'lowest_hp')+1)%ks.length]};one(i);},'target');
  if(g.ai?.pattern==='ambush')row('反応距離',String(g.ai.triggerRange??4),()=>numberPrompt('反応距離',g.ai.triggerRange??4,1,30,v=>{if(v!=null)g.ai.triggerRange=v;one(i);},()=>one(i)),'triggerRange');
  if(g.ai?.pattern==='cautious')row('後退するHP%',String(g.ai.retreatHpPct??50),()=>numberPrompt('後退するHP%',g.ai.retreatHpPct??50,1,99,v=>{if(v!=null)g.ai.retreatHpPct=v;one(i);},()=>one(i)),'retreat');
  g.members.forEach((e,j)=>row('ユニット'+(j+1),(find('units',e.unit)?.name||'⚠'+e.unit)+(e.name?'（'+e.name+'）':''),()=>member(i,j),'member'+j));
  body.append(l);},[['＋ ユニットを追加',()=>{if(g.members.length>=8||!data().units.length)return;g.members.push({unit:data().units[0].id});member(i,g.members.length-1);}],['この部隊を削除',()=>{list.splice(i,1);top();}],['一覧へ戻る',top]]);};
 const member=(i,j)=>{const e=list[i].members[j];win('ユニット'+(j+1),'',body=>{const l=el('div',null,'cmd-list');for(const u of data().units){const b=el('button',(u.id===e.unit?'✓ ':'')+u.name+'（'+(u.size||'?')+'）');b.type='button';b.dataset.choice=u.id;b.onclick=()=>{e.unit=u.id;one(i);};l.append(b);}body.append(l);},
  [['名前を変える（任意）',()=>win('表示名','空欄でユニットの名前',b=>{const t=el('input');t.id='inputValue';t.value=e.name||'';t.maxLength=20;b.append(t);},[['決定',()=>{const v=$('inputValue').value.trim();if(v)e.name=v;else delete e.name;one(i);}],['戻る',()=>member(i,j)]])],['このユニットを外す',()=>{list[i].members.splice(j,1);one(i);}],['戻る',()=>one(i)]]);};
 top();}
const $=id=>document.getElementById(id);

/* ---------- test play ---------- */
function trial(m){const iss=checks(m);if(iss.length){message('試しプレイできません',iss);return;}try{localStorage.setItem('PRO_TACTICAL_SOURCE','maker');}catch(e){}X.save();location.href='tactical_hub.html?trial='+encodeURIComponent(m.id)+'#missions';}

/* ---------- checks ---------- */
function checks(m){const out=[],w=m.map?.width,h=m.map?.height;if(!(w>=MAP_MIN&&w<=MAP_MAX&&h>=MAP_MIN&&h<=MAP_MAX))out.push('マップの広さは'+MAP_MIN+'〜'+MAP_MAX+'マスです');
 if(!Array.isArray(m.map?.grid)||m.map.grid.length!==h||m.map.grid.some(r=>!Array.isArray(r)||r.length!==w))out.push('マップの大きさとマスの数が合いません');else{const bad=new Set();for(const r of m.map.grid)for(const k of r)if(!terrainOf(k))bad.add(k);if(bad.size)out.push('使えない地形：'+[...bad].join('・'));}
 const inside=p=>p&&p.x>=0&&p.y>=0&&p.x<w&&p.y<h,key=p=>p.x+','+p.y;if(!(m.playerStarts||[]).length)out.push('味方の初期位置がありません');if((m.playerStarts||[]).some(p=>!inside(p)))out.push('マップの外に味方の初期位置があります');
 const taken=new Set((m.playerStarts||[]).map(key));for(const g of m.enemies||[]){if(!g.members.length)out.push(g.name+'：ユニットがいません');if(g.members.length>8)out.push(g.name+'：8体までです');const sz=g.members.reduce((n,e)=>n+(SIZES[find('units',e.unit)?.size]||1),0);if(sz>8)out.push(g.name+'：総サイズ'+sz+'（8まで）');
  for(const e of g.members)if(!find('units',e.unit))out.push(g.name+'：ユニット「'+e.unit+'」が見つかりません');if(!inside(g.position))out.push(g.name+'：位置が未設定かマップの外です');else{if(taken.has(key(g.position)))out.push(g.name+'：ほかの部隊・初期位置と重なっています');taken.add(key(g.position));}}
 const v=m.victory||{};if(v.type==='boss'&&!(m.enemies||[]).some(g=>g.id===v.groupId))out.push('勝利条件：撃破する敵部隊を選んでください');if(v.type==='reach'&&!inside(v))out.push('勝利条件：到達するマスがマップの外です');if(v.type==='defend'&&!(v.turns>=1))out.push('勝利条件：防衛するターン数を入れてください');
 if((v.type||'enemy_wipe')==='enemy_wipe'&&!(m.enemies||[]).length)out.push('敵部隊がいません');
 const f=m.defeat||{};if(f.type==='turn_limit'&&!(f.turns>=1))out.push('敗北条件：ターン数を入れてください');if(f.type==='unit_down'&&!find('units',f.unitId))out.push('敗北条件：ユニットを選んでください');return out;}

X.registerKind('tmissions',{label:'タクティカル作戦',en:'TACTICAL MISSIONS',prefix:'tm'},blankMission,[
 {key:'name',label:'作戦名',type:'text',group:'基本'},{key:'id',label:'ID',type:'id',group:'基本'},{key:'desc',label:'説明',type:'text',group:'基本'},{key:'code',label:'作戦コード（例：OP-03）',type:'text',max:12,group:'基本'},
 {key:'kind',label:'種別',type:'select',choices:{training:'訓練',combat:'実戦'},group:'基本'},{key:'surface',label:'基準の領域',type:'select',choices:{ground:'地上',water:'水上',space:'宇宙'},group:'基本'},{key:'color',label:'一覧の色（#rrggbb）',type:'text',max:7,group:'基本'},
 {key:'map',label:'マップ（地形・初期位置・敵の位置）',type:'tmap',group:'マップと配置'},{key:'enemies',label:'敵部隊',type:'tenemies',group:'マップと配置'},
 {key:'victory.type',label:'勝利条件',type:'select',choices:VICTORY,group:'勝敗条件'},{key:'victory.groupId',label:'撃破する敵部隊',type:'select',choices:m=>Object.fromEntries((m.enemies||[]).map(g=>[g.id,g.name])),group:'勝敗条件',show:m=>m.victory?.type==='boss'},
 {key:'victory.x',label:'到達するマス：横（左端が0）',type:'number',min:0,max:MAP_MAX-1,group:'勝敗条件',show:m=>m.victory?.type==='reach'},{key:'victory.y',label:'到達するマス：縦（上端が0）',type:'number',min:0,max:MAP_MAX-1,group:'勝敗条件',show:m=>m.victory?.type==='reach'},
 {key:'victory.turns',label:'防衛するターン数',type:'number',min:1,max:99,group:'勝敗条件',show:m=>m.victory?.type==='defend'},
 {key:'defeat.type',label:'敗北条件',type:'select',choices:DEFEAT,group:'勝敗条件'},{key:'defeat.turns',label:'このターンを過ぎたら敗北',type:'number',min:1,max:99,group:'勝敗条件',show:m=>m.defeat?.type==='turn_limit'},
 {key:'defeat.unitId',label:'撃破されたら敗北するユニット',type:'select',choices:()=>Object.fromEntries(data().units.map(u=>[u.id,u.name])),group:'勝敗条件',show:m=>m.defeat?.type==='unit_down'},
 {key:'result.credits',label:'報酬：資金（Cr）',type:'number',min:0,group:'報酬'},{key:'result.exp',label:'報酬：経験値',type:'number',min:0,group:'報酬'},{key:'result.items',label:'報酬：アイテム',type:'itemCounts',group:'報酬'},
 {key:'requires.missions',label:'先にクリアするタクティカル作戦',type:'refs',ref:'tmissions',group:'解放条件'},{key:'hidden',label:'解放されるまで一覧に出さない',type:'toggle',group:'解放条件'},
 {key:'trial',label:'試しプレイ（タクティカルの画面で開く）',type:'ttrial',group:'試し'}],
 {display:{tmap:(v,m)=>m.map?m.map.width+'×'+m.map.height+' ・ 味方'+(m.playerStarts||[]).length+'か所 ・ 敵'+(m.enemies||[]).filter(g=>g.position).length+'部隊':'未設定',tenemies:v=>(v||[]).length?v.map(g=>g.name+'（'+g.members.length+'体）').join('・'):'なし',ttrial:()=>'開く →'},
  edit:{tmap:(f,m)=>mapWindow(m),tenemies:(f,m)=>enemiesWindow(m),ttrial:(f,m)=>trial(m)},
  issues:checks,
  refs:m=>[...(m.enemies||[]).flatMap(g=>g.members.map(e=>['units',e.unit])),...(m.defeat?.type==='unit_down'&&m.defeat.unitId?[['units',m.defeat.unitId]]:[]),...Object.keys(m.result?.items||{}).map(id=>['items',id]),...(m.requires?.missions||[]).map(id=>['tmissions',id]),...[...new Set((m.map?.grid||[]).flat())].filter(k=>!BUILTIN[k]).map(id=>['terrains',id])],
  // Link maintenance: renamed IDs follow; deleted units leave squads, deleted terrains become plain ground.
  mapRefs:(k,fn)=>{for(const m of data().tmissions){if(k==='units'){for(const g of m.enemies||[])g.members=g.members.filter(e=>{const n=fn(e.unit);if(n)e.unit=n;return !!n;});if(m.defeat?.unitId){const n=fn(m.defeat.unitId);if(n)m.defeat.unitId=n;else delete m.defeat.unitId;}}
   if(k==='terrains'&&m.map?.grid)m.map.grid=m.map.grid.map(r=>r.map(key=>BUILTIN[key]?key:(fn(key)||SURFACE_FILL[m.surface]||'p')));
   if(k==='items'&&m.result?.items)for(const id of Object.keys(m.result.items)){const n=fn(id);if(n!==id){const v=m.result.items[id];delete m.result.items[id];if(n)m.result.items[n]=v;}}
   if(k==='tmissions'&&m.requires?.missions)m.requires.missions=m.requires.missions.map(fn).filter(Boolean);}}});
window.PROMakerTactical=Object.freeze({checks,palette,victoryText,defeatText});
})();
