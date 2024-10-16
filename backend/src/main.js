const dotenv = require("dotenv");
const { MongoClient } = require("mongodb");
const { AWARDS_DATABASE_NAME, AWARDS_COLLECTION_NAME } = require("./constants");
const { awards } = require("../example-data/data");

dotenv.config();

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

async function main() {
  try {
    console.log("Connecting to MongoDB...");
    await client.connect();
    console.log("Conected successfully to MongoDB...");

    const database = client.db(AWARDS_DATABASE_NAME);
    const collection = database.collection(AWARDS_COLLECTION_NAME);

    const changeStream = collection.watch();
    changeStream.on("change", (change) => {
      console.log(`Received change event: ${JSON.stringify(change)}`);
    });

    // Seed the collection with example data
    await seed(collection);
  } catch (error) {
    console.error(error);
  }
}

async function seed(collection) {
  const awardsCount = await collection.estimatedDocumentCount();
  console.log(`There are ${awardsCount} awards in the collection.`);

  if (awardsCount > 0) {
    console.log("Skipping seeding because collection is not empty.");
    return;
  }

  console.log("Seeding collection with example data...");
  await collection.insertMany(awards);
}

module.exports = {
  main,
};
