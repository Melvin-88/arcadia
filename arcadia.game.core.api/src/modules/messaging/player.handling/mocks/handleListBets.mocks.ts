import {GroupEntity, OperatorEntity, SessionEntity} from 'arcadia-dal';

export const shouldSendBetsSessionMock = new SessionEntity();
shouldSendBetsSessionMock.id = 5;
shouldSendBetsSessionMock.currency = 'USD';
shouldSendBetsSessionMock.currencyConversionRate = 1;
shouldSendBetsSessionMock.group = new GroupEntity();
shouldSendBetsSessionMock.group.operators = [new OperatorEntity()];
shouldSendBetsSessionMock.group.operators[0].blueRibbonId = '<brId>';

export const shouldSendBetsLobbyBetDataMock = [{
    groupId: 1,
    groupName: '<groupName>',
    denominator: 15,
    queueLength: 4,
    jackpotGameId: '<brGid>',
    config: {},
    color: 'red',
    prizeGroup: '<prizeGroup>',
}];

export const shouldSendBetsPayTableMock = { type: '<type>', currencyValue: 25, soundId: '<sId>', iconId: '<iId>' };

export const shouldSendBetsBetListMock = {
    groups: [
        {
            groupId: shouldSendBetsLobbyBetDataMock[0].groupId,
            groupName: shouldSendBetsLobbyBetDataMock[0].groupName,
            jackpotGameId: shouldSendBetsLobbyBetDataMock[0].jackpotGameId,
            queueLength: shouldSendBetsLobbyBetDataMock[0].queueLength,
            currency: shouldSendBetsSessionMock.currency,
            betInCash: 15,
            color: shouldSendBetsLobbyBetDataMock[0].color,
            payTable: {
                type: shouldSendBetsPayTableMock.type,
                currencyValue: shouldSendBetsPayTableMock.currencyValue,
                soundId: shouldSendBetsPayTableMock.soundId,
                iconId: shouldSendBetsPayTableMock.iconId,
            },
        },
    ],
    jackpotOperatorId: shouldSendBetsSessionMock.group.operators[0].blueRibbonId,
}

export function shouldSendBets(spyTargets: any): void {
    jest.spyOn(spyTargets.machineRepository, 'getLobbyAndChangeBetGroupData').mockResolvedValue(shouldSendBetsLobbyBetDataMock);
    jest.spyOn(spyTargets.rngChipPrizeRepository, 'getPayTable').mockResolvedValue(shouldSendBetsPayTableMock);
}