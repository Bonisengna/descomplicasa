import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { McmvBandCalculator } from "./McmvBandCalculator";
import styles from "./faixa-mcmv.module.css";

export const metadata: Metadata = {
  title: "Calculadora de Faixa MCMV 2026 | Descomplicasa",
  description:
    "Digite sua renda familiar e descubra sua faixa do Minha Casa Minha Vida em 2026, juros aproximados, possibilidade de subsídio e limite do imóvel.",
};

const structuredData = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Calculadora de Faixa Minha Casa Minha Vida 2026",
  applicationCategory: "FinanceApplication",
  operatingSystem: "Web",
  description:
    "Ferramenta gratuita para identificar a faixa de renda do Minha Casa Minha Vida e consultar taxas, subsídios e limites de imóvel de referência em 2026.",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "BRL",
  },
};

export default function McmvBandPage() {
  return (
    <main id="top">
      <Header />

      <section className={styles.hero}>
        <div className="container">
          <nav className={styles.breadcrumb} aria-label="Navegação estrutural">
            <a href="/">Início</a>
            <span>/</span>
            <a href="/#calculadoras">Calculadoras</a>
            <span>/</span>
            <strong>Faixa Minha Casa Minha Vida</strong>
          </nav>

          <div className={styles.heroGrid}>
            <div>
              <span className={styles.kicker}>Ferramenta MCMV 2026</span>
              <h1>Em qual faixa do Minha Casa Minha Vida eu estou?</h1>
              <p>
                Informe a renda familiar bruta mensal e veja seu enquadramento, a faixa de juros nominal, a possibilidade de subsídio e o limite de valor do imóvel.
              </p>
            </div>

            <aside className={styles.heroNote}>
              <strong>Leva poucos segundos.</strong>
              <p>Você informa apenas a renda. Nenhum dado é enviado ou salvo pelo Descomplicasa.</p>
            </aside>
          </div>
        </div>
      </section>

      <McmvBandCalculator />

      <section className={styles.explainer}>
        <div className={`container ${styles.explainerGrid}`}>
          <div>
            <span className={styles.kicker}>Como ler o resultado</span>
            <h2>Faixa é o começo da análise, não a aprovação.</h2>
          </div>

          <div className={styles.explainerCards}>
            <article>
              <strong>Juros</strong>
              <p>Mostramos a taxa nominal de referência. Nas faixas menores ela varia com renda, região e condição de cotista do FGTS.</p>
            </article>
            <article>
              <strong>Subsídio</strong>
              <p>Renda de até R$ 5 mil pode ter desconto na linha financiada. O valor real depende da renda, localização e operação.</p>
            </article>
            <article>
              <strong>Limite do imóvel</strong>
              <p>Nas Faixas 1 e 2 o teto varia por município. Nas faixas superiores existe um limite nacional de referência.</p>
            </article>
            <article>
              <strong>Análise do banco</strong>
              <p>Estar dentro de uma faixa não garante financiamento. O banco ainda analisa crédito, renda, imóvel e documentação.</p>
            </article>
          </div>
        </div>
      </section>

      <section className={styles.officialSection}>
        <div className="container">
          <div className={styles.officialCard}>
            <div>
              <span className={styles.kicker}>Dados revisados em agosto de 2026</span>
              <h2>Quer conferir a regra na fonte?</h2>
              <p>As faixas e condições desta ferramenta seguem a linha financiada publicada pelo Ministério das Cidades.</p>
            </div>
            <a
              href="https://www.gov.br/cidades/pt-br/acesso-a-informacao/acoes-e-programas/habitacao/programa-minha-casa-minha-vida/mcmv-fgts"
              target="_blank"
              rel="noopener noreferrer"
            >
              Ver regras oficiais ↗
            </a>
          </div>
        </div>
      </section>

      <section className={styles.disclaimer}>
        <div className="container">
          Conteúdo informativo. O enquadramento por renda não substitui a simulação e a análise de crédito da instituição financeira. Taxas, subsídios e limites podem ser atualizados pelos órgãos responsáveis.
        </div>
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
