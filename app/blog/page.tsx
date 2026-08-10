import type { Metadata } from "next";
import { Header } from "@/components/Header";
import styles from "./blog.module.css";

export const metadata: Metadata = {
  title: "Blog | Descomplicasa",
  description:
    "Conteúdo prático sobre financiamento, compra de imóveis, Minha Casa Minha Vida, documentos e planejamento financeiro.",
};

const articles = [
  {
    category: "Financiamento",
    date: "10 de agosto de 2026",
    title: "A inadimplência nos financiamentos imobiliários está crescendo. O que isso muda para quem vai comprar um imóvel?",
    description:
      "Os atrasos acima de 90 dias voltaram a subir nas linhas imobiliárias reguladas em 2026. Entenda os números e como financiar com mais margem de segurança.",
    href: "/guias/inadimplencia-financiamento-imobiliario",
    featured: true,
  },
];

export default function BlogPage() {
  return (
    <main id="top">
      <Header />

      <section className={styles.hero}>
        <div className="container">
          <span className={styles.kicker}>Blog Descomplicasa</span>
          <h1>Comprar melhor começa por entender melhor.</h1>
          <p>Dados, explicações e decisões práticas para quem está planejando comprar um imóvel.</p>
        </div>
      </section>

      <section className={styles.content}>
        <div className="container">
          <div className={styles.sectionHeading}>
            <div>
              <span className={styles.kicker}>Publicações</span>
              <h2>Artigos recentes</h2>
            </div>
            <p>Conteúdo editorial e informativo, sempre com fontes indicadas quando usamos dados de mercado.</p>
          </div>

          <div className={styles.articleGrid}>
            {articles.map((article) => (
              <article className={article.featured ? styles.featuredCard : styles.card} key={article.href}>
                <div className={styles.visual} aria-hidden="true">
                  <span>01</span>
                  <div />
                </div>
                <div className={styles.cardBody}>
                  <div className={styles.meta}>
                    <span>{article.category}</span>
                    <time dateTime="2026-08-10">{article.date}</time>
                  </div>
                  <h2>{article.title}</h2>
                  <p>{article.description}</p>
                  <a href={article.href}>Ler artigo →</a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.toolsSection}>
        <div className={`container ${styles.toolsInner}`}>
          <div>
            <span className={styles.kicker}>Não fique só na teoria</span>
            <h2>Use as ferramentas do Descomplicasa.</h2>
          </div>
          <div className={styles.toolLinks}>
            <a href="/calculadoras/financiamento">Calculadora de financiamento →</a>
            <a href="/calculadoras/faixa-minha-casa-minha-vida">Descobrir faixa MCMV →</a>
            <a href="/checklists/documentos-mcmv">Checklist de documentos MCMV →</a>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="container footer-inner">
          <a className="footer-brand" href="/"><span className="brand-dot" /> DESCOMPLICASA</a>
          <p>© 2026 Descomplicasa.</p>
        </div>
      </footer>
    </main>
  );
}
