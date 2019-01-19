'use strict';
const collectionName = 'messages';

const Hapi = require('hapi');
let globalMongoClient = null;
let globalDbName = null;
let globalCollectionName = null;

const { ObjectId } = require('mongodb');

const rabbitClient = require('../utils/rabbitClient');
const rabbitSettings = require('../settings//rabbit');

// Create a server with a host and port
const server = Hapi.server({
  port: 8000,
});

// Add the route
const routes = [
  {
    path: '/messages',
    method: 'GET',
    handler: function(request, h) {
      return globalMongoClient
        .db(globalDbName)
        .collection(globalCollectionName)
        .find()
        .toArray()
        .then(messages => ({ messages }));
    },
  },
  {
    path: '/message/{id}/requeue',
    method: 'POST',
    handler: async function(request, h) {
      const updatedMessage = await globalMongoClient
        .db(globalDbName)
        .collection(globalCollectionName)
        .findOneAndUpdate(
          { _id: ObjectId(request.params.id) },
          { $set: { status: 'Requeued' } },
          { returnNewDocument: true }
        )
        .then(update => update.value);

      const ch = await rabbitClient.connect(rabbitSettings.uri);
      const q = request.query.requeueName;
      await ch.assertQueue(q, { durable: false });
      await ch.sendToQueue(
        q,
        new Buffer(JSON.stringify(updatedMessage.payload))
      );

      return updatedMessage;
    },
  },
];
server.route(routes);

// Start the server
async function start(mongoClient, dbName, collectionName) {
  globalMongoClient = mongoClient;
  globalDbName = dbName;
  globalCollectionName = collectionName;
  try {
    await server.start();
  } catch (err) {
    console.log(err);
    process.exit(1);
  }

  console.log('Server running at:', server.info.uri);
}

module.exports = { start };
