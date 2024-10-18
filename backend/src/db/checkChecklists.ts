import dotenv from "dotenv";
import constants from "../constants/constants";
import { AlertType } from "../types/Alert";
import { type Award } from "../types/Award";
import sendMessage from "../utils/send-message";
import insertAlertCollection from "./insert-alert-collection";
import isAlertSent from "./is-alert-sent";

dotenv.config();

export default async function checkChecklists(award: Award) {
  if (isChecklistSubmitted(award)) {
    return;
  }

  if (await isAlertSent(award, AlertType.CHECKLIST)) {
    return;
  }

  insertAlertCollection(award, AlertType.CHECKLIST);

  // send message to RabbitMQ
  sendMessage({
    queueName: constants.ALERTS_QUEUE,
    data: {
      award_number: award.award_number,
      alert_type: AlertType.CHECKLIST,
      name: process.env.ADMIN_NAME as string,
      email: process.env.ADMIN_EMAIL as string,
      message: `Award is missing ACURO and OHRO checklists: ${award.award_number}`,
      timestamp: new Date().toISOString(),
    },
  });
}

export function isChecklistSubmitted(award: Award) {
  return (
    !!award.award_number &&
    award.acuro_checklist_submitted &&
    award.ohro_checklist_submitted
  );
}
