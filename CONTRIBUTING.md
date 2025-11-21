# Contribuir para Gestor de Alojamentos

Guia para preparar ambiente, seguir convenções e submeter contribuições com qualidade.

## Requisitos para contribuir
- Node.js LTS (>= 18)
- npm (>= 9)
- PostgreSQL 14+ acessível localmente
- Git configurado com nome/email

## Preparar o ambiente de desenvolvimento
1. **Clonar o repositório** e instalar dependências nas pastas `backend/` e `frontend/`.
2. **Base de dados:** criar uma instância PostgreSQL local e definir credenciais de acesso.
3. **Backend:**
   - Copiar/crear `.env` na pasta `backend/` com `DATABASE_URL`, `PORT` e `JWT_SECRET`.
   - `npm install` e `npm run migrate` para aplicar migrações Prisma.
   - `npm run dev` para expor a API em `http://localhost:3000`.
4. **Frontend:**
   - Atualizar `src/environments/environment.ts` com `apiBaseUrl` a apontar para o backend.
   - `npm install` e `npm start` para servir em `http://localhost:4200`.
5. Confirmar que o frontend comunica com a API e que a base de dados está acessível.

## Convenções de código
- **TypeScript estrito** em backend e frontend; evitar `any` exceto em casos justificados.
- **ESLint + Prettier**: correr linters/formatadores antes de abrir PRs.
- **Estrutura de pastas**:
  - Backend: `src/config`, `src/routes`, `src/controllers`, `src/services`, `src/prisma` (ou `src/models`), `src/middlewares`.
  - Frontend: módulos e features organizados por domínio (`auth`, `units`, `reservations`), store NgRx por feature, componentes declarativos.
- Não introduzir dependências sem necessidade clara; preferir padrões já usados no projeto.

## Convenções de Git
- Mensagens de commit no formato `tipo: descrição curta` (ex.: `feat: adicionar validação de datas`).
- Commits pequenos e focados facilitam a revisão.

## Regras para Pull Requests
- Garantir que testes e linters relevantes foram executados antes de submeter.
- Não adicionar ficheiros binários desnecessários.
- Nunca commitar ficheiros `.env` ou credenciais reais.
- Descrever claramente o objetivo do PR e impactos esperados.

## Secção obrigatória
**Não adicionar ficheiros binários à pasta `docs/` nem à raiz (sem PDFs, imagens, etc.). Documentação deve ser sempre texto/Markdown.**
