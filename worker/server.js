#!/usr/bin/env node

const amqp = require('amqplib/callback_api');

const { MongoClient } = require('mongodb');
const host = process.env.MONGO_HOST || 'localhost';
const url = 'mongodb://' + host + ':27017';

const assert = require('assert');

const dbName = 'DLMS'

MongoClient.connect(url, function(err, client) {
  assert.equal(null, err);
  console.log("Connected successfully to server");
 
  const db = client.db(dbName);

  amqp.connect('amqp://localhost', function(err, conn) {
    conn.createChannel(function(err, ch) {
      const q = 'hello';

      ch.assertQueue(q, {durable: false});
      console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", q);
      ch.consume(q, function(msg) {
        console.log(" [x] Received %s", msg.content.toString());
        db.collection("messages").insertOne({
          "queue" : q,
          "payload":msg.content.toString()
          });
        ch.ack(msg);
      }, {noAck: false});
    });
  });
 });





