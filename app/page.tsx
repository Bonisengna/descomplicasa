import { Header } from "@/components/Header";
import {
  ArrowIcon,
  BankIcon,
  BoltIcon,
  CalculatorIcon,
  ChecklistIcon,
  FileIcon,
  FolderIcon,
  HouseIcon,
  PiggyIcon,
  ShieldIcon,
  StampIcon,
} from "@/components/Icons";

const calculators = [
  { title: "Financiamento", text: "Descubra quanto pode financiar e tenha uma noção das parcelas.", Icon: CalculatorIcon, href: "/calculadoras/financiamento" },
  { title: "Entrada", text: "Veja quanto precisa juntar e organize os recursos para a compra.", Icon: PiggyIcon },
  { title: "ITBI", text: "Entenda o imposto envolvido na transferência do imóvel.", Icon: BankIcon },
  { title: "Escritura", text: "Saiba quando ela é necessária e quais custos considerar.", Icon: FileIcon },
  { title: "Registro", text: "Entenda o registro e os custos para colocar o imóvel no seu nome.", Icon: StampIcon },
];

const checklists = [
  { title: "Documentos MCMV", text: "Separe os principais documentos antes de procurar o banco.", Icon: FolderIcon, href: "/checklists/documentos-mcmv" },
  { title: "Documentos", text: "Lista de documentos do comprador, vendedor e imóvel.", Icon: FolderIcon },
  { title: "Visita", text: "O que observar no imóvel antes de tomar uma decisão.", Icon: HouseIcon },
  { title: "Compra", text: "As principais etapas da negociação até as chaves.", Icon: ChecklistIcon },
];

const guides = [
  { title: "Minha Casa Minha Vida", text: "Faixas de renda, subsídios, juros, FGTS e regras atualizadas para 2026.", className: "guide-financing", href: "/guias/minha-casa-minha-vida" },
  { title: "Financiamento", text: "Como funciona, o que influencia a aprovação e quais custos observar.", className: "guide-financing" },
  { title: "FGTS", text: "Quando pode ser usado na compra e quais regras precisam ser verificadas.", className: "guide-fgts" },
  { title: "ITBI", text: "O que é, quando é pago e por que o valor pode variar por município.", className: "guide-itbi" },
  { title: "Escritura", text: "Para que serve e em quais situações ela faz parte da compra.", className: "guide-deed" },
  { title: "Registro", text: "Por que registrar é essencial para formalizar a propriedade.", className: "guide-registry" },
];

