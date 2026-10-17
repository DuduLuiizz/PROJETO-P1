import express, { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { ProductCategory } from "../entity/ProductCategories";
import { PaginationService } from "../services/PaginationService";

const router = express.Router();

router.get("/product-categories", async (req: Request, res: Response) => {
    try {
        const repository = AppDataSource.getRepository(ProductCategory);
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const result = await PaginationService.paginate(repository, page, limit, { id: "DESC" });
        res.status(200).json(result);
        return;
    } catch (error) {
        res.status(500).json({ message: "Erro ao listar categoria de produto!" });
        return;
    }
});

router.get("/product-categories/:id", async (req: Request, res: Response) => {
    try {
        const repository = AppDataSource.getRepository(ProductCategory);
        const category = await repository.findOneBy({ id: parseInt(req.params.id as string) });
        if (!category) {
            res.status(404).json({ message: "Categoria de produto não encontrada!" });
            return;
        }
        res.status(200).json(category);
        return;
    } catch (error) {
        res.status(500).json({ message: "Erro ao listar categoria de produto!" });
        return;
    }
});

router.post("/product-categories", async (req: Request, res: Response) => {
    try {
        const repository = AppDataSource.getRepository(ProductCategory);
        const newCategory = repository.create(req.body);
        await repository.save(newCategory);
        res.status(201).json({ message: "Categoria de produto cadastrada com sucesso!", productCategory: newCategory });
    } catch (error) {
        res.status(500).json({ message: "Erro ao cadastrar categoria de produto!" });
    }
});

router.put("/product-categories/:id", async (req: Request, res: Response) => {
    try {
        const repository = AppDataSource.getRepository(ProductCategory);
        const category = await repository.findOneBy({ id: parseInt(req.params.id as string) });
        if (!category) {
            res.status(404).json({ message: "Categoria de produto não encontrada!" });
            return;
        }
        repository.merge(category, req.body);
        const updateCategory = await repository.save(category);
        res.status(200).json({ message: "Categoria de produto atualizada com sucesso!", productCategory: updateCategory });
        return;
    } catch (error) {
        res.status(500).json({ message: "Erro ao atualizar categoria de produto!" });
        return;
    }
});

router.delete("/product-categories/:id", async (req: Request, res: Response) => {
    try {
        const repository = AppDataSource.getRepository(ProductCategory);
        const category = await repository.findOneBy({ id: parseInt(req.params.id as string) });
        if (!category) {
            res.status(404).json({ message: "Categoria de produto não encontrada!" });
            return;
        }
        await repository.remove(category);
        res.status(200).json({ message: "Categoria de produto foi removida com sucesso!" });
        return;
    } catch (error) {
        res.status(500).json({ message: "Erro ao remover categoria de produto!" });
        return;
    }
});

export default router;
