const settings = {
  host: process.env.MONGO_HOST || 'localhost',
  port: process.env.MONGO_PORT || '27017',
  dbName: process.env.MONGO_DBNAME || 'DLMS',
};

module.exports = {
  ...settings,
  uri: `mongodb://${settings.host}:${settings.port}`,
};
