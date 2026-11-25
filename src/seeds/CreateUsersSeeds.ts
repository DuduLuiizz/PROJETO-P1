import { DataSource } from "typeorm";
import { User } from "../entity/Users";
import { Situation } from "../entity/Situations";

export default class CreateUsersSeeds {
    public async run(dataSource: DataSource): Promise<void> {
        console.log("Iniciando o seed para a tabela 'users'...");
        const repository = dataSource.getRepository(User);
        if (await repository.count() > 0) {
            console.log("A tabela 'users' já possui dados. Nenhuma alteração foi realizada!");
            return;
        }
        const situation = await dataSource.getRepository(Situation).findOneBy({ nameSituation: "Ativo" });
        if (!situation) {
            throw new Error("Situação 'Ativo' não encontrada para cadastrar o usuário.");
        }
        const users = repository.create([
            { id: 1, name: "Adriano Baião", email: "baiao@baiao.com.br", password: "123456", situation },
            { id: 2, name: "Aurora", email: "aurora@baiao.com.br", password: "123456", situation },
        ]);
        await repository.save(users);
        console.log("Seed concluído com sucesso: usuários cadastrados!");
    }
}
