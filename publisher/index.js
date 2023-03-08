const amqp = require("amqplib");

const message = process.argv.splice(2).join(" ") || "hello world";

async function createChannel() {
  try {
    const connection = await amqp.connect("amqp://localhost");

    const channel = await connection.createChannel();
    const result = await channel.assertQueue("task", { durable: true });
    channel.sendToQueue("task", Buffer.from(message), { persistent: true });
    console.log("task sent succesfullt", message);

    console.log("Channel created successfully");
    setTimeout(() => {
      connection.close();
      process.exit(0);
    }, 500);
  } catch (error) {
    console.error("Error creating channel:", error);
  }
}

createChannel();
