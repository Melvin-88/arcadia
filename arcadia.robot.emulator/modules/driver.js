const http = require('http');
const WebSocket = require('ws');
const url = require('url');
const uid2 = require('uid2');

const { spawn } = require("child_process");
const server = http.createServer();
const wSocket = new WebSocket.Server({ noServer: true });

let _common = null;
let _log = null;
let _ws = null;
let angle = 0;
let demoMode = true;

let demoPendingValidation = {};
let demoDispensingFailures = {};
let demoDispenserStack = {};
let demoLooseChips = {};
let demoPendingPushCommands = 0;
let _demoNextPush = null;

function runServer(success) {
  server.on('upgrade', function upgrade(request, socket, head) {
    const pathname = url.parse(request.url).pathname;

    if (pathname === '/driver') {
      wSocket.handleUpgrade(request, socket, head, (ws) => {wSocket.emit('connection', ws, request);});
    } else {
      socket.destroy();
    }
  });

  wSocket.on('connection', (ws, request) => {
    _ws = ws;
    ws.on('message', message => {
      _log.debug('driverConn', 'from driver', message);
      let msg = JSON.parse(message);
      driverHandler(msg);
    });
    ws.on('close', (conn) => {
      _ws = null;
      _log.error('driverConn', '', 'connection closed');
    });
    success(); // Allows robot.js to make server communication
  });
}

function init(common) {
  _common = common;
  _log = _common.logger;
  demoMode = _common.demoMode;
  return new Promise((resolve, reject) => {
    if (demoMode) {
      _log.debug('driverConn', 'Init', 'Working in DEMO MODE');
      setTimeout(resolve, 2000);
    }
    else {
      runServer(resolve);
      server.listen(8080);
      _log.debug('driverConn', 'Init', "Listening");
    }
  });
}

function toDriver(message) {
  if (!_ws) {
    _log.error('driverConn', '', 'driver not connected');
    _common.manager.addFault('driver', 'no connection to driver', {});
    return;
  }
  _log.debug('driverConn', 'to driver', message);
  _ws.send(JSON.stringify(message));
}

function setAngle(angle) {
  if (demoMode) {
     _log.debug('driverConn','to driver',`Driver moving to ${angle}`);
    setTimeout(()=>{driverHandler({action:'moved', angle:angle})}, 2000);
    return;
  }
  toDriver({action:"setangle", angle:angle});
}

function shoot() {
  if (demoMode) {
    setTimeout(()=>{driverHandler({action:'fired'})}, 100);
    return;
  }
  toDriver({action:"shoot"});
}
function move(direction) {
    if (demoMode) {
        setTimeout(() => { driverHandler({ action:'moved'}) }, 500);
        return;
    }
    toDriver({action:"move", direction});
}

function demoNextPush(rfid) {
  if (!demoMode) {
    _log.error('driverConn', 'demoNextPush'); 
    throw('Demo action in Production');
  }
  _demoNextPush = {rfid:rfid||''};
  _log.info('driverConn', 'demoNextPush', {nextpush:_demoNextPush});
}

function demoDispensers() {
  if (!demoMode) return {};
  return demoDispenserStack;
}

function push(dispenser, demoRepeated = false) {
  if (demoMode) {
    if (!demoRepeated) {
			demoPendingPushCommands += 1;
			console.log(`PUSH pending: ${demoPendingPushCommands}`);
		}
  	let rfid;
    if (_demoNextPush) {
      rfid = _demoNextPush.rfid;
      _demoNextPush = null;
    } else {
      if (demoDispenserStack[dispenser] && Array.isArray(demoDispenserStack[dispenser]) && demoDispenserStack[dispenser].length>0)
        rfid = demoDispenserStack[dispenser].pop();
      else
        rfid = `${dispenser}_${uid2(4)}`;
    }
    if (rfid && rfid!=''){
      demoPendingValidation[rfid] = dispenser;
      demoLooseChips[rfid] = dispenser;
      setTimeout(()=>{driverHandler({action:'validate', rfid, dispenser})}, 1000*demoPendingPushCommands);
    } else {
      driverHandler({"action":"fault", "module":'DispensingManager', 'error':'Dispensing failed', "message":{'dispenser':dispenser}});
    }
    return;
  }
  toDriver({action:'push', dispenser});
}

function stop() {
  if (demoMode) {
    demoPendingValidation = {};
    demoDispensingFailures = {};
    demoLooseChips = {};
    demoPendingPushCommands = 0;
    setTimeout(()=>{driverHandler({action:'stopped'})}, 2000);
    return;
  }
  toDriver({action:"stop"});
}

