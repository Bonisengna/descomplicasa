# Automação editorial com aprovação humana

A implementação atual está nos snapshots de `mcp/` e está instalada como **rascunho inativo** na instância n8n. A publicação permanece bloqueada. A aprovação do bot dedicado foi testada com resposta humana, mas o artigo MoneyTimes ainda não tem entrega/aprovação final ou publicação confirmadas neste registro.

Leia [instalação e evidências atuais](../../docs/editorial-mcp-installation.md) e [contrato do site](../../docs/editorial-automation.md).

## Arquivos e fontes de verdade

| Arquivo | Papel |
| --- | --- |
| `mcp/editorial-pipeline.json` | Snapshot MCP sanitizado confirmado, 78 nós e sete especialistas |
| `mcp/editorial-pipeline-candidate.json` | Cópia local proposta e testada antes da confirmação da correção de base64 na instância |
| `mcp/editorial-resume-candidate.json` / `.sdk.ts` | Proposta local de recuperação de snapshot aprovado; sem instalação/validação MCP e fora dos 31 testes |
| `mcp/editorial-errors.json` | Snapshot MCP sanitizado do handler de erros, três nós |
| `editorial-pipeline.json` / `editorial-errors.json` | Templates iniciais preservados; não representam todos os ajustes da instância |
| `build-workflows.py` | Gerador dos templates iniciais; não sobrescrever snapshots MCP com sua saída |
| `../../tests/editorial.test.mjs` | Testes locais do armazenamento/API e contratos do template |
| `../../tests/editorial-mcp.test.mjs` | Testes locais dos contratos do snapshot MCP |

Os snapshots removem credenciais e o ID pessoal Telegram; iniciam com `active=false`, `configured=false`, `telegramSchemaVerified=false` e `publishEnabled=false`. O vínculo ao handler de erro publicado deve ser escolhido na instância de destino.

A correção adiciona `Extract from File → base64` antes do hash da fotografia. `MONTAR ARTIGO COM IMAGEM` reconstrói os bytes do JSON, sem depender de binário preservado pelo Crypto. A aplicação dessa correção foi confirmada em leitura MCP do rascunho de 78 nós, atualizado em `2026-11-18T22:28:00.870Z`. O candidato local anterior permanece separado para rastreabilidade. A execução completa do artigo ainda depende do teste 1574; aplicação do grafo não equivale a prévia entregue ou aprovada.

## Etapas

1. Ler um item `NOVO` / `PROCESSAR` da FILA; marcar pesquisa.
2. Baixar e extrair a fonte permitida com nós HTTP Request e HTML nativos.
3. Especialistas isolados de extração, planejamento, redação, checagem factual e SEO.
4. Buscar fotografias JPEG correlatas no Wikimedia Commons. Validar autor, licença, dimensões, host e tamanho. O curador escolhe apenas entre candidatos reais.
5. Baixar a URL original `imageinfo.url` de `upload.wikimedia.org`, sem gerar imagem. Validar os bytes e o hash.
6. Revisão final por outro especialista; congelar artigo/imagem e hashes nativos.
7. Enviar HTML completo com foto embutida ao Telegram dedicado e aguardar aprovação restrita.
8. Conferir decisão humana, identidade, chat, prazo de 24h e hashes. Rejeição, ausência de resposta ou integridade inválida não publicam.
9. Quando o site estiver implantado e o gate liberado, enviar o pacote aprovado ao endpoint autenticado. Conferir página pública e imagem antes de registrar `PUBLICADO` na FILA e HISTORICO.

A instância atual usa OpenAI `gpt-4.1-mini` como primário e Groq `openai/gpt-oss-120b` como fallback. Os nomes de alguns nós ainda refletem a ordem anterior; as conexões de modelo são a referência. Nenhum modelo recebe ferramenta de publicação ou credencial GitHub.

## Operação segura

- Executar um item por vez. O status em Sheets não é trava atômica; não ativar concorrência ou agenda sem reserva transacional.
- Guardar credenciais somente no n8n. O endpoint exige token exclusivo e IDs aprovadores permitidos no ambiente do site.
- Em `/etc/descomplicaza.env` usar `export EDITORIAL_CONTENT_DIR=...`, `export EDITORIAL_PUBLISH_TOKEN=...` e `export EDITORIAL_APPROVER_IDS=...`; carregar o arquivo não exporta uma atribuição comum para o processo Node.
- O endpoint é idempotente por slug/hash. Antes de repetir uma execução, reconciliar publicação e aprovação pendentes para evitar previews duplicados.
- A execução persistida registra falhas mesmo se o alerta Telegram falhar. Usar o handler publicado escolhido pela instância.
- Testes locais verificam contratos; não comprovam a entrega de um artigo ao Telegram nem sua publicação. Ver o registro de execuções para o estado real.

