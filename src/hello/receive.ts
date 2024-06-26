import { connect } from 'amqplib/callback_api.js';

connect('amqp://localhost', (error0, connection) => {
    if (error0) {
        throw error0;
    }
    connection.createChannel((error1, channel) => {
        if (error1) {
            throw error1;
        }
        const queue = 'hello';

        channel.assertQueue(queue, {
            durable: false
        });

        console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queue);

        channel.consume(queue, (msg) => {
            if (msg) {
                console.log(" [x] Received %s", msg.content.toString());
            }
            else {
                console.log("No message received");
            }
        }, {
            noAck: true
        });
    });
});