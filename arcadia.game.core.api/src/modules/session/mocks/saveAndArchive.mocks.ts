import {
  GroupEntity, MachineEntity, OperatorEntity, PlayerEntity, QueueEntity,
  RoundArchiveRepository, RoundEntity,
  RoundRepository,
  SessionArchiveRepository,
  SessionEntity, SessionRepository, SessionStatus,
} from 'arcadia-dal';
import { ObjectType, Repository } from 'typeorm';

export const saveAndArchiveSessionMock = new SessionEntity();
saveAndArchiveSessionMock.id = 15;
saveAndArchiveSessionMock.group = new GroupEntity();
saveAndArchiveSessionMock.group.id = 5;
saveAndArchiveSessionMock.group.operators = [new OperatorEntity()];
saveAndArchiveSessionMock.group.operators[0].id = 32;
saveAndArchiveSessionMock.machine = new MachineEntity();
saveAndArchiveSessionMock.machine.id = 42;
saveAndArchiveSessionMock.player = new PlayerEntity();
saveAndArchiveSessionMock.player.cid = '<cid>';
saveAndArchiveSessionMock.queue = new QueueEntity();
saveAndArchiveSessionMock.queue.id = 55;
saveAndArchiveSessionMock.rounds = [new RoundEntity()];
saveAndArchiveSessionMock.rounds[0].id = 21;

export function shouldSaveAndArchiveSession(spyTargets: any): void {
  jest.spyOn(spyTargets.sessionRepository, 'findOne').mockResolvedValue(saveAndArchiveSessionMock);
  // @ts-ignore
  jest.spyOn(spyTargets.sessionRepository.manager, 'transaction').mockImplementation(async (cb: Function) => {
    await cb({
      getCustomRepository: (repoClass: ObjectType<Repository<any>>) => {
        switch (repoClass) {
          case SessionArchiveRepository:
            return spyTargets.sessionArchiveRepository;
          case RoundRepository:
            return spyTargets.roundRepository;
          case RoundArchiveRepository:
            return spyTargets.roundArchiveRepository;
          case SessionRepository:
            return spyTargets.sessionRepository;
          default:
            throw new Error(`Unexpected class ${repoClass.name}`);
        }
      },
    });
  });
}