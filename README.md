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

Validação de formulário:

```bash
npm i yup
```

Permitir requisição externa:

```bash
npm i cors
npm install --save-dev @types/cors
```

Gerar o slug dos produtos:

```bash
npm install slugify
```

Criptografar senhas e gerar token no login, conforme as Aulas 16 e 17:

```bash
npm install --save bcryptjs
npm install --save-dev @types/bcryptjs
npm install jsonwebtoken
npm i --save-dev @types/jsonwebtoken
```

Enviar a mensagem de recuperação de senha, conforme a Aula 20:

```bash
npm install nodemailer
npm install --save-dev @types/nodemailer
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
JWT_SECRET="sua_chave_secreta"
APP="Nome da aplicação"
EMAIL_ADM="administrador@exemplo.com"
EMAIL_FROM="suporte@exemplo.com"
EMAIL_HOST="sandbox.smtp.mailtrap.io"
EMAIL_PORT=2525
EMAIL_USER="usuario_do_smtp"
EMAIL_PASS="senha_do_smtp"
```

Para testar o envio como na Aula 20, crie uma caixa de testes no Mailtrap e use as credenciais SMTP dessa caixa apenas no `.env` local. Sem uma caixa configurada, a rota informa que o e-mail não foi enviado.

## Migrations

Criar as migrations de alteração das tabelas, como na Aula 15:

```bash
npx typeorm migration:create src/migration/AddSlugToProducts
npx typeorm migration:create src/migration/AddPasswordToUsers
```

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
O cadastro de usuários exige senha com pelo menos seis caracteres. O slug dos produtos é único.

Na Aula 16, as senhas de novos usuários e dos dois usuários criados pelo seed são salvas com bcrypt. Para alterar apenas a senha, use `PUT /users-password/:id` com `{"password":"123456"}`. A Aula 17 adiciona `POST /` com e-mail e senha; a resposta contém os dados do usuário e um token JWT válido por sete dias.

Nas Aulas 18 a 21, `GET /users` e `PUT /users-password/:id` exigem o cabeçalho `Authorization: Bearer <token>`. A recuperação de senha usa:

- `POST /recover-password` com `{"urlRecoverPassword":"http://localhost:3000/recover-password","email":"baiao@baiao.com.br"}` para gerar a chave e enviar o e-mail;
- `POST /validate-recover-password` com `email` e `recoverPassword` para conferir a chave;
- `PUT /update-password` com `email`, `recoverPassword` e `password` para trocar a senha e invalidar a chave.

Execute `npm run migration:run` antes de usar a recuperação de senha. A migration adiciona a coluna `recoverPassword` à tabela `users` sem apagar os registros atuais.

## Postman

Os arquivos para importação estão no diretório `postman`. Importe a coleção e o environment, selecione o ambiente **API NodeJS - Local** e execute as requisições organizadas por recurso.
