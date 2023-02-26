import {MigrationInterface, QueryRunner} from "typeorm";

export class MachineStatusUpdate1599745042191 implements MigrationInterface {
    name = 'MachineStatusUpdate1599745042191'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `machine` CHANGE `status` `status` enum ('in-play', 'preparing', 'seeding', 'ready', 'shutting-down', 'stopped', 'offline', 'error', 'onHold') NOT NULL DEFAULT 'offline'");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `machine` CHANGE `status` `status` enum ('ready', 'in-play', 'seeding', 'preparing', 'shutting-down', 'stopped', 'offline', 'error') NOT NULL DEFAULT 'offline'");
    }

}
