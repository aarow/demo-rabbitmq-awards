import amqp from "amqplib";

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
