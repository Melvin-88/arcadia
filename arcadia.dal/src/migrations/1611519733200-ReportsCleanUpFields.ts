import {MigrationInterface, QueryRunner} from "typeorm";

export class ReportsCleanUpFields1611519733200 implements MigrationInterface {
    name = 'ReportsCleanUpFields1611519733200'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `activity_report` DROP COLUMN `total_unique_players`");
        await queryRunner.query("ALTER TABLE `player_stats_report` DROP COLUMN `avg_session_time`");
        await queryRunner.query("ALTER TABLE `player_stats_report` DROP COLUMN `avg_rounds_per_session`");
        await queryRunner.query("ALTER TABLE `player_stats_report` DROP COLUMN `avg_watch_time`");
        await queryRunner.query("ALTER TABLE `player_stats_report` DROP COLUMN `avg_queue_time`");
        await queryRunner.query("ALTER TABLE `player_stats_report` DROP COLUMN `avg_in_play_time`");
        await queryRunner.query("ALTER TABLE `revenue_report` DROP COLUMN `total_unique_players`");
        await queryRunner.query("ALTER TABLE `funnel_report` DROP COLUMN `total_unique_players`");
        await queryRunner.query("ALTER TABLE `funnel_report` DROP COLUMN `avg_session_time`");
        await queryRunner.query("ALTER TABLE `funnel_report` DROP COLUMN `avg_rounds_per_session`");
        await queryRunner.query("ALTER TABLE `funnel_report` DROP COLUMN `avg_watch_time`");
        await queryRunner.query("ALTER TABLE `funnel_report` DROP COLUMN `avg_queue_time`");
        await queryRunner.query("ALTER TABLE `funnel_report` DROP COLUMN `avg_in_play_time`");
        await queryRunner.query("ALTER TABLE `player_stats_report` DROP COLUMN `percent_autoplay_sessions`");
        await queryRunner.query("ALTER TABLE `player_stats_report` DROP COLUMN `percent_sessions_watch`");
        await queryRunner.query("ALTER TABLE `player_stats_report` DROP COLUMN `percent_sessions_queue`");
        await queryRunner.query("ALTER TABLE `player_stats_report` DROP COLUMN `percent_sessions_behind`");
        await queryRunner.query("ALTER TABLE `player_stats_report` DROP COLUMN `percent_sessions_in_play`");
        await queryRunner.query("ALTER TABLE `funnel_report` DROP COLUMN `percent_sessions_watch`");
        await queryRunner.query("ALTER TABLE `funnel_report` DROP COLUMN `percent_sessions_queue`");
        await queryRunner.query("ALTER TABLE `funnel_report` DROP COLUMN `percent_sessions_behind`");
        await queryRunner.query("ALTER TABLE `funnel_report` DROP COLUMN `percent_sessions_in_play`");
        await queryRunner.query("ALTER TABLE `funnel_report` DROP COLUMN `percent_sessions_change_denomination`");
        await queryRunner.query("ALTER TABLE `revenue_report` CHANGE `total_gross_gaming` `total_gross_gaming` decimal(16,2) NULL");
        await queryRunner.query("ALTER TABLE `revenue_report` CHANGE `total_net_gaming` `total_net_gaming` decimal(16,2) NULL");
        await queryRunner.query("ALTER TABLE `revenue_report` CHANGE `arpu` `arpu` decimal(16,2) NULL");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `activity_report` ADD `total_unique_players` int UNSIGNED NULL");
        await queryRunner.query("ALTER TABLE `funnel_report` ADD `avg_in_play_time` decimal(16,2) UNSIGNED NULL");
        await queryRunner.query("ALTER TABLE `funnel_report` ADD `avg_queue_time` decimal(16,2) UNSIGNED NULL");
        await queryRunner.query("ALTER TABLE `funnel_report` ADD `avg_watch_time` decimal(16,2) UNSIGNED NULL");
        await queryRunner.query("ALTER TABLE `funnel_report` ADD `avg_rounds_per_session` decimal(16,2) UNSIGNED NULL");
        await queryRunner.query("ALTER TABLE `funnel_report` ADD `avg_session_time` decimal(16,2) UNSIGNED NULL");
        await queryRunner.query("ALTER TABLE `funnel_report` ADD `total_unique_players` bigint UNSIGNED NULL");
        await queryRunner.query("ALTER TABLE `revenue_report` ADD `total_unique_players` int UNSIGNED NULL");
        await queryRunner.query("ALTER TABLE `player_stats_report` ADD `avg_in_play_time` decimal(16,2) UNSIGNED NULL");
        await queryRunner.query("ALTER TABLE `player_stats_report` ADD `avg_queue_time` decimal(16,2) UNSIGNED NULL");
        await queryRunner.query("ALTER TABLE `player_stats_report` ADD `avg_watch_time` decimal(16,2) UNSIGNED NULL");
        await queryRunner.query("ALTER TABLE `player_stats_report` ADD `avg_rounds_per_session` decimal(16,2) UNSIGNED NULL");
        await queryRunner.query("ALTER TABLE `player_stats_report` ADD `avg_session_time` decimal(16,2) UNSIGNED NULL");
        await queryRunner.query("ALTER TABLE `funnel_report` ADD `percent_sessions_change_denomination` decimal(16,2) UNSIGNED NULL");
        await queryRunner.query("ALTER TABLE `funnel_report` ADD `percent_sessions_in_play` decimal(16,2) UNSIGNED NULL");
        await queryRunner.query("ALTER TABLE `funnel_report` ADD `percent_sessions_behind` decimal(16,2) UNSIGNED NULL");
        await queryRunner.query("ALTER TABLE `funnel_report` ADD `percent_sessions_queue` decimal(16,2) UNSIGNED NULL");
        await queryRunner.query("ALTER TABLE `funnel_report` ADD `percent_sessions_watch` decimal(16,2) UNSIGNED NULL");
        await queryRunner.query("ALTER TABLE `player_stats_report` ADD `percent_sessions_in_play` decimal(16,2) UNSIGNED NULL");
        await queryRunner.query("ALTER TABLE `player_stats_report` ADD `percent_sessions_behind` decimal(16,2) UNSIGNED NULL");
        await queryRunner.query("ALTER TABLE `player_stats_report` ADD `percent_sessions_queue` decimal(16,2) UNSIGNED NULL");
        await queryRunner.query("ALTER TABLE `player_stats_report` ADD `percent_sessions_watch` decimal(16,2) UNSIGNED NULL");
        await queryRunner.query("ALTER TABLE `player_stats_report` ADD `percent_autoplay_sessions` decimal(16,2) UNSIGNED NULL");
        await queryRunner.query("ALTER TABLE `revenue_report` CHANGE `arpu` `arpu` decimal(16,2) UNSIGNED NULL");
        await queryRunner.query("ALTER TABLE `revenue_report` CHANGE `total_net_gaming` `total_net_gaming` decimal(16,2) UNSIGNED NULL");
        await queryRunner.query("ALTER TABLE `revenue_report` CHANGE `total_gross_gaming` `total_gross_gaming` decimal(16,2) UNSIGNED NULL");
    }
}
