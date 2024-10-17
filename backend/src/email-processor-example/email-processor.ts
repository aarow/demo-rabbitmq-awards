import consumeAlertsQueue from "./consume-alerts-queue";
import publishAlertsSentQueue from "./publish-alerts-sent-queue";

export async function emailProcessor() {
  consumeAlertsQueue((alert) => {
    publishAlertsSentQueue(alert);
    // TODO: send email with nodemailer
  });
}
