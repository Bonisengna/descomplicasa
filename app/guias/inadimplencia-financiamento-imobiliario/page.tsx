import type { Metadata } from "next";
import { Header } from "@/components/Header";
import styles from "./article.module.css";

export const metadata: Metadata = {
  title: "Inadimplência no financiamento imobiliário: causas e como evitar | Descomplicasa",
  description:
    "Entenda por que a inadimplência no crédito imobiliário voltou a subir em 2026, o que isso muda para quem financia e como reduzir o risco de atraso.",
};

const structuredData = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline:
    "A inadimplência nos financiamentos imobiliários está crescendo. O que isso muda para quem vai comprar um imóvel?",
  description:
    "Dados do Banco Central mostram alta recente da inadimplência acima de 90 dias no financiamento imobiliário com taxas reguladas. Veja o que isso significa para quem vai comprar.",
  datePublished: "2026-08-10",
  dateModified: "2026-08-10",
  author: { "@type": "Organization", name: "Descomplicasa" },
  publisher: { "@type": "Organization", name: "Descomplicasa" },
  mainEntityOfPage: {
    "@type": "WebPage",
    "@id": "/guias/inadimplencia-financiamento-imobiliario",
  },
};

export default function MortgageDelinquencyArticle() {
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
              <span>Leitura de 8 min</span>
            </div>

            <h1>A inadimplência nos financiamentos imobiliários está crescendo. O que isso muda para quem vai comprar um imóvel?</h1>
            <p className={styles.lead}>
              O financiamento da casa própria continua sendo um crédito de longo prazo com garantia forte. Mesmo assim, os atrasos acima de 90 dias voltaram a subir nas linhas imobiliárias reguladas em 2026. Para quem está prestes a assumir um contrato de 20, 30 ou 35 anos, o dado funciona como um aviso: aprovação do banco não é a mesma coisa que conforto no orçamento.
            </p>
          </div>
        </header>

        <div className={`container ${styles.layout}`}>
          <aside className={styles.sidebar}>
            <strong>Neste artigo</strong>
            <a href="#numeros">O que os números mostram</a>
            <a href="#causas">O que aumenta o risco</a>
            <a href="#consequencias">Consequências do atraso</a>
            <a href="#comprador">O que muda para quem compra</a>
            <a href="#evitar">Como reduzir o risco</a>
            <a href="#resumo">Resumo</a>
          </aside>

          <div className={styles.articleBody}>
            <section id="numeros" className={styles.section}>
              <span className={styles.kicker}>Os dados</span>
              <h2>O que os números mostram</h2>
              <p>
                A série do Banco Central para pessoas físicas em <strong>financiamentos imobiliários com taxas reguladas</strong> considera inadimplentes as operações com pelo menos uma parcela em atraso por mais de 90 dias. Ela fechou dezembro de 2025 em 1,08%, subiu para 1,39% em janeiro de 2026, chegou a 1,50% em maio e recuou para 1,29% em junho.
              </p>

              <div className={styles.dataGrid}>
                <div><span>Dez/2025</span><strong>1,08%</strong><small>inadimplência &gt; 90 dias</small></div>
                <div><span>Mai/2026</span><strong>1,50%</strong><small>pico recente da série</small></div>
                <div><span>Jun/2026</span><strong>1,29%</strong><small>último dado disponível</small></div>
              </div>

              <div className={styles.callout}>
                <strong>Uma correção importante.</strong>
                <p>Os dados oficiais não mostram alta de cerca de 0,6 ponto percentual ao longo de 2025 nessa série. O movimento de alta ficou concentrado no início de 2026. Junho trouxe recuo em relação a maio, mas o nível continuou acima do fechamento de 2025.</p>
              </div>

              <p>
                Também é importante não tratar “taxas reguladas” como sinônimo de Minha Casa Minha Vida. A série reúne operações imobiliárias direcionadas e reguladas e ajuda a enxergar o comportamento desse segmento, mas não é uma estatística exclusiva do MCMV.
              </p>

              <p>
                Fora do crédito imobiliário, o ambiente financeiro das famílias está mais pressionado. Segundo a Serasa, junho de 2026 terminou com <strong>83,7 milhões de consumidores negativados</strong>, o maior número da série histórica da empresa. Eram 345,5 milhões de dívidas em aberto, com valor médio devido de R$ 6.920,63 por consumidor; 50,9% da população adulta estava negativada.
              </p>

              <div className={styles.sourceNote}>
                <span>Fontes:</span>
                <a href="https://dadosabertos.bcb.gov.br/dataset/21150-inadimplencia-da-carteira-de-credito-com-recursos-direcionados---pessoas-fisicas---financiame" target="_blank" rel="noopener noreferrer">Banco Central — série SGS 21150 ↗</a>
                <a href="https://www.serasa.com.br/imprensa/inadimplencia-cresce-em-junho-serasa/" target="_blank" rel="noopener noreferrer">Serasa — Mapa da Inadimplência, junho/2026 ↗</a>
              </div>
            </section>

            <section id="causas" className={styles.section}>
              <span className={styles.kicker}>Pressão no orçamento</span>
              <h2>O que aumenta o risco de inadimplência</h2>
              <p>Não existe uma causa única. Na prática, o problema aparece quando uma prestação de longo prazo encontra um orçamento que perdeu margem.</p>

              <div className={styles.reasonList}>
                <article>
                  <span>01</span>
                  <div><h3>Custo de vida consumindo a sobra mensal</h3><p>Alimentação, transporte, energia, condomínio e outros gastos competem com a prestação. Mesmo sem mudança no contrato, a parcela pode ficar mais pesada dentro do orçamento.</p></div>
                </article>
                <article>
                  <span>02</span>
                  <div><h3>Outras dívidas acumuladas</h3><p>Cartão, empréstimo pessoal, financiamento de veículo e parcelamentos reduzem a capacidade de absorver imprevistos. O problema não é só o valor da prestação da casa, mas o conjunto das obrigações.</p></div>
                </article>
                <article>
                  <span>03</span>
                  <div><h3>Comprar usando todo o limite aprovado</h3><p>O banco calcula quanto consegue emprestar dentro dos critérios de crédito. Isso não significa que a prestação máxima aprovada seja confortável para a rotina de cada família.</p></div>
                </article>
                <article>
                  <span>04</span>
                  <div><h3>Mudança na renda familiar</h3><p>Perda de emprego, redução de comissão, fim de renda extra, afastamento ou mudança na composição familiar podem transformar um financiamento antes administrável em um peso difícil de sustentar.</p></div>
                </article>
              </div>
            </section>

            <section id="consequencias" className={styles.section}>
              <span className={styles.kicker}>Quando atrasa</span>
              <h2>As consequências aparecem em etapas</h2>
              <p>As regras exatas dependem do contrato e da instituição, mas o atraso em financiamento imobiliário pode gerar multa e juros de mora, registro em cadastros restritivos e cobrança para regularização.</p>
              <p>Nos contratos com alienação fiduciária, o próprio imóvel serve como garantia da dívida. A CAIXA, por exemplo, informa que, se as parcelas em atraso não forem regularizadas, o imóvel pode chegar a leilão.</p>

              <div className={styles.warningBox}>
                <strong>Não espere a situação escalar.</strong>
                <p>Instituições podem oferecer alternativas de renegociação conforme o contrato. Procurar o banco quando a dificuldade começa tende a abrir mais opções do que deixar várias prestações vencerem.</p>
              </div>

              <div className={styles.sourceNote}>
                <span>Referência:</span>
                <a href="https://www.caixa.gov.br/voce/habitacao/perguntas-frequentes-contrato/Paginas/default.aspx" target="_blank" rel="noopener noreferrer">CAIXA — perguntas frequentes para contratos imobiliários ↗</a>
              </div>
            </section>

            <section id="comprador" className={styles.section}>
              <span className={styles.kicker}>Antes de comprar</span>
              <h2>O que isso muda para quem vai financiar agora</h2>
              <p>O primeiro efeito é comportamental: vale parar de usar a aprovação bancária como único critério para decidir o tamanho da compra.</p>

              <ul className={styles.checkList}>
                <li><strong>Mais margem vale mais que mais imóvel.</strong> Uma prestação menor deixa espaço para condomínio, manutenção, impostos e imprevistos.</li>
                <li><strong>Histórico de crédito organizado ganha importância.</strong> Bancos definem taxas e condições conforme perfil, entrada, garantias e política de crédito.</li>
                <li><strong>Entrada maior reduz exposição.</strong> Financiar menos diminui saldo devedor, juros totais e pressão da prestação.</li>
                <li><strong>MCMV reduz custo, não elimina risco.</strong> Para quem se enquadra, juros menores e eventual subsídio ajudam bastante, mas o contrato ainda precisa caber no orçamento ao longo dos anos.</li>
              </ul>

              <p>
                Também podem aparecer oportunidades em imóveis de proprietários que precisam vender rapidamente. Mas “venda urgente” não significa compra simples: saldo do financiamento existente, autorização do credor, matrícula, gravames e forma de quitação precisam ser verificados antes de qualquer sinal ou pagamento.
              </p>
            </section>

            <section id="evitar" className={styles.section}>
              <span className={styles.kicker}>Planejamento</span>
              <h2>Como reduzir o risco de cair na inadimplência</h2>
              <div className={styles.steps}>
                <article><strong>1</strong><div><h3>Simule com folga</h3><p>Teste uma prestação abaixo do máximo que você conseguiria assumir e veja o efeito no orçamento mensal.</p></div></article>
                <article><strong>2</strong><div><h3>Monte uma reserva antes de assinar</h3><p>Guardar alguns meses de prestações cria tempo para reagir a uma queda temporária de renda.</p></div></article>
                <article><strong>3</strong><div><h3>Faça um teste de estresse</h3><p>Pergunte se o financiamento continuaria pagável com queda de renda, aumento de condomínio ou uma despesa inesperada.</p></div></article>
                <article><strong>4</strong><div><h3>Evite crédito caro junto com a casa</h3><p>Rotativo do cartão e empréstimos de curto prazo podem consumir rapidamente a margem que deveria proteger o financiamento.</p></div></article>
                <article><strong>5</strong><div><h3>Use o FGTS quando fizer sentido</h3><p>Em contratos elegíveis, o FGTS pode ser usado para amortizar saldo, liquidar o financiamento ou pagar parte das prestações, respeitando as regras vigentes.</p></div></article>
                <article><strong>6</strong><div><h3>Procure o banco cedo</h3><p>Ao primeiro sinal de dificuldade persistente, consulte as alternativas disponíveis para o seu contrato antes de acumular atrasos.</p></div></article>
              </div>
            </section>

            <section id="resumo" className={styles.section}>
              <span className={styles.kicker}>Em uma frase</span>
              <h2>O financiamento precisa sobreviver aos meses ruins, não apenas caber nos meses bons.</h2>
              <p>
                A inadimplência imobiliária regulada segue em nível relativamente baixo, mas voltou a subir no início de 2026. Ao mesmo tempo, a inadimplência geral das famílias atingiu recordes. Para quem vai comprar, a mensagem é simples: financiar com margem, manter reserva e entender o contrato importa tanto quanto conseguir aprovação.
              </p>
            </section>

            <section className={styles.cta}>
              <div>
                <span>Faça as contas antes de decidir</span>
                <h2>Veja como a parcela muda com entrada, prazo e juros.</h2>
              </div>
              <div className={styles.ctaActions}>
                <a className="button" href="/calculadoras/financiamento">Simular financiamento →</a>
                <a href="/calculadoras/faixa-minha-casa-minha-vida">Descobrir minha faixa MCMV</a>
              </div>
            </section>

            <section className={styles.sources}>
              <h2>Fontes e revisão editorial</h2>
              <p>Dados revisados em 10 de agosto de 2026. Estatísticas de inadimplência mudam mensalmente.</p>
              <ul>
                <li>Banco Central do Brasil — SGS 21150: inadimplência acima de 90 dias em financiamento imobiliário com taxas reguladas para pessoas físicas.</li>
                <li>Serasa — Mapa da Inadimplência e Renegociação de Dívidas, junho de 2026.</li>
                <li>CAIXA — perguntas frequentes e alternativas para contratos habitacionais em atraso.</li>
              </ul>
            </section>
          </div>
        </div>
      </article>

      <section className={styles.disclaimer}>
        <div className="container">Conteúdo informativo e educacional. Não constitui aconselhamento financeiro, jurídico ou recomendação individual de crédito.</div>
      </section>

      <footer className="footer">
        <div className="container footer-inner">
          <a className="footer-brand" href="/"><span className="brand-dot" /> DESCOMPLICASA</a>
          <p>© 2026 Descomplicasa.</p>
        </div>
      </footer>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
    </main>
  );
}
