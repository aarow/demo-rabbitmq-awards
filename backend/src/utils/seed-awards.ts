import { Collection, Document } from "mongodb";
import awards from "../example-data/data";
import getCollection from "../db/connect";
import constants from "../constants/constants";

export default async function seedAwards() {
  const collection = await getCollection(constants.AWARDS_COLLECTION_NAME);
  if (!collection) {
    throw new Error("Awards collection not found");
  }

  const awardsCount = await collection.estimatedDocumentCount();
  console.log(`There are ${awardsCount} awards in the collection.`);

  if (awardsCount > 0) {
    console.log("Skipping seeding because collection is not empty.");
    return;
  }

  console.log("Seeding collection with example data...");
  await collection.insertMany(awards);
}
