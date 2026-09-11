// Importar a biblioteca Express
import express from "express";

// Importar o arquivo com as credenciais do banco de dados
import { AppDataSource } from "./data-source";

// Criar a Aplicacao Express
const app = express();

// Incluir as Controllers
import AuthController from "./controllers/AuthController";
import SituationsController from "./controllers/SituationsController";

// Inicializar a conexao com BD
AppDataSource.initialize().then(() => {
    console.log("Conexao com o banco de dados realizada com sucesso!");
}).catch((error) => {
    console.error("Erro na conexao com o banco de dados:", error);
});

// Permitir receber os dados no formato de objeto no corpo da requisicao
app.use(express.json());

// Criar as rotas
app.use("/", AuthController);
app.use("/", SituationsController);

// Iniciar o servidor na porta definida
const port = Number(process.env.PORT) || 8080;
app.listen(port, () => {
    console.log(`Servidor iniciado na porta ${port}: http://localhost:${port}`);
});
