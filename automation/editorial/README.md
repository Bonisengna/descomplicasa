# Automação editorial com aprovação humana

Estado atual: **fluxos importados pelo MCP em modo prévia, com credenciais vinculadas e fallback OpenAI validado**. A aprovação por botão exige bot editorial dedicado, pois o bot atual pertence ao ArIA. Publicação continua bloqueada. Consulte [o registro da instalação](../../docs/editorial-mcp-installation.md) e os exports sanitizados em `mcp/`. O restante deste documento descreve o template inicial.

## Arquivos

- `editorial-pipeline.json`: entrada manual, sete especialistas editoriais, fotografia baixada, documento final Telegram, decisão humana e publicação autenticada.
- `editorial-errors.json`: Error Trigger e alerta sanitizado; selecionar o ID real desse workflow em Settings → Error workflow do principal depois de importar.
- `build-workflows.py`: gerador determinístico dos dois JSONs, sem dependências externas nem segredos.
- `../../tests/editorial.test.mjs`: testes isolados do armazenamento, contratos e bloqueios, mantidos pela revisão. Não chama serviços.

## Sequência e responsabilidades

1. Ler FILA e escolher apenas um `NOVO` / `PROCESSAR`.
2. Marcar `PESQUISANDO`; baixar fonte HTTPS de domínio permitido, sem seguir redirects; extrair texto com HTML nativo.
3. Especialista 01 extrai fatos e atribuições; 02 planeja; 03 redige; 04 confere fatos; 05 ajusta SEO.
4. Buscar até oito fotografias no Wikimedia Commons. Aceitar JPEG com largura mínima de 1000 pixels, autor e licença CC BY, CC BY-SA, CC0 ou domínio público explícitos. Excluir conteúdo sem licença validável.
5. Especialista 06 escolhe apenas entre candidatos reais; baixar o JPEG do host fixo `upload.wikimedia.org` e validar assinatura e limite de 5 MB.
6. Especialista 07 revisa artigo completo após o SEO, com foto, crédito e fonte.
7. Congelar JSON e imagem, calcular SHA256, criar HTML final com imagem embutida e enviá-lo como documento ao Telegram.
8. Aguardar decisão até 24h. Aprovação precisa ter identidade Telegram autorizada e hash íntegro. Rejeição segue `REJEITADO`; silêncio, identidade ausente, resposta por link sem identidade ou expiração seguem `EXPIRADO`.
9. Publicar exclusivamente o pacote congelado em `POST /api/editorial/publish`; conferir recibo e GET público do artigo e da imagem, incluindo SHA256 dos bytes. Só então registrar `PUBLICADO` e URL na FILA; registrar a decisão em HISTORICO. Nenhum LLM recebe ferramenta de publicação ou credencial GitHub.

São usados Basic LLM Chain e um Chat Model por especialista, sem ferramentas autônomas ou memória global. Ollama é o adaptador inicial configurável, não uma indicação de que existe serviço instalado. Pode ser substituído por um modelo nativo já autorizado e disponível. Nenhuma API paga é obrigatória.

## Configuração antes do primeiro teste real

1. Importar os dois JSONs sem ativar. Manter `configured=false` e `telegramSchemaVerified=false` até concluir a lista.
2. Selecionar credenciais Google Sheets nos nós Sheets; credencial Telegram nos três nós de envio e aprovação; modelo já instalado/permitido nos sete modelos; credencial HTTP Header Auth no publicador (`Authorization: Bearer …`). Guardar valores sensíveis somente nas credenciais n8n.
3. O ID da nova planilha está preenchido. Informar chat privado e ID Telegram de Bruno, domínio público do site e fontes permitidas em CONFIGURACAO.
4. **Verificar a versão real dos nós n8n:** as versões do template são versões de export conhecidas, sem homologação contra a instância. A documentação atual confirma Approve Within Chat, Restrict Who Can Approve e identidade na saída, mas o schema JSON exato de Advanced Interactivity não pôde ser obtido neste ambiente. Abrir o nó de aprovação, habilitar Approve Within Chat, restringir ao ID de Bruno e exportar novamente. Se essa função não existir na versão instalada, manter o workflow bloqueado até adaptar com Telegram Trigger autenticado; não habilitar publicação por um link anônimo.
5. Confirmar, em uma execução supervisionada sem publicação, que a decisão real retorna `data.approved` booleano, `data.responder.id`, `data.responder.source='telegram'` e `data.chatId`. Adaptar apenas o mapeamento do nó VALIDAR APROVACAO HUMANA se a versão usar outro caminho. Os quatro campos são exigidos e faltas bloqueiam. Só então marcar `telegramSchemaVerified=true`.
6. No servidor n8n permitir somente o módulo Node `crypto` para Code (`NODE_FUNCTION_ALLOW_BUILTIN=crypto`, na configuração aplicável aos runners). Usar armazenamento persistente dos binários e execuções enquanto aguardam aprovação; não podar execuções em espera antes de 24h.
7. Vincular Error workflow. Se Telegram falhar, a execução com erro persistida é o registro alternativo; acessar pelo painel autenticado. Não expor detalhes da fonte ou tokens nos alertas.
8. Manter uma execução editorial por vez. A escrita de status em Sheets **não é trava atômica**; o template não habilita agendamento nem anuncia suporte a processamento concorrente. Para agendar posteriormente, implementar reserva com chave única em armazenamento transacional antes de ativar. O endpoint publica idempotentemente por slug/hash e rejeita conflito.
9. Implantar endpoint e volume persistente do site; configurar `EDITORIAL_CONTENT_DIR`, token e `EDITORIAL_APPROVER_IDS` no servidor, conforme documentação do site. O n8n não recebe acesso ao código executável do site.
10. Homologar erros, negação, expiração e repetição; somente depois definir `configured=true` e executar manualmente com a linha MoneyTimes. O usuário deve aprovar o arquivo final no Telegram antes do POST de publicação.

