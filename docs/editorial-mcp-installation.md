# Instalação editorial na instância n8n

## Aprovação humana confirmada — execução 1576

Em 18/11/2026 às 20:35 (America/Sao_Paulo), a revisão 2 recebeu aprovação pelo Telegram. A execução 1576 terminou como Succeeded: validou a decisão, preparou e salvou o snapshot aprovado na Data Table e registrou APROVADO na FILA.

**O artigo não foi publicado por esse fluxo.** A execução terminou em PUBLICACAO CONFIGURADA, sem itens de saída. O nó PUBLICAR NO SITE não foi executado, pois publishEnabled permanece false. A FILA registra AGUARDANDO_IMPLANTACAO_SITE, public_url vazio e a pendência de implantação/autenticação do site. Sucesso da execução comprova a aprovação e seu registro, não a publicação.

Para concluir, implantar a API e armazenamento persistente, configurar a credencial dedicada do publicador e homologar a retomada do mesmo snapshot aprovado. Não regenerar o artigo após a aprovação. Revalidar hashes e validade antes da tentativa de publicação; se a aprovação expirar, solicitar nova decisão.


## Teste de aprovação realizado em 18/11/2026

Com o MCP ausente nesta sessão, o acesso ao painel foi autenticado pelo formulário seguro. Os prompts de redação e revisão foram ajustados para atribuir declarações, evitar extrapolações e exigir evidência concreta para reprovar o texto. O bloqueio de revisão permanece ativo.

O teste 1575 enviou HTML com foto ao bot, mas foi cancelado antes da aprovação porque a IA havia alterado o endereço da fonte. O nó VALIDAR RASCUNHO agora usa diretamente a URL da fonte validada, sem reescrita pela IA. Três verificações isoladas passaram: resposta JSON como string, resposta como objeto e rejeição de fonte ausente.

Uma nova execução concluiu produção, revisão final e envio do HTML com fotografia para Editorial_Bruno_Bot. A FILA confirmou revisão 2, título “Direcional explica causas do aumento dos distratos no Minha Casa Minha Vida”, etapa TELEGRAM e status AGUARDANDO_APROVACAO. O nó TELEGRAM - APROVAR OU REJEITAR mostrou Waiting for input; a prévia corrigida foi recebida pela API Telegram com ok=true (mensagem de documento 6). A decisão humana ainda não foi confirmada.

Os botões são Publicar e Rejeitar, restritos ao aprovador configurado. A mensagem esclarece que esta homologação registra a aprovação editorial e que o envio ao site permanece bloqueado até concluir a integração. Nenhum artigo foi publicado.

O fluxo de retomada também foi criado como rascunho: https://n8n.caza85imoveis.com.br/workflow/fss86c86EW4r8dsg . Seus 21 nós e SDK foram validados pelo MCP, mas a retomada não foi executada nem homologada com publicação real. As evidências anteriores de 31 testes locais não equivalem à homologação do site.


