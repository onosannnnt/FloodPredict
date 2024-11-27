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
  host: host,
  port: dbPort,
  username: dbUser,
  password: dbPassword,
  database: dbName,
  synchronize: true,
  logging: false,
  entities: ["src/models/**/*.ts"],
  // migrations: ['src/migration/**/*.ts'],
  subscribers: [],
});
