const dotenv = require("dotenv");
const { MongoClient } = require("mongodb");
const { AWARDS_DATABASE_NAME, AWARDS_COLLECTION_NAME } = require("./constants");
const { seed } = require("./seed");
const { streamAwards } = require("./stream-awards");

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

    // watch for changes in the collection
    streamAwards(collection);

    // Seed the collection with example data
    await seed(collection);
  } catch (error) {
    console.error(error);
  }
}

module.exports = {
  main,
};
