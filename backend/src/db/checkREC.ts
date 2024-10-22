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

/**
 * Check if an award has a REC submission. If not, insert an alert into the
 * alerts collection and send a message to RabbitMQ.
 * @param {Award} award - the award to check
 */
export default async function checkREC(award: Award) {
  // if REC has already been submitted, return
  if (!!award.award_number && award.rec_submitted) {
    setAlertToInactive(award);
    return;
  }

  const alert = await getAlert({
    award_number: award.award_number,
    alert_type: AlertType.REC,
  });

  // if alert has already been sent, return
  if (alert && alert.alert_sent_at) {
    return;
  }

  // add to alerts collection
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
