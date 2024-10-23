import amqp from "amqplib";
import { Alert } from "@/types";
import constants from "@/constants/constants";
import timestamp from "./timestamp";

const { RABBITMQ_URL } = process.env;
const { RABBITMQ_EXCHANGE, ALERTS_SENT_QUEUE } = constants;

export async function connect(url: string, exchange: string, queue: string) {
  try {
    const connection = await amqp.connect(url);
    const channel = await connection.createChannel();
    channel.assertExchange(exchange, "direct", {
      durable: true,
    });
    await channel.assertQueue(queue, { durable: true });
    channel.bindQueue(queue, exchange, queue);
    return channel;
  } catch (error) {
    console.error(error);
  }
}

export async function publishToAlertsSentQueue(alert: Partial<Alert>) {
  const channel = await connect(
    RABBITMQ_URL as string,
    RABBITMQ_EXCHANGE,
    ALERTS_SENT_QUEUE
  );

  if (!channel) {
    throw new Error("RabbitMQ channel not found");
  }

  channel.publish(
    RABBITMQ_EXCHANGE,
    ALERTS_SENT_QUEUE,
    Buffer.from(
      JSON.stringify({
        ...alert,
        alert_sent_at: timestamp(),
      })
    )
  );
}
