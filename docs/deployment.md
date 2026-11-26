# Deploy seguro no Moto G30

Um push em `main` dispara o build ARM64 e a publicação de uma GitHub Release. O job `deliver` avisa o receptor privado do Moto G30 pelo Tailscale depois que a release está pronta. Só então o telefone consulta o GitHub e instala a revisão verificada.

O job de entrega entra no Tailscale com uma identidade OIDC efêmera e chama a porta privada 8787 do Moto G30. A conexão não usa SSH. O receptor autentica a chamada com um token de uso exclusivo dessa função.

## Fluxo

1. Pull requests executam build, auditoria e testes, mas não publicam nem instalam nada.
2. Um push aprovado em `main` gera a tag `deploy-<SHA completo>` e publica `descomplicaza.tar.gz` e `descomplicaza.tar.gz.sha256`.
3. O serviço `descomplicaza-signal` recebe o SHA publicado e confirma que corresponde à release atual. O instalador busca a tag exata.
4. O telefone exige que a tag, o commit e as URLs dos dois arquivos correspondam exatamente a `Bonisengna/descomplicasa`.
5. O pacote é baixado para um diretório temporário e seu SHA-256 é conferido.
6. `deploy-release.sh` testa a revisão em `127.0.0.1:3100`; somente depois troca o link `current` e reinicia `descomplicaza`. Se o PRoot não encerrar no prazo do restart gracioso, o script força o restart apenas desse serviço de aplicação.
7. Se o novo site não ficar saudável, o link anterior é restaurado automaticamente.
8. O receptor confere a revisão local e a saúde do n8n. O job `deliver` aguarda o mesmo SHA no endpoint público. Se o domínio devolver HTTP 403 ao runner, o job registra um aviso e a verificação pública deve ser feita de uma rede com acesso.

O n8n nunca é reiniciado, atualizado ou reconfigurado por esses scripts. Seu `/healthz` funciona apenas como trava de segurança antes e depois da troca.

## Arquivos instalados fora das releases

Os scripts de controle devem ficar em um diretório administrativo que uma release da aplicação não consiga substituir, por exemplo:

```text
/usr/local/lib/descomplicaza-deploy/
  deploy-release.sh
  deploy-signal.mjs
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
| `PULL_INTERVAL_SECONDS` | `2592000` | Intervalo do serviço legado, mantido desativado no deploy por evento |

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

Depois do primeiro teste manual, instale o receptor de eventos. Qualquer falha na entrega ou na validação preserva a versão que estiver saudável.

## Ativação única do receptor

1. No Termux com o bootstrap anterior instalado, execute `sh ops/bootstrap-deploy-signal.sh <IP-privado-do-Moto-G30>`. O script instala o serviço `descomplicaza-signal`, testa a resposta na rede privada e desativa o buscador periódico.
2. No ambiente `production` do GitHub, configure `TS_OAUTH_CLIENT_ID` e `TS_AUDIENCE` como variáveis, e `DEPLOY_SIGNAL_HOST` e `DEPLOY_SIGNAL_TOKEN` como secrets. O token gerado no telefone fica em `/usr/local/lib/descomplicaza-deploy/deploy-signal.token`, com permissões locais restritas.
3. Na política do Tailscale, permita ao `tag:ci` chegar à porta TCP 8787 do Moto G30. O receptor vincula o socket ao IP privado e aceita apenas o SHA exato da release atual. Mantenha a porta fora do proxy público.
4. Faça um push em `main`. O job `deliver` deve terminar com o mesmo SHA no [endpoint público de saúde](https://descomplicaza.caza85imoveis.com.br/api/health).

Para acompanhar o telefone, use `tail -n 40 "$PREFIX/var/log/descomplicaza-signal/current"` no Termux. Se o telefone estiver offline, aguarde a reconexão e repita a entrega com o SHA completo da release atual:

```sh
gh workflow run deploy.yml --ref main -f release_revision=SHA_COMPLETO_DA_RELEASE
```

Esse comando reaproveita a release publicada, e o telefone só aceita o SHA que ainda é o atual. A instalação manual abaixo continua disponível.

## Consulta manual

Para instalar a release atual manualmente em caso de indisponibilidade do receptor:

No Termux:

```sh
proot-distro login debian -- sh -lc \
  '. /etc/descomplicaza.env && /usr/local/lib/descomplicaza-deploy/pull-release.sh'
```

Se uma instalação estiver em andamento, o comando manual termina sem iniciar um segundo deploy.

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

O app Tailscale do telefone precisa estar conectado. O GitHub Actions entra na rede privada apenas durante o job de entrega. O OpenSSH do Termux fica disponível para manutenção separada.

## Proteções recomendadas no GitHub

- exigir o job `build` antes de fazer merge em `main`;
- bloquear push direto em `main`;
- permitir que apenas `main` use o ambiente `production`;
- habilitar releases imutáveis no repositório, quando essa opção estiver disponível.
