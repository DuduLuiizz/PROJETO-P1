import express, { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { ProductSituation } from "../entity/ProductSituations";
import { PaginationService } from "../services/PaginationService";

const router = express.Router();

router.get("/product-situations", async (req: Request, res: Response) => {
    try {
        const repository = AppDataSource.getRepository(ProductSituation);
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const result = await PaginationService.paginate(repository, page, limit, { id: "DESC" });
        res.status(200).json(result);
        return;
    } catch (error) {
        res.status(500).json({ message: "Erro ao listar situação de produto!" });
        return;
    }
});

router.get("/product-situations/:id", async (req: Request, res: Response) => {
    try {
        const repository = AppDataSource.getRepository(ProductSituation);
        const situation = await repository.findOneBy({ id: parseInt(req.params.id as string) });
        if (!situation) {
            res.status(404).json({ message: "Situação de produto não encontrada!" });
            return;
        }
        res.status(200).json(situation);
        return;
    } catch (error) {
        res.status(500).json({ message: "Erro ao listar situação de produto!" });
        return;
    }
});

router.post("/product-situations", async (req: Request, res: Response) => {
    try {
        const repository = AppDataSource.getRepository(ProductSituation);
        const newSituation = repository.create(req.body);
        await repository.save(newSituation);
        res.status(201).json({ message: "Situação de produto cadastrada com sucesso!", productSituation: newSituation });
    } catch (error) {
        res.status(500).json({ message: "Erro ao cadastrar situação de produto!" });
    }
});

router.put("/product-situations/:id", async (req: Request, res: Response) => {
    try {
        const repository = AppDataSource.getRepository(ProductSituation);
        const situation = await repository.findOneBy({ id: parseInt(req.params.id as string) });
        if (!situation) {
            res.status(404).json({ message: "Situação de produto não encontrada!" });
            return;
        }
        repository.merge(situation, req.body);
        const updateSituation = await repository.save(situation);
        res.status(200).json({ message: "Situação de produto atualizada com sucesso!", productSituation: updateSituation });
        return;
    } catch (error) {
        res.status(500).json({ message: "Erro ao atualizar situação de produto!" });
        return;
    }
});

router.delete("/product-situations/:id", async (req: Request, res: Response) => {
    try {
        const repository = AppDataSource.getRepository(ProductSituation);
        const situation = await repository.findOneBy({ id: parseInt(req.params.id as string) });
        if (!situation) {
            res.status(404).json({ message: "Situação de produto não encontrada!" });
            return;
        }
        await repository.remove(situation);
        res.status(200).json({ message: "Situação de produto foi removida com sucesso!" });
        return;
    } catch (error) {
        res.status(500).json({ message: "Erro ao remover situação de produto!" });
        return;
    }
});

export default router;
