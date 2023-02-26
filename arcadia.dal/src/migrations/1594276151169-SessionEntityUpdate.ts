import {MigrationInterface, QueryRunner} from "typeorm";

export class SessionEntityUpdate1594276151169 implements MigrationInterface {
    name = 'SessionEntityUpdate1594276151169'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `round` DROP FOREIGN KEY `FK_bb50ba7728d40dea99950af3b42`", undefined);
        await queryRunner.query("ALTER TABLE `round` DROP COLUMN `foreign_session_id`", undefined);
        await queryRunner.query("ALTER TABLE `session` ADD `footprint` varchar(50) NOT NULL", undefined);
        await queryRunner.query("ALTER TABLE `session` ADD `is_disconnected` tinyint NOT NULL DEFAULT 0", undefined);
        await queryRunner.query("ALTER TABLE `session_archive` ADD `footprint` varchar(50) NOT NULL", undefined);
        await queryRunner.query("ALTER TABLE `session_archive` ADD `is_disconnected` tinyint NOT NULL DEFAULT 0", undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `session_archive` DROP COLUMN `is_disconnected`", undefined);
        await queryRunner.query("ALTER TABLE `session_archive` DROP COLUMN `footprint`", undefined);
        await queryRunner.query("ALTER TABLE `session` DROP COLUMN `is_disconnected`", undefined);
        await queryRunner.query("ALTER TABLE `session` DROP COLUMN `footprint`", undefined);
        await queryRunner.query("ALTER TABLE `round` ADD `foreign_session_id` bigint(24) UNSIGNED NULL", undefined);
        await queryRunner.query("ALTER TABLE `round` ADD CONSTRAINT `FK_bb50ba7728d40dea99950af3b42` FOREIGN KEY (`foreign_session_id`) REFERENCES `session`(`id`) ON DELETE SET NULL ON UPDATE NO ACTION", undefined);
    }

}
