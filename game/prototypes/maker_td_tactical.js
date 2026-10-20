/* T&D maker: Tactical missions — basics, map painting (built-in terrains + custom terrains with a Tactical square),
   player starts, enemy squads with AI, allied guest squads, reinforcements, win / lose conditions, events (talk,
   choices, flags, reinforcements, withdrawals, terrain and condition changes), in-mission objectives with rewards,
   and test play. Loaded after
   maker_td.js; it registers its kind, fields, editors and checks through PROMakerTD.extend. */
(function(){'use strict';
const X=window.PROMakerTD.extend,C=window.PROCore,B=window.PROTacticalBuiltinPack;
const {el,win,closeWin,commit,numberPrompt,find,data,clone,message,condsEditor}=X;
const MAP_MIN=6,MAP_MAX=30,SIZES=C.UNIT_SIZES;
const BUILTIN=B?.terrains||{};
// Terrain palette: built-in square types (one-letter keys) + custom terrains that have Tactical movement costs.
function palette(){return [...Object.entries(BUILTIN).map(([k,t])=>({key:k,name:t.name,kind:t.kind})),...data().terrains.filter(t=>t.tactical?.kind||Object.keys(t.tactical?.costs||{}).length).map(t=>({key:t.id,name:t.name+(Object.keys(t.tactical.costs||{}).length?'':'（進入不可）'),kind:t.tactical.kind||'ground',color:t.tactical.color,custom:true}))];}
const terrainOf=key=>palette().find(p=>p.key===key);
const SURFACE_FILL={ground:'p',water:'w',space:'s'};
const AI={assault:'突撃',ambush:'待ち伏せ',hold:'拠点防衛',cautious:'慎重'},TARGET={lowest_hp:'残りHPが少ない相手',nearest:'近い相手',strongest:'強い相手'};
const VICTORY={enemy_wipe:'敵の全滅',boss:'指定した敵部隊の撃破',reach:'指定マスへの到達',defend:'○ターン防衛（生き残る）',flag:'フラグが立つ（イベントで勝利）'},DEFEAT={player_wipe:'味方の全滅',turn_limit:'○ターン以内に勝てない',unit_down:'指定ユニットの撃破',squad_down:'指定部隊の撃破（護衛対象など）',enemy_reach:'敵が指定マスへ到達',flag:'フラグが立つ（イベントで敗北）'};
// Conditions shared by event triggers and objectives: {type, groupId, x, y, turns, flag, unitId}.
const COND={game_flag:'ゲームのフラグ',game_cond:'ゲームの条件セット（所持・研究など）',objective_done:'作戦内ミッションの成功',objective_failed:'作戦内ミッションの失敗',start:'作戦開始時',turn:'第○ターンになった',squad_down:'部隊の撃破',reach:'味方がマス・範囲へ到達',enemy_reach:'敵がマス・範囲へ到達',flag:'フラグが立った',unit_down:'ユニットの撃破',loss:'味方ユニットが撃破された',enemy_wipe:'敵の全滅',within:'○ターン以内に勝利',no_loss:'味方の撃破なしで勝利',victory:'作戦成功時',defeat:'作戦失敗時',none:'なし'};
const pickTypes=ks=>Object.fromEntries(ks.map(k=>[k,COND[k]]));
const TRIGGERS=pickTypes(['start','turn','objective_done','objective_failed','game_flag','game_cond','squad_down','reach','enemy_reach','flag','unit_down','loss','enemy_wipe','victory','defeat']),OBJ_OK=pickTypes(['objective_done','squad_down','reach','flag','within','no_loss','enemy_wipe','turn']),OBJ_NG=pickTypes(['none','objective_failed','turn','loss','unit_down','squad_down','enemy_reach','flag']);
const ACTS={talk:'会話',choice:'選択肢（フラグを立てる）',flag:'フラグを立てる',spawn:'増援を出す',withdraw:'部隊を撤退させる',terrain:'地形を変える',victory:'勝利条件を変える',defeat:'敗北条件を変える',objective:'作戦内ミッションを発生・達成・失敗にする',ai:'敵部隊のAIを変える',game_flag:'ゲームのフラグを変える（作戦終了時に反映）'};
function blankMission(){const w=12,h=9;return {name:'新しいタクティカル作戦',code:'',kind:'combat',surface:'ground',color:'#29453e',map:{width:w,height:h,grid:Array.from({length:h},()=>Array(w).fill('p'))},playerStarts:[{x:0,y:0},{x:1,y:0},{x:2,y:0}],enemies:[],allies:[],events:[],objectives:[],victory:{type:'enemy_wipe'},defeat:{type:'player_wipe'},result:{credits:1000,exp:60}};}
const squadsOf=m=>[...(m.enemies||[]),...(m.allies||[])],groupName=(m,id)=>squadsOf(m).find(g=>g.id===id)?.name||'⚠'+id;
const at=c=>'('+((c.x??-1)+1)+','+((c.y??-1)+1)+')'+((c.w||1)>1||(c.h||1)>1?'〜('+((c.x??0)+(c.w||1))+','+((c.y??0)+(c.h||1))+')':''),obName=(m,id)=>(m.objectives||[]).find(o=>o.id===id)?.name||'⚠'+id;
function ctext(m,c){c=c||{};switch(c.type){case 'boss':case 'squad_down':return groupName(m,c.groupId)+'の撃破';case 'reach':return at(c)+'への到達';case 'objective_done':return '「'+obName(m,c.objectiveId)+'」の成功';case 'objective_failed':return '「'+obName(m,c.objectiveId)+'」の失敗';case 'enemy_reach':return '敵の'+at(c)+'への到達';case 'defend':return (c.turns||'?')+'ターン防衛';case 'turn':return '第'+(c.turns||'?')+'ターン';case 'turn_limit':return (c.turns||'?')+'ターン以内に勝てない';case 'within':return (c.turns||'?')+'ターン以内に勝利';case 'flag':return 'フラグ「'+(c.flag||'?')+'」';case 'unit_down':return (find('units',c.unitId)?.name||'⚠'+c.unitId)+'の撃破';case 'player_wipe':return '味方の全滅';case 'game_flag':return 'ゲームのフラグ「'+(find('flags',c.flagId)?.name||c.flagId||'?')+'」が'+(c.on===false?'OFF':'ON');case 'game_cond':return 'ゲームの条件 '+(c.conds?.list||[]).length+'件';case 'enemy_wipe':return '敵の全滅';default:return COND[c.type]||'なし';}}
const victoryText=m=>ctext(m,m.victory||{type:'enemy_wipe'}),defeatText=m=>ctext(m,m.defeat||{type:'player_wipe'});

/* ---------- map editor ---------- */
function mapWindow(m){const map=clone(m.map),starts=clone(m.playerStarts||[]),pos=Object.fromEntries(squadsOf(m).filter(g=>g.position).map(g=>[g.id,{...g.position}]));let mode='paint',brush=palette()[0]?.key||'p',rectStart=null,group=null;
 const save=()=>{commit(o=>{o.map=map;o.playerStarts=starts;for(const g of squadsOf(o))if(pos[g.id])g.position=pos[g.id];});closeWin();};
 const resize=(w,h)=>{const fill=SURFACE_FILL[m.surface]||'p';map.grid=Array.from({length:h},(_,y)=>Array.from({length:w},(_,x)=>map.grid[y]?.[x]??fill));map.width=w;map.height=h;for(let i=starts.length-1;i>=0;i--)if(starts[i].x>=w||starts[i].y>=h)starts.splice(i,1);for(const k of Object.keys(pos))if(pos[k].x>=w||pos[k].y>=h)pos[k]={x:Math.min(pos[k].x,w-1),y:Math.min(pos[k].y,h-1)};};
 const fillFrom=(x,y)=>{const from=map.grid[y][x];if(from===brush)return;const q=[[x,y]];while(q.length){const [a,b]=q.pop();if(a<0||b<0||a>=map.width||b>=map.height||map.grid[b][a]!==from)continue;map.grid[b][a]=brush;q.push([a+1,b],[a-1,b],[a,b+1],[a,b-1]);}};
 const tap=(x,y)=>{if(mode==='paint')map.grid[y][x]=brush;else if(mode==='fill')fillFrom(x,y);else if(mode==='row')for(let i=0;i<map.width;i++)map.grid[y][i]=brush;
  else if(mode==='rect'){if(!rectStart){rectStart={x,y};}else{for(let b=Math.min(y,rectStart.y);b<=Math.max(y,rectStart.y);b++)for(let a=Math.min(x,rectStart.x);a<=Math.max(x,rectStart.x);a++)map.grid[b][a]=brush;rectStart=null;}}
  else if(mode==='start'){const i=starts.findIndex(s=>s.x===x&&s.y===y);if(i>=0)starts.splice(i,1);else if(starts.length<9)starts.push({x,y});}
  else if((mode==='enemy'||mode==='ally')&&group)pos[group]={x,y};draw();};
 const draw=()=>win('マップ（'+map.width+'×'+map.height+'）','地形を塗り、味方の初期位置と敵部隊の位置を置きます。四角形は2マス目を押した範囲を塗ります。',body=>{
  const sizes=el('div',null,'td-nums');for(const [k,label] of [['width','幅'],['height','高さ']]){const b=el('button',label+' '+map[k],'secondary');b.type='button';b.dataset.mapsize=k;b.onclick=()=>numberPrompt(label+'（'+MAP_MIN+'〜'+MAP_MAX+'）',map[k],MAP_MIN,MAP_MAX,v=>{if(v!=null)resize(k==='width'?v:map.width,k==='height'?v:map.height);draw();},draw);sizes.append(b);}body.append(sizes);
  const modes=el('div',null,'tmap-modes');for(const [k,label] of [['paint','1マス'],['row','行'],['rect','四角形'],['fill','塗りつぶし'],['start','味方の初期位置'],['enemy','敵部隊の位置'],['ally','味方部隊（ゲスト）の位置']]){const b=el('button',(mode===k?'✓ ':'')+label,'secondary');b.type='button';b.dataset.mode=k;b.onclick=()=>{mode=k;rectStart=null;group=(k==='enemy'?m.enemies:k==='ally'?m.allies||[]:[])[0]?.id||null;draw();};modes.append(b);}body.append(modes);
  if(['paint','row','rect','fill'].includes(mode)){const pal=el('div',null,'tmap-palette');for(const p of palette()){const b=el('button',(brush===p.key?'✓ ':'')+p.name+(p.custom?'＊':''),'tmap-swatch field-tile '+p.kind);b.type='button';b.dataset.brush=p.key;if(p.color)b.style.background=p.color;b.onclick=()=>{brush=p.key;draw();};pal.append(b);}body.append(pal);}
  if(mode==='enemy'||mode==='ally'){const list=mode==='enemy'?m.enemies:m.allies||[],gs=el('div',null,'tmap-palette');if(!list.length)gs.append(el('p','先に「'+(mode==='enemy'?'敵部隊':'味方部隊（ゲスト）')+'」で部隊を作ってください。','cmd-hint'));for(const g of list){const b=el('button',(group===g.id?'✓ ':'')+g.name+(g.reinforce?'（増援）':''),'secondary');b.type='button';b.dataset.group=g.id;b.onclick=()=>{group=g.id;draw();};gs.append(b);}body.append(gs);}
  if(mode==='rect'&&rectStart)body.append(el('p','始点 ('+(rectStart.x+1)+','+(rectStart.y+1)+') — 終点のマスを押してください','cmd-hint'));
  const grid=el('div',null,'tmap-grid');grid.style.setProperty('--cols',map.width);for(let y=0;y<map.height;y++)for(let x=0;x<map.width;x++){const key=map.grid[y][x],t=terrainOf(key),b=el('button',null,'tmap-cell field-tile '+(t?.kind||'ground')+(t?'':' tmap-bad'));b.type='button';b.dataset.x=x;b.dataset.y=y;if(t?.color)b.style.background=t.color;
   const si=starts.findIndex(s=>s.x===x&&s.y===y),eg=squadsOf(m).find(g=>pos[g.id]?.x===x&&pos[g.id]?.y===y);if(si>=0)b.append(el('strong','味'+(si+1)));if(eg)b.append(el('strong',(eg.reinforce?'増':'')+eg.name.slice(0,3),(m.allies||[]).includes(eg)?'tmap-ally':'tmap-enemy'));b.title=(t?.name||'⚠'+key)+' ('+(x+1)+','+(y+1)+')';b.setAttribute('aria-label',b.title);b.onclick=()=>tap(x,y);grid.append(b);}
  body.append(grid);},[['決定',save],['戻る',closeWin]]);
 draw();}

/* ---------- enemy squads ---------- */
function enemiesWindow(m,side='enemies'){const ally=side==='allies',list=clone(m[side]||[]),PRE=ally?'ally-':'enemy-',LABEL=ally?'味方第':'敵第';const save=()=>{commit(o=>{o[side]=list;});closeWin();};
 const size=g=>g.members.reduce((n,e)=>n+(SIZES[find('units',e.unit)?.size]||1),0);
 const top=()=>win(ally?'味方部隊（ゲスト）':'敵部隊','1部隊に最大8体・総サイズ8。位置は「マップ」で置きます。増援の部隊はイベントの「増援を出す」で現れます（位置が埋まっていれば近くの空きマス）。'+(ally?'ゲストはプレイヤーが操作し、経験値・撃破の扱いはありません。':''),body=>{const l=el('div',null,'cmd-list');list.forEach((g,i)=>{const b=el('button',(i+1)+'. '+g.name+' ／ '+g.members.length+'体・サイズ'+size(g)+(ally?'':' ／ '+AI[g.ai?.pattern||'assault'])+(g.reinforce?' ／ 増援':'')+(g.position?' ／ ('+(g.position.x+1)+','+(g.position.y+1)+')':' ／ 位置未設定'));b.type='button';b.dataset.squad=i;b.onclick=()=>one(i);l.append(b);});if(!list.length)l.append(el('p','部隊はありません。','cmd-hint'));body.append(l);},
  [['＋ 部隊を追加',()=>{if(list.length>=16)return;const ids=new Set(list.map(g=>g.id));let k=1;while(ids.has(PRE+k))k++;list.push({id:PRE+k,name:LABEL+k+'部隊',members:[],...(ally?{}:{ai:{pattern:'assault',target:'lowest_hp'}})});one(list.length-1);}],['決定',save],['戻る',closeWin]]);
 const one=i=>{const g=list[i];win(g.name,'',body=>{const l=el('div',null,'cmd-list');const row=(label,val,fn,key)=>{const b=el('button',null,'unit-row setting-row td-row');b.type='button';b.dataset.efield=key;b.append(el('span',label),el('b',val));b.onclick=fn;l.append(b);};
  row('部隊名',g.name,()=>win('部隊名','',b=>{const t=el('input');t.id='inputValue';t.value=g.name;t.maxLength=20;b.append(t);},[['決定',()=>{const v=$('inputValue').value.trim();if(v)g.name=v;one(i);}],['戻る',()=>one(i)]]),'name');
  row('増援（最初はいない）',g.reinforce?'増援':'最初から配置',()=>{if(g.reinforce)delete g.reinforce;else g.reinforce=true;one(i);},'reinforce');
  if(!ally){row('AI',AI[g.ai?.pattern||'assault'],()=>{const ks=Object.keys(AI);g.ai={...g.ai,pattern:ks[(ks.indexOf(g.ai?.pattern||'assault')+1)%ks.length]};one(i);},'pattern');
  row('狙う相手',TARGET[g.ai?.target||'lowest_hp'],()=>{const ks=Object.keys(TARGET);g.ai={...g.ai,target:ks[(ks.indexOf(g.ai?.target||'lowest_hp')+1)%ks.length]};one(i);},'target');
  if(g.ai?.pattern==='ambush')row('反応距離',String(g.ai.triggerRange??4),()=>numberPrompt('反応距離',g.ai.triggerRange??4,1,30,v=>{if(v!=null)g.ai.triggerRange=v;one(i);},()=>one(i)),'triggerRange');
  if(g.ai?.pattern==='cautious')row('後退するHP%',String(g.ai.retreatHpPct??50),()=>numberPrompt('後退するHP%',g.ai.retreatHpPct??50,1,99,v=>{if(v!=null)g.ai.retreatHpPct=v;one(i);},()=>one(i)),'retreat');}
  g.members.forEach((e,j)=>row('ユニット'+(j+1),(find('units',e.unit)?.name||'⚠'+e.unit)+(e.name?'（'+e.name+'）':''),()=>member(i,j),'member'+j));
  body.append(l);},[['＋ ユニットを追加',()=>{if(g.members.length>=8||!data().units.length)return;g.members.push({unit:data().units[0].id});member(i,g.members.length-1);}],['この部隊を削除',()=>{list.splice(i,1);top();}],['一覧へ戻る',top]]);};
 const member=(i,j)=>{const e=list[i].members[j];win('ユニット'+(j+1),'',body=>{const l=el('div',null,'cmd-list');for(const u of data().units){const b=el('button',(u.id===e.unit?'✓ ':'')+u.name+'（'+(u.size||'?')+'）');b.type='button';b.dataset.choice=u.id;b.onclick=()=>{e.unit=u.id;one(i);};l.append(b);}body.append(l);},
  [['名前を変える（任意）',()=>win('表示名','空欄でユニットの名前',b=>{const t=el('input');t.id='inputValue';t.value=e.name||'';t.maxLength=20;b.append(t);},[['決定',()=>{const v=$('inputValue').value.trim();if(v)e.name=v;else delete e.name;one(i);}],['戻る',()=>member(i,j)]])],['このユニットを外す',()=>{list[i].members.splice(j,1);one(i);}],['戻る',()=>one(i)]]);};
 top();}
const $=id=>document.getElementById(id);
// Every condition object of a mission (win / lose, event triggers and condition changes, objectives).
const allConds=m=>[m.victory,m.defeat,...(m.events||[]).flatMap(e=>[e.trigger,...(e.actions||[]).map(a=>a.cond)]),...(m.objectives||[]).flatMap(o=>[o.success,o.fail])].filter(Boolean);

/* ---------- small window helpers ---------- */
// Rows: [label, value, fn, key] as setting rows (data-efield=key).
function rowsWin(title,help,rows,acts){win(title,help,body=>{const l=el('div',null,'cmd-list');for(const [label,val,fn,key] of rows){const b=el('button',null,'unit-row setting-row td-row');b.type='button';if(key)b.dataset.efield=key;b.append(el('span',label),el('b',val??''));b.onclick=fn;l.append(b);}if(!rows.length)l.append(el('p','まだありません。','cmd-hint'));body.append(l);},acts);}
function pick(title,choices,cur,done,back){win(title,'',body=>{const l=el('div',null,'cmd-list');for(const [k,label] of Object.entries(choices)){const b=el('button',(k===cur?'✓ ':'')+label);b.type='button';b.dataset.choice=k;b.onclick=()=>done(k);l.append(b);}if(!Object.keys(choices).length)l.append(el('p','選べるものがありません。','cmd-hint'));body.append(l);},[['戻る',back]]);}
function textPrompt(title,value,done,back,max=40,multi=false){win(title,'',body=>{const t=el(multi?'textarea':'input');t.id='inputValue';t.value=value||'';t.maxLength=max;if(multi)t.rows=4;body.append(t);},[['決定',()=>done($('inputValue').value.trim())],['戻る',back]]);}
const squadChoices=(m,filter=()=>true)=>Object.fromEntries(squadsOf(m).filter(filter).map(g=>[g.id,g.name+((m.allies||[]).includes(g)?'（味方）':'（敵）')+(g.reinforce?'・増援':'')]));

/* ---------- conditions (event triggers, objectives, condition changes) ---------- */
// c is edited in place; types maps type → label. Parameters follow the type.
function condWindow(m,title,types,c,done,back){const draw=()=>{const t=c.type,rows=[['種類',types[t]||'未設定',()=>pick('種類',types,t,k=>{for(const x of Object.keys(c))delete c[x];c.type=k;draw();},draw),'ctype']];
  if(['boss','squad_down'].includes(t))rows.push(['部隊',c.groupId?groupName(m,c.groupId):'未設定',()=>pick('部隊',squadChoices(m,t==='boss'?g=>m.enemies.includes(g):undefined),c.groupId,k=>{c.groupId=k;draw();},draw),'cgroup']);
  if(['reach','enemy_reach'].includes(t))for(const [k,label,min] of [['x','左上：横（左端が0）',0],['y','左上：縦（上端が0）',0],['w','範囲の幅（1で1マス）',1],['h','範囲の高さ（1で1マス）',1]])rows.push([label,c[k]??(min?'1':'未設定'),()=>numberPrompt(label,c[k],min,MAP_MAX-(min?0:1),v=>{if(v==null||(min&&v===1))delete c[k];else c[k]=v;draw();},draw),'c'+k]);
  if(['objective_done','objective_failed'].includes(t))rows.push(['作戦内ミッション',c.objectiveId?obName(m,c.objectiveId):'未設定',()=>pick('作戦内ミッション',Object.fromEntries((m.objectives||[]).map(o=>[o.id,o.name])),c.objectiveId,k=>{c.objectiveId=k;draw();},draw),'cobjective']);
  if(['turn','defend','turn_limit','within'].includes(t))rows.push(['ターン数',c.turns??'未設定',()=>numberPrompt('ターン数',c.turns,1,99,v=>{if(v==null)delete c.turns;else c.turns=v;draw();},draw),'cturns']);
  if(t==='flag')rows.push(['フラグ名',c.flag||'未設定',()=>textPrompt('フラグ名（この作戦の中だけで使う）',c.flag,v=>{if(v)c.flag=v;else delete c.flag;draw();},draw,20),'cflag']);
  if(t==='game_flag'){rows.push(['フラグ',c.flagId?find('flags',c.flagId)?.name||'⚠'+c.flagId:'未設定',()=>pick('ゲームのフラグ',Object.fromEntries(data().flags.map(f=>[f.id,f.name])),c.flagId,k=>{c.flagId=k;draw();},draw),'cgflag']);rows.push(['状態',c.on===false?'OFF':'ON',()=>{if(c.on===false)delete c.on;else c.on=false;draw();},'con']);}
  if(t==='game_cond')rows.push(['条件セット',(c.conds?.list||[]).length+'件',()=>condsEditor('ゲームの条件セット',c.conds,cs=>{c.conds=cs;draw();},draw),'cconds']);
  if(t==='unit_down')rows.push(['ユニット（出撃した味方）',c.unitId?find('units',c.unitId)?.name||'⚠'+c.unitId:'未設定',()=>pick('ユニット',Object.fromEntries(data().units.map(u=>[u.id,u.name])),c.unitId,k=>{c.unitId=k;draw();},draw),'cunit']);
  rowsWin(title,ctext(m,c),rows,[['決定',()=>done(c)],['戻る',back]]);};draw();}
function condIssue(m,c,where){if(!c?.type)return where+'：条件を選んでください';const t=c.type,w=m.map?.width,h=m.map?.height;
 if(['boss','squad_down'].includes(t)&&!squadsOf(m).some(g=>g.id===c.groupId))return where+'：部隊を選んでください';
 if(['reach','enemy_reach'].includes(t)&&!(c.x>=0&&c.y>=0&&c.x<w&&c.y<h))return where+'：マスがマップの外です';
 if(['turn','defend','turn_limit','within'].includes(t)&&!(c.turns>=1))return where+'：ターン数を入れてください';
 if(t==='flag'&&!c.flag)return where+'：フラグ名を入れてください';if(t==='game_flag'&&!find('flags',c.flagId))return where+'：ゲームのフラグを選んでください';if(t==='game_cond'&&!(c.conds?.list||[]).length)return where+'：条件を入れてください';if(['objective_done','objective_failed'].includes(t)&&!(m.objectives||[]).some(o=>o.id===c.objectiveId))return where+'：作戦内ミッションを選んでください';if(t==='unit_down'&&!find('units',c.unitId))return where+'：ユニットを選んでください';return null;}

/* ---------- events ---------- */
function actText(m,a){switch(a.type){case 'talk':return '会話 '+(a.lines||[]).length+'行'+(a.lines?.[0]?'「'+(a.lines[0].speaker?a.lines[0].speaker+'：':'')+a.lines[0].text.slice(0,12)+'…」':'');case 'choice':return '選択肢 '+(a.options||[]).map(o=>o.label).join('／');case 'flag':return 'フラグ「'+(a.flag||'?')+'」';case 'spawn':return '増援：'+groupName(m,a.groupId);case 'withdraw':return '撤退：'+groupName(m,a.groupId);
 case 'terrain':return '地形：'+(terrainOf(a.key)?.name||'⚠'+a.key)+' '+at(a)+' '+(a.w||1)+'×'+(a.h||1);case 'victory':return '勝利条件→'+ctext(m,a.cond);case 'defeat':return '敗北条件→'+ctext(m,a.cond);case 'objective':return '「'+obName(m,a.id)+'」'+({start:'を発生',failed:'を失敗'}[a.result]||'を達成');case 'game_flag':return 'ゲームのフラグ「'+(find('flags',a.flagId)?.name||a.flagId||'?')+'」を'+(a.value===false?'OFF':'ON');case 'ai':return 'AI：'+groupName(m,a.groupId)+'→'+(AI[a.pattern]||'そのまま')+(a.target?'・'+TARGET[a.target]:'');default:return ACTS[a.type]||a.type;}}
function eventsWindow(m){const list=clone(m.events||[]),view={...m,events:list};const save=()=>{commit(o=>{o.events=list;});closeWin();};
 const top=()=>rowsWin('イベント','条件を満たすと1回だけ起こります。上から順に調べます。作戦前・作戦後の会話は「作戦開始時」「作戦成功時」「作戦失敗時」で作ります。',list.map((e,i)=>[(i+1)+'. '+e.name,ctext(view,e.trigger)+' ／ '+(e.actions||[]).length+'件',()=>one(i),'event'+i]),
  [['＋ イベントを追加',()=>{if(list.length>=40)return;const ids=new Set(list.map(e=>e.id));let k=1;while(ids.has('ev-'+k))k++;list.push({id:'ev-'+k,name:'イベント'+k,trigger:{type:'turn',turns:2},actions:[]});one(list.length-1);}],['決定',save],['戻る',closeWin]]);
 const one=i=>{const e=list[i];rowsWin(e.name,'',[['名前',e.name,()=>textPrompt('イベント名',e.name,v=>{if(v)e.name=v;one(i);},()=>one(i),20),'name'],['きっかけ',ctext(view,e.trigger),()=>condWindow(view,'きっかけ',TRIGGERS,e.trigger,()=>one(i),()=>one(i)),'trigger'],...e.actions.map((a,j)=>[(j+1)+'. '+actText(view,a),'',()=>act(i,j),'act'+j])],
  [['＋ 起こすことを追加',()=>pick('起こすこと',ACTS,null,k=>{e.actions.push(blankAct(k));act(i,e.actions.length-1);},()=>one(i))],['上へ',()=>{if(i>0){[list[i-1],list[i]]=[list[i],list[i-1]];one(i-1);}}],['このイベントを削除',()=>{list.splice(i,1);top();}],['一覧へ戻る',top]]);};
 const blankAct=k=>({talk:{type:'talk',lines:[]},choice:{type:'choice',text:'',options:[]},flag:{type:'flag',flag:''},spawn:{type:'spawn'},withdraw:{type:'withdraw'},terrain:{type:'terrain',x:0,y:0,w:1,h:1,key:'p'},victory:{type:'victory',cond:{type:'enemy_wipe'}},defeat:{type:'defeat',cond:{type:'player_wipe'}},objective:{type:'objective',result:'start'},ai:{type:'ai',pattern:'assault'},game_flag:{type:'game_flag'}})[k];
 const act=(i,j)=>{const a=list[i].actions[j],back=()=>act(i,j),rows=[],common=[['この行動を削除',()=>{list[i].actions.splice(j,1);one(i);}],['戻る',()=>one(i)]];
  if(a.type==='talk'){a.lines.forEach((l,n)=>rows.push([(n+1)+'. '+(l.speaker||'（話し手なし）'),l.text,()=>line(i,j,n),'line'+n]));rowsWin('会話','1行ずつ順に表示します。',rows,[['＋ セリフを追加',()=>{a.lines.push({speaker:'',text:''});line(i,j,a.lines.length-1);}],...common]);return;}
  if(a.type==='choice'){rows.push(['問いかけ',a.text||'未設定',()=>textPrompt('問いかけ',a.text,v=>{a.text=v;back();},back,80,true),'text']);a.options.forEach((o,n)=>rows.push(['選択肢'+(n+1)+'：'+(o.label||'?'),o.flag?'フラグ「'+o.flag+'」':'フラグなし',()=>option(i,j,n),'option'+n]));
   rowsWin('選択肢','選んだ選択肢のフラグが立ちます。フラグをきっかけにしたイベントで分岐させます。',rows,[['＋ 選択肢を追加',()=>{if(a.options.length>=4)return;a.options.push({label:'選択肢'+(a.options.length+1),flag:''});option(i,j,a.options.length-1);}],...common]);return;}
  if(a.type==='flag')rows.push(['フラグ名',a.flag||'未設定',()=>textPrompt('フラグ名',a.flag,v=>{a.flag=v;back();},back,20),'flag']);
  if(a.type==='spawn')rows.push(['出す部隊（増援の部隊）',a.groupId?groupName(view,a.groupId):'未設定',()=>pick('増援の部隊',squadChoices(view,g=>g.reinforce),a.groupId,k=>{a.groupId=k;back();},back),'group']);
  if(a.type==='withdraw')rows.push(['撤退する部隊',a.groupId?groupName(view,a.groupId):'未設定',()=>pick('撤退する部隊',squadChoices(view),a.groupId,k=>{a.groupId=k;back();},back),'group']);
  if(a.type==='terrain'){rows.push(['地形',terrainOf(a.key)?.name||'⚠'+a.key,()=>pick('地形',Object.fromEntries(palette().map(p=>[p.key,p.name+(p.custom?'＊':'')])),a.key,k=>{a.key=k;back();},back),'key']);for(const [k,label,min] of [['x','左上：横（左端が0）',0],['y','左上：縦（上端が0）',0],['w','幅',1],['h','高さ',1]])rows.push([label,a[k],()=>numberPrompt(label,a[k],min,MAP_MAX-(min?0:1),v=>{if(v!=null)a[k]=v;back();},back),k]);}
  if(a.type==='victory'||a.type==='defeat')rows.push(['新しい条件',ctext(view,a.cond),()=>condWindow(view,a.type==='victory'?'新しい勝利条件':'新しい敗北条件',a.type==='victory'?VICTORY:DEFEAT,a.cond,back,back),'cond']);
  if(a.type==='objective'){rows.push(['作戦内ミッション',(view.objectives||[]).find(o=>o.id===a.id)?.name||'未設定',()=>pick('作戦内ミッション',Object.fromEntries((m.objectives||[]).map(o=>[o.id,o.name])),a.id,k=>{a.id=k;back();},back),'objective']);rows.push(['どうする',{start:'発生させる',done:'達成にする',failed:'失敗にする'}[a.result||'done'],()=>{const ks=['start','done','failed'];a.result=ks[(ks.indexOf(a.result||'done')+1)%3];back();},'result']);}
  if(a.type==='game_flag'){rows.push(['フラグ',a.flagId?find('flags',a.flagId)?.name||'⚠'+a.flagId:'未設定',()=>pick('ゲームのフラグ',Object.fromEntries(data().flags.map(f=>[f.id,f.name])),a.flagId,k=>{a.flagId=k;back();},back),'gflag']);rows.push(['ON／OFF',a.value===false?'OFF':'ON',()=>{if(a.value===false)delete a.value;else a.value=false;back();},'value']);}
  if(a.type==='ai'){rows.push(['部隊',a.groupId?groupName(view,a.groupId):'未設定',()=>pick('敵部隊',squadChoices(view,g=>view.enemies.includes(g)),a.groupId,k=>{a.groupId=k;back();},back),'group']);rows.push(['新しいAI',AI[a.pattern]||'そのまま',()=>{const ks=Object.keys(AI);a.pattern=ks[(ks.indexOf(a.pattern)+1)%ks.length];back();},'pattern']);rows.push(['狙う相手',a.target?TARGET[a.target]:'そのまま',()=>{const ks=[undefined,...Object.keys(TARGET)];const n=ks[(ks.indexOf(a.target)+1)%ks.length];if(n)a.target=n;else delete a.target;back();},'target']);}
  rowsWin(ACTS[a.type],'',rows,common);};
 const line=(i,j,n)=>{const l=list[i].actions[j].lines[n];win('セリフ'+(n+1),'話し手は空欄でもかまいません。',body=>{const a=el('input');a.id='inputSpeaker';a.placeholder='話し手';a.value=l.speaker||'';a.maxLength=20;const t=el('textarea');t.id='inputValue';t.rows=4;t.maxLength=200;t.value=l.text||'';body.append(a,t);},
  [['決定',()=>{l.speaker=$('inputSpeaker').value.trim();l.text=$('inputValue').value.trim();act(i,j);}],['このセリフを削除',()=>{list[i].actions[j].lines.splice(n,1);act(i,j);}],['戻る',()=>act(i,j)]]);};
 const option=(i,j,n)=>{const o=list[i].actions[j].options[n];win('選択肢'+(n+1),'',body=>{const a=el('input');a.id='inputValue';a.placeholder='表示する文';a.value=o.label||'';a.maxLength=30;const f=el('input');f.id='inputFlag';f.placeholder='立てるフラグ名';f.value=o.flag||'';f.maxLength=20;body.append(a,f);},
  [['決定',()=>{o.label=$('inputValue').value.trim()||o.label;o.flag=$('inputFlag').value.trim();act(i,j);}],['この選択肢を削除',()=>{list[i].actions[j].options.splice(n,1);act(i,j);}],['戻る',()=>act(i,j)]]);};
 top();}

/* ---------- in-mission objectives ---------- */
function rewardText(r){return [r?.credits?r.credits.toLocaleString()+' Cr':'',r?.exp?r.exp+' EXP':'',...Object.entries(r?.items||{}).map(([k,n])=>(find('items',k)?.name||'⚠'+k)+'×'+n)].filter(Boolean).join('・')||'なし';}
function objectivesWindow(m){const list=clone(m.objectives||[]),view={...m,objectives:list};const save=()=>{commit(o=>{o.objectives=list;});closeWin();};
 const top=()=>rowsWin('作戦内ミッション','作戦に勝つと、達成したミッションの報酬がリザルトで上乗せされます。失敗条件を満たすか制限ターンを過ぎると失敗です。「イベントで発生」は、イベントの「作戦内ミッションを発生」で現れます（それまでは一覧に出ません）。成功・失敗はイベントのきっかけにできます。',list.map((o,i)=>[(i+1)+'. '+o.name+(o.appear==='event'?'（イベントで発生）':''),ctext(view,o.success)+(o.limit?' ／ '+o.limit+'ターン以内':'')+' ／ '+rewardText(o.reward),()=>one(i),'objective'+i]),
  [['＋ ミッションを追加',()=>{if(list.length>=8)return;const ids=new Set(list.map(o=>o.id));let k=1;while(ids.has('ob-'+k))k++;list.push({id:'ob-'+k,name:'ミッション'+k,success:{type:'no_loss'},reward:{credits:500}});one(list.length-1);}],['決定',save],['戻る',closeWin]]);
 const one=i=>{const o=list[i],r=o.reward=o.reward||{},back=()=>one(i);rowsWin(o.name,'',[['名前',o.name,()=>textPrompt('ミッション名',o.name,v=>{if(v)o.name=v;back();},back,24),'name'],['成功条件',ctext(view,o.success),()=>condWindow(view,'成功条件',OBJ_OK,o.success,back,back),'success'],
   ['失敗条件',o.fail?ctext(view,o.fail):'なし',()=>{const c=o.fail?clone(o.fail):{type:'none'};condWindow(view,'失敗条件',OBJ_NG,c,()=>{if(c.type==='none')delete o.fail;else o.fail=c;back();},back);},'fail'],
   ['発生',o.appear==='event'?'イベントで発生':'最初から',()=>{if(o.appear==='event')delete o.appear;else o.appear='event';back();},'appear'],['制限ターン（発生から）',o.limit?o.limit+'ターン以内':'なし',()=>numberPrompt('制限ターン（発生したターンから数える）',o.limit,1,99,v=>{if(v)o.limit=v;else delete o.limit;back();},back),'limit'],
   ['報酬：資金（Cr）',String(r.credits||0),()=>numberPrompt('資金',r.credits||0,0,9999999,v=>{r.credits=v||0;back();},back),'credits'],['報酬：経験値',String(r.exp||0),()=>numberPrompt('経験値',r.exp||0,0,99999,v=>{r.exp=v||0;back();},back),'exp'],
   ['報酬：アイテム',rewardText({items:r.items}),()=>pick('アイテム（もう一度選ぶと外す）',Object.fromEntries(data().items.map(x=>[x.id,x.name+(r.items?.[x.id]?' ×'+r.items[x.id]:'')])),null,k=>{if(r.items?.[k]){delete r.items[k];back();return;}numberPrompt('個数',1,1,99,v=>{if(v){r.items={...(r.items||{}),[k]:v};}back();},back);},back),'items']],
  [['このミッションを削除',()=>{list.splice(i,1);top();}],['一覧へ戻る',top]]);};
 top();}

/* ---------- test play ---------- */
function trial(m){const iss=checks(m);if(iss.length){message('試しプレイできません',iss);return;}try{localStorage.setItem('PRO_TACTICAL_SOURCE','maker');}catch(e){}X.save();location.href='tactical_hub.html?trial='+encodeURIComponent(m.id)+'#missions';}

/* ---------- checks ---------- */
function checks(m){const out=[],w=m.map?.width,h=m.map?.height;if(!(w>=MAP_MIN&&w<=MAP_MAX&&h>=MAP_MIN&&h<=MAP_MAX))out.push('マップの広さは'+MAP_MIN+'〜'+MAP_MAX+'マスです');
 if(!Array.isArray(m.map?.grid)||m.map.grid.length!==h||m.map.grid.some(r=>!Array.isArray(r)||r.length!==w))out.push('マップの大きさとマスの数が合いません');else{const bad=new Set();for(const r of m.map.grid)for(const k of r)if(!terrainOf(k))bad.add(k);if(bad.size)out.push('使えない地形：'+[...bad].join('・'));}
 const inside=p=>p&&p.x>=0&&p.y>=0&&p.x<w&&p.y<h,key=p=>p.x+','+p.y;if(!(m.playerStarts||[]).length)out.push('味方の初期位置がありません');if((m.playerStarts||[]).some(p=>!inside(p)))out.push('マップの外に味方の初期位置があります');
 const taken=new Set((m.playerStarts||[]).map(key));for(const g of squadsOf(m)){if(!g.members.length)out.push(g.name+'：ユニットがいません');if(g.members.length>8)out.push(g.name+'：8体までです');const sz=g.members.reduce((n,e)=>n+(SIZES[find('units',e.unit)?.size]||1),0);if(sz>8)out.push(g.name+'：総サイズ'+sz+'（8まで）');
  for(const e of g.members)if(!find('units',e.unit))out.push(g.name+'：ユニット「'+e.unit+'」が見つかりません');if(!inside(g.position))out.push(g.name+'：位置が未設定かマップの外です');else if(!g.reinforce){if(taken.has(key(g.position)))out.push(g.name+'：ほかの部隊・初期位置と重なっています');taken.add(key(g.position));}}
 const v=m.victory||{};if(v.type==='boss'&&!(m.enemies||[]).some(g=>g.id===v.groupId))out.push('勝利条件：撃破する敵部隊を選んでください');if(v.type==='reach'&&!inside(v))out.push('勝利条件：到達するマスがマップの外です');if(v.type==='defend'&&!(v.turns>=1))out.push('勝利条件：防衛するターン数を入れてください');
 if(v.type==='flag'&&!v.flag)out.push('勝利条件：フラグ名を入れてください');
 if((v.type||'enemy_wipe')==='enemy_wipe'&&!(m.enemies||[]).length)out.push('敵部隊がいません');
 const f=m.defeat||{};if(f.type==='turn_limit'&&!(f.turns>=1))out.push('敗北条件：ターン数を入れてください');if(f.type==='unit_down'&&!find('units',f.unitId))out.push('敗北条件：ユニットを選んでください');
 if(['squad_down','enemy_reach','flag'].includes(f.type)){const e=condIssue(m,f,'敗北条件');if(e)out.push(e);}
 const ids=new Set(squadsOf(m).map(g=>g.id));if(ids.size!==squadsOf(m).length)out.push('部隊のIDが重なっています');
 for(const e of m.events||[]){const w='イベント「'+e.name+'」';const t=condIssue(m,e.trigger,w+'のきっかけ');if(t)out.push(t);if(!(e.actions||[]).length)out.push(w+'：起こすことがありません');
  for(const a of e.actions||[]){if(a.type==='talk'&&!(a.lines||[]).some(l=>l.text))out.push(w+'：会話のセリフがありません');if(a.type==='choice'&&(!(a.options||[]).length||a.options.some(o=>!o.flag)))out.push(w+'：選択肢と立てるフラグを入れてください');if(a.type==='flag'&&!a.flag)out.push(w+'：フラグ名を入れてください');
   if(a.type==='spawn'&&!squadsOf(m).some(g=>g.id===a.groupId&&g.reinforce))out.push(w+'：増援に出す部隊（「増援」にした部隊）を選んでください');if(a.type==='withdraw'&&!ids.has(a.groupId))out.push(w+'：撤退する部隊を選んでください');
   if(a.type==='terrain'&&(!terrainOf(a.key)||!inside(a)))out.push(w+'：地形の変更が正しくありません');if(a.type==='victory'||a.type==='defeat'){const c=condIssue(m,a.cond,w+'の'+(a.type==='victory'?'勝利':'敗北')+'条件');if(c)out.push(c);}if(a.type==='objective'&&!(m.objectives||[]).some(o=>o.id===a.id))out.push(w+'：作戦内ミッションを選んでください');if(a.type==='game_flag'&&!find('flags',a.flagId))out.push(w+'：ゲームのフラグを選んでください');if(a.type==='ai'&&!(m.enemies||[]).some(g=>g.id===a.groupId))out.push(w+'：AIを変える敵部隊を選んでください');}}
 for(const o of m.objectives||[]){if(o.appear==='event'&&!(m.events||[]).some(e=>(e.actions||[]).some(a=>a.type==='objective'&&a.id===o.id&&a.result==='start')))out.push('ミッション「'+o.name+'」：発生させるイベントがありません');const s=condIssue(m,o.success,'ミッション「'+o.name+'」の成功条件');if(s)out.push(s);if(o.fail){const f2=condIssue(m,o.fail,'ミッション「'+o.name+'」の失敗条件');if(f2)out.push(f2);}}
 return out;}

X.registerKind('tmissions',{label:'タクティカル作戦',en:'TACTICAL MISSIONS',prefix:'tm'},blankMission,[
 {key:'name',label:'作戦名',type:'text',group:'基本'},{key:'id',label:'ID',type:'id',group:'基本'},{key:'desc',label:'説明',type:'text',group:'基本'},{key:'code',label:'作戦コード（例：OP-03）',type:'text',max:12,group:'基本'},
 {key:'kind',label:'種別',type:'select',choices:{training:'訓練',combat:'実戦'},group:'基本'},{key:'surface',label:'基準の領域',type:'select',choices:{ground:'地上',water:'水上',space:'宇宙'},group:'基本'},{key:'color',label:'一覧の色',type:'color',group:'基本'},
 {key:'map',label:'マップ（地形・初期位置・敵の位置）',type:'tmap',group:'マップと配置'},{key:'enemies',label:'敵部隊',type:'tenemies',group:'マップと配置'},{key:'allies',label:'味方部隊（ゲスト・増援）',type:'tallies',group:'マップと配置'},
 {key:'victory.type',label:'勝利条件',type:'select',choices:VICTORY,group:'勝敗条件'},{key:'victory.groupId',label:'撃破する敵部隊',type:'select',choices:m=>Object.fromEntries((m.enemies||[]).map(g=>[g.id,g.name])),group:'勝敗条件',show:m=>m.victory?.type==='boss'},
 {key:'victory.x',label:'到達するマス：横（左端が0）',type:'number',min:0,max:MAP_MAX-1,group:'勝敗条件',show:m=>m.victory?.type==='reach'},{key:'victory.y',label:'到達するマス：縦（上端が0）',type:'number',min:0,max:MAP_MAX-1,group:'勝敗条件',show:m=>m.victory?.type==='reach'},
 {key:'victory.turns',label:'防衛するターン数',type:'number',min:1,max:99,group:'勝敗条件',show:m=>m.victory?.type==='defend'},
 {key:'defeat.type',label:'敗北条件',type:'select',choices:DEFEAT,group:'勝敗条件'},{key:'defeat.turns',label:'このターンを過ぎたら敗北',type:'number',min:1,max:99,group:'勝敗条件',show:m=>m.defeat?.type==='turn_limit'},
 {key:'defeat.unitId',label:'撃破されたら敗北するユニット',type:'select',choices:()=>Object.fromEntries(data().units.map(u=>[u.id,u.name])),group:'勝敗条件',show:m=>m.defeat?.type==='unit_down'},
 {key:'victory.flag',label:'勝利するフラグ名',type:'text',max:20,group:'勝敗条件',show:m=>m.victory?.type==='flag'},{key:'defeat.groupId',label:'撃破されたら敗北する部隊',type:'select',choices:m=>squadChoices(m),group:'勝敗条件',show:m=>m.defeat?.type==='squad_down'},
 {key:'defeat.x',label:'敵が到達したら敗北するマス：横',type:'number',min:0,max:MAP_MAX-1,group:'勝敗条件',show:m=>m.defeat?.type==='enemy_reach'},{key:'defeat.y',label:'敵が到達したら敗北するマス：縦',type:'number',min:0,max:MAP_MAX-1,group:'勝敗条件',show:m=>m.defeat?.type==='enemy_reach'},
 {key:'defeat.flag',label:'敗北するフラグ名',type:'text',max:20,group:'勝敗条件',show:m=>m.defeat?.type==='flag'},
 {key:'events',label:'イベント（会話・増援・撤退・条件変更など）',type:'tevents',group:'イベント'},{key:'objectives',label:'作戦内ミッション（追加報酬）',type:'tobjectives',group:'イベント'},
 {key:'result.credits',label:'報酬：資金（Cr）',type:'number',min:0,group:'報酬'},{key:'result.exp',label:'報酬：経験値',type:'number',min:0,group:'報酬'},{key:'result.items',label:'報酬：アイテム',type:'itemCounts',group:'報酬'},
 {key:'requires.missions',label:'先にクリアするタクティカル作戦',type:'refs',ref:'tmissions',group:'解放条件'},{key:'conds',label:'追加の解放条件（ゲームの条件セット）',type:'conds',group:'解放条件'},{key:'hidden',label:'解放されるまで一覧に出さない',type:'toggle',group:'解放条件'},
 {key:'resultFlags.win',label:'勝利で立てるゲームのフラグ',type:'flagmap',group:'フラグ'},{key:'resultFlags.lose',label:'敗北で立てるゲームのフラグ',type:'flagmap',group:'フラグ'},
 {key:'trial',label:'試しプレイ（タクティカルの画面で開く）',type:'ttrial',group:'試し'}],
 {display:{tmap:(v,m)=>m.map?m.map.width+'×'+m.map.height+' ・ 味方'+(m.playerStarts||[]).length+'か所 ・ 敵'+(m.enemies||[]).filter(g=>g.position).length+'部隊':'未設定',tenemies:v=>(v||[]).length?v.map(g=>g.name+'（'+g.members.length+'体'+(g.reinforce?'・増援':'')+'）').join('・'):'なし',tallies:v=>(v||[]).length?v.map(g=>g.name+'（'+g.members.length+'体'+(g.reinforce?'・増援':'')+'）').join('・'):'なし',tevents:v=>(v||[]).length+'件',tobjectives:v=>(v||[]).length?v.map(o=>o.name).join('・'):'なし',ttrial:()=>'開く →'},
  edit:{tmap:(f,m)=>mapWindow(m),tenemies:(f,m)=>enemiesWindow(m),tallies:(f,m)=>enemiesWindow(m,'allies'),tevents:(f,m)=>eventsWindow(m),tobjectives:(f,m)=>objectivesWindow(m),ttrial:(f,m)=>trial(m)},
  issues:checks,
  refs:m=>[...squadsOf(m).flatMap(g=>g.members.map(e=>['units',e.unit])),...['win','lose'].flatMap(r=>Object.keys(m.resultFlags?.[r]||{}).map(id=>['flags',id])),...allConds(m).filter(c=>c.flagId).map(c=>['flags',c.flagId]),...(m.events||[]).flatMap(e=>(e.actions||[]).filter(a=>a.type==='game_flag'&&a.flagId).map(a=>['flags',a.flagId])),...allConds(m).filter(c=>c.unitId).map(c=>['units',c.unitId]),...Object.keys(m.result?.items||{}).map(id=>['items',id]),...(m.objectives||[]).flatMap(o=>Object.keys(o.reward?.items||{}).map(id=>['items',id])),...(m.events||[]).flatMap(e=>(e.actions||[]).filter(a=>a.type==='terrain'&&a.key&&!BUILTIN[a.key]).map(a=>['terrains',a.key])),...(m.requires?.missions||[]).map(id=>['tmissions',id]),...[...new Set((m.map?.grid||[]).flat())].filter(k=>!BUILTIN[k]).map(id=>['terrains',id])],
  // Link maintenance: renamed IDs follow; deleted units leave squads, deleted terrains become plain ground.
  mapRefs:(k,fn)=>{for(const m of data().tmissions){if(k==='units'){for(const g of squadsOf(m))g.members=g.members.filter(e=>{const n=fn(e.unit);if(n)e.unit=n;return !!n;});for(const c of allConds(m))if(c.unitId){const n=fn(c.unitId);if(n)c.unitId=n;else delete c.unitId;}}
   if(k==='terrains')for(const e of m.events||[])for(const a of e.actions||[])if(a.type==='terrain'&&a.key&&!BUILTIN[a.key])a.key=fn(a.key)||SURFACE_FILL[m.surface]||'p';
   if(k==='items')for(const o of m.objectives||[])if(o.reward?.items)for(const id of Object.keys(o.reward.items)){const n=fn(id);if(n!==id){const v=o.reward.items[id];delete o.reward.items[id];if(n)o.reward.items[n]=v;}}
   if(k==='terrains'&&m.map?.grid)m.map.grid=m.map.grid.map(r=>r.map(key=>BUILTIN[key]?key:(fn(key)||SURFACE_FILL[m.surface]||'p')));
   if(k==='items'&&m.result?.items)for(const id of Object.keys(m.result.items)){const n=fn(id);if(n!==id){const v=m.result.items[id];delete m.result.items[id];if(n)m.result.items[n]=v;}}
   if(k==='flags'){const re=o=>{if(!o)return o;const out={};for(const [id,v] of Object.entries(o)){const n=fn(id);if(n)out[n]=v;}return out;};if(m.resultFlags)for(const r of ['win','lose'])if(m.resultFlags[r])m.resultFlags[r]=re(m.resultFlags[r]);for(const c of allConds(m))if(c.flagId){const n=fn(c.flagId);if(n)c.flagId=n;else delete c.flagId;}for(const e of m.events||[])for(const a of e.actions||[])if(a.type==='game_flag'&&a.flagId){const n=fn(a.flagId);if(n)a.flagId=n;else delete a.flagId;}}
   if(k==='tmissions'&&m.requires?.missions)m.requires.missions=m.requires.missions.map(fn).filter(Boolean);}}});
window.PROMakerTactical=Object.freeze({checks,palette,victoryText,defeatText,ctext});
})();
