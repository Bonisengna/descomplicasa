"use client";

import { useEffect, useRef, useState } from "react";
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
const totalHoldMs = 3000;
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
  const finishCycleRef = useRef<(() => void) | null>(null);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const card = cardRef.current;
    if (!card || typeof IntersectionObserver === "undefined" || typeof matchMedia !== "function") return;

    const motion = matchMedia("(prefers-reduced-motion: reduce)");
    if (typeof motion.addEventListener !== "function") return;

    let visible = false;
    let replay: number | undefined;
    const canPlay = () => visible && !document.hidden && !motion.matches && !paused;

    const stop = () => {
      window.clearTimeout(replay);
      replay = undefined;
      card.dataset.reveal = "complete";
    };

    const updatePlayback = () => {
      if (!canPlay()) {
        stop();
      } else if (replay === undefined && card.dataset.reveal !== "playing") {
        card.dataset.reveal = "playing";
      }
    };

    finishCycleRef.current = () => {
      if (card.dataset.reveal !== "playing") return;
      card.dataset.reveal = "complete";
      if (!canPlay()) return;

      replay = window.setTimeout(() => {
        replay = undefined;
        updatePlayback();
      }, totalHoldMs);
    };

    const observer = new IntersectionObserver(([entry]) => {
      visible = Boolean(entry && entry.intersectionRatio >= visibleThreshold);
      updatePlayback();
    }, { threshold: visibleThreshold });

    stop();
    card.dataset.cycleReady = "true";
    motion.addEventListener("change", updatePlayback);
    document.addEventListener("visibilitychange", updatePlayback);
    observer.observe(card);

    return () => {
      stop();
      observer.disconnect();
      motion.removeEventListener("change", updatePlayback);
      document.removeEventListener("visibilitychange", updatePlayback);
      finishCycleRef.current = null;
      delete card.dataset.cycleReady;
      delete card.dataset.reveal;
    };
  }, [paused]);

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
          <dd><AnimatedAmount amount={total} delay={totalDelay} onComplete={() => finishCycleRef.current?.()} /></dd>
        </div>
      </dl>
      <p className={styles.note}>Valores ilustrativos. Use as calculadoras para estimar seus custos.</p>
      <button className={styles.playback} type="button" onClick={() => setPaused(value => !value)}>
        {paused ? "Retomar animação" : "Pausar animação"}
      </button>
    </section>
  );
}
