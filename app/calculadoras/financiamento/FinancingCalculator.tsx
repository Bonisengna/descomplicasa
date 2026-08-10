"use client";

import { useMemo, useState } from "react";
import styles from "./financiamento.module.css";

type SystemType = "sac" | "price";

const money = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  maximumFractionDigits: 2,
});

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

  const result = useMemo(() => {
    const value = Math.max(propertyValue, 0);
    const entry = clampNumber(downPayment, 0, value);
    const principal = Math.max(value - entry, 0);
    const months = Math.max(Math.round(years * 12), 1);
    const annual = Math.max(annualRate, 0) / 100;
    const monthlyRate = annual === 0 ? 0 : Math.pow(1 + annual, 1 / 12) - 1;

    if (principal <= 0) {
      return {
        principal,
        months,
        monthlyRate,
        firstPayment: 0,
        lastPayment: 0,
        totalInterest: 0,
        totalPaid: 0,
        entryPercent: value > 0 ? (entry / value) * 100 : 0,
        financedPercent: 0,
      };
    }

    if (system === "price") {
      const payment =
        monthlyRate === 0
          ? principal / months
          : (principal * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -months));
      const totalPaid = payment * months;

      return {
        principal,
        months,
        monthlyRate,
        firstPayment: payment,
        lastPayment: payment,
        totalInterest: totalPaid - principal,
        totalPaid,
        entryPercent: value > 0 ? (entry / value) * 100 : 0,
        financedPercent: value > 0 ? (principal / value) * 100 : 0,
      };
    }

    const amortization = principal / months;
    const firstPayment = amortization + principal * monthlyRate;
    const lastPayment = amortization + amortization * monthlyRate;
    const totalInterest = monthlyRate * principal * ((months + 1) / 2);

    return {
      principal,
      months,
      monthlyRate,
      firstPayment,
      lastPayment,
      totalInterest,
      totalPaid: principal + totalInterest,
      entryPercent: value > 0 ? (entry / value) * 100 : 0,
      financedPercent: value > 0 ? (principal / value) * 100 : 0,
    };
  }, [propertyValue, downPayment, years, annualRate, system]);

  const invalidEntry = downPayment > propertyValue;

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
              {invalidEntry && <small>A entrada não pode ser maior que o valor do imóvel.</small>}
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
              <span>Entrada: {money.format(Math.min(downPayment, propertyValue))}</span>
              <span>Financiado: {result.financedPercent.toFixed(0)}%</span>
            </div>
          </div>

          <p className={styles.resultNote}>
            A taxa anual é convertida para uma taxa mensal equivalente para esta estimativa. O resultado não considera CET, seguros, TR, tarifas e outros custos do contrato.
          </p>
        </aside>
      </div>
    </section>
  );
}
