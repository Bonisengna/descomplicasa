# DescompliCAZA

Plataforma de conteúdo e ferramentas para ajudar o usuário a entender, planejar e simular etapas da compra de um imóvel no Brasil.

O projeto combina calculadoras interativas, checklists e conteúdo editorial em linguagem direta, com foco em financiamento imobiliário, Minha Casa Minha Vida, FGTS, custos da compra e planejamento financeiro.

> Este README representa o estado consolidado do projeto em agosto de 2026. O conteúdo do site é informativo e as simulações não substituem propostas bancárias, avaliações municipais, contratos ou orientação jurídica/financeira profissional.

## Objetivo do produto

O DescompliCAZA foi desenhado para reduzir a complexidade da jornada de compra de um imóvel. A arquitetura do produto parte de três pilares:

- **Calcular:** transformar dúvidas financeiras em cenários numéricos compreensíveis.
- **Verificar:** fornecer checklists e pontos de atenção antes de avançar na compra.
- **Entender:** explicar financiamento, FGTS, impostos, documentos e regras sem juridiquês.

A evolução planejada do produto inclui ferramentas de planejamento da compra, análise do imóvel e geração de relatórios.

## Stack atual

- Next.js 16 com App Router
- React
- TypeScript
- CSS puro e CSS Modules
- Node.js 20+
- GitHub para versionamento
- Easypanel para build e deploy na VPS
- Nixpacks/Docker no processo de build do Easypanel

## Identidade visual

Marca: **DescompliCAZA**

A assinatura visual separa `Descompli` e `CAZA` por tipografia, sem emojis ou elementos decorativos no nome em rodapés e CTAs.

Paleta principal:

| Uso | Cor |
| --- | --- |
| Verde principal | `#16803A` |
| Verde escuro | `#125C2D` |
| Verde suave | `#EAF7EE` |
| Grafite | `#17201C` |
| Cinza | `#64706A` |
| Fundo | `#FAFCFA` |

Tipografia:

- **Manrope:** títulos e destaques.
- **Inter:** interface, textos e elementos funcionais.

Diretrizes de UI adotadas:

- sem emojis em botões e elementos de interface;
- CTAs principais verdes com texto branco;
- cards com bordas suaves e bastante contraste;
- espaçamento global padronizado entre cards;
- heroes e banners mais compactos para reduzir rolagem desnecessária;
- interface responsiva para desktop e mobile;
- linguagem curta e direta.

## Estrutura principal do site

```text
Home
├── Calculadoras
│   ├── Financiamento
│   ├── Entrada
│   ├── Faixa Minha Casa Minha Vida
│   ├── Amortização
│   └── ITBI
├── Checklists
│   └── Documentos MCMV
├── Guias / Conteúdo
│   ├── Financiamento
│   ├── Minha Casa Minha Vida
│   ├── FGTS
│   ├── ITBI
│   └── conteúdos editoriais
└── Blog
```

## Calculadoras disponíveis

### 1. Calculadora de financiamento

Rota: `/calculadoras/financiamento`

Ferramenta para simular um financiamento imobiliário e comparar cenários.

Principais recursos:

- valor do imóvel;
- valor de entrada;
- valor financiado;
- prazo;
- taxa de juros;
- simulação SAC;
- simulação Price;
- comparação entre os sistemas;
- estimativa de parcelas;
- estimativa de juros;
- tabela mês a mês da evolução do saldo devedor;
- links para simuladores oficiais de bancos;
- ligação com conteúdos educacionais do site.

A ferramenta utiliza um modelo matemático simplificado e não inclui automaticamente todos os componentes de um contrato real, como seguros, tarifas, TR ou regras específicas de cada instituição.

### 2. Calculadora de entrada

Rota: `/calculadoras/entrada`

Ajuda o usuário a entender quanto da compra já consegue cobrir e quanto ainda precisa reunir.

Entradas consideradas:

- valor do imóvel;
- recursos próprios;
- FGTS disponível;
- subsídio estimado;
- financiamento aprovado ou estimado.

Resultados:

- entrada disponível;
- percentual de entrada;
- financiamento necessário;
- total de recursos;
- percentual da compra já coberto;
- valor ainda necessário;
- composição entre recursos próprios, FGTS e subsídio.

Quando há valor faltante, a página também transforma a diferença em metas mensais de referência para 12, 24 e 36 meses, sem presumir rendimento financeiro.

