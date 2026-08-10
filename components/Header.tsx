"use client";

import { useState } from "react";

export function Header() {
  const [open, setOpen] = useState(false);

  const close = () => setOpen(false);

  return (
    <header className="site-header">
      <div className="container header-inner">
        <a className="brand" href="/" aria-label="Descomplicasa - início" onClick={close}>
          <span className="brand-dot" aria-hidden="true" />
          <span className="brand-copy">
            <strong>DESCOMPLICASA</strong>
            <small>Tudo o que você precisa entender antes de comprar um imóvel.</small>
          </span>
        </a>

        <button
          className="menu-toggle"
          type="button"
          aria-expanded={open}
          aria-controls="main-navigation"
          aria-label={open ? "Fechar menu" : "Abrir menu"}
          onClick={() => setOpen((value) => !value)}
        >
          <span />
          <span />
          <span />
        </button>

        <nav id="main-navigation" className={`main-nav ${open ? "is-open" : ""}`} aria-label="Navegação principal">
          <a href="/#calculadoras" onClick={close}>Calculadoras</a>
          <a href="/#checklists" onClick={close}>Checklists</a>
          <a href="/#guias" onClick={close}>Guias</a>
          <a href="/blog" onClick={close}>Blog</a>
          <a href="/#sobre" onClick={close}>Sobre</a>
          <a className="button button-small" href="/calculadoras/financiamento" onClick={close}>Simular financiamento <span aria-hidden="true">→</span></a>
        </nav>
      </div>
    </header>
  );
}
