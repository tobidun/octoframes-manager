import "reflect-metadata";
import { DataSource } from "typeorm";
import { Client } from "./entities/Client";
import { Project } from "./entities/Project";
import { Task } from "./entities/Task";
import { Invoice } from "./entities/Invoice";
import { InvoiceItem } from "./entities/InvoiceItem";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "5432"),
  username: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "postgres",
  database: process.env.DB_NAME || "octoframes_studio",
  synchronize: false,
  logging: process.env.NODE_ENV === "development",
  entities: [Client, Project, Task, Invoice, InvoiceItem],
  migrations: ["src/db/migrations/*.ts"],
  subscribers: [],
});

let isInitialized = false;

export const getDataSource = async () => {
  if (!isInitialized) {
    console.log("Initializing Data Source...");
    try {
      await AppDataSource.initialize();
      isInitialized = true;
      console.log("Data Source has been initialized!");
    } catch (err) {
      console.error("Error during Data Source initialization:", err);
      throw err;
    }
  }
  return AppDataSource;
};
