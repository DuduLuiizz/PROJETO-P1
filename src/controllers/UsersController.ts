import express, { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { User } from "../entity/Users";
import { Situation } from "../entity/Situations";
import { PaginationService } from "../services/PaginationService";

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
        const { name, email, situationId } = req.body;
        const situationRepository = AppDataSource.getRepository(Situation);
        const situation = await situationRepository.findOneBy({ id: Number(situationId) });
        if (!situation) {
            res.status(404).json({ message: "Situação não encontrada!" });
            return;
        }
        const userRepository = AppDataSource.getRepository(User);
        const newUser = userRepository.create({ name, email, situation });
        await userRepository.save(newUser);
        res.status(201).json({ message: "Usuário cadastrado com sucesso!", user: newUser });
    } catch (error) {
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
        const { name, email, situationId } = req.body;
        userRepository.merge(user, { name, email });
        if (situationId) {
            const situation = await AppDataSource.getRepository(Situation).findOneBy({ id: Number(situationId) });
            if (!situation) {
                res.status(404).json({ message: "Situação não encontrada!" });
                return;
            }
            user.situation = situation;
        }
        const updateUser = await userRepository.save(user);
        res.status(200).json({ message: "Usuário atualizado com sucesso!", user: updateUser });
        return;
    } catch (error) {
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
        res.status(200).json({ message: "Usuário foi removido com sucesso!" });
        return;
    } catch (error) {
        res.status(500).json({ message: "Erro ao remover usuário!" });
        return;
    }
});

export default router;
