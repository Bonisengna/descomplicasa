# Publicação editorial com aprovação pelo Telegram

## Escopo

A planilha recebe URLs de notícias. Sete especialistas isolados extraem fatos, planejam, redigem, conferem fatos, ajustam SEO, escolhem fotografia existente e fazem a revisão final. Cada chamada recebe apenas o contexto necessário. A publicação é determinística, sem ferramentas de escrita entregues aos modelos.

Planilha: https://docs.google.com/spreadsheets/d/1AFDD8HpBYZi8d9BzW7KSxzddDtW0u7G2DxeeGHv2tAQ/edit

Issue de acompanhamento: https://github.com/Bonisengna/descomplicasa/issues/3

PR de implementação: https://github.com/Bonisengna/descomplicasa/pull/4. O registro atualizado de instalação, modelos e execuções está em [editorial-mcp-installation.md](editorial-mcp-installation.md).

## Imagens e aprovação

O fluxo consulta Wikimedia Commons, registra autor/licença/origem, baixa JPEG correlato e valida tamanho, assinatura e hash. Não gera imagens nem reutiliza automaticamente a foto da notícia. A identidade de quem aprova precisa corresponder ao usuário Telegram configurado. A aprovação vence em 24 horas e se refere ao JSON congelado do artigo, incluindo o SHA256 da fotografia. Alterar texto ou fotografia invalida a aprovação.

O documento HTML final enviado ao Telegram contém a imagem embutida. Rejeição, ausência de resposta, identidade ausente ou expiração não levam à publicação. O bot editorial dedicado passou no teste humano de aprovação, mas isso não comprova a entrega e aprovação do artigo MoneyTimes. O workflow permanece inativo e com `publishEnabled=false` até a implantação e autenticação do endpoint do site.

## Site e armazenamento

- `POST /api/editorial/publish`: Bearer dedicado de pelo menos 32 caracteres, JSON até 8 MB, aprovador permitido e hash da revisão. Recebe `{article, approval:{versionHash, approvedBy, approvedAt}, imageBase64, imageMimeType}`.
- `article.image` contém `{src, alt, credit, license, sourceUrl, sha256}`. `src` deve ser `/api/editorial/media/{slug}`. O hash da revisão é SHA256 de `JSON.stringify(article)` na ordem original das propriedades, sem reserialização intermediária.
- `/blog/{slug}`: renderização de campos de texto pelo React, sem executar HTML/JS da IA. Fontes e crédito da imagem aparecem no post.
- `/api/editorial/media/{slug}`: mídia JPEG/PNG servida localmente, com `nosniff`.
- O blog e sitemap consultam artigos publicados em tempo de execução.

`EDITORIAL_CONTENT_DIR` deve apontar para um diretório absoluto persistente **fora das releases**, por exemplo `/srv/descomplicaza/editorial`. O processo Node precisa de leitura/escrita nesse diretório. Diretórios temporários começam com `.pending-` e não aparecem no índice. Artigo, imagem e auditoria tornam-se visíveis juntos mediante rename. O mesmo slug e hash retornam sucesso idempotente; uma revisão diferente no mesmo slug retorna 409. Atualizações de posts existentes exigem um fluxo próprio de revisão e não estão habilitadas nesta versão.

A API confia na integração n8n autenticada para comprovar a aprovação Telegram. Ela valida ID permitido, data e hash, mas não consulta a API Telegram independentemente. A credencial de publicação deve ficar somente no nó HTTP final, nunca em prompts, planilha ou repositório. Somente administradores autorizados devem editar esse workflow.

## Instalação

1. Revisar o PR e executar CI antes do merge. Aplicar o deploy inicial pelo mecanismo de releases já descrito em `docs/deployment.md`.
2. No servidor, configurar `export EDITORIAL_CONTENT_DIR=/srv/descomplicaza/editorial`, `export EDITORIAL_PUBLISH_TOKEN=...` e `export EDITORIAL_APPROVER_IDS=...` no arquivo administrativo de ambiente. Os `export` são necessários porque o inicializador apenas carrega esse arquivo. Não salvar o token em Git. Criar o diretório persistente com acesso exclusivo ao usuário do site.
3. Para novas instalações, importar os snapshots sanitizados em `automation/editorial/mcp/`, vincular credenciais Google Sheets, bot Telegram dedicado, modelos disponíveis e Header Auth com `Authorization: Bearer ...` para o publicador. A instância configurada usa OpenAI `gpt-4.1-mini` primário e Groq `openai/gpt-oss-120b` fallback; os templates iniciais com Ollama são históricos. Os hashes da versão MCP usam Crypto nativo.
4. Configurar IDs reais do chat privado e usuário, origem pública e handler de erro já publicado. Validar aprovação restrita ao usuário e a identidade da resposta antes de liberar `configured` e `telegramSchemaVerified`. O snapshot remove credenciais/ID pessoal e mantém as travas desligadas para a instalação de destino.
5. Executar um único item manualmente. Conferir documento e fotografia no Telegram, aprovar, verificar URL, crédito, imagem, blog e sitemap. Reexecutar o mesmo pacote e comprovar ausência de duplicidade.
6. Somente após homologação, decidir periodicidade e ativar um gatilho agendado. Esta versão usa entrada manual e processa um item por execução. Não executar concorrente: Google Sheets não oferece reserva transacional de fila. A API evita publicação duplicada, mas não elimina mensagens Telegram duplicadas de execuções concorrentes.

## Testes e limites reais

Os testes locais cobrem autenticação, aprovação, alteração de conteúdo/imagem, formato, traversal, repetição, concorrência e falha de armazenamento. São distintos dos testes reais: a instância n8n foi instalada pelo MCP e o bot dedicado passou na aprovação humana (execução 1569). A preparação do artigo falhou na imagem na execução 1571; a correção para URL original do Commons permitiu selecionar, baixar e calcular hash da fotografia na execução 1573. Essa execução falhou depois na montagem porque o Crypto não preservou o binário. A correção de base64 e a prévia/aprovação final do artigo ainda precisam de confirmação no registro de instalação. A API do site não está homologada em produção; não há artigo publicado confirmado.

Fonte inicial cadastrada: https://www.moneytimes.com.br/nao-e-so-a-caixa-ceo-da-direcional-aponta-outro-motivo-por-tras-da-aceleracao-dos-distratos-nas-construtoras-do-minha-casa-minha-vida-bdap/

Executar testes locais:

```powershell
node --experimental-strip-types --test tests/editorial.test.mjs
npx tsc --noEmit
```

O runner local usa Node 26; o CI de produção usa Node 20. Os módulos TypeScript são compilados pelo Next.js em produção. Para executar esses testes em Node 20, transpilar antes ou usar um runner TS aprovado. A homologação dos schemas dos nós continua necessária mesmo com todos os testes locais aprovados.
