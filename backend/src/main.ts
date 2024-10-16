import seed from "./utils/seed";
import streamAwards from "./db/stream-awards";
import getCollection from "./db/connect";

export default async function main() {
  try {
    const collection = await getCollection();

    if (!collection) {
      throw new Error("Collection not found");
    }

    // watch for changes in the collection
    streamAwards(collection);

    // Seed the collection with example data
    seed(collection);
  } catch (error) {
    console.error(error);
  }
}
