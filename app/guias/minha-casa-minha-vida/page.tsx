import type { Metadata } from "next";
import { Header } from "@/components/Header";
import styles from "./mcmv.module.css";

export const metadata: Metadata = {
  title: "Minha Casa Minha Vida 2026 | Descomplicasa",
  description: "Entenda as faixas de renda, subsídios, juros, limites de imóvel e como usar o FGTS no Minha Casa Minha Vida em 2026.",
};

const faq = [
  {
    question: "Eu me enquadro no Minha Casa Minha Vida?",
    answer:
      "Se a renda familiar bruta mensal é de até R$ 13.000, você pode estar dentro de uma das faixas do programa. O financiamento também depende das regras da modalidade, da situação de outros imóveis ou financiamentos e da análise de crédito do banco.",
  },
  {
    question: "Sou autônomo. Ainda posso participar?",
    answer:
      "Sim. Autônomos e trabalhadores sem holerite podem apresentar proposta, mas a forma de comprovar renda varia conforme o banco. Extratos, declaração de Imposto de Renda e outros documentos podem ser solicitados.",
  },
  {
    question: "Já financiei um imóvel antes. Perco o direito?",
    answer:
      "Ter financiado no passado não elimina o direito para sempre. Na linha financiada atual, porém, não é possível ter outro imóvel ou financiamento habitacional ativo nas condições vedadas pelo programa. O banco verifica isso na análise.",
  },
  {
    question: "Tenho restrição no nome. Consigo financiar?",
    answer:
      "A aprovação depende da análise de crédito. Na CAIXA, por exemplo, é requisito não haver restrições cadastrais vinculadas ao CPF dos compradores e vendedores. Regularizar pendências antes da proposta evita bloqueios na análise.",
  },
  {
    question: "Dá para comprar sem entrada?",
    answer:
      "Pode acontecer, mas não é garantido. Para famílias com renda de até R$ 5.000, o subsídio pode reduzir ou até extinguir a necessidade de entrada em algumas operações. FGTS e aportes do MCMV Cidades também podem ajudar. A avaliação do imóvel e a regra do banco continuam valendo.",
  },
  {
    question: "Quanto de FGTS posso usar?",
    answer:
      "O valor depende do saldo disponível e do enquadramento da operação. Para usar o FGTS na moradia própria, em regra é preciso somar pelo menos 3 anos de trabalho sob o regime do FGTS, consecutivos ou não.",
  },
  {
    question: "Quais documentos o banco vai pedir?",
    answer:
      "Normalmente entram documentos pessoais, comprovante de residência, documentos de renda, estado civil e informações do FGTS quando ele será usado. O banco pode pedir itens extras conforme o perfil e a operação.",
  },
  {
    question: "Quanto tempo demora a aprovação?",
    answer:
      "Não existe um prazo único do programa para todos os bancos. O tempo depende da análise de crédito, da documentação dos compradores, da avaliação do imóvel e da documentação do vendedor e do próprio imóvel.",
  },
  {
    question: "Posso escolher qualquer imóvel?",
    answer:
      "Na linha financiada, podem ser adquiridos imóveis novos ou usados, desde que respeitem as regras e os limites de valor da faixa. A Faixa 1 subsidiada funciona de outra forma, com seleção local e unidades vinculadas aos projetos contratados.",
  },
  {
    question: "Posso alugar o imóvel logo depois de comprar?",
    answer:
      "O programa é voltado à moradia própria. Na linha subsidiada e em contratos com benefício público podem existir regras específicas de ocupação, uso e transferência. Confira o contrato antes de alugar ou ceder o imóvel.",
  },
];

