import amqp from "amqplib";
import dotenv from "dotenv";
import { Buffer } from "node:buffer";
import constants from "../constants/constants";

dotenv.config();

const rabbitmqUrl = process.env.RABBITMQ_URL;
const exchangeName = constants.RABBITMQ_EXCHANGE;
const queue = "alerts";

async function connect(url: string | undefined) {
  if (!url) {
    throw new Error("RabbitMQ URL not found");
  }
  const connection = await amqp.connect(url);
  const channel = await connection.createChannel();
  return channel;
}

export default async function sendMessage({
  name = "",
  email = "",
  message = "",
  timestamp = "",
}) {
  console.log("notifying rabbitmq");

  const channel = await connect(rabbitmqUrl);
  console.log("connected to rabbitmq");

  await channel.assertExchange(exchangeName, "fanout", { durable: false });

  channel.publish(
    exchangeName,
    queue,
    Buffer.from(JSON.stringify({ name, email, message, timestamp }))
  );

  console.log("sent message to rabbitmq");

  await channel.close();
}
