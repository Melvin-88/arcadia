const rabbitMQ = require('amqp-connection-manager');
let _channel = null;
let _common = null;
let _channelWrapper = null;
let _server = null;

const CONNECT_EVENT = 'connect';
const DISCONNECT_EVENT = 'disconnect';

//async function init(serverURL, common, cb) {
async function init(fullURLs, common, cb) {
	_common = common;
	//gracefully shutdown
	process.on('SIGTERM', () => {
		close();
	});

    try {
	//const fullURLs = `amqp://${serverURL}`; // robot:arcadia@
		_server = rabbitMQ.connect(fullURLs, {
			heartbeatIntervalInSeconds: 5,
			reconnectTimeInSeconds: 5
		});
		_server.on(DISCONNECT_EVENT, e => {
			_common.logger.error('RabbitMessanger', `init`, `RabbitMQ could not be initialized: ${e}`);
		});
		return new Promise((resolve, reject) => {
			_server.once(DISCONNECT_EVENT, e => {
				reject(e);
			});
			_common.logger.debug('Rabbit', 'Contacting', fullURLs);
			_server.on(CONNECT_EVENT, () => {
				_channelWrapper = _server.createChannel({
					json: false,
					setup: (channel) => {
						_channel = channel;
						cb();
						resolve();
					},
				});
			});
		});
	} catch (e) {
		_common.logger.error('RabbitMessanger', `init`, `RabbitMQ could not be initialized: ${e}`);
		throw e;
	}
}

function listenOn(queueName, cb) {
	_queueName = queueName;
	_cb = cb;
	try {
		_channel.assertQueue(queueName, {
		  durable: true,
		  exclusive: true
		});
  	} catch (e) {
		_common.logger.error('RabbitMessanger', `listenOn`, e.message);
		throw e;
 	 }
	_common.logger.debug('Rabbit', 'Listening', queueName);

	_channel.consume(queueName, (qMsg) => {
		_common.logger.debug('Rabbit', 'Received', `${qMsg.content}`);
		let msg = '';
		try {
			msg = JSON.parse(qMsg.content);
		} catch (e) {
			_common.logger.error('RabbitMessanger', `listenOn`, e.message);
		}
	  	cb(msg);
	}, {noAck: true});
}

function sendTo(queueName, msg, skip_log=false) {
	if (!_channel) return;
	const msgTxt = JSON.stringify({serial:_common.serial, key:_common.key, ...msg});
	_channel.sendToQueue(queueName, Buffer.from(msgTxt));
	if (!skip_log) _common.logger.debug('Rabbit', 'Sending', msg);
}

function close() {
	_common.logger.info('Rabbit', 'ChannelClose', _queueName);
	_channel.close();
}

var messanger = {
	init,
	listenOn,
	sendTo,
	close
};

module.exports = messanger;
