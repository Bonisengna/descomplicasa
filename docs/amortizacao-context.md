# Contexto — Simulador de Amortização DescompliCAZA

## Objetivo
Criar uma ferramenta única e visual para mostrar o efeito de amortizações extraordinárias em financiamentos imobiliários. Pergunta central: **se eu colocar dinheiro extra no financiamento, quanto tempo e juros posso economizar?**

Este arquivo deve permanecer como contexto do produto até a V6.

## Regras de produto
- Interface sem emojis.
- Priorizar compreensão por pessoas sem conhecimento financeiro.
- Separar sempre redução de prazo e redução de parcela.
- Mostrar valores em reais e tempo em meses/anos.
- Controles devem atualizar os resultados imediatamente.
- Nunca apresentar a simulação como recálculo oficial do banco.
- Informar que TR, seguros, tarifas, CET, atualização monetária, datas e regras específicas da instituição podem alterar o resultado real.
- SAC e Price permanecem separados.
- FGTS entra como estratégia dentro desta calculadora; não criar calculadora de amortização exclusiva para FGTS.
- Não assumir que todo saldo de FGTS está disponível ou que pode ser usado em qualquer periodicidade; sempre direcionar para as regras vigentes.

## Modelo matemático base
Taxa mensal equivalente: `i_m = (1 + i_a)^(1/12) - 1`.

Aporte inicial: `novo saldo = saldo devedor - aporte`.

Economia de juros: `juros futuros sem estratégia - juros futuros com estratégia`.

O próprio aporte não é economia; é capital antecipado pelo usuário.

## V1 — Aporte único
Status: IMPLEMENTADA

Inclui saldo devedor, prazo, taxa anual, SAC/Price, aporte único com slider, redução de prazo/parcela, novo saldo, novo prazo, juros economizados e tabela mês a mês.

## Incremento atual — aporte anual dentro da mesma ferramenta
Status: IMPLEMENTADO

Decisão de produto: antecipamos parte da V3 por ser um caso de uso forte e manter a ferramenta concentrada em uma única página.

Inclui:
- ativação opcional de aporte anual;
- valor anual;
- primeiro mês do aporte;
- repetição a cada 12 meses enquanto houver saldo;
- exemplos de origem: FGTS, 13º, bônus ou reserva;
- total de aportes anuais efetivamente aplicados;
- coluna de aporte anual na tabela mês a mês;
- link contextual para `/guias/fgts`.

Importante: o rótulo FGTS é apenas um exemplo de origem do recurso. A calculadora não afirma elegibilidade nem disponibilidade do saldo.

## V2 — Aporte mensal recorrente
Status: PLANEJADA

Adicionar valor extra mensal, slider, aplicação mensal, nova data de quitação, juros economizados e comparação com aporte único. Pergunta principal: **Se eu pagar R$ X a mais por mês, quando termino?**

## V3 — Aportes anuais e eventos programados
Status: PARCIALMENTE IMPLEMENTADA

Já implementado: aporte anual recorrente e primeiro mês.

Falta:
- mês-calendário em vez de apenas número da parcela;
- eventos como 13º e bônus com calendários distintos;
- comparação explícita entre aporte único, mensal e anual;
- linha do tempo visual dos eventos.

## V4 — FGTS como estratégia de amortização
Status: PLANEJADA

Adicionar:
- saldo FGTS disponível informado pelo usuário;
- cenários compatíveis com as modalidades permitidas pelas regras vigentes;
- alerta para saldo bloqueado por antecipação do Saque-Aniversário;
- conexão forte com `/guias/fgts`;
- elegibilidade e disponibilidade sempre sujeitas a confirmação.

Não criar página/calculadora separada: será uma área da calculadora de amortização.

## V5 — Múltiplos aportes e plano personalizado
Status: PLANEJADA

Adicionar vários aportes em datas diferentes, editor de eventos, cenários locais, comparação lado a lado e resumo de capital aportado x juros evitados x tempo reduzido.

## V6 — Comparador de estratégias
Status: PLANEJADA

Pergunta principal: **Tenho R$ X disponíveis. Qual estratégia produz o melhor resultado para meu objetivo?**

Adicionar comparação automática entre aporte hoje, mensal e anual; objetivo reduzir prazo/juros/parcela; ranking; melhor redução de prazo; maior economia de juros; flexibilidade; visualização consolidada.

## Integrações previstas
- `/calculadoras/financiamento`: levar saldo/taxa/prazo/sistema para amortização.
- `/guias/fgts`: explicar regras do FGTS.
- Blog: amortização, antecipação de parcelas, FGTS e custo de oportunidade.
- Futuramente compartilhar cenário por URL com parâmetros não sensíveis.

## Critérios permanentes
1. taxa zero e positiva devem produzir cálculo reproduzível;
2. aporte zero preserva cenário base;
3. aporte igual ao saldo zera saldo e juros futuros;
4. redução de prazo nunca aumenta meses;
5. economia de juros nunca negativa;
6. aportes recorrentes param quando o saldo zera;
7. interface móvel preserva controles principais;
8. disclaimer permanece visível.
