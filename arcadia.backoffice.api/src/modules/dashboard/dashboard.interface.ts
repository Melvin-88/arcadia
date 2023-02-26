import { ApiProperty } from '@nestjs/swagger';

export class ActiveNewPlayersResponse {
    @ApiProperty()
    public countActive: number;

    @ApiProperty()
    public countActivePrevious: number;

    @ApiProperty()
    public countNew: number;

    @ApiProperty()
    public countNewPrevious: number;
}

export class ExistingNewPlayersResponse {
    @ApiProperty()
    public countExisting: number;

    @ApiProperty()
    public countNew: number;
}

export class ActiveSessionsBreakdownResponse {
    @ApiProperty()
    public countObserving: number;

    @ApiProperty()
    public countQueuing: number;

    @ApiProperty()
    public countBetBehind: number;

    @ApiProperty()
    public countInPlay: number;

    @ApiProperty()
    public countReBuy: number;
}

export class MachineAvailabilityResponse {
    @ApiProperty()
    public countInPlay: number;

    @ApiProperty()
    public countReady: number;
}

export class MachinesStatusResponse {
    @ApiProperty()
    public countError: number;

    @ApiProperty()
    public countOffline: number;

    @ApiProperty()
    public countShuttingDown: number;

    @ApiProperty()
    public countDrying: number;

    @ApiProperty()
    public countPreparing: number;

    @ApiProperty()
    public countInPlay: number;

    @ApiProperty()
    public countReady: number;

    @ApiProperty()
    public countSeeding: number;
}

class LatestAlert {
    @ApiProperty()
    public time: Date;

    @ApiProperty()
    public alert: string;

    @ApiProperty()
    public status: number;
}

export class LatestAlertsResponse {
    @ApiProperty({ type: [LatestAlert] })
    public alerts: LatestAlert[];
}

export class WaitTimeResponse {
    @ApiProperty()
    public averageWaitTimeCurrent: number;

    @ApiProperty()
    public averageWaitTime24: number;

    @ApiProperty()
    public averageWaitTime24Previous: number;
}

export class BettingActivity {
    @ApiProperty()
    public date: Date;

    @ApiProperty()
    public rounds: number;

    @ApiProperty()
    public bets: number;

    @ApiProperty()
    public wins: number;
}

export class BettingActivityResponse {
    @ApiProperty({ type: [BettingActivity] })
    public bets: BettingActivity[];
}

export class ActiveNewPlayers {
    @ApiProperty()
    public date: Date;

    @ApiProperty()
    public countActive: number;

    @ApiProperty()
    public countNew: number;
}

export class ThirtyDaysActiveNewPlayersResponse {
    @ApiProperty({ type: [ActiveNewPlayers] })
    public stats: ActiveNewPlayers[];
}

export class TopWinnerLoser {
    @ApiProperty()
    public player: string;

    @ApiProperty()
    public playerCid: string;

    @ApiProperty()
    public win?: number;

    @ApiProperty()
    public loss?: number;

    @ApiProperty()
    public online: boolean;
}

export class TopWinnersLosersResponse {
    @ApiProperty({ type: [TopWinnerLoser] })
    public winners: TopWinnerLoser[];

    @ApiProperty({ type: [TopWinnerLoser] })
    public losers: TopWinnerLoser[];
}
