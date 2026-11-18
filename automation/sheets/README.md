# Planilha editorial

Planilha de operacao: https://docs.google.com/spreadsheets/d/1AFDD8HpBYZi8d9BzW7KSxzddDtW0u7G2DxeeGHv2tAQ/edit

- FILA: uma linha por pauta. URL MoneyTimes de teste cadastrada como DCZ-20261118-001, acao PROCESSAR e status NOVO.
- CONFIG: regras sem segredos, incluindo America/Sao_Paulo e aprovacao obrigatoria.
- HISTORICO: registro de execucoes; sem registros ficticios.

O contrato de cabecalhos e opcoes esta em `sheet-contract.json`. `revisao` e numero incremental; a integridade da aprovacao depende de hash verificado pelo site, nao do numero da planilha. Alterar `decisao` manualmente nao substitui a aprovacao autenticada no Telegram. A planilha nao e armazenamento seguro de autorizacoes ou credenciais.

## Gerar o modelo Excel

Use Node do runtime principal e uma junction local `node_modules` para as dependencias do runtime que incluem `@oai/artifact-tool`. Execute `node build-editorial-sheet.mjs`. A pasta `outputs/editorial-20261118` recebe XLSX e previews. Dependencias e arquivos gerados sao ignorados no Git.

## Verificacao realizada em 18/11/2026

Arquivo construido com artifact-tool, tres abas renderizadas e inspecionadas, importacao nativa confirmada e planilha movida para a pasta ChatGPT. A tabela nativa FILA tem dropdowns para prioridade, acao, status e decisao. Fuso nativo corrigido para America/Sao_Paulo. Metadados, valores e formatacao conferidos pela API; interface nativa ainda nao inspecionada visualmente. Nao houve execucao editorial ou publicacao nesta etapa.
