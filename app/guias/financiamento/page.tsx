import type { Metadata } from "next";
import { Header } from "@/components/Header";
import styles from "../minha-casa-minha-vida/mcmv.module.css";

export const metadata: Metadata = {
  title: "Financiamento imobiliário: guia completo para comprar imóvel | Descomplicasa",
  description:
    "Entenda como funciona o financiamento imobiliário, entrada, prazo, juros, CET, SAC e Price, análise de crédito, custos e etapas até a assinatura.",
};

const faq = [
  {
    question: "Quanto da renda pode ser comprometido com a prestação?",
    answer:
      "Cada instituição define seus critérios. O Banco Central informa que, em geral, o comprometimento não ultrapassa 30% da renda, mas o banco também considera outras dívidas, despesas, prazo e valor financiado. Aprovação não significa que a parcela seja confortável para o seu orçamento.",
  },
  {
    question: "Posso financiar sem entrada?",
    answer:
      "Depende da linha de crédito, do valor de avaliação do imóvel, da renda, do perfil do comprador e de benefícios disponíveis. Em algumas operações do Minha Casa Minha Vida, subsídios, FGTS ou aportes públicos podem reduzir bastante a entrada, mas isso não é garantido para todos.",
  },
  {
    question: "Qual é melhor: SAC ou Price?",
    answer:
      "Não existe um sistema melhor para todos. No SAC, a amortização do principal é constante e as prestações tendem a cair. Na Price, as prestações de principal e juros tendem a ser mais uniformes no início. O melhor depende do fluxo de caixa, taxa, prazo e condições do contrato.",
  },
  {
    question: "Taxa de juros e CET são a mesma coisa?",
    answer:
      "Não. A taxa de juros é apenas uma parte do custo. O CET reúne juros e outros encargos e despesas vinculados à operação, como tarifas, tributos e seguros quando aplicáveis. Por isso ele é mais útil para comparar propostas.",
  },
  {
    question: "O banco financia o valor anunciado ou o valor avaliado?",
    answer:
      "A instituição faz sua própria avaliação do imóvel. O percentual financiável e a base usada no cálculo dependem das regras da linha e do banco. Se a avaliação ficar abaixo do preço negociado, o comprador pode precisar aumentar os recursos próprios.",
  },
  {
    question: "Posso transferir o financiamento para outro banco depois?",
    answer:
      "Sim. Existe portabilidade de crédito imobiliário. A nova instituição analisa a operação e apresenta condições. No SFH, a operação portada deve continuar respeitando as regras desse sistema.",
  },
];

const structuredData = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faq.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.answer,
    },
  })),
};

