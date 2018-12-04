#!/usr/bin/env node
const util = require('util');
const assert = require('assert');

const mongoClient = require('./mongoClient');
const rabbitClient = require('./rabbitClient');

const mongoSettings = require('./settings/mongo');
const rabbitSettings = require('./settings/rabbit');

executeWorker();

async function executeWorker() {
  const client = await mongoClient.connect(mongoSettings.uri, { useNewUrlParser: true })
  const db = client.db(mongoSettings.dbName);

  const ch = await rabbitClient.connect(rabbitSettings.uri);

  startProcessingQueue(ch, db);
}

function startProcessingQueue(ch, db) {
  const q = 'hello';

  ch.assertQueue(q, { durable: false });
  console.log(
    ' [*] Waiting for messages in %s. To exit press CTRL+C',
    q
  );
  ch.consume(
    q,
    function (msg) {
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