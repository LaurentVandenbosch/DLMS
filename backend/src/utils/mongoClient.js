const { promisify } = require('util');
const executeWithRetry = require('./executeWithRetry');
const { MongoClient } = require('mongodb');
const mongoConnect = promisify(MongoClient.connect);

module.exports = {
  connect: async (uri, options, maxRetry = 10, retryDelay = 1000) => {
    console.log(`Connecting to mongo server ${uri}...`);

    return executeWithRetry(
      async () => {
        const client = await mongoConnect(uri, options);
        console.log('Connected successfully to mongo');
        return client;
      },
      exception => {
        console.log(`Failed to connect to mongo : ${exception.message}`);
      },
      maxRetry,
      retryDelay
    );
  },
};
