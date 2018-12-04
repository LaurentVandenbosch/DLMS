const { promisify } = require('util');
const amqp = require('amqplib/callback_api');
const amqpConnect = promisify(amqp.connect);
const { executeWithRetry } = require('./utils');

module.exports = {
    connect: async (uri) => {
        return executeWithRetry(async () => {
            console.log(`Connecting to rabbitmq ${uri}`);
            const conn = await amqpConnect(uri);
            return new Promise((resolve, reject) => {
                conn.createChannel((err, ch) => {
                    if (err)
                        reject(err);
                    else
                        resolve(ch);
                });
            });
        }, (exception) => {
            console.log(`Failed to connect to rabbitmq : ${exception.message}`);
        }, 15, 2000);
    }
};