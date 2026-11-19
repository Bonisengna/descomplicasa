import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, rm, readFile, readdir, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { createRequire } from 'node:module';
import { authorize, validateArticle, publishArticle, getArticle, listArticles, sha256 } from '../lib/editorial-store.ts';

const now = Date.parse('2026-11-18T20:00:00Z');
const photo = Buffer.concat([Buffer.from([0xff,0xd8,0xff]),Buffer.alloc(40,1)]);
function payload() {
  const article = {
    slug:'teste-editorial', title:'Compra planejada', description:'Cuidados antes de comprar.', lead:'Organize os recursos antes da compra.',
    publishedAt:new Date(now).toISOString(),
    sections:[{id:'planejamento',title:'Planeje a entrada',paragraphs:['Confira os recursos disponíveis.']}],
    sources:[{label:'Fonte de teste',url:'https://example.com/noticia'}],
    image:{src:'/api/editorial/media/teste-editorial',alt:'Foto ilustrativa de habitação',credit:'Fotógrafo de teste',license:'CC BY 4.0',sourceUrl:'https://commons.wikimedia.org/wiki/File:Test.jpg',sha256:sha256(photo)}
  };
  return {article,approval:{versionHash:sha256(JSON.stringify(article)),approvedBy:'123',approvedAt:new Date(now).toISOString()},imageBase64:photo.toString('base64'),imageMimeType:'image/jpeg'};
}
const status = code => error => error?.status === code;
async function temporary(run) {
  const dir=await mkdtemp(path.join(os.tmpdir(),'descomplicaza-editorial-test-'));
  try { await run(dir); } finally { await rm(dir,{recursive:true,force:true}); }
}
test('token absent or short disables publication; incorrect bearer is rejected',()=>{
  assert.throws(()=>authorize(null,undefined),status(503));
  assert.throws(()=>authorize('Bearer short','short'),status(503));
  assert.throws(()=>authorize(null,'a'.repeat(32)),status(401));
  assert.throws(()=>authorize('Bearer '+ 'b'.repeat(32),'a'.repeat(32)),status(401));
  authorize('Bearer '+ 'a'.repeat(32),'a'.repeat(32));
});
test('missing configuration cannot publish',async()=>{
  await assert.rejects(publishArticle(payload(),'relative','123',now),status(503));
  await temporary(async dir=>assert.rejects(publishArticle(payload(),dir,'',now),status(503)));
});
test('article and image appear together and contain the approved version',async()=>temporary(async dir=>{
  const p=payload(); const result=await publishArticle(p,dir,'123',now);
  assert.equal(result.duplicate,false); assert.equal(result.versionHash,p.approval.versionHash);
  assert.deepEqual(await getArticle(p.article.slug,dir),p.article);
  assert.deepEqual(await readFile(path.join(dir,p.article.slug,'image')),photo);
  assert.equal((await listArticles(dir)).length,1);
  assert.equal((await readdir(dir)).some(n=>n.startsWith('.pending-')),false);
}));
test('missing approval, wrong user, expired or future approval never create article',async()=>temporary(async dir=>{
  for(const alter of [p=>delete p.approval,p=>p.approval.approvedBy='999',p=>p.approval.approvedAt=new Date(now-86400001).toISOString(),p=>p.approval.approvedAt=new Date(now+60001).toISOString()]) {
    const p=payload(); alter(p); await assert.rejects(publishArticle(p,dir,'123',now),status(403));
    assert.equal(await getArticle('teste-editorial',dir),null);
  }
}));
test('edited title invalidates previous approval',async()=>temporary(async dir=>{
  const p=payload(); p.article.title='Texto alterado';
  await assert.rejects(publishArticle(p,dir,'123',now),status(403));
}));
test('image bytes cannot change after approval',async()=>temporary(async dir=>{
  const p=payload(); p.imageBase64=Buffer.concat([photo,Buffer.from('changed')]).toString('base64');
  await assert.rejects(publishArticle(p,dir,'123',now),status(400));
}));
test('path traversal and invalid source schemes are rejected',()=>{
  for(const slug of ['../outside','a/b','a\\b','.pending','UPPER','-start','end-','a'.repeat(101)]) {
    const p=payload();p.article.slug=slug;assert.throws(()=>validateArticle(p.article),status(400));
  }
  for(const url of ['javascript:alert(1)','http://example.com','https://user:password@example.com']) {
    const p=payload();p.article.sources[0].url=url;assert.throws(()=>validateArticle(p.article),status(400));
  }
});
test('empty content, duplicate section IDs and missing license block publication',()=>{
  for(const alter of [a=>a.sections=[],a=>a.sections.push({...a.sections[0]}),a=>a.image.license='unknown',a=>a.title='  ',a=>a.sources=[],a=>a.image.src='https://example.com/image.jpg']) {
    const p=payload();alter(p.article);assert.throws(()=>validateArticle(p.article),status(400));
  }
});
test('SVG and mismatched MIME are rejected even with correct image hash',async()=>temporary(async dir=>{
  for(const mime of ['image/svg+xml','image/png']) {
    const p=payload();p.imageMimeType=mime;await assert.rejects(publishArticle(p,dir,'123',now),status(400));
  }
  const p=payload();const bytes=Buffer.from('<svg xmlns="http://www.w3.org/2000/svg"><script>alert(1)</script></svg>');
  p.imageBase64=bytes.toString('base64');p.article.image.sha256=sha256(bytes);p.approval.versionHash=sha256(JSON.stringify(p.article));
  await assert.rejects(publishArticle(p,dir,'123',now),status(400));
}));
test('malformed base64 and images above 5 MB are rejected',async()=>temporary(async dir=>{
  for(const base64 of ['%%%','',Buffer.alloc(5000001).toString('base64')]) {
    const p=payload();p.imageBase64=base64;await assert.rejects(publishArticle(p,dir,'123',now),status(400));
  }
}));
test('reprocessing same content is idempotent',async()=>temporary(async dir=>{
  const p=payload();await publishArticle(p,dir,'123',now);
  assert.equal((await publishArticle(p,dir,'123',now)).duplicate,true);
  assert.deepEqual(await readdir(dir),['teste-editorial']);
}));
test('a slug cannot be overwritten by another approved revision',async()=>temporary(async dir=>{
  const p=payload();await publishArticle(p,dir,'123',now);p.article.title='Outra revisão';p.approval.versionHash=sha256(JSON.stringify(p.article));
  await assert.rejects(publishArticle(p,dir,'123',now),status(409));
  assert.equal((await getArticle('teste-editorial',dir)).title,'Compra planejada');
}));
test('simultaneous publication cannot produce duplicate content',async()=>temporary(async dir=>{
  const p=payload();const results=await Promise.all(Array.from({length:5},()=>publishArticle(p,dir,'123',now)));
  assert.equal(results.filter(r=>!r.duplicate).length,1);assert.equal((await listArticles(dir)).length,1);
  assert.deepEqual(await readdir(dir),['teste-editorial']);
}));
test('storage failure fails without any published record',async()=>temporary(async dir=>{
  const blocked=path.join(dir,'not-a-directory');await writeFile(blocked,'block');
  await assert.rejects(publishArticle(payload(),blocked,'123',now));
  assert.deepEqual(await readdir(dir),['not-a-directory']);
}));
test('invalid or missing slugs do not read paths outside content storage',async()=>temporary(async dir=>{
  assert.equal(await getArticle('../outside',dir),null);assert.equal(await getArticle('missing',dir),null);
}));

