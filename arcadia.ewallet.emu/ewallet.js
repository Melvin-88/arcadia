const express = require('express');
const app = express();

const API_PORT = process.env.API_PORT || 3001;

var players = {};

app.get('/login', function(req, res) {
  res.json({ status: 'ok', token: 'abc123' });
});

app.get('/set', function(req, res) {
  try {
    if (!checkToken(res, req.query.token)) return;
    if (!req.query.currency || !req.query.balance) {
      error(res, `Please supply balance and currency`);
      return;
    }
    players[req.query.cid] = { balance: parseInt(req.query.balance), currency: req.query.currency };
    responseFor(res, req.query.cid);
    console.log(`Set ${req.query.cid} to ${players[req.query.cid].balance} ${players[req.query.cid].currency}`);
  } catch (e) {
    error(res, `Set error: ${e.message}`);
  }
});

app.get('/balance', function(req, res) {
  try {
    if (!checkToken(res, req.query.token)) return;
    if (!checkPlayer(res, req.query.cid)) return;

    responseFor(res, req.query.cid);
    console.log(`Balance of ${req.query.cid} is ${JSON.stringify(players[req.query.cid])}`);
  } catch (e) {
    error(res, `Balance error: ${e.message}`);
  }
});

app.get('/wager', function(req, res) {
  try {
    if (!checkToken(res, req.query.token) || !checkPlayer(res, req.query.cid)) return;

    if ('wager' in players[req.query.cid]) {
      error(res, 'Wager already open');
      return;
    }

    let sum = parseInt(req.query.sum);
    if (sum <= players[req.query.cid].balance) {
      players[req.query.cid].balance = players[req.query.cid].balance - sum;
      players[req.query.cid].wager = sum;
      responseFor(res, req.query.cid);
      console.log(`Wager ${req.query.cid} ==> ${sum}`);
    } else {
      error(res, `Wager error: Insuffecient funds`);
    }
  } catch (e) {
    error(res, `Wager error: ${e.message}`);
  }
});

app.get('/cancelWager', function(req, res) {
  try {
    if (!checkToken(res, req.query.token) || !checkPlayer(res, req.query.cid) || !checkWager(res, req.query.cid)) return;

    players[req.query.cid].balance = players[req.query.cid].balance + players[req.query.cid].wager;
    console.log(`Cancelled wager of ${players[req.query.cid].wager} for ${req.query.cid}`);
    delete players[req.query.cid].wager;
    responseFor(res, req.query.cid);
  } catch (e) {
    error(res, `Cancel wager error: ${e.message}`);
  }
});

app.get('/payout', function(req, res) {
  try {
    if (!checkToken(res, req.query.token) || !checkPlayer(res, req.query.cid) || !checkWager(res, req.query.cid)) return;

    let sum = parseInt(req.query.sum);
    players[req.query.cid].balance = players[req.query.cid].balance + sum;
    delete players[req.query.cid].wager;
    responseFor(res, req.query.cid);
  } catch (e) {
    error(res, `Payout error: ${e.message}`);
  }
});

app.get('/jackpot', function(req, res) {
  try {
    if (!checkToken(res, req.query.token) || !checkPlayer(res, req.query.cid) || !checkWager(res, req.query.cid)) return;

    responseFor(res, req.query.cid);
    console.log(`${req.query.cid} won a jackpot of ${req.query.sum}`);
  } catch (e) {
    error(res, e.message);
  }
});

app.listen(API_PORT, function() {
  console.log('eWallet is running');
});

function responseFor(res, cid) {
  res.json({ status: 'ok', ...players[cid] });
}

function error(res, msg) {
  res.json({ status: 'error', message: msg });
  console.log(`Error: ${msg}`);
}

function checkToken(res, token) {
  if (token == 'abc123') return true;
  error(res, `Authentication error ${token}`);
  return false;
}
function checkPlayer(res, cid) {
  if (cid in players) return true;
  error(res, `No such player ${cid}`);
  return false;
}
function checkWager(res, cid) {
  if ('wager' in players[cid]) return true;
  error(res, `No wager placed`);
  return false;
}
