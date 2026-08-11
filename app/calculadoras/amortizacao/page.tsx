import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { AmortizationSimulator } from "./AmortizationSimulator";
import styles from "./amortizacao.module.css";

export const metadata: Metadata = {
  title: "Simulador de amortização de financiamento | DescompliCAZA",
  description:
    "Simule aporte imediato, aporte anual e uso periódico do FGTS no financiamento imobiliário e veja a redução estimada de prazo, parcela e juros.",
};

const structuredData = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Simulador de amortização de financiamento",
  applicationCategory: "FinanceApplication",
  operatingSystem: "Web",
  offers: { "@type": "Offer", price: "0", priceCurrency: "BRL" },
  description:
    "Ferramenta gratuita para comparar um financiamento antes e depois de aportes extraordinários e recorrentes.",
};

export default function AmortizationPage() {
  return (
    <main id="top">
      <Header />

      <section className={styles.hero}>
        <div className="container">
          <nav className={styles.breadcrumb} aria-label="Navegação estrutural">
            <a href="/">Início</a><span>/</span><a href="/#calculadoras">Calculadoras</a><span>/</span><strong>Amortização</strong>
          </nav>

          <div className={styles.heroGrid}>
            <div>
              <span className={styles.kicker}>Simulador gratuito</span>
              <h1>Veja quanto seus aportes podem encurtar o financiamento.</h1>
              <p>
                Informe o saldo devedor, o prazo e a taxa. Depois combine aporte hoje, aportes anuais e FGTS quando elegível para comparar diferentes estratégias de amortização.
              </p>
            </div>

            <aside className={styles.heroNote}>
              <strong>Aporte único, anual e FGTS na mesma simulação.</strong>
              <p>
                Compare redução de prazo ou de parcela nos sistemas SAC e Price. O resultado é uma estimativa matemática e não substitui o recálculo oficial do banco.
              </p>
            </aside>
          </div>
        </div>
      </section>

      <AmortizationSimulator />

      <section className={styles.explainer}>
        <div className={`container ${styles.explainerGrid}`}>
          <div>
            <span className={styles.kicker}>Como interpretar</span>
            <h2>O aporte reduz o saldo. O efeito depende da estratégia.</h2>
          </div>
          <div className={styles.explainerCards}>
            <article>
              <h3>Reduzir prazo</h3>
              <p>O modelo mantém uma referência próxima da prestação original e usa o saldo menor para encurtar a quantidade de meses restantes.</p>
            </article>
            <article>
              <h3>Reduzir parcela</h3>
              <p>O saldo menor é redistribuído pelo prazo restante, reduzindo a prestação estimada conforme os eventos de amortização acontecem.</p>
            </article>
            <article>
              <h3>FGTS não é aporte anual automático</h3>
              <p>Na amortização ou liquidação, o simulador considera intervalo de 24 meses entre usos do FGTS. A elegibilidade e o saldo disponível precisam ser confirmados com a instituição financeira.</p>
            </article>
          </div>
        </div>
      </section>

      <section className={styles.disclaimer}>
        <div className="container">
          Esta ferramenta é informativa. O cálculo não considera TR, seguros, tarifas, CET, datas exatas de vencimento, atualização monetária ou regras específicas de recálculo da instituição financeira. O uso do FGTS depende das regras vigentes, do contrato e da elegibilidade do trabalhador. Consulte o banco antes de efetuar uma amortização.
        </div>
      </section>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
    </main>
  );
}
