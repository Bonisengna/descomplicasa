import type { Metadata } from "next";
import { Header } from "@/components/Header";
import styles from "../inadimplencia-financiamento-imobiliario/article.module.css";

export const metadata: Metadata = {
  title: "Como juntar dinheiro para a entrada de um imóvel | DescompliCAZA",
  description:
    "Veja um plano prático para organizar a entrada do imóvel, definir uma meta mensal, usar FGTS quando elegível e não esquecer dos custos da compra.",
};

const structuredData = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Como juntar dinheiro para a entrada de um imóvel: um plano prático",
  description:
    "Um passo a passo para transformar o valor que falta para a entrada em uma meta mensal realista.",
  datePublished: "2026-08-10",
  dateModified: "2026-08-10",
  author: { "@type": "Organization", name: "DescompliCAZA" },
  publisher: { "@type": "Organization", name: "DescompliCAZA" },
  mainEntityOfPage: {
    "@type": "WebPage",
    "@id": "/guias/como-juntar-entrada-imovel",
  },
};

export default function EntrySavingsArticle() {
  return (
    <main id="top">
      <Header />

      <article>
        <header className={styles.hero}>
          <div className={`container ${styles.heroInner}`}>
            <nav className={styles.breadcrumb} aria-label="Navegação estrutural">
              <a href="/">Início</a><span>/</span><a href="/blog">Blog</a><span>/</span><strong>Planejamento</strong>
            </nav>

            <div className={styles.meta}>
              <span>Planejamento</span>
              <time dateTime="2026-08-10">10 de agosto de 2026</time>
              <span>Leitura de 6 min</span>
            </div>

            <h1>Como juntar dinheiro para a entrada de um imóvel: um plano prático</h1>
            <p className={styles.lead}>
              A entrada parece um número enorme quando vista de uma vez. Ela fica mais administrável quando você separa o que já tem, descobre o valor que realmente falta e transforma essa diferença em uma meta mensal com prazo definido.
            </p>
          </div>
        </header>

        <div className={`container ${styles.layout}`}>
          <aside className={styles.sidebar}>
            <strong>Neste artigo</strong>
            <a href="#descubra">Descubra quanto falta</a>
            <a href="#prazo">Transforme em meta mensal</a>
            <a href="#automatize">Automatize a meta</a>
            <a href="#fgts">Considere o FGTS</a>
            <a href="#custos">Não esqueça os custos</a>
            <a href="#ajuste">Ajuste o plano</a>
          </aside>

          <div className={styles.articleBody}>
            <section id="descubra" className={styles.section}>
              <span className={styles.kicker}>Passo 1</span>
              <h2>Primeiro, descubra qual é a diferença real</h2>
              <p>Não comece pela pergunta “quanto preciso juntar?”. Comece montando a compra inteira: preço do imóvel, recursos próprios, FGTS utilizável, eventual subsídio e valor de financiamento aprovado ou estimado.</p>
              <p>A diferença entre o preço do imóvel e esses recursos mostra o valor que ainda precisa ser resolvido. Esse número é muito mais útil do que trabalhar com uma porcentagem genérica de entrada.</p>

              <div className={styles.callout}>
                <strong>Use números separados.</strong>
                <p>Dinheiro próprio, FGTS, subsídio e financiamento têm regras diferentes. Somar tudo sem identificar a origem pode criar a impressão de que você tem mais entrada disponível do que realmente terá na contratação.</p>
              </div>

              <div className={styles.sourceNote}>
                <span>Ferramenta:</span>
                <a href="/calculadoras/entrada">Calcule quanto falta para a sua compra</a>
              </div>
            </section>

            <section id="prazo" className={styles.section}>
              <span className={styles.kicker}>Passo 2</span>
              <h2>Transforme a diferença em uma meta mensal</h2>
              <p>Depois de descobrir o valor que falta, escolha um prazo. A conta mais simples é dividir a diferença pelo número de meses disponíveis. Isso não considera rendimentos e serve como uma referência conservadora para o planejamento.</p>

              <div className={styles.reasonList}>
                <article><span>12</span><div><h3>Prazo curto</h3><p>Exige uma contribuição mensal maior, mas permite visualizar rapidamente se a compra planejada está compatível com sua renda atual.</p></div></article>
                <article><span>24</span><div><h3>Prazo intermediário</h3><p>Reduz a meta mensal e pode dar espaço para reorganizar despesas e direcionar rendas extras sem depender de uma mudança brusca no orçamento.</p></div></article>
                <article><span>36</span><div><h3>Prazo mais longo</h3><p>Pode tornar a meta mensal mais acessível, mas exige revisar periodicamente o preço dos imóveis que você pretende comprar.</p></div></article>
              </div>

              <p>Exemplo: se faltam R$ 24.000, uma divisão simples resulta em R$ 2.000 por mês em 12 meses, R$ 1.000 em 24 meses ou cerca de R$ 667 em 36 meses.</p>
            </section>

            <section id="automatize" className={styles.section}>
              <span className={styles.kicker}>Passo 3</span>
              <h2>Trate a entrada como uma conta que você paga para si mesmo</h2>
              <p>O Banco Central define orçamento pessoal como um planejamento que mostra quanto você ganha, quanto gasta e com o que gasta. Essa organização é a base para saber quanto realmente pode ser reservado todos os meses.</p>
              <p>Uma forma prática de evitar que a meta dependa do que “sobrar” no fim do mês é separar o valor planejado logo após o recebimento da renda. Se o valor mensal calculado não cabe no orçamento, o problema não é a disciplina: o prazo ou o imóvel-alvo precisam ser revistos.</p>

              <div className={styles.callout}>
                <strong>Crie uma meta visível.</strong>
                <p>Acompanhe três números: valor-alvo, valor acumulado e quanto falta. Atualizar essa diferença todo mês ajuda a perceber se o plano está avançando ou se precisa ser ajustado.</p>
              </div>
            </section>

            <section id="fgts" className={styles.section}>
              <span className={styles.kicker}>Passo 4</span>
              <h2>Verifique se o FGTS pode reduzir a entrada necessária</h2>
              <p>O FGTS possui modalidade de uso para aquisição de moradia própria, além de amortização, liquidação e pagamento de parte das prestações, desde que trabalhador, imóvel e operação atendam aos requisitos.</p>
              <p>Por isso, antes de montar a meta de poupança, consulte o saldo efetivamente disponível. Valores bloqueados não devem ser tratados como dinheiro certo para a compra.</p>

              <div className={styles.sourceNote}>
                <span>Guia:</span>
                <a href="/guias/fgts">Entenda as regras do FGTS na compra do imóvel</a>
              </div>
            </section>

            <section id="custos" className={styles.section}>
              <span className={styles.kicker}>Passo 5</span>
              <h2>Não use todo o dinheiro disponível apenas na entrada</h2>
              <p>O valor da entrada não representa todo o dinheiro necessário para concluir a compra. Dependendo da operação, ainda podem existir ITBI, registro, avaliação, mudança, condomínio inicial, pequenos reparos e outras despesas.</p>
              <p>Se você juntar exatamente a diferença da entrada e zerar o caixa no momento da compra, qualquer despesa adicional pode virar dívida logo depois da assinatura.</p>

              <div className={styles.callout}>
                <strong>Separe objetivos diferentes.</strong>
                <p>Uma parte do dinheiro pode ser destinada à entrada e outra aos custos da compra e à sua margem para imprevistos. Isso evita que um único número esconda necessidades diferentes.</p>
              </div>
            </section>

            <section id="ajuste" className={styles.section}>
              <span className={styles.kicker}>Passo 6</span>
              <h2>Se a meta mensal ficou impossível, mexa no plano antes de mexer no orçamento</h2>
              <p>Uma meta que depende de cortar despesas essenciais ou assumir novas dívidas não é sustentável. Se o valor mensal necessário ficou muito alto, existem outras variáveis para testar.</p>

              <div className={styles.reasonList}>
                <article><span>01</span><div><h3>Aumente o prazo</h3><p>Mais meses reduzem a contribuição mensal necessária, embora o preço do imóvel precise ser revisto ao longo do tempo.</p></div></article>
                <article><span>02</span><div><h3>Reavalie o imóvel-alvo</h3><p>Uma faixa de preço menor pode reduzir simultaneamente a entrada e o valor financiado.</p></div></article>
                <article><span>03</span><div><h3>Revise o financiamento</h3><p>Se sua renda mudou ou a primeira estimativa foi muito conservadora, faça novos cenários. A aprovação final continua dependendo da instituição financeira.</p></div></article>
                <article><span>04</span><div><h3>Direcione rendas extras</h3><p>Décimo terceiro, bônus, comissões ou outras entradas eventuais podem acelerar a meta sem aumentar permanentemente a obrigação mensal.</p></div></article>
              </div>
            </section>

            <section className={styles.nextStep}>
              <div>
                <span>Monte seu plano</span>
                <h2>Veja quanto falta e quanto guardar por mês.</h2>
                <p>A calculadora de entrada organiza os recursos da compra e mostra metas mensais para 12, 24 e 36 meses quando ainda existe uma diferença.</p>
              </div>
              <a className="button" href="/calculadoras/entrada">Abrir calculadora de entrada</a>
            </section>

            <section className={styles.sources}>
              <h2>Fontes oficiais</h2>
              <p>Referências utilizadas para os conceitos de planejamento financeiro e uso do FGTS.</p>
              <div>
                <a href="https://www.bcb.gov.br/meubc/faqs/p/o-que-e-um-orcamento-pessoal" target="_blank" rel="noopener noreferrer">Banco Central — orçamento pessoal</a>
                <a href="https://www.bcb.gov.br/cidadaniafinanceira/letramento_financeiro" target="_blank" rel="noopener noreferrer">Banco Central — letramento financeiro</a>
                <a href="https://www.fgts.gov.br/Paginas/trabalhador/fgts-na-moradia.aspx" target="_blank" rel="noopener noreferrer">FGTS — moradia própria</a>
              </div>
            </section>
          </div>
        </div>
      </article>

      <section className={styles.disclaimer}>
        <div className="container">Conteúdo informativo e de planejamento. Não constitui recomendação financeira individual, aprovação de crédito ou garantia de uso do FGTS.</div>
      </section>

      <footer className="footer">
        <div className="container footer-inner">
          <a className="footer-brand" href="/"><span className="brand-dot" /> DescompliCAZA</a>
          <p>© 2026 DescompliCAZA.</p>
        </div>
      </footer>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
    </main>
  );
}
