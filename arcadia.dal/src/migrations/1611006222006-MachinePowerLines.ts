import {MigrationInterface, QueryRunner} from "typeorm";

export class MachinePowerLines1611006222006 implements MigrationInterface {
    name = 'MachinePowerLines1611006222006'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `machine` ADD `power_line` enum ('a', 'b') NOT NULL DEFAULT 'a'");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `machine` DROP COLUMN `power_line`");
    }
}
