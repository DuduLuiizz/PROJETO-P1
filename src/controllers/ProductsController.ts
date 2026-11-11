import express, { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Product } from "../entity/Products";
import { ProductCategory } from "../entity/ProductCategories";
import { ProductSituation } from "../entity/ProductSituations";
import { PaginationService } from "../services/PaginationService";
import { Not } from "typeorm";
import * as yup from "yup";
import slugify from "slugify";

const router = express.Router();

router.get("/products", async (req: Request, res: Response) => {
    try {
        const repository = AppDataSource.getRepository(Product);
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const result = await PaginationService.paginate(repository, page, limit, { id: "DESC" }, { productSituation: true, productCategory: true });
        res.status(200).json(result);
        return;
    } catch (error) {
        res.status(500).json({ message: "Erro ao listar produto!" });
        return;
    }
});

router.get("/products/:id", async (req: Request, res: Response) => {
    try {
        const repository = AppDataSource.getRepository(Product);
        const product = await repository.findOne({ where: { id: parseInt(req.params.id as string) }, relations: { productSituation: true, productCategory: true } });
        if (!product) {
            res.status(404).json({ message: "Produto não encontrado!" });
            return;
        }
        res.status(200).json(product);
        return;
    } catch (error) {
        res.status(500).json({ message: "Erro ao listar produto!" });
        return;
    }
});

router.post("/products", async (req: Request, res: Response) => {
    try {
        const { name, productSituationId, productCategoryId } = req.body;
        const schema = yup.object().shape({
            name: yup.string().required("O campo nome é obrigatório!").min(3, "O campo nome deve ter no mínimo 3 caracteres!").max(255, "O campo nome deve ter no máximo 255 caracteres!"),
        });
        await schema.validate(req.body, { abortEarly: false });
        const slug = slugify(req.body.slug || name, { lower: true, strict: true });
        const productSituation = await AppDataSource.getRepository(ProductSituation).findOneBy({ id: Number(productSituationId) });
        if (!productSituation) {
            res.status(404).json({ message: "Situação de produto não encontrada!" });
            return;
        }
        const productCategory = await AppDataSource.getRepository(ProductCategory).findOneBy({ id: Number(productCategoryId) });
        if (!productCategory) {
            res.status(404).json({ message: "Categoria de produto não encontrada!" });
            return;
        }
        const repository = AppDataSource.getRepository(Product);
        const existingProduct = await repository.findOne({ where: { slug } });
        if (existingProduct) {
            res.status(400).json({ message: "Já existe um produto cadastrado com esse slug!" });
            return;
        }
        const newProduct = repository.create({ name, slug, productSituation, productCategory });
        await repository.save(newProduct);
        res.status(201).json({ message: "Produto cadastrado com sucesso!", product: newProduct });
    } catch (error) {
        if (error instanceof yup.ValidationError) {
            res.status(400).json({ message: error.errors });
            return;
        }
        res.status(500).json({ message: "Erro ao cadastrar produto!" });
    }
});

router.put("/products/:id", async (req: Request, res: Response) => {
    try {
        const repository = AppDataSource.getRepository(Product);
        const product = await repository.findOneBy({ id: parseInt(req.params.id as string) });
        if (!product) {
            res.status(404).json({ message: "Produto não encontrado!" });
            return;
        }
        const { name, productSituationId, productCategoryId } = req.body;
        const schema = yup.object().shape({
            name: yup.string().required("O campo nome é obrigatório!").min(3, "O campo nome deve ter no mínimo 3 caracteres!").max(255, "O campo nome deve ter no máximo 255 caracteres!"),
        });
        await schema.validate(req.body, { abortEarly: false });
        const slug = slugify(req.body.slug || name, { lower: true, strict: true });
        const existingProduct = await repository.findOne({ where: { slug, id: Not(product.id) } });
        if (existingProduct) {
            res.status(400).json({ message: "Já existe um produto cadastrado com esse slug!" });
            return;
        }
        repository.merge(product, { name, slug });
        if (productSituationId) {
            const situation = await AppDataSource.getRepository(ProductSituation).findOneBy({ id: Number(productSituationId) });
            if (!situation) {
                res.status(404).json({ message: "Situação de produto não encontrada!" });
                return;
            }
            product.productSituation = situation;
        }
        if (productCategoryId) {
            const category = await AppDataSource.getRepository(ProductCategory).findOneBy({ id: Number(productCategoryId) });
            if (!category) {
                res.status(404).json({ message: "Categoria de produto não encontrada!" });
                return;
            }
            product.productCategory = category;
        }
        const updateProduct = await repository.save(product);
        res.status(200).json({ message: "Produto atualizado com sucesso!", product: updateProduct });
        return;
    } catch (error) {
        if (error instanceof yup.ValidationError) {
            res.status(400).json({ message: error.errors });
            return;
        }
        res.status(500).json({ message: "Erro ao atualizar produto!" });
        return;
    }
});

router.delete("/products/:id", async (req: Request, res: Response) => {
    try {
        const repository = AppDataSource.getRepository(Product);
        const product = await repository.findOneBy({ id: parseInt(req.params.id as string) });
        if (!product) {
            res.status(404).json({ message: "Produto não encontrado!" });
            return;
        }
        await repository.remove(product);
        res.status(200).json({ message: "Produto foi removido com sucesso!" });
        return;
    } catch (error) {
        res.status(500).json({ message: "Erro ao remover produto!" });
        return;
    }
});

export default router;
