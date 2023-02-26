import {MigrationInterface, QueryRunner} from "typeorm";

export class SessionArchiveJsonToString1604048434899 implements MigrationInterface {
    name = 'SessionArchiveJsonToString1604048434899'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `session_archive` ADD `group_configuration` varchar(512) NOT NULL");
        await queryRunner.query("ALTER TABLE `session_archive` ADD `operator_configuration` varchar(512) NOT NULL");
        await queryRunner.query("ALTER TABLE `session_archive` DROP COLUMN `configuration`");
        await queryRunner.query("ALTER TABLE `session_archive` ADD `configuration` varchar(512) NOT NULL");
        await queryRunner.query("ALTER TABLE `session_archive` DROP COLUMN `session_description`");
        await queryRunner.query("ALTER TABLE `session_archive` ADD `session_description` varchar(128) NULL");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `session_archive` DROP COLUMN `session_description`");
        await queryRunner.query("ALTER TABLE `session_archive` ADD `session_description` json NULL");
        await queryRunner.query("ALTER TABLE `session_archive` DROP COLUMN `configuration`");
        await queryRunner.query("ALTER TABLE `session_archive` ADD `configuration` json NOT NULL");
        await queryRunner.query("ALTER TABLE `session_archive` DROP COLUMN `operator_configuration`");
        await queryRunner.query("ALTER TABLE `session_archive` DROP COLUMN `group_configuration`");
    }

}
