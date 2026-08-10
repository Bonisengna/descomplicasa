import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { FinancingCalculator } from "./FinancingCalculator";
import { BankSimulators } from "./BankSimulators";
import styles from "./financiamento.module.css";

export const metadata: Metadata = {
  title: "Calculadora de Financiamento Imobiliário | Descomplicasa",
  description:
    "Simule um financiamento imobiliário com entrada, prazo, taxa de juros e sistemas SAC ou Price. Veja parcelas, saldo devedor mês a mês e custo total estimados.",
};

export default function FinancingPage() {
  return (
    <main>
      <Header />

      <section className={styles.hero}>
        <div className="container">
          <nav className={styles.breadcrumb} aria-label="Navegação estrutural">
            <a href="/">Início</a>
            <span aria-hidden="true">/</span>
            <a href="/#calculadoras">Calculadoras</a>
            <span aria-hidden="true">/</span>
            <strong>Financiamento</strong>
          </nav>

          <div className={styles.heroGrid}>
            <div>
              <span className={styles.kicker}>Calculadora gratuita</span>
              <h1>Simule seu financiamento imobiliário.</h1>
              <p>
                Informe o valor do imóvel, a entrada, o prazo e a taxa de juros para ter uma estimativa das parcelas, dos juros e da evolução do saldo devedor.
              </p>
            </div>

            <aside className={styles.heroNote}>
              <strong>Estimativa, não proposta bancária.</strong>
              <p>
                O resultado não inclui seguros, tarifas, TR, CET, avaliação do imóvel ou outras cobranças que podem existir no contrato real.
              </p>
            </aside>
          </div>
        </div>
      </section>

      <FinancingCalculator />

      <BankSimulators />

      <section className={styles.explainer}>
        <div className="container">
          <div className={styles.explainerGrid}>
            <div>
              <span className={styles.kicker}>Entenda a simulação</span>
              <h2>SAC ou Price: qual a diferença?</h2>
            </div>
            <div className={styles.explainerCards}>
              <article>
                <h3>SAC</h3>
                <p>
                  A amortização do saldo devedor é constante. As parcelas começam maiores e diminuem ao longo do tempo.
                </p>
              </article>
              <article>
                <h3>Price</h3>
                <p>
                  A prestação calculada permanece constante nesta simulação, enquanto a proporção entre juros e amortização muda ao longo do prazo.
                </p>
              </article>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.disclaimerSection}>
        <div className="container">
          <p>
            Esta calculadora tem finalidade exclusivamente informativa. Instituições financeiras podem utilizar critérios, taxas, seguros, indexadores, sistemas de amortização e custos adicionais diferentes. Antes de contratar, confira a proposta e o CET informado pela instituição financeira.
          </p>
        </div>
      </section>
    </main>
  );
}
