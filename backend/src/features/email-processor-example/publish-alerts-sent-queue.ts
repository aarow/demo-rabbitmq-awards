import dotenv from "dotenv";
import { connect } from "../utils/rabbitmq";
import constants from "../constants/constants";
import { Alert } from "../types/Alert";
import timestamp from "../utils/timestamp";

dotenv.config();

export default async function publishAlertsSentQueue(alert: Partial<Alert>) {
  const channel = await connect(
    process.env.RABBITMQ_URL as string,
    constants.RABBITMQ_EXCHANGE,
    constants.ALERTS_SENT_QUEUE
  );

  if (!channel) {
    throw new Error("RabbitMQ channel not found");
  }

  channel.publish(
    constants.RABBITMQ_EXCHANGE,
    constants.ALERTS_SENT_QUEUE,
    Buffer.from(
      JSON.stringify({
        ...alert,
        alert_sent_at: timestamp(),
      })
    )
  );
}
