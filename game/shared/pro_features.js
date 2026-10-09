/* PRO 1.15 authoring, dependency and history helpers. No network and no eval. */
(function(root){'use strict';
const C=root.PROCore,clone=C.clone;
const KINDS=['units','missions','items','research','hires','weapons','skills'];
function usage(pack,kind,id){
 const key=kind==='skills'?'skillId':'weaponId',listKey=key+'s',out=[];
 const walk=(x,path,owner)=>{if(!x||typeof x!=='object')return;
  if(x[key]===id||Array.isArray(x[listKey])&&x[listKey].includes(id))out.push({kind:owner.kind,id:owner.id,name:owner.name,path});
  for(const [k,v] of Object.entries(x))if(v&&typeof v==='object')walk(v,path+'/'+k,owner);
 };
 for(const k of KINDS)for(const x of pack[k]||[])if(k!==kind)walk(x,k+'/'+x.id,{kind:k,id:x.id,name:x.name||x.id});return out;
}
function replaceRef(pack,kind,from,to,owner){
 const key=kind==='skills'?'skillId':'weaponId',listKey=key+'s';
 const walk=x=>{if(!x||typeof x!=='object')return;if(x[key]===from)x[key]=to;if(Array.isArray(x[listKey]))x[listKey]=x[listKey].map(v=>v===from?to:v);for(const v of Object.values(x))if(v&&typeof v==='object')walk(v);};
 if(owner)walk(owner);else for(const k of KINDS)if(k!==kind)for(const x of pack[k]||[])walk(x);
}
function diff(before,after){
 const out=[];
 for(const k of KINDS){const a=new Map((before?.[k]||[]).map(x=>[x.id,x])),b=new Map((after?.[k]||[]).map(x=>[x.id,x]));
  for(const [id,x] of b){const old=a.get(id);if(!old)out.push({kind:k,id,name:x.name||id,type:'add',fields:[]});else if(JSON.stringify(old)!==JSON.stringify(x)){const fields=[...new Set([...Object.keys(old),...Object.keys(x)])].filter(f=>JSON.stringify(old[f])!==JSON.stringify(x[f])).map(f=>({key:f,before:old[f],after:x[f]}));out.push({kind:k,id,name:x.name||id,type:'change',fields});}}
  for(const [id,x] of a)if(!b.has(id))out.push({kind:k,id,name:x.name||id,type:'remove',fields:[]});
 }return out;
}
function diffText(before,after){const rows=diff(before,after);return rows.length?rows.map(x=>`${{add:'追加',change:'変更',remove:'削除'}[x.type]} ${x.kind} / ${x.name}${x.fields.length?'\n'+x.fields.map(f=>'  '+f.key+': '+JSON.stringify(f.before)+' → '+JSON.stringify(f.after)).join('\n'):''}`).join('\n'):'変更なし';}
function history(initial,max=40){let rows=[JSON.stringify(initial)],at=0,lastTime=0;return {
 record(value){const next=JSON.stringify(value);if(rows[at]===next)return;const now=Date.now();rows=rows.slice(0,at+1);if(now-lastTime<600&&at>0)rows[at]=next;else{rows.push(next);if(rows.length>max)rows.shift();at=rows.length-1;}lastTime=now;},
 undo(){if(at===0)return null;lastTime=0;return JSON.parse(rows[--at]);},redo(){if(at>=rows.length-1)return null;lastTime=0;return JSON.parse(rows[++at]);},
 get canUndo(){return at>0;},get canRedo(){return at<rows.length-1;},boundary(){lastTime=0;}
 };}
function bulk(pack,kind,ids,operation,value){
 const next=clone(pack),rows=(next[kind]||[]).filter(x=>ids.includes(x.id));if(!rows.length)throw Error('対象を選んでください');
 if(operation==='tag'){const tag=String(value).trim();C.tagList([tag]);for(const x of rows)x.tags=C.tagList([...new Set([...(x.tags||[]),tag])]);}
 else{if(kind!=='units'||!C.STAT_KEYS.includes(operation))throw Error('能力一括変更はユニットで使います');const rate=Number(value);if(!Number.isFinite(rate)||rate<0||rate>1000)throw Error('倍率は0～1000%です');for(const x of rows){const n=Math.round(Number(x[operation])*rate/100);if(!Number.isFinite(n)||n<(operation==='hp'?1:0)||n>1000000)throw Error(x.name+': 能力の範囲を超えます');x[operation]=n;}}
 return next;
}
function graph(pack){
 const nodes=[],edges=[];const add=(k,x)=>nodes.push({key:k+':'+x.id,kind:k,id:x.id,name:x.name||x.id});
 for(const k of ['missions','items','research','units','hires'])for(const x of pack[k]||[])add(k,x);
 const edge=(kind,id,to,why)=>edges.push({from:kind+':'+id,to,why});
 for(const m of pack.missions||[]){const to='missions:'+m.id;for(const id of m.requires?.missions||[])edge('missions',id,to,'クリア');for(const id of m.requires?.items||[])edge('items',id,to,'所持');for(const d of m.drops||[])if(C.dropChance(d)>0)edge('missions',m.id,'items:'+d.itemId,'ドロップ');}
 for(const r of pack.research||[]){const to='research:'+r.id;for(const id of r.requires||[])edge('research',id,to,'研究完了');for(const id of Object.keys(r.cost?.items||{}))edge('items',id,to,'素材');for(const id of r.unlock?.units||[])edge('research',r.id,'units:'+id,'加入');for(const id of [...(r.unlock?.items||[]),...Object.keys(r.unlock?.grantItems||{})])edge('research',r.id,'items:'+id,'解放/支給');}
 for(const u of pack.units||[])if(u.recruit?.missionId)edge('missions',u.recruit.missionId,'units:'+u.id,'加入');
 for(const h of pack.hires||[]){const to='hires:'+h.id;for(const k of ['missions','research','items'])for(const id of h.requires?.[k]||[])edge(k,id,to,'雇用条件');edge('hires',h.id,'units:'+h.unitId,'雇用');}
 for(const i of pack.items||[]){if(i.shop?.requiresMission)edge('missions',i.shop.requiresMission,'items:'+i.id,'販売解放');if(i.shop?.requiresResearch)edge('research',i.shop.requiresResearch,'items:'+i.id,'販売解放');}
 // Branch flags connect choices/events/results to the missions they unlock.
 const flagNodes=new Set();const flagKey=(id,value)=>'flags:'+id+'='+value;
 const flags=(values,from,to,why)=>{for(const [id,value] of Object.entries(values||{})){const key=flagKey(id,value);if(!flagNodes.has(key)){flagNodes.add(key);nodes.push({key,kind:'flags',id,name:id+'='+value});}if(from)edges.push({from,to:key,why});if(to)edges.push({from:key,to,why:'分岐条件'});}};
 for(const m of pack.missions||[]){const key='missions:'+m.id;flags(m.requires?.flags,null,key);for(const c of m.story?.choices||[])flags(c.flags,key,null,'選択');for(const e of m.events||[])flags(e.flags,key,null,'イベント');for(const [outcome,map] of Object.entries(m.resultFlags||{}))flags(map,key,null,{win:'勝利',lose:'敗北',draw:'引分'}[outcome]);}
 const keys=new Set(nodes.map(n=>n.key)),warnings=[];for(const e of edges)if(!keys.has(e.from)||!keys.has(e.to))warnings.push('外部参照: '+e.from+' → '+e.to);
 const visiting=new Set(),done=new Set(),cycles=new Set();const visit=(key,path=[])=>{if(visiting.has(key)){cycles.add([...path.slice(path.indexOf(key)),key].join(' → '));return;}if(done.has(key))return;visiting.add(key);for(const e of edges.filter(e=>e.from===key))visit(e.to,[...path,key]);visiting.delete(key);done.add(key);};for(const n of nodes)visit(n.key);
 for(const c of cycles)warnings.push('循環候補（別の入手経路があれば成立）: '+c);
 // Conservative reachability: external-pack paths and flags are unknown, never export blockers.
 const reached=new Set([...flagNodes].filter(k=>k.endsWith('=false')));for(const i of pack.items||[])if(i.initial||i.price>0&&!i.shop?.requiresMission&&!i.shop?.requiresResearch)reached.add('items:'+i.id);
 for(const u of pack.units||[])if(!u.recruit?.locked)reached.add('units:'+u.id);
 let changed=true;while(changed){changed=false;const mark=k=>{if(!reached.has(k)){reached.add(k);changed=true;}};
  for(const m of pack.missions||[])if((m.requires?.missions||[]).every(id=>reached.has('missions:'+id))&&(m.requires?.items||[]).every(id=>reached.has('items:'+id))&&Object.entries(m.requires?.flags||{}).every(([id,v])=>reached.has(flagKey(id,v))))mark('missions:'+m.id);
  for(const r of pack.research||[])if((r.requires||[]).every(id=>reached.has('research:'+id))&&Object.keys(r.cost?.items||{}).every(id=>reached.has('items:'+id)))mark('research:'+r.id);
  for(const e of edges)if(reached.has(e.from)&&['ドロップ','解放/支給','販売解放','加入','雇用','選択','イベント','勝利','敗北','引分'].includes(e.why))mark(e.to);
 }
 for(const n of nodes)if(['missions','research'].includes(n.kind)&&!reached.has(n.key))warnings.push('パック内だけでは到達未確認: '+n.name);
 return {nodes,edges,warnings:[...new Set(warnings)]};
}
function packAudit(incoming,loaded,state={}){
 const warnings=[];const ids=new Set(loaded.map(p=>p.packId));for(const id of incoming.dependencies||[])if(!ids.has(id)&&id!==incoming.packId)warnings.push('必要パック未読込: '+id);
 for(const p of loaded)if(p.packId!==incoming.packId)for(const k of KINDS){const own=new Set((incoming[k]||[]).map(x=>x.id));for(const x of p[k]||[])if(own.has(x.id))warnings.push(`${k} / ${x.name||x.id}: ${p.packName||p.packId} とID競合`);}
 const old=loaded.find(p=>p.packId===incoming.packId);if(old)for(const x of diff(old,incoming).filter(x=>x.type==='remove')){if(x.kind==='units'&&(state.roster||[]).some(r=>r.base===x.id)||x.kind==='items'&&(state.items?.[x.id]>0||Object.values(state.equip||{}).some(a=>a.includes(x.id))))warnings.push('使用中データの削除: '+x.kind+' / '+x.name);}
 return {warnings,diff:diffText(old||{},incoming)};
}
function materialSources(missions,itemId){return missions.flatMap(m=>(m.drops||[]).filter(d=>d.itemId===itemId).map(d=>({mission:m,chance:C.dropChance(d),expected:C.dropChance(d)*((d.min??1)+(d.max??1))/2})));}
root.PROFeatures=Object.freeze({version:'1.0.0',usage,replaceRef,diff,diffText,history,bulk,graph,packAudit,materialSources,KINDS});
})(window);
