import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Workbook, SpreadsheetFile } from '@oai/artifact-tool';

const base = path.dirname(fileURLToPath(import.meta.url));
const output = path.join(base, 'outputs', 'editorial-20261118');
await fs.mkdir(output, { recursive: true });
const workbook = Workbook.create();
const fila = workbook.worksheets.add('FILA');
const config = workbook.worksheets.add('CONFIG');
const historico = workbook.worksheets.add('HISTORICO');
export const headers = ['id','url_fonte','assunto','prioridade','acao','status','etapa','revisao','titulo_final','preview_url','imagem_url','imagem_credito','revisao_resultado','decisao','public_url','erro','atualizado_em'];
const source = 'https://www.moneytimes.com.br/nao-e-so-a-caixa-ceo-da-direcional-aponta-outro-motivo-por-tras-da-aceleracao-dos-distratos-nas-construtoras-do-minha-casa-minha-vida-bdap/';
fila.getRange('A1:Q2').values = [headers,['DCZ-20261118-001',source,'Distratos no Minha Casa Minha Vida','NORMAL','PROCESSAR','NOVO','ENTRADA',1,'','','','','','PENDENTE','','','']];
const settings = [
 ['chave','valor','orientacao'],
 ['timezone','America/Sao_Paulo','Fuso dos agendamentos e registros.'],
 ['aprovacao_obrigatoria','SIM','Publicar somente a revisao aprovada no Telegram.'],
 ['imagem_origem','BAIXADA_LICENCIADA','Imagem correlata, creditada e com permissao de uso.'],
 ['limite_itens_por_execucao',1,'Processar um artigo por vez.'],
 ['prazo_aprovacao_horas',24,'Ao expirar, exigir novo pedido de aprovacao.'],
 ['publicacao_automatica','NAO','A decisao deve ocorrer no Telegram.'],
 ['credenciais','NO_N8N','Nao inserir tokens, senhas ou chaves nesta planilha.'],
 ['modo_inicial','TESTE','Ativar somente apos validar integracoes e aprovacao.'],
];
config.getRange('A1:C9').values=settings;
const historyHeaders=['execucao_id','id','revisao','etapa','status','inicio','fim','tentativa','mensagem','public_url'];
historico.getRange('A1:J2').values=[historyHeaders,['','','','','','','','','','']];
const lists={
 prioridade:['BAIXA','NORMAL','ALTA'],
 acao:['PROCESSAR','PAUSAR','REPROCESSAR'],
 status:['NOVO','PESQUISANDO','REDIGINDO','SELECIONANDO_IMAGEM','REVISANDO','AGUARDANDO_APROVACAO','APROVADO','PUBLICANDO','PUBLICADO','REJEITADO','EXPIRADO','ERRO'],
 decisao:['PENDENTE','APROVAR','REJEITAR','EXPIRADO'],
};
for(const [col,key] of [['D','prioridade'],['E','acao'],['F','status'],['N','decisao']]) fila.getRange(`${col}2:${col}501`).dataValidation={rule:{type:'list',values:lists[key]}};
for(const [sheet,end,rows] of [[fila,'Q',2],[config,'C',9],[historico,'J',2]]){
 const used=sheet.getRange(`A1:${end}${rows}`);
 used.format.font={name:'Arial',size:10,color:'#111111'};
 used.format.verticalAlignment='center';
 used.format.wrapText=true;
 used.format.columnWidthPx=170;
 used.format.rowHeightPx=34;
 sheet.getRange(`A1:${end}1`).format={fill:'#F1F3F4',font:{name:'Arial',size:10,bold:true,color:'#111111'},rowHeightPx:36};
 sheet.freezePanes.freezeRows(1);
}
fila.freezePanes.freezeColumns(1);
fila.getRange('A1:A2').format.columnWidthPx=185;
fila.getRange('B1:B2').format.columnWidthPx=430;
fila.getRange('C1:C2').format.columnWidthPx=250;
fila.getRange('B2').format.rowHeightPx=95;
fila.getRange('H2:H501').setNumberFormat('0');
config.getRange('A1:A9').format.columnWidthPx=235;
config.getRange('B1:B9').format.columnWidthPx=240;
config.getRange('C1:C9').format.columnWidthPx=510;
historico.getRange('I1:I2').format.columnWidthPx=370;
workbook.recalculate();
const check=await workbook.inspect({kind:'region',sheetId:'FILA',range:'A1:Q2',maxChars:2500,tableMaxRows:2,tableMaxCols:17});
await fs.writeFile(path.join(output,'verification.json'),JSON.stringify({fila:check,headers,source,lists,config:settings},null,2));
for(const [name,range] of [['FILA','A1:H3'],['CONFIG','A1:C9'],['HISTORICO','A1:J3']]){
 const preview=await workbook.render({sheetName:name,range,scale:1,format:'png'});
 await fs.writeFile(path.join(output,`${name.toLowerCase()}.png`),new Uint8Array(await preview.arrayBuffer()));
}
await (await SpreadsheetFile.exportXlsx(workbook)).save(path.join(output,'Descomplicaza-Editorial.xlsx'));
await fs.writeFile(path.join(base,'sheet-contract.json'),JSON.stringify({sheets:{FILA:headers,CONFIG:settings[0],HISTORICO:historyHeaders},dropdowns:lists,source},null,2));
console.log(JSON.stringify({file:path.join(output,'Descomplicaza-Editorial.xlsx'),sheets:['FILA','CONFIG','HISTORICO'],source,status:'NOVO',validationColumns:['D','E','F','N']}));
