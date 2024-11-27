import "reflect-metadata";
import { DataSource } from "typeorm";
import { databaseUrl } from "./config/database";

export const AppDataSource = new DataSource({
  type: "postgres",
  url: databaseUrl,
  synchronize: true,
  logging: false,
  entities: ["src/entity/**/*.ts"],
  migrations: [],
  subscribers: [],
});
