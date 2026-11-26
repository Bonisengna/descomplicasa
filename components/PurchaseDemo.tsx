"use client";

import { useEffect, useRef } from "react";
import type { CSSProperties } from "react";
import styles from "./PurchaseDemo.module.css";

const property = { label: "Valor do imóvel", amount: 300_000 };
const initialCosts = [
  { label: "Entrada", amount: 60_000 },
  { label: "ITBI estimado", amount: 9_000 },
  { label: "Escritura", amount: 2_800 },
  { label: "Registro", amount: 3_200 },
  { label: "Outros custos", amount: 2_450 },
];

const costs = [property, ...initialCosts];
const total = initialCosts.reduce((sum, cost) => sum + cost.amount, 0);
const formatAmount = new Intl.NumberFormat("pt-BR");
const rowInterval = 420;
const characterInterval = 58;
const totalDelay = costs.length * rowInterval + 120;
const visibleThreshold = 0.2;

function AnimatedAmount({ amount, delay, onComplete }: { amount: number; delay: number; onComplete?: () => void }) {
  const formatted = formatAmount.format(amount);

  return (
    <>
      <span className={styles.accessibleAmount}>R$ {formatted}</span>
      <span
        aria-hidden="true"
        className={styles.amount}
        onAnimationEnd={onComplete && ((event) => {
          if (event.target === event.currentTarget.lastElementChild) onComplete();
        })}
      >
        <span className={styles.character} style={{ "--reveal-at": `${delay}ms` } as CSSProperties}>
          R${" "}
        </span>
        {Array.from(formatted, (character, index) => (
          <span
            className={styles.character}
            key={index}
            style={{ "--reveal-at": `${delay + index * characterInterval}ms` } as CSSProperties}
          >
            {character}
          </span>
        ))}
      </span>
    </>
  );
}

export function PurchaseDemo() {
  const cardRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const card = cardRef.current;
    if (!card || typeof IntersectionObserver === "undefined" || typeof matchMedia !== "function") return;

    const motion = matchMedia("(prefers-reduced-motion: reduce)");
    if (motion.matches || typeof motion.addEventListener !== "function") return;

    const observer = new IntersectionObserver(([entry]) => {
      if (!entry || entry.intersectionRatio < visibleThreshold || card.dataset.reveal !== "waiting") return;

      observer.disconnect();
      card.dataset.reveal = "playing";
    }, { threshold: visibleThreshold });

    function handleMotionChange(event: MediaQueryListEvent) {
      if (!event.matches || !card) return;

      observer.disconnect();
      card.dataset.reveal = "complete";
    }

    card.dataset.reveal = "waiting";
    motion.addEventListener("change", handleMotionChange);
    observer.observe(card);

    return () => {
      observer.disconnect();
      motion.removeEventListener("change", handleMotionChange);
      delete card.dataset.reveal;
    };
  }, []);

  return (
    <section ref={cardRef} className={styles.card}>
      <h2>Quanto custa começar a compra?</h2>
      <dl className={styles.costs}>
        {costs.map(({ label, amount }, index) => (
          <div className={styles.row} key={label}>
            <dt>{label}</dt>
            <dd><AnimatedAmount amount={amount} delay={index * rowInterval} /></dd>
          </div>
        ))}
        <div className={styles.total}>
          <dt>Custo inicial ilustrativo</dt>
          <dd><AnimatedAmount amount={total} delay={totalDelay} onComplete={() => {
            if (cardRef.current) cardRef.current.dataset.reveal = "complete";
          }} /></dd>
        </div>
      </dl>
      <p className={styles.note}>Valores ilustrativos. Use as calculadoras para estimar seus custos.</p>
    </section>
  );
}
