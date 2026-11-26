import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { ArrowIcon } from "@/components/Icons";
import { PurchaseDemo } from "@/components/PurchaseDemo";
import styles from "./home.module.css";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

const calculators = [
  { title: "Financiamento", text: "Descubra quanto pode financiar e tenha uma noção das parcelas.", href: "/calculadoras/financiamento" },
  { title: "Amortização", text: "Simule um aporte único e veja quanto pode reduzir em prazo, parcela e juros.", href: "/calculadoras/amortizacao" },
  { title: "Faixa MCMV", text: "Descubra em qual faixa do Minha Casa Minha Vida sua renda familiar se enquadra.", href: "/calculadoras/faixa-minha-casa-minha-vida" },
  { title: "Entrada", text: "Veja quanto precisa juntar e organize os recursos para a compra.", href: "/calculadoras/entrada" },
  { title: "ITBI", text: "Estime o imposto conforme município, valor da compra, financiamento e FGTS.", href: "/calculadoras/itbi" },
];

const checklists = [
  { title: "Documentos MCMV", text: "Separe os principais documentos antes de procurar o banco.", href: "/checklists/documentos-mcmv" },
];

const guides = [
  { title: "Minha Casa Minha Vida", text: "Faixas de renda, subsídios, juros, FGTS e regras atualizadas para 2026.", href: "/guias/minha-casa-minha-vida" },
  { title: "Financiamento", text: "Como funciona, o que influencia a aprovação e quais custos observar.", href: "/guias/financiamento" },
  { title: "FGTS", text: "Como usar na compra, consultar saldo, liberar o banco e entender o Saque-Aniversário.", href: "/guias/fgts" },
  { title: "ITBI", text: "O que é, quando é pago e por que o valor pode variar por município.", href: "/guias/itbi" },
  { title: "Escritura", text: "Quando é necessária, quando o contrato financiado pode substituí-la e quanto custa.", href: "/guias/escritura" },
];

type CatalogItem = {
  title: string;
  text: string;
  href: string;
};

type CatalogSectionProps = {
  id: string;
  title: string;
  description: string;
  items: CatalogItem[];
  comingSoon: string;
};

function CatalogSection({ id, title, description, items, comingSoon }: CatalogSectionProps) {
  return (
    <section className={styles.catalogSection} id={id} aria-labelledby={`${id}-titulo`}>
      <div className={styles.catalogHeading}>
        <h2 id={`${id}-titulo`}>{title}</h2>
        <p>{description}</p>
      </div>
      <div>
        <ul className={styles.catalogList}>
          {items.map(({ title, text, href }) => (
            <li key={href}>
              <a className={styles.catalogLink} href={href}>
                <div>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </div>
                <ArrowIcon />
              </a>
            </li>
          ))}
        </ul>
        <p className={styles.comingSoon}><strong>Em breve</strong> · {comingSoon}</p>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <main id="top" className={styles.home}>
      <Header />

      <section className={styles.hero} aria-labelledby="hero-titulo">
        <div className="container">
          <div className={styles.introLayout}>
            <div>
              <div className={styles.heroIntro}>
                <h1 id="hero-titulo">Vai comprar <span>um imóvel?</span></h1>
                <p>Calcule custos, confira documentos e entenda cada etapa antes de fechar negócio.</p>
              </div>
              <div className={styles.actions}>
                <a className={styles.primary} href="/calculadoras/financiamento">
                  Simular financiamento <ArrowIcon />
                </a>
                <a className={styles.secondary} href="#checklists">Ver checklists</a>
              </div>
              <p className={styles.accessNote}>Ferramentas gratuitas e sem cadastro.</p>
            </div>
            <div className={styles.demo}>
              <PurchaseDemo />
            </div>
          </div>
        </div>
      </section>

      <div className="container">
        <CatalogSection
          id="calculadoras"
          title="Calculadoras"
          description="Estime os valores que entram no orçamento da compra."
          items={calculators}
          comingSoon="Escritura e registro"
        />
        <CatalogSection
          id="checklists"
          title="Checklists"
          description="Organize o que você precisa conferir antes de avançar."
          items={checklists}
          comingSoon="Documentos da compra, visita e etapas da compra"
        />
        <CatalogSection
          id="guias"
          title="Guias"
          description="Entenda as regras, os custos e as decisões da compra."
          items={guides}
          comingSoon="Registro"
        />
      </div>

      <section className={styles.about} id="sobre" aria-labelledby="sobre-titulo">
        <div className={`container ${styles.aboutGrid}`}>
          <h2 id="sobre-titulo">Sobre o DescompliCAZA</h2>
          <div>
            <p>Reunimos ferramentas e orientações para ajudar você a planejar a compra do seu imóvel, dos primeiros cálculos até a documentação.</p>
            <p className={styles.disclaimer}>O conteúdo tem caráter informativo e não substitui análise jurídica, registral, bancária ou técnica quando necessária.</p>
          </div>
        </div>
      </section>
    </main>
  );
}
