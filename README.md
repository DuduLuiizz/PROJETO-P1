# API Node.js - Projeto P1

API desenvolvida nas aulas de Desenvolvimento Web - Back End com Node.js, Express, TypeORM e MySQL. O projeto possui CRUDs de situações, usuários, categorias de produtos, situações de produtos e produtos.

## Requisitos

- Node.js 22 ou superior
- `@types/node` 22.15.2
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

Executar as seeds para cadastrar registro de teste nas tabelas no banco de dados.

```bash
node dist/run-seeds.js
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

As listagens aceitam paginação com `?page=1&limit=10`.

## Rotas de situações

- `POST /situations` - cadastrar
- `GET /situations` - listar
- `GET /situations/:id` - visualizar
- `PUT /situations/:id` - atualizar
- `DELETE /situations/:id` - excluir

## Outras rotas

Os recursos abaixo possuem rotas POST, GET, GET por ID, PUT e DELETE:

- `/users`
- `/product-categories`
- `/product-situations`
- `/products`

Usuários são relacionados a situações. Produtos são relacionados a uma categoria e a uma situação de produto.

## Postman

Os arquivos para importação estão no diretório `postman`. Importe a coleção e o environment, selecione o ambiente **API NodeJS - Local** e execute as requisições organizadas por recurso.
