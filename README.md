# API Node.js - Projeto das aulas

Projeto reproduzido a partir das três aulas do Prof. Adriano Baião: configuração da API Node.js e migrations (partes 1 e 2).

## Requisitos

- Node.js 22 ou superior
- npm
- MySQL Server 8.x na porta 3306

## Instalação

```bash
npm install
```

## Configuração do banco

Crie a base usada nas aulas:

```sql
CREATE DATABASE nodeapi CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

Copie `.env.example` para `.env` e informe usuário e senha do MySQL. Os valores esperados são:

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

Execute as migrations:

```bash
npm run migration:run
```

Esse script compila o TypeScript e executa o comando mostrado na aula, `npx typeorm migration:run -d ./dist/data-source.js`.

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

Durante o desenvolvimento, também é possível usar:

```bash
npm run start:watch
```

A rota criada nas aulas estará em `http://localhost:8080/`.
