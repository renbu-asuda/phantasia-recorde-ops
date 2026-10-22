/* Scroll hint: a frame that has more below gets the class more-below (its bottom edge fades), so it is clear the list goes on. */
(()=>{'use strict';
const SEL='.view-body,.unit-grid,.cmd-list,.td-items,.td-editor,.missionList,.cmd-scroll';
const mark=e=>{const more=e.scrollHeight-e.clientHeight-e.scrollTop>4&&['auto','scroll'].includes(getComputedStyle(e).overflowY);e.classList.toggle('more-below',more);};
let queued=0;const soon=()=>{if(!queued)queued=requestAnimationFrame(()=>{queued=0;document.querySelectorAll(SEL).forEach(mark);});};
addEventListener('scroll',e=>{if(e.target.matches?.(SEL))mark(e.target);},true);addEventListener('resize',soon);
new MutationObserver(soon).observe(document.body,{childList:true,subtree:true,attributes:true,attributeFilter:['hidden','open']});soon();
})();
