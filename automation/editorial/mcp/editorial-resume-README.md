# Retomar uma versao aprovada

## Estado em 18/11/2026

A preservacao do pacote aprovado foi adicionada ao rascunho principal: `PREPARAR SNAPSHOT APROVADO` e `SALVAR SNAPSHOT APROVADO`, entre a aprovacao positiva e o registro na planilha. Uma DataTable editorial foi criada no mesmo projeto. Nenhuma execucao desses novos nodes foi realizada nesta etapa.

`editorial-resume-candidate.json` e `editorial-resume-candidate.sdk.ts` sao candidatos locais com 21 nodes. Nao foram criados como workflow remoto nem homologados na instancia. A validacao MCP ficou indisponivel durante a preparacao. Nenhuma publicacao foi executada.

## Preservacao

O snapshot e gravado somente depois de validar a resposta Telegram positiva, o usuario e o chat configurados, os hashes e o prazo. A chave tem formato `workflowId:executionId:versionHash`. O envelope guarda itemId, revision, executionId, hashes, approvedBy, approvedAt, expiresAt e o pacote JSON aprovado, incluindo artigo, bytes base64 da fotografia e evidencia da resposta Telegram. Nao armazena credenciais. A previa HTML, que repetiria os bytes da imagem, fica fora desse envelope.

Campos da DataTable: snapshotKey, workflowId, executionId, itemId, revision, versionHash, imageBase64Hash, approvedBy, approvedAt, expiresAt, state, payloadJson e publicUrl. O id numerico da linha e gerado pelo n8n, nao e coluna personalizada.

O estado APROVADO na planilha nao e prova suficiente para publicar. A planilha serve ao acompanhamento; o pacote persistido e a evidencia autenticada sao obrigatorios.

## Recuperacao proposta

1. Implantar e homologar o endpoint editorial e sua credencial antes de habilitar a publicacao.
2. Configurar a DataTable real no candidato, o workflow de origem e as identidades Telegram. A credencial de publicacao e as credenciais de acompanhamento devem ser atribuidas na instancia, sem inserir tokens nos parametros.
3. Configurar apenas `snapshotKey` em `CONFIGURAR RETOMADA`. O gatilho e exclusivamente manual. Nao recebe artigo, aprovacao ou payload arbitrario de webhook ou formulario.
4. O workflow le uma unica linha persistida. Ausencia, duplicidade, estado diferente de APPROVED, origem incorreta, chave inconsistente, usuario/chat divergentes, hashes alterados ou prazo vencido interrompem a retomada.
5. Os dois hashes sao recalculados com Crypto nativo. O pacote original e restaurado apos esses nodes, sem chamar IA, sem reescrever o artigo e sem baixar novamente a fotografia.
6. Os gates `publishEnabled=false` e `publisherConfigured=false` mantem a publicacao bloqueada. O ramo falso retorna SNAPSHOT_VALIDADO_PUBLICACAO_BLOQUEADA. Habilitar somente depois da homologacao e da revisao desse candidato.
7. O ramo habilitado envia o pacote original, valida o recibo, a pagina e a imagem publica, marca o snapshot PUBLISHED e atualiza planilha, historico e Telegram.

O prazo nao e renovado na retomada. Devem continuar validos tanto o vencimento da previa original (createdAt + 24 horas) quanto o limite de 24 horas desde approvedAt exigido pela API. Se expirar, reenviar exatamente o mesmo pacote para uma nova aprovacao humana; nao atribuir um novo approvedAt artificialmente.

## Execucoes anteriores

Uma execucao iniciada antes da adicao dos nodes de preservacao continua com seu grafo antigo. Ela nao passa automaticamente a gravar na DataTable. Caso haja aprovacao nessa execucao, recuperar o pacote congelado e a resposta Telegram real pelos dados salvos da execucao, conferir hashes, identidade e prazo e somente entao fazer um bootstrap administrativo do snapshot. Nao reconstruir aprovacao a partir da coluna decisao da planilha.

## Limites

Os nodes DataTable sao nativos, mas o tamanho real do envelope e a persistencia precisam ser testados na instancia. O candidato limita payloadJson a 8.000.000 caracteres, conserva o limite de imagem do fluxo e depende da validacao final de bytes e hash no endpoint. O POST e idempotente por slug/conteudo no site; uma repeticao de retomada apos falha de acompanhamento deve conferir esse recibo antes de considerar conclusao. Nao existe garantia de unicidade transacional da chave na DataTable: a leitura exige uma unica linha e bloqueia duplicatas.
