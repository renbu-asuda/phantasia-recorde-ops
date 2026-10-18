import fs from 'node:fs';import assert from 'node:assert/strict';import vm from 'node:vm';import {Window} from 'happy-dom';
const file='game/prototypes/tactical_hub.html',html=fs.readFileSync(file,'utf8');
const w=new Window({url:'http://localhost/'+file,settings:{enableJavaScriptEvaluation:true,disableJavaScriptFileLoading:true,disableCSSFileLoading:true,suppressInsecureJavaScriptEnvironmentWarning:true}});
w.scrollTo=()=>{};w.document.write(html.replace(/<script>[\s\S]*?<\/script>/g,''));
const dialog=w.document.querySelector('dialog');dialog.showModal=()=>dialog.setAttribute('open','');dialog.close=()=>{dialog.removeAttribute('open');dialog.dispatchEvent(new w.Event('close'));};
for(const match of html.matchAll(/<script>([\s\S]*?)<\/script>/g)){new vm.Script(match[1]);w.eval(match[1]);}
const d=w.document,button=name=>[...d.querySelectorAll('button')].find(b=>b.textContent.includes(name));
assert(!d.querySelector('#baseView').hidden);assert(d.querySelector('#missionsView').hidden);
w.location.hash='#missions';w.dispatchEvent(new w.Event('hashchange'));assert(d.querySelector('#baseView').hidden);assert(!d.querySelector('#missionsView').hidden);assert.equal(d.querySelectorAll('.mission').length,3);
d.querySelector('[aria-label="軌道上の遭遇"]').click();assert.equal(d.querySelector('#detailTerrain').textContent,'宇宙');button('出撃を確認').click();assert(dialog.hasAttribute('open'));assert(d.querySelector('#noticeText').textContent.includes('OP-02'));button('閉じる').click();assert(!dialog.hasAttribute('open'));
d.querySelector('[data-filter=training]').click();assert.equal(d.querySelectorAll('.mission').length,1);assert.equal(d.querySelector('#detailName').textContent,'機動訓練');d.querySelector('[data-filter=combat]').click();assert.equal(d.querySelectorAll('.mission').length,2);d.querySelector('[data-filter=all]').click();assert.equal(d.querySelectorAll('.mission').length,3);
w.location.hash='#base';w.dispatchEvent(new w.Event('hashchange'));assert(!d.querySelector('#baseView').hidden);button('部隊編成').click();assert(d.querySelector('#noticeText').textContent.includes('今後追加予定'));button('閉じる').click();assert.equal(w.localStorage.length,0);assert(!html.includes('<script src='));
assert(fs.readFileSync('README.md','utf8').includes('game/prototypes/tactical_hub.html'));w.close();console.log('PASS: prototype routing, selection, filters, dialogs, no saved state or game scripts');
