import { connect } from 'amqplib/callback_api.js';

connect('amqp://localhost', (_, connection) => {
    connection.createChannel((_, channel) => {
        const queue = 'task_queue';

        channel.assertQueue(queue, {
            durable: true
        });
        channel.prefetch(1);
        console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queue);
        channel.consume(queue, (msg) => {
            if (msg) {
                const secs = msg.content.toString().split('.').length - 1;

                console.log(" [x] Received %s", msg.content.toString());
                setTimeout(() => {
                    console.log(" [x] Done");
                    channel.ack(msg);
                }, secs * 1000);
            }
        }, {
            noAck: false
        });
    });
});