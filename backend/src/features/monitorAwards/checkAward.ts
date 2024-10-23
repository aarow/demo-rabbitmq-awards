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

const { ADMIN_NAME, ADMIN_EMAIL } = process.env;

const alertsMap = {
  [AlertType.REC]: {
    condition: (award: Award) => !!award.award_number && award.rec_submitted,
    alertMessageData: (award: Award) => ({
      award_number: award.award_number,
      alert_type: AlertType.REC,
      name: ADMIN_NAME as string,
      email: ADMIN_EMAIL as string,
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
      name: ADMIN_NAME as string,
      email: ADMIN_EMAIL as string,
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
export default async function checkAward(award: Award, alert_type: AlertType) {
  console.log("checkAward:\n", { alert_type, award });
  // if REC has already been submitted, return
  if (alertsMap[alert_type].condition(award)) {
    console.log("condition: ", alertsMap[alert_type].condition(award));
    await setAlertToInactive(award, alert_type);
    return;
  }

  const alert = await getAlert({
    award_number: award.award_number,
    alert_type,
  });

  console.log("alert: ", alert);

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
  console.log("send message to rabbitmq");
  await sendMessage({
    queueName: constants.ALERTS_QUEUE,
    data: alertsMap[alert_type].alertMessageData(award),
  });
  console.log("sent message to rabbitmq");
}
