/* eslint-disable max-lines */
import * as Redis from 'ioredis';

function getRedisConfig(): Redis.RedisOptions {
  let hosts: string|string[] = <string|string[]>process.env.REDIS_HOST;
  hosts = Array.isArray(hosts) ? hosts : [hosts];
  const ports: number|number[] = <number|number[]>parseInt(process.env.REDIS_PORT, 10);
  return process.env.SENTINEL_NAME
    ? {
      sentinels: hosts.map((host, index) => ({
        host,
        port: <number>((Array.isArray(ports) && ports[index])
          ? ports[index]
          : ports),
      })),
      name: <string>process.env.SENTINEL_NAME,
    }
    : {
      host: <string>hosts[0] || 'localhost',
      port: <number>(ports || 6379),
    };
}

const options: Redis.RedisOptions = getRedisConfig();

function handleResponse(cb, opts: any = {}) {
  return (err, result) => {
    if (err) {
      return cb && cb(err);
    }

    if (opts.parse) {
      const isMultiple = Array.isArray(result);
      if (!isMultiple) {
        result = [result];
      }

      result = result.map(_result => {
        try {
          _result = JSON.parse(_result);
        } catch (e) {
          return cb && cb(e);
        }
        return _result;
      });

      result = isMultiple ? result : result[0];
    }

    return cb && cb(null, result);
  };
}

const redisStore = (...args) => {
  const redisCache = new Redis(...args);
  const storeArgs: any = redisCache.options;

  return {
    name: 'redis',
    getClient: () => redisCache,
    set(key, value, options, cb) {
      if (redisCache.status !== 'ready') {
        return Promise.resolve(true);
      }

      // eslint-disable-next-line consistent-return
      return new Promise((resolve, reject) => {
        if (typeof options === 'function') {
          cb = options;
          options = {};
        }
        options = options || {};

        if (!cb) {
          cb = (err, result) => (err ? reject(err) : resolve(result));
        }

        if (!this.isCacheableValue(value)) {
          return cb(new Error(`"${value}" is not a cacheable value`));
        }

        const ttl = (options.ttl || options.ttl === 0) ? options.ttl : storeArgs.ttl;
        const val = JSON.stringify(value) || '"undefined"';

        if (ttl) {
          redisCache.setex(key, ttl, val, handleResponse(cb));
        } else {
          redisCache.set(key, val, handleResponse(cb));
        }
      });
    },
    mset(...args) {
      if (redisCache.status !== 'ready') {
        return Promise.resolve(true);
      }
      // eslint-disable-next-line consistent-return
      return new Promise((resolve, reject) => {
        let cb;
        let options: any = {};

        if (typeof args[args.length - 1] === 'function') {
          cb = args.pop();
        }

        if (args[args.length - 1] instanceof Object && args[args.length - 1].constructor === Object) {
          options = args.pop();
        }

        if (!cb) {
          cb = (err, result) => (err ? reject(err) : resolve(result));
        }

        const ttl = (options.ttl || options.ttl === 0) ? options.ttl : storeArgs.ttl;

        let multi;
        if (ttl) {
          multi = redisCache.multi();
        }

        let key;
        let value;
        const parsed = [];
        for (let i = 0; i < args.length; i += 2) {
          key = args[i];
          value = args[i + 1];

          /**
           * Make sure the value is cacheable
           */
          if (!this.isCacheableValue(value)) {
            return cb(new Error(`"${value}" is not a cacheable value`));
          }

          value = JSON.stringify(value) || '"undefined"';
          parsed.push(...[key, value]);

          if (ttl) {
            multi.setex(key, ttl, value);
          }
        }

        if (ttl) {
          multi.exec(handleResponse(cb));
        } else {
          redisCache.mset.apply(redisCache, [...parsed, handleResponse(cb)]);
        }
      });
    },
    get: (key, options, cb) => {
      if (redisCache.status !== 'ready') {
        return Promise.resolve(false);
      }

      return new Promise((resolve, reject) => {
        if (typeof options === 'function') {
          cb = options;
        }

        if (!cb) {
          cb = (err, result) => (err ? reject(err) : resolve(result));
        }

        redisCache.get(key, handleResponse(cb, { parse: true }));
      });
    },
    mget: (...args) => {
      if (redisCache.status !== 'ready') {
        return Promise.resolve(false);
      }
      return new Promise((resolve, reject) => {
        let cb;
        let options = {};

        if (typeof args[args.length - 1] === 'function') {
          cb = args.pop();
        }

        if (args[args.length - 1] instanceof Object && args[args.length - 1].constructor === Object) {
          options = args.pop();
        }

        if (!cb) {
          cb = (err, result) => (err ? reject(err) : resolve(result));
        }

        redisCache.mget.apply(redisCache, [...args, handleResponse(cb, { parse: true })]);
      });
    },
    del: (...args) => {
      if (redisCache.status !== 'ready') {
        return Promise.resolve(true);
      }

      return new Promise((resolve, reject) => {
        let cb;
        let options = {};

        if (typeof args[args.length - 1] === 'function') {
          cb = args.pop();
        }

        if (args[args.length - 1] instanceof Object && args[args.length - 1].constructor === Object) {
          options = args.pop();
        }

        if (!cb) {
          cb = (err, result) => (err ? reject(err) : resolve(result));
        }

        redisCache.del.apply(redisCache, [...args, handleResponse(cb)]);
      });
    },
    reset: cb => {
      if (redisCache.status !== 'ready') {
        return Promise.resolve(false);
      }

      return new Promise((resolve, reject) => {
        if (!cb) {
          cb = (err, result) => (err ? reject(err) : resolve(result));
        }

        redisCache.flushdb(handleResponse(cb));
      });
    },
    keys: (pattern = '*', cb) => {
      if (redisCache.status !== 'ready') {
        return Promise.resolve([]);
      }

      return new Promise((resolve, reject) => {
        if (typeof pattern === 'function') {
          cb = pattern;
          pattern = '*';
        }

        if (!cb) {
          cb = (err, result) => (err ? reject(err) : resolve(result));
        }

        redisCache.keys(pattern, handleResponse(cb));
      });
    },
    ttl: (key, cb) => {
      if (redisCache.status !== 'ready') {
        return Promise.resolve(true);
      }

      return new Promise((resolve, reject) => {
        if (!cb) {
          cb = (err, result) => (err ? reject(err) : resolve(result));
        }

        redisCache.ttl(key, handleResponse(cb));
      });
    },
    isCacheableValue: storeArgs.is_cacheable_value || (value => value !== undefined && value !== null),
  };
};

module.exports = {
  store: { create: () => redisStore(options) },
  ...options,
};
