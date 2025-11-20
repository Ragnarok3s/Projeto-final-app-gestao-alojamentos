# <NOME_DO_PROJETO> — API do Backend

Documentação resumida da API REST usada pelo frontend Angular para autenticação, gestão de unidades e gestão de reservas internas.

## Convenções gerais
- Base URL sugerida: `https://api.exemplo.local/api` (ajustar conforme ambiente).
- Todas as respostas seguem o formato JSON e incluem `Content-Type: application/json`.
- Autenticação: Bearer Token (`Authorization: Bearer <token>`). O login devolve o token.
- Datas em formato ISO (`YYYY-MM-DD`). Fuso horário UTC salvo indicação contrária.

## Endpoints de Auth

### POST /auth/login
- **Descrição:** Autentica um utilizador interno e devolve um token de acesso.
- **Body (JSON):**
  - `email` (string, obrigatório)
  - `password` (string, obrigatório)
- **Exemplo de request:**
```json
{
  "email": "operacoes@example.com",
  "password": "senha-segura"
}
```
- **Exemplo de response 200:**
```json
{
  "token": "jwt-assinado",
  "user": {
    "id": "u_123",
    "name": "Operações Norte",
    "email": "operacoes@example.com",
    "role": "admin"
  }
}
```
- **Erros comuns:**
  - `401 Unauthorized`: credenciais inválidas ou conta desativada.
  - `429 Too Many Requests`: limite de tentativas excedido (se rate limiting ativo).

## Endpoints de Units

### GET /units
- **Descrição:** Lista todas as unidades (alojamentos) visíveis para o utilizador.
- **Query params:**
  - `active` (opcional, boolean) para filtrar por estado.
- **Exemplo de response 200:**
```json
[
  {
    "id": "unit_1",
    "name": "Apartamento Centro",
    "capacity": 4,
    "active": true
  },
  {
    "id": "unit_2",
    "name": "Casa Praia",
    "capacity": 6,
    "active": false
  }
]
```
- **Erros comuns:**
  - `401 Unauthorized`: token ausente ou inválido.

### POST /units
- **Descrição:** Cria uma nova unidade.
- **Body (JSON):**
  - `name` (string, obrigatório)
  - `capacity` (number, obrigatório)
  - `active` (boolean, opcional; default `true`)
- **Exemplo de request:**
```json
{
  "name": "Loft Rio",
  "capacity": 2,
  "active": true
}
```
- **Exemplo de response 201:**
```json
{
  "id": "unit_3",
  "name": "Loft Rio",
  "capacity": 2,
  "active": true
}
```
- **Erros comuns:**
  - `400 Bad Request`: campos obrigatórios em falta ou tipos inválidos.
  - `401 Unauthorized`: token ausente ou inválido.

### PUT /units/:id
- **Descrição:** Atualiza dados da unidade indicada.
- **Path params:**
  - `id` (string, obrigatório)
- **Body (JSON):**
  - `name` (string)
  - `capacity` (number)
  - `active` (boolean)
- **Exemplo de request:**
```json
{
  "name": "Apartamento Centro - Renovado",
  "capacity": 5,
  "active": true
}
```
- **Exemplo de response 200:**
```json
{
  "id": "unit_1",
  "name": "Apartamento Centro - Renovado",
  "capacity": 5,
  "active": true
}
```
- **Erros comuns:**
  - `400 Bad Request`: payload inválido.
  - `401 Unauthorized`: token ausente ou inválido.
  - `404 Not Found`: unidade não existe ou não está acessível.

## Endpoints de Reservations

### GET /units/:unitId/reservations?from=YYYY-MM-DD&to=YYYY-MM-DD
- **Descrição:** Lista reservas de uma unidade num intervalo de datas.
- **Path params:**
  - `unitId` (string, obrigatório)
- **Query params:**
  - `from` (string, obrigatório, formato `YYYY-MM-DD`)
  - `to` (string, obrigatório, formato `YYYY-MM-DD`)
