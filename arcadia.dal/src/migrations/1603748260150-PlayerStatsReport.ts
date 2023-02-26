import {MigrationInterface, QueryRunner} from "typeorm";

export class PlayerStatsReport1603748260150 implements MigrationInterface {
    name = 'PlayerStatsReport1603748260150'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("CREATE TABLE `player_stats_report` (`id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, `params` json NOT NULL, `params_hash` varchar(255) NULL, `grouping_key` enum ('player') NULL, `grouping_value` varchar(64) NULL, `date` varchar(16) NOT NULL, `total_unique_sessions` decimal(16,2) UNSIGNED NULL, `total_session_time` decimal(16,2) UNSIGNED NULL, `avg_session_time` decimal(16,2) UNSIGNED NULL, `total_rounds_played` decimal(16,2) UNSIGNED NULL, `avg_rounds_per_session` decimal(16,2) UNSIGNED NULL, `total_bets` decimal(16,2) UNSIGNED NULL, `total_wins` decimal(16,2) UNSIGNED NULL, `total_behind_bets` decimal(16,2) UNSIGNED NULL, `total_behind_wins` decimal(16,2) UNSIGNED NULL, `total_voucher_bets` decimal(16,2) UNSIGNED NULL, `total_voucher_wins` decimal(16,2) UNSIGNED NULL, `total_refunds` decimal(16,2) UNSIGNED NULL, `total_gross_gaming` decimal(16,2) UNSIGNED NULL, `total_net_gaming` decimal(16,2) UNSIGNED NULL, `total_watch_time` decimal(16,2) UNSIGNED NULL, `avg_watch_time` decimal(16,2) UNSIGNED NULL, `max_watch_time` decimal(16,2) UNSIGNED NULL, `total_queue_time` decimal(16,2) UNSIGNED NULL, `avg_queue_time` decimal(16,2) UNSIGNED NULL, `max_queue_time` decimal(16,2) UNSIGNED NULL, `total_in_play_time` decimal(16,2) UNSIGNED NULL, `avg_in_play_time` decimal(16,2) UNSIGNED NULL, `max_in_play_time` decimal(16,2) UNSIGNED NULL, `total_autoplay_bets` decimal(16,2) UNSIGNED NULL, `total_autoplay_wins` decimal(16,2) UNSIGNED NULL, `percent_autoplay_sessions` decimal(16,2) UNSIGNED NULL, `total_sessions_watch` decimal(16,2) UNSIGNED NULL, `percent_sessions_watch` decimal(16,2) UNSIGNED NULL, `total_sessions_queue` decimal(16,2) UNSIGNED NULL, `percent_sessions_queue` decimal(16,2) UNSIGNED NULL, `total_sessions_behind` decimal(16,2) UNSIGNED NULL, `percent_sessions_behind` decimal(16,2) UNSIGNED NULL, `total_sessions_in_play` decimal(16,2) UNSIGNED NULL, `percent_sessions_in_play` decimal(16,2) UNSIGNED NULL, `is_completed` tinyint NOT NULL, `create_date` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `update_date` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), PRIMARY KEY (`id`)) ENGINE=InnoDB");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("DROP TABLE `player_stats_report`");
    }
}
