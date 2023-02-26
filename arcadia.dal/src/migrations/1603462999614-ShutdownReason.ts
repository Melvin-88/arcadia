import {MigrationInterface, QueryRunner} from "typeorm";

export class ShutdownReason1603462999614 implements MigrationInterface {
    name = 'ShutdownReason1603462999614'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `machine` ADD `shutdown_reason` enum ('userRequest', 'error') NULL");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `machine` DROP COLUMN `shutdown_reason`");
    }

}
