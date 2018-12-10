const mongoClient = require('./utils/mongoClient');
const rabbitClient = require('./utils/rabbitClient');

const mongoSettings = require('./settings/mongo');
const rabbitSettings = require('./settings/rabbit');

const worker = require('./worker');
const api = require('./api');

start();

async function start() {
  const client = await mongoClient.connect(
    mongoSettings.uri,
    { useNewUrlParser: true }
  );
  const ch = await rabbitClient.connect(rabbitSettings.uri);

  worker.executeWorker(client, mongoSettings.dbName, ch);
  api.start(client, mongoSettings.dbName, 'messages');
}
