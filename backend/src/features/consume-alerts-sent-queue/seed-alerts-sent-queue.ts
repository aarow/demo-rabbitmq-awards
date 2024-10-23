import dotenv from "dotenv";
import { Buffer } from "node:buffer";
import { connect } from "../utils/rabbitmq";
import constants from "../constants/constants";
import timestamp from "../utils/timestamp";

dotenv.config();

export async function seedAlertsSentQueue() {
  const channel = await connect(
    process.env.RABBITMQ_URL as string,
    constants.RABBITMQ_EXCHANGE,
    constants.ALERTS_SENT_QUEUE
  );

  if (!channel) {
    throw new Error("RabbitMQ channel not found");
  }

  setInterval(async () => {
    const now = timestamp();

    channel.publish(
      constants.RABBITMQ_EXCHANGE,
      constants.ALERTS_SENT_QUEUE,
      Buffer.from(`Test Alert Sent at ${now}`)
    );

    console.log("sent message to rabbitmq", now);
  }, 10000);
}
