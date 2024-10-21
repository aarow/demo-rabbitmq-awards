import { MongoClient } from "mongodb";
import { Alert } from "@/types";

const MONGODB_URI = process.env.MONGODB_URI as string;

export const getAlerts = async () => {
  const client = new MongoClient(MONGODB_URI);
  await client.connect();
  const collection = client.db("demo-rabbitmq").collection("alerts");
  const data = await collection.find<Alert>({}).toArray();
  return JSON.parse(JSON.stringify(data)) as Alert[]; // convert ObjectId to string
};
