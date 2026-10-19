/* Unit encounter flags, kept per save and separate from the pack's story flags. A unit counts as met once it
   appears in a mission (as an ally or an enemy), joins the player, or is registered for hire / production.
   create({key, resolve}) → tracker. resolve maps a unit id to its catalog id (variants share their base's flag).
   Storage: one browser key (the prototype's test save). Unknown storage errors leave the flags in memory only. */
(function(root){'use strict';
const HOW=['ally','enemy','joined','registered'];
function create({key,resolve=id=>id,storage=root.localStorage}={}){let seen={};try{seen=JSON.parse(storage?.getItem(key)||'{}')||{};}catch(e){seen={};}
 const save=()=>{try{storage?.setItem(key,JSON.stringify(seen));}catch(e){}};
 return Object.freeze({
  has:id=>!!seen[resolve(id)],
  how:id=>({...(seen[resolve(id)]||{})}),
  // mark(ids, how): how is ally | enemy | joined | registered. Returns the catalog ids that were new.
  mark(ids,how){if(!HOW.includes(how))throw Error('unknown encounter: '+how);const fresh=[];for(const id of ids||[]){if(!id)continue;const c=resolve(id);if(!seen[c]){seen[c]={};fresh.push(c);}seen[c][how]=true;}save();return fresh;},
  all:()=>Object.keys(seen),
  reset(){seen={};save();}});}
root.PROEncounter=Object.freeze({create,HOW});
})(typeof window!=='undefined'?window:globalThis);
