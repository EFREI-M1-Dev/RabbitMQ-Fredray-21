import { connect } from 'amqplib/callback_api.js';

connect('amqp://localhost', (error0, connection) => {
    if (error0) {
        throw error0;
    }
    connection.createChannel((error1, channel) => {
        if (error1) {
            throw error1;
        }

        const queue = 'rpc_queue';

        channel.assertQueue(queue, {
            durable: true
        });

        channel.prefetch(1);
        console.log(' [x] Awaiting RPC requests');

        channel.consume(queue, (msg) => {
            const n = parseInt(msg.content.toString());
      
            console.log(" [.] fib(%d)", n);
      
            const r = fibonacci(n);
      
            channel.sendToQueue(msg.properties.replyTo,
              Buffer.from(r.toString()), {
                correlationId: msg.properties.correlationId
              });
      
            channel.ack(msg);
          });
    });
});

const fibonacci = (n : number) => {
    if (n == 0 || n == 1) {
        return n;
    }
    return fibonacci(n - 1) + fibonacci(n - 2);
}