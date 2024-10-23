import constants from "@/constants/constants";
import { updateAlertSentAt } from "@/postgresql/alerts-table";
import { connect } from "@/utils/rabbitmq";
import dotenv from "dotenv";

dotenv.config();

const { RABBITMQ_EXCHANGE, ALERTS_SENT_QUEUE } = constants;

export async function monitorAlertsSentQueue() {
  const channel = await connect(
    process.env.RABBITMQ_URL as string,
    RABBITMQ_EXCHANGE,
    ALERTS_SENT_QUEUE
  );

  if (!channel) {
    throw new Error("RabbitMQ channel not found");
  }

  channel.consume(ALERTS_SENT_QUEUE, (msg) => {
    if (!msg) {
      console.log("No message received");
      return;
    }

    console.log(
      "consumeAlertsSentQueue Received message: ",
      msg.content.toString()
    );

    const msgObject = JSON.parse(msg.content.toString());
    console.log("alerts-sent queue message: ", msgObject);
    updateAlertSentAt(msgObject.award_number, msgObject.alert_type);

    channel.ack(msg);
  });
}
