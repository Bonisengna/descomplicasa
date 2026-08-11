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
- Não assumir que todo saldo de FGTS está disponível.
- Para amortização ou liquidação, usar no modelo atual intervalo mínimo de 24 meses entre utilizações do FGTS e deixar claro que a elegibilidade precisa ser confirmada.

## Modelo matemático base
Taxa mensal equivalente: `i_m = (1 + i_a)^(1/12) - 1`.

Aporte inicial: `novo saldo = saldo devedor - aporte`.

Economia de juros: `juros futuros sem estratégia - juros futuros com estratégia`.

O próprio aporte não é economia; é capital antecipado pelo usuário.

## V1 — Aporte único
Status: IMPLEMENTADA

Inclui saldo devedor, prazo, taxa anual, SAC/Price, aporte único com slider, redução de prazo/parcela, novo saldo, novo prazo, juros economizados e tabela mês a mês.

## Incremento atual — aportes recorrentes dentro da mesma ferramenta
Status: IMPLEMENTADO

Decisão de produto: antecipamos partes da V3 e V4 porque o caso de uso é forte e queremos concentrar toda a amortização em uma única página.

### Aporte anual com recursos próprios
Inclui:
- ativação opcional;
- valor anual;
- primeiro mês do aporte;
- repetição a cada 12 meses enquanto houver saldo;
- uso para representar 13º, bônus, PLR ou reserva própria;
- total efetivamente aplicado;
- coluna própria na tabela mês a mês.

### FGTS periódico
Inclui:
- ativação opcional;
- valor estimado por utilização;
- primeiro mês de uso;
- repetição a cada 24 meses no modelo de amortização/liquidação;
- total de FGTS aplicado no cenário;
- coluna própria na tabela mês a mês;
- link contextual para `/guias/fgts`;
- aviso de que saldo, elegibilidade e regras do contrato precisam ser confirmados.

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
Status: PARCIALMENTE IMPLEMENTADA

Já implementado:
- valor de FGTS informado pelo usuário;
- primeiro mês de utilização;
- intervalo de referência de 24 meses entre amortizações/liquidações;
- total aplicado;
- visualização dos eventos na tabela;
- conexão com `/guias/fgts`;
- aviso de elegibilidade.

Falta:
- saldo inicial de FGTS separado do valor por uso;
- projeção opcional de novos depósitos;
- alerta específico para saldo bloqueado por antecipação do Saque-Aniversário;
- modalidades distintas: amortização, liquidação e pagamento de parte das prestações.

Não criar página/calculadora separada: o FGTS continuará como área da calculadora de amortização.

## V5 — Múltiplos aportes e plano personalizado
Status: PLANEJADA

Adicionar vários aportes em datas diferentes, editor de eventos, cenários locais, comparação lado a lado e resumo de capital aportado x juros evitados x tempo reduzido.

## V6 — Comparador de estratégias
Status: PLANEJADA

Pergunta principal: **Tenho R$ X disponíveis. Qual estratégia produz o melhor resultado para meu objetivo?**

Adicionar comparação automática entre aporte hoje, mensal, anual e FGTS quando aplicável; objetivo reduzir prazo/juros/parcela; ranking; melhor redução de prazo; maior economia de juros; flexibilidade; visualização consolidada.

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
7. aporte anual ocorre em intervalos de 12 meses a partir do mês escolhido;
8. FGTS para amortização/liquidação ocorre em intervalos de 24 meses no modelo atual;
9. interface móvel preserva controles principais;
10. disclaimer permanece visível;
11. o simulador nunca afirma que o usuário está elegível para usar FGTS.
