import express, { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { User } from "../entity/Users";
import { Situation } from "../entity/Situations";
import { PaginationService } from "../services/PaginationService";
import { Not } from "typeorm";
import * as yup from "yup";

const router = express.Router();

router.get("/users", async (req: Request, res: Response) => {
    try {
        const userRepository = AppDataSource.getRepository(User);
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const result = await PaginationService.paginate(userRepository, page, limit, { id: "DESC" }, { situation: true });
        res.status(200).json(result);
        return;
    } catch (error) {
        res.status(500).json({ message: "Erro ao listar usuário!" });
        return;
    }
});

router.get("/users/:id", async (req: Request, res: Response) => {
    try {
        const userRepository = AppDataSource.getRepository(User);
        const user = await userRepository.findOne({ where: { id: parseInt(req.params.id as string) }, relations: { situation: true } });
        if (!user) {
            res.status(404).json({ message: "Usuário não encontrado!" });
            return;
        }
        res.status(200).json(user);
        return;
    } catch (error) {
        res.status(500).json({ message: "Erro ao listar usuário!" });
        return;
    }
});

router.post("/users", async (req: Request, res: Response) => {
    try {
        const data = req.body;
        const schema = yup.object().shape({
            name: yup.string().required("O campo nome é obrigatório!").min(3, "O campo nome deve ter no mínimo 3 caracteres!"),
            email: yup.string().email("E-mail inválido!").required("O campo e-mail é obrigatório!"),
            password: yup.string().required("O campo senha é obrigatório!").min(6, "O campo senha deve ter no mínimo 6 caracteres!"),
            situation: yup.number().required("O campo situação é obrigatório!"),
        });
        const situationId = data.situation ?? data.situationId;
        await schema.validate({ ...data, situation: situationId }, { abortEarly: false });

        const situationRepository = AppDataSource.getRepository(Situation);
        const situation = await situationRepository.findOneBy({ id: Number(situationId) });
        if (!situation) {
            res.status(404).json({ message: "Situação não encontrada!" });
            return;
        }
        const userRepository = AppDataSource.getRepository(User);
        const existingUser = await userRepository.findOne({ where: { email: data.email } });
        if (existingUser) {
            res.status(400).json({ message: "Já existe um usuário cadastrado com esse e-mail!" });
            return;
        }
        const newUser = userRepository.create({ name: data.name, email: data.email, password: data.password, situation });
        await userRepository.save(newUser);
        res.status(201).json({ message: "Usuário cadastrado com sucesso!", user: newUser });
    } catch (error) {
        if (error instanceof yup.ValidationError) {
            res.status(400).json({ message: error.errors });
            return;
        }
        res.status(500).json({ message: "Erro ao cadastrar usuário!" });
    }
});

router.put("/users/:id", async (req: Request, res: Response) => {
    try {
        const userRepository = AppDataSource.getRepository(User);
        const user = await userRepository.findOneBy({ id: parseInt(req.params.id as string) });
        if (!user) {
            res.status(404).json({ message: "Usuário não encontrado!" });
            return;
        }
        const data = req.body;
        const schema = yup.object().shape({
            name: yup.string().required("O campo nome é obrigatório!").min(3, "O campo nome deve ter no mínimo 3 caracteres!"),
            email: yup.string().email("E-mail inválido!").required("O campo e-mail é obrigatório!"),
            situation: yup.number().required("O campo situação é obrigatório!"),
        });
        const situationId = data.situation ?? data.situationId;
        await schema.validate({ ...data, situation: situationId }, { abortEarly: false });

        const existingUser = await userRepository.findOne({ where: { email: data.email, id: Not(user.id) } });
        if (existingUser) {
            res.status(400).json({ message: "Já existe um usuário cadastrado com esse e-mail!" });
            return;
        }
        const situation = await AppDataSource.getRepository(Situation).findOneBy({ id: Number(situationId) });
        if (!situation) {
            res.status(404).json({ message: "Situação não encontrada!" });
            return;
        }
        userRepository.merge(user, { name: data.name, email: data.email, situation });
        const updateUser = await userRepository.save(user);
        res.status(200).json({ message: "Usuário atualizado com sucesso!", user: updateUser });
        return;
    } catch (error) {
        if (error instanceof yup.ValidationError) {
            res.status(400).json({ message: error.errors });
            return;
        }
        res.status(500).json({ message: "Erro ao atualizar usuário!" });
        return;
    }
});

router.delete("/users/:id", async (req: Request, res: Response) => {
    try {
        const userRepository = AppDataSource.getRepository(User);
        const user = await userRepository.findOneBy({ id: parseInt(req.params.id as string) });
        if (!user) {
            res.status(404).json({ message: "Usuário não encontrado!" });
            return;
        }
        await userRepository.remove(user);
        res.status(200).json({ message: "Usuário apagado com sucesso!" });
        return;
    } catch (error) {
        res.status(500).json({ message: "Erro ao apagar o usuário!" });
        return;
    }
});

export default router;
