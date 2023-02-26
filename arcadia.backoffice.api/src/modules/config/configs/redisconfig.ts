import * as redisStore from 'cache-manager-redis-store';
import { HttpException } from '@nestjs/common';

const options: {
  host: string;
  port: string;
  // eslint-disable-next-line camelcase
  retry_strategy: Function;
  ttl: number;
} = {
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  ttl: 1,
  // eslint-disable-next-line camelcase
  retry_strategy: () => {
    // eslint-disable-next-line no-new
    new HttpException('Fail', 500);
    return 2000;
  },
};

const client: redisStore = redisStore.create(options);
const dummyClient: redisStore = {
  name: 'redis',
  getClient: function getClient() {
    return client.getClient();
  },
  set: function set(key, value, options, cb) {
    if (this.getClient().connected) {
      return client.set(key, value, options, cb);
    }
    return Promise.resolve(true);
  },
  mset: function mset() {
    if (this.getClient().connected) {
      return client.mset(...arguments);
    }

    return Promise.resolve(true);
  },
  get: function get(key, options, cb) {
    if (this.getClient().connected) {
      return client.get(key, options, cb);
    }

    return Promise.resolve(false);
  },
  mget: function mget() {
    if (this.getClient().connected) {
      return client.mget(...arguments);
    }

    return Promise.resolve(false);
  },
  del: function del() {
    if (this.getClient().connected) {
      return client.del(...arguments);
    }

    return Promise.resolve(true);
  },
  reset: function reset(cb) {
    if (this.getClient().connected) {
      return client.reset(cb);
    }

    return Promise.resolve(false);
  },
  keys: function keys() {
    if (this.getClient().connected) {
      return client.keys(...arguments);
    }

    return Promise.resolve([]);
  },
  ttl: function ttl(key, cb) {
    if (this.getClient().connected) {
      return client.ttl(key, cb);
    }

    return Promise.resolve(true);
  },
  isCacheableValue: function isCacheableValue(value) {
    if (this.getClient().connected) {
      return client.isCacheableValue(value);
    }
    return false;
  },
};

module.exports = {
  store: { create: () => dummyClient },
  ...options,
};
