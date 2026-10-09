const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const context=vm.createContext({window:{},console,setTimeout,clearTimeout});
for(const f of ['pro_core.js','pro_battle.js','pro_features.js'])vm.runInContext(fs.readFileSync('game/shared/'+f,'utf8'),context,{filename:f});
const C=context.window.PROCore,B=context.window.PROBattle,F=context.window.PROFeatures;
const norm=x=>JSON.parse(JSON.stringify(x));
const w=C.weapon({name:'試験銃',baseAtk:200,useUnitAtk:false,accuracyPt:25,hitsMin:1,hitsMax:1,hitPowerPct:100});
const unit=(id,more={})=>({id,name:id,hp:1000,atk:100,def:0,mob:500,acc:500,tags:[],skills:[],weapons:[w],deploy:{player:true,enemy:true},...more});
const composite=C.skill({id:'awakening',name:'覚醒',trigger:'turn_start',chance:100,maxUses:1,cond:{all:[{type:'turn_ge',value:1},{any:[{type:'hp_below',value:50},{type:'enemies_le',value:1}]}]},effects:[{effect:'atk_up_pct',value:20,duration:3},{effect:'mob_up_pct',value:30,duration:3},{effect:'heal_flat',value:100}]});
assert.equal(composite.effects.length,3);assert.throws(()=>C.condition({all:[],any:[]}));assert.throws(()=>C.skill({...norm(composite),trigger:'before_attack'}));
(async()=>{
 const a=B.combatant(unit('a',{skills:[composite]}),'ally','a',{currentHp:400}),e=B.combatant(unit('e'),'enemy','e');
 const ctx=B.createContext({allies:[a],enemies:[e],turn:1,rng:()=>0});
 B.triggerSkills(ctx,a,'turn_start');assert.equal(a.currentHp,500);assert.equal(a.skillUses.awakening,1);assert.equal(a.status.buffs.length,2);B.triggerSkills(ctx,a,'turn_start');assert.equal(a.currentHp,500);
 const two=C.skill({id:'two',name:'二重強化',trigger:'turn_start',maxUses:1,effects:[{effect:'atk_up_pct',value:10},{effect:'atk_up_pct',value:20}]});a.skills=[two];B.triggerSkills(ctx,a,'turn_start');assert.equal(a.status.buffs.filter(x=>x.stat==='atk').length,3);
 // phases preserve stable persistent HP and shared references.
 const phase={id:'armor_off',name:'脱装甲',cond:{type:'hp_below',value:50},stats:{hp:2000,def:0,atk:800},hpMode:'ratio',weaponIds:['gun'],skillIds:['awakening']};
 const resolved=C.resolveUnitData(unit('p',{phases:[phase]}),[{id:'gun',...w}],[composite]);assert.equal(resolved.phases[0].weapons[0].name,'試験銃');
 const material=C.materializeUnit(unit('p',{phases:[phase]}),[{id:'gun',...w}],[composite]);assert.equal(material.phases[0].weaponIds,undefined);assert.equal(C.resolveUnitData(material).phases[0].skills.length,1);
 const p=B.combatant(resolved,'ally','p',{currentHp:400});const pc=B.createContext({allies:[p],enemies:[e],turn:2});await B.checkpoint(pc);assert.equal(p.currentHp,800);assert.equal(p._persistentMaxHp,1000);assert.equal(p.atk,800);assert.equal(p.def,0);await B.checkpoint(pc);assert.equal(Object.keys(p.phaseUses).length,1);
 const mission={id:'m',name:'m',enemies:['e'],terrain:'標準',events:[{id:'talk',when:'turn',value:1,lines:[{speaker:'隊長',text:'進め'}],flags:{route_a:true},terrain:'森林'}]};
 const normalized=C.missionExt(mission);assert.equal(normalized.events.length,1);let talks=0;const ec=B.createContext({allies:[a],enemies:[e],mission:{...mission,...normalized},turn:1,hooks:{story:async()=>talks++},record:true});await B.checkpoint(ec);await B.checkpoint(ec);assert.equal(talks,1);assert.equal(ec.flags.route_a,true);assert.equal(ec.terrain.mobPct,5);assert(ec.timeline.some(f=>f.type==='event'));
 const bundle={format:C.BUNDLE_FORMAT,schemaVersion:9,packId:'test',packName:'テスト',author:'作者',packVersion:'1.0',dependencies:['other'],units:[unit('p',{phases:[phase]})],weapons:[{id:'gun',...w}],skills:[composite],items:[],missions:[{...mission,requires:{flags:{route_a:true}},resultFlags:{win:{done:true}},story:{choices:[{text:'A',flags:{route_a:true}}],defeat:[{text:'撤退'}]}}]};
 const round=C.bundlePack(norm(C.bundlePack(bundle)));assert.equal(round.schemaVersion,9);assert.equal(round.author,'作者');assert.equal(round.missions[0].story.defeat[0].text,'撤退');assert.equal(C.unitSchemaFor(round.units,[],[],round.weapons,round.skills),9);assert.equal(C.missionSchemaFor(round.missions),5);
 const old={...bundle,schemaVersion:8,units:[unit('old')],skills:[],weapons:[],missions:[],author:undefined,packVersion:undefined,dependencies:[]};assert(C.bundlePack(old).schemaVersion<=8);
 assert.throws(()=>C.resolveUnitData(unit('bad',{phases:[{...phase,weaponIds:['missing']}]}),[],[composite]));
 assert.equal(F.usage(bundle,'skills','awakening').length,1);const isolated=norm(bundle);F.replaceRef(isolated,'skills','awakening','new',isolated.units[0]);assert.equal(isolated.units[0].phases[0].skillIds[0],'new');assert.equal(F.usage(bundle,'skills','awakening').length,1);
 const h=F.history(old);h.record({...old,packName:'変更'});assert.equal(h.undo().packName,'テスト');assert.equal(h.redo().packName,'変更');h.boundary();h.record({...old,packName:'別'});assert.equal(h.undo().packName,'変更');
 const bulk=F.bulk(old,'units',['old'],'atk',150);assert.equal(bulk.units[0].atk,150);assert.equal(old.units[0].atk,100);assert.equal(F.diff(old,bulk)[0].fields[0].key,'atk');assert.throws(()=>F.bulk(old,'units',['old'],'hp',0));
 const cyclic={missions:[{id:'locked',name:'閉鎖',requires:{items:['key']},drops:[{itemId:'key',chance:100,min:1,max:1}]}],items:[{id:'key',name:'鍵'}]};assert(F.graph(cyclic).warnings.some(w=>w.includes('到達未確認')));assert(F.graph(cyclic).warnings.some(w=>w.includes('循環')));
 const audit=F.packAudit({...old,dependencies:['missing'],units:[]},[old],{roster:[{base:'old'}]});assert(audit.warnings.some(w=>w.includes('必要パック')));assert(audit.warnings.some(w=>w.includes('使用中データ')));
 assert.equal(F.materialSources(cyclic.missions,'key')[0].expected,1);
 const sim=await B.simulate({allies:[unit('a')],enemies:['e'],enemyDefs:{e:unit('e')},mission:{id:'simple',enemies:['e']},trials:5,seed:4});assert(Number.isFinite(sim.meanMissingHp));assert.equal(sim.trials,5);
 // Validate every legacy sample, expansion and base pack without executing external input.
 let checked=0;for(const folder of ['game/samples','game/expansion_packs','game'])for(const f of fs.readdirSync(folder).filter(x=>x.endsWith('.js'))){const text=fs.readFileSync(folder+'/'+f,'utf8');const marker=['VAIS_BUNDLE_PACK','VAIS_UNIT_PACK','VAIS_MISSION_PACK','VAIS_ITEM_PACK'].find(m=>text.includes('window.'+m+' =')||text.includes('window.'+m+'='));if(!marker)continue;const raw=C.parse(text,marker);if(marker==='VAIS_BUNDLE_PACK'){const b=C.bundlePack(raw);for(const u of b.units)C.unitExt(C.resolveUnitData(u,b.weapons,b.skills));for(const m of b.missions)C.missionExt(m);}else if(marker==='VAIS_UNIT_PACK'){for(const u of raw.units)C.unitExt(u);}else if(marker==='VAIS_MISSION_PACK'){for(const m of raw.missions)C.missionExt(m);}else C.itemPack(raw);checked++;}
 console.log('PASS: feature contracts, combat, round trips, rollback helpers, economy; legacy packs:',checked);
})().catch(e=>{console.error(e);process.exitCode=1;});
