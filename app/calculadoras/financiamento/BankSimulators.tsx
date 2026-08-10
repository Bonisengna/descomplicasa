import styles from "./bank-simulators.module.css";

const banks = [
  {
    name: "CAIXA",
    description: "Simulador habitacional oficial da CAIXA, incluindo opções de crédito imobiliário e Minha Casa, Minha Vida.",
    href: "https://simuladorhabitacao.des.caixa.gov.br/",
    label: "Abrir simulador CAIXA",
  },
  {
    name: "Banco do Brasil",
    description: "Página oficial do Crédito Imobiliário BB, com orientação para simulação e contratação pelos canais digitais do banco.",
    href: "https://www.bb.com.br/site/pra-voce/financiamentos/financiamento-imobiliario/",
    label: "Acessar Crédito Imobiliário BB",
  },
  {
    name: "Itaú",
    description: "Página oficial do Crédito Imobiliário Itaú, com acesso à simulação e envio de proposta pelos canais do banco.",
    href: "https://www.itau.com.br/emprestimos-financiamentos/credito-imobiliario",
    label: "Abrir simulador Itaú",
  },
  {
    name: "Santander",
    description: "Simulador oficial de financiamento imobiliário Santander para consultar condições de crédito.",
    href: "https://www.santander.com.br/atendimento-para-voce/simuladores/simulador-credito-imobiliario",
    label: "Abrir simulador Santander",
  },
  {
    name: "Bradesco",
    description: "Simulador oficial de crédito imobiliário Bradesco para imóveis residenciais e comparação de condições.",
    href: "https://banco.bradesco/html/classic/produtos-servicos/emprestimo-e-financiamento/encontre-seu-credito/simuladores-imoveis.shtm",
    label: "Abrir simulador Bradesco",
  },
];

export function BankSimulators() {
  return (
    <section className={styles.section}>
      <div className="container">
        <div className={styles.heading}>
          <div>
            <span className={styles.kicker}>Compare condições reais</span>
            <h2>Simule também nos bancos</h2>
            <p>
              Depois de entender os números no Descomplicasa, use os mesmos dados nos simuladores oficiais para comparar taxas, seguros, CET e condições disponíveis para o seu perfil.
            </p>
          </div>
        </div>

        <div className={styles.grid}>
          {banks.map((bank) => (
            <article className={styles.card} key={bank.name}>
              <div className={styles.bankMark} aria-hidden="true">{bank.name.charAt(0)}</div>
              <div className={styles.cardBody}>
                <h3>{bank.name}</h3>
                <p>{bank.description}</p>
                <a href={bank.href} target="_blank" rel="noopener noreferrer">
                  {bank.label} <span aria-hidden="true">↗</span>
                </a>
              </div>
            </article>
          ))}
        </div>

        <p className={styles.disclaimer}>
          Os links levam para páginas oficiais das instituições. O Descomplicasa é independente, não representa os bancos listados e não recebe dados preenchidos nos simuladores externos. As condições apresentadas por cada instituição podem mudar e dependem de análise de crédito.
        </p>
      </div>
    </section>
  );
}
