"use client";

import { useEffect, useMemo, useState } from "react";
import styles from "./financiamento.module.css";
import tableStyles from "./amortization-table.module.css";

type SystemType = "sac" | "price";

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
  maximumFractionDigits: 2,
});

const rowsPerPage = 12;

function clampNumber(value: number, min: number, max: number) {
  if (Number.isNaN(value)) return min;
  return Math.min(Math.max(value, min), max);
}

export function FinancingCalculator() {
  const [propertyValue, setPropertyValue] = useState(300000);
  const [downPayment, setDownPayment] = useState(60000);
  const [years, setYears] = useState(30);
  const [annualRate, setAnnualRate] = useState(10);
  const [system, setSystem] = useState<SystemType>("sac");
  const [schedulePage, setSchedulePage] = useState(0);

  const result = useMemo(() => {
    const value = Math.max(propertyValue, 0);
    const entry = clampNumber(downPayment, 0, value);
    const principal = Math.max(value - entry, 0);
    const months = Math.max(Math.round(years * 12), 1);
    const annual = Math.max(annualRate, 0) / 100;
    const monthlyRate = annual === 0 ? 0 : Math.pow(1 + annual, 1 / 12) - 1;

    const schedule: ScheduleRow[] = [];

    if (principal <= 0) {
      return {
        value,
        entry,
        principal,
        months,
        monthlyRate,
        firstPayment: 0,
        lastPayment: 0,
        totalInterest: 0,
        totalPaid: 0,
        entryPercent: value > 0 ? (entry / value) * 100 : 0,
        financedPercent: 0,
        schedule,
      };
    }

    if (system === "price") {
      const payment =
        monthlyRate === 0
          ? principal / months
          : (principal * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -months));

      let balance = principal;
      let totalInterest = 0;

      for (let month = 1; month <= months; month += 1) {
        const openingBalance = balance;
        const interest = openingBalance * monthlyRate;
        const amortization = month === months ? openingBalance : Math.min(payment - interest, openingBalance);
        const actualPayment = interest + amortization;
        balance = Math.max(openingBalance - amortization, 0);
        totalInterest += interest;

        schedule.push({
          month,
          openingBalance,
          interest,
          amortization,
          payment: actualPayment,
          closingBalance: balance,
        });
      }

      return {
        value,
        entry,
        principal,
        months,
        monthlyRate,
        firstPayment: schedule[0]?.payment ?? 0,
        lastPayment: schedule.at(-1)?.payment ?? 0,
        totalInterest,
        totalPaid: principal + totalInterest,
        entryPercent: value > 0 ? (entry / value) * 100 : 0,
        financedPercent: value > 0 ? (principal / value) * 100 : 0,
        schedule,
      };
    }

    const constantAmortization = principal / months;
    let balance = principal;
    let totalInterest = 0;

    for (let month = 1; month <= months; month += 1) {
      const openingBalance = balance;
      const interest = openingBalance * monthlyRate;
      const amortization = month === months ? openingBalance : Math.min(constantAmortization, openingBalance);
      const payment = amortization + interest;
      balance = Math.max(openingBalance - amortization, 0);
      totalInterest += interest;

      schedule.push({
        month,
        openingBalance,
        interest,
        amortization,
        payment,
        closingBalance: balance,
      });
    }

    return {
      value,
      entry,
      principal,
      months,
      monthlyRate,
      firstPayment: schedule[0]?.payment ?? 0,
      lastPayment: schedule.at(-1)?.payment ?? 0,
      totalInterest,
      totalPaid: principal + totalInterest,
      entryPercent: value > 0 ? (entry / value) * 100 : 0,
      financedPercent: value > 0 ? (principal / value) * 100 : 0,
      schedule,
    };
  }, [propertyValue, downPayment, years, annualRate, system]);

  useEffect(() => {
    setSchedulePage(0);
  }, [propertyValue, downPayment, years, annualRate, system]);

  const invalidEntry = downPayment > propertyValue || downPayment < 0;
  const pageCount = Math.max(Math.ceil(result.schedule.length / rowsPerPage), 1);
  const safePage = Math.min(schedulePage, pageCount - 1);
  const firstVisibleMonth = safePage * rowsPerPage + 1;
  const lastVisibleMonth = Math.min((safePage + 1) * rowsPerPage, result.schedule.length);
  const visibleRows = result.schedule.slice(safePage * rowsPerPage, (safePage + 1) * rowsPerPage);

  return (
    <section className={styles.calculatorSection}>
      <div className={`container ${styles.calculatorGrid}`}>
        <div className={styles.formCard}>
          <div className={styles.cardHeading}>
            <span>Dados da simulação</span>
            <strong>Preencha os valores</strong>
          </div>

          <div className={styles.fieldGrid}>
            <label className={styles.field}>
              <span>Valor do imóvel</span>
              <div className={styles.inputShell}>
                <span>R$</span>
                <input
                  type="number"
                  min="0"
                  step="1000"
                  value={propertyValue}
                  onChange={(event) => setPropertyValue(Number(event.target.value))}
                  inputMode="decimal"
                />
              </div>
            </label>

            <label className={styles.field}>
              <span>Entrada</span>
              <div className={`${styles.inputShell} ${invalidEntry ? styles.inputError : ""}`}>
                <span>R$</span>
                <input
                  type="number"
                  min="0"
                  step="1000"
                  value={downPayment}
                  onChange={(event) => setDownPayment(Number(event.target.value))}
                  inputMode="decimal"
                  aria-invalid={invalidEntry}
                />
              </div>
              {invalidEntry && <small>A entrada deve ficar entre R$ 0 e o valor do imóvel.</small>}
            </label>

            <label className={styles.field}>
              <span>Prazo</span>
              <div className={styles.inputShell}>
                <input
                  type="number"
                  min="1"
                  max="35"
                  step="1"
                  value={years}
                  onChange={(event) => setYears(clampNumber(Number(event.target.value), 1, 35))}
                  inputMode="numeric"
                />
                <span>anos</span>
              </div>
              <small>{result.months} meses</small>
            </label>

            <label className={styles.field}>
              <span>Taxa de juros anual</span>
              <div className={styles.inputShell}>
                <input
                  type="number"
                  min="0"
                  max="30"
                  step="0.01"
                  value={annualRate}
                  onChange={(event) => setAnnualRate(clampNumber(Number(event.target.value), 0, 30))}
                  inputMode="decimal"
                />
                <span>% a.a.</span>
              </div>
              <small>Informe a taxa apresentada na simulação do banco.</small>
            </label>
          </div>

          <fieldset className={styles.systemFieldset}>
            <legend>Sistema de amortização</legend>
            <div className={styles.systemOptions}>
              <label className={system === "sac" ? styles.activeSystem : ""}>
                <input
                  type="radio"
                  name="system"
                  value="sac"
                  checked={system === "sac"}
                  onChange={() => setSystem("sac")}
                />
                <span><strong>SAC</strong><small>Parcelas decrescentes</small></span>
              </label>
              <label className={system === "price" ? styles.activeSystem : ""}>
                <input
                  type="radio"
                  name="system"
                  value="price"
                  checked={system === "price"}
                  onChange={() => setSystem("price")}
                />
                <span><strong>Price</strong><small>Parcela calculada constante</small></span>
              </label>
            </div>
          </fieldset>

          <button
            className={styles.resetButton}
            type="button"
            onClick={() => {
              setPropertyValue(300000);
              setDownPayment(60000);
              setYears(30);
              setAnnualRate(10);
              setSystem("sac");
            }}
          >
            Restaurar exemplo
          </button>
        </div>

        <aside className={styles.resultCard} aria-live="polite">
          <div className={styles.resultTopline}>
            <span>Resultado estimado</span>
            <strong>{system.toUpperCase()}</strong>
          </div>

          <div className={styles.primaryResult}>
            <span>{system === "sac" ? "Primeira parcela estimada" : "Parcela estimada"}</span>
            <strong>{money.format(result.firstPayment)}</strong>
            {system === "sac" && <small>Última parcela estimada: {money.format(result.lastPayment)}</small>}
          </div>

          <dl className={styles.resultList}>
            <div><dt>Valor financiado</dt><dd>{money.format(result.principal)}</dd></div>
            <div><dt>Prazo</dt><dd>{result.months} meses</dd></div>
            <div><dt>Taxa mensal equivalente</dt><dd>{(result.monthlyRate * 100).toFixed(3).replace(".", ",")}%</dd></div>
            <div><dt>Juros estimados no período</dt><dd>{money.format(result.totalInterest)}</dd></div>
            <div><dt>Total pago ao financiamento</dt><dd>{money.format(result.totalPaid)}</dd></div>
          </dl>

          <div className={styles.composition}>
            <div className={styles.compositionHeading}>
              <span>Composição do imóvel</span>
              <strong>{result.entryPercent.toFixed(0)}% entrada</strong>
            </div>
            <div className={styles.progress} aria-hidden="true">
              <span style={{ width: `${Math.min(result.entryPercent, 100)}%` }} />
            </div>
            <div className={styles.compositionLegend}>
              <span>Entrada: {money.format(result.entry)}</span>
              <span>Financiado: {result.financedPercent.toFixed(0)}%</span>
            </div>
          </div>

          <p className={styles.resultNote}>
            A taxa anual é convertida para uma taxa mensal equivalente para esta estimativa. O resultado não considera CET, seguros, TR, tarifas e outros custos do contrato.
          </p>
        </aside>
      </div>

      <div className={`container ${tableStyles.scheduleSection}`}>
        <div className={tableStyles.heading}>
          <div>
            <span className={tableStyles.kicker}>Evolução do financiamento</span>
            <h2>Tabela mês a mês</h2>
            <p>
              Veja quanto de cada prestação corresponde a juros e amortização, e como o saldo devedor diminui ao longo do contrato.
            </p>
          </div>
          <div className={tableStyles.systemBadge}>{system.toUpperCase()}</div>
        </div>

        {result.schedule.length > 0 ? (
          <div className={tableStyles.tableCard}>
            <div className={tableStyles.tableMeta}>
              <div>
                <strong>Meses {firstVisibleMonth}–{lastVisibleMonth}</strong>
                <span>de {result.months} meses</span>
              </div>
              <span>Página {safePage + 1} de {pageCount}</span>
            </div>

            <div className={tableStyles.tableScroll}>
              <table className={tableStyles.table}>
                <caption className={tableStyles.srOnly}>
                  Evolução mensal do saldo devedor no sistema {system.toUpperCase()}
                </caption>
                <thead>
                  <tr>
                    <th>Mês</th>
                    <th>Saldo inicial</th>
                    <th>Juros</th>
                    <th>Amortização</th>
                    <th>Prestação</th>
                    <th>Saldo final</th>
                  </tr>
                </thead>
                <tbody>
                  {visibleRows.map((row) => (
                    <tr key={row.month}>
                      <td><strong>{row.month}</strong></td>
                      <td>{money.format(row.openingBalance)}</td>
                      <td>{money.format(row.interest)}</td>
                      <td>{money.format(row.amortization)}</td>
                      <td>{money.format(row.payment)}</td>
                      <td>{money.format(row.closingBalance)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className={tableStyles.pagination}>
              <button
                type="button"
                disabled={safePage === 0}
                onClick={() => setSchedulePage((page) => Math.max(page - 1, 0))}
              >
                ← 12 meses anteriores
              </button>
              <button
                type="button"
                disabled={safePage >= pageCount - 1}
                onClick={() => setSchedulePage((page) => Math.min(page + 1, pageCount - 1))}
              >
                Próximos 12 meses →
              </button>
            </div>
          </div>
        ) : (
          <div className={tableStyles.emptyState}>
            Informe um valor de imóvel maior que a entrada para visualizar a evolução mensal.
          </div>
        )}

        <p className={tableStyles.note}>
          A tabela usa somente o principal e a taxa informada. Em um contrato real, TR, seguros, tarifas, CET e outros encargos podem alterar parcelas e saldo devedor.
        </p>
      </div>
    </section>
  );
}
