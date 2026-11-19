import { listArticles } from "@/lib/editorial-store";
export async function EditorialFeed() {
  const articles = await listArticles();
  if (!articles.length) return null;
  return <section className="container" style={{paddingBlock:32}} aria-label="Notícias e análises"><h2>Notícias e análises</h2><div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit, minmax(260px, 1fr))",gap:24}}>{articles.map(a=><article key={a.slug} style={{border:"1px solid #d7e3da",borderRadius:12,overflow:"hidden"}}><img src={a.image.src} alt={a.image.alt} loading="lazy" style={{width:"100%",height:200,objectFit:"cover"}}/><div style={{padding:20}}><h3><a href={`/blog/${a.slug}`}>{a.title}</a></h3><p>{a.description}</p><a href={`/blog/${a.slug}`}>Ler artigo</a></div></article>)}</div></section>;
}
