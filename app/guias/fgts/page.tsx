import type { Metadata } from "next";
import { Header } from "@/components/Header";
import styles from "../minha-casa-minha-vida/mcmv.module.css";

export const metadata: Metadata = {
  title: "FGTS na compra do imóvel: regras, app e Saque-Aniversário | Descomplicasa",
  description:
    "Veja como usar o FGTS na compra do imóvel, como consultar saldo e autorizar bancos no App FGTS e entenda o impacto do Saque-Aniversário e da antecipação.",
};

const faq = [
  {
    question: "Estar no Saque-Aniversário impede usar o FGTS para comprar um imóvel?",
    answer:
      "Não. A adesão ao Saque-Aniversário, sozinha, não elimina a hipótese de saque para moradia própria prevista em lei. O problema é quando existe antecipação do Saque-Aniversário: o saldo dado em garantia fica bloqueado e essa parte pode ficar indisponível para uso na compra ou no financiamento.",
  },
  {
    question: "Antecipei o Saque-Aniversário. Ainda posso comprar um imóvel?",
    answer:
      "Sim, a antecipação não proíbe a compra do imóvel. Porém, o valor do FGTS bloqueado como garantia do empréstimo pode não estar disponível para entrada, amortização ou liquidação. É importante consultar o saldo efetivamente livre antes de montar a compra.",
  },
  {
    question: "Preciso ter 3 anos no mesmo emprego para usar o FGTS?",
    answer:
      "Não. A regra considera pelo menos 3 anos de trabalho sob o regime do FGTS, consecutivos ou não, e os períodos podem ter ocorrido em empresas diferentes.",
  },
  {
    question: "Posso usar FGTS como entrada?",
    answer:
      "Sim, quando comprador, imóvel e operação atendem às regras. O saldo também pode ser usado em outras situações de moradia própria, como amortização, liquidação e pagamento de parte das prestações, conforme a modalidade e o enquadramento.",
  },
  {
    question: "Quanto tempo dura a autorização do banco para consultar meu FGTS?",
    answer:
      "Nas permissões de acesso relacionadas ao uso do FGTS em moradia própria, o Agente Operador informa prazo máximo de 90 dias. Depois disso, o acesso é cancelado automaticamente e pode ser necessário autorizar novamente.",
  },
];

const structuredData = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faq.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: { "@type": "Answer", text: item.answer },
  })),
};

