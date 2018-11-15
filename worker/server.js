#!/usr/bin/env node

const assert = require('assert');

const { MongoClient } = require('mongodb');
const mongoSettings = require('./settings/mongo');

const amqp = require('amqplib/callback_api');
const rabbitSettings = require('./settings/rabbit');
const CannotConnectToRabbitMQError = require('./errors/CannotConnectToRabbitMQError');

console.log(`Connecting to mongo server ${mongoSettings.uri}...`);
MongoClient.connect(
  mongoSettings.uri,
  { useNewUrlParser: true },
  function(err, client) {
    assert.strictEqual(err, null);
    console.log('Connected successfully to server');

    const db = client.db(mongoSettings.dbName);
    setTimeout(() => {
      console.log(`Connecting to rabbitmq server ${rabbitSettings.uri}`);
      amqp.connect(
        rabbitSettings.uri,
        function(err, conn) {
          assert.strictEqual(err, null, new CannotConnectToRabbitMQError());
          conn.createChannel(function(err, ch) {
            const q = 'hello';

            ch.assertQueue(q, { durable: false });
            console.log(
              ' [*] Waiting for messages in %s. To exit press CTRL+C',
              q
            );
            ch.consume(
              q,
              function(msg) {
                console.log('message : ');
                console.log(msg);
                console.log(' [x] Received %s', msg.content.toString());
                db.collection('messages').insertOne({
                  queue: q,
                  payload: msg.content.toString(),
                });
                ch.ack(msg);
              },
              { noAck: false }
            );
          });
        }
      );
    }, 15000);
  }
);
