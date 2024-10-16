import { Collection, Document } from "mongodb";
import awards from "../example-data/data";

export default async function seed(collection: Collection<Document>) {
  const awardsCount = await collection.estimatedDocumentCount();
  console.log(`There are ${awardsCount} awards in the collection.`);

  if (awardsCount > 0) {
    console.log("Skipping seeding because collection is not empty.");
    return;
  }

  console.log("Seeding collection with example data...");
  await collection.insertMany(awards);
}
