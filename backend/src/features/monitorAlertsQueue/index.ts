import dotenv from "dotenv";
import constants from "@/constants/constants";
import { connect, publishToAlertsSentQueue } from "@/utils/rabbitmq";
import { sendMessageToEmail } from "./sendMessageToEmail";

dotenv.config();

const { RABBITMQ_EXCHANGE, ALERTS_QUEUE } = constants;

export async function monitorAlertsQueue() {
  const channel = await connect(
    process.env.RABBITMQ_URL as string,
    RABBITMQ_EXCHANGE,
    ALERTS_QUEUE
  );

  if (!channel) {
    throw new Error("RabbitMQ channel not found");
  }

  channel.consume(ALERTS_QUEUE, (msg) => {
    if (!msg) {
      console.log("No message received");
      return;
    }

    console.log(
      "consumeAlertsSentQueue Received message: ",
      msg.content.toString()
    );

    const msgObject = JSON.parse(msg.content.toString());
    console.log("alerts queue message: ", msgObject);

    sendMessageToEmail(msgObject);
    publishToAlertsSentQueue(msgObject);

    channel.ack(msg);
  });
}
