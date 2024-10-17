import dotenv from "dotenv";
import constants from "../constants/constants";
import { Alert, AlertType } from "../types/Alert";
import { type Award } from "../types/Award";
import sendMessage from "../utils/send-message";
import getCollection from "./connect";

dotenv.config();

/**
 * Check if an award has a REC submission. If not, insert an alert into the
 * alerts collection and send a message to RabbitMQ.
 * @param {Award} award - the award to check
 */
export default async function checkREC(award: Award) {
  if (isRECSubmitted(award)) {
    return;
  }

  if (await isAlertSent(award)) {
    return;
  }

  // insert into alerts collection
  const collection = await getCollection(constants.ALERTS_COLLECTION_NAME);
  if (!collection) {
    throw new Error("Alerts collection not found");
  }
  await collection.insertOne({
    award_number: award.award_number,
    alert_type: AlertType.REC,
    alert_sent: false,
  });

  // send message to RabbitMQ
  sendMessage({
    queueName: constants.ALERTS_QUEUE,
    data: {
      award_number: award.award_number,
      alert_type: AlertType.REC,
      name: process.env.ADMIN_NAME as string,
      email: process.env.ADMIN_EMAIL as string,
      message: `Award is missing REC submission: ${award.award_number}`,
      timestamp: new Date().toISOString(),
    },
  });
}

/**
 * Check if an award has REC submitted.
 *
 * @param {Award} award - The award to check for REC submission.
 */
export function isRECSubmitted(award: Award) {
  return !!award.award_number && award.rec_submitted;
}

/**
 * Checks if an alert has already been sent for a given award.
 * Queries the alerts collection to determine if an alert of type REC
 * has been sent for the specified award number.
 *
 * @param {Award} award - The award for which to check alert status.
 * @returns {Promise<boolean>} - A promise that resolves to true if the alert
 * has been sent, false otherwise.
 * @throws {Error} - Throws an error if the alerts collection is not found.
 */
export async function isAlertSent(award: Award) {
  const collection = await getCollection(constants.ALERTS_COLLECTION_NAME);

  if (!collection) {
    throw new Error("Alerts collection not found");
  }

  const alertSent = await collection.findOne<Alert>({
    award_number: award.award_number,
    alert_type: AlertType.REC,
  });

  if (!alertSent) {
    return false;
  }

  return alertSent.alert_sent;
}
