import type { Metadata } from "next";
import { Header } from "@/components/Header";
import styles from "../minha-casa-minha-vida/mcmv.module.css";

export const metadata: Metadata = {
  title: "ITBI: o que é, como calcular e quando pagar | DescompliCAZA",
  description:
    "Entenda o ITBI na compra do imóvel: quem cobra, como é calculado, por que a alíquota varia por município, base de cálculo, pagamento e cuidados com a guia.",
};

const faq = [
  {
    question: "O ITBI tem a mesma alíquota em todo o Brasil?",
    answer:
      "Não. O ITBI é de competência municipal e a alíquota, as reduções, as isenções, os prazos e o procedimento de emissão da guia dependem da legislação do município onde o imóvel está localizado.",
  },
  {
    question: "O ITBI é calculado sobre o valor do IPTU?",
    answer:
      "Não automaticamente. O CTN define a base como o valor venal do bem ou direito transmitido, entendido como o valor pelo qual seria negociado à vista em condições normais de mercado. O Tema 1.113 do STJ também afastou a vinculação automática à base do IPTU.",
  },
  {
    question: "Quem paga o ITBI: comprador ou vendedor?",
    answer:
      "O CTN permite que a legislação defina qualquer das partes da operação como contribuinte. Na prática, é comum que a lei municipal atribua o pagamento ao adquirente, mas é necessário conferir a regra do município do imóvel.",
  },
  {
    question: "Financiamento imobiliário elimina o ITBI?",
    answer:
      "Não como regra geral. A compra financiada continua podendo gerar ITBI. Alguns municípios preveem alíquotas reduzidas, isenções ou tratamentos específicos para determinadas operações, por isso a legislação local deve ser consultada.",
  },
  {
    question: "Minha Casa Minha Vida é sempre isento de ITBI?",
    answer:
      "Não existe uma isenção nacional automática aplicável a toda compra pelo Minha Casa Minha Vida. Benefícios de ITBI dependem da legislação municipal e do enquadramento da operação.",
  },
  {
    question: "Quando o imóvel passa para o meu nome?",
    answer:
      "Pelo Código Civil, a propriedade imobiliária entre vivos é transferida com o registro do título no Registro de Imóveis. O procedimento e o momento de recolhimento do ITBI devem ser conferidos na legislação e no sistema do município.",
  },
];

const structuredData = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faq.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: { "@type": "Answer", text: item.answer },
  })),
};

