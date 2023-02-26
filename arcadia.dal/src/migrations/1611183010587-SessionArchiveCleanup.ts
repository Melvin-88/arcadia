import {MigrationInterface, QueryRunner} from "typeorm";

export class SessionArchiveCleanup1611183010587 implements MigrationInterface {
    name = 'SessionArchiveCleanup1611183010587'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `session_archive` DROP COLUMN `group_configuration`");
        await queryRunner.query("ALTER TABLE `session_archive` DROP COLUMN `operator_configuration`");
        await queryRunner.query("ALTER TABLE `session_archive` MODIFY COLUMN `configuration` varchar(1024) NOT NULL");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `session_archive` MODIFY COLUMN `configuration` varchar(512) NOT NULL");
        await queryRunner.query("ALTER TABLE `session_archive` ADD `operator_configuration` varchar(512) NOT NULL");
        await queryRunner.query("ALTER TABLE `session_archive` ADD `group_configuration` varchar(512) NOT NULL");
    }
}
