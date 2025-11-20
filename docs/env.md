# Variáveis de Ambiente

Este documento descreve as variáveis de ambiente necessárias para executar o backend e o frontend do projeto <NOME_DO_PROJETO> em ambientes de desenvolvimento e produção internos.

## Backend

| Variável      | Descrição | Exemplo |
| ------------- | --------- | ------- |
| `PORT`        | Porta HTTP onde o servidor Express expõe a API. | `3000` |
| `DATABASE_URL`| String de ligação ao PostgreSQL utilizada pelo ORM. Deve incluir host, porta, base de dados e credenciais. | `postgresql://user:password@localhost:5432/alojamentos_db` |
| `JWT_SECRET`  | Chave usada para assinar e validar tokens JWT de autenticação. Deve ser uma string forte e mantida secreta. | `uma-chave-secreta-segura` |

### Exemplo de ficheiro `.env` (backend)

> Não comites este ficheiro. Cada pessoa deve criar o seu `.env` localmente.

```env
PORT=3000
DATABASE_URL=postgresql://user:password@localhost:5432/alojamentos_db
JWT_SECRET=uma-chave-secreta-segura
```

## Frontend

| Variável  | Descrição | Onde definir | Exemplo |
| --------- | --------- | ------------ | ------- |
| `API_URL` | URL base da API consumida pela aplicação Angular. | `src/environments/environment.ts` e `src/environments/environment.prod.ts` | `http://localhost:3000/api` |

## Boas práticas

- Mantém o `.env` fora do controlo de versão. Não o comites nem o partilhes em canais públicos.
- Usa valores seguros e específicos por ambiente (dev, staging, prod).
- Revisa as variáveis antes de fazer deploy para garantir que apontam para serviços corretos.
