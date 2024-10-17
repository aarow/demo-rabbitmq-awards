import streamAwards from "./db/stream-awards";
import seedAwards from "./utils/seed-awards";

export default async function main() {
  try {
    // Seed the collection with example data
    await seedAwards();

    // watch for changes in the collection
    streamAwards();
  } catch (error) {
    console.error(error);
  }
}
