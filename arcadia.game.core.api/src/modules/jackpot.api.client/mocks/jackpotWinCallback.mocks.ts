import {RoundEntity, RoundStatus, SessionEntity, SessionStatus} from "../../../../../arcadia.dal";

export function shouldThrowExceptionPlayerNotFound(spyTargets: any): void {
    jest.spyOn(spyTargets.playerRepository, 'findOneOrFail').mockRejectedValue(null);
}

export function shouldThrowExceptionActiveSessionNotFound(spyTargets: any): void {
    jest.spyOn(spyTargets.playerRepository, 'findOneOrFail').mockResolvedValue({ sessions: []});
}

export function shouldPerformPayout(spyTargets: any): void {
    const activeSession = new SessionEntity();
    activeSession.id = 2;
    activeSession.status = SessionStatus.PLAYING;
    const activeRound = new RoundEntity();
    activeRound.id = 42;
    activeRound.status = RoundStatus.ACTIVE;
    activeSession.rounds = [activeRound];
    jest.spyOn(spyTargets.playerRepository, 'findOneOrFail').mockResolvedValue({
        sessions: [activeSession],
        cid: '<cid>',
        operator: { apiConnectorId: '<connId>' },
    });
    jest.spyOn(spyTargets.operatorClient, 'payout').mockResolvedValue({ balance: 500 });
}