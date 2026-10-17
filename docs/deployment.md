# Deploy seguro no Moto G30

O deploy usa um modelo de busca: o GitHub compila o Next.js em ARM64 e publica dois arquivos em uma Release pública. Um serviço separado no Moto G30 consulta o GitHub a cada 30 dias e só instala uma revisão depois de validar a origem dos arquivos, o SHA-256, uma inicialização em porta canário e a saúde do site e do n8n. Também é possível iniciar essa consulta manualmente a qualquer momento.

O GitHub não abre uma conexão com o telefone. Não há senha, chave SSH, token do Tailscale ou outro segredo permanente no repositório. O `GITHUB_TOKEN` usado para publicar a Release é temporário, fornecido pelo próprio GitHub Actions e limitado ao job de publicação.

## Fluxo

1. Pull requests executam build, auditoria e testes, mas não publicam nem instalam nada.
2. Um push aprovado em `main` gera a tag `deploy-<SHA completo>` e publica `descomplicaza.tar.gz` e `descomplicaza.tar.gz.sha256`.
3. O serviço `descomplicaza-pull` no telefone lê apenas a Release de produção mais recente.
4. O telefone exige que a tag, o commit e as URLs dos dois arquivos correspondam exatamente a `Bonisengna/descomplicasa`.
5. O pacote é baixado para um diretório temporário e seu SHA-256 é conferido.
6. `deploy-release.sh` testa a revisão em `127.0.0.1:3100`; somente depois troca o link `current` e reinicia `descomplicaza`.
7. Se o novo site não ficar saudável, o link anterior é restaurado automaticamente.

O n8n nunca é reiniciado, atualizado ou reconfigurado por esses scripts. Seu `/healthz` funciona apenas como trava de segurança antes e depois da troca.

## Arquivos instalados fora das releases

Os scripts de controle devem ficar em um diretório administrativo que uma release da aplicação não consiga substituir, por exemplo:

```text
/usr/local/lib/descomplicaza-deploy/
  deploy-release.sh
  parse-release.mjs
  pull-release.sh
  remote-check.sh
  rollback-release.sh
```

A configuração também fica fora da aplicação, normalmente em `/etc/descomplicaza.env`. Um exemplo está em `ops/descomplicaza.env.example`.

| Variável | Padrão ou exemplo | Finalidade |
| --- | --- | --- |
| `APP_ROOT` | `/srv/descomplicaza` | Diretório exclusivo das releases |
| `APP_SERVICE` | `descomplicaza` | Nome ou caminho completo do serviço runit |
| `SV_BIN` | `sv` | Comando `sv`; pode apontar para o binário do Termux |
| `CURRENT_HEALTH_URL` | `http://127.0.0.1:3000/` | Saúde compatível com o site que já está no ar |
| `APP_HEALTH_URL` | `http://127.0.0.1:3000/api/health` | Saúde versionada das novas releases |
| `N8N_HEALTH_URL` | `http://127.0.0.1:5678/healthz` | Trava de saúde do n8n |
| `CANARY_PORT` | `3100` | Porta temporária de validação |
| `GITHUB_REPOSITORY` | `Bonisengna/descomplicasa` | Origem permitida |
| `DEPLOY_TOOL_DIR` | `/usr/local/lib/descomplicaza-deploy` | Scripts administrativos |
| `PULL_INTERVAL_SECONDS` | `2592000` | Intervalo de 30 dias; mínimo 60 |

## Bootstrap único

O bootstrap não deve ser executado até confirmar os caminhos reais usados pelo Termux/PRoot e pelo serviço já existente. Ele é a única etapa manual porque precisa registrar a versão atualmente no ar como primeira release, sem sobrescrevê-la.

Antes de ativar o buscador:

1. Descobrir o arquivo `run` real do serviço `descomplicaza`, o diretório onde a aplicação atual está instalada e como o `sv` do Termux pode ser chamado a partir do Debian.
2. Copiar os scripts administrativos e a configuração para dentro do Debian, com escrita restrita ao administrador.
3. Registrar o build atual em `APP_ROOT/releases/<revisao-atual>` e criar os links `current` e `previous`.
4. Validar manualmente o site atual em `/`, o `/healthz` do n8n e o controle do serviço externo sem reiniciá-lo. A rota `/api/health` é exigida somente das novas releases.
5. Executar `pull-release.sh` uma vez manualmente. Somente após esse teste instalar e iniciar o serviço runit `descomplicaza-pull`.

O template do buscador está em `ops/runit/pull/run`. Ele continua tentando após erros de rede ou de validação; qualquer falha preserva a versão que já está no ar.

## Consulta manual

Para procurar e instalar uma nova versão sem esperar os 30 dias:

```sh
. /etc/descomplicaza.env
/usr/local/lib/descomplicaza-deploy/pull-release.sh
```

Se uma consulta automática já estiver em andamento, o comando manual termina sem iniciar um segundo deploy. Depois que o serviço runit estiver instalado, reiniciá-lo também força uma consulta imediata:

```sh
sv restart descomplicaza-pull
```

## Rollback

No telefone, sem depender do GitHub:

```sh
. /etc/descomplicaza.env
/usr/local/lib/descomplicaza-deploy/rollback-release.sh
```

Isso volta à versão indicada pelo link `previous`. Para escolher uma revisão já armazenada:

```sh
. /etc/descomplicaza.env
ROLLBACK_RELEASE=<SHA-completo> /usr/local/lib/descomplicaza-deploy/rollback-release.sh
```

O rollback também passa pela porta canário e restaura a versão original se sua própria verificação falhar.

## Tailscale

O Tailscale continua útil para administração manual por SSH na porta 8022, mas não participa do deploy automático. As variáveis `TS_OAUTH_CLIENT_ID` e `TS_AUDIENCE` já cadastradas no ambiente `production` podem permanecer sem uso; o workflow não as lê. Elas podem ser removidas depois que este modelo estiver validado.

## Proteções recomendadas no GitHub

- exigir o job `build` antes de fazer merge em `main`;
- bloquear push direto em `main`;
- permitir que apenas `main` use o ambiente `production`;
- habilitar releases imutáveis no repositório, quando essa opção estiver disponível.