- **Exemplo de response 200:**
```json
[
  {
    "id": "res_101",
    "unitId": "unit_1",
    "guestName": "Maria Silva",
    "checkIn": "2024-07-10",
    "checkOut": "2024-07-14",
    "status": "confirmed",
    "notes": "Chegada tardia"
  }
]
```
- **Erros comuns:**
  - `400 Bad Request`: datas inválidas (ex.: `from` > `to`).
  - `401 Unauthorized`: token ausente ou inválido.
  - `404 Not Found`: unidade inexistente ou sem acesso.

### POST /units/:unitId/reservations
- **Descrição:** Cria uma reserva interna para a unidade indicada.
- **Path params:**
  - `unitId` (string, obrigatório)
- **Body (JSON):**
  - `guestName` (string, obrigatório)
  - `checkIn` (string, obrigatório, `YYYY-MM-DD`)
  - `checkOut` (string, obrigatório, `YYYY-MM-DD`)
  - `notes` (string, opcional)
- **Exemplo de request:**
```json
{
  "guestName": "João Costa",
  "checkIn": "2024-08-01",
  "checkOut": "2024-08-05",
  "notes": "Necessita berço"
}
```
- **Exemplo de response 201:**
```json
{
  "id": "res_202",
  "unitId": "unit_1",
  "guestName": "João Costa",
  "checkIn": "2024-08-01",
  "checkOut": "2024-08-05",
  "status": "confirmed",
  "notes": "Necessita berço"
}
```
- **Erros comuns:**
  - `400 Bad Request`: datas inválidas ou `checkOut` <= `checkIn`.
  - `401 Unauthorized`: token ausente ou inválido.
  - `404 Not Found`: unidade não encontrada.
  - `409 Conflict`: sobreposição de datas com outra reserva ativa.

### PUT /reservations/:id
- **Descrição:** Atualiza uma reserva existente.
- **Path params:**
  - `id` (string, obrigatório)
- **Body (JSON):**
  - `guestName` (string, opcional)
  - `checkIn` (string, opcional, `YYYY-MM-DD`)
  - `checkOut` (string, opcional, `YYYY-MM-DD`)
  - `status` (string, opcional: `confirmed`, `pending`, `cancelled`)
  - `notes` (string, opcional)
- **Exemplo de request:**
```json
{
  "checkIn": "2024-07-12",
  "checkOut": "2024-07-15",
  "notes": "Atualizado após confirmação"
}
```
- **Exemplo de response 200:**
```json
{
  "id": "res_101",
  "unitId": "unit_1",
  "guestName": "Maria Silva",
  "checkIn": "2024-07-12",
  "checkOut": "2024-07-15",
  "status": "confirmed",
  "notes": "Atualizado após confirmação"
}
```
- **Erros comuns:**
  - `400 Bad Request`: datas inválidas ou `checkOut` <= `checkIn`.
  - `401 Unauthorized`: token ausente ou inválido.
  - `404 Not Found`: reserva inexistente.
  - `409 Conflict`: sobreposição de datas com outra reserva ativa.

### PATCH /reservations/:id/cancel
- **Descrição:** Cancela uma reserva (altera estado para `cancelled`).
- **Path params:**
  - `id` (string, obrigatório)
- **Exemplo de response 200:**
```json
{
  "id": "res_101",
  "unitId": "unit_1",
  "guestName": "Maria Silva",
  "checkIn": "2024-07-12",
  "checkOut": "2024-07-15",
  "status": "cancelled",
  "notes": "Cancelado a pedido do hóspede"
}
```
- **Erros comuns:**
  - `401 Unauthorized`: token ausente ou inválido.
  - `404 Not Found`: reserva inexistente.
  - `409 Conflict`: reserva já cancelada ou não pode ser cancelada pelo estado atual.

## Considerações de validação e erros
- Usar validação de payload (ex.: Yup/Zod/Joi) para tipos, formatos de data e limites de campos.
- Devolver mensagens claras em `errors` ou `message` para apoio ao frontend.
- Em conflitos de data, devolver detalhes mínimos (ex.: intervalo em conflito) sem expor dados sensíveis.
- Registar auditoria para operações de criação/alteração/cancelamento de reservas.
