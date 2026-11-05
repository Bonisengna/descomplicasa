const DEFAULT_SITE_URL = "https://descomplicaza.caza85imoveis.com.br";

function normalizeSiteUrl(value: string): string {
  const url = new URL(value);

  if (url.protocol !== "https:" && url.protocol !== "http:") {
    throw new Error("SITE_URL deve usar http ou https.");
  }

  if (url.pathname !== "/" || url.search || url.hash) {
    throw new Error("SITE_URL deve conter apenas a origem, sem caminho, busca ou fragmento.");
  }

  return url.origin;
}

export const siteUrl = normalizeSiteUrl(
  process.env.SITE_URL ?? process.env.NEXT_PUBLIC_SITE_URL ?? DEFAULT_SITE_URL,
);

export function absoluteUrl(pathname = "/"): string {
  return new URL(pathname, `${siteUrl}/`).toString();
}
