import {
  consumeAlertsSentQueue,
  seedAlertsSentQueue,
} from "./consume-alerts-sent-queue";
import streamAwards from "./db/stream-awards";
import { emailProcessor } from "./email-processor-example";
import seedAwards from "./utils/seed-awards";

export default async function main() {
  try {
    // Seed the collection with example data
    seedAwards();

    // watch for changes in the collection
    streamAwards();

    // seedAlertsSentQueue();
    consumeAlertsSentQueue();

    emailProcessor();
  } catch (error) {
    console.error(error);
  }
}
