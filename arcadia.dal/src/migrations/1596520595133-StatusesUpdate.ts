import {MigrationInterface, QueryRunner} from "typeorm";

export class StatusesUpdate1596520595133 implements MigrationInterface {
    name = 'StatusesUpdate1596520595133'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `queue` CHANGE `status` `status` enum ('in-play', 'ready', 'drying', 'stopped') NOT NULL DEFAULT 'stopped'");
        await queryRunner.query("ALTER TABLE `machine` CHANGE `status` `status` enum ('in-play', 'preparing', 'seeding', 'ready', 'shutting-down', 'stopped', 'offline', 'error') NOT NULL DEFAULT 'offline'");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `machine` CHANGE `status` `status` enum ('in-play', 'preparing', 'seeding', 'ready', 'drying', 'shutting-down', 'stopped', 'offline', 'error') NOT NULL DEFAULT 'offline'");
        await queryRunner.query("ALTER TABLE `queue` CHANGE `status` `status` enum ('in-play', 'preparing', 'ready', 'drying', 'shutting-down', 'stopped') NOT NULL DEFAULT 'stopped'");
    }

}
