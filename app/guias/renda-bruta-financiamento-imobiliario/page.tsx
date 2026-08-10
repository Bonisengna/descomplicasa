import type { Metadata } from "next";
import { Header } from "@/components/Header";
import styles from "../inadimplencia-financiamento-imobiliario/article.module.css";

export const metadata: Metadata = {
  title: "Renda bruta no financiamento imobiliário: por que o banco usa? | Descomplicasa",
  description:
    "Entenda por que os bancos consideram a renda bruta no financiamento imobiliário, onde esse critério faz sentido e por que ele não basta para saber se a parcela cabe no orçamento.",
};

const structuredData = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Por que é considerada a renda bruta no financiamento imobiliário? Isso é correto?",
  description:
    "Entenda por que bancos e programas habitacionais usam renda bruta, as limitações desse critério e como avaliar a capacidade real de pagamento.",
  datePublished: "2026-08-10",
  dateModified: "2026-08-10",
  author: { "@type": "Organization", name: "Descomplicasa" },
  publisher: { "@type": "Organization", name: "Descomplicasa" },
  mainEntityOfPage: {
    "@type": "WebPage",
    "@id": "/guias/renda-bruta-financiamento-imobiliario",
  },
};

export default function GrossIncomeArticle() {
  return (
    <main id="top">
      <Header />

      <article>
        <header className={styles.hero}>
          <div className={`container ${styles.heroInner}`}>
            <nav className={styles.breadcrumb} aria-label="Navegação estrutural">
              <a href="/">Início</a><span>/</span><a href="/blog">Blog</a><span>/</span><strong>Financiamento</strong>
            </nav>

            <div className={styles.meta}>
              <span>Financiamento</span>
              <time dateTime="2026-08-10">10 de agosto de 2026</time>
              <span>Leitura de 7 min</span>
            </div>

            <h1>Por que é considerada a renda bruta no financiamento imobiliário? Isso é correto?</h1>
            <p className={styles.lead}>
              Você recebe um valor no holerite, mas uma parte desaparece antes mesmo de chegar à conta. Ainda assim, quando o banco analisa um financiamento imobiliário, é comum que o comprometimento seja calculado sobre a renda bruta. Parece contraditório — e, dependendo de como esse número é interpretado, pode ser mesmo.
            </p>
          </div>
        </header>

        <div className={`container ${styles.layout}`}>
          <aside className={styles.sidebar}>
            <strong>Neste artigo</strong>
            <a href="#bruta-liquida">Renda bruta x líquida</a>
            <a href="#por-que">Por que o banco usa</a>
            <a href="#trinta">A regra dos 30%</a>
            <a href="#mcmv">E no MCMV?</a>
            <a href="#problema">Onde o critério falha</a>
            <a href="#veredito">Veredito</a>
          </aside>

          <div className={styles.articleBody}>
            <section id="bruta-liquida" className={styles.section}>
              <span className={styles.kicker}>Primeiro, os conceitos</span>
              <h2>Renda bruta não é o dinheiro que sobra para pagar a prestação</h2>
              <p>
                <strong>Renda bruta</strong> é o valor recebido antes de descontos como INSS, Imposto de Renda, pensão, consignados e outros abatimentos. <strong>Renda líquida</strong> é o que efetivamente chega à conta depois desses descontos.
              </p>
              <p>
                Para o orçamento doméstico, a renda líquida é muito mais próxima da realidade. É dela que saem alimentação, transporte, escola, condomínio, energia, cartão de crédito e a própria prestação do imóvel.
              </p>
            </section>

            <section id="por-que" className={styles.section}>
              <span className={styles.kicker}>A lógica do banco</span>
              <h2>Então por que usar a renda bruta?</h2>
              <p>Existem razões práticas para isso. A renda bruta funciona como uma base padronizada e verificável. Ela permite comparar perfis diferentes sem depender da estrutura específica de descontos de cada pessoa.</p>

              <div className={styles.reasonList}>
                <article>
                  <span>01</span>
                  <div><h3>É uma referência mais padronizada</h3><p>Dois trabalhadores com o mesmo salário bruto podem ter descontos líquidos diferentes por causa de benefícios, consignados, dependentes ou outras situações. Usar a base bruta facilita a comparação inicial.</p></div>
                </article>
                <article>
                  <span>02</span>
                  <div><h3>É mais fácil de comprovar</h3><p>Holerites, declarações de renda e documentos fiscais normalmente apresentam a remuneração bruta de forma objetiva, o que ajuda a instituição a validar os dados apresentados.</p></div>
                </article>
                <article>
                  <span>03</span>
                  <div><h3>Programas habitacionais usam renda bruta para enquadramento</h3><p>No Minha Casa Minha Vida, por exemplo, as faixas urbanas são definidas pela renda familiar mensal bruta. Essa renda influencia enquadramento, juros e possibilidade de subsídio.</p></div>
                </article>
                <article>
                  <span>04</span>
                  <div><h3>É só uma parte da análise</h3><p>O Banco Central explica que, antes de liberar o crédito, o banco também verifica outras dívidas, despesas mensais, valor solicitado e prazo. Portanto, o percentual sobre a renda não deveria ser analisado isoladamente.</p></div>
                </article>
              </div>
            </section>

            <section id="trinta" className={styles.section}>
              <span className={styles.kicker}>O número mais repetido</span>
              <h2>“A parcela pode comprometer até 30% da renda.” Mas 30% de quê?</h2>
              <p>
                A CAIXA informa que, em suas linhas de financiamento imobiliário, a parcela pode chegar a até 30% da renda familiar bruta. O Banco Central, por sua vez, informa que cada instituição trabalha com seu próprio percentual de comprometimento e que, em geral, ele não ultrapassa 30% da renda.
              </p>

              <div className={styles.callout}>
                <strong>O ponto que muita gente perde:</strong>
                <p>30% é um parâmetro de análise de crédito. Não é uma recomendação de que toda família deva gastar 30% da renda bruta com moradia.</p>
              </div>

              <p>Veja um exemplo apenas para entender a diferença. Imagine uma família com renda bruta de R$ 8.000 e renda líquida de R$ 6.400. Uma prestação de R$ 2.400 representa 30% da renda bruta, mas 37,5% da renda líquida.</p>

              <div className={styles.dataGrid}>
                <div><span>Renda bruta</span><strong>R$ 8.000</strong><small>base usada no exemplo</small></div>
                <div><span>30% da bruta</span><strong>R$ 2.400</strong><small>prestação hipotética</small></div>
                <div><span>Sobre R$ 6.400 líquidos</span><strong>37,5%</strong><small>peso real antes de outros gastos</small></div>
              </div>

              <p>Esse exemplo não significa que toda renda líquida seja 80% da bruta. A proporção varia de pessoa para pessoa. Ele serve apenas para mostrar como a mesma prestação pode parecer confortável em uma métrica e pesada em outra.</p>
            </section>

            <section id="mcmv" className={styles.section}>
              <span className={styles.kicker}>Minha Casa Minha Vida</span>
              <h2>No MCMV, renda bruta também define a faixa</h2>
              <p>
                O Ministério das Cidades classifica as famílias urbanas do Minha Casa Minha Vida pela <strong>renda familiar mensal bruta</strong>. Em 2026, o programa atende famílias com renda de até R$ 13 mil por mês, distribuídas entre Faixa 1, Faixa 2, Faixa 3 e Classe Média.
              </p>
              <p>
                Isso faz sentido para criar uma regra nacional de enquadramento: o programa precisa de uma base objetiva para decidir quem entra em cada faixa. Mas estar dentro de uma faixa não significa automaticamente que a prestação calculada para aquela família seja confortável.
              </p>
              <div className={styles.sourceNote}>
                <span>Ferramenta:</span>
                <a href="/calculadoras/faixa-minha-casa-minha-vida">Descubra sua faixa do MCMV →</a>
              </div>
            </section>

            <section id="problema" className={styles.section}>
              <span className={styles.kicker}>A limitação</span>
              <h2>Onde usar apenas a renda bruta pode enganar</h2>
              <p>A renda bruta responde à pergunta “quanto essa família ganha antes dos descontos?”. Ela não responde sozinha à pergunta mais importante: “quanto sobra todos os meses para sustentar um financiamento por décadas?”.</p>

              <div className={styles.reasonList}>
                <article>
                  <span>01</span>
                  <div><h3>Descontos obrigatórios reduzem o caixa disponível</h3><p>INSS, Imposto de Renda, pensão e outros descontos podem fazer a renda disponível ficar significativamente abaixo da renda usada no cálculo inicial.</p></div>
                </article>
                <article>
                  <span>02</span>
                  <div><h3>O custo do imóvel não termina na prestação</h3><p>Condomínio, IPTU, seguros, manutenção, água, energia e deslocamento também entram no custo mensal de morar naquele imóvel.</p></div>
                </article>
                <article>
                  <span>03</span>
                  <div><h3>Famílias com a mesma renda podem ter realidades completamente diferentes</h3><p>Uma família sem filhos e sem dívidas pode ter muito mais folga do que outra com dependentes, veículo financiado, escola e despesas médicas, mesmo que ambas tenham a mesma renda bruta.</p></div>
                </article>
                <article>
                  <span>04</span>
                  <div><h3>A aprovação mede risco para o banco, não conforto para a família</h3><p>O objetivo da análise de crédito é decidir se a operação cabe nos critérios de risco da instituição. O seu objetivo deve ser diferente: descobrir se a prestação continua sustentável quando a vida não acontece exatamente como planejado.</p></div>
                </article>
              </div>
            </section>

            <section className={styles.section}>
              <span className={styles.kicker}>Antes de assinar</span>
              <h2>Qual renda você deveria usar no seu próprio planejamento?</h2>
              <p>Para decidir quanto cabe no seu orçamento, faz mais sentido partir da <strong>renda líquida recorrente</strong> e depois descontar despesas essenciais, outras dívidas e uma margem para imprevistos.</p>
              <p>Não existe um percentual único que seja seguro para todas as famílias. Uma parcela que representa 25% da renda líquida pode ser pesada para alguém com muitas despesas fixas e tranquila para outra pessoa com baixo custo mensal.</p>

              <div className={styles.callout}>
                <strong>Troque a pergunta.</strong>
                <p>Em vez de perguntar “qual é a maior parcela que o banco aprova?”, pergunte “qual parcela eu consigo continuar pagando se meu orçamento piorar por alguns meses?”.</p>
              </div>
            </section>

            <section id="veredito" className={styles.section}>
              <span className={styles.kicker}>Veredito Descomplicasa</span>
              <h2>Considerar a renda bruta é correto?</h2>
              <div className={styles.callout}>
                <strong>Sim como ponto de partida. Não como resposta final.</strong>
                <p>Para o banco e para programas como o MCMV, a renda bruta é uma referência objetiva, comparável e fácil de comprovar. Como critério de enquadramento e primeira etapa da análise, ela faz sentido.</p>
              </div>
              <p>
                O problema começa quando o comprador interpreta o limite aprovado sobre a renda bruta como prova de que aquela prestação cabe no bolso. <strong>A renda bruta mede capacidade formal; a renda líquida e o orçamento real medem capacidade prática.</strong>
              </p>
              <p>
                Portanto, o critério não é “errado”. Ele é incompleto quando usado sozinho. O banco deve avaliar risco de crédito; você precisa avaliar sustentabilidade financeira.
              </p>
            </section>

            <section className={styles.nextStep}>
              <div>
                <span>Teste no seu cenário</span>
                <h2>Veja o peso da prestação antes de decidir.</h2>
                <p>Use a calculadora do Descomplicasa para testar entrada, prazo, taxa e valor financiado. Depois compare a parcela encontrada com a sua renda líquida e com as despesas reais da família.</p>
              </div>
              <a className="button" href="/calculadoras/financiamento">Simular financiamento →</a>
            </section>

            <section className={styles.sources}>
              <h2>Fontes oficiais</h2>
              <p>As referências abaixo sustentam as regras e práticas mencionadas neste artigo.</p>
              <div>
                <a href="https://www.caixa.gov.br/voce/habitacao/financiamento-de-imoveis/Paginas/default.aspx" target="_blank" rel="noopener noreferrer">CAIXA — financiamento de imóveis ↗</a>
                <a href="https://www.bcb.gov.br/meubc/faqs/p/renda-necessaria-para-financiar-um-imovel" target="_blank" rel="noopener noreferrer">Banco Central — renda necessária para financiar ↗</a>
                <a href="https://www.gov.br/cidades/pt-br/acesso-a-informacao/acoes-e-programas/habitacao/programa-minha-casa-minha-vida/sobre-o-minha-casa-minha-vida-1" target="_blank" rel="noopener noreferrer">Ministério das Cidades — MCMV ↗</a>
              </div>
            </section>
          </div>
        </div>
      </article>

      <section className={styles.disclaimer}>
        <div className="container">Conteúdo informativo. Não constitui aconselhamento financeiro nem substitui a análise individual do orçamento ou da instituição financeira.</div>
      </section>

      <footer className="footer">
        <div className="container footer-inner">
          <a className="footer-brand" href="/"><span className="brand-dot" /> DESCOMPLICASA</a>
          <p>© 2026 Descomplicasa.</p>
        </div>
      </footer>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
    </main>
  );
}
