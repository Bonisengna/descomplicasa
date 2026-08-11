"use client";

import { useMemo, useState } from "react";
import styles from "./amortizacao.module.css";

type SystemType = "sac" | "price";
type Strategy = "term" | "payment";

type ScheduleRow = {
  month: number;
  openingBalance: number;
  interest: number;
  amortization: number;
  payment: number;
  closingBalance: number;
};

const money = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  maximumFractionDigits: 0,
});

const rowsPerPage = 12;

function monthlyRateFromAnnual(annualPercent: number) {
  const annual = Math.max(annualPercent, 0) / 100;
  return annual === 0 ? 0 : Math.pow(1 + annual, 1 / 12) - 1;
}

function pricePayment(balance: number, months: number, rate: number) {
  if (balance <= 0 || months <= 0) return 0;
  if (rate === 0) return balance / months;
  return (balance * rate) / (1 - Math.pow(1 + rate, -months));
}

function buildStandardSchedule(balance: number, months: number, rate: number, system: SystemType) {
  const schedule: ScheduleRow[] = [];
  if (balance <= 0 || months <= 0) return schedule;

  let current = balance;

  if (system === "price") {
    const fixedPayment = pricePayment(balance, months, rate);
    for (let month = 1; month <= months && current > 0.005; month += 1) {
      const openingBalance = current;
      const interest = openingBalance * rate;
      const amortization = month === months
        ? openingBalance
        : Math.min(Math.max(fixedPayment - interest, 0), openingBalance);
      const payment = interest + amortization;
      current = Math.max(openingBalance - amortization, 0);
      schedule.push({ month, openingBalance, interest, amortization, payment, closingBalance: current });
    }
    return schedule;
  }

  const constantAmortization = balance / months;
  for (let month = 1; month <= months && current > 0.005; month += 1) {
    const openingBalance = current;
    const interest = openingBalance * rate;
    const amortization = month === months ? openingBalance : Math.min(constantAmortization, openingBalance);
    const payment = interest + amortization;
    current = Math.max(openingBalance - amortization, 0);
    schedule.push({ month, openingBalance, interest, amortization, payment, closingBalance: current });
  }
  return schedule;
}

function buildReducedTermSchedule(
  originalBalance: number,
  newBalance: number,
  months: number,
  rate: number,
  system: SystemType,
) {
  const schedule: ScheduleRow[] = [];
  if (newBalance <= 0) return schedule;

  let current = newBalance;

  if (system === "price") {
    const originalPayment = pricePayment(originalBalance, months, rate);
    for (let month = 1; month <= months && current > 0.005; month += 1) {
      const openingBalance = current;
      const interest = openingBalance * rate;
      const amortization = Math.min(Math.max(originalPayment - interest, 0), openingBalance);
      const payment = interest + amortization;
      current = Math.max(openingBalance - amortization, 0);
      schedule.push({ month, openingBalance, interest, amortization, payment, closingBalance: current });
      if (amortization <= 0) break;
    }
    return schedule;
  }

  const originalAmortization = originalBalance / months;
  for (let month = 1; month <= months && current > 0.005; month += 1) {
    const openingBalance = current;
    const interest = openingBalance * rate;
    const amortization = Math.min(originalAmortization, openingBalance);
    const payment = interest + amortization;
    current = Math.max(openingBalance - amortization, 0);
    schedule.push({ month, openingBalance, interest, amortization, payment, closingBalance: current });
  }

  return schedule;
}

function totalInterest(schedule: ScheduleRow[]) {
  return schedule.reduce((sum, row) => sum + row.interest, 0);
}

function totalPayments(schedule: ScheduleRow[]) {
  return schedule.reduce((sum, row) => sum + row.payment, 0);
}

function formatDuration(months: number) {
  if (months <= 0) return "Sem redução de prazo";
  const years = Math.floor(months / 12);
  const remaining = months % 12;
  if (years === 0) return `${remaining} ${remaining === 1 ? "mês" : "meses"}`;
  if (remaining === 0) return `${years} ${years === 1 ? "ano" : "anos"}`;
  return `${years} ${years === 1 ? "ano" : "anos"} e ${remaining} ${remaining === 1 ? "mês" : "meses"}`;
}