export default function FinancingGuidePage() {
  return (
    <main id="top">
      <Header />

      <section className={styles.hero}>
        <div className="container">
          <nav className={styles.breadcrumb} aria-label="Navegação estrutural">
            <a href="/">Início</a><span>/</span><a href="/#guias">Guias</a><span>/</span><strong>Financiamento</strong>
          </nav>

          <div className={styles.heroGrid}>
            <div>
              <span className={styles.kicker}>Guia prático</span>
              <h1>Financiamento imobiliário</h1>
              <p>Da entrada à assinatura: entenda o que realmente influencia a aprovação, a parcela e o custo total antes de assumir uma dívida de décadas.</p>
              <div className={styles.heroActions}>
                <a className="button" href="/calculadoras/financiamento">Simular financiamento →</a>
                <a className={styles.secondaryLink} href="/guias/renda-bruta-financiamento-imobiliario">Entender a renda usada pelo banco</a>
              </div>
            </div>

            <aside className={styles.updateCard}>
              <span>Ideia principal</span>
              <strong>Parcela baixa não significa financiamento barato.</strong>
              <p>Prazo, taxa, seguros, tarifas, sistema de amortização e demais custos mudam quanto você pagará no total.</p>
            </aside>
          </div>
        </div>
      </section>

      <div className={`container ${styles.layout}`}>
        <aside className={styles.toc} aria-label="Nesta página">
          <strong>Nesta página</strong>
          <a href="#como-funciona">Como funciona</a>
          <a href="#entrada">Entrada e valor financiado</a>
          <a href="#aprovacao">Análise de crédito</a>
          <a href="#juros-cet">Juros e CET</a>
          <a href="#sac-price">SAC x Price</a>
          <a href="#custos">Custos além da parcela</a>
          <a href="#etapas">Etapas do financiamento</a>
          <a href="#comparar">Como comparar propostas</a>
          <a href="#faq">Perguntas frequentes</a>
        </aside>

        <article className={styles.article}>
          <section id="como-funciona" className={styles.section}>
            <span className={styles.sectionNumber}>01</span>
            <h2>Como funciona um financiamento imobiliário</h2>
            <p>Em vez de pagar todo o imóvel à vista, você usa recursos próprios para uma parte da compra e contrata o restante com uma instituição financeira. Depois, devolve esse dinheiro em prestações ao longo de vários anos, acrescido dos custos previstos no contrato.</p>
            <p>O banco não analisa somente você. Ele também avalia o imóvel que servirá de garantia, verifica documentos e define quanto está disposto a financiar naquela operação.</p>

            <div className={styles.limitGrid}>
              <div><span>Você entra com</span><strong>recursos próprios</strong><small>entrada, FGTS ou benefícios elegíveis</small></div>
              <div><span>O banco entra com</span><strong>valor financiado</strong><small>dentro das regras da linha e da análise</small></div>
              <div><span>Você devolve em</span><strong>prestações</strong><small>com amortização, juros e demais encargos</small></div>
            </div>
          </section>

          <section id="entrada" className={styles.section}>
            <span className={styles.sectionNumber}>02</span>
            <h2>Entrada: a parte que o banco não financia</h2>
            <p>A entrada é a diferença entre o custo da compra e o que efetivamente será financiado. Ela pode vir de dinheiro próprio, FGTS quando permitido e, em algumas operações, subsídios ou aportes públicos.</p>
            <p>Não trate a entrada como único gasto inicial. ITBI, registro, avaliação, mudança, eventuais reformas e outras despesas podem exigir caixa separado.</p>

            <div className={styles.callout}>
              <strong>A avaliação do imóvel importa.</strong>
              <p>O banco faz sua própria avaliação. Se o preço negociado for maior do que a base aceita pela instituição, a diferença pode aumentar o valor que você terá de colocar do próprio bolso.</p>
            </div>
          </section>

          <section id="aprovacao" className={styles.section}>
            <span className={styles.sectionNumber}>03</span>
            <h2>O que influencia a aprovação</h2>
            <p>A análise não é apenas uma conta de renda. A instituição verifica capacidade de pagamento, outras obrigações financeiras, documentação, prazo, valor solicitado e características da operação.</p>

            <ul className={styles.bullets}>
              <li><strong>Renda comprovada:</strong> precisa ser compatível com o valor e a prestação pretendidos.</li>
              <li><strong>Outras dívidas:</strong> empréstimos, financiamentos e compromissos existentes podem reduzir a capacidade de contratar novo crédito.</li>
              <li><strong>Histórico e cadastro:</strong> o banco aplica seus critérios internos de risco e consulta informações necessárias à análise.</li>
              <li><strong>Prazo:</strong> alongar o contrato pode reduzir a prestação, mas normalmente aumenta o total pago ao longo do tempo.</li>
              <li><strong>Imóvel:</strong> documentação, avaliação e possibilidade de utilização como garantia também precisam ser aprovadas.</li>
            </ul>

            <div className={styles.requirements}>
              <h3>O limite do banco não é o seu limite pessoal.</h3>
              <p>O Banco Central informa que cada instituição trabalha com seu próprio percentual de comprometimento e que, em geral, ele não ultrapassa 30% da renda. Use isso como referência de análise de crédito, não como recomendação automática de orçamento.</p>
            </div>
          </section>

          <section id="juros-cet" className={styles.section}>
            <span className={styles.sectionNumber}>04</span>
            <h2>Taxa de juros não conta a história inteira</h2>
            <p>É comum comparar financiamento olhando apenas a taxa anunciada. Isso pode levar a uma escolha ruim, porque duas propostas com juros parecidos podem ter custos efetivos diferentes.</p>

            <div className={styles.tableWrap}>
              <table>
                <thead><tr><th>Indicador</th><th>O que mostra</th><th>Como usar</th></tr></thead>
                <tbody>
                  <tr><td><strong>Taxa de juros</strong></td><td>Preço do dinheiro emprestado</td><td>Ajuda a entender o custo financeiro básico</td></tr>
                  <tr><td><strong>CET</strong></td><td>Taxa consolidada com encargos e despesas da operação</td><td>É a referência principal para comparar propostas</td></tr>
                  <tr><td><strong>Prestação</strong></td><td>Quanto sai do orçamento em determinado mês</td><td>Mostra fluxo de caixa, mas não o custo total sozinho</td></tr>
                  <tr><td><strong>Total pago</strong></td><td>Soma projetada dos pagamentos no prazo</td><td>Ajuda a visualizar o impacto de contratos longos</td></tr>
                </tbody>
              </table>
            </div>

            <div className={styles.callout}>
              <strong>Compare pelo CET.</strong>
              <p>O Banco Central define o Custo Efetivo Total como uma medida que consolida os encargos e despesas da operação. A instituição deve informar o CET para que o cliente consiga comparar propostas.</p>
            </div>
          </section>

          <section id="sac-price" className={styles.section}>
            <span className={styles.sectionNumber}>05</span>
            <h2>SAC x Price: como a dívida é amortizada</h2>
            <p>O sistema de amortização define como o principal e os juros são distribuídos ao longo das prestações. Isso muda a evolução da parcela e do saldo devedor.</p>

            <div className={styles.tableWrap}>
              <table>
                <thead><tr><th></th><th>SAC</th><th>Price</th></tr></thead>
                <tbody>
                  <tr><td><strong>Amortização</strong></td><td>Parcela de principal tende a ser constante</td><td>É calculada dentro de uma prestação mais uniforme</td></tr>
                  <tr><td><strong>Prestação inicial</strong></td><td>Tende a começar maior</td><td>Tende a ser mais nivelada no modelo puro</td></tr>
                  <tr><td><strong>Evolução</strong></td><td>Tende a cair com o tempo</td><td>Tende a permanecer mais estável antes de outros componentes</td></tr>
                  <tr><td><strong>Saldo devedor</strong></td><td>Cai de forma mais acelerada no começo</td><td>A amortização inicial tende a ser menor</td></tr>
                </tbody>
              </table>
            </div>

            <p className={styles.smallNote}>Na vida real, seguros, índices de atualização e outras regras do contrato podem alterar o valor efetivamente cobrado em cada mês.</p>
            <a className="button" href="/calculadoras/financiamento">Comparar SAC e Price na calculadora →</a>
          </section>

          <section id="custos" className={styles.section}>
            <span className={styles.sectionNumber}>06</span>
            <h2>O custo da compra não termina na prestação</h2>
            <p>Antes de decidir quanto financiar, monte uma visão completa dos custos da compra e dos custos mensais do imóvel.</p>

            <ul className={styles.bullets}>
              <li><strong>Entrada:</strong> recursos que não serão financiados.</li>
              <li><strong>ITBI e registro:</strong> custos ligados à transferência e formalização da propriedade, conforme o caso.</li>
              <li><strong>Avaliação e tarifas permitidas:</strong> podem existir conforme a operação e a instituição.</li>
              <li><strong>Seguros habitacionais:</strong> podem fazer parte do contrato e influenciar o valor mensal.</li>
              <li><strong>Condomínio e IPTU:</strong> não entram na prestação do banco, mas entram no seu orçamento.</li>
              <li><strong>Manutenção e mudança:</strong> reserve caixa para despesas que aparecem depois da assinatura.</li>
            </ul>
          </section>

          <section id="etapas" className={styles.section}>
            <span className={styles.sectionNumber}>07</span>
            <h2>Da simulação à assinatura</h2>
            <div className={styles.reasonList}>
              <article><span>01</span><div><h3>Simulação</h3><p>Teste valor do imóvel, entrada, prazo e taxa para descobrir uma faixa de prestação compatível com seu orçamento.</p></div></article>
              <article><span>02</span><div><h3>Análise de crédito</h3><p>O banco avalia renda, compromissos existentes, cadastro e critérios internos para definir se e quanto pode financiar.</p></div></article>
              <article><span>03</span><div><h3>Análise do imóvel</h3><p>A instituição avalia o imóvel e sua documentação para verificar se ele pode fazer parte da operação e servir de garantia.</p></div></article>
              <article><span>04</span><div><h3>Condições finais</h3><p>Confira taxa efetiva, CET, sistema de amortização, prazo, seguros, tarifas, indexadores e valor das prestações.</p></div></article>
              <article><span>05</span><div><h3>Contrato e registro</h3><p>Depois da assinatura, a operação precisa cumprir as formalidades e registros exigidos para produzir seus efeitos.</p></div></article>
            </div>
          </section>

          <section id="comparar" className={styles.section}>
            <span className={styles.sectionNumber}>08</span>
            <h2>Como comparar duas propostas de financiamento</h2>
            <p>Não compare apenas “qual banco deu a menor parcela”. Coloque as propostas lado a lado e verifique os mesmos elementos.</p>

            <div className={styles.tableWrap}>
              <table>
                <thead><tr><th>Compare</th><th>Por quê</th></tr></thead>
                <tbody>
                  <tr><td><strong>CET</strong></td><td>Resume o custo efetivo da operação em uma taxa comparável</td></tr>
                  <tr><td><strong>Taxa nominal e efetiva</strong></td><td>Mostra como os juros estão sendo apresentados</td></tr>
                  <tr><td><strong>Prazo</strong></td><td>Prazo maior pode reduzir parcela e elevar o custo acumulado</td></tr>
                  <tr><td><strong>Sistema de amortização</strong></td><td>Muda a trajetória da prestação e do saldo devedor</td></tr>
                  <tr><td><strong>Seguros e tarifas</strong></td><td>Afetam o custo e o desembolso mensal</td></tr>
                  <tr><td><strong>Indexador/base de remuneração</strong></td><td>Pode alterar a evolução futura do contrato quando previsto</td></tr>
                  <tr><td><strong>Condições de amortização</strong></td><td>Importam se você pretende usar FGTS ou recursos extras para reduzir a dívida</td></tr>
                </tbody>
              </table>
            </div>

            <div className={styles.callout}>
              <strong>Financiamento não termina no banco que você escolheu hoje.</strong>
              <p>A portabilidade permite transferir a dívida para outra instituição se surgir uma proposta mais vantajosa e a nova instituição aprovar a operação.</p>
            </div>
          </section>

          <section className={styles.section}>
            <span className={styles.sectionNumber}>09</span>
            <h2>Erros comuns antes de financiar</h2>
            <ul className={styles.bullets}>
              <li>Escolher o imóvel antes de descobrir uma faixa de compra realmente sustentável.</li>
              <li>Usar toda a reserva financeira na entrada e ficar sem caixa para custos e imprevistos.</li>
              <li>Comparar somente a primeira prestação.</li>
              <li>Olhar apenas a taxa de juros e ignorar o CET.</li>
              <li>Assumir o máximo que o banco aprova sem testar o orçamento com uma margem de segurança.</li>
              <li>Esquecer condomínio, IPTU, seguros e manutenção ao calcular o custo mensal de morar.</li>
              <li>Não ler as regras de amortização, atualização, atraso e portabilidade do contrato.</li>
            </ul>
          </section>

          <section id="faq" className={styles.section}>
            <span className={styles.sectionNumber}>10</span>
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

          <section className={styles.nextStep}>
            <div>
              <span>Próximo passo</span>
              <h2>Transforme o guia em números.</h2>
              <p>Informe valor do imóvel, entrada, prazo e taxa. A calculadora mostra parcelas, juros, total pago e a evolução mensal do saldo devedor nos sistemas SAC e Price.</p>
            </div>
            <a className="button" href="/calculadoras/financiamento">Abrir calculadora →</a>
          </section>

          <section className={styles.sources}>
            <h2>Fontes oficiais</h2>
            <p>O guia usa referências do Banco Central e da CAIXA para explicar análise de renda, custos do crédito, contrato, prazo e portabilidade.</p>
            <div>
              <a href="https://www.bcb.gov.br/meubc/faqs/s/credito-imobiliario" target="_blank" rel="noopener noreferrer">Banco Central — crédito imobiliário ↗</a>
              <a href="https://www.bcb.gov.br/meubc/faqs/p/cuidados-na-hora-de-contratar-uma-operacao-de-credito" target="_blank" rel="noopener noreferrer">Banco Central — Custo Efetivo Total ↗</a>
              <a href="https://www.bcb.gov.br/meubc/faqs/s/portabilidade-de-credito" target="_blank" rel="noopener noreferrer">Banco Central — portabilidade de crédito ↗</a>
              <a href="https://www.caixa.gov.br/voce/habitacao/financiamento-de-imoveis/Paginas/default.aspx" target="_blank" rel="noopener noreferrer">CAIXA — financiamento de imóveis ↗</a>
            </div>
          </section>
        </article>
      </div>

      <section className={styles.disclaimer}>
        <div className="container">Conteúdo informativo. Não constitui proposta de crédito nem substitui análise bancária, jurídica, registral ou financeira individual. Condições variam conforme instituição, perfil, imóvel e linha contratada.</div>
      </section>

      <footer className="footer">
        <div className="container footer-inner">
          <a className="footer-brand" href="/"><span className="brand-dot" /> DESCOMPLICASA</a>
          <p>© 2026 Descomplicasa.</p>
        </div>
      </footer>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
    </main>
  );
}