## Contrato de publicação

`POST https://DOMINIO/api/editorial/publish`, com Header Auth salvo na credencial n8n:

```json
{
  "article": {
    "slug": "slug-ascii",
    "title": "Título",
    "description": "Descrição",
    "lead": "Introdução",
    "sections": [{"id":"contexto","title":"Contexto","paragraphs":["Texto"]}],
    "sources": [{"label":"Fonte","url":"https://www.moneytimes.com.br/noticia/"}],
    "image": {
      "src":"/api/editorial/media/slug-ascii",
      "alt":"Fotografia ilustrativa de habitações",
      "credit":"Autor",
      "license":"CC BY-SA 4.0",
      "sourceUrl":"https://commons.wikimedia.org/wiki/File:Fotografia.jpg",
      "sha256":"SHA256_HEXADECIMAL_DOS_BYTES"
    },
    "publishedAt":"2026-11-18T12:00:00-03:00"
  },
  "approval": {
    "versionHash":"SHA256_HEXADECIMAL_DE_JSON_STRINGIFY_ARTICLE",
    "approvedBy":"ID_TELEGRAM_AUTORIZADO",
    "approvedAt":"2026-11-18T15:00:00.000Z"
  },
  "imageBase64":"BYTES_JPEG_BASE64",
  "imageMimeType":"image/jpeg"
}
```

Resposta esperada: `{publicUrl, versionHash, slug, duplicate}`. A imagem está coberta pelo hash do artigo via `image.sha256`. Não alterar `publishedAt` ou qualquer campo após a prévia. Não mandar dados de modelo, prompts ou segredos ao navegador.

## Política de falhas e retomada

- Não há retry cego do POST ou da mensagem Telegram. Uma falha deve ser reconciliada antes de repetir efeito externo.
- Erro de leitura/modelo/curadoria interrompe; consultar a execução e corrigir a linha. Só recolocar `NOVO` após confirmar que não foi publicada e que não há execução antiga aguardando aprovação.
- Resposta 401/403 do site bloqueia sem publicar; 409 exige comparar slug e hash antes de qualquer decisão.
- Endpoint idempotente protege publicação repetida do mesmo snapshot; não protege envio duplicado de preview se um operador repetir preparação sem reconciliar.
- A aba HISTORICO recebe o resultado final de publicação, rejeição ou expiração, com ID da execução, ID da linha e hash. Não recebe todos os estágios; detalhes ficam no histórico persistido da execução e erros interrompidos ficam no Error workflow. Repetir manualmente um nó de histórico pode repetir a linha de auditoria; não representa nova publicação. Implementar retenção e backup compatíveis com o volume de imagens.

## Referências verificadas

- [Telegram Send and Wait / Approve Within Chat](https://docs.n8n.io/integrations/builtin/app-nodes/n8n-nodes-base.telegram/message-operations/)
- [Basic LLM Chain](https://docs.n8n.io/integrations/builtin/cluster-nodes/root-nodes/n8n-nodes-langchain.chainllm/)
- [MediaWiki API: imageinfo](https://www.mediawiki.org/wiki/API:Imageinfo)

Os testes locais cobrem contratos e bloqueios; não provam disponibilidade de APIs, credenciais, adequação factual da IA nem funcionamento da aprovação na versão instalada.
