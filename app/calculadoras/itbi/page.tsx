import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { ItbiCalculator } from "./ItbiCalculator";
import styles from "./itbi.module.css";

export const metadata: Metadata = {
  title: "Calculadora de ITBI | DescompliCAZA",
  description: "Estime o ITBI conforme o município, valor do imóvel e forma de pagamento. Regras iniciais verificadas para Porto Alegre e São Leopoldo.",
};

export default function ItbiCalculatorPage() {
  return (
    <main id="top">
      <Header />
      <section className={styles.hero}>
        <div className="container">
          <nav className={styles.breadcrumb} aria-label="Navegação estrutural">
            <a href="/">Início</a><span>/</span><a href="/#calculadoras">Calculadoras</a><span>/</span><strong>ITBI</strong>
          </nav>
          <div className={styles.heroGrid}>
            <div><span className={styles.kicker}>Calculadora gratuita</span><h1>Estime o ITBI antes de fechar a compra.</h1><p>Escolha o município, informe o valor usado na estimativa e, quando houver regra específica, separe financiamento e FGTS.</p></div>
            <aside className={styles.note}><strong>ITBI é municipal.</strong><p>Alíquota, benefícios e base de cálculo variam por cidade. O resultado é uma estimativa e deve ser conferido na prefeitura antes do pagamento.</p></aside>
          </div>
        </div>
      </section>
      <ItbiCalculator />
      <section className={styles.disclaimer}><div className="container">Conteúdo informativo. A guia oficial pode considerar avaliação municipal, limites, benefícios, isenções e regras específicas não reproduzidas integralmente nesta ferramenta.</div></section>
    </main>
  );
}
