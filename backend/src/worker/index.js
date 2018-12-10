#!/usr/bin/env node
const util = require('util');
const assert = require('assert');

function executeWorker(mongoClient, mongoDbName, rabbitChannel) {
  const db = mongoClient.db(mongoDbName);
  startProcessingQueue(rabbitChannel, db);
}

function startProcessingQueue(ch, db) {
  const q = 'hello';

  ch.assertQueue(q, { durable: false });
  console.log(' [*] Waiting for messages in %s. To exit press CTRL+C', q);
  ch.consume(
    q,
    function(msg) {
      console.log(' [x] Received %s', msg.content.toString());
      db.collection('messages').insertOne({
        acknowledgedOn: new Date().toISOString(),
        queue: q,
        fields: msg.fields,
        properties: msg.properties,
        payload: msg.content.toString(),
        status: 'New',
      });
      ch.ack(msg);
    },
    { noAck: false }
  );
}

module.exports = { executeWorker };
