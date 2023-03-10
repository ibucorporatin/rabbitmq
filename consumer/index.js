const amqp = require("amqplib");


// async function createChannel() {
//   try {
//     // Connect to RabbitMQ server
//     const connection = await amqp.connect("amqp://localhost");

//     // Create a channel
//     const channel = await connection.createChannel();
//     const result = await channel.assertQueue("task", { durable: true });
//     channel.prefetch(1);
//
//     channel.consume(
//       "task",
//       (message) => {
//         // console.log(message.content.toString().split("").length);
//         const sec = message.content.toString().split(".").length - 1;
//         console.log("task recived", message.content.toString());
//         setTimeout(() => {
//           console.log("process finished");
//           channel.ack(message);
//         }, sec * 1000);
//       },
//       { noAck: false }
//     );

//     console.log("Channel created successfully");
//   } catch (error) {
//     console.error("Error creating channel:", error);
//   }
// }

//fanout exchange
// const exchangeName = "logs";
// async function createChannel() {
//   try {
//     // Connect to RabbitMQ server
//     const connection = await amqp.connect("amqp://localhost");

//     // Create a channel
//     const channel = await connection.createChannel();
//     const result = await channel.assertExchange(exchangeName, "fanout", {
//       durable: false,
//     });

//     const q = await channel.assertQueue("", { exclusive: true });
//     console.log("waitong for messafe in queuq", q.queue);
//     channel.bindQueue(q.queue, exchangeName, "");

//     channel.consume(
//       q.queue,
//       (message) => {
//         if (message.content) {
//           console.log("the message is", message.content.toString());
//         }
//       },
//       { noAck: true }
//     );

//     console.log("Channel created successfully");
//   } catch (error) {
//     console.error("Error creating channel:", error);
//   }
// }

//  direct exchange
// const args = process.argv.slice(2);
// const exchangeName = "direct_logs";

// if (args.length === 0) {
//   console.log("please feed this [error] [warning] [info]");
//   process.exit(1);
// }
// async function createChannel() {
//   try {
//     // Connect to RabbitMQ server
//     const connection = await amqp.connect("amqp://localhost");

//     // Create a channel
//     const channel = await connection.createChannel();
//     const result = await channel.assertExchange(exchangeName, "direct", {
//       durable: false,
//     });

//     const q = await channel.assertQueue("", { exclusive: true });

//     console.log("waitong for messafe in queuq", q.queue);
//     args.forEach(function (sevrity) {
//       channel.bindQueue(q.queue, exchangeName, sevrity);
//     });

//     channel.consume(
//       q.queue,
//       (message) => {
//         if (message.content) {
//           console.log(
//             "routing key :",
//             message.fields.routingKey,
//             "content : ",
//             message.content.toString()
//           );
//         }
//       },
//       { noAck: true }
//     );

//     console.log("Channel created successfully");
//   } catch (error) {
//     console.error("Error creating channel:", error);
//   }
// }

//  topic exchange
// const args = process.argv.slice(2);
// const exchangeName = "topic_logs";

// if (args.length === 0) {
//   console.log("please feed this [error] [warning] [info]");
//   process.exit(1);
// }
// async function createChannel() {
//   try {
//     // Connect to RabbitMQ server
//     const connection = await amqp.connect("amqp://localhost");

//     // Create a channel
//     const channel = await connection.createChannel();
//     const result = await channel.assertExchange(exchangeName, "topic", {
//       durable: false,
//     });

//     const q = await channel.assertQueue("", { exclusive: true });

//     console.log("waitong for messafe in queuq", q.queue);
//     args.forEach(function (sevrity) {
//       channel.bindQueue(q.queue, exchangeName, sevrity);
//     });

//     channel.consume(
//       q.queue,
//       (message) => {
//         if (message.content) {
//           console.log(
//             "routing key :",
//             message.fields.routingKey,
//             "content : ",
//             message.content.toString()
//           );
//         }
//       },
//       { noAck: true }
//     );

//     console.log("Channel created successfully");
//   } catch (error) {
//     console.error("Error creating channel:", error);
//   }
// }

// header exchange

// const exchangeName = "header_logs";
// const args = process.argv.slice(2);
// const type = args[0] || "any";
// // console.log("type");
// async function createChannel() {
//   try {
//     // Connect to RabbitMQ server
//     const connection = await amqp.connect("amqp://localhost");

//     // Create a channel
//     const channel = await connection.createChannel();
//     const result = await channel.assertExchange(exchangeName, "headers", {
//       durable: false,
//     });

//     const q = await channel.assertQueue("", { exclusive: true });

//     console.log("waitong for messafe in queuq", q.queue);

//     channel.bindQueue(q.queue, exchangeName, "", {
//       "account": "new", "method": "google", "x-match": type
    
      
//     });

//     channel.consume(
//       q.queue,
//       (message) => {
//         if (message.content) {
//           console.log(
//             "/header:",
//             message.properties.headers,
//             "/content : ",
//             message.content.toString()
//           );
//         }
//       },
//       { noAck: true }
//     );

//     console.log("Channel created successfully");
//   } catch (error) {
//     console.error("Error creating channel:", error);
//   }
// }

//  example for rpc-remote procedural protocall



const queueName="rpc_queue"
function fibonacci(n){
  if(n==0||n==1){
    return n
  }else{
    return fibonacci(n-1)+fibonacci(n-2);
  }
}
async function createChannel() {
  try {
    // Connect to RabbitMQ server
    const connection = await amqp.connect("amqp://localhost");

    // Create a channel
    const channel = await connection.createChannel();
    

    const q = await channel.assertQueue(queueName, { exclusive: true });
    channel.prefetch(1)


    channel.consume(
    queueName ,
      (message) => {
        const number=parseInt(message.content.toString())
        console.log("fib number",number)
        const fib=fibonacci(number)
        const q=message.properties.replyTo;
        channel.sendToQueue(q,Buffer.from(fib.toString()),{
          correlationId:message.properties.correlationId
        });
        channel.ack(message)

      },
      
      { noAck: false }
    );

    console.log("Channel created successfully");
  } catch (error) {
    console.error("Error creating channel:", error);
  }
}
createChannel();
