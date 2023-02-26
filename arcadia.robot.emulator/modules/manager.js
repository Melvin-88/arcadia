const uid2 = require('uid2');
const messanger = require('./RabbitMessanger.js');

const STATUS = {
	STOPPED: 'stopped',
	IDLE: 'idle',
	TESTING: 'testing',
	STOPPING: 'stopping',
	MANUAL_PLAY: 'manual_play',
	AUTO_PLAY: 'auto_play',
	RESHUFFLE: 'reshuffle'
};
const StatusReportInterval = 60_000;

var pingTimer = null;
var lastPing = null;

const commander = {
	stop: {
		handler: stop,
		allowedStates: [STATUS.IDLE, STATUS.TESTING, STATUS.MANUAL_PLAY, STATUS.AUTO_PLAY, STATUS.RESHUFFLE],
		ignoredStates: [STATUS.STOPPED, STATUS.STOPPING]
	},
	run: {
		handler: run,
		allowedStates: [STATUS.STOPPED],
		ignoredStates: [STATUS.TESTING, STATUS.RESHUFFLE]
	},
	engage: {
		handler: (cmd) => { engage(cmd.session); },
		allowedStates: [STATUS.IDLE, STATUS.MANUAL_PLAY, STATUS.AUTO_PLAY]
	},
	breakup: {
		handler: (cmd) => {
			validateSession(cmd.session);
			breakup();
		},
		allowedStates: [STATUS.AUTO_PLAY, STATUS.MANUAL_PLAY],
		ignoredStates: [STATUS.IDLE]
	},
	push: {
		handler: (cmd) => { _common.driver.push(cmd.dispenser); },
		allowedStates: [STATUS.AUTO_PLAY, STATUS.IDLE, STATUS.MANUAL_PLAY, STATUS.RESHUFFLE]
	},
	seed :{
		handler: seed,
		allowedStates: [STATUS.IDLE]
	},
	allow: {
		handler: (cmd) => {
			validateSession(cmd.session);
			allow(cmd.coins);
		},
		allowedStates: [STATUS.AUTO_PLAY, STATUS.MANUAL_PLAY]
	},
	chipvalidation: {
		handler: (cmd) => { chipValidation(cmd.rfid, cmd.status); },
		allowedStates: [STATUS.AUTO_PLAY, STATUS.IDLE, STATUS.MANUAL_PLAY, STATUS.RESHUFFLE]
	},
	auto: {
		handler: (cmd) => {
			validateSession(cmd.session);
			autoPlay(cmd.mode);
		},
		allowedStates: [STATUS.MANUAL_PLAY, STATUS.RESHUFFLE,STATUS.AUTO_PLAY],
		ignoredStates: []
	},
	stopauto: {
		handler: (cmd) => {
			validateSession(cmd.session);
			stopAutoPlay();
		},
		allowedStates:[STATUS.AUTO_PLAY]
	},
	reshuffle: {
		handler: (cmd) => { reshuffle(cmd.coins); },
		allowedStates: [STATUS.IDLE],
		ignoredStates: [STATUS.RESHUFFLE]
	},
	ping: {
		handler: (_) => send2Mgr('Pong')
	},
	status: {
		handler: (_) => statusReport()
	},
	table:{
		handler: (_) => {table(); _log.warning('manager', 'table', "Command should be removed");}
	},
	chipmap:{
		handler: (_) => _log.warning('manager', 'chipmap', "Command not supported")
	},
	reboot: {
		handler: (_) => reBoot()
	},
	exit: {
		handler: (_) => exit()
	}
};

let _common          = null;
let _myStatus        = null;
let _toMgrQueue      = null;
let _fromMgrQueue    = null;
let _statusReportTO  = null;
let _pendingChips    = {};
let _chipMap         = {};
let _log             = null;
let _faults          = [];
let _seedingPushes   = 0;
let _reshuffleStatus = {firing:false, seeding:false, coins:0};

async function init(common, messageServer, queues) {
	_common = common;
	_log = _common.logger;

	_fromMgrQueue = queues.subscriber;
	_toMgrQueue = queues.publisher;
	try {
		await messanger.init(messageServer, common, () => { messanger.listenOn(_fromMgrQueue, handle); });
	} catch (e) {
		_log.error('manager', 'initializing', `${e}`);
	}
	_log.info('manager', 'RabbitMQ connected');
	changeStatus(STATUS.STOPPED);
}

