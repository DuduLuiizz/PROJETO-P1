// Importar a biblioteca Express
import express, { Request, Response } from "express";

// Criar a Aplicacao Express
const router = express.Router();

// Criar a rota GET principal
router.get("/", (req: Request, res: Response) => {
    res.send("Bem-Vindo Pessoal! tela de login da rota");
});

// Exportar a instrucao da rota
export default router;
