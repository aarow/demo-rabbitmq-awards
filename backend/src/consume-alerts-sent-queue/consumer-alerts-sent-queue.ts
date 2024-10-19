import dotenv from "dotenv";
import { connect } from "../utils/rabbitmq";
import constants from "../constants/constants";
import updateAlertsCollection from "./update-alerts-collection";

dotenv.config();

export async function consumeAlertsSentQueue() {
  const channel = await connect(
    process.env.RABBITMQ_URL as string,
    constants.RABBITMQ_EXCHANGE,
    constants.ALERTS_SENT_QUEUE
  );

  if (!channel) {
    throw new Error("RabbitMQ channel not found");
  }

  channel.consume(constants.ALERTS_SENT_QUEUE, (msg) => {
    if (!msg) {
      console.log("No message received");
      return;
    }

    console.log(
      "consumeAlertsSentQueue Received message: ",
      msg.content.toString()
    );

    updateAlertsCollection(JSON.parse(msg.content.toString()));

    channel.ack(msg);
  });
}