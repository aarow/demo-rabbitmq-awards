const dotenv = require("dotenv");
const { MongoClient } = require("mongodb");

dotenv.config();

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

async function main() {
  try {
    await client.connect();
    const database = client.db("demo-rabbitmq");
    const collection = database.collection("awards");

    const awardsCount = await collection.estimatedDocumentCount();
    console.log(`There are ${awardsCount} awards in the collection.`);

    if (awardsCount > 0) {
      console.log("Deleting all awards...");
      await collection.deleteMany({});
    }

    const award = {
      id: "1",
      createdAt: "2021-01-01",
      updatedAt: "2021-01-01",
      award_number: "12345",
      acuro_checklist_submitted: true,
      ohro_checklist_submitted: true,
      rec_submitted: true,
      award_health_color_code: "BLUE",
    };

    const result = await collection.insertOne(award);
    console.log(
      `New award created with the following id: ${result.insertedId} ${result.acknowledged}`
    );

    const awards = await collection.find({}).toArray();
    console.log(awards);
  } finally {
    await client.close();
  }
}

module.exports = {
  main,
};
