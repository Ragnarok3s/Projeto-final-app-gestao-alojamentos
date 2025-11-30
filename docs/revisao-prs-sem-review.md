# Revisão retroativa de PRs sem revisão

## Substituição pelo DayPilot
- A dependência do DayPilot foi padronizada em `4.8.1`, conforme a especificação atual da aplicação.【F:frontend/package.json†L11-L35】

## Simplificação do `CalendarComponent`
- O componente expõe as configurações do DayPilot Lite com callbacks padrão para clique em eventos e seleção de intervalo, emitindo os eventos para o host que o utiliza.【F:frontend/src/app/features/calendar/calendar.component.ts†L6-L40】

## Ajustes na página de calendário de unidade
- A configuração do calendário utiliza strings compatíveis com o DayPilot Lite, mantém a vista semanal por omissão e recalcula o intervalo visível sempre que a navegação ou o carregamento de reservas é actualizado.【F:frontend/src/app/features/units/pages/unit-calendar-page/unit-calendar-page.component.ts†L15-L188】
- Os handlers de clique e seleção de intervalo usam tipos genéricos, preservando a compatibilidade com a edição Lite e mantendo a ligação às reservas carregadas no estado.【F:frontend/src/app/features/units/pages/unit-calendar-page/unit-calendar-page.component.ts†L101-L143】

## Inclusão dos `package-lock.json`
- Foram adicionados `package-lock.json` no frontend e backend com grande volume de dependências. O backend trava `@types/node` em ^22.7.4 enquanto o frontend referencia ^20.11.30; alinhar a versão de Node suportada e documentá-la ajuda a evitar falhas de build em ambientes diferentes.
  - Evidência: versões de `@types/node` nos lockfiles recém-gerados.【F:backend/package-lock.json†L1-L28】【F:frontend/package-lock.json†L1-L49】

## Correções aplicadas
- `@daypilot/daypilot-lite-angular` permanece travado na versão 4.8.1 com lockfile atualizado para refletir a dependência.【F:frontend/package.json†L11-L35】【F:frontend/package-lock.json†L1-L26】
- Componentes de calendário utilizam APIs do DayPilot Lite com emissão de eventos para o estado da aplicação e sem dependências do calendário anterior.【F:frontend/src/app/features/calendar/calendar.component.ts†L6-L40】【F:frontend/src/app/features/units/pages/unit-calendar-page/unit-calendar-page.component.ts†L15-L217】
