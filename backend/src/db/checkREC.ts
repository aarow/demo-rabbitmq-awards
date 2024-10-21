import dotenv from "dotenv";
import constants from "../constants/constants";
import { AlertType } from "../types/Alert";
import { type Award } from "../types/Award";
import sendMessage from "../utils/send-message";
import isAlertSent from "./is-alert-sent";
import insertAlertCollection from "./insert-alert-collection";
import timestamp from "../utils/timestamp";

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

  if (await isAlertSent(award, AlertType.REC)) {
    return;
  }

  // TODO: Deactivate document from Alerts collection if REC is submitted (is equal to true?)

  insertAlertCollection(award, AlertType.REC);

  // send message to RabbitMQ
  sendMessage({
    queueName: constants.ALERTS_QUEUE,
    data: {
      award_number: award.award_number,
      alert_type: AlertType.REC,
      name: process.env.ADMIN_NAME as string,
      email: process.env.ADMIN_EMAIL as string,
      message: `Award is missing REC submission: ${award.award_number}`,
      created_at: timestamp(),
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
