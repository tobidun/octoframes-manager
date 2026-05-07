import "dotenv/config";
import "reflect-metadata";
import { DataSource } from "typeorm";
import { Client } from "./entities/Client";
import { Project } from "./entities/Project";
import { Task } from "./entities/Task";
import { Invoice } from "./entities/Invoice";
import { InvoiceItem } from "./entities/InvoiceItem";

export const AppDataSource = new DataSource({
  type: "postgres",
  url: process.env.DATABASE_URL,
  host: !process.env.DATABASE_URL ? (process.env.DB_HOST || "localhost") : undefined,
  port: !process.env.DATABASE_URL ? parseInt(process.env.DB_PORT || "5432") : undefined,
  username: !process.env.DATABASE_URL ? (process.env.DB_USER || "postgres") : undefined,
  password: !process.env.DATABASE_URL ? (process.env.DB_PASSWORD || "postgres") : undefined,
  database: !process.env.DATABASE_URL ? (process.env.DB_NAME || "octoframes_studio") : undefined,
  synchronize: false,
  logging: process.env.NODE_ENV === "development",
  entities: [Client, Project, Task, Invoice, InvoiceItem],
  migrations: [__dirname + "/migrations/*.ts"],
  subscribers: [],
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : (process.env.DATABASE_URL?.includes("neon") ? { rejectUnauthorized: false } : false),
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
