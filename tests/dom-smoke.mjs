import fs from 'node:fs';import path from 'node:path';import assert from 'node:assert/strict';
const {Window}=await import(process.env.PRO_DOM_MODULE||'happy-dom');
async function load(file){const win=new Window({url:'http://localhost/'+file,settings:{enableJavaScriptEvaluation:true,disableJavaScriptFileLoading:true,disableCSSFileLoading:true,suppressInsecureJavaScriptEnvironmentWarning:true}});const alerts=[];win.confirm=()=>true;win.alert=t=>alerts.push(t);win.prompt=()=> '保存時点';win.scrollTo=()=>{};win.URL.createObjectURL=()=> 'blob:test';win.URL.revokeObjectURL=()=>{};
 const html=fs.readFileSync(file,'utf8');win.document.write(html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/g,''));
 for(const match of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/g)){const src=/src=["']([^"']+)["']/.exec(match[1]);const code=src?fs.readFileSync(path.resolve(path.dirname(file),src[1].split('?')[0]),'utf8'):match[2];try{win.eval(code);}catch(e){throw Error(file+' / '+(src?.[1]||'inline')+': '+e.stack);}}
 return {win,alerts};
}
for(const file of ['game/index.html','game/combined_maker.html','game/unit_maker.html','game/mission_maker.html','game/item_maker.html']){
 const {win,alerts}=await load(file);assert(!win.__PRO_BOOT_FAILED,file+' boot');assert(win.PROCore,file+' core');console.log('DOM loaded',file,win.document.querySelectorAll('button').length,'buttons');
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
