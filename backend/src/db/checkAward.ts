import dotenv from "dotenv";
import constants from "../constants/constants";
import { AlertType } from "../types/Alert";
import { type Award } from "../types/Award";
import sendMessage from "../utils/send-message";
import insertAlertCollection from "./insertAlertCollection";
import timestamp from "../utils/timestamp";
import getAlert from "../utils/getAlert";
import { setAlertToInactive } from "./setAlertToInactive";

dotenv.config();

const alertsMap = {
  [AlertType.REC]: {
    condition: (award: Award) => !!award.award_number && !award.rec_submitted,
    alertMessageData: (award: Award) => ({
      award_number: award.award_number,
      alert_type: AlertType.REC,
      name: process.env.ADMIN_NAME as string,
      email: process.env.ADMIN_EMAIL as string,
      message: `Award is missing REC submission: ${award.award_number}`,
      created_at: timestamp(),
    }),
  },
  [AlertType.CHECKLIST]: {
    condition: (award: Award) =>
      !!award.award_number &&
      award.acuro_checklist_submitted &&
      award.ohro_checklist_submitted,
    alertMessageData: (award: Award) => ({
      award_number: award.award_number,
      alert_type: AlertType.CHECKLIST,
      name: process.env.ADMIN_NAME as string,
      email: process.env.ADMIN_EMAIL as string,
      message: `Award is missing ACURO and OHRO checklists: ${award.award_number}`,
      created_at: timestamp(),
    }),
  },
};

/**
 * Check if an award has a REC submission. If not, insert an alert into the
 * alerts collection and send a message to RabbitMQ.
 * @param {Award} award - the award to check
 */
export default async function checkAward(award: Award, alertType: AlertType) {
  // if REC has already been submitted, return
  if (alertsMap[alertType].condition(award)) {
    setAlertToInactive(award);
    return;
  }

  const alert = await getAlert({
    award_number: award.award_number,
    alert_type: alertType,
  });

  // if alert has already been sent, return
  if (alert && alert.alert_sent_at) {
    return;
  }

  // add to alerts collection
  insertAlertCollection(award, alertType);

  // send message to RabbitMQ
  sendMessage({
    queueName: constants.ALERTS_QUEUE,
    data: alertsMap[alertType].alertMessageData(award),
  });
}
