import { Inject, MiddlewareConsumer, Module } from '@nestjs/common';
import {
  getConfig,
  TypeOrmModule,
  InjectConnection,
  ConnectionType,
  connectionNames,
  configOptionWithAudit,
  Connection,
  MysqlDriver,
} from 'arcadia-dal';
import { v4 as uuidv4 } from 'uuid';
import { ConfigModule } from './modules/config/config.module';
import { LoggerModule } from './modules/logger/logger.module';
import { AuthModule } from './modules/auth/auth.module';
import { GroupsModule } from './modules/groups/groups.module';
import { MachinesModule } from './modules/machines/machines.module';
import { SessionsModule } from './modules/sessions/sessions.module';
import { PlayersModule } from './modules/players/players.module';
import { VouchersModule } from './modules/vouchers/vouchers.module';
import { JackpotsModule } from './modules/jackpots/jackpots.module';
import { OperatorsModule } from './modules/operators/operators.module';
import { AlertsModule } from './modules/alerts/alerts.module';
import { DisputesModule } from './modules/disputes/disputes.module';
import { MonitoringsModule } from './modules/monitorings/monitorings.module';
import { UserModule } from './modules/administration/user/user.module';
import { CamerasModule } from './modules/cameras/camera.module';
import { ConfigService } from './modules/config/config.service';
import { MyLogger } from './modules/logger/logger.service';
import { ChipModule } from './modules/administration/chip/chip.module';
import { BearerStrategy } from './modules/auth/strategies/bearer.strategy';
import { LocalStrategy } from './modules/auth/strategies/local.strategy';
import { MaintenenceModule } from './modules/maintenance/maintenence.module';
import { HistoryModule } from './modules/history/history.module';
import { VoucherPortalModule } from './modules/voucherPortal/voucherPortal.module';
import { ReportsModule } from './modules/reports/reports.module';
import { AppController } from './app.controller';
import { DashboardModule } from './modules/dashboard/dashboard.module';

@Module({
  imports: [
    ConfigModule.load('./.env'),
    TypeOrmModule.forRootAsync({
      name: connectionNames.DATA,
      useFactory: (configService: ConfigService) => getConfig(ConnectionType.WITH_AUDIT, <configOptionWithAudit>configService.get('core')),
      inject: [ConfigService],
    }),
    TypeOrmModule.forRootAsync({
      name: connectionNames.AUDIT,
      useFactory: (configService: ConfigService) => getConfig(ConnectionType.AUDIT, <configOptionWithAudit>configService.get('core')),
      inject: [ConfigService],
    }),
    LoggerModule,
    AuthModule,
    GroupsModule,
    MachinesModule,
    SessionsModule,
    PlayersModule,
    VouchersModule,
    JackpotsModule,
    OperatorsModule,
    AlertsModule,
    DisputesModule,
    MonitoringsModule,
    UserModule,
    CamerasModule,
    ChipModule,
    MaintenenceModule,
    HistoryModule,
    VoucherPortalModule,
    ReportsModule,
    DashboardModule,
  ],
  providers: [
    BearerStrategy,
    LocalStrategy,
  ],
  controllers: [AppController],
})

export class AppModule {
  constructor(
    @InjectConnection(connectionNames.DATA) private readonly connection: Connection,
    @Inject(MyLogger) private readonly logger: MyLogger,
  ) {
    if (connection.driver.isReplicated) {
      const mysqlDriver = connection.driver as MysqlDriver;
      mysqlDriver.poolCluster.on('offline', nodeId => logger.error(`Can not connect to Database node(${nodeId}). Reconnecting`, ''));
    }
  }

  public configure(consumer: MiddlewareConsumer) {
    consumer.apply(
      (
        req: any,
        res: any,
        next: any,
      ) => {
        req.executionTime = Date.now();
        req.uuid = uuidv4();
        next();
      },
    ).forRoutes('*');
  }
}
