import { AppDataSource } from "./data-source";
import CreateSituationsSeeds from "./seeds/CreateSituationsSeeds";
import CreateProductCategoriesSeeds from "./seeds/CreateProductCategoriesSeeds";
import CreateProductSituationsSeeds from "./seeds/CreateProductSituationsSeeds";
import CreateUsersSeeds from "./seeds/CreateUsersSeeds";
import CreateProductsSeeds from "./seeds/CreateProductsSeeds";

const runSeeds = async () => {
    console.log("Conectando ao banco de dados...");

    await AppDataSource.initialize();

    console.log("Banco de dados conectado!");

    try {
        // Cria a instância da classes de seed
        const situationsSeeds = new CreateSituationsSeeds();
        const productCategoriesSeeds = new CreateProductCategoriesSeeds();
        const productSituationsSeeds = new CreateProductSituationsSeeds();
        const usersSeeds = new CreateUsersSeeds();
        const productsSeeds = new CreateProductsSeeds();

        // Executa as Seeds
        await situationsSeeds.run(AppDataSource);
        await productCategoriesSeeds.run(AppDataSource);
        await productSituationsSeeds.run(AppDataSource);
        await usersSeeds.run(AppDataSource);
        await productsSeeds.run(AppDataSource);
    } catch (error) {
        console.log("Erro ao executar o seed:", error);
    } finally {
        await AppDataSource.destroy();
        console.log("Conexão com o banco de dados encerrada.");
    }
};

runSeeds();
