# Gestor de Alojamentos — Frontend

SPA interna em Angular para operadores gerirem unidades de alojamento e reservas no browser, com estado global em NgRx e calendarização via FullCalendar.

## Requisitos para desenvolvimento
- Node.js LTS (>= 18)
- npm (>= 9)
- Angular CLI instalado globalmente (opcional mas recomendado)

## Configuração de ambientes
Edite os ficheiros `src/environments/environment.ts` e `src/environments/environment.prod.ts` para apontar à API REST do backend:
```ts
export const environment = {
  production: false,
  apiBaseUrl: 'http://localhost:3000/api'
};
```
Ajuste `apiBaseUrl` consoante o domínio/porta de deploy.

## Comandos npm principais
- `npm start` ou `ng serve` — inicia o servidor de desenvolvimento em `http://localhost:4200`.
- `npm run build` ou `ng build` — gera build de produção em `dist/`.
- `npm test` ou `ng test` — executa testes unitários com Karma/Jasmine.

## Estrutura de módulos e rotas
- `/login` — página de autenticação.
- `/app/units` — listagem e gestão de unidades.
- `/app/units/:id/calendar` — calendário de reservas para a unidade selecionada.

## Estado global com NgRx
Principais slices:
- `auth` — sessão, tokens e utilizador autenticado.
- `units` — lista de unidades, seleção corrente e estados de carregamento.
- `reservations` — reservas por unidade, cache normalizada com `@ngrx/entity`, efeitos para chamadas à API.

## Componentes principais
- **Componente de calendário**: renderiza calendário (FullCalendar ou similar) e sincroniza eventos com o slice `reservations`.
- **Modal de reserva**: criar/editar/cancelar reservas, com validação de datas e envio via efeitos NgRx.
- **Listagem de unidades**: tabela/cartões com ações de seleção e navegação para o calendário.

## Notas adicionais
- UI construída com uma biblioteca (ex.: Angular Material ou PrimeNG) para consistência visual e acessibilidade.
- Os efeitos NgRx concentram chamadas HTTP; componentes devem permanecer declarativos e sem lógica de dados acoplada à API.
