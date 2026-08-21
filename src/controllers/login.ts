// Importar a biblioteca Express
import express, { Request, Response } from "express";

// Importar o arquivo com as credenciais do banco de dados
import { AppDataSource } from "../data-source";

// Criar a Aplicacao Express
const router = express.Router();

// Inicializar a conexao com BD
AppDataSource.initialize().then(() => {
    console.log("Conexao com o banco de dados realizada com sucesso!");
}).catch((error) => {
    console.error("Erro na conexao com o banco de dados:", error);
});

// Criar a rota GET principal
router.get("/", (req: Request, res: Response) => {
    res.send("Bem-Vindo Pessoal! tela de login da rota");
});

// Exportar a instrucao da rota
export default router;
