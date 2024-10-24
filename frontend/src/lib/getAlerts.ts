import { Alert } from "@/types";
import connect from "./db/connect";

export const getAlerts = async () => {
  const dbClient = await connect();
  console.log("dbClient.database", dbClient.database);

  const results = await dbClient.query(
    `SELECT * FROM public.alerts LIMIT 1000;`
  );

  return JSON.parse(JSON.stringify(results.rows)) as Alert[]; // convert ObjectId to string
};