export default function FgtsGuidePage() {
  return (
    <main id="top">
      <Header />

      <section className={styles.hero}>
        <div className="container">
          <nav className={styles.breadcrumb} aria-label="Navegação estrutural">
            <a href="/">Início</a><span>/</span><a href="/#guias">Guias</a><span>/</span><strong>FGTS</strong>
          </nav>

          <div className={styles.heroGrid}>
            <div>
              <span className={styles.kicker}>Guia prático</span>
              <h1>FGTS na compra do imóvel</h1>
              <p>Consulte o saldo, confira se ele está livre, autorize o banco e entenda as regras antes de contar com o FGTS na entrada.</p>
            </div>

            <aside className={styles.updateCard}>
              <span>Atenção</span>
              <strong>Saque-Aniversário não é igual a antecipação.</strong>
              <p>A adesão ao Saque-Aniversário não impede, por si só, o uso do FGTS na moradia. Já a antecipação pode bloquear parte do saldo.</p>
            </aside>
          </div>
        </div>
      </section>

      <div className={`container ${styles.layout}`}>
        <aside className={styles.toc} aria-label="Nesta página">
          <strong>Nesta página</strong>
          <a href="#para-que-usar">Para que usar</a>
          <a href="#requisitos">Requisitos básicos</a>
          <a href="#app">App FGTS</a>
          <a href="#autorizar">Autorizar consulta</a>
          <a href="#saque-aniversario">Saque-Aniversário</a>
          <a href="#antecipacao">Antecipação</a>
          <a href="#antes-de-simular">Antes de simular</a>
          <a href="#faq">Perguntas frequentes</a>
        </aside>

        <article className={styles.article}>
          <section id="para-que-usar" className={styles.section}>
            <span className={styles.sectionNumber}>01</span>
            <h2>Para que o FGTS pode ser usado na moradia</h2>
            <p>O FGTS possui uma modalidade específica para moradia própria. Quando as regras são atendidas, o trabalhador pode usar recursos da conta vinculada em diferentes momentos da compra e do financiamento.</p>

            <ul className={styles.bullets}>
              <li><strong>Compra:</strong> usar o saldo como parte do pagamento ou da entrada.</li>
              <li><strong>Amortização:</strong> reduzir o saldo devedor do financiamento.</li>
              <li><strong>Liquidação:</strong> quitar o saldo devedor, quando a operação se enquadra.</li>
              <li><strong>Prestações:</strong> utilizar o fundo para pagamento de parte das parcelas nas condições previstas para a modalidade.</li>
            </ul>
          </section>

          <section id="requisitos" className={styles.section}>
            <span className={styles.sectionNumber}>02</span>
            <h2>Requisitos básicos do trabalhador</h2>
            <p>O banco faz a verificação completa no momento da operação. Entre os principais requisitos informados pelo FGTS estão:</p>

            <ul className={styles.bullets}>
              <li><strong>Tempo de FGTS:</strong> somar pelo menos 3 anos de trabalho sob o regime do FGTS, consecutivos ou não.</li>
              <li><strong>Financiamento ativo:</strong> não ser titular de outro financiamento imobiliário ativo no SFH em qualquer parte do país.</li>
              <li><strong>Outro imóvel residencial:</strong> existem restrições relacionadas à propriedade de imóvel no município de residência ou trabalho e áreas limítrofes/metropolitanas.</li>
              <li><strong>Operação elegível:</strong> o imóvel e o financiamento também precisam atender às condições para uso do FGTS.</li>
            </ul>

            <div className={styles.callout}>
              <strong>Ter saldo não significa ter saldo disponível para a compra.</strong>
              <p>Antes de negociar contando com o FGTS, confira se há valores bloqueados, movimentações em processamento ou alguma condição que limite a utilização.</p>
            </div>
          </section>

          <section id="app" className={styles.section}>
            <span className={styles.sectionNumber}>03</span>
            <h2>Comece pelo App FGTS</h2>
            <p>O aplicativo oficial da CAIXA permite consultar saldo e extrato, acompanhar depósitos, verificar a sistemática de saque, solicitar movimentações e conceder autorizações a instituições financeiras.</p>

            <div className={styles.limitGrid}>
              <div><span>Android</span><strong>Google Play</strong><small>Aplicativo FGTS — Caixa Econômica Federal</small></div>
              <div><span>iPhone</span><strong>App Store</strong><small>Aplicativo FGTS — Caixa Econômica Federal</small></div>
              <div><span>Preço</span><strong>Gratuito</strong><small>Baixe apenas pelas lojas oficiais</small></div>
            </div>

            <div className={styles.heroActions}>
              <a className="button" href="https://play.google.com/store/apps/details?id=br.gov.caixa.fgts.trabalhador" target="_blank" rel="noopener noreferrer">Abrir Google Play</a>
              <a className={styles.secondaryLink} href="https://apps.apple.com/br/app/fgts/id1038441027" target="_blank" rel="noopener noreferrer">Abrir App Store</a>
            </div>
          </section>

          <section id="autorizar" className={styles.section}>
            <span className={styles.sectionNumber}>04</span>
            <h2>Como liberar a consulta do FGTS para o banco</h2>
            <p>Quando a instituição precisar consultar suas informações do FGTS para uma operação de moradia, a autorização pode ser feita pelo App FGTS. A nomenclatura dos menus pode mudar com atualizações do aplicativo, mas o caminho normalmente fica na área de autorizações.</p>

            <div className={styles.reasonList}>
              <article><span>01</span><div><h3>Abra o App FGTS</h3><p>Entre com seu CPF e senha e confira primeiro se seu saldo e seus vínculos aparecem corretamente.</p></div></article>
              <article><span>02</span><div><h3>Procure a área de autorizações</h3><p>No menu “Mais” ou no menu principal, procure “Autorizações de consulta às informações do FGTS” ou “Autorizar bancos a consultarem seu FGTS”.</p></div></article>
              <article><span>03</span><div><h3>Escolha a finalidade apresentada</h3><p>Selecione a opção relacionada à operação indicada pelo agente financeiro e localize a instituição que fará a análise.</p></div></article>
              <article><span>04</span><div><h3>Leia e confirme o termo</h3><p>Confira o nome da instituição e a finalidade da autorização antes de confirmar. Para uso em moradia própria, a permissão de acesso tem prazo máximo informado de 90 dias.</p></div></article>
              <article><span>05</span><div><h3>Volte ao banco</h3><p>Depois da autorização, informe ao agente financeiro para que ele refaça a consulta. Se a permissão expirar, pode ser necessário repetir o procedimento.</p></div></article>
            </div>

            <div className={styles.requirements}>
              <h3>Não autorize qualquer instituição.</h3>
              <p>Confirme o banco ou agente financeiro com quem você está tratando. A autorização compartilha informações da sua conta vinculada para uma finalidade específica.</p>
            </div>
          </section>

          <section id="saque-aniversario" className={styles.section}>
            <span className={styles.sectionNumber}>05</span>
            <h2>Saque-Aniversário impede comprar imóvel?</h2>

            <div className={styles.callout}>
              <strong>Não.</strong>
              <p>Estar na sistemática Saque-Aniversário não elimina o uso do FGTS para moradia própria. A legislação mantém outras hipóteses de saque, entre elas moradia, desde que os requisitos sejam atendidos.</p>
            </div>

            <p>O Saque-Aniversário muda principalmente a forma de saque em caso de desligamento do trabalho e permite retirar uma parcela anual do saldo. Portanto, não confunda a simples adesão com a contratação de um empréstimo de antecipação.</p>

            <div className={styles.tableWrap}>
              <table>
                <thead><tr><th>Situação</th><th>Compra do imóvel</th><th>FGTS disponível</th></tr></thead>
                <tbody>
                  <tr><td><strong>Saque-Rescisão</strong></td><td>Pode usar para moradia se cumprir as regras</td><td>Depende do saldo e de outros bloqueios</td></tr>
                  <tr><td><strong>Saque-Aniversário sem antecipação</strong></td><td>Pode usar para moradia se cumprir as regras</td><td>O saldo não está bloqueado por empréstimo de antecipação</td></tr>
                  <tr><td><strong>Saque-Aniversário com antecipação</strong></td><td>A compra continua possível</td><td>A parcela do saldo bloqueada em garantia pode ficar indisponível</td></tr>
                </tbody>
              </table>
            </div>
          </section>

          <section id="antecipacao" className={styles.section}>
            <span className={styles.sectionNumber}>06</span>
            <h2>O cuidado principal: antecipação do Saque-Aniversário</h2>
            <p>Na antecipação, você contrata um empréstimo e oferece direitos futuros do Saque-Aniversário como garantia. Para garantir esse crédito, parte do saldo das contas do FGTS é bloqueada.</p>

            <div className={styles.callout}>
              <strong>Esse bloqueio pode afetar o financiamento habitacional.</strong>
              <p>A própria CAIXA alerta que o saldo bloqueado pode impactar movimentações para financiamento habitacional, contratação e amortização.</p>
            </div>

            <p>Isso não significa que quem antecipou está proibido de financiar um imóvel. Significa que o dinheiro bloqueado não deve ser considerado como entrada disponível até você verificar quanto realmente está livre.</p>

            <div className={styles.requirements}>
              <h3>Vai comprar nos próximos meses?</h3>
              <p>Antes de antecipar Saque-Aniversário, compare o benefício de receber o dinheiro agora com o valor que você pretende usar como entrada. Um empréstimo pequeno pode bloquear uma parcela maior do saldo-base do FGTS.</p>
            </div>
          </section>

          <section id="antes-de-simular" className={styles.section}>
            <span className={styles.sectionNumber}>07</span>
            <h2>Checklist rápido antes de simular o imóvel</h2>
            <ul className={styles.bullets}>
              <li>Abra o App FGTS e confira o saldo total.</li>
              <li>Veja o extrato e confirme se os depósitos do empregador estão entrando.</li>
              <li>Confira em qual sistemática você está: Saque-Rescisão ou Saque-Aniversário.</li>
              <li>Verifique se existe antecipação contratada e quanto do saldo está bloqueado.</li>
              <li>Separe o saldo livre do saldo total: para a compra, essa diferença é essencial.</li>
              <li>Quando o banco solicitar, autorize a consulta pelo App FGTS.</li>
              <li>Confirme com o agente financeiro quanto do FGTS poderá efetivamente entrar na operação.</li>
            </ul>

            <section className={styles.nextStep}>
              <div>
                <span>Próximo passo</span>
                <h2>Descubra sua faixa e simule a compra.</h2>
                <p>Depois de conferir o FGTS, veja seu enquadramento no Minha Casa Minha Vida e teste entrada, prazo e financiamento.</p>
              </div>
              <a className="button" href="/calculadoras/faixa-minha-casa-minha-vida">Descobrir minha faixa</a>
            </section>
          </section>

          <section id="faq" className={styles.section}>
            <span className={styles.sectionNumber}>08</span>
            <h2>Perguntas frequentes</h2>
            <div className={styles.faq}>
              {faq.map((item) => (
                <details key={item.question} className={styles.faqItem}>
                  <summary>{item.question}<span aria-hidden="true">+</span></summary>
                  <p>{item.answer}</p>
                </details>
              ))}
            </div>
          </section>

          <section className={styles.sources}>
            <h2>Fontes oficiais</h2>
            <p>Regras revisadas com base no Portal FGTS e na CAIXA. Como as normas podem mudar, confirme a situação no momento da operação.</p>
            <div>
              <a href="https://www.fgts.gov.br/Paginas/trabalhador/fgts-na-moradia.aspx" target="_blank" rel="noopener noreferrer">FGTS na Moradia Própria</a>
              <a href="https://www.fgts.gov.br/Paginas/trabalhador/saque/saque-aniversario.aspx" target="_blank" rel="noopener noreferrer">Regras do Saque-Aniversário</a>
              <a href="https://www.caixa.gov.br/atendimento/aplicativos/fgts/Paginas/default.aspx" target="_blank" rel="noopener noreferrer">Aplicativo FGTS — CAIXA</a>
              <a href="https://www.caixa.gov.br/voce/credito-financiamento/emprestimo/antecipacao-saque-aniversario-FGTS/perguntas-frequentes/Paginas/default.aspx" target="_blank" rel="noopener noreferrer">Antecipação — perguntas frequentes</a>
            </div>
          </section>
        </article>
      </div>

      <section className={styles.disclaimer}>
        <div className="container">Conteúdo informativo. Não substitui análise da instituição financeira nem a verificação das regras vigentes do FGTS para comprador, imóvel e operação.</div>
      </section>

      <footer className="footer">
        <div className="container footer-inner">
          <a className="footer-brand" href="/"><span className="brand-dot" /> DESCOMPLICASA</a>
          <p>© 2026 Descomplicasa.</p>
        </div>
      </footer>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
    </main>
  );
}
