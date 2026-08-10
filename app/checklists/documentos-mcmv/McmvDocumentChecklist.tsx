"use client";

import { useMemo, useState } from "react";
import styles from "./documentos-mcmv.module.css";

const items = [
  {
    title: "Documento de identificação e CPF",
    detail: "Separe RG ou CNH e CPF de todos os compradores que participarão da proposta.",
  },
  {
    title: "Comprovante de residência atualizado",
    detail: "Conta de consumo, correspondência bancária ou outro comprovante aceito pela instituição.",
  },
  {
    title: "Comprovantes de renda",
    detail: "Holerites, extratos bancários, declaração de Imposto de Renda ou outros documentos compatíveis com o seu perfil profissional.",
  },
  {
    title: "Extrato do FGTS, se for utilizar o saldo",
    detail: "Confira o saldo e mantenha os dados do vínculo atualizados no aplicativo FGTS.",
  },
  {
    title: "Certidão de estado civil",
    detail: "Nascimento, casamento, averbação de divórcio ou documentos da união estável, conforme o caso.",
  },
  {
    title: "Documentos dos dependentes, quando houver",
    detail: "Certidões e documentos podem ser necessários quando os dependentes entram na composição familiar da proposta.",
  },
  {
    title: "Declaração de Imposto de Renda, se houver",
    detail: "Deixe a declaração e o recibo de entrega acessíveis caso o banco solicite na comprovação de renda ou patrimônio.",
  },
  {
    title: "Declarações e autorizações pedidas pelo banco",
    detail: "A instituição pode solicitar declarações sobre outros imóveis, financiamentos, uso do FGTS e dados cadastrais.",
  },
];

export function McmvDocumentChecklist() {
  const [checked, setChecked] = useState<number[]>([]);

  const progress = useMemo(() => Math.round((checked.length / items.length) * 100), [checked]);

  const toggle = (index: number) => {
    setChecked((current) => current.includes(index) ? current.filter((item) => item !== index) : [...current, index]);
  };

  return (
    <section className={styles.checklistCard} aria-labelledby="checklist-title">
      <div className={styles.checklistHeader}>
        <div>
          <span className={styles.kicker}>Sua preparação</span>
          <h2 id="checklist-title">Checklist de documentos</h2>
          <p>Marque o que já está separado. O progresso fica apenas nesta página e não é enviado ao Descomplicasa.</p>
        </div>
        <div className={styles.progressValue}>
          <strong>{progress}%</strong>
          <span>{checked.length} de {items.length}</span>
        </div>
      </div>

      <div className={styles.progressBar} aria-label={`${progress}% concluído`}>
        <span style={{ width: `${progress}%` }} />
      </div>

      <div className={styles.items}>
        {items.map((item, index) => {
          const active = checked.includes(index);
          return (
            <label className={`${styles.item} ${active ? styles.itemChecked : ""}`} key={item.title}>
              <input type="checkbox" checked={active} onChange={() => toggle(index)} />
              <span className={styles.customCheck} aria-hidden="true">{active ? "✓" : ""}</span>
              <span className={styles.itemCopy}>
                <strong>{item.title}</strong>
                <small>{item.detail}</small>
              </span>
            </label>
          );
        })}
      </div>

      <div className={styles.checklistFooter}>
        <span>{progress === 100 ? "Documentos básicos organizados." : "Continue marcando conforme separar os documentos."}</span>
        {checked.length > 0 && <button type="button" onClick={() => setChecked([])}>Limpar marcações</button>}
      </div>
    </section>
  );
}
