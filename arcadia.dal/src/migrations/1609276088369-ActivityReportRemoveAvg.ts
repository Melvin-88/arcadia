import {MigrationInterface, QueryRunner} from "typeorm";

export class ActivityReportRemoveAvg1609276088369 implements MigrationInterface {
    name = 'ActivityReportRemoveAvg1609276088369'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `activity_report` DROP COLUMN `avg_session_time`");
        await queryRunner.query("ALTER TABLE `activity_report` DROP COLUMN `avg_rounds_per_session`");
        await queryRunner.query("ALTER TABLE `activity_report` DROP COLUMN `avg_watch_time`");
        await queryRunner.query("ALTER TABLE `activity_report` DROP COLUMN `avg_queue_time`");
        await queryRunner.query("ALTER TABLE `activity_report` DROP COLUMN `avg_in_play_time`");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `activity_report` ADD `avg_in_play_time` decimal(16,2) UNSIGNED NULL");
        await queryRunner.query("ALTER TABLE `activity_report` ADD `avg_queue_time` decimal(16,2) UNSIGNED NULL");
        await queryRunner.query("ALTER TABLE `activity_report` ADD `avg_watch_time` decimal(16,2) UNSIGNED NULL");
        await queryRunner.query("ALTER TABLE `activity_report` ADD `avg_rounds_per_session` decimal(16,2) UNSIGNED NULL");
        await queryRunner.query("ALTER TABLE `activity_report` ADD `avg_session_time` decimal(16,2) UNSIGNED NULL");
    }
}
