# Revisão retroativa de PRs sem revisão

## Substituição do FullCalendar pelo DayPilot
- A dependência do DayPilot estava fixada em `^4.8.1` sem justificativa de downgrade. Atualizamos para `^4.9.0` e registramos na seção de correções aplicadas.【F:frontend/package.json†L11-L35】

## Simplificação do `CalendarComponent`
- Inputs e outputs estavam como `any`, removendo a validação de tipos do DayPilot e permitindo handlers incompatíveis. Restauramos as tipagens explícitas (`DayPilot.CalendarConfig`, `DayPilot.EventClickArgs`, `DayPilot.TimeRangeSelectedArgs`) e mantivemos validação em tempo de compilação.【F:frontend/src/app/features/calendar/calendar.component.ts†L10-L56】
- O merge de configurações usava spread simples e podia ignorar emissores padrão quando callbacks customizados eram fornecidos. Agora, os handlers default disparam eventos e chamam callbacks customizados, preservando a telemetria interna e evitando regressões silenciosas.【F:frontend/src/app/features/calendar/calendar.component.ts†L24-L56】

## Ajustes na página de calendário de unidade
- `currentView` e `config` foram tipados com `DayPilot.CalendarViewType` e `DayPilot.CalendarConfig` para impedir valores inválidos em tempo de compilação.【F:frontend/src/app/features/units/pages/unit-calendar-page/unit-calendar-page.component.ts†L21-L166】
- Eventos e callbacks (`onEventClick`, `onTimeRangeSelected`) voltaram às assinaturas específicas do DayPilot, reduzindo riscos ao ler `event.e.id()` e ao mudar de semana/mês.【F:frontend/src/app/features/units/pages/unit-calendar-page/unit-calendar-page.component.ts†L118-L131】
- A função auxiliar `toIsoDate`, não utilizada, foi removida para evitar código morto.【F:frontend/src/app/features/units/pages/unit-calendar-page/unit-calendar-page.component.ts†L194-L205】

## Inclusão dos `package-lock.json`
- Foram adicionados `package-lock.json` no frontend e backend com grande volume de dependências. O backend trava `@types/node` em ^22.7.4 enquanto o frontend referencia ^20.11.30; alinhar a versão de Node suportada e documentá-la ajuda a evitar falhas de build em ambientes diferentes.
  - Evidência: versões de `@types/node` nos lockfiles recém-gerados.【F:backend/package-lock.json†L1-L28】【F:frontend/package-lock.json†L1-L49】

## Correções aplicadas
- `@daypilot/daypilot-lite-angular` atualizado para a versão ^4.9.0 e lockfile regenerado para acompanhar dependências do pacote.【F:frontend/package.json†L11-L35】【F:frontend/package-lock.json†L1-L60】
- Componentes de calendário voltaram a utilizar tipagens explícitas do DayPilot e preservam a emissão de eventos mesmo com callbacks customizados, reduzindo risco de regressões silenciosas.【F:frontend/src/app/features/calendar/calendar.component.ts†L10-L56】【F:frontend/src/app/features/units/pages/unit-calendar-page/unit-calendar-page.component.ts†L21-L204】
- Versões de `@types/node` alinhadas em frontend e backend (ambos ^20.11.30) e lockfiles atualizados para refletir o alvo de Node comum.【F:backend/package.json†L1-L31】【F:backend/package-lock.json†L1-L40】【F:frontend/package.json†L11-L50】
