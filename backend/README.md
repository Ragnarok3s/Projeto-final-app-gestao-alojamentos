# Backend | Gestor de Alojamentos

Backend em Node.js + Express + TypeScript para suportar a app interna de gestão de alojamentos. Expõe API REST para autenticação, gestão de unidades e reservas, persistindo dados em PostgreSQL via Prisma.

## Requisitos
- Node.js >= 18
- npm >= 9
- PostgreSQL 14+

## Variáveis de ambiente
Configure um ficheiro `.env` na raiz do backend (não é criado automaticamente). Principais chaves esperadas:
- `DATABASE_URL`: URL de ligação ao PostgreSQL.
- `PORT`: porto HTTP da API (ex.: 3000).
- `JWT_SECRET` ou chave de assinatura equivalente para tokens.
- `NODE_ENV`: `development` | `production`.

## Comandos npm
```bash
npm install        # instalar dependências
npm run dev        # iniciar servidor em modo desenvolvimento
npm run build      # compilar TypeScript para JavaScript
npm test           # executar testes
npm run migrate    # aplicar migrações do Prisma à base de dados
```

## Estrutura de pastas
- `src/config`: carregamento de env, conexões (PostgreSQL/Prisma) e settings globais.
- `src/routes`: definição das rotas Express e mapeamento para controllers.
- `src/controllers`: entrada da camada HTTP; valida entradas e delega para serviços.
- `src/services`: lógica de negócio e orquestração de operações de dados.
- `src/prisma` ou `src/models`: esquema Prisma, migrações e cliente de acesso a dados.
- `src/middlewares`: autenticação, autorização, validação e gestão de erros.

## Endpoints principais (overview)
- **Auth**: `POST /auth/login`
- **Units**: `GET /units`, `POST /units`, `GET /units/:id`, `PUT /units/:id`, `DELETE /units/:id`
- **Reservations**: `GET /units/:unitId/reservations`, `POST /units/:unitId/reservations`, `GET /reservations/:id`, `PUT /reservations/:id`, `DELETE /reservations/:id`

## Validação e tratamento de erros
- Requests são validados na entrada (DTOs/schemas) antes de chegar aos serviços.
- Middlewares centralizam resposta de erros, devolvendo JSON consistente com códigos HTTP adequados.
- Erros de validação retornam `400 Bad Request`; falta de autenticação `401` e acesso proibido `403`; erros não tratados resultam em `500 Internal Server Error` com logging.
