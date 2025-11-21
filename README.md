# Gestor de Alojamentos

Aplicação web interna para gerir alojamentos e reservas de uma empresa de gestão de propriedades, com frontend Angular e backend Node.js/Express.

> Estado atual: este repositório contém documentação (pasta `docs/`), metadados BMAD (`web-bundles/`) e notas preliminares (`backend/README.md`, `frontend/README.md`). O código-fonte da aplicação ainda não foi adicionado.

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

O código-fonte (Angular + Node.js/Express) ainda não está presente neste repositório. Enquanto isso:

- Consulte a documentação técnica em `docs/` para entender a arquitetura proposta (`architecture.md`), API (`api.md`) e dependências (`env.md`).
- Use a secção de roadmap abaixo para acompanhar o que falta para tornar o repositório executável.
- Quando o código for adicionado, este README deverá incluir instruções concretas de instalação e arranque (npm install, scripts, variáveis de ambiente e migrações).

## Estrutura de pastas (alto nível)
```
<root>/
├─ backend/               # README preliminar, ainda sem código
├─ frontend/              # README preliminar, ainda sem código
├─ docs/                  # Documentação técnica (arquitetura, API, env)
├─ web-bundles/           # Metadados e artefactos BMAD
├─ CONTRIBUTING.md
└─ README.md
```

## Roadmap básico
- Integração com calendários externos (iCal) para import/export de reservas.
- Conectores para canais de reserva (Booking.com, Airbnb) com sincronização de disponibilidade.
- Gestão de utilizadores e papéis com MFA.
- Relatórios operacionais (ocupação, cancelamentos, receitas estimadas).
- Notificações internas (email/Slack) para alterações críticas nas reservas.
