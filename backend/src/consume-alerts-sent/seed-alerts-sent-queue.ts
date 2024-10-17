import dotenv from "dotenv";
import { Buffer } from "node:buffer";
import { connect } from "../utils/rabbitmq";
import constants from "../constants/constants";

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
    const timestamp = new Date().toLocaleString();

    channel.publish(
      constants.RABBITMQ_EXCHANGE,
      constants.ALERTS_SENT_QUEUE,
      Buffer.from(`Test Alert Sent at ${timestamp}`)
    );

    console.log("sent message to rabbitmq", timestamp);
  }, 10000);
}
