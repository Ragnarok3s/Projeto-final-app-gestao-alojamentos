# <NOME_DO_PROJETO> — Arquitetura

## Introdução
A aplicação <NOME_DO_PROJETO> é uma plataforma web interna para equipas de gestão de alojamentos, permitindo gerir unidades e reservas internas de forma centralizada, com visualização em calendário e controlo de acessos.

## Diagrama lógico (texto)
- **Frontend (SPA Angular)**: aplica design responsivo, consome API REST, mantém estado global com NgRx e comunica via HTTP/JSON.
- **API REST (Express + TypeScript)**: expõe endpoints para autenticação, unidades e reservas, aplica validação e regras de negócio e integra com o ORM.
- **Base de dados relacional (PostgreSQL)**: armazena utilizadores, unidades, calendários e reservas com chaves forasteiras; o ORM (Prisma/TypeORM) garante migrações e acesso tipado.

## Backend — módulos principais
- **Auth**: login, refresh de sessão/token, middleware de autorização e gestão de perfis internos.
- **Units**: CRUD de unidades (id, nome, capacidade, atributos) e endpoints para ativação/desativação.
- **Reservations**: criação/edição/cancelamento de reservas internas, regras de sobreposição, associação a unidades e exposições de vistas por intervalo de datas.

## Frontend — módulos principais
- **Auth**: ecrãs de login, armazenamento seguro do token e guards de rotas.
- **Units**: lista e detalhe de unidades, formulário de edição e seleção da unidade ativa.
- **Calendar/Reservations**: calendário por unidade, carregamento de reservas por intervalo, ações de criar/editar/cancelar.
- **State management (NgRx)**: stores, actions e effects para auth, unidades e reservas; normalização de dados e cache otimista para reservas recentes.

## Fluxo típico
1. **Login**: utilizador interno autentica-se; frontend obtém token e inicializa store.
2. **Selecionar unidade**: o utilizador escolhe a unidade ativa; estado é guardado no store.
3. **Carregar reservas**: frontend chama `/units/{id}/reservations?start&end`; backend valida permissões e devolve reservas.
4. **Criar/editar/cancelar reserva**: ações disparam effects; backend valida sobreposições, confirma e devolve estado atualizado para sincronizar o calendário.

## Decisões técnicas relevantes
- **Express em vez de Nest**: simplicidade, baixo overhead e facilidade de personalização para uma API interna focada em REST.
- **Angular + NgRx**: Angular oferece estrutura opinionada e escalável para equipa interna; NgRx garante previsibilidade, testes mais simples e sincronização segura entre vistas e calendário.
- **TypeScript end-to-end**: tipagem partilhada entre frontend e backend reduz erros e melhora DX.
- **ORM (Prisma ou TypeORM)**: acelera migrações, garante consistência relacional e facilita queries complexas de disponibilidade.

## Evoluções futuras planeadas
- **Integração iCal/Booking/Airbnb** para importar/exportar calendários automaticamente.
- **Multi-utilizador e perfis de acesso** com funções por equipa (operações, limpeza, manutenção).
- **Notificações internas** (email/in-app) para alterações e cancelamentos.
- **Relatórios de ocupação e receita** por unidade e período.
- **Auditoria de alterações** a reservas e unidades.
