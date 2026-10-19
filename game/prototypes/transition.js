/* Full-screen fade for large screen changes (and, later, loading waits): fade to black, run the change,
   fade back in. The overlay is a modal dialog so it covers other open dialogs; it is re-raised after the
   change so windows opened during the change stay hidden until the fade-in. Input is blocked meanwhile. */
(function(){'use strict';
const ms=300,d=document.getElementById('screenFade');let running=null;
const enabled=()=>window.PROField?.settings?.().screenFade!==false&&!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
const frame=()=>new Promise(r=>setTimeout(r,ms));
d.addEventListener('cancel',e=>e.preventDefault());
// run(change, {label}) → resolves with change's result. Without fades, change runs immediately.
async function run(change,{label=''}={}){if(!enabled()||running){return change();}
 running=true;try{document.getElementById('screenFadeLabel').textContent=label;d.classList.remove('shown');if(!d.open)d.showModal();void d.offsetWidth;d.classList.add('shown');await frame();
  const out=await change();
  // Bring the overlay back above anything the change opened, then reveal.
  d.close();d.showModal();d.classList.add('shown');void d.offsetWidth;d.classList.remove('shown');await frame();return out;}
 finally{if(d.open)d.close();d.classList.remove('shown');running=null;}}
window.PROTransition=Object.freeze({run,enabled});
})();
