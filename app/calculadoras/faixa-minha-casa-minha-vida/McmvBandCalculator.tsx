"use client";

import { useMemo, useState } from "react";
import styles from "./faixa-mcmv.module.css";

type BandResult = {
  band: string;
  range: string;
  interest: string;
  interestDetail: string;
  subsidy: string;
  subsidyDetail: string;
  propertyLimit: string;
  propertyDetail: string;
  eligible: boolean;
  extra?: string;
};

const brl = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  maximumFractionDigits: 0,
});

function classify(income: number): BandResult | null {
  if (!Number.isFinite(income) || income <= 0) return null;

  if (income > 13000) {
    return {
      band: "Acima do limite do MCMV",
      range: "Renda familiar acima de R$ 13.000/mês",
      interest: "Não se aplica",
      interestDetail: "A linha financiada do MCMV atende renda familiar bruta mensal de até R$ 13 mil.",
      subsidy: "Não se aplica",
      subsidyDetail: "O subsídio da linha financiada não se aplica acima do limite de renda do programa.",
      propertyLimit: "Fora do teto do MCMV",
      propertyDetail: "Outras linhas de crédito imobiliário podem ter limites e taxas diferentes.",
      eligible: false,
    };
  }

  if (income <= 3200) {
    return {
      band: "Faixa 1",
      range: "Renda familiar de até R$ 3.200/mês",
      interest: "4,00% a 5,25% a.a.",
      interestDetail: "Faixa nominal de referência. A taxa varia conforme renda, região e condição de cotista do FGTS.",
      subsidy: "Pode ter subsídio",
      subsidyDetail: "Na linha financiada, famílias com renda de até R$ 5 mil podem receber desconto. O teto atual chega a R$ 65 mil no Norte e R$ 55 mil nas demais regiões, conforme a operação.",
      propertyLimit: "R$ 210 mil a R$ 275 mil",
      propertyDetail: "O limite exato do imóvel depende da localização do município.",
      eligible: true,
      extra: "A Faixa 1 também pode ser atendida por modalidades subsidiadas com seleção local, que funcionam de forma diferente da linha financiada.",
    };
  }

  if (income <= 5000) {
    return {
      band: "Faixa 2",
      range: "Renda familiar de R$ 3.200,01 a R$ 5.000/mês",
      interest: "4,75% a 7,00% a.a.",
      interestDetail: "Faixa nominal de referência. A taxa varia conforme renda, região e condição de cotista do FGTS.",
      subsidy: "Pode ter subsídio",
      subsidyDetail: "O desconto pode chegar a R$ 65 mil no Norte e R$ 55 mil nas demais regiões. O valor real depende da renda, localização e características da operação.",
      propertyLimit: "R$ 210 mil a R$ 275 mil",
      propertyDetail: "O limite exato do imóvel depende da localização do município.",
      eligible: true,
      extra: "Aportes do MCMV Cidades podem reduzir a necessidade de entrada em locais onde a iniciativa estiver disponível.",
    };
  }

  if (income <= 9600) {
    return {
      band: "Faixa 3",
      range: "Renda familiar de R$ 5.000,01 a R$ 9.600/mês",
      interest: "7,66% ou 8,16% a.a.",
      interestDetail: "Taxas nominais de referência conforme a condição de cotista do FGTS e as regras da operação.",
      subsidy: "Sem subsídio FGTS padrão",
      subsidyDetail: "O desconto da linha financiada é direcionado às rendas de até R$ 5 mil. Pode existir aporte local do MCMV Cidades onde houver participação do poder público.",
      propertyLimit: "Até R$ 400 mil",
      propertyDetail: "Limite nacional de referência para a Faixa 3.",
      eligible: true,
    };
  }

  return {
    band: "Classe Média",
    range: "Renda familiar de R$ 9.600,01 a R$ 13.000/mês",
    interest: "10,00% a.a.",
    interestDetail: "Taxa nominal de referência da modalidade Classe Média.",
    subsidy: "Sem subsídio FGTS",
    subsidyDetail: "A modalidade oferece condições próprias de financiamento, mas não o desconto destinado às rendas de até R$ 5 mil.",
    propertyLimit: "Até R$ 600 mil",
    propertyDetail: "Limite nacional de referência da modalidade Classe Média.",
    eligible: true,
  };
}