function handle(msg) {
	try {
		cmd = commander[msg.action];
		if (!("allowedStates" in cmd) || (cmd.allowedStates.includes(_myStatus))) {
			cmd.handler(msg);
		}
		else if (("ignoredStates" in cmd) && (cmd.ignoredStates.includes(_myStatus))) {
			_log.warning('manager', msg.action, `command ${msg.action} ignored in ${_myStatus} state`, _common.sessionId);
			statusReport()
        }
		else {
			_log.error('manager', msg.action, `Invalid action ${msg.action} in ${_myStatus} state`, _common.sessionId);
			send2Mgr('CmdError', {command:msg.action, reason:`Invalid action ${msg.action} in ${_myStatus} state`});
		}
	} catch (e) {
		_log.error('manager', msg.action, e.message, _common.sessionId);
		send2Mgr('CmdError', {command: msg.action, reason:e.message});
	}
}

function pingTimeout() {
	if (_common.sessionId) breakup();

}

function autoPlay(tiltMode) {
	_common.player.setAuto(tiltMode);
	changeStatus(STATUS.AUTO_PLAY);
}

function stopAutoPlay() {
	_common.player.stopAuto();
	changeStatus(STATUS.MANUAL_PLAY);
}

function table() {
	let table = [...Object.keys(_common.table)];
	send2Mgr('Table', {table});
}

function chipMap(map) {
	_log.info('manager', 'chipmap',JSON.stringify(map));
	_chipMap = map;
}

function engage(sessionId) {
	if (_common.sessionId) _common.player.breakup();

	_common.sessionId = sessionId;
	_log.info('manager', 'engage', '', sessionId);
	_common.player.engage(sessionId);
}

function playerReady(msg) {
	send2Mgr('Engaged', {}, msg.correlationId);
	changeStatus(STATUS.MANUAL_PLAY);
}

function playerLost(sessionId) {
	addFault('player', 'NoEngagement', {sessionId});
  _common.sessionId = null;
	changeStatus(STATUS.IDLE);
}

function allow(coins) {
	_common.player.setCoins(coins);
}
function block() {
	_common.player.setCoins(0);
}

function breakup() {
	_log.info('manager', 'breakup', '', _common.sessionId);
	if (_myStatus == STATUS.AUTO_PLAY)
		stopAutoPlay();
	_common.player.breakup();
	send2Mgr('Disengaged');
  _common.sessionId = null;
	changeStatus(STATUS.IDLE);
}

function seed(msg) {
	let {dispensers, reshuffleCoins} = msg;
	_log.info('manager', 'seed', {dispensers, reshuffleCoins});
	dispensers.forEach(dispenser => _common.driver.push(dispenser));
	_seedingPushes = dispensers.length;
	_reshuffleStatus.seeding = true;
	_reshuffleStatus.coins = reshuffleCoins;
}

function reshuffle(coins) {
	_log.info('manager', 'reshuffle', {coins});
	changeStatus(STATUS.RESHUFFLE);
	if (coins==0) {
		setTimeout(stopReshuffle, 3000);
		return;
	}

	_common.player.reshuffle(coins);
	_reshuffleStatus.firing = true;
}

function pushInReshuffle() {
	if (_seedingPushes > 0) _seedingPushes -= 1;
	if (_seedingPushes == 0) reshuffle(_reshuffleStatus.coins);
}

function stopReshuffle() {
	// if (reason == 'AllFired')     _reshuffleStatus.firing = false;
	// if (reason == 'NoMorePushes') _reshuffleStatus.seeding = false;

	// if (_reshuffleStatus.firing || _reshuffleStatus.seeding) {
	// 	_log.info('manager', `stopReshuffle cannot happen now: ${JSON.stringify(_reshuffleStatus)}`);
	// 	return;
	// }
	_log.info('manager', 'stopReshuffle');
	changeStatus(STATUS.IDLE);
	_reshuffleStatus = {firing:false, seeding:false, coins:0};
}

function stop() {
	_log.info('manager', 'stop', '', _common.sessionId);
	_common.driver.stop();
	changeStatus(STATUS.STOPPING);
}

function run() {
	_log.info('manager', 'run', '', _common.sessionId);
	_common.driver.run();
	changeStatus(STATUS.TESTING);	
}

function deviceStatus(status) {
	if (status=='ready')
		changeStatus(STATUS.IDLE);
	else
		changeStatus(STATUS.STOPPED);
}

function requestChipValidation(rfid, dispenser=null) {
	if (_myStatus==STATUS.STOPPED || _myStatus==STATUS.STOPPING || _myStatus==STATUS.TESTING)
		return;

  _pendingChips[rfid] = true;
	_log.info('manager', 'RequestValidation', rfid, _common.sessionId);
	send2Mgr('ChipValidation', {rfid, dispenser});
}

function chipValidation(rfid, status) {
	if (!_pendingChips[rfid])
		throw {message:"Unknown RFID"};

  _common.driver.validation(rfid, status);
}

