import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { EntryCalculator } from "./EntryCalculator";
import styles from "./entrada.module.css";

export const metadata: Metadata = {
  title: "Calculadora de entrada de imóvel",
  description:
    "Calcule quanto você já tem disponível para a compra do imóvel e quanto ainda falta, considerando recursos próprios, FGTS, subsídio e financiamento estimado.",
};

const structuredData = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Calculadora de entrada de imóvel",
  applicationCategory: "FinanceApplication",
  operatingSystem: "Web",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "BRL",
  },
  description:
    "Ferramenta gratuita para organizar recursos próprios, FGTS, subsídio e financiamento estimado na compra de um imóvel.",
};

export default function EntryCalculatorPage() {
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
            <strong>Entrada</strong>
          </nav>

          <div className={styles.heroGrid}>
            <div className={styles.heroCopy}>
              <span className={styles.kicker}>Calculadora gratuita</span>
              <h1>Quanto falta para comprar o imóvel?</h1>
              <p>
                Junte recursos próprios, FGTS, subsídio e financiamento estimado para visualizar se o valor da compra já está coberto ou quanto ainda precisa ser completado.
              </p>
            </div>

            <aside className={styles.heroNote}>
              <span>Objetivo da ferramenta</span>
              <strong>Transformar a entrada em um plano, não em um chute.</strong>
              <p>
                O banco define o valor efetivamente financiável e o uso de FGTS e subsídios depende das regras da operação. Aqui você organiza os números antes da análise formal.
              </p>
            </aside>
          </div>
        </div>
      </section>

      <EntryCalculator />

      <section className={styles.explainer}>
        <div className={`container ${styles.explainerGrid}`}>
          <div>
            <span className={styles.kicker}>Como interpretar</span>
            <h2>Não confunda saldo total com dinheiro disponível para a compra.</h2>
          </div>

          <div className={styles.explainerCards}>
            <article>
              <h3>Recursos próprios</h3>
              <p>É o dinheiro que você realmente pretende colocar na compra sem comprometer despesas essenciais ou custos posteriores do imóvel.</p>
            </article>
            <article>
              <h3>FGTS</h3>
              <p>Informe apenas o saldo que poderá ser usado na operação. Valores bloqueados, inclusive por antecipação do Saque-Aniversário, podem não estar disponíveis.</p>
            </article>
            <article>
              <h3>Subsídio</h3>
              <p>Trate como estimativa até a confirmação da análise. O valor depende do enquadramento, da operação e das regras vigentes.</p>
            </article>
            <article>
              <h3>Financiamento</h3>
              <p>O valor informado aqui não representa aprovação. A instituição financeira fará análise de crédito, renda, imóvel, documentação e condições da linha.</p>
            </article>
          </div>
        </div>
      </section>

      <section className={styles.disclaimerSection}>
        <div className="container">
          <p>
            Esta calculadora tem finalidade exclusivamente informativa e de planejamento. Não representa aprovação de crédito, promessa de subsídio ou confirmação de uso do FGTS. Confirme os valores com a instituição financeira antes de assumir compromissos de compra.
          </p>
        </div>
      </section>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
    </main>
  );
}
