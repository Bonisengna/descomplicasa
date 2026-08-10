# Descomplicasa — Home MVP

Home institucional do MVP Descomplicasa, criada em Next.js com App Router e CSS puro.

## Rodar localmente

Requisitos: Node.js 20.9 ou superior.

```bash
npm install
npm run dev
```

Abra `http://localhost:3000`.

## Build de produção

```bash
npm run build
npm run start
```

## Deploy na Vercel

1. Envie esta pasta para um repositório GitHub.
2. Na Vercel, clique em **Add New > Project**.
3. Importe o repositório.
4. A Vercel detectará Next.js automaticamente.
5. Clique em **Deploy**.

Não há variáveis de ambiente nesta primeira versão.

## Estrutura atual

- `/` — Home
- Seções por âncora: Calculadoras, Checklists, Guias e Sobre
- Demais páginas ainda não foram criadas.

## Identidade

- Verde principal: `#16803A`
- Verde escuro: `#125C2D`
- Verde suave: `#EAF7EE`
- Grafite: `#17201C`
- Cinza: `#64706A`
- Fundo: `#FAFCFA`
- Títulos: Manrope
- Interface/texto: Inter

## Próximos passos sugeridos

1. Criar `/calculadoras/financiamento`.
2. Definir componente compartilhado de calculadora.
3. Criar páginas de ITBI, entrada, escritura e registro.
4. Adicionar Open Graph image e analytics.
5. Trocar o domínio provisório de `metadataBase` pelo domínio real, se necessário.
