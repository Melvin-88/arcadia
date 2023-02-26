const serverLog = require('./RabbitMessanger.js');
const {Logging} = require('@google-cloud/logging');
const projectId = "arcadia-robots";
const logging = new Logging({projectId});
let cloudLog = null;
let mySerial = null;

const levels = {
	DEBUG:0,
	INFO:1,
	WARNING:2,
	ERROR:3,
	CRITICAL:4
};
let _logLevel = levels.DEBUG;

function init(robotSerialId) {
	if (robotSerialId.startsWith('Demo')) return;
	mySerial = robotSerialId;
	try {
		cloudLog = logging.log(robotSerialId); // log name
	} catch (e) {
		console.log(`Could not create logger ${e}`);
		cloudLog = null;
	}
}

function setLevel(newLevel) {
	_logLevel = levels[newLevel] || levels.DEBUG;
	console.log(`Log level set to ${_logLevel}`);
}

async function write(severity, msg) {
	if (levels[severity] < _logLevel) return;

	console.log(`${new Date().toISOString().replace('T', ' ').substr(0, 19)}..${severity.padEnd(8,'.')}${JSON.stringify(msg)}`);

	if (levels[severity]!=levels['DEBUG']) {	
		let toServerMsg = {
			"type": "RobotEventLog",
			"sessionId": msg.sessionId,
			"machineSerial": mySerial,
			"eventType": (['ERROR', 'CRITICAL'].includes(severity) ? 'ROBOT_ERROR' : 'ROBOT_LOG'),
			"data": msg
		};
		try {
			serverLog.sendTo('coreToMonitoringWorkerQueue', toServerMsg, true);
		} catch (e) {
			//console.log('Cannot send logs to server now');
		}
	}

	if (cloudLog) {
		try {
			const metadata = {
			  resource: {type: 'global'},
			  severity: severity||'INFO'
			};
			const entry = cloudLog.entry(metadata, msg);
			cloudLog.write(entry);
		} catch (e) {
			console.log(`Could not write cloud log ${e}`);
		}		
	}
}

function debug(_module, _action="", _text="", _sessionId="") {
	write('DEBUG', {module:_module, action:_action, text:_text, sessionId:_sessionId});
}
function info(_module, _action="", _text="", _sessionId="") {
	write('INFO', {module:_module, action:_action, text:_text, sessionId:_sessionId});
}
function warning(_module,  _action="", _text="", _sessionId="") {
	write('WARNING', {module:_module, action:_action, text:_text, sessionId:_sessionId});
}
function error(_module, _action="", _text="", _sessionId="") {
	write('ERROR', {module:_module, action:_action, text:_text, sessionId:_sessionId});
}
function critical(_module, _action="", _text="", _sessionId="") {
	write('CRITICAL', {module:_module, action:_action, text:_text, sessionId:_sessionId});
}
module.exports = {
	init,
	write,
	debug,
	info,
	warning,
	error,
	critical,
	setLevel
};
