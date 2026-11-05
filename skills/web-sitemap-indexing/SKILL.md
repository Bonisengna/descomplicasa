---
name: web-sitemap-indexing
description: Preparar sites para descoberta e indexacao por mecanismos de busca com sitemap, robots, origem canonica e validacao tecnica. Use ao criar ou revisar a indexacao de sites publicos; nao use para prometer posicionamento ou indexacao garantida.
---

# Indexacao web e sitemaps

Implemente os sinais tecnicos necessarios para que buscadores descubram as paginas canonicas do site. Trate a biblioteca `samdark/sitemap` como referencia conceitual para geracao de XML e indices, mas prefira a API nativa do framework do projeto quando ela existir.

## Antes de alterar

1. Identifique framework, dominio canonico, rotas publicas, conteudo dinamico e sinais SEO existentes.
2. Confirme que a origem canonica e publica, usa HTTPS e resolve em DNS. Se ainda nao estiver acessivel, prepare o codigo, mas registre que rastreamento e envio ao buscador continuam bloqueados.
3. Preserve alteracoes do usuario e nao publique, configure DNS nem envie dados ao Search Console sem autorizacao correspondente.

## Implementacao

- Gere sitemap pelo mecanismo nativo do framework. Em Next.js App Router, prefira `app/sitemap.ts` com `MetadataRoute.Sitemap`.
- Inclua somente URLs absolutas, canonicas, indexaveis, pertencentes ao mesmo host e que devam responder com sucesso. Exclua APIs, paginas privadas, buscas internas, parametros, duplicatas, redirecionamentos, `noindex` e erros.
- Use um inventario explicito para rotas estaticas. Para rotas vindas de CMS ou banco, gere entradas a partir de registros publicados e divida o sitemap apenas ao se aproximar do limite do protocolo.
- Nao invente `lastmod`: derive-o da data real de publicacao ou alteracao. Omita-o quando nao houver fonte confiavel.
- Nao adicione `priority` ou `changefreq` apenas por aparencia; o Google ignora esses campos.
- Publique `robots.txt` com acesso aos recursos necessarios para renderizacao e uma referencia absoluta ao sitemap. Bloqueie somente caminhos que realmente nao devam ser rastreados; `robots.txt` nao substitui `noindex` nem canonicalizacao.
- Centralize a origem do site em configuracao validada e use-a em sitemap, robots e metadados. Evite canonicals globais que apontem todas as paginas para a home.
- Quando houver variantes duplicadas, use redirects e canonical autorreferente coerentes com as URLs listadas no sitemap.

## Verificacao

1. Execute checagem de tipos e build de producao.
2. Verifique o XML gerado e o `robots.txt`: URLs absolutas, host correto, ausencia de duplicatas e exclusao de rotas internas.
3. Com o site publicado, confirme `200` em `/robots.txt`, `/sitemap.xml` e em uma amostra de URLs; confira que nao existe `noindex` acidental e que o canonical coincide com a URL final.
4. Depois da propriedade ser verificada no Google Search Console, envie `/sitemap.xml` uma vez e acompanhe erros no relatorio de Sitemaps e na Inspecao de URL. Explique que envio e um sinal de descoberta, nao garantia de indexacao ou ranking.

Fontes normativas: documentacao de arquivos de metadata do framework utilizado e Google Search Central para criacao, envio e canonicalizacao de sitemaps.
