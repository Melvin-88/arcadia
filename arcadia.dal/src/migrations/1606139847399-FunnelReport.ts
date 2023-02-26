import {MigrationInterface, QueryRunner} from "typeorm";

export class FunnelReport1606139847399 implements MigrationInterface {
    name = 'FunnelReport1606139847399'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("CREATE TABLE `funnel_report` (`id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, `params` json NOT NULL, `params_hash` varchar(255) NULL, `grouping_key` enum ('operator', 'site', 'group', 'machine', 'month', 'denomination', 'day') NULL, `grouping_value` varchar(64) NULL, `date` varchar(16) NOT NULL, `total_unique_players` bigint UNSIGNED NULL, `total_unique_sessions` bigint UNSIGNED NULL, `total_session_time` bigint UNSIGNED NULL, `avg_session_time` decimal(16,2) UNSIGNED NULL, `total_rounds_played` bigint UNSIGNED NULL, `avg_rounds_per_session` decimal(16,2) UNSIGNED NULL, `total_watch_time` bigint UNSIGNED NULL, `avg_watch_time` decimal(16,2) UNSIGNED NULL, `max_watch_time` bigint UNSIGNED NULL, `total_queue_time` bigint UNSIGNED NULL, `avg_queue_time` decimal(16,2) UNSIGNED NULL, `max_queue_time` bigint UNSIGNED NULL, `total_in_play_time` bigint UNSIGNED NULL, `avg_in_play_time` decimal(16,2) UNSIGNED NULL, `max_in_play_time` bigint UNSIGNED NULL, `total_sessions_watch` bigint UNSIGNED NULL, `percent_sessions_watch` decimal(16,2) UNSIGNED NULL, `total_sessions_queue` bigint UNSIGNED NULL, `percent_sessions_queue` decimal(16,2) UNSIGNED NULL, `total_sessions_behind` bigint UNSIGNED NULL, `percent_sessions_behind` decimal(16,2) UNSIGNED NULL, `total_sessions_in_play` bigint UNSIGNED NULL, `percent_sessions_in_play` decimal(16,2) UNSIGNED NULL, `total_sessions_change_denomination` bigint UNSIGNED NULL, `percent_sessions_change_denomination` decimal(16,2) UNSIGNED NULL, `is_completed` tinyint NOT NULL, `create_date` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `update_date` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), PRIMARY KEY (`id`)) ENGINE=InnoDB");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("DROP TABLE `funnel_report`");
    }

}
