import express, { Request, Response } from "express";

const router = express.Router();

// Criar a rota GET principal
router.get("/test-connection", (req: Request, res: Response) => {
    res.status(200).json({ message: "Conexão com API realizada com sucesso!" });
});

// Exportar a instrução da rota
export default router;
