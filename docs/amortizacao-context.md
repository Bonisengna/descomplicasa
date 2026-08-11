# Contexto — Simulador de Amortização DescompliCAZA

## Objetivo

Criar uma ferramenta visual para mostrar o efeito de amortizações extraordinárias em financiamentos imobiliários. A pergunta central do produto é:

> Se eu colocar dinheiro extra no financiamento, quanto tempo e juros posso economizar?

Este arquivo deve ser atualizado a cada nova versão da ferramenta. O roadmap até a V6 deve permanecer aqui para preservar contexto de produto e evitar expansão desordenada de escopo.

## Regras de produto

- Interface sem emojis.
- Priorizar compreensão por pessoas sem conhecimento financeiro.
- Separar sempre `redução de prazo` e `redução de parcela`.
- Mostrar valores em reais e tempo em meses/anos.
- Alterações do slider devem atualizar os resultados imediatamente.
- Diferenciar claramente `saldo devedor`, `aporte`, `juros futuros` e `economia de juros`.
- Nunca apresentar a simulação como recálculo oficial de banco.
- Informar que TR, seguros, tarifas, CET, atualização monetária, datas exatas e regras específicas da instituição podem alterar o resultado real.
- SAC e Price devem permanecer como sistemas separados.
- Quando uma versão futura for iniciada, manter as funcionalidades anteriores salvo decisão explícita em contrário.

## Modelo matemático V1

### Taxa mensal equivalente

A taxa anual informada é convertida em taxa mensal equivalente:

`i_m = (1 + i_a)^(1/12) - 1`

### Cenário sem aporte

O saldo atual é tratado como principal e o prazo informado como número de prestações restantes.

- SAC: amortização constante do principal durante o prazo restante.
- Price: prestação financeira constante calculada pela fórmula Price.

### Aporte único

`novo saldo = saldo devedor - aporte`

O aporte é limitado ao saldo devedor informado.

### Estratégia: reduzir prazo

- Price: mantém como referência a prestação calculada no cenário original e aplica o saldo menor até a quitação.
- SAC: mantém como referência a amortização mensal constante do cenário original e aplica o saldo menor até a quitação.

Objetivo: estimar quantos meses deixam de existir e os juros evitados.

### Estratégia: reduzir parcela

Mantém o prazo restante original e recalcula o cronograma sobre o novo saldo.

Objetivo: estimar a nova primeira prestação e os juros evitados sem redução de prazo.

### Economia de juros

`economia = juros futuros sem aporte - juros futuros após aporte`

Não tratar o próprio aporte como economia. O aporte é capital antecipado pelo usuário.

## V1 — Aporte único

Status: IMPLEMENTADA

Escopo:

- saldo devedor atual;
- prazo restante em meses;
- taxa anual;
- SAC ou Price;
- aporte único;
- slider de aporte;
- campo numérico sincronizado com o aporte;
- opção reduzir prazo;
- opção reduzir parcela;
- novo saldo;
- novo prazo;
- redução estimada da primeira parcela;
- meses/anos economizados;
- juros futuros antes;
- juros futuros depois;
- juros economizados;
- comparação visual do prazo;
- tabela mês a mês antes/depois.

Fora da V1:

- aportes recorrentes;
- aportes futuros;
- FGTS como evento específico;
- múltiplos aportes;
- comparação automática entre estratégias;
- importação de contrato bancário.

## V2 — Aporte mensal recorrente

Status: PLANEJADA

Adicionar:

- valor extra mensal;
- slider de aporte mensal;
- aplicação do extra em todas as competências futuras;
- nova data estimada de quitação;
- juros economizados;
- comparação com V1 aporte único;
- pergunta principal: `Se eu pagar R$ X a mais por mês, quando termino?`.

## V3 — Aporte anual e eventos programados

Status: PLANEJADA

Adicionar:

- aporte anual recorrente;
- mês do aporte;
- simulação de 13º, bônus e rendas extras;
- comparação entre aporte único, mensal e anual;
- linha do tempo dos eventos de amortização.

## V4 — FGTS como estratégia de amortização

Status: PLANEJADA

Adicionar:

- saldo FGTS disponível;
- uso inicial ou periódico conforme regras aplicáveis;
- alerta para saldo bloqueado por antecipação do Saque-Aniversário;
- conexão com `/guias/fgts`;
- deixar claro que elegibilidade e disponibilidade precisam ser confirmadas.

## V5 — Múltiplos aportes e plano personalizado

Status: PLANEJADA

Adicionar:

- vários aportes em datas diferentes;
- editor de eventos;
- cenários salvos localmente enquanto a sessão estiver aberta;
- comparação lado a lado entre dois planos;
- resumo de capital aportado x juros evitados x tempo reduzido.

## V6 — Comparador de estratégias

Status: PLANEJADA

Pergunta principal:

> Tenho R$ X disponíveis. Qual estratégia produz o melhor resultado para meu objetivo?

Adicionar:

- comparação automática entre aporte hoje, aportes mensais e aportes anuais;
- objetivo selecionável: reduzir prazo, reduzir juros ou reduzir parcela;
- ranking dos cenários;
- melhor redução de prazo;
- maior economia de juros;
- opção de maior flexibilidade;
- visualização comparativa consolidada.

## Integrações previstas

- `/calculadoras/financiamento`: permitir levar saldo/taxa/prazo/sistema para a amortização.
- `/guias/fgts`: explicar uso do FGTS.
- Blog: artigos sobre amortização, antecipação de parcelas e custo de oportunidade.
- Futuramente, compartilhar cenário por URL com parâmetros não sensíveis.

## Critérios para considerar uma versão pronta

1. cálculo reproduzível para taxa zero e taxa positiva;
2. aporte zero retorna resultado idêntico ao cenário base;
3. aporte igual ao saldo resulta em saldo zero e ausência de juros futuros;
4. redução de parcela mantém o prazo informado;
5. redução de prazo nunca aumenta o número de meses;
6. economia de juros nunca deve ser negativa;
7. interface funciona em tela móvel sem perda dos controles principais;
8. disclaimer permanece visível na página.
