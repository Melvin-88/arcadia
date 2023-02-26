/* eslint-disable max-lines */
const app = require('express')();
const redisAdapter = require('socket.io-redis');
const redis = require('ioredis');
const server = require('http')
  .createServer(app);
const io = require('socket.io')(server, { pingInterval: 5000 });
const { v4: uuidv4 } = require('uuid');
const { CoreClient } = require('./core-client');
const { RobotClient } = require('./robot-client');
const { DisconnectTimer } = require('./disconnect-timer');
const PlayerMessageType = require('./player.message.type');
const configService = require('./config/config.service');
const logger = require('./logger');

const clientDataExtractor = data => {
  delete data.playerDirectRoomId;
  delete data.robotDirectRoomId;
  delete data.robotQueueRoomId;
  delete data.joinRobotDirectRoom;
  return data;
};

configService.getConfigs('./.env')
  .then(config => {
    const redisIo = redisAdapter({
      pubClient: new redis(config.redis),
      subClient: new redis(config.redis)
    });
    redisIo.pubClient.on('error', error => {
      logger.log(`${error.message}, ${error.stack}`);
    });
    redisIo.subClient.on('error', error => {
      logger.log(`${error.message}, ${error.stack}`);
    });
    io.adapter(redisIo);
    io.of('/')
      .adapter
      .on('error', error => {
        logger.log(`${error.message}, ${error.stack}`);
      });

    const coreClient = new CoreClient(config);

    // Health check
    app.get('/health', (_, res) => {
      res.sendStatus(200);
    });

    io.on('connection', client => {
      let userId = null;
      let sessionId = null;
      let playerDirectRoomId = null;
      let robotQueueRoomId = null;
      let robotDirectRoomId = null;

      logger.log(`connection: User { "socketId": "${client.id}" }.`);

      const robotClient = new RobotClient(io, client.id);
      const disconnectTimer = new DisconnectTimer(config.loginWaitTimeout, () => client.disconnect());

      client.on('disconnect', () => {
        const correlationId = uuidv4();
        logger.log(`disconnect: sessionId=${sessionId || 'no-session'}, correlationId=${correlationId}.`);

        if (robotDirectRoomId) {
          client.leave(robotDirectRoomId);
        }
        if (robotQueueRoomId) {
          client.leave(robotQueueRoomId);
        }
        if (playerDirectRoomId) {
          client.leave(playerDirectRoomId);
        }

        robotClient.sendToRobot({
          action: PlayerMessageType.PLAYER_LEFT,
          data: { correlationId },
          isVolatile: true,
          userId,
        });

        if (sessionId) {
          coreClient.sendMessage(PlayerMessageType.PLAYER_LEFT, {
            sessionId,
            correlationId,
          });
        }
      });

      client.on('login', async data => {
        if (!data) {
          logger.error('login: incoming data are undefined');
          return;
        }
        const correlationId = uuidv4();
        logger.log(`login: data=${JSON.stringify(data)}, correlationId=${correlationId}`);
        const {
          token,
          groupId,
          footprint
        } = data;
        disconnectTimer.restartTimer();
        try {
          const data = await coreClient.clientLogin(correlationId, token, groupId, footprint);
          userId = data.playerId;
          sessionId = data.sessionId;
          playerDirectRoomId = data.playerDirectRoomId;
          robotDirectRoomId = data.robotDirectRoomId;
          robotQueueRoomId = data.robotQueueRoomId;
          robotClient.setRoomIds(robotDirectRoomId, robotQueueRoomId);

          client.join(robotQueueRoomId);
          client.join(playerDirectRoomId);

          coreClient.sendMessage(PlayerMessageType.PLAYER_JOINED, {
            sessionId,
            correlationId,
          });

          disconnectTimer.stopTimer();

          logger.log(`User { "userId": "${userId}", "sessionId": "${sessionId}", "correlationId":"${correlationId}" } connected`);

          io.to(client.id)
            .emit('login', clientDataExtractor(data));
        } catch (error) {
          logger.log(`Failed to login, data: ${JSON.stringify(error.response?.data || {})}, message: ${error.message}`);
          io.to(client.id)
            .emit(PlayerMessageType.NOTIFICATION, {
              notificationId: 'loginFailed',
              title: 'Error',
              message: 'Login failed',
              command: null,
              data: null,
            });
          client.disconnect();
        }
      });

      client.on('restoreConnection', async params => {
        if (!params) {
          logger.error('restoreConnection: incoming data are undefined');
          return;
        }
        const {
          sessionId: sid,
          footprint
        } = params;

        const correlationId = uuidv4();
        logger.log(`restoreConnection: sessionId=${sid}, footprint=${footprint}, correlationId=${correlationId}`);
        disconnectTimer.restartTimer();

        const data = await coreClient.clientReconnect(correlationId, sid, footprint)
          .catch(error => {
            logger.log(`Failed to verify reconnect, data: ${JSON.stringify(error.response?.data || {})}, message: ${error.message}`);
            io.to(client.id)
              .emit(PlayerMessageType.NOTIFICATION, {
                notificationId: 'restoreConnectionFailed',
                title: 'Error',
                message: 'Restore connection failed',
                command: null,
                data: null,
              });
            client.disconnect();
          });
        if (!data) {
          return;
        }
        userId = data.playerId;
        sessionId = data.sessionId;
        playerDirectRoomId = data.playerDirectRoomId;
        robotDirectRoomId = data.robotDirectRoomId;
        robotQueueRoomId = data.robotQueueRoomId;
        robotClient.setRoomIds(robotDirectRoomId, robotQueueRoomId);

        client.join(robotQueueRoomId);
        client.join(playerDirectRoomId);
        const { joinRobotDirectRoom } = data;
        if (joinRobotDirectRoom) {
          client.join(robotDirectRoomId);
        }

        disconnectTimer.stopTimer();
        // eslint-disable-next-line max-len
        logger.log(`User { "userId": "${userId}", "sessionId": "${sessionId}", "footprint":"${footprint}", "correlationId":"${correlationId}" } reconnected`);

        io.to(client.id)
          .emit('restoreConnection', clientDataExtractor(data));

        coreClient.sendMessage(PlayerMessageType.PLAYER_JOINED, {
          sessionId,
          reconnect: true,
          correlationId,
        });
      });

      client.on(PlayerMessageType.BUY_STACKS, params => {
        if (!params) {
          logger.error(`${PlayerMessageType.BUY_STACKS}: incoming data are undefined`);
          return;
        }

        const {
          stacks,
          voucherId,
        } = params;

        // todo: param validation
        if (!userId) {
          return;
        }
        const correlationId = uuidv4();
        logger.log(`${PlayerMessageType.BUY_STACKS}: sessionId=${sessionId}, stacks=${stacks}, correlationId=${correlationId}.`);

        client.join(robotDirectRoomId);

        coreClient.sendMessage(PlayerMessageType.BUY_STACKS, {
          sessionId,
          stacks,
          voucherId,
          correlationId,
        });
      });

      client.on(PlayerMessageType.ENABLE_AUTOPLAY, data => {
        if (!userId) {
          return;
        }
        const correlationId = uuidv4();
        logger.log(`${PlayerMessageType.ENABLE_AUTOPLAY}: sessionId=${sessionId}, config=${JSON.stringify(data)}, correlationId=${correlationId}.`);

        coreClient.sendMessage(PlayerMessageType.ENABLE_AUTOPLAY, {
          sessionId,
          autoplay: data,
          correlationId,
        });
      });

      client.on(PlayerMessageType.DISABLE_AUTOPLAY, () => {
        if (!userId) {
          return;
        }
        const correlationId = uuidv4();
        logger.log(`${PlayerMessageType.DISABLE_AUTOPLAY}: sessionId=${sessionId}, correlationId=${correlationId}.`);

        coreClient.sendMessage(PlayerMessageType.DISABLE_AUTOPLAY, {
          sessionId,
          correlationId,
        });
      });

      client.on(PlayerMessageType.BALANCE, () => {
        if (!userId) {
          return;
        }
        const correlationId = uuidv4();
        logger.log(`${PlayerMessageType.BALANCE}: sessionId=${sessionId}, correlationId=${correlationId}.`);
        coreClient.sendMessage(PlayerMessageType.BALANCE, {
          sessionId,
          correlationId,
        });
      });

      client.on(PlayerMessageType.ENABLE_BET_BEHIND, data => {
        if (!userId) {
          return;
        }
        const correlationId = uuidv4();
        logger.log(`${PlayerMessageType.ENABLE_BET_BEHIND}: sessionId=${sessionId}, config=${JSON.stringify(data)}, correlationId=${correlationId}`);
        coreClient.sendMessage(PlayerMessageType.ENABLE_BET_BEHIND, {
          sessionId,
          betBehind: data,
          correlationId,
        });
      });

      client.on(PlayerMessageType.DISABLE_BET_BEHIND, () => {
        if (!userId) {
          return;
        }
        const correlationId = uuidv4();
        logger.log(`${PlayerMessageType.DISABLE_BET_BEHIND}: sessionId=${sessionId}, correlationId=${correlationId}`);
        coreClient.sendMessage(PlayerMessageType.DISABLE_BET_BEHIND, {
          sessionId,
          correlationId,
        });
      });

      client.on(PlayerMessageType.SET_SWING_MODE, params => { // mode: 'auto' | 'manual'
        if (!params) {
          logger.error(`${PlayerMessageType.SET_SWING_MODE}: incoming data are undefined`);
          return;
        }

        const { mode } = params;

        if (!userId) {
          return;
        }
        const correlationId = uuidv4();
        logger.log(`${PlayerMessageType.SET_SWING_MODE}: sessionId=${sessionId}, mode=${mode}, correlationId=${correlationId}`);
        robotClient.sendToRobot({
          action: PlayerMessageType.SET_SWING_MODE,
          data: {
            mode,
            correlationId,
          },
          isVolatile: true,
          userId,
        });
        coreClient.sendMessage(PlayerMessageType.SET_SWING_MODE, {
          sessionId,
          mode,
          correlationId,
        });
      });

      client.on(PlayerMessageType.READY_FOR_NEXT_ROUND, () => {
        if (!sessionId) {
          return;
        }
        const correlationId = uuidv4();
        logger.log(`${PlayerMessageType.READY_FOR_NEXT_ROUND}: sessionId=${sessionId}, correlationId=${correlationId}`);
        coreClient.sendMessage(PlayerMessageType.READY_FOR_NEXT_ROUND, {
          sessionId,
          correlationId,
        });
      });

      client.on(PlayerMessageType.MOVE_RAIL, params => {
        if (!params) {
          logger.error(`${PlayerMessageType.MOVE_RAIL}: incoming data are undefined`);
          return;
        }

        const { direction } = params;

        if (!userId) {
          return;
        }
        const correlationId = uuidv4();

        logger.log(`${PlayerMessageType.MOVE_RAIL}: sessionId=${sessionId}, direction=${direction}, correlationId=${correlationId}.`);
        robotClient.sendToRobot({
          action: PlayerMessageType.MOVE_RAIL,
          data: {
            direction,
            correlationId,
          },
          isVolatile: true,
          userId,
        });
        coreClient.sendMessage(PlayerMessageType.MOVE_RAIL, {
          sessionId,
          direction,
          correlationId,
        });
      });

      client.on(PlayerMessageType.SET_ANGLE, params => {
        if (!params) {
          logger.error(`${PlayerMessageType.SET_ANGLE}: incoming data are undefined`);
          return;
        }

        const { angle } = params;

        if (!userId) {
          return;
        }
        const correlationId = uuidv4();

        logger.log(`${PlayerMessageType.SET_ANGLE}: sessionId=${sessionId}, angle=${angle}, correlationId=${correlationId}.`);
        robotClient.sendToRobot({
          action: PlayerMessageType.SET_ANGLE,
          data: {
            angle,
            correlationId,
          },
          isVolatile: true,
          userId,
        });
        coreClient.sendMessage(PlayerMessageType.SET_ANGLE, {
          sessionId,
          angle,
          correlationId,
        });
      });

      client.on(PlayerMessageType.STOP_RAIL, () => {
        if (!userId) {
          return;
        }
        const correlationId = uuidv4();

        logger.log(`${PlayerMessageType.STOP_RAIL}: sessionId=${sessionId}, correlationId=${correlationId}.`);
        robotClient.sendToRobot({
          action: PlayerMessageType.STOP_RAIL,
          data: { correlationId },
          isVolatile: true,
          userId,
        });
        coreClient.sendMessage(PlayerMessageType.STOP_RAIL, {
          sessionId,
          correlationId,
        });
      });

      client.on(PlayerMessageType.OPEN_FIRE, () => {
        if (!userId) {
          return;
        }
        const correlationId = uuidv4();

        logger.log(`${PlayerMessageType.OPEN_FIRE}: sessionId=${sessionId}, correlationId=${correlationId}.`);
        robotClient.sendToRobot({
          action: PlayerMessageType.OPEN_FIRE,
          data: { correlationId },
          isVolatile: true,
          userId,
        });
        coreClient.sendMessage(PlayerMessageType.OPEN_FIRE, {
          sessionId,
          correlationId,
        });
      });

      client.on(PlayerMessageType.CEASE_FIRE, () => {
        if (!userId) {
          return;
        }
        const correlationId = uuidv4();

        logger.log(`${PlayerMessageType.CEASE_FIRE}: sessionId=${sessionId}, correlationId=${correlationId}.`);
        robotClient.sendToRobot({
          action: PlayerMessageType.CEASE_FIRE,
          data: { correlationId },
          isVolatile: true,
          userId,
        });
        coreClient.sendMessage(PlayerMessageType.CEASE_FIRE, {
          sessionId,
          correlationId,
        });
      });

      client.on(PlayerMessageType.INIT, () => {
        if (!userId) {
          return;
        }
        const correlationId = uuidv4();

        logger.log(`${PlayerMessageType.INIT}: sessionId=${sessionId}, correlationId=${correlationId}.`);
        robotClient.sendToRobot({
          action: PlayerMessageType.INIT,
          data: { correlationId },
          isVolatile: true,
          userId,
        });
        coreClient.sendMessage(PlayerMessageType.INIT, {
          sessionId,
          correlationId,
        });
      });

      client.on(PlayerMessageType.VOUCHER, () => {
        if (!userId) {
          return;
        }
        const correlationId = uuidv4();
        logger.log(`${PlayerMessageType.VOUCHER}: sessionId=${sessionId}, correlationId=${correlationId}.`);
        coreClient.sendMessage(PlayerMessageType.VOUCHER, {
          sessionId,
          correlationId,
        });
      });

      client.on(PlayerMessageType.LIST_BETS, () => {
        if (!userId) {
          return;
        }
        const correlationId = uuidv4();
        logger.log(`${PlayerMessageType.LIST_BETS}: sessionId=${sessionId}, correlationId=${correlationId}.`);
        coreClient.sendMessage(PlayerMessageType.LIST_BETS, {
          sessionId,
          correlationId,
        });
      });

      client.on(PlayerMessageType.LEAVE_QUEUE, () => {
        if (!userId) {
          return;
        }
        const correlationId = uuidv4();
        logger.log(`${PlayerMessageType.LEAVE_QUEUE}: sessionId=${sessionId}, correlationId=${correlationId}.`);
        coreClient.sendMessage(PlayerMessageType.LEAVE_QUEUE, {
          sessionId,
          correlationId,
        });
      });

      client.on(PlayerMessageType.QUEUE_BALANCE, data => {
        if (!userId) {
          return;
        }
        const correlationId = uuidv4();
        const decision = data?.decision || 'reject';
        logger.log(`${PlayerMessageType.QUEUE_BALANCE}: sessionId=${sessionId}, decision: ${decision}, correlationId=${correlationId}`);
        coreClient.sendMessage(PlayerMessageType.QUEUE_BALANCE, {
          sessionId,
          decision,
          correlationId,
        });
      });

      client.on(PlayerMessageType.CANCEL_STACKS, () => {
        if (!userId) {
          return;
        }
        const correlationId = uuidv4();
        logger.log(`${PlayerMessageType.CANCEL_STACKS}: sessionId=${sessionId}, correlationId=${correlationId}.`);
        coreClient.sendMessage(PlayerMessageType.CANCEL_STACKS, {
          sessionId,
          correlationId,
        });
      });

      client.on(PlayerMessageType.ARM_SWING, () => {
        if (!userId) {
          return;
        }
        const correlationId = uuidv4();
        logger.log(`${PlayerMessageType.ARM_SWING}: sessionId=${sessionId}, correlationId=${correlationId}.`);
        coreClient.sendMessage(PlayerMessageType.ARM_SWING, {
          sessionId,
          correlationId,
        });
      });

      client.on(PlayerMessageType.ORIENTATION_CHANGED, params => {
        if (!params) {
          logger.error(`${PlayerMessageType.ORIENTATION_CHANGED}: incoming data are undefined`);
          return;
        }

        const { orientation } = params;

        if (!userId) {
          return;
        }
        const correlationId = uuidv4();

        logger.log(`${PlayerMessageType.ORIENTATION_CHANGED}: sessionId=${sessionId}, orientation=${orientation}, correlationId=${correlationId}.`);
        coreClient.sendMessage(PlayerMessageType.ORIENTATION_CHANGED, {
          sessionId,
          orientation,
          correlationId,
        });
      });

      client.on(PlayerMessageType.VIDEO, params => {
        if (!params) {
          logger.error(`${PlayerMessageType.VIDEO}: incoming data are undefined`);
          return;
        }

        const {
          status,
          type
        } = params;

        if (!userId) {
          return;
        }
        const correlationId = uuidv4();
        logger.log(`${PlayerMessageType.VIDEO}: sessionId=${sessionId}, correlationId=${correlationId}, status=${status}, type=${type}`);
        coreClient.sendMessage(PlayerMessageType.VIDEO, {
          sessionId,
          event: {
            status,
            type
          },
          correlationId,
        });
      });

      client.on(PlayerMessageType.SETTINGS_UPDATE, settings => {
        if (!userId) {
          return;
        }
        const correlationId = uuidv4();
        logger.log(`${PlayerMessageType.SETTINGS_UPDATE}: sessionId=${sessionId}, correlationId=${correlationId}, settings=${settings}`);
        coreClient.sendMessage(PlayerMessageType.SETTINGS_UPDATE, {
          sessionId,
          settings,
          correlationId,
        });
      });

      client.on(PlayerMessageType.MENU_CLICKED, () => {
        if (!userId) {
          return;
        }
        const correlationId = uuidv4();
        logger.log(`${PlayerMessageType.MENU_CLICKED}: sessionId=${sessionId}, correlationId=${correlationId}.`);
        coreClient.sendMessage(PlayerMessageType.MENU_CLICKED, {
          sessionId,
          correlationId,
        });
      });

      client.on(PlayerMessageType.MENU_CLOSED, () => {
        if (!userId) {
          return;
        }
        const correlationId = uuidv4();
        logger.log(`${PlayerMessageType.MENU_CLOSED}: sessionId=${sessionId}, correlationId=${correlationId}.`);
        coreClient.sendMessage(PlayerMessageType.MENU_CLOSED, {
          sessionId,
          correlationId,
        });
      });

      client.on(PlayerMessageType.LOST_FOCUS, () => {
        if (!userId) {
          return;
        }
        const correlationId = uuidv4();
        logger.log(`${PlayerMessageType.LOST_FOCUS}: sessionId=${sessionId}, correlationId=${correlationId}.`);
        coreClient.sendMessage(PlayerMessageType.LOST_FOCUS, {
          sessionId,
          correlationId,
        });
      });

      client.on(PlayerMessageType.REGAINED_FOCUS, () => {
        if (!userId) {
          return;
        }
        const correlationId = uuidv4();
        logger.log(`${PlayerMessageType.REGAINED_FOCUS}: sessionId=${sessionId}, correlationId=${correlationId}.`);
        coreClient.sendMessage(PlayerMessageType.REGAINED_FOCUS, {
          sessionId,
          correlationId,
        });
      });

      client.on(PlayerMessageType.QUIT, data => {
        if (!userId) {
          return;
        }
        const reason = data?.reason || 'manual';
        const correlationId = uuidv4();
        logger.log(`${PlayerMessageType.QUIT}: sessionId=${sessionId}, correlationId=${correlationId}, reason=${reason}`);
        coreClient.sendMessage(PlayerMessageType.QUIT, {
          sessionId,
          reason,
          correlationId,
        });
      });
      disconnectTimer.startTimer();
    });

    server.listen(config.server.port, () => {
      logger.log(`Server is listening on port ${config.server.port}`);
    });
  });
