import type { Metadata } from "next";
import { Header } from "@/components/Header";
import styles from "../minha-casa-minha-vida/mcmv.module.css";

export const metadata: Metadata = {
  title: "Escritura de imóvel: quando é necessária e quanto custa | DescompliCAZA",
  description:
    "Entenda quando a escritura pública é necessária, quando o contrato de financiamento pode substituí-la, diferença para registro, custos, documentos e etapas da compra.",
};

const faq = [
  {
    question: "Todo imóvel precisa de escritura pública para ser comprado?",
    answer:
      "Não. O Código Civil estabelece a escritura pública como regra para negócios que envolvam direitos reais sobre imóveis acima do limite previsto no art. 108, salvo quando a própria lei admitir outra forma. Há operações de financiamento em que o instrumento particular possui efeitos de escritura pública.",
  },
  {
    question: "Imóvel financiado precisa de uma escritura separada?",
    answer:
      "Nem sempre. Em operações abrangidas pela Lei 9.514/1997, os atos e contratos podem ser celebrados por instrumento particular com efeitos de escritura pública. O comprador deve conferir o tipo de contrato utilizado pelo banco e as exigências do Registro de Imóveis.",
  },
  {
    question: "Escritura e registro são a mesma coisa?",
    answer:
      "Não. A escritura ou outro título formaliza o negócio. A propriedade imobiliária entre vivos é transferida com o registro do título no Registro de Imóveis, conforme o art. 1.245 do Código Civil.",
  },
  {
    question: "Quanto custa uma escritura de imóvel?",
    answer:
      "Não existe um preço nacional único. Os Estados e o Distrito Federal fixam tabelas de emolumentos para os serviços notariais e de registro. O valor pode variar conforme a unidade da Federação, o tipo de ato e a faixa de valor envolvida.",
  },
  {
    question: "Comprar pelo Minha Casa Minha Vida sempre dispensa escritura?",
    answer:
      "Não é correto tratar isso como regra automática. Quando a compra é financiada por instrumento que, por lei, produz efeitos de escritura pública, pode não haver uma escritura pública separada. O que vale é o título utilizado na operação e sua aptidão para registro.",
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

export default function EscrituraGuidePage() {
  return (
    <main id="top">
      <Header />

      <section className={styles.hero}>
        <div className="container">
          <nav className={styles.breadcrumb} aria-label="Navegação estrutural">
            <a href="/">Início</a><span>/</span><a href="/#guias">Guias</a><span>/</span><strong>Escritura</strong>
          </nav>

          <div className={styles.heroGrid}>
            <div>
              <span className={styles.kicker}>Guia prático</span>
              <h1>Escritura de imóvel sem confundir com registro</h1>
              <p>Entenda quando a escritura pública é necessária, quando o contrato de financiamento pode cumprir essa função e qual etapa realmente coloca o imóvel no seu nome.</p>
            </div>

            <aside className={styles.updateCard}>
              <span>Ponto principal</span>
              <strong>Escritura formaliza. Registro transfere a propriedade.</strong>
              <p>Em algumas compras financiadas, o contrato já tem efeitos de escritura pública e pode ser levado diretamente a registro.</p>
            </aside>
          </div>
        </div>
      </section>

      <div className={`container ${styles.layout}`}>
        <aside className={styles.toc} aria-label="Nesta página">
          <strong>Nesta página</strong>
          <a href="#o-que-e">O que é escritura</a>
          <a href="#quando">Quando é necessária</a>
          <a href="#financiamento">Imóvel financiado</a>
          <a href="#registro">Escritura x registro</a>
          <a href="#custos">Quanto custa</a>
          <a href="#documentos">Documentos</a>
          <a href="#etapas">Etapas da compra</a>
          <a href="#erros">Erros comuns</a>
          <a href="#faq">Perguntas frequentes</a>
        </aside>

        <article className={styles.article}>
          <section id="o-que-e" className={styles.section}>
            <span className={styles.sectionNumber}>01</span>
            <h2>O que é uma escritura pública</h2>
            <p>A escritura pública é um instrumento formal elaborado por tabelião para documentar determinados negócios jurídicos. Em uma compra e venda de imóvel, ela registra as declarações das partes e as condições essenciais da operação quando a lei exige ou quando as partes optam por essa forma.</p>
            <p>Ela é diferente de contrato particular, promessa de compra e venda e registro imobiliário. Cada documento cumpre uma função própria dentro da jornada da compra.</p>

            <div className={styles.callout}>
              <strong>A escritura não é, sozinha, o que coloca o imóvel no nome do comprador.</strong>
              <p>A transferência da propriedade entre vivos ocorre com o registro do título no Registro de Imóveis.</p>
            </div>
          </section>

          <section id="quando" className={styles.section}>
            <span className={styles.sectionNumber}>02</span>
            <h2>Quando a escritura pública é necessária</h2>
            <p>O art. 108 do Código Civil estabelece que, salvo quando a lei dispuser de modo diferente, a escritura pública é essencial para negócios que constituam, transfiram, modifiquem ou renunciem direitos reais sobre imóveis cujo valor ultrapasse trinta vezes o maior salário mínimo vigente no País.</p>
            <p>Essa regra possui exceções legais importantes. Por isso, não é seguro transformar o art. 108 em uma fórmula do tipo “acima de X sempre escritura, abaixo de X nunca escritura”. O tipo de negócio e a legislação específica precisam ser considerados.</p>

            <div className={styles.requirements}>
              <h3>Compra à vista de imóvel de maior valor</h3>
              <p>É o cenário clássico em que a escritura pública costuma fazer parte da operação: comprador e vendedor formalizam a compra no Tabelionato de Notas e, depois, o título é encaminhado ao Registro de Imóveis.</p>
            </div>
          </section>

          <section id="financiamento" className={styles.section}>
            <span className={styles.sectionNumber}>03</span>
            <h2>Imóvel financiado: preciso fazer escritura separada?</h2>
            <p>Muitas vezes, não. A Lei 9.514/1997 permite que os atos e contratos abrangidos por ela sejam celebrados por instrumento particular com efeitos de escritura pública. Isso é especialmente relevante nas operações com alienação fiduciária, estrutura muito utilizada no financiamento imobiliário.</p>
            <p>Na prática, o contrato assinado com a instituição financeira pode reunir compra e venda, financiamento e garantia em um único título apto a ser apresentado ao Registro de Imóveis.</p>

            <div className={styles.callout}>
              <strong>Financiamento não significa automaticamente “pagar escritura em cartório de notas”.</strong>
              <p>Antes de reservar dinheiro para uma escritura separada, confirme qual título será usado pelo banco e quais emolumentos efetivamente serão cobrados na operação.</p>
            </div>

            <div className={styles.sourceNote}>
              <span>Planejamento:</span>
              <a href="/calculadoras/financiamento">Simular financiamento</a>
              <a href="/guias/financiamento">Entender o financiamento imobiliário</a>
            </div>
          </section>

          <section id="registro" className={styles.section}>
            <span className={styles.sectionNumber}>04</span>
            <h2>Escritura e registro não são a mesma coisa</h2>
            <p>Essa é uma das confusões mais comuns na compra de imóvel. A escritura pública, quando necessária, é o título que formaliza o negócio. O contrato bancário com efeitos de escritura pública pode exercer função semelhante em uma compra financiada.</p>
            <p>Já o Registro de Imóveis é a etapa que produz a transferência da propriedade. O art. 1.245 do Código Civil determina que a propriedade entre vivos se transfere mediante o registro do título translativo.</p>

            <div className={styles.limitGrid}>
              <div><span>Escritura</span><strong>Formaliza</strong><small>documenta o negócio quando essa forma é exigida ou escolhida</small></div>
              <div><span>Contrato bancário</span><strong>Pode substituir</strong><small>quando a lei atribui ao instrumento efeitos de escritura pública</small></div>
              <div><span>Registro</span><strong>Transfere</strong><small>leva o título à matrícula e formaliza a nova titularidade</small></div>
            </div>
          </section>

          <section id="custos" className={styles.section}>
            <span className={styles.sectionNumber}>05</span>
            <h2>Quanto custa a escritura</h2>
            <p>Não existe um preço nacional único para escritura. A Lei 10.169/2000 estabelece normas gerais e determina que os Estados e o Distrito Federal fixem os valores dos emolumentos dos serviços notariais e de registro.</p>
            <p>As tabelas normalmente organizam os atos por natureza e por faixas de valor. Por isso, dois imóveis de mesmo preço em Estados diferentes podem gerar custos cartorários diferentes.</p>

            <div className={styles.reasonList}>
              <article><span>01</span><div><h3>Veja a tabela vigente do seu Estado</h3><p>Consulte a tabela oficial de emolumentos do Tribunal de Justiça ou da autoridade responsável pela fiscalização extrajudicial.</p></div></article>
              <article><span>02</span><div><h3>Separe escritura de registro</h3><p>São atos distintos e podem gerar cobranças diferentes. Em financiamento, também podem existir atos relacionados à garantia.</p></div></article>
              <article><span>03</span><div><h3>Não use porcentagem genérica</h3><p>“Escritura custa X% do imóvel” é uma simplificação ruim. As tabelas podem trabalhar por faixas e incluir parcelas específicas.</p></div></article>
            </div>

            <div className={styles.callout}>
              <strong>ITBI também não é custo de escritura.</strong>
              <p>O ITBI é um imposto municipal. Escritura e registro envolvem emolumentos cartorários. São itens diferentes no orçamento da compra.</p>
            </div>

            <div className={styles.sourceNote}>
              <span>Próximo cálculo:</span>
              <a href="/calculadoras/itbi">Estimar ITBI</a>
            </div>
          </section>

          <section id="documentos" className={styles.section}>
            <span className={styles.sectionNumber}>06</span>
            <h2>Quais documentos podem ser pedidos</h2>
            <p>A lista exata depende do negócio, do estado civil das partes, do imóvel e das exigências da serventia. Por isso, use esta relação apenas como preparação inicial e confirme a lista definitiva antes de comparecer ao cartório.</p>

            <ul className={styles.bullets}>
              <li><strong>Comprador e vendedor:</strong> documentos de identificação, CPF e dados de qualificação.</li>
              <li><strong>Estado civil:</strong> certidões e informações do casamento ou união, quando aplicável.</li>
              <li><strong>Imóvel:</strong> matrícula atualizada e dados cadastrais necessários para identificar corretamente o bem.</li>
              <li><strong>Negócio:</strong> preço, forma de pagamento e condições combinadas entre as partes.</li>
              <li><strong>Tributos e certidões:</strong> documentos e comprovantes que sejam exigidos para aquele ato e localidade.</li>
              <li><strong>Representação:</strong> procurações ou documentos societários quando alguma parte não atuar pessoalmente.</li>
            </ul>
          </section>

          <section id="etapas" className={styles.section}>
            <span className={styles.sectionNumber}>07</span>
            <h2>Da negociação ao imóvel no seu nome</h2>
            <p>A sequência pode variar conforme compra à vista, financiamento e regras locais, mas esta visão ajuda a entender onde a escritura se encaixa.</p>

            <div className={styles.reasonList}>
              <article><span>01</span><div><h3>Conferir o imóvel e a matrícula</h3><p>Antes de formalizar a compra, identifique corretamente o imóvel, proprietários, ônus e informações relevantes da matrícula.</p></div></article>
              <article><span>02</span><div><h3>Definir o título da operação</h3><p>Compra à vista pode exigir escritura pública. Compra financiada pode utilizar contrato com efeitos de escritura, conforme a modalidade.</p></div></article>
              <article><span>03</span><div><h3>Cumprir exigências fiscais e documentais</h3><p>Organize ITBI e demais documentos exigidos pelo município, tabelionato, banco e Registro de Imóveis.</p></div></article>
              <article><span>04</span><div><h3>Assinar o título</h3><p>A escritura ou contrato é formalizado pelas partes conforme o procedimento aplicável.</p></div></article>
              <article><span>05</span><div><h3>Registrar</h3><p>O título é apresentado ao Registro de Imóveis competente. É o registro que efetiva a transferência da propriedade.</p></div></article>
            </div>
          </section>

          <section id="erros" className={styles.section}>
            <span className={styles.sectionNumber}>08</span>
            <h2>4 erros comuns sobre escritura</h2>
            <div className={styles.reasonList}>
              <article><span>01</span><div><h3>Confundir escritura com registro</h3><p>Sair do Tabelionato de Notas com uma escritura não significa que a matrícula já foi atualizada para o comprador.</p></div></article>
              <article><span>02</span><div><h3>Reservar um “percentual padrão” para escritura</h3><p>Emolumentos dependem da tabela estadual e do ato praticado.</p></div></article>
              <article><span>03</span><div><h3>Pagar escritura separada sem conferir o financiamento</h3><p>Em certas modalidades o próprio contrato possui efeitos de escritura pública.</p></div></article>
              <article><span>04</span><div><h3>Olhar apenas o custo da escritura</h3><p>ITBI, registro e outros custos da operação também precisam entrar no planejamento financeiro.</p></div></article>
            </div>
          </section>

          <section id="faq" className={styles.section}>
            <span className={styles.sectionNumber}>09</span>
            <h2>Perguntas frequentes</h2>
            <div className={styles.faq}>
              {faq.map((item) => (
                <details className={styles.faqItem} key={item.question}>
                  <summary>{item.question}<span>+</span></summary>
                  <p>{item.answer}</p>
                </details>
              ))}
            </div>
          </section>

          <section className={styles.nextStep}>
            <div>
              <span>Próximo passo</span>
              <h2>Depois da escritura, entenda o registro.</h2>
              <p>O próximo guia do DescompliCAZA vai fechar essa etapa mostrando como o título chega à matrícula e quando a propriedade passa oficialmente para o comprador.</p>
            </div>
            <a className="button" href="/guias/itbi">Revisar custos da compra</a>
          </section>

          <section className={styles.sources}>
            <h2>Fontes oficiais</h2>
            <p>Conteúdo revisado em 12 de agosto de 2026 com base na legislação federal aplicável. Regras locais, tabelas de emolumentos e exigências documentais devem ser confirmadas na unidade da Federação e nas serventias envolvidas.</p>
            <div>
              <a href="https://www.planalto.gov.br/ccivil_03/leis/2002/l10406compilada.htm" target="_blank" rel="noopener noreferrer">Código Civil — arts. 108 e 1.245</a>
              <a href="https://www.planalto.gov.br/ccivil_03/leis/l9514.htm" target="_blank" rel="noopener noreferrer">Lei 9.514/1997 — art. 38</a>
              <a href="https://www.planalto.gov.br/ccivil_03/leis/l10169.htm" target="_blank" rel="noopener noreferrer">Lei 10.169/2000 — emolumentos</a>
            </div>
          </section>
        </article>
      </div>

      <section className={styles.disclaimer}>
        <div className="container">Conteúdo informativo. A forma exigida para o negócio, os documentos e os emolumentos podem variar conforme a operação e a legislação aplicável. Confirme os requisitos com o tabelionato, Registro de Imóveis, instituição financeira e profissionais responsáveis pelo caso.</div>
      </section>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
    </main>
  );
}
