import {MigrationInterface, QueryRunner} from "typeorm";

export class SessionEntityUpdate1595418536398 implements MigrationInterface {
    name = 'SessionEntityUpdate1595418536398'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `session` DROP COLUMN `duration`");
        await queryRunner.query("ALTER TABLE `session` ADD `duration` smallint(5) UNSIGNED NOT NULL DEFAULT 0");
        await queryRunner.query("ALTER TABLE `session` DROP COLUMN `viewer_duration`");
        await queryRunner.query("ALTER TABLE `session` ADD `viewer_duration` smallint(5) UNSIGNED NOT NULL DEFAULT 0");
        await queryRunner.query("ALTER TABLE `session` DROP COLUMN `queue_duration`");
        await queryRunner.query("ALTER TABLE `session` ADD `queue_duration` smallint(5) UNSIGNED NOT NULL DEFAULT 0");
        await queryRunner.query("ALTER TABLE `session` DROP COLUMN `total_stacks_used`");
        await queryRunner.query("ALTER TABLE `session` ADD `total_stacks_used` tinyint(3) UNSIGNED NOT NULL DEFAULT 0");
        await queryRunner.query("ALTER TABLE `session` DROP COLUMN `os`");
        await queryRunner.query("ALTER TABLE `session` ADD `os` varchar(64) NOT NULL");
        await queryRunner.query("ALTER TABLE `session` DROP COLUMN `device_type`");
        await queryRunner.query("ALTER TABLE `session` ADD `device_type` varchar(64) NOT NULL");
        await queryRunner.query("ALTER TABLE `session` DROP COLUMN `browser`");
        await queryRunner.query("ALTER TABLE `session` ADD `browser` varchar(64) NOT NULL");
        await queryRunner.query("ALTER TABLE `session_archive` DROP COLUMN `duration`");
        await queryRunner.query("ALTER TABLE `session_archive` ADD `duration` smallint(5) UNSIGNED NOT NULL DEFAULT 0");
        await queryRunner.query("ALTER TABLE `session_archive` DROP COLUMN `viewer_duration`");
        await queryRunner.query("ALTER TABLE `session_archive` ADD `viewer_duration` smallint(5) UNSIGNED NOT NULL DEFAULT 0");
        await queryRunner.query("ALTER TABLE `session_archive` DROP COLUMN `queue_duration`");
        await queryRunner.query("ALTER TABLE `session_archive` ADD `queue_duration` smallint(5) UNSIGNED NOT NULL DEFAULT 0");
        await queryRunner.query("ALTER TABLE `session_archive` DROP COLUMN `total_stacks_used`");
        await queryRunner.query("ALTER TABLE `session_archive` ADD `total_stacks_used` tinyint(3) UNSIGNED NOT NULL DEFAULT 0");
        await queryRunner.query("ALTER TABLE `session_archive` DROP COLUMN `os`");
        await queryRunner.query("ALTER TABLE `session_archive` ADD `os` varchar(64) NOT NULL");
        await queryRunner.query("ALTER TABLE `session_archive` DROP COLUMN `device_type`");
        await queryRunner.query("ALTER TABLE `session_archive` ADD `device_type` varchar(64) NOT NULL");
        await queryRunner.query("ALTER TABLE `session_archive` DROP COLUMN `browser`");
        await queryRunner.query("ALTER TABLE `session_archive` ADD `browser` varchar(64) NOT NULL");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `session_archive` DROP COLUMN `browser`");
        await queryRunner.query("ALTER TABLE `session_archive` ADD `browser` varchar(32) NOT NULL");
        await queryRunner.query("ALTER TABLE `session_archive` DROP COLUMN `device_type`");
        await queryRunner.query("ALTER TABLE `session_archive` ADD `device_type` varchar(16) NOT NULL");
        await queryRunner.query("ALTER TABLE `session_archive` DROP COLUMN `os`");
        await queryRunner.query("ALTER TABLE `session_archive` ADD `os` varchar(32) NOT NULL");
        await queryRunner.query("ALTER TABLE `session_archive` DROP COLUMN `total_stacks_used`");
        await queryRunner.query("ALTER TABLE `session_archive` ADD `total_stacks_used` int(10) UNSIGNED NOT NULL DEFAULT '0'");
        await queryRunner.query("ALTER TABLE `session_archive` DROP COLUMN `queue_duration`");
        await queryRunner.query("ALTER TABLE `session_archive` ADD `queue_duration` int(10) UNSIGNED NOT NULL DEFAULT '0'");
        await queryRunner.query("ALTER TABLE `session_archive` DROP COLUMN `viewer_duration`");
        await queryRunner.query("ALTER TABLE `session_archive` ADD `viewer_duration` int(10) UNSIGNED NOT NULL DEFAULT '0'");
        await queryRunner.query("ALTER TABLE `session_archive` DROP COLUMN `duration`");
        await queryRunner.query("ALTER TABLE `session_archive` ADD `duration` int(10) UNSIGNED NOT NULL DEFAULT '0'");
        await queryRunner.query("ALTER TABLE `session` DROP COLUMN `browser`");
        await queryRunner.query("ALTER TABLE `session` ADD `browser` varchar(32) NOT NULL");
        await queryRunner.query("ALTER TABLE `session` DROP COLUMN `device_type`");
        await queryRunner.query("ALTER TABLE `session` ADD `device_type` varchar(16) NOT NULL");
        await queryRunner.query("ALTER TABLE `session` DROP COLUMN `os`");
        await queryRunner.query("ALTER TABLE `session` ADD `os` varchar(32) NOT NULL");
        await queryRunner.query("ALTER TABLE `session` DROP COLUMN `total_stacks_used`");
        await queryRunner.query("ALTER TABLE `session` ADD `total_stacks_used` int(10) UNSIGNED NOT NULL DEFAULT '0'");
        await queryRunner.query("ALTER TABLE `session` DROP COLUMN `queue_duration`");
        await queryRunner.query("ALTER TABLE `session` ADD `queue_duration` int(10) UNSIGNED NOT NULL DEFAULT '0'");
        await queryRunner.query("ALTER TABLE `session` DROP COLUMN `viewer_duration`");
        await queryRunner.query("ALTER TABLE `session` ADD `viewer_duration` int(10) UNSIGNED NOT NULL DEFAULT '0'");
        await queryRunner.query("ALTER TABLE `session` DROP COLUMN `duration`");
        await queryRunner.query("ALTER TABLE `session` ADD `duration` int(10) UNSIGNED NOT NULL DEFAULT '0'");
    }

}
