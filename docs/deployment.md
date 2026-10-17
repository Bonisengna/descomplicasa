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
  pull-loop.sh
  pull-release.sh
  remote-check.sh
  rollback-release.sh
  start-release.sh
```

A configuração também fica fora da aplicação, normalmente em `/etc/descomplicaza.env`. Um exemplo está em `ops/descomplicaza.env.example`.

| Variável | Padrão ou exemplo | Finalidade |
| --- | --- | --- |
| `APP_ROOT` | `/srv/descomplicaza` | Diretório exclusivo das releases |
| `APP_SERVICE` | `/data/data/com.termux/files/usr/var/service/descomplicaza` | Caminho do serviço runit do Termux |
| `SV_BIN` | `/data/data/com.termux/files/usr/bin/sv` | Binário `sv` do Termux, visível dentro do Debian |
| `START_SCRIPT` | `/usr/local/bin/descomplicaza-start` | Inicializador único para releases novas e para o build legado |
| `NODE_BIN` | `/usr/local/bin/node` | Node.js ARM64 usado dentro do Debian |
| `CURRENT_HEALTH_URL` | `http://127.0.0.1:3000/` | Saúde compatível com o site que já está no ar |
| `APP_HEALTH_URL` | `http://127.0.0.1:3000/api/health` | Saúde versionada das novas releases |
| `N8N_HEALTH_URL` | `http://127.0.0.1:5678/healthz` | Trava de saúde do n8n |
| `CANARY_PORT` | `3100` | Porta temporária de validação |
| `GITHUB_REPOSITORY` | `Bonisengna/descomplicasa` | Origem permitida |
| `DEPLOY_TOOL_DIR` | `/usr/local/lib/descomplicaza-deploy` | Scripts administrativos |
| `PULL_INTERVAL_SECONDS` | `2592000` | Intervalo de 30 dias; mínimo 60 |

## Bootstrap único

Os caminhos reais já confirmados são:

- aplicação atual: `/opt/descomplicaza/descomplicasa`;
- inicializador no Debian: `/usr/local/bin/descomplicaza-start`;
- serviço externo: `/data/data/com.termux/files/usr/var/service/descomplicaza`;
- controle runit: `/data/data/com.termux/files/usr/bin/sv`;
- Node.js: `/usr/local/bin/node`.

Copie a pasta `ops` da revisão aprovada para um diretório temporário no Debian e, como `root` dentro do Debian, execute:

```sh
cd /caminho/temporario/ops
LEGACY_REVISION="$(git -C /opt/descomplicaza/descomplicasa rev-parse HEAD)" \
  ./bootstrap-termux-proot.sh
```

O bootstrap:

1. confirma que o site atual, o n8n e o runit estão saudáveis;
2. registra o diretório atual como rollback legado, sem copiar ou limpar `.next`, `node_modules` ou arquivos modificados;
3. instala a configuração e os scripts administrativos;
4. testa o inicializador novo na porta 3100;
5. monta `descomplicaza-pull` fora do diretório observado pelo runit, cria primeiro o arquivo `down` e só então move o serviço completo para o Termux, portanto ele nunca fica visível em estado ativo durante a instalação;
6. confirma novamente a saúde do site e do n8n sem reiniciar o processo que está no ar.

Se o telefone reiniciar depois desse bootstrap, o inicializador novo ainda consegue abrir o build legado. O arquivo anterior também fica salvo como `/usr/local/bin/descomplicaza-start.pre-cicd`.

O buscador só deve ser ativado depois do primeiro teste manual. Qualquer falha de rede ou validação preserva a versão que já está no ar.

## Consulta manual

Para procurar e instalar uma nova versão sem esperar os 30 dias:

No Termux:

```sh
proot-distro login debian -- sh -lc \
  '. /etc/descomplicaza.env && /usr/local/lib/descomplicaza-deploy/pull-release.sh'
```

Depois de conferir o site e o n8n, ative a verificação automática de 30 dias no Termux:

```sh
rm /data/data/com.termux/files/usr/var/service/descomplicaza-pull/down
sv up /data/data/com.termux/files/usr/var/service/descomplicaza-pull
sv status /data/data/com.termux/files/usr/var/service/descomplicaza-pull
```

Se uma consulta automática já estiver em andamento, o comando manual termina sem iniciar um segundo deploy. Depois que o serviço runit estiver instalado, reiniciá-lo também força uma consulta imediata:

```sh
sv restart /data/data/com.termux/files/usr/var/service/descomplicaza-pull
```

## Rollback

Dentro do Debian, sem depender do GitHub:

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

O Tailscale continua útil para chegar ao endereço privado do telefone e administrar o OpenSSH do Termux na porta 8022, mas não participa do deploy automático. O comando `tailscale` não precisa existir dentro do Termux ou do Debian para este modelo funcionar. As variáveis `TS_OAUTH_CLIENT_ID` e `TS_AUDIENCE` não são lidas pelo workflow e podem ser removidas depois que este modelo estiver validado.

## Proteções recomendadas no GitHub

- exigir o job `build` antes de fazer merge em `main`;
- bloquear push direto em `main`;
- permitir que apenas `main` use o ambiente `production`;
- habilitar releases imutáveis no repositório, quando essa opção estiver disponível.
