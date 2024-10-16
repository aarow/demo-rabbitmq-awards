import dotenv from "dotenv";
import { MongoClient } from "mongodb";
import constants from "../constants/constants";

dotenv.config();

export default async function getCollection() {
  try {
    const uri = process.env.MONGODB_URI as string;
    const client = new MongoClient(uri);

    console.log("Connecting to MongoDB...");
    await client.connect();
    console.log("Conected successfully to MongoDB...");

    const database = client.db(constants.AWARDS_DATABASE_NAME);
    const collection = database.collection(constants.AWARDS_COLLECTION_NAME);

    return collection;
  } catch (error) {
    console.error(error);
  }
}
