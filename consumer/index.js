// const express = require('express');
const amqp = require("amqplib");

// const app = express();
// const PORT = 3000;

// console.log("ssss");
// Define an async function that creates a connection to RabbitMQ and creates a channel
async function createChannel() {
  try {
    // Connect to RabbitMQ server
    const connection = await amqp.connect("amqp://localhost");

    // Create a channel
    const channel = await connection.createChannel();
    const result = await channel.assertQueue("task", { durable: true });
    // channel.sendToQueue("jobs", Buffer.from(JSON.stringify(message)));
    // onsole.log("job sent succesfullt", message.number);
    channel.consume("task", (message) => {
      // console.log(message.content.toString().split("").length);
      const sec = message.content.toString().split(".").length - 1;
      console.log("task recived", message.content.toString());
      setTimeout(() => {
        console.log("process finished");
      }, sec * 1000);
    });

    console.log("Channel created successfully");
  } catch (error) {
    console.error("Error creating channel:", error);
  }
}

createChannel();
