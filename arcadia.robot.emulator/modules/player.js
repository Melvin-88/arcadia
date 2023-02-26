
const { sleep } = require('sleep');

let coins = 0;
let _angle = 0;
const maxAngle = 30;
const tiltStep = 1;
let status = "off";
let gunTimer = null;
let fireState = "cease";
let gunState  = "idle"
let moveTimer = null;
let response = null;
let engageTimeout = null;

let _common    = null;
let _messanger = null;
let _channel   = null;
let _autoShoot = false;
let _autoMove  = false;
let _log       = null;

function init(common, playerMessageServer) {
  _common = common;
  _log = _common.logger;
  try {
    _messanger = require('./RedisMessanger')(playerMessageServer);
    _messanger.on('player2robot', handlePlayer);
    _log.info('player','Init', 'Player initialized');
  } catch (e) {
    _log.error('player','Init',`Redis could not be initialized: ${e}`);
  }
}

function engage(session) {
  _channel = `robot_${_common.serial}__p_${session}`;
  _messanger.join(_channel);
  _common.driver.setAngle(0);
  status = "waitingForPlayer";
  setTimeout(_ => {sendToPlayer({action:"ready"});}, 2000);
  engageTimeout = setTimeout(_ => {return ((x) => {playerDidntCome(x)})(session)}, 7000);
}

function playerDidntCome(session) {
  status = 'off';
  _common.manager.playerLost(session);
}

function setCoins(newVal) {
  if ((!newVal || !Number(newVal)) && !(newVal===0)) {
    _log.error('player','setCoins', `${newVal} is not a number`, _common.sessionId);
    return;
  }
  _log.info('player','setCoins', `Loading ${newVal} coins`, _common.sessionId);
  coins = Number(newVal);
  sendToPlayer({action:"approved", coins});
  sendToPlayer({action:'moving', angle:_common.driver.angle()});
  if (_autoShoot) fire();
}

function breakup() {
  ceaseFire();
  coins = 0;
  try {
    sendToPlayer({action:"denied"});
    _messanger.leave(_channel);
    stopAuto();
  } catch (e) {} // The player may no longer be connected
  _channel = null;
}

function reshuffle(coins) {
	status = 'reshuffle';
	setCoins(coins);
	setAuto('auto');
}

function stopReshuffle() {
	status = 'off';
	stopAuto();
	_common.manager.stopReshuffle();
}

function handlePlayer(msg) {
  let action = msg.action;
  _log.debug('player','handlePlayerAction',msg, _common.sessionId);
  if (action=='init') {
    if (status=='waitingForPlayer') {
    	if (engageTimeout) {
    		clearTimeout(engageTimeout);
    		engageTimeout = null;
    	}
      _common.manager.playerReady(msg);
      status = 'playing';
			return;
		} else {
			_log.error('player','UnknownPlayer', `Connected while not waiting on ${_channel}`, _common.sessionId);
			return
		}
	}
  if (action=='userLeft') return;

  try {
    playerActions[action](msg);
  } catch (e) {
    _log.error('player','handlePlayerAction', e, _common.sessionId);
    _log.error('player','UnknownPlayerAction', {msg:e.message}, _common.sessionId);
  }
}

function setAuto(swingMode) {
	_log.debug('player','auto',{swingMode}, _common.sessionId);
	if (swingMode === 'auto') startAutoMove();

	_autoShoot = true;
	fireState = "fire";
  fire();
}

function stopAuto() {
  if (gunTimer) clearInterval(gunTimer);
  gunTimer = null;
  _autoShoot = false;
  fireState = 'cease';
  stopAutoMove();
}

function stopAutoMove() {
  _autoMove = false;
  //_common.driver.setAngle(0);
}

function startAutoMove() {
  _autoMove = true;
  autoMove();
}

function setSwingMode(msg) {
  if (!_autoShoot) {
    sendToPlayer({ error: "not in auto mode" });
    return;
  }
  if (msg.mode.toLowerCase()==='manual' && _autoMove) {
    stopAutoMove();
  }
  if (msg.mode.toLowerCase()==='auto' && !_autoMove) {
    startAutoMove();
  }
}

