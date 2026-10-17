import { DataSource } from "typeorm";
import { ProductCategory } from "../entity/ProductCategories";

export default class CreateProductCategoriesSeeds {
    public async run(dataSource: DataSource): Promise<void> {
        console.log("Iniciando o seed para a tabela 'product_categories'...");
        const repository = dataSource.getRepository(ProductCategory);
        if (await repository.count() > 0) {
            console.log("A tabela 'product_categories' já possui dados. Nenhuma alteração foi realizada!");
            return;
        }
        await repository.save([{ name: "Informática" }, { name: "Escritório" }]);
        console.log("Seed concluído com sucesso: categorias de produtos cadastradas!");
    }
}
