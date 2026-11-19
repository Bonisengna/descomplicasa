import type { MetadataRoute } from "next";
import { listArticles } from "@/lib/editorial-store";
export const dynamic = "force-dynamic";
import { absoluteUrl } from "@/lib/site";
import { mcmvArticles } from "@/lib/mcmv-articles";

const publicRoutes = [
  "/",
  "/blog",
  "/calculadoras/amortizacao",
  "/calculadoras/entrada",
  "/calculadoras/faixa-minha-casa-minha-vida",
  "/calculadoras/financiamento",
  "/calculadoras/itbi",
  "/checklists/documentos-mcmv",
  "/guias/como-juntar-entrada-imovel",
  "/guias/escritura",
  "/guias/fgts",
  "/guias/financiamento",
  "/guias/inadimplencia-financiamento-imobiliario",
  "/guias/itbi",
  "/guias/minha-casa-minha-vida",
  "/guias/renda-bruta-financiamento-imobiliario",
  "/guias/sac-ou-price-qual-melhor",
  "/politica-de-privacidade",
] as const;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const editorial = await listArticles();
  return [...publicRoutes, ...mcmvArticles.map((article) => `/guias/${article.slug}`), ...editorial.map(a => `/blog/${a.slug}`)].map((route) => ({
    url: absoluteUrl(route),
  }));
}
