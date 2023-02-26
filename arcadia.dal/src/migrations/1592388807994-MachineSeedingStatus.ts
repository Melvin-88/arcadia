import {MigrationInterface, QueryRunner} from "typeorm";

export class MachineSeedingStatus1592388807994 implements MigrationInterface {
    name = 'MachineSeedingStatus1592388807994';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `machine` CHANGE `status` `status` enum ('in-play', 'preparing', 'seeding', 'ready', 'drying', 'shutting-down', 'stopped', 'offline', 'error') NOT NULL DEFAULT 'offline'", undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `machine` CHANGE `status` `status` enum ('in-play', 'preparing', 'ready', 'drying', 'shutting-down', 'stopped', 'offline', 'error') NOT NULL DEFAULT 'offline'", undefined);
    }

}
