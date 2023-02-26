import {MigrationInterface, QueryRunner} from "typeorm";

export class ActivityReportModifications1608824949193 implements MigrationInterface {
    name = 'ActivityReportModifications1608824949193'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `activity_report` DROP COLUMN `percent_autoplay_sessions`");
        await queryRunner.query("ALTER TABLE `activity_report` DROP COLUMN `percent_sessions_behind`");
        await queryRunner.query("ALTER TABLE `activity_report` DROP COLUMN `percent_sessions_in_play`");
        await queryRunner.query("ALTER TABLE `activity_report` DROP COLUMN `percent_sessions_queue`");
        await queryRunner.query("ALTER TABLE `activity_report` DROP COLUMN `percent_sessions_watch`");
        await queryRunner.query("ALTER TABLE `activity_report` ADD `total_autoplay_sessions` int UNSIGNED NULL");
        await queryRunner.query("ALTER TABLE `activity_report` DROP COLUMN `total_unique_players`");
        await queryRunner.query("ALTER TABLE `activity_report` ADD `total_unique_players` int UNSIGNED NULL");
        await queryRunner.query("ALTER TABLE `activity_report` DROP COLUMN `total_new_players`");
        await queryRunner.query("ALTER TABLE `activity_report` ADD `total_new_players` int UNSIGNED NULL");
        await queryRunner.query("ALTER TABLE `activity_report` DROP COLUMN `total_unique_sessions`");
        await queryRunner.query("ALTER TABLE `activity_report` ADD `total_unique_sessions` int UNSIGNED NULL");
        await queryRunner.query("ALTER TABLE `activity_report` DROP COLUMN `total_session_time`");
        await queryRunner.query("ALTER TABLE `activity_report` ADD `total_session_time` bigint UNSIGNED NULL");
        await queryRunner.query("ALTER TABLE `activity_report` DROP COLUMN `total_rounds_played`");
        await queryRunner.query("ALTER TABLE `activity_report` ADD `total_rounds_played` int UNSIGNED NULL");
        await queryRunner.query("ALTER TABLE `activity_report` DROP COLUMN `total_watch_time`");
        await queryRunner.query("ALTER TABLE `activity_report` ADD `total_watch_time` int UNSIGNED NULL");
        await queryRunner.query("ALTER TABLE `activity_report` DROP COLUMN `max_watch_time`");
        await queryRunner.query("ALTER TABLE `activity_report` ADD `max_watch_time` int UNSIGNED NULL");
        await queryRunner.query("ALTER TABLE `activity_report` DROP COLUMN `total_queue_time`");
        await queryRunner.query("ALTER TABLE `activity_report` ADD `total_queue_time` int UNSIGNED NULL");
        await queryRunner.query("ALTER TABLE `activity_report` DROP COLUMN `max_queue_time`");
        await queryRunner.query("ALTER TABLE `activity_report` ADD `max_queue_time` int UNSIGNED NULL");
        await queryRunner.query("ALTER TABLE `activity_report` DROP COLUMN `total_in_play_time`");
        await queryRunner.query("ALTER TABLE `activity_report` ADD `total_in_play_time` int UNSIGNED NULL");
        await queryRunner.query("ALTER TABLE `activity_report` DROP COLUMN `max_in_play_time`");
        await queryRunner.query("ALTER TABLE `activity_report` ADD `max_in_play_time` int UNSIGNED NULL");
        await queryRunner.query("ALTER TABLE `activity_report` DROP COLUMN `total_sessions_watch`");
        await queryRunner.query("ALTER TABLE `activity_report` ADD `total_sessions_watch` int UNSIGNED NULL");
        await queryRunner.query("ALTER TABLE `activity_report` DROP COLUMN `total_sessions_queue`");
        await queryRunner.query("ALTER TABLE `activity_report` ADD `total_sessions_queue` int UNSIGNED NULL");
        await queryRunner.query("ALTER TABLE `activity_report` DROP COLUMN `total_sessions_behind`");
        await queryRunner.query("ALTER TABLE `activity_report` ADD `total_sessions_behind` int UNSIGNED NULL");
        await queryRunner.query("ALTER TABLE `activity_report` DROP COLUMN `total_sessions_in_play`");
        await queryRunner.query("ALTER TABLE `activity_report` ADD `total_sessions_in_play` int UNSIGNED NULL");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `activity_report` DROP COLUMN `total_sessions_in_play`");
        await queryRunner.query("ALTER TABLE `activity_report` ADD `total_sessions_in_play` decimal(16,2) UNSIGNED NULL");
        await queryRunner.query("ALTER TABLE `activity_report` DROP COLUMN `total_sessions_behind`");
        await queryRunner.query("ALTER TABLE `activity_report` ADD `total_sessions_behind` decimal(16,2) UNSIGNED NULL");
        await queryRunner.query("ALTER TABLE `activity_report` DROP COLUMN `total_sessions_queue`");
        await queryRunner.query("ALTER TABLE `activity_report` ADD `total_sessions_queue` decimal(16,2) UNSIGNED NULL");
        await queryRunner.query("ALTER TABLE `activity_report` DROP COLUMN `total_sessions_watch`");
        await queryRunner.query("ALTER TABLE `activity_report` ADD `total_sessions_watch` decimal(16,2) UNSIGNED NULL");
        await queryRunner.query("ALTER TABLE `activity_report` DROP COLUMN `max_in_play_time`");
        await queryRunner.query("ALTER TABLE `activity_report` ADD `max_in_play_time` decimal(16,2) UNSIGNED NULL");
        await queryRunner.query("ALTER TABLE `activity_report` DROP COLUMN `total_in_play_time`");
        await queryRunner.query("ALTER TABLE `activity_report` ADD `total_in_play_time` decimal(16,2) UNSIGNED NULL");
        await queryRunner.query("ALTER TABLE `activity_report` DROP COLUMN `max_queue_time`");
        await queryRunner.query("ALTER TABLE `activity_report` ADD `max_queue_time` decimal(16,2) UNSIGNED NULL");
        await queryRunner.query("ALTER TABLE `activity_report` DROP COLUMN `total_queue_time`");
        await queryRunner.query("ALTER TABLE `activity_report` ADD `total_queue_time` decimal(16,2) UNSIGNED NULL");
        await queryRunner.query("ALTER TABLE `activity_report` DROP COLUMN `max_watch_time`");
        await queryRunner.query("ALTER TABLE `activity_report` ADD `max_watch_time` decimal(16,2) UNSIGNED NULL");
        await queryRunner.query("ALTER TABLE `activity_report` DROP COLUMN `total_watch_time`");
        await queryRunner.query("ALTER TABLE `activity_report` ADD `total_watch_time` decimal(16,2) UNSIGNED NULL");
        await queryRunner.query("ALTER TABLE `activity_report` DROP COLUMN `total_rounds_played`");
        await queryRunner.query("ALTER TABLE `activity_report` ADD `total_rounds_played` decimal(16,2) UNSIGNED NULL");
        await queryRunner.query("ALTER TABLE `activity_report` DROP COLUMN `total_session_time`");
        await queryRunner.query("ALTER TABLE `activity_report` ADD `total_session_time` decimal(16,2) UNSIGNED NULL");
        await queryRunner.query("ALTER TABLE `activity_report` DROP COLUMN `total_unique_sessions`");
        await queryRunner.query("ALTER TABLE `activity_report` ADD `total_unique_sessions` decimal(16,2) UNSIGNED NULL");
        await queryRunner.query("ALTER TABLE `activity_report` DROP COLUMN `total_new_players`");
        await queryRunner.query("ALTER TABLE `activity_report` ADD `total_new_players` decimal(16,2) UNSIGNED NULL");
        await queryRunner.query("ALTER TABLE `activity_report` DROP COLUMN `total_unique_players`");
        await queryRunner.query("ALTER TABLE `activity_report` ADD `total_unique_players` decimal(16,2) UNSIGNED NULL");
        await queryRunner.query("ALTER TABLE `activity_report` DROP COLUMN `total_autoplay_sessions`");
        await queryRunner.query("ALTER TABLE `activity_report` ADD `percent_sessions_watch` decimal(16,2) UNSIGNED NULL");
        await queryRunner.query("ALTER TABLE `activity_report` ADD `percent_sessions_queue` decimal(16,2) UNSIGNED NULL");
        await queryRunner.query("ALTER TABLE `activity_report` ADD `percent_sessions_in_play` decimal(16,2) UNSIGNED NULL");
        await queryRunner.query("ALTER TABLE `activity_report` ADD `percent_sessions_behind` decimal(16,2) UNSIGNED NULL");
        await queryRunner.query("ALTER TABLE `activity_report` ADD `percent_autoplay_sessions` decimal(16,2) UNSIGNED NULL");
    }
}
