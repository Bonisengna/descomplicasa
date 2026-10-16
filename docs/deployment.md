# Deploy seguro no Moto G30

O deploy de produção usa um build `standalone` feito em um runner GitHub hospedado. O telefone recebe apenas o artefato pronto, valida seu SHA-256, inicia a versão em uma porta de teste e só então troca o link `current` e reinicia o serviço `descomplicaza` no runit.

Se a nova revisão não responder em `/api/health`, o script restaura o link anterior e reinicia a versão antiga. O n8n nunca é reiniciado ou alterado; seu endpoint `/healthz` é validado antes e depois da troca.

## Pré-requisitos no servidor

- Debian 12 ARM64 em execução no PRoot.
- Node.js 20, `curl`, `tar`, `sha256sum` e runit.
- Tailscale 1.90.1 ou mais recente quando for usado OIDC federado.
- O serviço `descomplicaza` configurado com `ops/runit/run`.
- Um diretório dedicado, por exemplo `/srv/descomplicaza`, contendo `releases/`, `incoming/` e o link simbólico `current`.
- A versão atualmente ativa precisa estar registrada como uma primeira release e conter `server.js`, `REVISION`, `.next/static` e `public`. O workflow recusa o primeiro deploy se `current` não existir, para preservar a versão no ar.

Não substitua o serviço runit durante um deploy. A migração inicial deve ser feita uma única vez, em uma janela controlada, depois que o primeiro artefato tiver passado no teste da porta canário.

## Identidade sem segredos no GitHub

Crie no Tailscale uma identidade federada OIDC confiando no GitHub Actions apenas para:

- repositório `Bonisengna/descomplicasa`;
- ambiente GitHub `production`;
- tag `tag:ci`;
- escopo de escrita `auth_keys`.

O Client ID e o Audience da identidade federada não são segredos. Cadastre-os, junto com os dados do destino, em **Settings > Environments > production > Variables**:

| Variável | Exemplo | Obrigatória |
| --- | --- | --- |
| `TS_OAUTH_CLIENT_ID` | Client ID da identidade federada | sim |
| `TS_AUDIENCE` | Audience da identidade federada | sim |
| `DEPLOY_HOST` | nome MagicDNS ou IP Tailscale do telefone | sim |
| `DEPLOY_USER` | usuário aceito pelo Tailscale SSH | sim |
| `APP_ROOT` | `/srv/descomplicaza` | sim |
| `APP_SERVICE` | `descomplicaza` | não |
| `APP_HEALTH_URL` | `http://127.0.0.1:3000/api/health` | não |
| `N8N_HEALTH_URL` | `http://127.0.0.1:5678/healthz` | não |
| `CANARY_PORT` | `3100` | não |

Nenhuma chave SSH, senha, auth key ou OAuth secret deve ser cadastrada no GitHub. A política da tailnet deve permitir que `tag:ci` alcance somente o host do deploy e somente pelo Tailscale SSH. O serviço n8n não precisa aceitar tráfego do runner.

## Primeiro bootstrap

Antes de ativar o workflow em `main`:

1. Proteja a branch `main`, exija o job `build` nos pull requests e restrinja push direto.
2. Crie o diretório dedicado com proprietário igual ao usuário de deploy.
3. Coloque a configuração baseada em `ops/descomplicaza.env.example` em `/etc/descomplicaza.env`.
4. Instale `ops/runit/run` e `ops/runit/log/run` no serviço `descomplicaza`, preservando uma cópia da configuração anterior.
5. Registre o build atualmente ativo sob `APP_ROOT/releases/<revisao>` e aponte `APP_ROOT/current` para ele.
6. Confirme manualmente `sv status descomplicaza`, a rota `/api/health` e `http://127.0.0.1:5678/healthz`.
7. Execute o workflow manualmente com `operation=deploy`. Depois do primeiro sucesso, os pushes em `main` passam a publicar automaticamente.

O bootstrap não é automatizado de propósito: ele altera o comando de inicialização do site existente e depende dos caminhos reais do PRoot.

## Rollback manual

Abra **Actions > Build and deploy > Run workflow**, selecione `rollback` e deixe o campo de revisão vazio para voltar à release anterior. Para escolher uma release específica, informe o SHA completo que aparece em `APP_ROOT/releases`.

O rollback também valida a aplicação e o n8n. Se falhar, o script volta imediatamente para a release que estava ativa antes da tentativa.