function reboot() {
     toDriver({ action: "reboot" });
}

function exit() {
    toDriver({ action: "exit" });
}

function run() {
  if (demoMode) {
    demoLoadChips(_common);
    setTimeout(()=>{driverHandler({action:'ready'})}, 2000);
    return;
  }
  toDriver({action:"run"});
}

function validation(rfid, status) {
  if (demoMode) {
    let dispenser = demoPendingValidation[rfid];
    delete demoPendingValidation[rfid];
    if (status=='invalid') {
      demoDispensingFailures[dispenser] = (demoDispensingFailures[dispenser] ? demoDispensingFailures[dispenser]+1 : 1);

      if (demoDispensingFailures[dispenser]==3) {
        driverHandler({action:'fault', module:'DispensingManager', details:{dispenser, error:'Dispensing failed'}});
      } else {
        push(dispenser, true);
      }
    }

    setTimeout(_=>{
    	if (status=='valid') { 
		  	console.log(`PUSH COMPLETED pending: ${demoPendingPushCommands}`);
    		demoPendingPushCommands -= 1;
    	}
    	driverHandler({action:(status=='valid' ? 'pushed' : 'removed'), rfid, dispenser, queued:demoPendingPushCommands})
    }, 1000);
    return;
  }
  if (status=='valid')
    toDriver({action:'validated', rfid:rfid});
  else
    toDriver({action:'invalidated', rfid:rfid});
}

function setLogLevel(level) {
  toDriver({action:'logLevel', level});
}

function readAngle() {return angle;}

function simulatedShot() {
  Object.keys(_common.table).forEach (rfid => {
    let chip = _common.table[rfid];
    if (chip.status=='pushed' && chip.demoTarget <= _common.coinCounter) {
      chip.status = 'pendingDrop';
      driverHandler({action:'chip_detection'});
      setTimeout(_=>{driverHandler({action:'chip_drop',rfid});},1000);
    }
  });
}

function simulatedReload(rfid) {
  let dispenser = demoLooseChips[rfid];
  if (dispenser) {
    delete demoLooseChips[rfid];
    demoDispenserStack[dispenser].unshift(rfid);
  }
}

function driverHandler(msg) {
  switch (msg.action) {
    case 'fired':
      _common.player.fired();
      if (_common.demoMode) simulatedShot();
      break;
    case 'moved':
      angle = msg.angle;
      _common.player.movedTo(msg.dir, msg.angle);
      break;
    case 'validate':
      _common.manager.validate(msg.rfid, msg.dispenser);
      break;
    case 'chip_drop':
      _common.manager.chipDrop(msg.rfid);
      if (_common.demoMode) simulatedReload(msg.rfid);
      break;
    case 'chip_detection':
      _common.manager.chipDetection();
      _common.player.chipDetection();
      break;
    case 'ready':
    case 'stopped':
      _common.manager.deviceStatus(msg.action);
      break;
    case 'pushed':
    case 'removed':
      _common.manager.pushCompleted(msg.rfid, msg.action=='pushed', msg.dispenser, msg.queued);
      break;
    case 'fault':
      _common.manager.addFault(msg.module, msg.error, msg.details);
      break;
    case 'log':
      _log.write(msg.severity, {module:msg.module, action:msg.driverAction, text:msg.text, sessionId:_common.sessionId})
      break;
    default:
      if (msg.status && msg.status=='error') {
        _common.manager.addFault('driver', msg.messege, {});
        _log.error('driverConn', 'Driver', msg);
      } else
        _log.error('driverConn', 'Unknown', msg)
      break;
  }
}

module.exports = {
  init,
  run,
  stop,
  setAngle,
  push,
  shoot,
  move,
  angle: readAngle,
  validation,
  setLogLevel,
  reboot,
  exit,
  demoNextPush,
  demoDispensers
};
 //============================================================
 function demoLoadChips(common) {
  const fs = require('fs');
  const path = require('path');
  const ChipsStoragePath = process.argv[7] || process.env.CHIP_STORAGE_PATH || '/storage';
  let chipsString;
  try {
    chipsString = fs.readFileSync(path.join(ChipsStoragePath, `chips_${common.serial}.json`));
  } catch (e) {
    chipsString = fs.readFileSync('demochips.json');
  }
  demoDispenserStack = JSON.parse(chipsString);
  console.log(JSON.stringify(demoDispenserStack, null,2));
}