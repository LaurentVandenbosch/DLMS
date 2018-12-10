'use strict';
const collectionName = 'messages';

const Hapi = require('hapi');
let globalMongoClient = null;
let globalDbName = null;
let globalCollectionName = null;

// Create a server with a host and port
const server = Hapi.server({
  port: 8000,
});

// Add the route
server.route({
  method: 'GET',
  path: '/messages',
  options: {
    cors: true,
  },
  handler: function(request, h) {
    return globalMongoClient
      .db(globalDbName)
      .collection(globalCollectionName)
      .find()
      .toArray()
      .then(messages => ({ messages }));
  },
});

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
