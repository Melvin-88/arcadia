export class QueueBalanceDto {
  fromQueue: { queueId: number; queueLength: number };
  toQueue: { queueId: number; queueLength: number };
}