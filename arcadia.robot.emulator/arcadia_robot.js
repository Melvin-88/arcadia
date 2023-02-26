
/////////////////////////////////////////////////////
// Initialize logging
/////////////////////////////////////////////////////
const uid2 = require('uid2');
process.env['GOOGLE_APPLICATION_CREDENTIALS'] = "gcp_cloud_logging.json"
const logger    = require('./modules/logger.js');

const arcadiaServerURL = process.argv[2] || process.env.GAME_CORE_API_HOST; // ? `http://${process.env.GAME_CORE_API_HOST}:3000/api/v1`
let   serial           = process.argv[3] || process.env.SERIAL || hardwareSerial();
const secretKey        = process.argv[4] || process.env.SECRET || 'arcadia-robots-secret-1';
const demoMode         = (process.argv[5]=='demo' || [1, true,'true','True'].includes(process.env.ROBOT_DEMO_MODE))
let   logLevel         = process.argv[6] || 'DEBUG';
const remoterPort      = process.argv[8] || process.env.PORT || 3001; // argv[7] is for demochips in driver.js
let   demomcpd         = 120;

process.on('uncaughtException', (err, origin) => {
	console.log(`-------- Caught exception: ${err}, exception origin: ${origin} ------`);
});

console.log(`Arcadia Server URL ${arcadiaServerURL}`);
console.log(`Serial: ${serial}`);
console.log(`SecretKey ${secretKey}`);
console.log(`demo mode is ${demoMode}`);

if (!demoMode) logger.init(serial); // Init cloud logging
logger.setLevel(logLevel);
logger.info("main", "init", "Robot controller starting")

const remoter   = require('express')();
const {sleep}   = require('sleep');
const player    = require('./modules/player.js');
const manager   = require('./modules/manager.js');
const driver    = require('./modules/driver.js');
const jsonHttp  = require('./modules/httpGetJson.js');

let common = {
	player,
	manager,
	driver,
	logger,
	serial,
	demoMode,
	demomcpd,
	table:{},
	coinCounter: 0,
	restart:connectToServer
};

async function connectToServer() {
  let connected = false;

	console.log(`Trying to connect arcadia server at ${arcadiaServerURL}`);
	await jsonHttp.get(`${arcadiaServerURL}/robots/login?serial=${serial}&key=${secretKey}&env=emu`)
	.then((hostData) => {
		console.log(`host data: ${JSON.stringify(hostData)}`);
		common.key = hostData.robotKey;
		manager.init(common, hostData.mgrMessageServer, hostData.queues);
		player.init(common, hostData.playerMessageServer);
		connected = true;
	}).catch((err) => {
		console.log(err);
		console.log("No server. Retrying in 10 sec");
	});
	if (!connected) setTimeout(connectToServer, 10000);
}

function hardwareSerial() {
	try {
		require('fs').readFileSync('/proc/cpuinfo', 'utf-8').split(/\r?\n/).forEach(function(line) {
			if (line.startsWith('Serial')) {
				return "Rasp_" + line.substring(line.length-8, line.length);
			}
		});
	} catch (e) {}
	return "Demo_" + uid2(8);
}

driver.init(common).then(_ => {
	console.log('driver connected');
	connectToServer();
});

/////////////////////////////////////////////////////
// Remoter handler

function remoterValid(req,res) {
	let _serial = req.query.serial;
	if (_serial!=serial) {
		res.status(400).json({status:'err', msg:"wrong number!"});
		return false;
	}
	return true;
}

remoter.get('/loglevel', async (req, res) => {
	if (!remoterValid(req,res)) return;

	let _level = req.query.level;
	logger.setLevel(_level);
	driver.setLogLevel(_level);
	res.json({status:'ok', level:_level});
});

remoter.get('/exit', async (req, res) => {
	if (!remoterValid(req, res)) return;
	console.log('Exiting arcadia robot...');
	manager.handle({action: "exit"});
	res.json({ status: 'ok'});
});

if (demoMode) {
	remoter.get('/mcpd', async (req, res) => {
		if (!remoterValid(req,res)) return;
		let mcpd = Number(req.query.mcpd);
		logger.info("REMOTER", "mcpd", mcpd);
		let deltamcpd = mcpd - common.demomcpd;
		for (rfid in common.table) {
			let chip = common.table[rfid];
			if (chip.status=='pushed') chip.demoTarget += deltamcpd;
		}
		common.demomcpd = mcpd;
		res.json({status:'ok', mcpd});
	});

	remoter.get('/detection', async (req, res) => {
		if (!remoterValid(req,res)) return;
		logger.info("REMOTER", "detection");
	  manager.chipDetection();
	  player.chipDetection();
		res.json({status:'ok'});
	});

	remoter.get('/drop', async (req, res) => {
		if (!remoterValid(req,res)) return;
		let rfid = req.query.rfid;
		logger.info("REMOTER", "drop", rfid);
	  manager.chipDrop(rfid);
		res.json({status:'ok', rfid});
	});

	remoter.get('/fault', async (req, res) => {
		if (!remoterValid(req,res)) return;
		let mod = req.query.module;
		let err = req.query.error;
		logger.info("REMOTER", "fault", mod, err);
		manager.addFault(mod, err, {details:`Simulated error`});
		res.json({status:'ok', mod, err});
	});

	remoter.get('/crash', async (req, res) => {
		if (!remoterValid(req,res)) return;
		logger.info("REMOTER", "crash");
		res.json({status:'ok'});
		setTimeout(process.exit, 1000);
	});

	remoter.get('/nextpush', async (req, res) => {
		if (!remoterValid(req,res)) return;
		let rfid = Number(req.query.rfid);
		logger.info("REMOTER", "nextpush", rfid);
	  driver.demoNextPush(rfid);
		res.json({status:'ok', rfid});
	});

	remoter.get('/chipstate', async (req, res) => {
		if (!remoterValid(req,res)) return;
		logger.info("REMOTER", "nextpush");
	  let chipstate = {dispensers:driver.demoDispensers(), table:manager.currentTable()};
		res.json({status:'ok', chipstate});
	});
}

try {
	if (Number(remoterPort)) {
		remoter.listen(remoterPort, _ => {console.log('!');});
		console.log(`Remoter listening on ${remoterPort}`);
	} else
		console.log(`!! Remoter not Initialized`);
} catch (e) {
	console.log(`! Remoter could not be started`);
}

