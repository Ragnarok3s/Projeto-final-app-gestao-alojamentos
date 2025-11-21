# Gestor de Alojamentos

Aplicação web interna para gerir alojamentos e reservas de uma empresa de gestão de propriedades, com frontend Angular e backend Node.js/Express.

## Principais funcionalidades
- Registar e gerir unidades de alojamento com detalhes operacionais.
- Criar, editar e cancelar reservas internas manualmente.
- Visualizar reservas num calendário por unidade com filtros rápidos.
- Controlar estado das reservas (confirmada, pendente, cancelada) e notas internas.

## Arquitetura em alto nível
- **Frontend (Angular + NgRx):** SPA responsável pela experiência de utilizador, gestão de estado no cliente e comunicação com a API via HTTPS.
- **Backend (Node.js + Express + TypeScript):** API REST que expõe endpoints para gestão de unidades e reservas, incluindo validação e regras de negócio.
- **Base de dados (PostgreSQL):** Armazena unidades, reservas e utilizadores internos, acedida via ORM (Prisma ou TypeORM).
- **Comunicação:** Frontend consome a API REST do backend; backend liga-se ao PostgreSQL numa rede segura. Autenticação e autorização geridas no backend, com tokens/jwt no frontend.

## Stack tecnológica
- **Frontend:** Angular, NgRx, RxJS, Angular CLI.
- **Backend:** Node.js, Express, TypeScript, ORM (Prisma ou TypeORM), ferramentas de linting/testes em JavaScript/TypeScript.
- **Base de dados:** PostgreSQL.
- **Suporte e tooling:** npm, Docker (opcional para dev), Git.

## Como correr o projeto em desenvolvimento

### Requisitos
- Node.js LTS (>= 18)
- npm (>= 9)
- PostgreSQL em execução e acessível

### Backend
1. Entrar na pasta do backend (ex.: `cd backend`).
2. Instalar dependências: `npm install`.
3. Configurar variáveis de ambiente (ex.: `.env`) com pelo menos:
   - `DATABASE_URL=postgresql://<user>:<password>@localhost:5432/<db>`
   - `PORT=3000`
4. Aplicar migrações/seed conforme o ORM escolhido:
   - Prisma: `npx prisma migrate dev` e `npx prisma db seed` (se existir seed).
   - TypeORM: `npm run typeorm migration:run`.
5. Iniciar o servidor em modo desenvolvimento: `npm run dev` (ou `npm run start:dev`).

### Frontend
1. Entrar na pasta do frontend (ex.: `cd frontend`).
2. Instalar dependências: `npm install`.
3. Configurar o ficheiro de ambiente (`src/environments/environment.ts`) com a URL da API, ex.: `apiBaseUrl: 'http://localhost:3000/api'`.
4. Iniciar o servidor de desenvolvimento: `npm start` ou `ng serve`.
5. Aceder via browser em `http://localhost:4200`.

## Estrutura de pastas (alto nível)
```
<root>/
├─ backend/
│  ├─ src/
│  ├─ prisma/ ou ormconfig/
│  ├─ package.json
│  └─ tsconfig.json
├─ frontend/
│  ├─ src/
│  ├─ angular.json
│  └─ package.json
├─ docs/
├─ infra/ (scripts de Docker/CI/CD)
└─ README.md
```

## Roadmap básico
- Integração com calendários externos (iCal) para import/export de reservas.
- Conectores para canais de reserva (Booking.com, Airbnb) com sincronização de disponibilidade.
- Gestão de utilizadores e papéis com MFA.
- Relatórios operacionais (ocupação, cancelamentos, receitas estimadas).
- Notificações internas (email/Slack) para alterações críticas nas reservas.
