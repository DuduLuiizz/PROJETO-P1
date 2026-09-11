# API Node.js - CRUD de Situações

Projeto desenvolvido nas aulas de Desenvolvimento Web - Back End. A API possui o CRUD de situações com Node.js, Express, TypeORM e MySQL.

## Requisitos

- Node.js 22 ou superior
- npm
- MySQL Server 8.x na porta 3306
- Postman (opcional, para testar as rotas)

## Instalação

```bash
npm install
```

## Configuração do banco

Crie a base utilizada nas aulas:

```sql
CREATE DATABASE nodeapi CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

Copie `.env.example` para `.env` e informe as credenciais do MySQL:

```env
DB_DIALECT="mysql"
DB_HOST="localhost"
DB_PORT=3306
DB_DATABASE="nodeapi"
DB_USERNAME="root"
DB_PASSWORD="sua_senha"
PORT=8080
```

## Migrations

Para executar as migrations:

```bash
npm run migration:run
```

Para desfazer a última migration:

```bash
npm run migration:revert
```

## Execução

Compile e inicie a API:

```bash
npm run build
npm start
```

Durante o desenvolvimento:

```bash
npm run start:watch
```

A API ficará disponível em `http://localhost:8080`.

## Rotas de situações

- `POST /situations` - cadastrar
- `GET /situations` - listar
- `GET /situations/:id` - visualizar
- `PUT /situations/:id` - atualizar
- `DELETE /situations/:id` - excluir