const examples = [2800, 4500, 7500, 11000];

export function McmvBandCalculator() {
  const [income, setIncome] = useState("4500");
  const numericIncome = Number(income.replace(",", "."));
  const result = useMemo(() => classify(numericIncome), [numericIncome]);
  const markerPosition = Math.min(Math.max((numericIncome / 13000) * 100, 0), 100);

  return (
    <section className={styles.calculatorSection}>
      <div className={`container ${styles.calculatorGrid}`}>
        <div className={styles.formCard}>
          <span className={styles.kicker}>Sua renda</span>
          <h2>Digite a renda familiar bruta mensal</h2>
          <p className={styles.formIntro}>Use o valor antes dos descontos. Se mais de uma pessoa compõe a renda da proposta, considere a soma.</p>

          <label className={styles.field}>
            <span>Renda familiar bruta mensal</span>
            <div className={styles.inputShell}>
              <span>R$</span>
              <input
                type="number"
                min="0"
                step="100"
                value={income}
                onChange={(event) => setIncome(event.target.value)}
                inputMode="decimal"
                aria-describedby="income-help"
              />
            </div>
            <small id="income-help">Exemplo: salários, pró-labore e outras rendas brutas consideradas na composição.</small>
          </label>

          <div className={styles.examples}>
            <span>Testar exemplo:</span>
            {examples.map((value) => (
              <button key={value} type="button" onClick={() => setIncome(String(value))}>
                {brl.format(value)}
              </button>
            ))}
          </div>

          <div className={styles.scale} aria-hidden="true">
            <div className={styles.scaleLabels}>
              <span>Faixa 1</span><span>Faixa 2</span><span>Faixa 3</span><span>Classe Média</span>
            </div>
            <div className={styles.scaleBar}>
              <span className={styles.marker} style={{ left: `${markerPosition}%` }} />
            </div>
            <div className={styles.scaleValues}><span>R$ 0</span><span>R$ 13 mil</span></div>
          </div>

          <p className={styles.privacyNote}>Sem cadastro. O cálculo acontece no navegador e a renda digitada não é enviada ao Descomplicasa.</p>
        </div>

        <aside className={styles.resultCard} aria-live="polite">
          {result ? (
            <>
              <div className={styles.resultTopline}>
                <span>Enquadramento pela renda</span>
                <strong>{result.eligible ? "MCMV 2026" : "Fora do MCMV"}</strong>
              </div>

              <div className={styles.bandResult}>
                <small>Resultado</small>
                <strong>{result.band}</strong>
                <span>{result.range}</span>
              </div>

              <div className={styles.resultGrid}>
                <article>
                  <span>Juros nominais</span>
                  <strong>{result.interest}</strong>
                  <p>{result.interestDetail}</p>
                </article>
                <article>
                  <span>Subsídio</span>
                  <strong>{result.subsidy}</strong>
                  <p>{result.subsidyDetail}</p>
                </article>
                <article>
                  <span>Limite do imóvel</span>
                  <strong>{result.propertyLimit}</strong>
                  <p>{result.propertyDetail}</p>
                </article>
              </div>

              {result.extra && <p className={styles.extraNote}>{result.extra}</p>}

              <div className={styles.nextActions}>
                {result.eligible ? (
                  <>
                    <a className="button" href="/calculadoras/financiamento">Simular financiamento →</a>
                    <a className={styles.textLink} href="/checklists/documentos-mcmv">Ver documentos MCMV</a>
                  </>
                ) : (
                  <a className="button" href="/calculadoras/financiamento">Simular financiamento tradicional →</a>
                )}
              </div>
            </>
          ) : (
            <div className={styles.emptyResult}>
              <span>Resultado</span>
              <strong>Informe uma renda maior que zero.</strong>
              <p>A ferramenta mostrará automaticamente a faixa correspondente.</p>
            </div>
          )}
        </aside>
      </div>
    </section>
  );
}
