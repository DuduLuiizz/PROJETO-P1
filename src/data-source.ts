// Importar a biblioteca Typeorm
import "reflect-metadata";
import { DataSource } from "typeorm";

// Importar variaveis de ambiente
import dotenv from "dotenv";
dotenv.config();

// Importar as entidades
import { User } from "./entity/Users";
import { Situation } from "./entity/Situations";

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
    entities: [User, Situation],
    migrations: [__dirname + "/migration/*.{js,ts}"],
    subscribers: [],
});
