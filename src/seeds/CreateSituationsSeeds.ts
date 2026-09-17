import { DataSource } from "typeorm";
import { Situation } from "../entity/Situations";

export default class CreateSituationsSeeds {
    public async run(dataSource: DataSource): Promise<void> {
        console.log("Iniciando o seed para a tabela 'situations'...");

        const situationRepository = dataSource.getRepository(Situation);

        const existingCount = await situationRepository.count();

        if (existingCount > 0) {
            console.log("A tabela 'situations' já possui dados. Nenhuma alteração foi realizada!");
            return;
        }

        const situations = [
            { nameSituation: "Ativo" },
            { nameSituation: "Inativo" },
            { nameSituation: "Pendente" },
        ];

        await situationRepository.save(situations);

        console.log("Seed concluído com sucesso: situações cadastradas!");
    }
}
