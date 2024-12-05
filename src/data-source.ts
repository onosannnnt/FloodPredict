import "reflect-metadata";
import { DataSource } from "typeorm";
import {
  databaseUrl,
  dbName,
  dbPassword,
  dbPort,
  dbUser,
  host,
} from "./config/database";

export const AppDataSource = new DataSource({
  type: "postgres",
  url: databaseUrl,
  synchronize: false,
  logging: false,
  entities: ["src/entity/**/*.ts"],
  migrations: [],
  subscribers: [],
});