function autoMove() {
  if (_common.driver.angle() < 0)
    _common.driver.setAngle(100);
  else
    _common.driver.setAngle(-100);
}

function quit(msg) {
  if (gunTimer) clearInterval(gunTimer);
  status = "off";
}

function setAngle(msg) {
  if (status == "off") {
    sendToPlayer({ error: "not in play mode" });
    return;
  }
  if (_autoMove) {
    sendToPlayer({ error: "In autotomatic mode" });
    return;
  }

  let angle = msg.angle;
    if (angle != undefined  && Number(angle)!=undefined) {
    _common.manager.report('setAngle');
    _common.driver.setAngle(angle);
  }
  else
    _log.warning('player','setAngle',`Ilegal angle ${angle}`, _common.sessionId);
}

function stopMoving(msg) {
  _log.warning('player','stopMoving', 'Does this ever happen?', _common.sessionId);
  _common.manager.report('StopMoving', msg);
}

function movedTo(dir, angle) {
  _log.debug('player','MovedTo', {angle});
  if (_autoMove) {
    setTimeout(autoMove, 200); // change sides! // Timer use to avoid stack recursion
  }

  sendToPlayer({action:'moving',angle});
  _common.manager.position(angle);
}

function openFire(msg) {
    if (status == "off" || fireState == "fire") {
        _log.warning('player', 'openFire', `Cannot open fire in ${status} status ${fireState} fireState`, _common.sessionId);
        send({ error: 'off' });
        return;
    }
    if (_autoShoot) {
        _log.warning('player', 'openFire', "Cannot open fire while in autotomatic mode", _common.sessionId);
        sendToPlayer({ error: "In autotomatic mode" });
        return;
    }
    if (gunState == "idle") {
        _common.manager.report('Fire');
        fireState = "fire";
        _log.debug('player', 'openFire', "Opening fire!");
        fire(); // to make sure at least one coin shot
    }
    else {
        setTimeout(openFire(msg), 1000);
    }
}

function ceaseFire(msg) {
    if (status == "off" || fireState == "cease") {
    send({error:'off'});
    return;
  }
  fireState = "cease";
  if (gunTimer) clearInterval(gunTimer);
  gunTimer = null;
  _common.manager.report('CeaseFire');
}

function fire() {
  if (coins > 0 && (status == "playing" || status == 'reshuffle')) {
    gunState = "fire"
    _common.driver.shoot();
  } else {
    if (coins == 0) {
      send({ action: "empty" });
      return;
    } else {
	    _log.warning('player','fire',`Cannot open fire in status ${status}`);
    }
  }
}

function fired() {
  _log.debug('player', `coin fired, coins=${coins}`);
  gunState = "idle"
  if (coins > 0) {
    coins -= 1;
    sendToPlayer({ action: 'blast', coins: coins });
    _common.coinCounter += 1;
    _common.manager.coinShot(coins);
    if (fireState == "fire" && coins > 0) {
      gunTimer = setTimeout(fire, 300); // until cease fire
    }
  }
  if (coins==0) {
    if (gunTimer)            clearTimeout(gunTimer);
    if (status=='reshuffle') stopReshuffle();
    if (_autoMove)           stopAuto();
  }
}

function send(msg) {
  if (!response) return;
  response.send(JSON.stringify(msg));
}

function sendToPlayer(msg) {
	if (!_channel) return; // Happens in reshuffle

  _log.debug('player','sendToPlayer', msg, _common.sessionId);
 _messanger.to(_channel).emit('robot2player', msg);
}

let playerActions = {
  setAngle,
  stopMoving,
  setSwingMode,
  openFire,
  ceaseFire,
  quit
};

var player = {
  init,
  engage,
  breakup,
  setCoins,
  setAuto,
  stopAuto,
  fired,
  movedTo,
  reshuffle,
  chipDetection: (_) => {sendToPlayer({action:'ChipDetection'}); },
  chipDrop:      (_) => {sendToPlayer({action:'ChipDrop'}); }
};

module.exports = player;