export default function ItbiGuidePage() {
  return (
    <main id="top">
      <Header />

      <section className={styles.hero}>
        <div className="container">
          <nav className={styles.breadcrumb} aria-label="Navegação estrutural">
            <a href="/">Início</a><span>/</span><a href="/#guias">Guias</a><span>/</span><strong>ITBI</strong>
          </nav>

          <div className={styles.heroGrid}>
            <div>
              <span className={styles.kicker}>Guia prático</span>
              <h1>ITBI sem sustos na compra do imóvel</h1>
              <p>Entenda de onde vem esse custo, como estimar o valor e o que conferir antes de emitir ou pagar a guia.</p>
            </div>

            <aside className={styles.updateCard}>
              <span>Ponto principal</span>
              <strong>Não existe uma alíquota nacional única de ITBI.</strong>
              <p>O imposto é municipal. A regra válida é a do município onde o imóvel está localizado.</p>
            </aside>
          </div>
        </div>
      </section>

      <div className={`container ${styles.layout}`}>
        <aside className={styles.toc} aria-label="Nesta página">
          <strong>Nesta página</strong>
          <a href="#o-que-e">O que é o ITBI</a>
          <a href="#quem-cobra">Quem cobra e quem paga</a>
          <a href="#calculo">Como calcular</a>
          <a href="#base">Base de cálculo</a>
          <a href="#aliquota">Alíquota municipal</a>
          <a href="#quando">Quando pagar</a>
          <a href="#financiamento">Financiamento e MCMV</a>
          <a href="#conferir">O que conferir na guia</a>
          <a href="#faq">Perguntas frequentes</a>
        </aside>

        <article className={styles.article}>
          <section id="o-que-e" className={styles.section}>
            <span className={styles.sectionNumber}>01</span>
            <h2>O que é o ITBI</h2>
            <p>ITBI é o Imposto sobre a Transmissão Inter Vivos, por ato oneroso, de bens imóveis e de direitos a eles relativos. A compra e venda de uma casa, apartamento ou terreno é o exemplo mais comum de operação em que ele aparece.</p>
            <p>A Constituição Federal atribui aos municípios a competência para instituir esse imposto. Por isso, duas compras de mesmo valor em cidades diferentes podem ter custos e procedimentos diferentes.</p>

            <div className={styles.callout}>
              <strong>ITBI não é IPTU.</strong>
              <p>O IPTU é um imposto periódico ligado à propriedade urbana. O ITBI está relacionado à transmissão onerosa do imóvel ou de direitos sobre ele.</p>
            </div>
          </section>

          <section id="quem-cobra" className={styles.section}>
            <span className={styles.sectionNumber}>02</span>
            <h2>Quem cobra e quem deve pagar</h2>
            <p>O ITBI pertence ao município onde o imóvel está localizado. Não importa onde comprador e vendedor moram ou onde o contrato foi assinado: para saber a regra, consulte a prefeitura da localização do bem.</p>
            <p>O Código Tributário Nacional estabelece que o contribuinte pode ser qualquer das partes da operação, conforme definido em lei. Em muitas cidades, o adquirente é indicado como responsável, mas isso deve ser confirmado na legislação municipal.</p>

            <div className={styles.requirements}>
              <h3>Primeira pergunta antes de fazer qualquer conta</h3>
              <p>Em qual município está o imóvel? Essa resposta define onde consultar alíquota, benefícios, sistema de emissão, documentos e prazo de pagamento.</p>
            </div>
          </section>

          <section id="calculo" className={styles.section}>
            <span className={styles.sectionNumber}>03</span>
            <h2>Como estimar o ITBI</h2>
            <p>A conta básica é simples, mas os dois números usados nela precisam estar corretos.</p>

            <div className={styles.callout}>
              <strong>Base de cálculo × alíquota aplicável = ITBI estimado.</strong>
              <p>Reduções, faixas, isenções ou regras específicas previstas pelo município podem alterar o resultado final.</p>
            </div>

            <div className={styles.limitGrid}>
              <div><span>Exemplo</span><strong>R$ 300.000</strong><small>base apenas ilustrativa</small></div>
              <div><span>Alíquota hipotética</span><strong>2,5%</strong><small>não é uma taxa nacional</small></div>
              <div><span>ITBI ilustrativo</span><strong>R$ 7.500</strong><small>300.000 × 2,5%</small></div>
            </div>

            <p>Não use esse exemplo como orçamento da sua compra. Antes de reservar dinheiro, consulte a prefeitura e simule com a regra vigente para o imóvel específico.</p>
          </section>

          <section id="base" className={styles.section}>
            <span className={styles.sectionNumber}>04</span>
            <h2>Qual valor entra na base de cálculo</h2>
            <p>Em 2026, o Código Tributário Nacional passou a detalhar que o valor venal, para fins de ITBI, corresponde ao valor pelo qual o bem ou direito seria negociado à vista em condições normais de mercado.</p>
            <p>O CTN também passou a prever que a estimativa municipal deve usar critérios técnicos, como preços praticados no mercado, dados de cartórios e agentes financeiros, localização, tipologia, padrão, área e outras características do imóvel. O município deve divulgar os critérios e permitir contestação pelo contribuinte em procedimento específico.</p>

            <div className={styles.callout}>
              <strong>Valor do IPTU não é piso automático do ITBI.</strong>
              <p>No Tema 1.113, o STJ definiu que a base do ITBI não está vinculada à base do IPTU e que o valor declarado na transação possui presunção de compatibilidade com o mercado, sem impedir revisão pelo fisco mediante procedimento administrativo.</p>
            </div>

            <div className={styles.requirements}>
              <h3>E se a prefeitura chegar a um valor muito diferente?</h3>
              <p>Não ignore a diferença. Verifique os critérios usados, a legislação local e o procedimento de contestação. Em casos relevantes, pode ser necessário apoio tributário ou jurídico para analisar a cobrança.</p>
            </div>
          </section>

          <section id="aliquota" className={styles.section}>
            <span className={styles.sectionNumber}>05</span>
            <h2>A alíquota depende do município</h2>
            <p>Não existe uma porcentagem única válida para todo o Brasil. Cada município possui sua legislação e pode adotar alíquota geral, faixas, tratamentos diferenciados ou benefícios para determinadas situações.</p>

            <div className={styles.reasonList}>
              <article><span>01</span><div><h3>Consulte a prefeitura oficial</h3><p>Procure a página de ITBI, legislação tributária ou portal de serviços do município do imóvel.</p></div></article>
              <article><span>02</span><div><h3>Veja se existe regra específica</h3><p>Financiamento, programas habitacionais, primeiro imóvel ou determinadas faixas de valor podem receber tratamento diferente em alguns municípios.</p></div></article>
              <article><span>03</span><div><h3>Confira a data da regra</h3><p>Alíquota, faixas e benefícios podem mudar. Evite usar tabelas antigas encontradas em blogs ou anúncios.</p></div></article>
            </div>
          </section>

          <section id="quando" className={styles.section}>
            <span className={styles.sectionNumber}>06</span>
            <h2>Quando o ITBI entra no processo de compra</h2>
            <p>Pelo Código Civil, a propriedade do imóvel é transferida entre vivos com o registro do título no Registro de Imóveis. Na jornada prática da compra, a guia e a comprovação do ITBI normalmente fazem parte da preparação para escritura e/ou registro.</p>
            <p>O momento exato de emissão, vencimento e recolhimento depende do procedimento municipal e do tipo de título usado na operação. Em uma compra financiada, o contrato bancário pode exercer função de título para registro, conforme a modalidade.</p>

            <div className={styles.reasonList}>
              <article><span>01</span><div><h3>Negociação e análise</h3><p>Preço, forma de pagamento, crédito e documentação são definidos e verificados.</p></div></article>
              <article><span>02</span><div><h3>Emissão da guia</h3><p>Os dados da operação são informados ao município conforme o procedimento local.</p></div></article>
              <article><span>03</span><div><h3>Pagamento e comprovação</h3><p>O recolhimento segue o prazo e as condições da guia municipal.</p></div></article>
              <article><span>04</span><div><h3>Registro do título</h3><p>O título é apresentado ao Registro de Imóveis para a transferência da propriedade, observadas as exigências do caso.</p></div></article>
            </div>
          </section>

          <section id="financiamento" className={styles.section}>
            <span className={styles.sectionNumber}>07</span>
            <h2>Financiamento e Minha Casa Minha Vida</h2>
            <p>Financiar o imóvel não elimina automaticamente o ITBI. O imposto continua fazendo parte do planejamento da compra, salvo quando a legislação aplicável prevê benefício específico.</p>
            <p>O mesmo cuidado vale para o Minha Casa Minha Vida: não trate “MCMV = ITBI grátis” como regra nacional. Isenções e reduções dependem da legislação municipal e do enquadramento concreto da operação.</p>

            <div className={styles.callout}>
              <strong>Não conte com desconto antes de confirmar.</strong>
              <p>Se houver benefício municipal, considere-o no orçamento apenas depois de verificar os requisitos e a forma de solicitação.</p>
            </div>

            <div className={styles.sourceNote}>
              <span>Planejamento:</span>
              <a href="/calculadoras/entrada">Organize entrada, FGTS, subsídio e financiamento</a>
            </div>
          </section>

          <section id="conferir" className={styles.section}>
            <span className={styles.sectionNumber}>08</span>
            <h2>O que conferir antes de pagar a guia</h2>
            <ul className={styles.bullets}>
              <li><strong>Município correto:</strong> a guia deve corresponder ao local onde está o imóvel.</li>
              <li><strong>Dados do imóvel:</strong> inscrição imobiliária, endereço, matrícula ou identificação usada pelo município.</li>
              <li><strong>Partes da operação:</strong> nomes e documentos do comprador e do vendedor.</li>
              <li><strong>Natureza da transmissão:</strong> compra e venda, cessão, permuta ou outra hipótese aplicável.</li>
              <li><strong>Base de cálculo:</strong> veja qual valor foi usado e como ele foi determinado.</li>
              <li><strong>Alíquota:</strong> confirme se corresponde à regra e a eventuais benefícios aplicáveis.</li>
              <li><strong>Valor final:</strong> refaça a conta e verifique se existem acréscimos, multa ou juros.</li>
              <li><strong>Vencimento:</strong> confirme até quando a guia pode ser paga e se há prazo de validade.</li>
            </ul>

            <div className={styles.requirements}>
              <h3>Pagou? Guarde a comprovação.</h3>
              <p>O comprovante e a guia fazem parte da documentação da compra. Salve uma cópia digital junto aos demais documentos do imóvel.</p>
            </div>
          </section>

          <section id="faq" className={styles.section}>
            <span className={styles.sectionNumber}>09</span>
            <h2>Perguntas frequentes</h2>
            <div className={styles.faq}>
              {faq.map((item) => (
                <details key={item.question} className={styles.faqItem}>
                  <summary>{item.question}<span aria-hidden="true">+</span></summary>
                  <p>{item.answer}</p>
                </details>
              ))}
            </div>
          </section>

          <section className={styles.nextStep}>
            <div>
              <span>Próximo passo</span>
              <h2>Inclua o ITBI no dinheiro que precisa ter para comprar.</h2>
              <p>Entrada não é o único custo inicial. Organize seus recursos e deixe margem para imposto, registro e outras despesas da operação.</p>
            </div>
            <a className="button" href="/calculadoras/entrada">Planejar minha entrada</a>
          </section>

          <section className={styles.sources}>
            <h2>Fontes oficiais</h2>
            <p>Conteúdo revisado em 11 de agosto de 2026. Para alíquota, benefícios, emissão e vencimento, consulte também a prefeitura do município do imóvel.</p>
            <div>
              <a href="https://www.planalto.gov.br/ccivil_03/constituicao/constituicaocompilado.htm" target="_blank" rel="noopener noreferrer">Constituição Federal — art. 156</a>
              <a href="https://www.planalto.gov.br/ccivil_03/leis/l5172compilado.htm" target="_blank" rel="noopener noreferrer">Código Tributário Nacional — ITBI</a>
              <a href="https://processo.stj.jus.br/repetitivos/temas_repetitivos/pesquisa.jsp?cod_tema_inicial=1113&cod_tema_final=1113&tipo_pesquisa=T" target="_blank" rel="noopener noreferrer">STJ — Tema Repetitivo 1.113</a>
              <a href="https://www.planalto.gov.br/ccivil_03/leis/2002/l10406compilada.htm" target="_blank" rel="noopener noreferrer">Código Civil — registro da propriedade</a>
            </div>
          </section>
        </article>
      </div>

      <section className={styles.disclaimer}>
        <div className="container">Conteúdo informativo. Regras de ITBI variam por município e podem envolver particularidades tributárias e registrais. Confirme a legislação vigente antes do pagamento.</div>
      </section>

      <footer className="footer">
        <div className="container footer-inner">
          <a className="footer-brand" href="/">DescompliCAZA</a>
          <p>© 2026 DescompliCAZA.</p>
        </div>
      </footer>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
    </main>
  );
}
