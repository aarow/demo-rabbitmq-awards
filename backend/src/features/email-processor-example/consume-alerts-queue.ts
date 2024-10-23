import dotenv from "dotenv";
import { connect } from "../utils/rabbitmq";
import constants from "../constants/constants";

dotenv.config();

export default async function consumeAlertsQueue(
  onConsume: (alert: object) => void
) {
  let alert: object | null = null;

  const channel = await connect(
    process.env.RABBITMQ_URL as string,
    constants.RABBITMQ_EXCHANGE,
    constants.ALERTS_QUEUE
  );

  if (!channel) {
    throw new Error("RabbitMQ channel not found");
  }

  channel.consume(constants.ALERTS_QUEUE, (msg) => {
    if (!msg) {
      console.log("No message received");
      return;
    }

    console.log(
      "consumeAlertsQueue Received message: ",
      msg.content.toString()
    );

    onConsume(JSON.parse(msg.content.toString())); // callback function from args

    channel.ack(msg);
  });
}
