import { connect } from 'amqplib/callback_api.js';

connect('amqp://localhost', (error0, connection) => {
    if (error0) {
        throw error0;
    }
    connection.createChannel((error1, channel) => {
        if (error1) {
            throw error1;
        }


        const exchange = 'topic_logs';
        const args = process.argv.slice(2);
        const msg = args.slice(1).join(' ') || 'Hello World!';
        const key  = args.length > 0 ? args[0] : 'anonymous.info';

        if(!key) {
            console.log("Usage: emit_log_topic.ts [binding_key] [message]");
            process.exit(1);
        }

        channel.assertExchange(exchange, 'topic', {
            durable: false
          });
          channel.publish(exchange, key, Buffer.from(msg));
          console.log(" [x] Sent %s: '%s'", key, msg);
    });
    setTimeout(() => {
        connection.close();
        process.exit(0);
    }, 500);
});