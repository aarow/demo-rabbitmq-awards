import { AlertType } from "@/types/Alert";
import { type Award } from "@/types/Award";
import sendMessage from "@/utils/send-message";
import timestamp from "@/utils/timestamp";
import {
  getAlert,
  setAlertToInactive,
  insertAlert,
} from "@/postgresql/alerts-table";
import constants from "@/constants/constants";
import { alertsMap } from "./alertsMap";

export default async function processAward(
  award: Award,
  alert_type: AlertType
) {
  // test if award requires an alert by alert type
  // if false, set the associated alert to inactive, and return
  if (alertsMap[alert_type].isAlertRequired(award) === false) {
    await setAlertToInactive(award, alert_type);
    return;
  }

  const alert = await getAlert({
    award_number: award.award_number,
    alert_type,
  });

  // if alert has already been sent, return
  if (alert.length > 0 && alert[0].alert_sent_at) {
    console.log("alert_sent_at: ", alert[0].alert_sent_at);
    return;
  }

  // add to alert to alerts table
  console.log("insert new alert");
  const newAlert = await insertAlert({ award, alert_type });
  console.log("newAlert:\n", newAlert);

  // send message to RabbitMQ
  console.log("sending alert message to rabbitmq");
  await sendMessage({
    queueName: constants.ALERTS_QUEUE,
    data: alertsMap[alert_type].alertMessageData(award),
  });
  console.log("sent alert message to rabbitmq");
}
