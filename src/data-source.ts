// Importar a biblioteca Typeorm
import "reflect-metadata";
import { DataSource } from "typeorm";

// Importar variaveis de ambiente
import dotenv from "dotenv";
dotenv.config();

const dialect = process.env.DB_DIALECT ?? "mysql";

export const AppDataSource = new DataSource({
    type: dialect as "mysql",
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT) || 3306,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    synchronize: false,
    logging: true,
    entities: [__dirname + "/entity/*.{js,ts}"],
    migrations: [__dirname + "/migration/*.{js,ts}"],
    subscribers: [],
});
