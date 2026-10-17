import { DataSource } from "typeorm";
import { ProductSituation } from "../entity/ProductSituations";

export default class CreateProductSituationsSeeds {
    public async run(dataSource: DataSource): Promise<void> {
        console.log("Iniciando o seed para a tabela 'product_situations'...");
        const repository = dataSource.getRepository(ProductSituation);
        if (await repository.count() > 0) {
            console.log("A tabela 'product_situations' já possui dados. Nenhuma alteração foi realizada!");
            return;
        }
        await repository.save([{ name: "Disponível" }, { name: "Indisponível" }]);
        console.log("Seed concluído com sucesso: situações de produtos cadastradas!");
    }
}
