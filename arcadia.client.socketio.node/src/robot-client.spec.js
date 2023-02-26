const { RobotClient } = require('./robot-client');

const channelMock = {
    emit: () => null,
}

const ioMock = {
    to: () => channelMock,
};

describe('Robot Client (Unit)', () => {
    let robotClient;

    beforeEach(() => {
        robotClient = new RobotClient(ioMock, '<id>');
    });

    describe('sendToRobot', () => {
        it('should send message to robot', () => {
            const dataMock = { action: 'a', data: {}, userId: '<uid>', isVolatile: false };
            const toSpy = jest.spyOn(ioMock, 'to');
            const emitSpy = jest.spyOn(channelMock, 'emit');
            robotClient.setRoomIds('<direct>', '<queue>');
            robotClient.sendToRobot(dataMock);
            expect(toSpy).toBeCalledWith('<direct>');
            expect(emitSpy).toBeCalledWith('player2robot', {
                    action: 'a',
                    user: {
                        id: '<uid>',
                        socketId: '<id>'
                    },
                }
            );
        });
    });

    describe('setRoomIds', () => {
       it('should set room ids', () => {
          robotClient.setRoomIds('<directNew>', '<queueNew>');
          expect(robotClient.directRoomId).toBe('<directNew>');
          expect(robotClient.queueRoomId).toBe('<queueNew>');
       });
    });
});