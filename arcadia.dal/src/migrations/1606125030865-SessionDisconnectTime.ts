import {MigrationInterface, QueryRunner} from "typeorm";

export class SessionDisconnectTime1606125030865 implements MigrationInterface {
    name = 'SessionDisconnectTime1606125030865'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `session` ADD `offline_duration` smallint UNSIGNED NOT NULL DEFAULT 0");
        await queryRunner.query("ALTER TABLE `session` ADD `last_disconnect_date` datetime NULL");
        await queryRunner.query("ALTER TABLE `session_archive` ADD `offline_duration` smallint UNSIGNED NOT NULL DEFAULT 0");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `session_archive` DROP COLUMN `offline_duration`");
        await queryRunner.query("ALTER TABLE `session` DROP COLUMN `last_disconnect_date`");
        await queryRunner.query("ALTER TABLE `session` DROP COLUMN `offline_duration`");
    }

}
