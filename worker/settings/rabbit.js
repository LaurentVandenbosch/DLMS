const settings = {
  host: process.env.RABBIT_HOST || 'localhost',
  port: process.env.RABBIT_PORT || '5672',
};

module.exports = {
  ...settings,
  uri: `amqp://${settings.host}:${settings.port}`,
};
