const axios = require('axios');
const amqp = require('amqp-connection-manager');

class CoreClient {

  constructor(config) {
    this.apiUrl = config.gameCore.apiUrl;
    this.amqpCoreQueue = config.rabbitMQ.coreQueue;
    const connection = amqp.connect(config.rabbitMQ.amqpUrl);
    this.channelWrapper = connection.createChannel({
      json: true,
      setup: function (channel) {
        return channel.assertQueue(this.amqpCoreQueue, { durable: true });
      }
    });
  }

  sendMessage(type, data) {
    try {
      this.channelWrapper.sendToQueue(this.amqpCoreQueue, {
        type,
        ...data,
      });
    } catch (err) {
      console.log(err);
    }
  }

  clientLogin(correlationId, token, groupId, footprint) {
    return axios.post(`${this.apiUrl}/auth/verify`, {
      token,
      groupId,
      footprint
    },
    { headers: { correlation: correlationId } })
      .then(value => value.data);
  }

  clientReconnect(correlationId, sessionId, footprint) {
    return axios.post(`${this.apiUrl}/auth/reconnect`, {
      sessionId: Number(sessionId),
      footprint
    },
    { headers: { correlation: correlationId } })
      .then(value => value.data);
  }
}

module.exports = {
  CoreClient,
};
