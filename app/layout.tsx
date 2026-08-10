import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Descomplicasa | Entenda antes de comprar um imóvel",
    template: "%s | Descomplicasa",
  },
  description:
    "Calculadoras, checklists e guias para entender custos, documentos e etapas antes de comprar um imóvel.",
  keywords: [
    "comprar imóvel",
    "financiamento imobiliário",
    "ITBI",
    "escritura de imóvel",
    "registro de imóvel",
    "checklist compra imóvel",
  ],
  openGraph: {
    title: "Descomplicasa | Entenda antes de comprar um imóvel",
    description:
      "Calcule custos, confira documentos e entenda cada etapa da compra do imóvel.",
    type: "website",
    locale: "pt_BR",
    siteName: "Descomplicasa",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
