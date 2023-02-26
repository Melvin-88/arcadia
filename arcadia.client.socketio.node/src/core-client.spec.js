const { CoreClient } = require('./core-client');
const amqp = require('amqp-connection-manager');
const axios = require('axios');

jest.mock('axios');
jest.mock('amqp-connection-manager');

const amqpWrapperMock = {
    sendToQueue: (queue, options) => Promise.resolve(),
};

const amqpConnectionMock = {
    createChannel: () => amqpWrapperMock,
};

describe('Core Client (Unit)', () => {
    let coreClient;

    beforeAll(() => {
        jest.spyOn(amqp, 'connect').mockReturnValue(amqpConnectionMock);
       coreClient = new CoreClient({
           gameCore: {
               apiUrl: '<url>',
           },
           rabbitMQ: {
               coreQueue: '<queue>',
           },
       }, {});
    });

    describe('sendMessage', () => {
        it('should send message using rabbitMQ', async () => {
            const sendToQueueSpy = jest.spyOn(amqpWrapperMock, 'sendToQueue');
            await coreClient.sendMessage('<type>', '<data>');
            expect(sendToQueueSpy).toBeCalledWith('<queue>', { type: '<type>', data: '<data>' })
        });
    });

    describe('verifyToken', () => {
        it('should send verify token request to api', async () => {
            const dataMock = { test: 'test' };
            const postSpy = jest.spyOn(axios, 'post').mockResolvedValueOnce({ data: dataMock });
            const result = await coreClient.verifyToken('<corr>', '<token>', '<foot>');
            expect(result).toMatchObject(dataMock);
            expect(postSpy).toBeCalledWith('<url>/auth/verify', { token: '<token>', footprint: '<foot>' }, { headers: { correlation: '<corr>' } });
        });
    });

    describe('verifyReconnect', () => {
        it('should send verify reconnect request to api', async () => {
            const dataMock = { test: 'test' };
            const postSpy = jest.spyOn(axios, 'post').mockResolvedValueOnce({ data: dataMock });
            const result = await coreClient.verifyReconnect('<corr>', 5, '<foot>');
            expect(result).toMatchObject(dataMock);
            expect(postSpy).toBeCalledWith('<url>/auth/reconnect', { sessionId: 5, footprint: '<foot>' }, { headers: { correlation: '<corr>' } });
        });
    });
});