A calculadora possui CTA para a Calculadora de Financiamento quando o usuário ainda não sabe qual valor pretende financiar.

### 3. Calculadora de faixa do Minha Casa Minha Vida

Rota: `/calculadoras/faixa-minha-casa-minha-vida`

Ferramenta para o usuário informar a renda familiar e visualizar o enquadramento estimado no Minha Casa Minha Vida.

Apresenta informações como:

- faixa de renda;
- possibilidade de subsídio;
- indicação de condições do programa;
- teto/regras de referência quando aplicáveis;
- próximos passos;
- ligação com o guia completo do MCMV.

Os parâmetros do programa precisam ser revisados periodicamente porque podem mudar por legislação, regulamentação e região.

### 4. Simulador de amortização

Rota: `/calculadoras/amortizacao`

Ferramenta para mostrar o efeito de aportes extraordinários sobre um financiamento existente.

Dados principais:

- saldo devedor atual;
- prazo restante;
- taxa anual;
- sistema SAC ou Price;
- estratégia de redução de prazo ou de parcela.

Recursos já incorporados:

- aporte extraordinário imediato;
- barra deslizante para testar diferentes valores;
- aporte anual com recursos próprios;
- possibilidade de representar 13º, bônus, PLR ou reservas anuais;
- área de FGTS periódico dentro da própria calculadora;
- redução estimada do prazo;
- redução estimada da parcela;
- economia estimada de juros;
- novo saldo devedor;
- comparação visual antes/depois;
- tabela mês a mês;
- identificação de aportes anuais e usos de FGTS na evolução do saldo.

O FGTS não é tratado como um simples aporte anual automático. A ferramenta deve respeitar e comunicar as regras vigentes de utilização do fundo.

O contexto e roadmap detalhados desta ferramenta ficam em `docs/amortizacao-context.md`.

#### Roadmap da amortização

- **V1:** aporte único, SAC/Price, redução de prazo/parcela e comparação.
- **V2:** aportes mensais recorrentes.
- **V3:** aportes anuais e eventos programados — parte já antecipada.
- **V4:** integração conceitual com FGTS — parte já antecipada na mesma ferramenta.
- **V5:** múltiplos aportes e cronogramas personalizados.
- **V6:** comparador automático de estratégias de amortização.

A decisão de produto é manter FGTS e demais estratégias dentro do mesmo simulador, evitando fragmentar a experiência em várias calculadoras semelhantes.

### 5. Calculadora de ITBI

Rota: `/calculadoras/itbi`

Ferramenta para estimar o ITBI da compra.

Conceito da ferramenta:

- valor/base do imóvel;
- município;
- alíquota aplicável;
- cálculo do imposto estimado;
- possibilidade de informar alíquota manual quando não houver regra municipal cadastrada;
- ligação com o Guia de ITBI.

A calculadora não deve assumir uma alíquota nacional. O ITBI é municipal e as regras podem variar conforme município, operação e legislação vigente.

## Checklists

### Checklist de documentos MCMV

Rota: `/checklists/documentos-mcmv`

Checklist interativo para organizar documentos normalmente envolvidos na análise do Minha Casa Minha Vida, incluindo documentos pessoais, renda, FGTS, estado civil e dependentes.

A página deixa claro que bancos e situações específicas podem exigir documentação adicional.

## Guias principais

### Guia de financiamento

Rota: `/guias/financiamento`

Explica como funciona o financiamento imobiliário, o que influencia a aprovação, custos e conceitos relevantes. Serve também como conteúdo de apoio para a Calculadora de Financiamento.

### Guia Minha Casa Minha Vida

Rota: `/guias/minha-casa-minha-vida`

Conteúdo sobre:

- funcionamento do programa;
- faixas de renda;
- subsídio;
- FGTS;
- comparação com financiamento tradicional;
- requisitos gerais;
- perguntas frequentes.

### Guia FGTS

Rota: `/guias/fgts`

Explica como o FGTS pode participar da compra e do financiamento imobiliário.

Inclui orientações sobre:

- consulta do saldo;
- autorização/consulta quando aplicável;
- uso na entrada;
- amortização;
- redução do saldo devedor;
- regras e cuidados relacionados ao saque-aniversário;
- links para os aplicativos oficiais do FGTS em Android e iOS.

Os botões externos seguem o padrão visual verde com texto branco e sem emojis.

