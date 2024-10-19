const dotenv = require("dotenv");
const { MongoClient } = require("mongodb");

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

async function watchAlerts(onChange) {
  const client = new MongoClient(MONGODB_URI);
  await client.connect();
  const collection = client.db("demo-rabbitmq").collection("alerts");

  collection.watch().on("change", (change) => {
    // run callback
    onChange(change);
  });
}

module.exports = { watchAlerts };
