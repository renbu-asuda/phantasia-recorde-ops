/* PRO 1.15 UI helpers shared by the game and integrated maker. */
(function(root){'use strict';
const C=root.PROCore,F=root.PROFeatures;
const el=(tag,text)=>{const e=document.createElement(tag);if(text!==undefined)e.textContent=text;return e;};
const button=(text,fn)=>{const e=el('button',text);e.type='button';e.className='flow-btn secondary';e.onclick=fn;return e;};
function section(parent,title){const e=el('section');e.className='flow-section growth-section';e.append(el('h3',title));parent.append(e);return e;}
function input(parent,label,value,change,type='text'){const l=el('label',label),i=el('input');i.type=type;i.value=value??'';i.onchange=()=>change(type==='number'?Number(i.value):i.value);l.append(i);parent.append(l);return i;}
function select(parent,label,values,value,change){const l=el('label',label),s=el('select');for(const [v,t] of Object.entries(values)){const o=el('option',t);o.value=v;s.append(o);}s.value=value;s.onchange=()=>change(s.value);l.append(s);parent.append(l);return s;}
function conditionEditor(parent,obj,key,changed){
 const host=section(parent,'発動条件（複数可）');
 const draw=()=>{host.replaceChildren(el('h3','発動条件（複数可）'));const c=obj[key],mode=c?.all?'all':c?.any?'any':c?'single':'none';
  select(host,'条件の組合せ',{none:'条件なし',single:'一つの条件',all:'すべて満たす',any:'どれかを満たす'},mode,v=>{const old=c?.all||c?.any||(c?[c]:[{type:'hp_below',value:50}]);if(v==='none')delete obj[key];else obj[key]=v==='single'?old[0]:{[v]:old};changed();draw();});
  if(!c)return;const list=c.all||c.any||[c];list.forEach((x,i)=>{const row=el('div');row.className='pro-list-item';if(x.all||x.any){row.append(el('p',C.conditionText(x)));row.append(button('この入れ子を一つの条件へ変更',()=>{list[i]={type:'hp_below',value:50};changed();draw();}));}else{
   select(row,'条件',C.conditions,x.type,v=>{x.type=v;if(v==='target_tag'){x.tag||='装甲車';delete x.value;}else{x.value??=50;delete x.tag;}changed();draw();});
   if(x.type==='target_tag')input(row,'タグ',x.tag,v=>{x.tag=v;changed();});else input(row,'値',x.value,v=>{x.value=v;changed();},'number');
  }if(mode!=='single')row.append(button('削除',()=>{list.splice(i,1);if(!list.length)delete obj[key];changed();draw();}));host.append(row);});
  if(mode==='all'||mode==='any'){const b=button('＋ 条件',()=>{list.push({type:'turn_ge',value:3});changed();draw();});b.disabled=list.length>=8;host.append(b);}
 };draw();
}
function flagsEditor(parent,obj,key,changed){const host=section(parent,'分岐フラグ');const draw=()=>{host.replaceChildren(el('h3','分岐フラグ'));for(const [id,v] of Object.entries(obj[key]||{})){const row=el('div');row.className='pro-row';row.append(el('span',id));select(row,'値',{true:'成立',false:'不成立'},String(v),x=>{obj[key][id]=x==='true';changed();});row.append(button('削除',()=>{delete obj[key][id];if(!Object.keys(obj[key]).length)delete obj[key];changed();draw();}));host.append(row);}const row=el('div');let name='';input(row,'新しいフラグID',name,v=>name=v);row.append(button('＋ フラグ',()=>{if(!C.safeId(name)){alert('英数字・_・-のIDを入力してください');return;}obj[key]||={};obj[key][name]=true;changed();draw();}));host.append(row);};draw();}
const conditionField={key:'cond',label:'発動条件',type:'condition'};
function phaseFields(){return [
 {key:'id',label:'段階ID',keep:true},{key:'name',label:'段階名',keep:true},conditionField,
 {key:'stats',label:'変化後の能力（空欄は現在の値を維持）',type:'statmap',keepZero:true},
 {key:'hpMode',label:'HPの引継ぎ',type:'select',choices:{ratio:'割合を維持',keep:'現在値を維持',value:'指定値'},rerender:true},
 {key:'hpValue',label:'変化後のHP',type:'number',min:1,keep:true,show:o=>o.hpMode==='value'},
 {key:'weaponIds',label:'変化後の共有武装（未指定は維持）',type:'ref',ref:'weapons',multi:true},
 {key:'skillIds',label:'変化後の共有スキル（未指定は維持、全解除はスキルなし）',type:'ref',ref:'skills',multi:true,keepEmptyArray:true},
 {key:'ai',label:'変化後の狙い方（任意）',type:'object',emptyWhen:o=>!o.target,fields:[{key:'target',label:'狙う相手',type:'select',choices:C.aiTargets,empty:'現在の方針を維持',rerender:true},{key:'tag',label:'優先タグ',show:o=>o.target==='tag'}]},
 {key:'lines',label:'変化時の会話（話者: 本文）',type:'lines'}
 ];}
function eventFields(){return [
 {key:'id',label:'イベントID',keep:true},{key:'when',label:'いつ発生？',type:'select',choices:{turn:'TURN到達',wave:'第n波登場',boss_hp:'ボスHPが%以下',unit_down:'指定ユニット撃破'},rerender:true},
 {key:'value',label:'TURN / 波番号 / HP%',type:'number',min:0,max:300,keep:true,show:o=>o.when!=='unit_down'},
 {key:'unitId',label:'撃破を検知するユニット',type:'ref',ref:'units',show:o=>o.when==='unit_down'},
 {key:'requiredUnitId',label:'このユニットが出撃している場合だけ（任意）',type:'ref',ref:'units'},
 {key:'lines',label:'会話（話者: 本文）',type:'lines'},
 {key:'terrain',label:'変更先の地形名（空欄は維持）'},
 {key:'flags',label:'成立させるフラグ',type:'flags'}
 ];}
function graphPanel(parent,pack,status){const box=section(parent,'解放条件・入手経路の関係図');const g=F.graph(pack),names=new Map(g.nodes.map(n=>[n.key,n.name]));
 const filters=el('select');filters.append(el('option','すべて'));filters.options[0].value='';for(const n of g.nodes){const o=el('option',n.kind+' / '+n.name);o.value=n.key;filters.append(o);}box.append(filters);const list=el('div');box.append(list);
 const draw=()=>{list.replaceChildren();const edges=g.edges.filter(e=>!filters.value||e.from===filters.value||e.to===filters.value);if(!edges.length)list.append(el('p','接続された条件はありません'));for(const e of edges){const row=el('div');row.className='record-row';row.append(el('span',names.get(e.from)||e.from),el('b',' → '+e.why+' → '),el('span',names.get(e.to)||e.to));list.append(row);}if(status)for(const n of g.nodes.filter(n=>!filters.value||n.key===filters.value))list.append(el('p',n.name+': '+status(n)));};filters.onchange=draw;draw();
 if(g.warnings.length){const d=el('details');d.append(el('summary','条件の点検（'+g.warnings.length+'件）'));for(const w of g.warnings)d.append(el('p',w));box.append(d);}return box;
}
function usagePanel(parent,pack,kind,id,open,changed){if(!['skills','weapons'].includes(kind))return;const box=section(parent,'共有データの使用先・変更影響');const rows=F.usage(pack,kind,id);box.append(el('p',rows.length+'箇所で参照。ここでの変更は全使用先に反映されます。'));
 const before=parent._proUsageBaseline||C.clone(pack);const view=el('pre');box.append(button('編集開始時との性能差を確認',()=>{view.textContent=F.diffText(before,pack);}),view);
 for(const r of rows){const row=el('div');row.className='pro-row';row.append(button(r.name+' / '+r.path,()=>open(r.kind,r.id)),button('複製してこのデータだけ変更',()=>{const owner=(pack[r.kind]||[]).find(x=>x.id===r.id),src=(pack[kind]||[]).find(x=>x.id===id);let newId=id+'_custom',i=2;while(pack[kind].some(x=>x.id===newId))newId=id+'_custom_'+i++;const copy=C.clone(src);copy.id=newId;copy.name+=' 専用';pack[kind].push(copy);F.replaceRef(pack,kind,id,newId,owner);changed();open(kind,newId);}));box.append(row);}
}
function maker(api){
 const baselines=new Map();let lastPack=api.get();const h=F.history(api.get()),toolbar=section(document.getElementById('overview'),'編集履歴・パック情報');
 const undo=button('元に戻す',()=>restore(h.undo())),redo=button('やり直す',()=>restore(h.redo()));toolbar.append(undo,redo);
 const checkpointKey='pro_maker_checkpoints_v1';let points=[];try{points=JSON.parse(localStorage.getItem(checkpointKey)||'[]');if(!Array.isArray(points))points=[];}catch(e){}
 const saved=el('select');const fill=()=>{saved.replaceChildren();for(const [i,x] of points.entries()){const o=el('option',x.name+' / '+x.at);o.value=i;saved.append(o);}};fill();toolbar.append(saved);
 toolbar.append(button('名前を付けて編集時点を保存',()=>{const name=prompt('保存名');if(!name)return;const next=[{name:name.slice(0,80),at:new Date().toLocaleString(),pack:C.clone(api.get())},...points].slice(0,3);try{localStorage.setItem(checkpointKey,JSON.stringify(next));points=next;fill();}catch(e){alert('保存容量不足。JSを書き出して保存してください。');}}),button('保存した編集時点を復元',()=>{if(!points[Number(saved.value)]||!confirm('選択した編集時点へ戻しますか？'))return;h.boundary();api.set(C.clone(points[Number(saved.value)].pack));api.refresh();capture();}));
 const metadata=el('div');toolbar.append(metadata);const meta=()=>{metadata.replaceChildren();for(const [k,label] of [['author','作者'],['packVersion','パック版番号']])input(metadata,label,api.get()[k],v=>{api.get()[k]=v;api.save();});input(metadata,'必要な他パックID（カンマ区切り）',(api.get().dependencies||[]).join(','),v=>{api.get().dependencies=v.split(',').map(x=>x.trim()).filter(Boolean);api.save();});};meta();
 const graphBox=el('div');toolbar.append(button('関係図と到達条件を確認',()=>{graphBox.replaceChildren();graphPanel(graphBox,api.get());}),graphBox);
 function capture(){if(lastPack!==api.get()){lastPack=api.get();meta();}h.record(api.get());undo.disabled=!h.canUndo;redo.disabled=!h.canRedo;}
 function restore(p){if(!p)return;api.set(p);api.refresh();api.persist();meta();undo.disabled=!h.canUndo;redo.disabled=!h.canRedo;}
 capture();return {capture,editor(parent,kind,obj,opts){const key=kind+':'+obj.id;if(!baselines.has(key))baselines.set(key,C.clone(api.get()));parent._proUsageBaseline=baselines.get(key);usagePanel(parent,api.get(),kind,obj.id,api.open,api.save);},list(parent,kind){
  if(!['units','missions','items'].includes(kind))return;const box=section(parent,'選択して一括編集'),chosen=new Set();
  for(const x of api.get()[kind]||[]){const l=el('label',x.name),c=el('input');c.type='checkbox';c.onchange=()=>c.checked?chosen.add(x.id):chosen.delete(x.id);l.prepend(c);box.append(l);}
  let op='tag',value='';select(box,'変更する項目',kind==='units'?{tag:'タグ追加',hp:'HP倍率%',atk:'ATK倍率%',def:'DEF倍率%',mob:'MOB倍率%',acc:'ACC倍率%'}:{tag:'タグ追加'},op,v=>op=v);input(box,'追加タグ / 倍率%',value,v=>value=v);
  box.append(button('変更内容を確認して適用',()=>{try{const next=F.bulk(api.get(),kind,[...chosen],op,value);if(!confirm(chosen.size+'件を変更します。\n'+F.diffText(api.get(),next)))return;h.boundary();api.set(next);api.save();api.refresh();}catch(e){alert(e.message);}}));
 }};
}
function replayViewer(parent,record){
 const box=section(parent,record.missionName+' / '+record.outcome+' / '+record.turns+'TURN');const frames=record.timeline||[];let at=0,timer=null;
 const controls=el('div'),scene=el('div'),text=el('pre'),slider=el('input');slider.type='range';slider.min=0;slider.max=Math.max(0,frames.length-1);slider.value=0;
 const draw=()=>{const f=frames[at];if(!f){text.textContent='記録がありません';return;}slider.value=at;scene.replaceChildren(el('h4','TURN '+f.turn+' / '+(at+1)+'件目'));for(const u of f.units||[]){const row=el('div',`${u.side==='ally'?'味方':'敵'} ${u.name} / HP ${u.hp} / ${u.maxHp}${u.alive?'':' / 撃破'}`);scene.append(row);}text.textContent=f.text;};
 const stop=()=>{if(timer)clearInterval(timer);timer=null;};slider.oninput=()=>{stop();at=Number(slider.value);draw();};
 controls.append(button('前へ',()=>{stop();at=Math.max(0,at-1);draw();}),button('再生',()=>{stop();timer=setInterval(()=>{if(!box.isConnected||at>=frames.length-1){stop();return;}at++;draw();},400);}),button('停止',stop),button('次へ',()=>{stop();at=Math.min(frames.length-1,at+1);draw();}));
 const jump=el('select');for(const [i,f] of frames.entries())if(['turnStart','phase','event','result'].includes(f.type)||/撃破/.test(f.text)){const o=el('option','TURN '+f.turn+' / '+f.text.slice(0,60));o.value=i;jump.append(o);}jump.onchange=()=>{stop();at=Number(jump.value);draw();};controls.append(jump);
 box.append(controls,slider,scene,text);if(record.truncated)box.append(el('p','容量上限により記録を一部省略しています。'));draw();return stop;
}
root.PROFeaturesUI=Object.freeze({version:'1.0.0',el,button,section,input,select,conditionEditor,flagsEditor,phaseFields,eventFields,graphPanel,maker,replayViewer});
})(window);
