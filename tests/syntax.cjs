const fs=require('node:fs'),vm=require('node:vm');let checked=0;
for(const f of fs.readdirSync('game/shared').filter(x=>x.endsWith('.js'))){new vm.Script(fs.readFileSync('game/shared/'+f,'utf8'),{filename:f});checked++;}
for(const f of [...fs.readdirSync('game').filter(x=>x.endsWith('.html')).map(x=>'game/'+x),'index.html'])for(const [i,m] of [...fs.readFileSync(f,'utf8').matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g)].entries()){new vm.Script(m[1],{filename:f+'#'+i});checked++;}
console.log('PASS: JavaScript syntax',checked,'scripts');
