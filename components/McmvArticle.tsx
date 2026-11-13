import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { mcmvArticles, type McmvArticleData } from "@/lib/mcmv-articles";
import { absoluteUrl } from "@/lib/site";
import styles from "@/app/guias/inadimplencia-financiamento-imobiliario/article.module.css";

export function mcmvArticleMetadata(article: McmvArticleData): Metadata {
  const path = `/guias/${article.slug}`;
  return {
    title: `${article.title} | DescompliCAZA`,
    description: article.description,
    alternates: { canonical: path },
    openGraph: { type: "article", title: article.title, description: article.description, url: absoluteUrl(path), publishedTime: "2026-11-13", modifiedTime: "2026-11-13" },
  };
}

export function McmvArticle({ article }: { article: McmvArticleData }) {
  const structuredData = {
    "@context": "https://schema.org", "@type": "Article",
    headline: article.title, description: article.description,
    datePublished: "2026-11-13", dateModified: "2026-11-13",
    author: { "@type": "Organization", name: "DescompliCAZA" },
    publisher: { "@type": "Organization", name: "DescompliCAZA" },
    mainEntityOfPage: absoluteUrl(`/guias/${article.slug}`),
    citation: article.sources.map((source) => source.url),
  };
  return <main id="top">
    <Header />
    <article>
      <header className={styles.hero}><div className={`container ${styles.heroInner}`}>
        <nav className={styles.breadcrumb} aria-label="Navegação estrutural"><a href="/">Início</a><span>/</span><a href="/blog">Blog</a><span>/</span><strong>Minha Casa Minha Vida</strong></nav>
        <div className={styles.meta}><span>Minha Casa Minha Vida</span><time dateTime="2026-11-13">13 de novembro de 2026</time><span>Leitura de 4 min</span></div>
        <h1>{article.title}</h1><p className={styles.lead}>{article.lead}</p>
      </div></header>
      <div className={`container ${styles.layout}`}>
        <aside className={styles.sidebar}><strong>Neste artigo</strong>{article.sections.map((section) => <a key={section.id} href={`#${section.id}`}>{section.title}</a>)}<a href="#fontes">Fontes oficiais</a></aside>
        <div className={styles.articleBody}>
          <div className={styles.callout}><strong>Sobre a data das mudanças</strong><p>Publicado em 13/11/2026, com fontes consultadas nesta data. Este artigo explica regras de 2026; não se trata de um anúncio de novas condições em novembro.</p></div>
          {article.sections.map((section) => <section className={styles.section} id={section.id} key={section.id}>
            <h2>{section.title}</h2>
            {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            {"callout" in section && <div className={styles.callout}><strong>Para levar ao planejamento</strong><p>{section.callout}</p></div>}
            {"bullets" in section && <ul className={styles.checkList}>{section.bullets.map((item) => <li key={item}>{item}</li>)}</ul>}
          </section>)}
          <section className={styles.cta}><div><span>Teste no seu cenário</span><h2>{article.tool.title}</h2></div><a className="button" href={article.tool.href}>{article.tool.label}</a></section>
          <section className={styles.section}><h2>Continue seu planejamento</h2><ul className={styles.checkList}>
            {mcmvArticles.filter((related) => related.slug !== article.slug).map((related) => <li key={related.slug}><a href={`/guias/${related.slug}`}>{related.title}</a></li>)}
            <li><a href="/guias/minha-casa-minha-vida">Entenda como funciona o Minha Casa Minha Vida</a></li>
            <li><a href="/checklists/documentos-mcmv">Organize os documentos para a análise</a></li>
          </ul></section>
          <section id="fontes" className={styles.sources}><h2>Fontes oficiais</h2><p>Consultadas em 13 de novembro de 2026. Os exemplos de planejamento do artigo são ilustrativos.</p><ul>{article.sources.map((source) => <li key={source.url}><a href={source.url} target="_blank" rel="noopener noreferrer">{source.label}</a></li>)}</ul></section>
        </div>
      </div>
    </article>
    <section className={styles.disclaimer}><div className="container">Conteúdo informativo. Simulações não representam aprovação de crédito. Enquadramento, entrada, encargos e condições dependem da análise da instituição financeira e das regras vigentes.</div></section>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }} />
  </main>;
}
