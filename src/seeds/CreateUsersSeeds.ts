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
        await repository.save(repository.create({ name: "Usuário Teste", email: "usuario@teste.com", situation }));
        console.log("Seed concluído com sucesso: usuários cadastrados!");
    }
}