function pushCompleted(rfid, pushed, dispenser, pending) {
  delete _pendingChips[rfid];
  if (pushed) {
  	let chip = {status:'pushed', entry:_common.coinCounter};
  	if (_common.demoMode) {
  		let numOfChips = Object.values(_common.table).reduce((count, chip) => {if (chip.status=='pushed') return count+1; else return count;},0);
  		numOfChips = Math.min(numOfChips, 6);
  		let demoTarget = _common.demomcpd*(1+0.1*numOfChips) + Math.floor(_common.demomcpd*(Math.random()-0.5));
  		console.log(`>>>>>>>>>> Chip ${rfid} will drop in ${demoTarget} shoots (${chip.entry + demoTarget}) (numOfChips:${numOfChips})`);
  		chip.demoTarget = chip.entry + demoTarget;
  	}
		_common.table[rfid] = chip;
		_log.info('manager', 'Pushed', rfid, _common.sessionId);
		send2Mgr('ChipPushed', {rfid, dispenser, pending, table:currentTable()});
		if (_reshuffleStatus.seeding) pushInReshuffle();
  } else {
  	send2Mgr('ChipRemoved', {rfid, dispenser, pending, table:currentTable()});
    _log.info('manager', 'Removed', rfid, _common.sessionId);
  }
}

function changeStatus(newStatus) {
	// Do the required stuff...
	// ...
	_myStatus = newStatus;
	statusReport();
}

function reBoot() {
	_log.info('manager', 'Reboot', _common.sessionId);
	breakup();
	stop();
	send2Mgr('Reboot');
	messanger.close();
	if (_common.demoMode) {
		setTimeout(_common.restart, 5000);
	} else {
		setTimeout(() => { _common.driver.reboot() }, 10000);
	}
}

function exit() {
	_log.info('manager', 'Exit', _common.sessionId);
	stop();
	_common.driver.exit();
	send2Mgr('Exit');
	setTimeout(() => { process.exit() }, 5000);
}

function statusReport() {
//	if (_statusReportTO) clearTimeout(_statusReportTO);
//	_statusReportTO = setTimeout(statusReport, StatusReportInterval);

  _log.info('manager', 'Status', {application:_myStatus, faults:_faults}, _common.sessionId);

  // Do not use send2Mgr! 
	messanger.sendTo(_toMgrQueue, {type:'Status', status:{application:_myStatus, faults:_faults}, sessionId:_common.sessionId}, true);
	_faults = []
}

function addFault(module, error, details) {
	send2Mgr('error', {module, error, details});

	// _faults.push({module, fault});
	// if (immediate) statusReport();
}

function coinShot(remainingCoins) {
	if (_myStatus!=STATUS.RESHUFFLE) send2Mgr('Coin', {remaining:remainingCoins});
}

function updatePosition(angle) {
	if (_myStatus!=STATUS.RESHUFFLE) send2Mgr('Position', {angle});
}

function validateSession(session) {
	if (!_common.sessionId || session != _common.sessionId) throw "Wrong session!";
}

function chipDrop(rfid) {
	let chip = _common.table[rfid];
	if (chip) {
		let duration = _common.coinCounter - chip.entry;
		if (chip.status!='dropped') {
			_log.info('manager', 'ChipDrop', {rfid, duration}, _common.sessionId);
			chip.status = 'dropped';
		} else {
			_log.warning('manager', 'ChipDroppedAgain', rfid, _common.sessionId);
			addFault('manager',`ChipDroppedAgain ${rfid}`);
		}
		_log.debug('manager', 'Table',	_common.table, _common.sessionId);
	} else {
		_log.warning('manager', 'UnknownChipDrop', rfid, _common.sessionId);
	}
	send2Mgr('ChipDrop', {rfid,table:currentTable()});
  _common.player.chipDrop();
}

function currentTable() {
	ret = [];
	Object.keys(_common.table).forEach(rfid => {
		if ( _common.table[rfid].status == 'pushed') ret.push(rfid);
	});
	return ret;
}

function driverFault(module, error, details) {
	send2Mgr('error', {module, error, details});
	
	// addFault(_module, message, true);
	// if (message.hasOwnProperty('error')) {
	// 	switch (message.error) {
	// 		case 'Dispensing failed':
	// 			send2Mgr('DispensingFailed', { dispenser: message.dispenser });
	// 			break
	// 		default:
	// 			break;
	// 	}
	// }
	// if (autostop) {
	// 	if (_common.sessionId) breakup();
	// 	changeStatus(STATUS.STOPPED);
	// }
}

function send2Mgr(type, data, correlationId=null) {
	messanger.sendTo(_toMgrQueue, {type, sessionId:_common.sessionId, correlationId:(correlationId||uid2(36)), ...data} );
}

var manager = {
	init,
	handle,
	playerReady,
	playerLost,
	coinShot,
	stopReshuffle,
	position:updatePosition,
	addFault,
	validate:requestChipValidation,
	chipDrop,
	deviceStatus,
	pushCompleted,
	driverFault,
	report: send2Mgr,
	chipDetection: _ => {send2Mgr('ChipDetection');},
	currentTable,
};

module.exports = manager;
