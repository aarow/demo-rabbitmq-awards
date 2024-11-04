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
  log_no: string,
  alert_type: AlertType
) {
  // test if award requires an alert by alert type
  // if false, set the associated alert to inactive, and return
  if ((await alertsMap[alert_type].isAlertRequired(log_no)) === false) {
    await setAlertToInactive(log_no, alert_type);
    return;
  }

  const result = await getAlert({
    award_number: log_no,
    alert_type,
  });

  // if alert has already been sent, return
  if (result.length > 0 && result[0].alert_sent_at !== null) {
    console.log("alert_sent_at: ", result[0].alert_sent_at);
    return;
  }

  // add to alert to alerts table
  console.log("insert new alert");
  const newAlert = await insertAlert({ log_no, alert_type });
  console.log("newAlert:\n", newAlert);

  // send message to RabbitMQ
  console.log("sending alert message to rabbitmq");
  await sendMessage({
    queueName: constants.ALERTS_QUEUE,
    data: alertsMap[alert_type].alertMessageData(log_no),
  });
  console.log("sent alert message to rabbitmq");
}
