import { DataSource } from "typeorm";
import { Product } from "../entity/Products";
import { ProductCategory } from "../entity/ProductCategories";
import { ProductSituation } from "../entity/ProductSituations";

export default class CreateProductsSeeds {
    public async run(dataSource: DataSource): Promise<void> {
        console.log("Iniciando o seed para a tabela 'products'...");
        const repository = dataSource.getRepository(Product);
        if (await repository.count() > 0) {
            console.log("A tabela 'products' já possui dados. Nenhuma alteração foi realizada!");
            return;
        }
        const categoryRepository = dataSource.getRepository(ProductCategory);
        const situationRepository = dataSource.getRepository(ProductSituation);
        const computerCategory = await categoryRepository.findOneBy({ name: "Informática" });
        const officeCategory = await categoryRepository.findOneBy({ name: "Escritório" });
        const available = await situationRepository.findOneBy({ name: "Disponível" });
        const unavailable = await situationRepository.findOneBy({ name: "Indisponível" });
        if (!computerCategory || !officeCategory || !available || !unavailable) {
            throw new Error("Categorias ou situações necessárias para cadastrar os produtos não foram encontradas.");
        }
        await repository.save([
            repository.create({ name: "Notebook", productCategory: computerCategory, productSituation: available }),
            repository.create({ name: "Cadeira", productCategory: officeCategory, productSituation: unavailable }),
        ]);
        console.log("Seed concluído com sucesso: produtos cadastrados!");
    }
}
