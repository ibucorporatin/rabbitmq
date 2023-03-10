const amqp = require("amqplib");
const { v4: uuidv4 } = require('uuid');
// this example for normal queue without using exchange
//  it diredctly send queue
// const message = process.argv.splice(2).join(" ") || "hello world";

// async function createChannel() {
//   try {
//     const connection = await amqp.connect("amqp://localhost");

//     const channel = await connection.createChannel();
//     const result = await channel.assertQueue("task", { durable: true });
//     channel.sendToQueue("task", Buffer.from(message), { persistent: true });
//     console.log("task sent succesfullt", message);

//     console.log("Channel created successfully");
//     setTimeout(() => {
//       connection.close();
//       process.exit(0);
//     }, 500);
//   } catch (error) {
//     console.error("Error creating channel:", error);
//   }
// }

// fanout method
// const message = process.argv.splice(2).join(" ") || "hello world";
// const exchangeName = "logs";
// async function createChannel() {
//   try {
//     const connection = await amqp.connect("amqp://localhost");

//     const channel = await connection.createChannel();
//     const result = await channel.assertExchange(exchangeName, "fanout", {
//       durable: false,
//     });
//     channel.publish(exchangeName, "", Buffer.from(message));
//     console.log("task sent succesfullt", message);

//     console.log("Channel created successfully");
//     setTimeout(() => {
//       connection.close();
//       process.exit(0);
//     }, 500);
//   } catch (error) {
//     console.error("Error creating channel:", error);
//   }
// }

// direct exchange
// const args = process.argv.slice(2);
// const message = args[1] || "hello world";
// const logType = args[0];
// const exchangeName = "direct_logs";

// async function createChannel() {
//   try {
//     const connection = await amqp.connect("amqp://localhost");

//     const channel = await connection.createChannel();
//     const result = await channel.assertExchange(exchangeName, "direct", {
//       durable: false,
//     });
//     channel.publish(exchangeName, logType, Buffer.from(message));
//     console.log("task sent succesfullt", message);

//     console.log("Channel created successfully");
//     setTimeout(() => {
//       connection.close();
//       process.exit(0);
//     }, 500);
//   } catch (error) {
//     console.error("Error creating channel:", error);
//   }
// }

// topic exchange

// const args = process.argv.slice(2);
// const message = args[1] || "hello world";
// const logType = args[0];
// const exchangeName = "topic_logs";

// async function createChannel() {
//   try {
//     const connection = await amqp.connect("amqp://localhost");

//     const channel = await connection.createChannel();
//     const result = await channel.assertExchange(exchangeName, "topic", {
//       durable: false,
//     });
//     channel.publish(exchangeName, logType, Buffer.from(message));
//     console.log("msg sent succesfullt", message);

//     console.log("Channel created successfully");
//     setTimeout(() => {
//       connection.close();
//       process.exit(0);
//     }, 500);
//   } catch (error) {
//     console.error("Error creating channel:", error);
//   }
// }

// //  example for rpc-remote procedural protocall

const args = process.argv.slice(2);
const queueName="rpc_queue"

if (args.length === 0) {
  console.log("please enter the number");
  process.exit(1);
}
const number=parseInt(args[0]); 
const id=uuidv4()

async function createChannel() {

  try {
    // Connect to RabbitMQ server
    const connection = await amqp.connect("amqp://localhost");

    // Create a channel
    const channel = await connection.createChannel();
    

    const q = await channel.assertQueue("", { exclusive: true });
console.log("requesting fib",number)
  channel.sendToQueue(queueName,Buffer.from(number.toString()),{
    replyTo:q.queue,
   correlationId:id
  })
    channel.consume(
      q.queue,
      (message) => {
     const fibNum=parseInt(message.content.toString())
     if(message.properties.correlationId==id){
          console.log(`the fibNumber of ${number} is ${fibNum}`)
          setTimeout(()=>{
            channel.close();
            process.close()
          },500)
     }
      },
      { noAck: true }
    );

    console.log("Channel created successfully");
  } catch (error) {
    console.error("Error creating channel:", error);
  }
}
// createChannel();
