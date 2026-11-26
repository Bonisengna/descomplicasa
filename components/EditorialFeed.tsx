import { listArticles } from "@/lib/editorial-store";
import styles from "@/app/blog/blog.module.css";

export async function EditorialFeed() {
  const articles = await listArticles();
  if (!articles.length) return null;

  return (
    <section className="container" style={{ paddingBlock: 32 }} aria-labelledby="editorial-feed-title">
      <h2 id="editorial-feed-title">Notícias e análises</h2>
      <div className={styles.editorialGrid}>
        {articles.map(article => {
          const titleId = `editorial-publication-${article.slug}`;
          return (
            <article key={article.slug}>
              <a
                className={`${styles.publicationLink} ${styles.editorialCard}`}
                href={`/blog/${article.slug}`}
                aria-labelledby={titleId}
              >
                <img src={article.image.src} alt={article.image.alt} loading="lazy" />
                <div className={styles.editorialBody}>
                  <h3 id={titleId}>{article.title}</h3>
                  <p>{article.description}</p>
                </div>
              </a>
            </article>
          );
        })}
      </div>
    </section>
  );
}
