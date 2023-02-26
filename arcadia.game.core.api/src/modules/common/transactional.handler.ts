import { Logger } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import {
  connectionNames,
  EntityManager,
  getManager,
  GroupEntity,
  MachineEntity,
  OperatorEntity,
  PlayerEntity,
  SessionEntity,
  SessionRepository,
} from 'arcadia-dal';
import { SessionAwareDto } from '../dto/session.aware.dto';

export abstract class TransactionalHandler<T extends SessionAwareDto> {
  protected entityManager: EntityManager;
  protected sessionId: number;
  protected correlationId: string;
  protected lockedSession: SessionEntity;
  protected cachedSession: SessionEntity;
  protected cachedMachine: MachineEntity;
  protected cachedGroup: GroupEntity;
  protected cachedPlayer: PlayerEntity;
  protected cachedOperator: OperatorEntity;
  protected sessionRepo: SessionRepository;

  protected constructor(protected readonly logger: Logger) {
  }

  protected async init(data: T): Promise<void> {
    if (!data.sessionId || !data.session) {
      throw new RpcException('Session has not been injected!');
    }

    this.sessionId = Number(data.sessionId);
    this.correlationId = data.correlationId || 'none';

    // session data
    this.cachedSession = data.session;
    this.cachedMachine = data.session.machine;
    this.cachedGroup = data.session.group;
    this.cachedOperator = data.session.operator;
    this.cachedPlayer = data.session.player;

    // transactional repos
    this.sessionRepo = this.entityManager.getCustomRepository(SessionRepository);
  }

  protected async lockSession(): Promise<void> {
    this.lockedSession = await this.sessionRepo.findOneOrFail(this.sessionId,
      {
        lock: { mode: 'pessimistic_write' },
      });
  }

  protected abstract handleEvent(): Promise<void>;

  public async handle(data: T): Promise<void> {
    await getManager(connectionNames.DATA)
      .transaction(async transactionalEntityManager => {
        this.entityManager = transactionalEntityManager;
        try {
          this.logger.log(`Handle in transaction: ${JSON.stringify(data)}`);
          await this.init(data);
          await this.lockSession();
          await this.handleEvent();
        } catch (err) {
          await this.onError(err);
        }
      });
  }

  protected async onError(err: string | Record<string, any>): Promise<never> {
    throw new RpcException(err);
  }
}