export default function McmvGuidePage() {
  return (
    <main id="top">
      <Header />

      <section className={styles.hero}>
        <div className="container">
          <nav className={styles.breadcrumb} aria-label="Navegação estrutural">
            <a href="/">Início</a><span>/</span><a href="/#guias">Guias</a><span>/</span><strong>Minha Casa Minha Vida</strong>
          </nav>
          <div className={styles.heroGrid}>
            <div>
              <span className={styles.kicker}>Guia atualizado para 2026</span>
              <h1>Minha Casa Minha Vida</h1>
              <p>Juros menores, subsídios para algumas rendas e uso do FGTS. Veja como o programa funciona e quais limites valem hoje.</p>
              <div className={styles.heroActions}>
                <a className="button" href="/calculadoras/financiamento">Simular financiamento →</a>
                <a className={styles.secondaryLink} href="/checklists/documentos-mcmv">Ver documentos</a>
              </div>
            </div>
            <aside className={styles.updateCard}>
              <span>Revisado em</span>
              <strong>10 de agosto de 2026</strong>
              <p>Faixas, taxas, subsídios e limites podem mudar. Confirme as condições no banco antes de contratar.</p>
            </aside>
          </div>
        </div>
      </section>

      <div className={`container ${styles.layout}`}>
        <aside className={styles.toc} aria-label="Nesta página">
          <strong>Nesta página</strong>
          <a href="#o-que-e">O que é</a>
          <a href="#faixas">Faixas de renda</a>
          <a href="#subsidio">Subsídio</a>
          <a href="#fgts">FGTS</a>
          <a href="#comparacao">MCMV x tradicional</a>
          <a href="#quem-pode">Quem pode participar</a>
          <a href="#faq">Perguntas frequentes</a>
        </aside>

        <article className={styles.article}>
          <section id="o-que-e" className={styles.section}>
            <span className={styles.sectionNumber}>01</span>
            <h2>O que é</h2>
            <p>O Minha Casa Minha Vida é o programa federal de habitação que reúne uma linha subsidiada para famílias da Faixa 1 e linhas de financiamento com incentivos para famílias com renda de até R$ 13 mil por mês.</p>
            <p>Na linha financiada, o contrato é feito diretamente com uma instituição financeira. O benefício pode aparecer na forma de juros menores e, para rendas de até R$ 5 mil, subsídio para reduzir a entrada ou o valor financiado.</p>
          </section>

          <section id="faixas" className={styles.section}>
            <span className={styles.sectionNumber}>02</span>
            <h2>As 4 faixas de renda</h2>
            <div className={styles.tableWrap}>
              <table>
                <thead><tr><th>Faixa</th><th>Renda familiar bruta mensal</th><th>Juros nominais na linha financiada</th></tr></thead>
                <tbody>
                  <tr><td><strong>Faixa 1</strong></td><td>até R$ 3.200</td><td>de 4,00% a 5,25% a.a.</td></tr>
                  <tr><td><strong>Faixa 2</strong></td><td>R$ 3.200,01 a R$ 5.000</td><td>de 4,75% a 7,00% a.a.</td></tr>
                  <tr><td><strong>Faixa 3</strong></td><td>R$ 5.000,01 a R$ 9.600</td><td>7,66% ou 8,16% a.a.</td></tr>
                  <tr><td><strong>Classe Média</strong></td><td>R$ 9.600,01 a R$ 13.000</td><td>10,00% a.a.</td></tr>
                </tbody>
              </table>
            </div>
            <p className={styles.smallNote}>Nas Faixas 1 e 2, a taxa muda conforme renda, região e condição de cotista do FGTS. Valores de referência vigentes em 2026.</p>

            <div className={styles.limitGrid}>
              <div><span>Faixas 1 e 2</span><strong>R$ 210 mil a R$ 275 mil</strong><small>limite do imóvel varia por localização</small></div>
              <div><span>Faixa 3</span><strong>até R$ 400 mil</strong><small>em todo o país</small></div>
              <div><span>Classe Média</span><strong>até R$ 600 mil</strong><small>em todo o país</small></div>
            </div>
          </section>

          <section id="subsidio" className={styles.section}>
            <span className={styles.sectionNumber}>03</span>
            <h2>O que é o subsídio</h2>
            <p>É um benefício que reduz o valor que a família precisa pagar ou financiar. Na linha financiada, famílias com renda de até R$ 5 mil podem receber desconto calculado conforme renda e local de moradia.</p>
            <div className={styles.callout}>
              <strong>Quanto pode chegar?</strong>
              <p>Até R$ 65 mil na Região Norte e até R$ 55 mil nas demais regiões, conforme as regras atuais da linha financiada.</p>
            </div>
            <p>Isso não significa que toda família receberá o valor máximo. Quanto menor a renda, maior tende a ser o benefício, mas o cálculo depende da operação.</p>
            <p>Na Faixa 1 subsidiada existe outra lógica: famílias selecionadas recebem unidades produzidas com recursos públicos. Beneficiários do Bolsa Família ou do BPC podem ser isentos das prestações nas operações abrangidas pelas regras da modalidade, mantendo as demais obrigações do contrato.</p>
          </section>

          <section id="fgts" className={styles.section}>
            <span className={styles.sectionNumber}>04</span>
            <h2>Como usar o FGTS</h2>
            <p>O saldo do FGTS pode ajudar antes e depois da compra, desde que comprador, imóvel e financiamento se enquadrem nas regras.</p>
            <ul className={styles.bullets}>
              <li><strong>Entrada:</strong> usar o saldo para pagar parte do valor do imóvel.</li>
              <li><strong>Amortização:</strong> reduzir o saldo devedor e, conforme a operação, o prazo ou o encargo.</li>
              <li><strong>Liquidação:</strong> quitar o saldo devedor quando as condições forem atendidas.</li>
              <li><strong>Parcelas:</strong> pagar até 80% do valor de 12 prestações consecutivas.</li>
            </ul>
            <div className={styles.requirements}>
              <h3>Regra básica para o trabalhador</h3>
              <p>É preciso somar pelo menos 3 anos de trabalho sob o regime do FGTS, consecutivos ou não, na mesma empresa ou em empresas diferentes. Também existem regras sobre outros imóveis e financiamentos ativos.</p>
            </div>
          </section>

          <section id="comparacao" className={styles.section}>
            <span className={styles.sectionNumber}>05</span>
            <h2>MCMV x financiamento tradicional</h2>
            <div className={styles.tableWrap}>
              <table>
                <thead><tr><th></th><th>Minha Casa Minha Vida</th><th>Financiamento tradicional</th></tr></thead>
                <tbody>
                  <tr><td><strong>Juros</strong></td><td>4% a 10% a.a. nominal, conforme faixa</td><td>Definidos pelo banco e pelo produto</td></tr>
                  <tr><td><strong>Subsídio</strong></td><td>Pode existir para renda de até R$ 5 mil</td><td>Não há subsídio do MCMV</td></tr>
                  <tr><td><strong>FGTS</strong></td><td>Pode ser usado, se cumprir as regras</td><td>Também pode ser usado em operações elegíveis</td></tr>
                  <tr><td><strong>Limite do imóvel</strong></td><td>Varia de R$ 210 mil a R$ 600 mil conforme faixa</td><td>Depende das regras do produto e do banco</td></tr>
                </tbody>
              </table>
            </div>
          </section>

          <section id="quem-pode" className={styles.section}>
            <span className={styles.sectionNumber}>06</span>
            <h2>Quem pode participar</h2>
            <ul className={styles.bullets}>
              <li>Famílias com renda bruta mensal de até R$ 13 mil nas áreas urbanas.</li>
              <li>Pessoas que atendam às regras sobre propriedade de outros imóveis e financiamentos habitacionais ativos.</li>
              <li>Compradores aprovados na análise de crédito da instituição financeira, no caso da linha financiada.</li>
              <li>Autônomos e trabalhadores sem holerite, desde que consigam comprovar renda conforme os critérios do banco.</li>
              <li>Uma pessoa pode apresentar proposta sozinha; não é obrigatório ser casado ou ter filhos.</li>
            </ul>
          </section>

          <section id="faq" className={styles.section}>
            <span className={styles.sectionNumber}>07</span>
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
              <h2>Coloque os números na mesa.</h2>
              <p>Use a calculadora do Descomplicasa para estimar parcelas e comparar SAC e Price. Depois confirme as condições no simulador do banco.</p>
            </div>
            <a className="button" href="/calculadoras/financiamento">Simular financiamento →</a>
          </section>

          <section className={styles.sources}>
            <h2>Fontes oficiais</h2>
            <p>Este guia foi revisado com base nas regras publicadas pelo Ministério das Cidades, CAIXA e FGTS.</p>
            <div>
              <a href="https://www.gov.br/cidades/pt-br/acesso-a-informacao/acoes-e-programas/habitacao/programa-minha-casa-minha-vida/mcmv-fgts" target="_blank" rel="noopener noreferrer">Linha financiada — Ministério das Cidades ↗</a>
              <a href="https://www.gov.br/cidades/pt-br/composicao/ouvidoria/perguntas-frequentes-2/perguntas-frequentes" target="_blank" rel="noopener noreferrer">FAQ oficial do MCMV ↗</a>
              <a href="https://www.caixa.gov.br/voce/habitacao/Paginas/utilizacao-fgts.aspx" target="_blank" rel="noopener noreferrer">Uso do FGTS na moradia — CAIXA ↗</a>
            </div>
          </section>
        </article>
      </div>

      <section className={styles.disclaimer}>
        <div className="container">Conteúdo informativo. Não substitui análise bancária, jurídica, registral ou contratual. Regras, taxas e limites podem ser alterados pelos órgãos responsáveis.</div>
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
