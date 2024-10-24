import { Client } from "pg";
import dotenv from "dotenv";

dotenv.config();

const { PG_HOST, PG_PORT, PG_DATABASE, PG_USER, PG_PASSWORD } = process.env;

export default async function connect() {
  // PGQL connection
  const pgClient = new Client({
    host: PG_HOST,
    port: Number(PG_PORT),
    database: PG_DATABASE,
    user: PG_USER,
    password: PG_PASSWORD,
  });

  await pgClient.connect();

  return pgClient;
}
