import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { McmvDocumentChecklist } from "./McmvDocumentChecklist";
import styles from "./documentos-mcmv.module.css";

export const metadata: Metadata = {
  title: "Checklist de documentos MCMV | Descomplicasa",
  description: "Veja os principais documentos para preparar antes de solicitar um financiamento pelo Minha Casa Minha Vida.",
};

export default function McmvDocumentsPage() {
  return (
    <main id="top">
      <Header />

      <section className={styles.hero}>
        <div className="container">
          <nav className={styles.breadcrumb} aria-label="Navegação estrutural">
            <a href="/">Início</a><span>/</span><a href="/#checklists">Checklists</a><span>/</span><strong>Documentos MCMV</strong>
          </nav>
          <div className={styles.heroGrid}>
            <div>
              <span className={styles.kicker}>Checklist gratuito</span>
              <h1>Documentos para o Minha Casa Minha Vida</h1>
              <p>Organize o básico antes de procurar o banco. Ter os documentos separados evita idas e voltas na análise.</p>
            </div>
            <aside className={styles.note}>
              <strong>Não é uma lista fechada.</strong>
              <p>O banco pode pedir documentos adicionais conforme renda, estado civil, uso do FGTS, composição da proposta e características do imóvel.</p>
            </aside>
          </div>
        </div>
      </section>

      <section className={styles.content}>
        <div className={`container ${styles.grid}`}>
          <McmvDocumentChecklist />

          <aside className={styles.sideCard}>
            <span className={styles.kicker}>Antes de ir ao banco</span>
            <h2>Faça também estas duas coisas.</h2>
            <div className={styles.sideItem}>
              <strong>1. Confira sua faixa</strong>
              <p>Veja os limites de renda, juros e subsídios atuais do programa.</p>
              <a href="/guias/minha-casa-minha-vida">Ler guia MCMV →</a>
            </div>
            <div className={styles.sideItem}>
              <strong>2. Simule os números</strong>
              <p>Teste valor do imóvel, entrada, prazo e taxa antes de comparar com os bancos.</p>
              <a href="/calculadoras/financiamento">Abrir calculadora →</a>
            </div>
          </aside>
        </div>
      </section>

      <section className={styles.infoSection}>
        <div className="container">
          <div className={styles.infoGrid}>
            <div>
              <span className={styles.kicker}>Uso do FGTS</span>
              <h2>Vai usar FGTS na compra?</h2>
            </div>
            <div>
              <p>Além do extrato, o trabalhador precisa atender às regras para uso do fundo. Entre elas, somar pelo menos 3 anos de trabalho sob o regime do FGTS, consecutivos ou não, e respeitar as condições sobre outros imóveis e financiamentos ativos.</p>
              <a href="https://www.caixa.gov.br/voce/habitacao/Paginas/utilizacao-fgts.aspx" target="_blank" rel="noopener noreferrer">Conferir regras oficiais na CAIXA ↗</a>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.disclaimer}>
        <div className="container">Conteúdo informativo. A relação final de documentos é definida pela instituição financeira e pode mudar conforme o perfil da operação.</div>
      </section>

      <footer className="footer">
        <div className="container footer-inner">
          <a className="footer-brand" href="/"><span className="brand-dot" /> DESCOMPLICASA</a>
          <p>© 2026 Descomplicasa.</p>
        </div>
      </footer>
    </main>
  );
}
