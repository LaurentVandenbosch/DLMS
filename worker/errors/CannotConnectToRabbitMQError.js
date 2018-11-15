module.exports = class CannotConnectToRabbitMQError extends Error {
  constructor() {
    super("Couldn't connect to RabbitMQ");
  }
};