### Guia ITBI

Rota: `/guias/itbi`

Explica:

- o que é ITBI;
- competência municipal;
- quem normalmente paga;
- cálculo estimado;
- base de cálculo;
- alíquota municipal;
- momento da compra em que o imposto aparece;
- conferência da guia;
- relação com financiamento e MCMV;
- dúvidas frequentes.

O conteúdo considera que não existe uma alíquota única nacional e deve ser revisado quando houver alterações legislativas relevantes.

## Conteúdo editorial / Blog

Rota principal: `/blog`

O Blog foi criado para concentrar artigos de educação financeira e imobiliária, além de funcionar como canal de SEO e entrada para as calculadoras.

Artigos publicados no código atualmente incluem:

### Como juntar dinheiro para a entrada de um imóvel

Rota: `/guias/como-juntar-entrada-imovel`

Conteúdo ligado diretamente à Calculadora de Entrada. Mostra como transformar o valor faltante em uma meta, escolher prazo, organizar aportes e considerar FGTS e custos paralelos da compra.

### Inadimplência no financiamento imobiliário

Rota: `/guias/inadimplencia-financiamento-imobiliario`

Analisa causas, consequências, riscos e formas de reduzir a chance de inadimplência em contratos de longo prazo.

### Por que o banco considera a renda bruta no financiamento imobiliário?

Rota: `/guias/renda-bruta-financiamento-imobiliario`

Discute a lógica do uso da renda bruta, seus limites e apresenta um veredito editorial sobre quando esse critério faz ou não sentido para avaliar a capacidade financeira real da família.

### SAC ou Price: qual é melhor?

Rota: `/guias/sac-ou-price-qual-melhor`

Compara os sistemas SAC e Price em diferentes cenários:

- entrada maior;
- entrada menor;
- renda mais alta;
- renda próxima do limite;
- renda variável;
- intenção de amortizar;
- intenção de vender ou quitar antecipadamente.

O artigo liga diretamente para as calculadoras de Financiamento e Amortização.

## Integração entre conteúdo e ferramentas

Uma decisão central de UX/SEO é evitar páginas isoladas. Os conteúdos devem conduzir para ferramentas relacionadas e as ferramentas devem oferecer aprofundamento editorial.

Exemplos:

```text
Guia SAC x Price
        ↓
Calculadora de Financiamento
        ↓
Simulador de Amortização
```

```text
Artigo sobre entrada
        ↓
Calculadora de Entrada
        ↓
Calculadora de Financiamento
```

```text
Guia MCMV
        ↓
Calculadora de Faixa MCMV
        ↓
Calculadora de Financiamento
```

```text
Guia ITBI
        ↓
Calculadora de ITBI
```

Essa arquitetura é importante para SEO, tempo de permanência, navegação interna e conversão.

## SEO e conteúdo

As páginas editoriais utilizam títulos e descrições voltados para intenção de busca.

Diretrizes adotadas:

- uma intenção principal por página;
- URLs descritivas;
- linguagem natural;
- links internos entre artigos e ferramentas;
- CTAs contextuais;
- conteúdo evergreen quando possível;
- revisão periódica de taxas, faixas, legislação e dados econômicos;
- uso de fontes oficiais para regras bancárias, FGTS, MCMV e legislação;
- evitar reproduzir notícias ou textos de terceiros.

Está planejada a integração com um CMS para permitir publicação editorial sem alteração direta de código. A arquitetura considerada para automação é:

```text
Fontes / RSS / APIs
        ↓
n8n
        ↓
filtro + deduplicação
        ↓
agente de IA
        ↓
validação factual
        ↓
CMS / rascunho
        ↓
revisão / publicação
        ↓
DescompliCAZA
```

A recomendação de segurança é não fornecer ao agente publicador acesso direto ao GitHub, Easypanel ou código da aplicação.

## Componentes compartilhados

O projeto possui componentes reutilizados pelas páginas, incluindo Header e Footer.

A navegação principal contempla:

- Calculadoras;
- Checklists;
- Guias;
- Blog;
- Sobre;
- CTA para simulação de financiamento.

## Sistema de espaçamento

O arquivo `app/spacing.css` centraliza ajustes globais de espaçamento e densidade visual.

Padrões atuais:

