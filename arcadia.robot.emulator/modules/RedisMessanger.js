/***
 * Module dependencies.
 */
var uid2 = require('uid2');
var EventEmitter = require('events');
var client = require('ioredis');
var parser = require('socket.io-parser');
var hasBin = require('has-binary');
var msgpack = require('msgpack-js');
var debug = require('debug')('socket.io-emitter');
const notepack = require('notepack.io');
const logger   = require('./logger.js');

/**
 * Module exports.
 */

module.exports = Emitter;

/**
 * Flags.
 *
 * @api public
 */

var flags = ['json', 'volatile', 'broadcast'];

/**
 * uid for emitter
 *
 * @api private
 */

var uid = uid2(6);
/**
 * Socket.IO redis based emitter.
 *
 * @param {Object} redis client (optional)
 * @param {Object} options
 * @api public
 */

function Emitter(opts) {
    if (!(this instanceof Emitter)) return new Emitter(opts);

    opts = opts || { redis: { url: '127.0.0.1', port: 6379 } };
    this.redis = new client(opts.redis, {
        retry_strategy: function (options) {
            let timeout = 2 //seconds
            console.error(`Redis error, reconneting in ${timeout} seconds... `);
            return timeout * 1000;
          }
    });
    this.subClient = new client(opts.redis);
    this.prefix = opts.key || 'arcadia';

    this._rooms = [];
    this._flags = {
        nsp: '/'
    };

    this.self = new EventEmitter();

    this.subClient.on('messageBuffer', this.onmessage.bind(this));
    this.subClient.on('connect', function () {
        console.log("Redis connected");
    });
    this.subClient.on('error', function (err) {
        //	console.error("*on error*", err.message);
    });
}

/**
 * Apply flags from `Socket`.
 */

flags.forEach(function(flag) {
  Emitter.prototype.__defineGetter__(flag, function() {
    // debug('flag %s on', flag);
    this._flags[flag] = true;
    return this;
  });
});

/**
 * Limit emission to a certain `room`.
 *
 * @param {String} room
 */
Emitter.prototype.in = Emitter.prototype.to = function(room) {
  if (!~this._rooms.indexOf(room)) {
    // debug('room %s', room);
    this._rooms.push(room);
  }
  return this;
};

/**
 * Limit emission to certain `namespace`.
 *
 * @param {String} namespace
 */

Emitter.prototype.of = function(nsp) {
  // debug('nsp set to %s', nsp);
  this._flags.nsp = nsp;
  return this;
};

/**
 * Send the packet.
 *
 * @api public
 */

Emitter.prototype.emit = function() {
  try {
    var self = this;

    // packet
    var args = Array.prototype.slice.call(arguments);
    var packet = {};
    packet.type = hasBin(args) ? parser.BINARY_EVENT : parser.EVENT;
    packet.data = args;
    // set namespace to packet
    if (this._flags.nsp) {
      packet.nsp = this._flags.nsp;
      // delete this._flags.nsp;
    } else {
      packet.nsp = '/';
    }

    var opts = {
      rooms: this._rooms,
      flags: this._flags
    };
    var chn = this.prefix + '#' + packet.nsp + '#';
    var msg = msgpack.encode([uid, packet, opts]);

    // publish
    if (opts.rooms && opts.rooms.length) {
      opts.rooms.forEach(function(room) {
        var chnRoom = chn + room + '#';
        self.redis.publish(chnRoom, msg);
      });
    } else {
      this.redis.publish(chn, msg);
    }

    // reset state
    this._rooms = [];
    this._flags = {};

    return this;
  } catch (e) {
    console.log(`!!!!!!!!!!!!!!!!`);
  }
};

Emitter.prototype.onmessage = function(channel, encoded) {
  const decoded = notepack.decode(encoded);
  const packet = decoded[1];

  if (packet && packet.nsp === undefined) {
    packet.nsp = '/';
  }

  // broadcast
  this.self.emit(this.prefix + '#' + packet.nsp + '#' + packet.data[0], packet.data[1]);
};

setNsp = function (nsp) {
    if (!nsp) {
        nsp = '/';
    }
    return nsp;
}

Emitter.prototype.join = function(room, fn) {
  var self = this;
  this._flags.nsp = setNsp(this._flags.nsp)
  var channel = this.prefix + '#' + this._flags.nsp + '#' + room + '#';
  logger.debug('Redis', 'join', channel);
  this.subClient.subscribe(channel, function(err) {
    if (err) {
      self.self.emit('error', err);
      if (fn) fn(err);
      return;
    }
    if (fn) fn(null);
  });
};

Emitter.prototype.leave = function (room, fn) {
  var self = this;
  this._flags.nsp = setNsp(this._flags.nsp)
  var channel = this.prefix + '#' + this._flags.nsp + '#' + room + '#';
  logger.debug('Redis', 'leave', channel);
  this.subClient.unsubscribe(channel, function (err) {
    if (err) {
      self.self.emit('error', err);
      if (fn) fn(err);
      return;
    }
    if (fn) fn(null);
  });
};

Emitter.prototype.on = function(eventName, fn) {
  var args = arguments;
  args[0] = this.prefix + '#' + this._flags.nsp + '#' + args[0];
  this.self.on.apply(this.self, args);
};
