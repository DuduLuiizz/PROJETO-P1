// Importar a biblioteca Express
import express, { Request, Response } from "express";

// Importar o arquivo com as credenciais do banco de dados
import { AppDataSource } from "../data-source";

// Importar a entidade Situation
import { Situation } from "../entity/Situations";

// Criar a Aplicacao Express
const router = express.Router();

// Criar a LISTA
router.get("/situations", async (req: Request, res: Response) => {
    try {
        const situationRepository = AppDataSource.getRepository(Situation);

        const situations = await situationRepository.find();

        res.status(200).json(situations);
        return;
    } catch (error) {
        res.status(500).json({
            message: "Erro ao listar situação!",
        });
        return;
    }
});

// Criar a visualizacao do item cadastrado em situacao
router.get("/situations/:id", async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const situationRepository = AppDataSource.getRepository(Situation);

        const situation = await situationRepository.findOneBy({ id: parseInt(id as string) });

        if (!situation) {
            res.status(404).json({
                message: "Situação não encontrada!",
            });
            return;
        }

        res.status(200).json(situation);
        return;
    } catch (error) {
        res.status(500).json({
            message: "Erro ao listar situação!",
        });
        return;
    }
});

// Criar a rota cadastrar situacao
router.post("/situations", async (req: Request, res: Response) => {
    try {
        const data = req.body;

        const situationRepository = AppDataSource.getRepository(Situation);

        const newSituation = situationRepository.create(data);

        await situationRepository.save(newSituation);

        res.status(201).json({
            message: "Situação cadastrada com sucesso!",
            situation: newSituation,
        });
    } catch (error) {
        res.status(500).json({
            message: "Erro ao cadastrar situação!",
        });
    }
});

// Criar a rota para editar situacao
router.put("/situations/:id", async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const data = req.body;

        const situationRepository = AppDataSource.getRepository(Situation);

        const situation = await situationRepository.findOneBy({ id: parseInt(id as string) });

        if (!situation) {
            res.status(404).json({
                message: "Situação não encontrada!",
            });
            return;
        }

        // Atualiza os dados
        situationRepository.merge(situation, data);

        // Salvar as alteracoes de dados
        const updateSituation = await situationRepository.save(situation);

        res.status(200).json({
            message: "Situação atualizada com sucesso!",
            situation: updateSituation,
        });
        return;
    } catch (error) {
        res.status(500).json({
            message: "Erro ao listar situação!",
        });
        return;
    }
});

// Criar a rota para excluir situacao
router.delete("/situations/:id", async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const situationRepository = AppDataSource.getRepository(Situation);

        const situation = await situationRepository.findOneBy({ id: parseInt(id as string) });

        if (!situation) {
            res.status(404).json({
                message: "Situação não encontrada!",
            });
            return;
        }

        // Remover os dados no banco de dados
        await situationRepository.remove(situation);

        res.status(200).json({
            message: "Situação foi removida com sucesso!",
        });
        return;
    } catch (error) {
        res.status(500).json({
            message: "Erro ao remover situação!",
        });
        return;
    }
});

// Exportar a instrucao da rota
export default router;
