# Instalação editorial pelo MCP — 18/11/2026

## Fluxos criados na instância

| Fluxo | Link | Estado |
| --- | --- | --- |
| Principal | https://n8n.caza85imoveis.com.br/workflow/iIRd9OrcO7s2J8VY | Rascunho, modo prévia |
| Erros e alertas | https://n8n.caza85imoveis.com.br/workflow/cMbL8bmUMfMxkefu | Rascunho |
| Testar integrações e aprovação | https://n8n.caza85imoveis.com.br/workflow/J6PlNTfOwDsV3HSa | Manual |
| Testar OpenAI | https://n8n.caza85imoveis.com.br/workflow/W9CGVXCHrFmWMbiT | Manual |

O principal tem 74 nós organizados em seis grupos. Sete especialistas usam Groq openai/gpt-oss-120b com fallback nativo para OpenAI gpt-4.1-mini, autorizado pelo usuário. As credenciais existentes foram vinculadas sem copiar segredos para a planilha ou o repositório. As abas e os cabeçalhos foram conferidos pelo MCP. Há pausas nativas entre etapas para a conta Groq e seis nós Crypto nativos, dispensando require no sandbox. Fuso America/Sao_Paulo.

O principal reutiliza o alerta global ERROS_LOGS — TELEGRAM já publicado. O novo fluxo de erros permanece rascunho e não envia um segundo alerta.

## Testes reais

- Diagnóstico 1564: Crypto, chat privado Telegram, leitura da pauta no Sheets e resposta JSON do Groq passaram.
- A aprovação por botão foi recusada pelo n8n porque o webhook do bot atual está vinculado ao ArIA em outra instância. O webhook não foi alterado.
- Teste 1565 identificou URL indisponível no Code sandbox. Corrigido com validação restrita de HTTPS e domínio permitido, sem liberar módulos.
- Teste 1566 identificou limite Groq de 8.000 tokens por minuto. Foram reduzidos o contexto e os limites de saída, acrescentadas pausas e posteriormente configurado fallback OpenAI.
- Teste 1568: credencial OpenAI e modelo gpt-4.1-mini passaram, retornando JSON válido.
- Execução 1567: preparação da pauta MoneyTimes em andamento. Ela começou antes de adicionar o fallback e usa o snapshot anterior do fluxo. Não reprocessar a fila enquanto essa execução estiver ativa, para evitar prévias duplicadas.

## Controles ativos

Estado remoto: configured=true, previewOnly=true, telegramSchemaVerified=false e publishEnabled=false. O modo prévia envia o HTML completo e encerra antes de solicitar decisão. O POST de publicação tem outro gate e não está habilitado. Nenhuma agenda foi ativada e nenhum artigo foi publicado.

O nó de publicação ainda não possui a credencial dedicada do site; permanece inacessível pelo gate. Não usar as credenciais de outros serviços nesse nó. Alterações do fluxo não mudam o snapshot de uma execução já iniciada.

## Pendências

1. Criar um bot Telegram editorial dedicado e salvar a credencial no n8n. O bot atual pertence ao ArIA. A aprovação por botão não pode ocupar esse webhook.
2. Homologar chatApproval=true e approverIds restrito ao usuário autorizado. Confirmar os campos reais da resposta antes de habilitar telegramSchemaVerified e desativar previewOnly.
3. Implantar API editorial, diretório persistente e token dedicado conforme docs/editorial-automation.md. Vincular Header Auth somente ao publicador.
4. Aprovar o arquivo final no Telegram e confirmar post e fotografia por GET antes de registrar PUBLICADO.

## Exports

Os JSONs em automation/editorial/mcp são a versão importada, sanitizada: removem credenciais, identificador pessoal Telegram e referência ao handler privado. Iniciam com configured=false para nova importação. Os templates e o gerador da pasta superior correspondem à preparação inicial; não devem sobrescrever os exports desta pasta.
