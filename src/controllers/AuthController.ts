// Importar a biblioteca Express
import express, { Request, Response } from "express";
import { AuthService } from "../services/AuthService";

// Criar a Aplicacao Express
const router = express.Router();

// Criar a rota GET principal
router.get("/", (req: Request, res: Response) => {
    res.send("Bem-Vindo Pessoal! tela de login da rota");
});

router.post("/", async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400).json({ message: "Email e senha são obrigatórios!" });
            return;
        }

        const authService = new AuthService();
        const userData = await authService.login(email, password);
        res.status(200).json({ message: "Login Realizado com Sucesso", user: userData });
        return;
    } catch (error: any) {
        res.status(401).json({ message: error.message || "Erro ao realizar o login!" });
        return;
    }
});

// Exportar a instrucao da rota
export default router;