- gaps maiores e consistentes entre cards;
- redução de espaços excessivos entre header e hero;
- banners internos mais compactos;
- comportamento específico para tablet e mobile;
- Home preserva um pouco mais de respiro por funcionar como landing page.

## Estrutura técnica resumida

```text
app/
├── blog/
├── calculadoras/
│   ├── amortizacao/
│   ├── entrada/
│   ├── faixa-minha-casa-minha-vida/
│   ├── financiamento/
│   └── itbi/
├── checklists/
│   └── documentos-mcmv/
├── guias/
│   ├── como-juntar-entrada-imovel/
│   ├── fgts/
│   ├── financiamento/
│   ├── inadimplencia-financiamento-imobiliario/
│   ├── itbi/
│   ├── minha-casa-minha-vida/
│   ├── renda-bruta-financiamento-imobiliario/
│   └── sac-ou-price-qual-melhor/
├── brand.css
├── globals.css
├── layout.tsx
├── page.tsx
└── spacing.css

components/
├── SiteHeader.tsx
└── SiteFooter.tsx

docs/
└── amortizacao-context.md
```

## Rodar localmente

Requisitos:

- Node.js 20.9 ou superior;
- npm.

```bash
npm install
npm run dev
```

Acesse:

```text
http://localhost:3000
```

## Build de produção

```bash
npm run build
npm run start
```

Por padrão, o Next.js inicia na porta `3000`.

## Deploy atual

O projeto utiliza GitHub + Easypanel em VPS.

Fluxo esperado:

```text
alteração no código
      ↓
commit na main
      ↓
GitHub
      ↓
Easypanel / Auto Deploy
      ↓
build Next.js
      ↓
container
      ↓
porta 3000
      ↓
domínio público
```

Quando o Auto Deploy não for acionado, utilizar o **Force Rebuild** no Easypanel e conferir se o `GIT_SHA` do build corresponde ao último commit da branch `main`.

### Configuração de runtime

O `package.json` deve manter Node 20+ porque versões atuais do Next.js exigem runtime moderno.

Scripts principais:

```bash
npm run dev
npm run build
npm run start
```

## Cuidados de conteúdo e compliance

O DescompliCAZA fornece conteúdo educacional e estimativas.

As páginas devem manter avisos adequados quando necessário:

- simulação não representa aprovação de crédito;
- valores bancários podem variar;
- ITBI depende da legislação municipal;
- regras de FGTS podem mudar;
- faixas e condições do MCMV devem ser revisadas periodicamente;
- conteúdo não substitui análise jurídica, bancária ou financeira;
- dados econômicos e notícias devem informar fonte e data;
- evitar promessas como “valor que o banco vai aprovar” quando a ferramenta apenas produz uma estimativa matemática.

## Próximas funcionalidades previstas

O conceito inicial do produto prevê expansão para:

### Calculadoras

- Escritura;
- Registro;
- evolução das calculadoras atuais;
- capacidade de financiamento baseada em renda, quando houver modelo adequado e disclaimers claros.

### Checklists

- documentos gerais da compra;
- visita ao imóvel;
- compra;
- matrícula;
- condomínio;
- entrega.

### Guias

- Escritura;
- Registro;
- Contratos;
- novos conteúdos ligados às dúvidas encontradas por SEO.

### Ferramentas avançadas

```text
Calculadoras + Checklists + Guias
              ↓
      Planejador da Compra
              ↓
        Raio-X do Imóvel
              ↓
         Relatório PDF
```

O objetivo de longo prazo é transformar o site de um conjunto de calculadoras em uma plataforma de apoio à decisão durante toda a jornada de compra do imóvel.

## Princípios para próximas implementações

1. Não duplicar ferramentas quando uma funcionalidade puder ser incorporada de forma clara a uma calculadora existente.
2. Toda calculadora deve explicar o resultado em linguagem humana, não apenas apresentar números.
3. Sempre que possível, mostrar impacto em **reais, meses e anos**.
4. Conteúdo editorial deve apontar para uma ação útil dentro do site.
5. Ferramentas devem apontar para conteúdo que explique os conceitos utilizados.
6. Manter mobile como requisito desde a implementação inicial.
7. Evitar emojis na interface.
8. Não apresentar estimativas como valores oficiais de banco, prefeitura ou governo.
9. Registrar roadmaps complexos em arquivos Markdown dentro de `docs/`.
10. Manter o README atualizado sempre que uma funcionalidade estrutural for adicionada.
