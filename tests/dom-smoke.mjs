import fs from 'node:fs';import path from 'node:path';import assert from 'node:assert/strict';
const {Window}=await import(process.env.PRO_DOM_MODULE||'happy-dom');
async function load(file){const win=new Window({url:'http://localhost/'+file,settings:{enableJavaScriptEvaluation:true,disableJavaScriptFileLoading:true,disableCSSFileLoading:true,suppressInsecureJavaScriptEnvironmentWarning:true}});const alerts=[];win.confirm=()=>true;win.alert=t=>alerts.push(t);win.prompt=()=> '保存時点';win.scrollTo=()=>{};win.URL.createObjectURL=()=> 'blob:test';win.URL.revokeObjectURL=()=>{};
 const html=fs.readFileSync(file,'utf8');win.document.write(html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/g,''));
 for(const match of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/g)){const src=/src=["']([^"']+)["']/.exec(match[1]);const code=src?fs.readFileSync(path.resolve(path.dirname(file),src[1].split('?')[0]),'utf8'):match[2];try{win.eval(code);}catch(e){throw Error(file+' / '+(src?.[1]||'inline')+': '+e.stack);}}
 return {win,alerts};
}
for(const file of ['game/index.html','game/combined_maker.html','game/unit_maker.html','game/mission_maker.html','game/item_maker.html']){
 const {win,alerts}=await load(file);assert(!win.__PRO_BOOT_FAILED,file+' boot');assert(win.PROCore,file+' core');console.log('DOM loaded',file,win.document.querySelectorAll('button').length,'buttons');
 if(['game/combined_maker.html','game/unit_maker.html'].includes(file)){
  const E=win.PROEditor,model={},box=win.document.createElement('div');win.document.body.append(box);
  E.form(box,model,E.unitExtFields().filter(f=>['size','move','movementAptitude'].includes(f.key)),()=>{});
  const sampleUnit={id:'sized',name:'sized',hp:1000,atk:100,def:0,mob:500,acc:500,weapons:[{name:'gun'}],size:'XL'};
  const marker=file.endsWith('unit_maker.html')?'VAIS_UNIT_PACK':'VAIS_BUNDLE_PACK';
  const raw={format:marker==='VAIS_UNIT_PACK'?'VAIS_OUTER_OPS_UNIT_PACK':'VAIS_OUTER_OPS_BUNDLE_PACK',schemaVersion:9,packId:'sized',units:[sampleUnit],missions:[],items:[]};
  const adapter=win.PROMaker.getAdapter(marker==='VAIS_UNIT_PACK'?'unit':'bundle');
  assert.equal(adapter.readPack(win.PROCore.serialize(marker,raw)).units[0].size,'XL');
  const move=box.querySelector('input[type=number]');move.value='0';move.dispatchEvent(new win.Event('input'));
  const selects=box.querySelectorAll('select');assert.equal(selects.length,6);selects[0].value='2XL';selects[0].dispatchEvent(new win.Event('change'));assert.equal(model.size,'2XL');assert.equal(win.PROCore.unitExt(model).size,'2XL');
  selects[1].value='S';selects[1].dispatchEvent(new win.Event('change'));
  selects[2].value='none';selects[2].dispatchEvent(new win.Event('change'));
  assert.equal(model.move,0);assert.equal(model.movementAptitude.ground,'S');assert.equal(model.movementAptitude.air,'none');
  assert.equal(E.pick(model,E.UNIT_EXT_KEYS).move,0);assert.equal(win.PROCore.unitExt(model).movementAptitude.air,'none');
  selects[1].value='';selects[1].dispatchEvent(new win.Event('change'));assert(!('ground' in model.movementAptitude));box.remove();
 }
 if(file.endsWith('combined_maker.html')){
  const doc=win.document;doc.querySelector('#importMode').value='replace';const sample=fs.readFileSync('game/samples/pro_115_feature_sample.js','utf8');const input=doc.querySelector('#importFiles');Object.defineProperty(input,'files',{value:[{text:async()=>sample}],configurable:true});await input.onchange({target:input});
  assert.equal(doc.querySelector('#packId').value,'pro_115_demo');assert.equal(doc.querySelector('#download').disabled,false,doc.querySelector('#validation').textContent);
  const click=t=>{const b=[...doc.querySelectorAll('button')].find(b=>b.textContent===t)||[...doc.querySelectorAll('button')].find(b=>b.textContent.startsWith(t));assert(b,t);b.click();};click('スキル');click('複合覚醒');assert(doc.querySelector('#form').textContent.includes('複合スキル'));click('ユニット');click('デモ隊員');click('4. 拡張（1.9）');assert(doc.querySelector('#form').textContent.includes('段階変化'));
  click('ミッション');click('新機能デモ：選択と段階変化');click('4. 勝敗条件・ウェーブ');assert(doc.querySelector('#form').textContent.includes('戦闘中イベント'));
  click('パック・出力');click('関係図と到達条件を確認');assert(doc.querySelector('#overview').textContent.includes('ドロップ'));
 }
 if(file==='game/index.html'){
  const sample=fs.readFileSync('game/samples/pro_115_feature_sample.js','utf8');await win.PROGame.importAnyFiles([{name:'demo.js',text:async()=>sample}]);assert(win.document.body.textContent.includes('PRO 1.15 新機能デモ'));assert(win.document.querySelector('#proMaterialGuide'));
 }
 assert.equal(alerts.length,0,alerts.join('\n'));await win.happyDOM.cancelAsync();win.close();
}
