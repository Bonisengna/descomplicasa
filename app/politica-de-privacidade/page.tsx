import type { Metadata } from "next";
import { Header } from "@/components/Header";
import styles from "./privacy.module.css";

export const metadata: Metadata = {
  title: "Política de Privacidade",
  description:
    "Política de Privacidade do aplicativo n8n Descomplicasa, ferramenta interna usada para automações de trabalho.",
};

const sections = [
  {
    id: "sobre",
    number: "01",
    title: "Sobre este aplicativo",
    content: (
      <p>
        O aplicativo &quot;n8n Descomplicasa&quot; é uma ferramenta de uso interno e pessoal,
        operada por Bruno, da Descomplicasa. Ele é utilizado exclusivamente para executar
        automações de trabalho por meio da plataforma n8n.
      </p>
    ),
  },
  {
    id: "dados",
    number: "02",
    title: "Dados acessados",
    content: (
      <>
        <p>
          O aplicativo acessa apenas dados das contas Google do próprio proprietário, como
          Google Sheets, Google Drive e Gmail, na medida necessária para executar os fluxos de
          automação configurados por ele.
        </p>
        <p>O aplicativo não é disponibilizado ao público e não coleta dados de terceiros.</p>
      </>
    ),
  },
  {
    id: "uso",
    number: "03",
    title: "Uso dos dados",
    content: (
      <p>
        Os dados acessados são utilizados somente para operar as automações do proprietário.
        Eles não são vendidos, alugados, compartilhados com terceiros nem utilizados para
        publicidade ou para treinamento de modelos de inteligência artificial.
      </p>
    ),
  },
  {
    id: "seguranca",
    number: "04",
    title: "Armazenamento e segurança",
    content: (
      <p>
        As credenciais de acesso ficam armazenadas de forma segura em servidor próprio do
        proprietário, com acesso restrito. Nenhum dado de contas Google é copiado para bancos
        de dados públicos.
      </p>
    ),
  },
  {
    id: "revogacao",
    number: "05",
    title: "Revogação de acesso",
    content: (
      <p>
        O acesso do aplicativo à conta Google pode ser revogado a qualquer momento em{" "}
        <a href="https://myaccount.google.com/permissions" target="_blank" rel="noreferrer">
          myaccount.google.com/permissions
        </a>
        .
      </p>
    ),
  },
  {
    id: "alteracoes",
    number: "06",
    title: "Alterações",
    content: (
      <p>
        Esta política pode ser atualizada periodicamente. A data da última atualização está
        indicada no topo desta página.
      </p>
    ),
  },
  {
    id: "contato",
    number: "07",
    title: "Contato",
    content: (
      <address>
        <strong>Bruno - Descomplicasa</strong>
        <a href="mailto:bruno.bonisengna.santos@gmail.com">
          bruno.bonisengna.santos@gmail.com
        </a>
      </address>
    ),
  },
];

export default function PrivacyPolicyPage() {
  return (
    <main id="top">
      <Header />

      <section className={styles.hero}>
        <div className={`container ${styles.heroInner}`}>
          <div>
            <span className={styles.kicker}>Privacidade e transparência</span>
            <h1>Política de Privacidade</h1>
            <p>
              Como o aplicativo interno n8n Descomplicasa acessa e utiliza dados para executar
              automações de trabalho.
            </p>
          </div>
          <div className={styles.updated}>
            <span>Última atualização</span>
            <time dateTime="2026-10-28">28 de outubro de 2026</time>
          </div>
        </div>
      </section>

      <section className={styles.content} aria-label="Conteúdo da política de privacidade">
        <div className={`container ${styles.contentGrid}`}>
          <aside className={styles.summary}>
            <span>Em resumo</span>
            <h2>Uso interno e restrito</h2>
            <p>
              O aplicativo é pessoal, não é oferecido ao público e usa somente as contas Google
              do próprio proprietário.
            </p>
            <nav aria-label="Seções desta política">
              {sections.map((section) => (
                <a href={`#${section.id}`} key={section.id}>
                  <span>{section.number}</span>
                  {section.title}
                </a>
              ))}
            </nav>
          </aside>

          <article className={styles.policy}>
            {sections.map((section) => (
              <section id={section.id} key={section.id} className={styles.policySection}>
                <span className={styles.sectionNumber}>{section.number}</span>
                <div>
                  <h2>{section.title}</h2>
                  {section.content}
                </div>
              </section>
            ))}
          </article>
        </div>
      </section>
    </main>
  );
}
