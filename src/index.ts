// Importar a biblioteca Express
import express from "express";

// Criar a Aplicacao Express
const app = express();

// Incluir as Controllers
import login from "./controllers/login";

// Criar as rotas
app.use("/", login);

// Iniciar o servidor na porta definida
const port = Number(process.env.PORT) || 8080;
app.listen(port, () => {
    console.log(`Servidor iniciado na porta ${port}: http://localhost:${port}`);
});
