import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

// Execute the sanitized snapshot's actual Code bodies without services or credentials.
const snapshotPath = process.env.EDITORIAL_MCP_SNAPSHOT ?? new URL('../automation/editorial/mcp/editorial-pipeline.json', import.meta.url);
const snapshot = JSON.parse(await readFile(snapshotPath, 'utf8'));
const workflow = snapshot.workflow ?? snapshot;
const AsyncFunction = Object.getPrototypeOf(async function(){}).constructor;
function node(name) {
  const found = workflow.nodes.find(n => n.name === name);
  assert.ok(found, `Missing node: ${name}`);
  return found;
}
function run(name, json = {}, context = {}, input = [{json}], clock = {setZone:()=>({toISO:()=>new Date().toISOString()})}) {
  const lookup = name => ({first: () => ({json: context[name]})});
  const receiver={helpers:{getBinaryDataBuffer(){throw new Error('Binary helper unavailable after Crypto; use preserved base64.');}}};
  return new AsyncFunction('$json', '$', '$input', '$now', node(name).parameters.jsCode).call(receiver,json,lookup,{all:()=>input,first:()=>input[0]},clock);
}
function commons(changes = {}, metadata = {}) {
  return {query:{pages:{1:{pageid:1,title:'File:Habitação brasileira.jpg',imageinfo:[{
    url:'https://upload.wikimedia.org/wikipedia/commons/a/ab/Habitacao.jpg',
    thumburl:'https://thumb.wikimedia.org/wikipedia/commons/thumb/a/ab/Habitacao.jpg/1400px-Habitacao.jpg',
    descriptionurl:'https://commons.wikimedia.org/wiki/File:Habitacao.jpg',
    mime:'image/jpeg',size:1_400_000,width:2048,height:1536,
    extmetadata:{Artist:{value:'Fotógrafo'},LicenseShortName:{value:'CC BY 3.0'},...metadata},...changes
  }]}}}};
}

