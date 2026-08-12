"use client";

import { useMemo, useState } from "react";
import styles from "./itbi.module.css";

type City =
  | "poa"
  | "sl"
  | "sp"
  | "rio"
  | "bh"
  | "curitiba"
  | "salvador"
  | "recife"
  | "other";

type Result = {
  tax: number;
  reducedBase: number;
  regularBase: number;
  hasSplit: boolean;
  rule: string;
  source: string;
  sourceUrl?: string;
};

const money = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  maximumFractionDigits: 2,
});

const financingCities: City[] = ["poa", "sl", "sp"];
const fgtsCities: City[] = ["poa", "sl"];

export function ItbiCalculator() {
  const [city, setCity] = useState<City>("poa");
  const [baseValue, setBaseValue] = useState(300000);
  const [financed, setFinanced] = useState(240000);
  const [fgts, setFgts] = useState(0);
  const [manualRate, setManualRate] = useState(2);

  const result = useMemo<Result>(() => {
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
        hasSplit: true,
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
        hasSplit: true,
        rule: "São Leopoldo: 0,5% sobre a parte financiada pelo SFH, FGTS e subsídio; 2% nos demais casos.",
        source: "Prefeitura de São Leopoldo",
      };
    }

    if (city === "sp") {
      const propertyLimit2026 = 725808;
      const reducedFinanceLimit2026 = 120968;
      const eligible = base <= propertyLimit2026
        ? Math.min(finance, reducedFinanceLimit2026, base)
        : 0;
      const regular = Math.max(base - eligible, 0);
      return {
        tax: eligible * 0.005 + regular * 0.03,
        reducedBase: eligible,
        regularBase: regular,
        hasSplit: true,
        rule: base <= propertyLimit2026
          ? "São Paulo em 2026: para operação elegível no SFH/PAR/HIS ou consórcio, 0,5% sobre até R$ 120.968 do valor financiado/crédito e 3% sobre o restante. Informe abaixo somente o financiamento que realmente se enquadra nessa regra."
          : "São Paulo em 2026: imóveis acima de R$ 725.808 ficam, na regra geral dessa simulação, sujeitos a 3% sobre toda a base. Benefícios e isenções específicos devem ser conferidos na Prefeitura.",
        source: "Prefeitura de São Paulo",
        sourceUrl: "https://smartsampa.prefeitura.sp.gov.br/web/fazenda/w/servicos/itbi/2513",
      };
    }

    if (city === "rio") {
      return {
        tax: base * 0.03,
        reducedBase: 0,
        regularBase: base,
        hasSplit: false,
        rule: "Rio de Janeiro: alíquota geral de 3% para fatos geradores a partir de 2018. Isenções e situações especiais não são automatizadas nesta estimativa.",
        source: "Prefeitura do Rio de Janeiro",
        sourceUrl: "https://carioca.rio/servicos/itbi-duvidas-sobre-avaliacao-interpretacao-e-aplicacao-da-legislacao-tributaria/",
      };
    }

    if (city === "bh") {
      return {
        tax: base * 0.03,
        reducedBase: 0,
        regularBase: base,
        hasSplit: false,
        rule: "Belo Horizonte: alíquota geral de 3%. Hipóteses de isenção ou tratamento específico não são automatizadas nesta estimativa.",
        source: "Prefeitura de Belo Horizonte",
        sourceUrl: "https://prefeitura.pbh.gov.br/fazenda/tributos/ITBI",
      };
    }

    if (city === "curitiba") {
      return {
        tax: base * 0.027,
        reducedBase: 0,
        regularBase: base,
        hasSplit: false,
        rule: "Curitiba: alíquota geral de 2,7%. Existem alíquotas reduzidas para determinadas aquisições residenciais financiadas; esta versão usa a regra geral e recomenda confirmar eventual benefício na Prefeitura.",
        source: "Prefeitura de Curitiba",
        sourceUrl: "https://www.curitiba.pr.gov.br/servicos/itbi-base-de-calculo-e-aliquotas/512",
      };
    }

    if (city === "salvador") {
      return {
        tax: base * 0.03,
        reducedBase: 0,
        regularBase: base,
        hasSplit: false,
        rule: "Salvador: alíquota geral do ITIV de 3%. A legislação prevê tratamento de 1% para imóveis populares conforme regulamentação; esse benefício não é automatizado nesta versão.",
        source: "Prefeitura de Salvador",
        sourceUrl: "https://servicosweb.sefaz.salvador.ba.gov.br/sistema/chat/FAQ/base_calculo_avaliacao_aliquotas.asp",
      };
    }

    if (city === "recife") {
      return {
        tax: base * 0.03,
        reducedBase: 0,
        regularBase: base,
        hasSplit: false,
        rule: "Recife: alíquota geral de 3%. A legislação municipal prevê alíquotas reduzidas em situações específicas, inclusive determinados financiamentos pelo SFH; esta versão calcula a regra geral.",
        source: "Prefeitura do Recife",
        sourceUrl: "https://recifeemdia.recife.pe.gov.br/node/927",
      };
    }

    return {
      tax: base * Math.max(manualRate, 0) / 100,
      reducedBase: 0,
      regularBase: base,
      hasSplit: false,
      rule: "Outro município: cálculo pela alíquota informada por você. Consulte a prefeitura para confirmar base de cálculo, benefícios, faixas e regras aplicáveis.",
      source: "Alíquota manual",
    };
  }, [city, baseValue, financed, fgts, manualRate]);

  const showFinancing = financingCities.includes(city);
  const showFgts = fgtsCities.includes(city);

  return (
    <section className={styles.section}>
      <div className={`container ${styles.grid}`}>
        <div className={styles.card}>
          <span className={styles.kicker}>Dados da compra</span>
          <h2>Monte sua estimativa</h2>

          <label className={styles.field}>
            <span>Município</span>
            <select value={city} onChange={(e) => setCity(e.target.value as City)}>
              <optgroup label="Rio Grande do Sul">
                <option value="poa">Porto Alegre - RS</option>
                <option value="sl">São Leopoldo - RS</option>
              </optgroup>
              <optgroup label="Outros municípios disponíveis">
                <option value="sp">São Paulo - SP</option>
                <option value="rio">Rio de Janeiro - RJ</option>
                <option value="bh">Belo Horizonte - MG</option>
                <option value="curitiba">Curitiba - PR</option>
                <option value="salvador">Salvador - BA</option>
                <option value="recife">Recife - PE</option>
              </optgroup>
              <option value="other">Outro município / alíquota manual</option>
            </select>
          </label>

          <label className={styles.field}>
            <span>Valor-base para estimativa</span>
            <div className={styles.input}>
              <span>R$</span>
              <input type="number" min="0" step="1000" value={baseValue} onChange={(e) => setBaseValue(Number(e.target.value))} />
            </div>
            <small>Use como referência o valor da operação. A prefeitura pode determinar a base conforme a legislação aplicável.</small>
          </label>

          {showFinancing && (
            <label className={styles.field}>
              <span>Valor financiado elegível</span>
              <div className={styles.input}>
                <span>R$</span>
                <input type="number" min="0" step="1000" value={financed} onChange={(e) => setFinanced(Number(e.target.value))} />
              </div>
              <small>Informe apenas a parcela do financiamento que se enquadra na regra reduzida do município.</small>
            </label>
          )}

          {showFgts && (
            <label className={styles.field}>
              <span>FGTS usado na operação</span>
              <div className={styles.input}>
                <span>R$</span>
                <input type="number" min="0" step="1000" value={fgts} onChange={(e) => setFgts(Number(e.target.value))} />
              </div>
            </label>
          )}

          {city === "other" && (
            <label className={styles.field}>
              <span>Alíquota municipal</span>
              <div className={styles.input}>
                <input type="number" min="0" max="10" step="0.01" value={manualRate} onChange={(e) => setManualRate(Number(e.target.value))} />
                <span>%</span>
              </div>
            </label>
          )}

          <div className={styles.rule}>
            <strong>Regra usada</strong>
            <p>{result.rule}</p>
            {result.sourceUrl && (
              <a href={result.sourceUrl} target="_blank" rel="noopener noreferrer">Consultar fonte oficial</a>
            )}
          </div>

          <div className={styles.contribute}>
            <strong>Não encontrou sua cidade?</strong>
            <p>Quer contribuir com a alíquota da sua localidade? Envie a cidade, o estado, a alíquota e, se possível, o link da prefeitura.</p>
            <a href="mailto:suporte@descomplicaza.com.br?subject=Contribui%C3%A7%C3%A3o%20de%20al%C3%ADquota%20de%20ITBI">suporte@descomplicaza.com.br</a>
          </div>

          <a className={styles.guideLink} href="/guias/itbi">Entender o ITBI antes de pagar</a>
        </div>

        <aside className={styles.result} aria-live="polite">
          <span className={styles.kicker}>Estimativa</span>
          <strong className={styles.total}>{money.format(result.tax)}</strong>
          <p>ITBI estimado para o cenário informado</p>
          <dl>
            <div><dt>Base informada</dt><dd>{money.format(Math.max(baseValue, 0))}</dd></div>
            {result.hasSplit && (
              <>
                <div><dt>Base em alíquota reduzida</dt><dd>{money.format(result.reducedBase)}</dd></div>
                <div><dt>Base em alíquota normal</dt><dd>{money.format(result.regularBase)}</dd></div>
              </>
            )}
            <div><dt>Referência da regra</dt><dd>{result.source}</dd></div>
          </dl>
          <div className={styles.warning}>
            <strong>Não pague com base apenas nesta estimativa.</strong>
            <p>Emita ou confira a guia oficial do município antes de concluir a compra.</p>
          </div>
        </aside>
      </div>
    </section>
  );
}
