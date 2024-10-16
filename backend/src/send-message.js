const amqp = require("amqplib");
const dotenv = require("dotenv");
const { Buffer } = require("node:buffer");
const { RABBITMQ_EXCHANGE } = require("./constants");

dotenv.config();

const rabbitmqUrl = process.env.RABBITMQ_URL;
const exchangeName = RABBITMQ_EXCHANGE;
const queue = "";

async function connect(url) {
  if (!url) {
    throw new Error("RabbitMQ URL not found");
  }
  const connection = await amqp.connect(url);
  const channel = await connection.createChannel();
  return channel;
}

async function sendMessage({
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
    Buffer.from(JSON.stringify({ name, email, message }))
  );

  console.log("sent message to rabbitmq");

  await channel.close();
}

module.exports = {
  sendMessage,
};
