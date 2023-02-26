import {MigrationInterface, QueryRunner} from "typeorm";

export class PendingScatter1604506053136 implements MigrationInterface {
    name = 'PendingScatter1604506053136'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `session` ADD `pending_scatter` tinyint UNSIGNED NOT NULL DEFAULT 0");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `session` DROP COLUMN `pending_scatter`");
    }

}
