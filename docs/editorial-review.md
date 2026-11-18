# Revisão independente da automação editorial

Data: 18/11/2026, America/Sao_Paulo.

## Parecer

**Inconclusivo para ativação e publicação real.** Os controles locais examinados passaram. Faltam importação/execução na instância n8n, validação do retorno autenticado do Telegram, credenciais, instalação do endpoint e teste ponta a ponta com o artigo solicitado. Os JSONs permanecem inativos e o gate de configuração bloqueia a execução até essas verificações.

Escopo: `lib/editorial-store.ts`, rotas de publicação e mídia, página dinâmica de artigo e `automation/editorial/editorial-pipeline.json`. Revisão por agente separado do autor. Modelo efetivo não informado pelo ambiente.

## Evidências executadas

Node.js v26.8.1. Testes em diretórios temporários exclusivos, sem publicação, Telegram ou alteração de produção.

| Controle | Evidência | Resultado |
| --- | --- | --- |
| Endpoint desabilitado sem segredo/configuração | Testes de token ausente/curto e configuração de storage | Verificado |
| Bearer correto obrigatório | Token ausente e divergente recusados | Verificado |
| Aprovação vinculada à versão e usuário | Usuário divergente, aprovação ausente, expirada e futura recusados | Verificado |
| Integridade de conteúdo e imagem | Alteração do título ou bytes da foto recusada | Verificado |
| Caminhos e links | Traversal, slug inválido e protocolos/credenciais em URL recusados | Verificado |
| Entrada estruturada | Conteúdo vazio, seção duplicada, licença desconhecida e caminho de imagem externo recusados | Verificado |
| Mídia | SVG, MIME divergente, base64 inválido e imagem maior que 5 MB recusados | Verificado |
| Idempotência | Repetição não duplica nem sobrescreve outra revisão | Verificado |
| Concorrência | Cinco publicações simultâneas produzem um único diretório final | Verificado |
| Falha de disco | Storage inválido falha sem criar publicação | Verificado |
| JSON n8n | Todos os Code nodes compilam e conexões apontam para nós existentes | Verificado estaticamente |
| Gate n8n | Configuração não verificada bloqueia; configuração explícita válida passa | Verificado com dados sintéticos |
| Decisão Telegram | Usuário divergente, ausência de identidade, rejeição, expiração e snapshot alterado bloqueiam | Verificado com retorno sintético |
| Preview | HTML do texto é escapado e fotografia fica embutida no documento | Verificado com dados sintéticos |
| Licenças Commons | CC BY 4.0 aceita, CC0 1.0 normalizada e licença desconhecida bloqueada | Verificado com metadados sintéticos |

Comandos executados:

```powershell
node --experimental-strip-types --test tests/editorial.test.mjs
node --experimental-strip-types --test --test-name-pattern=workflow tests/editorial.test.mjs
```

O primeiro comando executou os 15 casos do backend existentes naquele momento, todos aprovados. Após adicionar cinco casos de workflow, o segundo executou esses cinco casos, todos aprovados. Total: 20 casos distintos aprovados. O aviso `MODULE_TYPELESS_PACKAGE_JSON` é informativo; não foi necessário alterar a configuração de módulos do projeto. A tentativa inicial com `--experimental-transform-types` foi recusada pelo Node instalado e não constitui teste executado.

## Achados corrigidos durante a revisão

| ID | Evidência e impacto | Correção confirmada |
| --- | --- | --- |
| ED-01 | SEO admitia descrição até 400 caracteres, mas API aceita 320; publicações válidas no fluxo poderiam falhar | Limite n8n alinhado a 320 |
| ED-02 | Allowlist de licenças divergente entre n8n/API, incluindo CC0 1.0 | Mesma allowlist e normalização CC0 |
| ED-03 | Estado PUBLICADO era gravado antes de confirmação do destino | GET da página, verificação de título, GET da imagem e comparação SHA-256 precedem o estado final |

Nenhum achado alto/crítico confirmado ficou aberto no código local examinado. Isso não equivale a aprovação da integração real.

## Fronteiras e pendências

- **Telegram: não verificado ao vivo.** O adaptador espera `data.approved`, `data.responder.id`, `data.responder.source` e `data.chatId`. É necessário inspecionar o schema real de *Approve Within Chat* da versão instalada e testar aprovação, rejeição, chat diferente e usuário diferente. `telegramSchemaVerified=false` preserva o bloqueio até isso ocorrer.
- **Confiança da API: explícita.** O endpoint aceita a decisão enviada por um cliente autenticado com o segredo editorial. Ele não consulta o Telegram. Esse segredo deve pertencer somente ao publicador determinístico do n8n, nunca aos agentes de IA nem à planilha.
- **Storage persistente: não verificado no servidor.** `EDITORIAL_CONTENT_DIR` deve ser absoluto e ficar fora das releases. Permissões e backup precisam ser conferidos no deploy inicial. O desenho assume um único filesystem compartilhado pelo processo Next.js; réplicas com discos independentes exigiriam outro storage.
- **Mídia: validação limitada.** São verificados tamanho, assinatura JPEG/PNG, MIME declarado e hash. Não há decodificação completa, antivírus ou comprovação automática de direitos além dos metadados Commons. A revisão humana recebe a foto no preview para conferir adequação e crédito. Os fixtures de teste verificam o contrato binário, não o carregamento visual de uma fotografia real.
- **Importação n8n: não verificada.** Compilar Code nodes não prova compatibilidade dos parâmetros de todos os nós, credenciais ou disponibilidade do modelo Ollama. `require('crypto')` precisa estar permitido na instalação.
- **Erros: configurar antes de ativar.** O workflow de erros deve ser importado, associado ao principal e receber a credencial/chat correto. Falhas antes/depois da publicação devem ser reconciliadas usando a revisão estável, sem nova aprovação para conteúdo diferente.
- **Ponta a ponta: pendente.** Ainda é necessário baixar uma foto real licenciada, abrir o preview enviado ao Telegram, aprovar a mesma versão, verificar HTTP do artigo e da mídia e conferir índice/sitemap após reinício.

Próximo gate: instalar a implementação revisada, validar os parâmetros da instância e executar o teste real até a espera de aprovação humana. Só concluir a publicação depois da aprovação no Telegram e da confirmação da URL pública.
