import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { AmortizationSimulator } from "./AmortizationSimulator";
import styles from "./amortizacao.module.css";

export const metadata: Metadata = {
  title: "Simulador de amortização de financiamento | DescompliCAZA",
  description:
    "Simule um aporte único no financiamento imobiliário e veja a redução estimada de prazo, parcela e juros nos sistemas SAC e Price.",
};

const structuredData = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Simulador de amortização de financiamento",
  applicationCategory: "FinanceApplication",
  operatingSystem: "Web",
  offers: { "@type": "Offer", price: "0", priceCurrency: "BRL" },
  description:
    "Ferramenta gratuita para comparar um financiamento antes e depois de um aporte extraordinário.",
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
              <h1>Veja quanto um aporte pode encurtar seu financiamento.</h1>
              <p>
                Informe o saldo devedor, o prazo e a taxa. Depois mova a barra de aporte para comparar o contrato atual com uma amortização extraordinária.
              </p>
            </div>

            <aside className={styles.heroNote}>
              <strong>Aporte único, SAC ou Price.</strong>
              <p>
                Você pode simular redução de prazo ou redução de parcela. A ferramenta usa um modelo matemático simplificado e não substitui o recálculo oficial do banco.
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
              <p>O prazo permanece igual e o saldo menor é redistribuído pelos meses restantes, reduzindo a prestação estimada.</p>
            </article>
            <article>
              <h3>Economia de juros</h3>
              <p>A economia exibida compara os juros futuros do cenário atual com os juros futuros do cenário após o aporte.</p>
            </article>
          </div>
        </div>
      </section>

      <section className={styles.disclaimer}>
        <div className="container">
          Esta ferramenta é informativa. O cálculo não considera TR, seguros, tarifas, CET, datas exatas de vencimento, atualização monetária ou regras específicas de recálculo da instituição financeira. Consulte o banco antes de efetuar uma amortização.
        </div>
      </section>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
    </main>
  );
}