export default function Home() {
  return (
    <main id="top">
      <Header />

      <section className="hero">
        <div className="container hero-grid">
          <div className="hero-copy">
            <span className="eyebrow"><ShieldIcon /> Planeje. Verifique. Entenda.</span>
            <h1>Vai comprar<br />um <span>imóvel?</span></h1>
            <p className="hero-lead">Calcule custos, confira documentos e entenda cada etapa antes de fechar negócio.</p>
            <div className="hero-actions">
              <a className="button" href="/calculadoras/financiamento">Simular financiamento <ArrowIcon /></a>
              <a className="button button-secondary" href="#checklists">Ver checklists</a>
            </div>

            <div className="hero-benefits" aria-label="Benefícios">
              <div><span className="mini-icon"><CalculatorIcon /></span><p><strong>Gratuito</strong><small>Ferramentas para começar sem custo.</small></p></div>
              <div><span className="mini-icon"><ShieldIcon /></span><p><strong>Sem cadastro</strong><small>Use as ferramentas sem precisar criar uma conta.</small></p></div>
              <div><span className="mini-icon"><BoltIcon /></span><p><strong>Direto ao ponto</strong><small>Informação organizada por etapa.</small></p></div>
            </div>
          </div>

          <div className="hero-visual" aria-label="Exemplo de resumo de uma compra">
            <div className="hero-blob" />
            <svg className="house-drawing" viewBox="0 0 560 440" role="img" aria-label="Ilustração linear de uma casa">
              <g fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M80 198 280 92l198 103" />
                <path d="M113 184v174h330V180" />
                <path d="M155 170 280 108l126 66" />
                <path d="M226 358V245h109v113" />
                <path d="M135 228h70v64h-70zM355 225h65v67h-65z" />
                <path d="M245 273h70M280 245v113" />
                <path d="M79 358h398" />
                <path d="M93 355c20-42 13-91-12-106-22 17-31 59-13 106" />
                <path d="M81 355v-75" />
              </g>
            </svg>

            <div className="summary-card">
              <div className="summary-heading"><div><small>Exemplo</small><h2>Resumo da sua compra</h2></div><span className="summary-check"><ShieldIcon /></span></div>
              <dl>
                <div><dt>Valor do imóvel</dt><dd>R$ 300.000</dd></div>
                <div><dt>Entrada</dt><dd>R$ 60.000</dd></div>
                <div><dt>ITBI estimado</dt><dd>R$ 9.000</dd></div>
                <div><dt>Escritura</dt><dd>R$ 2.800</dd></div>
                <div><dt>Registro</dt><dd>R$ 3.200</dd></div>
                <div><dt>Outros custos</dt><dd>R$ 2.450</dd></div>
              </dl>
              <div className="summary-total"><span>Custo inicial ilustrativo</span><strong>R$ 77.450</strong></div>
              <p className="summary-note">Valores apenas ilustrativos. Use as ferramentas para fazer suas próprias estimativas.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section" id="calculadoras">
        <div className="container">
          <div className="section-heading">
            <div><span className="kicker">Comece pelos números</span><h2>Calculadoras</h2><p>Entenda os principais custos e organize cada etapa da compra.</p></div>
            <span className="coming-link">Financiamento já disponível</span>
          </div>
          <div className="calculator-grid">
            {calculators.map(({ title, text, Icon, href }) => (
              <article className="tool-card" key={title}>
                <span className="tool-icon"><Icon /></span>
                <h3>{title}</h3>
                <p>{text}</p>
                {href ? (
                  <a className="status-pill" href={href}>Calcular agora →</a>
                ) : (
                  <span className="status-pill">Em breve</span>
                )}
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-soft" id="checklists">
        <div className="container">
          <div className="section-heading">
            <div><span className="kicker">Não esqueça nada importante</span><h2>Checklists</h2><p>Organize o que precisa ser conferido antes de avançar na compra.</p></div>
            <span className="coming-link">Documentos MCMV já disponível</span>
          </div>
          <div className="checklist-grid">
            {checklists.map(({ title, text, Icon, href }) => (
              <article className="check-card" key={title}>
                <span className="check-icon"><Icon /></span>
                <div>
                  <h3>{title}</h3>
                  <p>{text}</p>
                  {href ? <a className="text-status" href={href}>Abrir checklist →</a> : <span className="text-status">Em breve</span>}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section" id="guias">
        <div className="container">
          <div className="section-heading">
            <div><span className="kicker">Entenda como funciona</span><h2>Guias</h2><p>Conteúdo prático para entender termos, custos e decisões da compra.</p></div>
            <span className="coming-link">Guia MCMV 2026 já disponível</span>
          </div>
          <div className="guides-grid">
            {guides.map((guide) => (
              <article className="guide-card" key={guide.title}>
                <div className={`guide-visual ${guide.className}`} aria-hidden="true"><span>{guide.title}</span></div>
                <div className="guide-body">
                  <h3>{guide.title}</h3>
                  <p>{guide.text}</p>
                  {guide.href ? <a className="text-status" href={guide.href}>Ler guia →</a> : <span className="text-status">Em breve</span>}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="about-section" id="sobre">
        <div className="container about-grid">
          <div><span className="kicker">Por que existe</span><h2>Comprar um imóvel tem muita informação espalhada.</h2></div>
          <div><p>O Descomplicasa nasce para reunir ferramentas e conteúdo em uma experiência simples: calcular, conferir e entender antes de decidir.</p><p className="about-disclaimer">O conteúdo tem caráter informativo e não substitui análise jurídica, registral, bancária ou técnica quando necessária.</p></div>
        </div>
      </section>

      <section className="final-cta">
        <div className="container final-cta-inner">
          <div><span className="brand-inline"><span className="brand-dot" /> DESCOMPLICASA</span><h2>Tudo o que você precisa entender antes de comprar um imóvel.</h2></div>
          <a className="button button-light" href="/calculadoras/financiamento">Simular financiamento <ArrowIcon /></a>
        </div>
      </section>

      <footer className="footer">
        <div className="container footer-inner">
          <a className="footer-brand" href="#top"><span className="brand-dot" /> DESCOMPLICASA</a>
          <p>© 2026 Descomplicasa.</p>
        </div>
      </footer>
    </main>
  );
}