const workflowPath = new URL('../automation/editorial/editorial-pipeline.json',import.meta.url);
const AsyncFunction = Object.getPrototypeOf(async function(){}).constructor;
const require = createRequire(import.meta.url);
async function workflow() { return JSON.parse(await readFile(workflowPath,'utf8')); }
function codeNode(w,name) { const n=w.nodes.find(n=>n.name===name);assert.ok(n,`node ${name}`);return new AsyncFunction('$json','$','$input','require',n.parameters.jsCode); }
test('workflow is inactive, all Code nodes compile and every connection has a real target',async()=>{
  const w=await workflow();assert.equal(w.active,false);
  const names=new Set(w.nodes.map(n=>n.name));assert.equal(names.size,w.nodes.length);
  for(const n of w.nodes.filter(n=>n.type==='n8n-nodes-base.code')) assert.doesNotThrow(()=>new AsyncFunction(n.parameters.jsCode),n.name);
  for(const [source,outputs] of Object.entries(w.connections)) {
    assert.ok(names.has(source));
    for(const groups of Object.values(outputs)) for(const group of groups) for(const edge of group) assert.ok(names.has(edge.node),edge.node);
  }
});
test('workflow configuration fails closed and accepts valid explicit settings',async()=>{
  const w=await workflow(),run=codeNode(w,'VALIDAR CONFIGURACAO');
  const config={configured:true,telegramSchemaVerified:true,chatId:'123',telegramUserId:'123',publishBaseUrl:'https://example.com'};
  await assert.rejects(run({...config,telegramSchemaVerified:false}));
  assert.equal((await run(config))[0].json.chatId,'123');
});
test('workflow approval requires user identity, positive decision, live expiry and unchanged snapshot',async()=>{
  const w=await workflow(),run=codeNode(w,'VALIDAR APROVACAO HUMANA');
  const p=payload();const snapshot={...p,versionHash:p.approval.versionHash,imageHash:sha256(photo),expiresAt:Date.now()+60000};
  const lookup=name=>({first:()=>({json:name==='CONGELAR VERSAO E PREVIEW'?snapshot:{telegramUserId:'123',chatId:'123'}})});
  const execute=data=>run({data},lookup,undefined,require);
  const accepted={approved:true,responder:{id:123,source:'telegram'},chatId:'123'};
  assert.equal((await execute(accepted))[0].json.approved,true);
  for(const data of [{...accepted,approved:false},{...accepted,responder:{id:999,source:'telegram'}},{...accepted,chatId:'999'},{...accepted,responder:{id:123,source:'web'}},{approved:true},{}]) assert.equal((await execute(data))[0].json.approved,false);
  snapshot.expiresAt=Date.now()-1;assert.equal((await execute(accepted))[0].json.approved,false);
  snapshot.expiresAt=Date.now()+60000;snapshot.article.title='Alterado';await assert.rejects(execute(accepted));
});
test('workflow preview escapes source text instead of executing HTML',async()=>{
  const w=await workflow(),run=codeNode(w,'CONGELAR VERSAO E PREVIEW');
  const p=payload();p.article.title='<script>alert(1)</script>';
  const out=await run({},()=>({first:()=>({json:p})}),undefined,require);
  assert.ok(out[0].json.preview.includes('&lt;script&gt;'));
  assert.ok(!out[0].json.preview.includes('<script>'));
  assert.ok(out[0].json.preview.includes(p.imageBase64));
});
test('workflow accepts a real Commons license and normalizes CC0 without granting unknown licenses',async()=>{
  const w=await workflow(),run=codeNode(w,'VALIDAR LICENCAS');
  const input=license=>({query:{pages:{1:{pageid:1,title:'File:Test.jpg',imageinfo:[{mime:'image/jpeg',width:1600,height:900,url:'https://upload.wikimedia.org/test.jpg',descriptionurl:'https://commons.wikimedia.org/wiki/File:Test.jpg',extmetadata:{Artist:{value:'Photographer'},LicenseShortName:{value:license}}}]}}}});
  assert.equal((await run(input('CC BY 4.0')))[0].json.candidates[0].license,'CC BY 4.0');
  assert.equal((await run(input('CC0 1.0')))[0].json.candidates[0].license,'CC0');
  await assert.rejects(run(input('All rights reserved')));
});