Registro em 18/11/2026, America/Sao_Paulo. A melhoria está no [PR #4](https://github.com/Bonisengna/descomplicasa/pull/4), branch `feat/editorial-telegram-aprovacao`, acompanhada pela [issue #3](https://github.com/Bonisengna/descomplicasa/issues/3).

| Fluxo | URL | Estado observado |
| --- | --- | --- |
| Principal editorial | [Abrir](https://n8n.caza85imoveis.com.br/workflow/iIRd9OrcO7s2J8VY) | Rascunho inativo; publicação bloqueada |
| Erros e alertas | [Abrir](https://n8n.caza85imoveis.com.br/workflow/cMbL8bmUMfMxkefu) | Rascunho inativo |
| Diagnóstico de integrações | [Abrir](https://n8n.caza85imoveis.com.br/workflow/J6PlNTfOwDsV3HSa) | Teste manual |

## Configuração real e snapshots

O principal tem 78 nós e sete especialistas separados. Usa credenciais já vinculadas de Sheets, Telegram, OpenAI e Groq. O modelo primário é **OpenAI gpt-4.1-mini**, conectado à entrada 0; **Groq openai/gpt-oss-120b** está conectado à entrada 1 como fallback. Os rótulos dos nós ficaram antigos: `OPENAI FALLBACK - ...` contém o primário atual e `MODELO - ...` contém o fallback Groq. A posição das conexões e os parâmetros, e não esses nomes, definem a seleção.

Há pausas nativas entre etapas, limites de tokens e contextos menores após o limite Groq encontrado nos testes. Seis nós Crypto nativos calculam e conferem os hashes. Não é necessário liberar `require('crypto')` no Code sandbox para essa versão.

Um bot Telegram **dedicado ao editorial** foi configurado. A integração usa `chatApproval=true` e `approverIds` restrito. O webhook do ArIA não foi substituído. O estado remoto observado foi `configured=true`, `telegramSchemaVerified=true`, `previewOnly=false`, `publishEnabled=false`; o workflow continua inativo.

O principal usa o alerta global publicado `ERROS_LOGS - TELEGRAM`. O novo fluxo de erros permanece rascunho; não há segundo alerta ativo.

Os arquivos em `automation/editorial/mcp/` são snapshots do rascunho obtidos via MCP, com:

- credenciais e seus identificadores removidos;
- identificador pessoal do chat/aprovador Telegram substituído por placeholder;
- identificador da Data Table da instância substituído por placeholder;
- `active=false`, `configured=false`, `telegramSchemaVerified=false` e `publishEnabled=false`;
- vínculo `settings.errorWorkflow` removido para exigir escolha explícita do handler publicado na instância de destino.

Snapshot principal: atualização remota `2026-11-18T22:28:00.870Z`, com 78 nós confirmados por nova leitura MCP. Snapshot de erros: `2026-11-18T22:04:50.002Z`. Os snapshots não contêm payloads de execuções, texto de artigos em preparação nem tokens.

Depois da aprovação válida, `PREPARAR SNAPSHOT APROVADO` e `SALVAR SNAPSHOT APROVADO` persistem o pacote congelado na Data Table editorial antes de registrar a aprovação na FILA. O envelope mantém revisão, hashes, aprovador, evidência Telegram e expiração; isso permite preparar uma recuperação separada sem redigir novamente nem reutilizar aprovação para outro conteúdo. A recuperação continua como etapa em construção e não está liberada neste registro. A tabela contém o artigo e a imagem em base64 e precisa de acesso administrativo restrito, capacidade e retenção adequados.

## Evidências dos testes reais

| Execução | Evidência e limite |
| --- | --- |
| 1564 | Diagnóstico de Crypto, leitura da pauta, chat privado Telegram e resposta JSON Groq passou. |
| 1565 | Expôs indisponibilidade de `URL` no Code sandbox. Validação adaptada com autoridade HTTPS e allowlist restritas. |
| 1566 | Expôs limite Groq de 8.000 tokens/minuto. Contextos, limites de saída e pausas foram ajustados. |
| 1569 | Teste de aprovação pelo bot dedicado terminou com sucesso e resposta humana confirmada. É evidência do mecanismo de aprovação; **não é aprovação do artigo MoneyTimes**. |
| 1571 | Preparação do artigo falhou na seleção/download da imagem por host de thumbnail. Nenhuma publicação foi confirmada. |
| 1572 | Iniciada sobre a versão anterior à correção de imagens; não comprova a versão corrigida. |
| 1573 | A fotografia foi selecionada, baixada e passou pelo hash; a montagem falhou porque o nó Crypto não preservou o binário. Nova correção em andamento; não houve prévia final ou publicação confirmada. |
| 1574 | Novo teste iniciado após confirmar a correção de base64 no rascunho; resultado ainda pendente neste registro. |

A tentativa inicial de aprovação no bot compartilhado foi recusada para preservar o webhook ArIA. Essa limitação foi resolvida com o bot dedicado, sem substituir o webhook existente.

A correção de busca usa a URL original `imageinfo.url`, em vez de `thumburl`, e aceita somente HTTPS no host `upload.wikimedia.org`. A busca restringe JPEG e, para MCMV, o assunto Minha Casa Minha Vida. Licença, autor, dimensões mínimas e tamanho são validados antes da curadoria. A conferência dos bytes permanece após o download. A execução 1573 comprovou esse avanço e revelou uma falha distinta na preservação do binário após Crypto. A correção seguinte extrairá a imagem para base64 antes do hash; seu novo teste ainda precisa ser concluído.

O MCP ficou temporariamente indisponível durante a alteração seguinte; por isso foi preservado o **candidato local de 78 nós**, `automation/editorial/mcp/editorial-pipeline-candidate.json`, com `EXTRAIR BASE64 DA FOTO` antes do Crypto e montagem por `Buffer.from(imageBase64, 'base64')`. Quando a leitura voltou, o rascunho remoto de 78 nós, atualizado em `2026-11-18T22:28:00.870Z`, confirmou a aplicação da correção; `editorial-pipeline.json` foi reexportado dessa versão real. O candidato anterior permanece para rastreabilidade. A confirmação do grafo não comprova execução completa ou prévia entregue.

A revisão independente executou 11 testes locais MCP com sucesso no candidato de 78 nós. A regressão reconstrói a fotografia do JSON sem binário na entrada e com o helper de leitura binária indisponível; também recusa 5.000.001 bytes. JSON e os 21 nós Code compilam localmente. Esses testes não executam serviços ou modelos e não comprovam aplicação na instância.

A rodada conjunta passou em **31 testes locais**, selecionando explicitamente o candidato de 78 nós por `EDITORIAL_MCP_SNAPSHOT`. A CI declara esse candidato no ambiente. A versão remota anterior de 77 nós apresentava a falha conhecida de montagem; o novo snapshot confirmado de 78 nós inclui a correção. A execução completa corrigida continua dependendo do resultado do teste 1574. Leituras e alterações MCP ficaram temporariamente sem resposta, incluindo uma consulta de execução com timeout, mas uma nova leitura depois confirmou a aplicação do grafo.

Há também um candidato local separado de recuperação, `editorial-resume-candidate.json` e seu SDK, que pretende ler um snapshot aprovado da Data Table e preservar conteúdo e evidências antes de publicar. Ele não possui workflow remoto confirmado, não foi validado/executado pelo MCP e **não está coberto pela rodada de 31 testes**. Seus gates de publicação permanecem `false`. Não usar esse candidato como evidência de retomada homologada.

**Não há evidência neste registro de prévia final do artigo entregue e aprovada, nem de artigo/foto publicados.** Um teste do botão de aprovação não substitui essa etapa.

## Pendências para publicação

1. Concluir o teste do artigo e revisar o HTML final com a fotografia no Telegram.
2. Aprovar essa versão específica pelo bot dedicado; verificar identidade, chat, prazo e hashes no fluxo.
3. Implantar a API editorial do PR e preparar armazenamento persistente fora das releases.
4. Configurar o ambiente administrativo explicitamente com `export`, pois o inicializador carrega o arquivo, mas não exporta automaticamente as variáveis editoriais:

   ```sh
   export EDITORIAL_CONTENT_DIR=/srv/descomplicaza/editorial
   export EDITORIAL_PUBLISH_TOKEN='VALOR_SECRETO_DE_PELO_MENOS_32_CARACTERES'
   export EDITORIAL_APPROVER_IDS='ID_TELEGRAM_AUTORIZADO'
   ```

   Os valores acima são placeholders. Não salvar o token no Git, na planilha ou em mensagens. O diretório deve ser absoluto e persistente, com permissões do processo do site.
5. Vincular o token ao nó HTTP final por Header Auth `Authorization: Bearer ...`. O publicador observado ainda não tem autenticação e permanece inacessível pelo gate `publishEnabled=false`.
6. Só depois da implantação e validação de autenticação liberar a publicação autorizada. Conferir resposta, GET da página, título, imagem e SHA256 antes de marcar `PUBLICADO`.
7. Reconciliar uma repetição do mesmo pacote e comprovar idempotência. Manter uma execução por vez; Sheets não é uma reserva transacional.

Não há agenda ativa. Novas importações devem usar os snapshots da subpasta `mcp/`. O gerador `build-workflows.py` representa o template inicial e **não reconstrói** os ajustes MCP. Não executá-lo sobre esses snapshots.

