/* Shared maker shell. Each maker keeps its own draft and data model. */
(function(root){'use strict';
const adapters=new Map();
function register(kind,adapter){if(!['unit','mission','item','bundle'].includes(kind)||typeof adapter.exportPack!=='function'||typeof adapter.readPack!=='function')throw new Error('Invalid maker adapter');adapters.set(kind,Object.freeze(adapter));}
const routes=[['combined_maker.html','統合メーカー'],['maker_hub.html','メーカー入口'],['unit_maker.html','Unit Maker'],['mission_maker.html','Mission Maker'],['item_maker.html','Item Maker'],['../index.html','ゲーム']];
function links(){const box=document.createElement('nav');box.className='flow-links';box.setAttribute('aria-label','ツール移動');for(const [href,name]of routes){const a=document.createElement('a');a.href=href;a.textContent=name;a.target='_blank';a.rel='noopener';box.append(a);}return box;}
function download(name,text){const blob=new Blob([text],{type:'text/javascript;charset=utf-8'}),a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=name.replace(/[^a-zA-Z0-9_-]/g,'_')+'.js';document.body.append(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove();},1000);}
function getDraft(key){try{return JSON.parse(localStorage.getItem(key)||'null')}catch(e){return null;}}
function setDraft(key,value){try{localStorage.setItem(key,JSON.stringify(value));return true}catch(e){return false;}}
root.PROMaker=Object.freeze({version:'1.1.0',routes,links,download,getDraft,setDraft,register,getAdapter:kind=>adapters.get(kind)});
})(window);
