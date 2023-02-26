class RobotClient {
  constructor(io, clientId) {
    this.io = io;
    this.clientId = clientId;
    this.directRoomId = null;
    this.queueRoomId = null;
  }

  sendToRobot({ action, data, userId, isVolatile = false }) {
    if (!this.directRoomId) return;

    const targetedRoom = this.io.to(this.directRoomId);
    const channel = !isVolatile ? targetedRoom : targetedRoom.volatile;

    channel.emit('player2robot', { action, ...data,
      user: {
        id: userId,
        socketId: this.clientId
      }
    });
  }

  setRoomIds(directRoomId, queueRoomId) {
    this.directRoomId = directRoomId;
    this.queueRoomId = queueRoomId;
  }
}

module.exports = { RobotClient };
