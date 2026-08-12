"use client";

import { useMemo, useState } from "react";
import styles from "./itbi.module.css";

type City = "poa" | "sl" | "other";
const money = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 2 });

export function ItbiCalculator() {
  const [city, setCity] = useState<City>("poa");
  const [baseValue, setBaseValue] = useState(300000);
  const [financed, setFinanced] = useState(240000);
  const [fgts, setFgts] = useState(0);
  const [manualRate, setManualRate] = useState(2);

  const result = useMemo(() => {
    const base = Math.max(baseValue, 0);
    const finance = Math.min(Math.max(financed, 0), base);
    const fgtsValue = Math.min(Math.max(fgts, 0), Math.max(base - finance, 0));

    if (city === "poa") {
      const ufm2026 = 6.0411;
      const reducedCap = 68000 * ufm2026;
      const eligible = Math.min(finance + fgtsValue, reducedCap, base);
      const regular = Math.max(base - eligible, 0);
      return {
        tax: eligible * 0.005 + regular * 0.03,
        reducedBase: eligible,
        regularBase: regular,
        rule: "Porto Alegre: 0,5% sobre valores elegíveis financiados/FGTS, limitado a 68.000 UFM; 3% sobre o restante.",
        source: "Prefeitura de Porto Alegre",
      };
    }

    if (city === "sl") {
      const eligible = Math.min(finance + fgtsValue, base);
      const regular = Math.max(base - eligible, 0);
      return {
        tax: eligible * 0.005 + regular * 0.02,
        reducedBase: eligible,
        regularBase: regular,
        rule: "São Leopoldo: 0,5% sobre a parte financiada pelo SFH, FGTS e subsídio; 2% nos demais casos.",
        source: "Prefeitura de São Leopoldo",
      };
    }

    return {
      tax: base * Math.max(manualRate, 0) / 100,
      reducedBase: 0,
      regularBase: base,
      rule: "Outro município: cálculo pela alíquota informada por você. Consulte a prefeitura para confirmar base, benefícios e eventuais faixas.",
      source: "Alíquota manual",
    };
  }, [city, baseValue, financed, fgts, manualRate]);

  return (
    <section className={styles.section}>
      <div className={`container ${styles.grid}`}>
        <div className={styles.card}>
          <span className={styles.kicker}>Dados da compra</span>
          <h2>Monte sua estimativa</h2>

          <label className={styles.field}><span>Município</span><select value={city} onChange={(e) => setCity(e.target.value as City)}><option value="poa">Porto Alegre - RS</option><option value="sl">São Leopoldo - RS</option><option value="other">Outro município</option></select></label>
          <label className={styles.field}><span>Valor-base para estimativa</span><div className={styles.input}><span>R$</span><input type="number" min="0" step="1000" value={baseValue} onChange={(e) => setBaseValue(Number(e.target.value))} /></div><small>Use como referência o valor da operação. A prefeitura pode adotar base própria conforme a legislação aplicável.</small></label>

          {city !== "other" ? <>
            <label className={styles.field}><span>Valor financiado elegível</span><div className={styles.input}><span>R$</span><input type="number" min="0" step="1000" value={financed} onChange={(e) => setFinanced(Number(e.target.value))} /></div></label>
            <label className={styles.field}><span>FGTS usado na operação</span><div className={styles.input}><span>R$</span><input type="number" min="0" step="1000" value={fgts} onChange={(e) => setFgts(Number(e.target.value))} /></div></label>
          </> : <label className={styles.field}><span>Alíquota municipal</span><div className={styles.input}><input type="number" min="0" max="10" step="0.01" value={manualRate} onChange={(e) => setManualRate(Number(e.target.value))} /><span>%</span></div></label>}

          <div className={styles.rule}><strong>Regra usada</strong><p>{result.rule}</p></div>
          <a className={styles.guideLink} href="/guias/itbi">Entender o ITBI antes de pagar</a>
        </div>

        <aside className={styles.result} aria-live="polite">
          <span className={styles.kicker}>Estimativa</span>
          <strong className={styles.total}>{money.format(result.tax)}</strong>
          <p>ITBI estimado para o cenário informado</p>
          <dl>
            <div><dt>Base informada</dt><dd>{money.format(Math.max(baseValue, 0))}</dd></div>
            {city !== "other" && <><div><dt>Base em alíquota reduzida</dt><dd>{money.format(result.reducedBase)}</dd></div><div><dt>Base em alíquota normal</dt><dd>{money.format(result.regularBase)}</dd></div></>}
            <div><dt>Referência da regra</dt><dd>{result.source}</dd></div>
          </dl>
          <div className={styles.warning}><strong>Não pague com base apenas nesta estimativa.</strong><p>Emita ou confira a guia oficial do município antes de concluir a compra.</p></div>
        </aside>
      </div>
    </section>
  );
}