test('MCP snapshot is inactive, publish-disabled and has valid Code/connection targets', () => {
  assert.equal(workflow.active,false);
  const config=node('CONFIGURACAO').parameters.assignments.assignments;
  assert.equal(config.find(a=>a.name==='publishEnabled').value,false);
  const names=new Set(workflow.nodes.map(n=>n.name));
  assert.equal(names.size,workflow.nodes.length);
  for(const n of workflow.nodes.filter(n=>n.type==='n8n-nodes-base.code')) assert.doesNotThrow(()=>new AsyncFunction(n.parameters.jsCode),n.name);
  for(const [source,outputs] of Object.entries(workflow.connections)) {
    assert.ok(names.has(source),source);
    for(const groups of Object.values(outputs)) for(const group of groups) for(const edge of group) assert.ok(names.has(edge.node),edge.node);
  }
});
test('MCP image filter accepts original upload URL despite the new thumbnail host', async () => {
  const candidates=(await run('VALIDAR LICENCAS',commons()))[0].json.candidates;
  assert.equal(candidates.length,1);
  assert.equal(candidates[0].url,'https://upload.wikimedia.org/wikipedia/commons/a/ab/Habitacao.jpg');
  assert.equal(candidates[0].license,'CC BY 3.0');
});
test('MCP image filter rejects PDFs and unknown licenses or missing attribution', async () => {
  await assert.rejects(run('VALIDAR LICENCAS',commons({mime:'application/pdf'})));
  await assert.rejects(run('VALIDAR LICENCAS',commons({}, {LicenseShortName:{value:'All rights reserved'}})));
  await assert.rejects(run('VALIDAR LICENCAS',commons({}, {Artist:{value:''}})));
});
test('MCP image filter rejects external hosts, credentials, HTTP and deceptive hostnames', async () => {
  for(const url of ['https://example.com/photo.jpg','https://upload.wikimedia.org.evil.example/photo.jpg','https://upload.wikimedia.org@evil.example/photo.jpg','http://upload.wikimedia.org/photo.jpg','https://upload.wikimedia.org:8443/photo.jpg']) {
    await assert.rejects(run('VALIDAR LICENCAS',commons({url})),url);
  }
});
test('MCP image filter matches the API 5,000,000 byte limit before download', async () => {
  assert.equal((await run('VALIDAR LICENCAS',commons({size:5_000_000})))[0].json.candidates.length,1);
  await assert.rejects(run('VALIDAR LICENCAS',commons({size:5_000_001})));
  await assert.rejects(run('VALIDAR LICENCAS',commons({size:6_000_000})));
});
test('MCP image filter rejects undersized pictures and normalizes CC0', async () => {
  await assert.rejects(run('VALIDAR LICENCAS',commons({width:999})));
  await assert.rejects(run('VALIDAR LICENCAS',commons({height:499})));
  assert.equal((await run('VALIDAR LICENCAS',commons({}, {LicenseShortName:{value:'CC0 1.0'}})))[0].json.candidates[0].license,'CC0');
});
test('MCP assembly survives Crypto dropping binary by using the preserved base64 JSON', async () => {
  const jpeg=Buffer.concat([Buffer.from([0xff,0xd8,0xff]),Buffer.alloc(10_000,1)]);
  const input={imageBase64:jpeg.toString('base64'),imageSha256:'d'.repeat(64)};
  const context={
    'VALIDAR RASCUNHO':{article:{slug:'habitacao',title:'Rascunho',description:'Descrição',lead:'Introdução',sections:[{id:'contexto',title:'Contexto',paragraphs:['Texto']}],sources:[{label:'Fonte',url:'https://example.com'}]}},
    'VALIDAR SEO':{seo:{title:'Título final',description:'Descrição final'}},
    'VALIDAR ESCOLHA IMAGEM':{image:{alt:'Habitações',credit:'Fotógrafo',license:'CC BY 3.0',sourceUrl:'https://commons.wikimedia.org/wiki/File:Habitacao.jpg'}}
  };
  const result=await run('MONTAR ARTIGO COM IMAGEM',input,context,[{json:input}],{setZone:()=>({toISO:()=> '2026-11-18T20:00:00-03:00'})});
  assert.equal(result[0].json.article.title,'Título final');
  assert.equal(result[0].json.article.image.sha256,input.imageSha256);
  assert.equal(result[0].json.article.publishedAt,'2026-11-18T20:00:00-03:00');
  assert.equal(result[0].json.imageBase64,input.imageBase64);
  assert.equal(result[0].json.imageMimeType,'image/jpeg');
  assert.deepEqual(Buffer.from(result[0].json.imageBase64,'base64'),jpeg);
});
test('MCP config permits preview but blocks unverified approval integration', async () => {
  const config={configured:true,previewOnly:false,telegramSchemaVerified:false,chatId:'123',telegramUserId:'123',publishBaseUrl:'https://example.com'};
  await assert.rejects(run('VALIDAR CONFIGURACAO',config));
  assert.equal((await run('VALIDAR CONFIGURACAO',{...config,previewOnly:true}))[0].json.previewOnly,true);
  assert.equal((await run('VALIDAR CONFIGURACAO',{...config,telegramSchemaVerified:true}))[0].json.telegramSchemaVerified,true);
});
test('MCP publish gate blocks disabled integration and restores approved packet after Sheets', async () => {
  const packet={article:{slug:'same-approved-article'},approval:{versionHash:'a'.repeat(64)},imageBase64:'same-bytes'};
  const context={'CONFIGURACAO':{publishEnabled:false},'VALIDAR APROVACAO HUMANA':packet};
  assert.deepEqual(await run('PUBLICACAO CONFIGURADA',{status:'APROVADO'},context),[]);
  context.CONFIGURACAO.publishEnabled=true;
  const result=await run('PUBLICACAO CONFIGURADA',{status:'APROVADO'},context);
  assert.deepEqual(result[0].json,packet);
});
function approvalContext() {
  return {
    'CONFIGURACAO':{telegramUserId:'123',chatId:'123'},
    'CONGELAR VERSAO E PREVIEW':{article:{slug:'approved'},versionHash:'a'.repeat(64),imageBase64Hash:'b'.repeat(64),expiresAt:Date.now()+60_000},
    'TELEGRAM - APROVAR OU REJEITAR':{data:{approved:true,responder:{id:123,source:'telegram'},chatId:123}}
  };
}
const checked={checkedArticleHash:'a'.repeat(64),checkedImageBase64Hash:'b'.repeat(64)};
test('MCP approval accepts authenticated Telegram output and rejects wrong user, chat, source or refusal', async () => {
  const context=approvalContext();
  assert.equal((await run('VALIDAR APROVACAO HUMANA',checked,context))[0].json.approved,true);
  const original=context['TELEGRAM - APROVAR OU REJEITAR'].data;
  for(const data of [{...original,approved:false},{...original,responder:{id:999,source:'telegram'}},{...original,chatId:999},{...original,responder:{id:123,source:'link'}},{approved:true},{}]) {
    context['TELEGRAM - APROVAR OU REJEITAR']={data};
    assert.equal((await run('VALIDAR APROVACAO HUMANA',checked,context))[0].json.approved,false);
  }
});
test('MCP approval blocks expired snapshot or altered content/image hashes', async () => {
  const context=approvalContext();
  context['CONGELAR VERSAO E PREVIEW'].expiresAt=Date.now()-1;
  assert.equal((await run('VALIDAR APROVACAO HUMANA',checked,context))[0].json.approved,false);
  context['CONGELAR VERSAO E PREVIEW'].expiresAt=Date.now()+60_000;
  await assert.rejects(run('VALIDAR APROVACAO HUMANA',{...checked,checkedArticleHash:'c'.repeat(64)},context));
  await assert.rejects(run('VALIDAR APROVACAO HUMANA',{...checked,checkedImageBase64Hash:'c'.repeat(64)},context));
});
