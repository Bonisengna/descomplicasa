import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Header } from "@/components/Header";
import { getArticle } from "@/lib/editorial-store";
import { absoluteUrl } from "@/lib/site";
import styles from "@/app/guias/inadimplencia-financiamento-imobiliario/article.module.css";
export const dynamic = "force-dynamic";
export async function generateMetadata({params}:{params:Promise<{slug:string}>}): Promise<Metadata> {
  const article = await getArticle((await params).slug); if (!article) return {};
  return {title:`${article.title} | DescompliCAZA`,description:article.description,alternates:{canonical:`/blog/${article.slug}`},openGraph:{type:"article",title:article.title,description:article.description,publishedTime:article.publishedAt,images:[absoluteUrl(article.image.src)]}};
}
export default async function Page({params}:{params:Promise<{slug:string}>}) {
  const article = await getArticle((await params).slug); if (!article) notFound();
  const date = new Intl.DateTimeFormat("pt-BR",{dateStyle:"long",timeZone:"America/Sao_Paulo"}).format(new Date(article.publishedAt));
  return <main><Header/><article><header className={styles.hero}><div className="container"><a href="/blog">Blog DescompliCAZA</a><p><time dateTime={article.publishedAt}>{date}</time></p><h1>{article.title}</h1><p className={styles.lead}>{article.lead}</p></div></header><div className="container" style={{maxWidth:900,paddingBlock:32}}><figure style={{margin:0}}><img src={article.image.src} alt={article.image.alt} style={{width:"100%",height:"auto",maxHeight:500,objectFit:"cover"}}/><figcaption>{article.image.credit} · {article.image.license} · <a href={article.image.sourceUrl} rel="noopener noreferrer" target="_blank">Origem da imagem</a></figcaption></figure>{article.sections.map(s=><section className={styles.section} id={s.id} key={s.id}><h2>{s.title}</h2>{s.paragraphs.map((p,i)=><p key={i}>{p}</p>)}{s.bullets&&<ul>{s.bullets.map((b,i)=><li key={i}>{b}</li>)}</ul>}</section>)}<section className={styles.section}><h2>Fontes consultadas</h2><ul>{article.sources.map(s=><li key={s.url}><a href={s.url} target="_blank" rel="noopener noreferrer">{s.label}</a></li>)}</ul></section><p><a href="/calculadoras/financiamento">Planeje o financiamento</a> · <a href="/checklists/documentos-mcmv">Organize seus documentos</a></p></div></article></main>;
}