export function AmortizationSimulator() {
  const [balance, setBalance] = useState(250000);
  const [remainingMonths, setRemainingMonths] = useState(300);
  const [annualRate, setAnnualRate] = useState(10);
  const [system, setSystem] = useState<SystemType>("sac");
  const [strategy, setStrategy] = useState<Strategy>("term");
  const [extraPayment, setExtraPayment] = useState(30000);
  const [tablePage, setTablePage] = useState(0);

  const result = useMemo(() => {
    const safeBalance = Math.max(balance, 0);
    const safeMonths = Math.max(Math.round(remainingMonths), 1);
    const rate = monthlyRateFromAnnual(annualRate);
    const extra = Math.min(Math.max(extraPayment, 0), safeBalance);
    const newBalance = Math.max(safeBalance - extra, 0);

    const baseline = buildStandardSchedule(safeBalance, safeMonths, rate, system);
    const after = strategy === "term"
      ? buildReducedTermSchedule(safeBalance, newBalance, safeMonths, rate, system)
      : buildStandardSchedule(newBalance, safeMonths, rate, system);

    const baselineInterest = totalInterest(baseline);
    const afterInterest = totalInterest(after);
    const savedInterest = Math.max(baselineInterest - afterInterest, 0);
    const monthsSaved = Math.max(baseline.length - after.length, 0);
    const baselineFirstPayment = baseline[0]?.payment ?? 0;
    const afterFirstPayment = after[0]?.payment ?? 0;

    return {
      safeBalance,
      safeMonths,
      rate,
      extra,
      newBalance,
      baseline,
      after,
      baselineInterest,
      afterInterest,
      savedInterest,
      monthsSaved,
      baselineFirstPayment,
      afterFirstPayment,
      paymentReduction: Math.max(baselineFirstPayment - afterFirstPayment, 0),
      baselineTotal: totalPayments(baseline),
      afterTotalWithExtra: totalPayments(after) + extra,
    };
  }, [balance, remainingMonths, annualRate, system, strategy, extraPayment]);

  const sliderMax = Math.max(Math.round(result.safeBalance / 1000) * 1000, 1000);
  const pageCount = Math.max(Math.ceil(result.baseline.length / rowsPerPage), 1);
  const safePage = Math.min(tablePage, pageCount - 1);
  const start = safePage * rowsPerPage;
  const baselineRows = result.baseline.slice(start, start + rowsPerPage);

  return (
    <section className={styles.simulatorSection}>
      <div className={`container ${styles.simulatorGrid}`}>
        <div className={styles.controlsCard}>
          <div className={styles.cardHeading}>
            <span>Seu financiamento hoje</span>
            <h2>Monte o cenário atual.</h2>
          </div>

          <div className={styles.fieldGrid}>
            <label className={styles.field}>
              <span>Saldo devedor atual</span>
              <div className={styles.inputShell}><span>R$</span><input type="number" min="0" step="1000" value={balance} onChange={(e) => setBalance(Number(e.target.value))} /></div>
            </label>
            <label className={styles.field}>
              <span>Prazo restante</span>
              <div className={styles.inputShell}><input type="number" min="1" max="420" step="1" value={remainingMonths} onChange={(e) => setRemainingMonths(Math.max(Number(e.target.value), 1))} /><span>meses</span></div>
            </label>
            <label className={styles.field}>
              <span>Taxa anual</span>
              <div className={styles.inputShell}><input type="number" min="0" max="30" step="0.01" value={annualRate} onChange={(e) => setAnnualRate(Math.max(Number(e.target.value), 0))} /><span>% a.a.</span></div>
            </label>
          </div>

          <fieldset className={styles.optionFieldset}>
            <legend>Sistema de amortização</legend>
            <div className={styles.optionGrid}>
              <label className={system === "sac" ? styles.activeOption : ""}><input type="radio" name="system" checked={system === "sac"} onChange={() => setSystem("sac")} /><span><strong>SAC</strong><small>Parcelas decrescentes</small></span></label>
              <label className={system === "price" ? styles.activeOption : ""}><input type="radio" name="system" checked={system === "price"} onChange={() => setSystem("price")} /><span><strong>Price</strong><small>Parcela calculada constante</small></span></label>
            </div>
          </fieldset>

          <div className={styles.aportBlock}>
            <div className={styles.aportHeading}>
              <div><span>Aporte extraordinário</span><strong>{money.format(result.extra)}</strong></div>
              <label><span>Digitar valor</span><input type="number" min="0" max={result.safeBalance} step="1000" value={extraPayment} onChange={(e) => setExtraPayment(Math.min(Math.max(Number(e.target.value), 0), result.safeBalance))} /></label>
            </div>
            <input
              className={styles.range}
              type="range"
              min="0"
              max={sliderMax}
              step="1000"
              value={Math.min(result.extra, sliderMax)}
              onChange={(e) => setExtraPayment(Number(e.target.value))}
              aria-label="Valor do aporte extraordinário"
            />
            <div className={styles.rangeLabels}><span>R$ 0</span><span>{money.format(sliderMax)}</span></div>
          </div>

          <fieldset className={styles.optionFieldset}>
            <legend>O que você quer reduzir?</legend>
            <div className={styles.optionGrid}>
              <label className={strategy === "term" ? styles.activeOption : ""}><input type="radio" name="strategy" checked={strategy === "term"} onChange={() => { setStrategy("term"); setTablePage(0); }} /><span><strong>Reduzir prazo</strong><small>Terminar antes</small></span></label>
              <label className={strategy === "payment" ? styles.activeOption : ""}><input type="radio" name="strategy" checked={strategy === "payment"} onChange={() => { setStrategy("payment"); setTablePage(0); }} /><span><strong>Reduzir parcela</strong><small>Manter o prazo</small></span></label>
            </div>
          </fieldset>
        </div>

        <aside className={styles.resultsCard} aria-live="polite">
          <div className={styles.resultHeadline}>
            <span>Impacto estimado do aporte</span>
            <strong>{strategy === "term" ? formatDuration(result.monthsSaved) : money.format(result.paymentReduction)}</strong>
            <p>{strategy === "term" ? "de financiamento a menos" : "de redução estimada na primeira parcela"}</p>
          </div>

          <div className={styles.metricsGrid}>
            <div><span>Novo saldo</span><strong>{money.format(result.newBalance)}</strong></div>
            <div><span>Juros economizados</span><strong>{money.format(result.savedInterest)}</strong></div>
            <div><span>Novo prazo</span><strong>{result.after.length} meses</strong></div>
            <div><span>Nova 1ª parcela</span><strong>{money.format(result.afterFirstPayment)}</strong></div>
          </div>

          <div className={styles.timelineCompare}>
            <div><div><span>Sem aporte</span><strong>{result.baseline.length} meses</strong></div><div className={styles.timelineTrack}><span style={{ width: "100%" }} /></div></div>
            <div><div><span>Com aporte</span><strong>{result.after.length} meses</strong></div><div className={styles.timelineTrack}><span className={styles.afterBar} style={{ width: `${result.baseline.length ? Math.max((result.after.length / result.baseline.length) * 100, 2) : 0}%` }} /></div></div>
          </div>

          <dl className={styles.resultList}>
            <div><dt>Juros futuros sem aporte</dt><dd>{money.format(result.baselineInterest)}</dd></div>
            <div><dt>Juros futuros após aporte</dt><dd>{money.format(result.afterInterest)}</dd></div>
            <div><dt>Primeira parcela sem aporte</dt><dd>{money.format(result.baselineFirstPayment)}</dd></div>
            <div><dt>Aporte aplicado hoje</dt><dd>{money.format(result.extra)}</dd></div>
          </dl>
        </aside>
      </div>

      <div className={`container ${styles.tableSection}`}>
        <div className={styles.tableHeading}>
          <div><span>Comparação mês a mês</span><h2>Veja o saldo antes e depois do aporte.</h2></div>
          <strong>{system.toUpperCase()} · {strategy === "term" ? "redução de prazo" : "redução de parcela"}</strong>
        </div>

        <div className={styles.tableCard}>
          <div className={styles.tableScroll}>
            <table>
              <thead><tr><th>Mês</th><th>Saldo sem aporte</th><th>Saldo com aporte</th><th>Parcela sem aporte</th><th>Parcela com aporte</th><th>Juros com aporte</th></tr></thead>
              <tbody>
                {baselineRows.map((row, index) => {
                  const afterRow = result.after[start + index];
                  return (
                    <tr key={row.month}>
                      <td><strong>{row.month}</strong></td>
                      <td>{money.format(row.closingBalance)}</td>
                      <td>{money.format(afterRow?.closingBalance ?? 0)}</td>
                      <td>{money.format(row.payment)}</td>
                      <td>{money.format(afterRow?.payment ?? 0)}</td>
                      <td>{money.format(afterRow?.interest ?? 0)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className={styles.pagination}>
            <button type="button" disabled={safePage === 0} onClick={() => setTablePage((page) => Math.max(page - 1, 0))}>12 meses anteriores</button>
            <span>Página {safePage + 1} de {pageCount}</span>
            <button type="button" disabled={safePage >= pageCount - 1} onClick={() => setTablePage((page) => Math.min(page + 1, pageCount - 1))}>Próximos 12 meses</button>
          </div>
        </div>
      </div>
    </section>
  );
}
