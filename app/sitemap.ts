import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/site";

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

export default function sitemap(): MetadataRoute.Sitemap {
  return publicRoutes.map((route) => ({
    url: absoluteUrl(route),
  }));
}
