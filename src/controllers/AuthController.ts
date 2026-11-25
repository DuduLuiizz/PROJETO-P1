// Importar a biblioteca Express
import express, { Request, Response } from "express";
import { AuthService } from "../services/AuthService";
import { AppDataSource } from "../data-source";
import { User } from "../entity/Users";
import * as yup from "yup";
import crypto from "crypto";
import nodemailer from "nodemailer";

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

router.post("/recover-password", async (req: Request, res: Response) => {
    try {
        const data = req.body;
        const schema = yup.object().shape({
            urlRecoverPassword: yup.string().required("A URL é obrigatória!"),
            email: yup.string().email("E-mail inválido!").required("O campo e-mail é obrigatório!"),
        });
        await schema.validate(data, { abortEarly: false });

        const userRepository = AppDataSource.getRepository(User);
        const user = await userRepository.findOneBy({ email: data.email });
        if (!user) {
            res.status(404).json({ message: "Usuário não encontrado" });
            return;
        }

        user.recoverPassword = crypto.randomBytes(32).toString("hex");
        await userRepository.save(user);

        const transport = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: Number(process.env.EMAIL_PORT),
            secure: false,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const urlRecoverPassword = `${data.urlRecoverPassword}?email=${data.email}&key=${user.recoverPassword}`;
        const message_content = {
            from: process.env.EMAIL_FROM,
            to: data.email,
            subject: "Recuperar Senha",
            text: `Prezado(a) ${user.name}\n\nInformamos que a sua solicitação de alteração de senha foi recebida com sucesso.\n\nClique ou copie o link para criar uma nova senha em nosso sistema:\n${urlRecoverPassword}\n\nEsta mensagem foi enviada a você pela empresa ${process.env.APP}.\n\nVocê está recebendo porque está cadastrado no banco de dados da empresa ${process.env.APP}. Nenhum e-mail enviado pela empresa ${process.env.APP} tem arquivos anexados ou solicita o preenchimento de senhas e informações cadastrais.`,
            html: `Prezado(a) ${user.name}<br><br>Informamos que a sua solicitação de alteração de senha foi recebida com sucesso.<br><br>Clique no link para criar uma nova senha em nosso sistema:<br><a href='${urlRecoverPassword}'>${urlRecoverPassword}</a><br><br>Esta mensagem foi enviada a você pela empresa ${process.env.APP}.<br><br>Você está recebendo porque está cadastrado no banco de dados da empresa ${process.env.APP}. Nenhum e-mail enviado pela empresa ${process.env.APP} tem arquivos anexados ou solicita o preenchimento de senhas e informações cadastrais.`,
        };

        transport.sendMail(message_content, function (err) {
            if (err) {
                console.log("Erro ao enviar email:", err);
                res.status(200).json({ message: `E-mail não enviado, tente novamente ou contate ${process.env.EMAIL_ADM}` });
                return;
            } else {
                res.status(200).json({
                    message: "Email enviado! Verifique sua caixa de entrada!",
                    urlRecoverPassword,
                });
                return;
            }
        });
    } catch (error: any) {
        if (error instanceof yup.ValidationError) {
            res.status(400).json({ message: error.errors });
            return;
        }
        res.status(500).json({ message: "Erro ao editar a senha do usuário!" });
    }
});

router.post("/validate-recover-password", async (req: Request, res: Response) => {
    try {
        const data = req.body;
        const schema = yup.object().shape({
            recoverPassword: yup.string().required("A chave é obrigatória!"),
            email: yup.string().email("E-mail inválido!").required("O campo e-mail é obrigatório!"),
        });
        await schema.validate(data, { abortEarly: false });

        const userRepository = AppDataSource.getRepository(User);
        const user = await userRepository.findOneBy({ email: data.email, recoverPassword: data.recoverPassword });
        if (!user) {
            res.status(404).json({ message: "A chave recuperar senha é inválida" });
            return;
        }
        res.status(200).json({ message: "A chave recuperar senha é válida" });
        return;
    } catch (error: any) {
        if (error instanceof yup.ValidationError) {
            res.status(400).json({ message: error.errors });
            return;
        }
        res.status(500).json({ message: "A chave recuperar senha é inválida" });
    }
});

router.put("/update-password", async (req: Request, res: Response) => {
    try {
        const data = req.body;
        const schema = yup.object().shape({
            recoverPassword: yup.string().required("A chave é obrigatória!"),
            email: yup.string().email("E-mail inválido!").required("O campo e-mail é obrigatório!"),
            password: yup.string().required("O campo senha é obrigatório!").min(6, "O campo senha deve ter no mínimo 6 caracteres!"),
        });
        await schema.validate(data, { abortEarly: false });

        const userRepository = AppDataSource.getRepository(User);
        const user = await userRepository.findOneBy({ email: data.email, recoverPassword: data.recoverPassword });
        if (!user) {
            res.status(404).json({ message: "A chave recuperar senha é inválida" });
            return;
        }

        data.recoverPassword = null;
        userRepository.merge(user, data);
        await userRepository.save(user);
        res.status(200).json({ message: "Senha atualizada com sucesso!" });
        return;
    } catch (error: any) {
        if (error instanceof yup.ValidationError) {
            res.status(400).json({ message: error.errors });
            return;
        }
        res.status(500).json({ message: "Erro ao editar a senha do usuário!" });
    }
});

// Exportar a instrucao da rota
export default router;
