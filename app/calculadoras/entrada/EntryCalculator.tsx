"use client";

import { useMemo, useState } from "react";
import styles from "./entrada.module.css";

const brl = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  maximumFractionDigits: 0,
});

function formatMoneyInput(value: number) {
  return brl.format(value);
}

function normalizeMoneyInput(value: string) {
  const digits = value.replace(/\D/g, "");
  if (!digits) return "";
  return brl.format(Number(digits));
}

function moneyValue(value: string) {
  const digits = value.replace(/\D/g, "");
  return digits ? Number(digits) : 0;
}

export function EntryCalculator() {
  const [propertyValue, setPropertyValue] = useState(formatMoneyInput(300000));
  const [ownResources, setOwnResources] = useState(formatMoneyInput(20000));
  const [fgts, setFgts] = useState(formatMoneyInput(15000));
  const [subsidy, setSubsidy] = useState(formatMoneyInput(30000));
  const [estimatedFinancing, setEstimatedFinancing] = useState("");

  const result = useMemo(() => {
    const property = moneyValue(propertyValue);
    const own = moneyValue(ownResources);
    const fgtsValue = moneyValue(fgts);
    const subsidyValue = moneyValue(subsidy);
    const financing = moneyValue(estimatedFinancing);

    const entryAvailable = own + fgtsValue + subsidyValue;
    const financingNeeded = Math.max(property - entryAvailable, 0);
    const totalAvailable = entryAvailable + financing;
    const missing = Math.max(property - totalAvailable, 0);
    const excess = Math.max(totalAvailable - property, 0);
    const coverage = property > 0 ? Math.min((totalAvailable / property) * 100, 100) : 0;
    const entryPercent = property > 0 ? (entryAvailable / property) * 100 : 0;

    return {
      property,
      own,
      fgtsValue,
      subsidyValue,
      financing,
      entryAvailable,
      financingNeeded,
      totalAvailable,
      missing,
      excess,
      coverage,
      entryPercent,
    };
  }, [propertyValue, ownResources, fgts, subsidy, estimatedFinancing]);

  const hasProperty = result.property > 0;
  const covered = hasProperty && result.missing === 0;
  const monthly12 = result.missing / 12;
  const monthly24 = result.missing / 24;
  const monthly36 = result.missing / 36;

  return (
    <section className={styles.calculatorSection} aria-labelledby="entry-calculator-title">
      <div className="container">
        <div className={styles.calculatorGrid}>
          <div className={styles.formCard}>
            <div className={styles.cardHeading}>
              <span>Seus números</span>
              <h2 id="entry-calculator-title">Monte os recursos da compra.</h2>
              <p>Use apenas valores que você realmente espera ter disponíveis. O resultado é uma estimativa de planejamento.</p>
            </div>

            <div className={styles.fields}>
              <label className={styles.field}>
                <span>Valor do imóvel</span>
                <input
                  inputMode="numeric"
                  value={propertyValue}
                  onChange={(event) => setPropertyValue(normalizeMoneyInput(event.target.value))}
                  aria-label="Valor do imóvel"
                />
                <small>Preço que você pretende pagar pelo imóvel.</small>
              </label>

              <label className={styles.field}>
                <span>Recursos próprios</span>
                <input
                  inputMode="numeric"
                  value={ownResources}
                  onChange={(event) => setOwnResources(normalizeMoneyInput(event.target.value))}
                  aria-label="Recursos próprios"
                />
                <small>Dinheiro que você pretende usar na entrada.</small>
              </label>

              <label className={styles.field}>
                <span>FGTS disponível</span>
                <input
                  inputMode="numeric"
                  value={fgts}
                  onChange={(event) => setFgts(normalizeMoneyInput(event.target.value))}
                  aria-label="FGTS disponível"
                />
                <small>Considere apenas o saldo que pode ser usado na operação.</small>
              </label>

              <label className={styles.field}>
                <span>Subsídio estimado</span>
                <input
                  inputMode="numeric"
                  value={subsidy}
                  onChange={(event) => setSubsidy(normalizeMoneyInput(event.target.value))}
                  aria-label="Subsídio estimado"
                />
                <small>Se não houver subsídio, informe zero.</small>
              </label>

              <div className={`${styles.financingPrompt} ${styles.fullField}`}>
                <div>
                  <span>Financiamento</span>
                  <strong>Já tem um valor aprovado?</strong>
                  <p>Informe abaixo o valor aprovado ou o valor estimado que pretende financiar.</p>
                </div>
                <a href="/calculadoras/financiamento">Ainda não sabe? Simule um cenário</a>
              </div>

              <label className={`${styles.field} ${styles.fullField}`}>
                <span>Financiamento aprovado ou estimado</span>
                <input
                  inputMode="numeric"
                  value={estimatedFinancing}
                  placeholder="Ex.: R$ 235.000"
                  onChange={(event) => setEstimatedFinancing(normalizeMoneyInput(event.target.value))}
                  aria-label="Financiamento aprovado ou estimado"
                />
                <small>Se você ainda não passou por análise bancária, trate este valor apenas como uma hipótese de planejamento.</small>
              </label>
            </div>

            <div className={styles.helperLinks}>
              <a href="/guias/fgts">Entender como usar o FGTS</a>
              <a href="/calculadoras/faixa-minha-casa-minha-vida">Ver minha faixa MCMV</a>
            </div>

            <article className={styles.tipsCard}>
              <span>Como juntar a entrada</span>
              <h3>Transforme o valor que falta em uma meta mensal.</h3>
              <p>Defina um prazo, automatize a separação do dinheiro e acompanhe a meta sem esquecer dos custos da compra e da sua reserva para imprevistos.</p>
              <a href="/guias/como-juntar-entrada-imovel">Ver dicas para juntar a entrada</a>
            </article>
          </div>

          <aside className={styles.resultCard} aria-live="polite">
            <div className={styles.resultTop}>
              <span className={styles.resultLabel}>Situação da compra</span>
              <strong className={covered ? styles.statusPositive : styles.statusAttention}>
                {!hasProperty
                  ? "Informe o valor do imóvel"
                  : covered
                    ? "Os recursos informados cobrem o imóvel"
                    : `Ainda faltam ${brl.format(result.missing)}`}
              </strong>
              <p>
                {covered
                  ? result.excess > 0
                    ? `A soma informada supera o valor do imóvel em ${brl.format(result.excess)}. Revise o financiamento estimado para trabalhar com uma projeção mais realista.`
                    : "Com os valores informados, a soma da entrada, FGTS, subsídio e financiamento alcança o preço do imóvel."
                  : "A diferença representa o valor que ainda precisa ser coberto por mais entrada, maior financiamento ou outra fonte elegível."}
              </p>
            </div>

            <div className={styles.coverageBlock}>
              <div className={styles.coverageHeader}>
                <span>Cobertura da compra</span>
                <strong>{hasProperty ? `${result.coverage.toFixed(0)}%` : "0%"}</strong>
              </div>
              <div className={styles.progressTrack} aria-hidden="true">
                <span style={{ width: `${result.coverage}%` }} />
              </div>
            </div>

            <dl className={styles.resultList}>
              <div>
                <dt>Valor do imóvel</dt>
                <dd>{brl.format(result.property)}</dd>
              </div>
              <div>
                <dt>Entrada disponível</dt>
                <dd>{brl.format(result.entryAvailable)}</dd>
              </div>
              <div>
                <dt>Entrada sobre o imóvel</dt>
                <dd>{hasProperty ? `${result.entryPercent.toFixed(1)}%` : "0%"}</dd>
              </div>
              <div>
                <dt>Financiamento necessário após a entrada</dt>
                <dd>{brl.format(result.financingNeeded)}</dd>
              </div>
              <div>
                <dt>Financiamento informado</dt>
                <dd>{brl.format(result.financing)}</dd>
              </div>
              <div className={styles.totalRow}>
                <dt>Total de recursos informados</dt>
                <dd>{brl.format(result.totalAvailable)}</dd>
              </div>
            </dl>

            {!covered && hasProperty && result.missing > 0 ? (
              <div className={styles.savingsPlan}>
                <span>Plano para fechar a diferença</span>
                <p>Quanto precisaria separar por mês, sem considerar rendimentos:</p>
                <div className={styles.savingsGrid}>
                  <div><small>12 meses</small><strong>{brl.format(monthly12)}/mês</strong></div>
                  <div><small>24 meses</small><strong>{brl.format(monthly24)}/mês</strong></div>
                  <div><small>36 meses</small><strong>{brl.format(monthly36)}/mês</strong></div>
                </div>
              </div>
            ) : null}

            <div className={styles.breakdown}>
              <span>Composição da entrada</span>
              <div><small>Recursos próprios</small><strong>{brl.format(result.own)}</strong></div>
              <div><small>FGTS</small><strong>{brl.format(result.fgtsValue)}</strong></div>
              <div><small>Subsídio</small><strong>{brl.format(result.subsidyValue)}</strong></div>
            </div>

            <a className="button" href="/calculadoras/financiamento">Simular financiamento</a>
          </aside>
        </div>
      </div>
    </section>
  );
}
