import {MigrationInterface, QueryRunner} from "typeorm";

export class SessionArchive1595424785089 implements MigrationInterface {
    name = 'SessionArchive1595424785089'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("CREATE TABLE `session_archive` (`id` bigint UNSIGNED NOT NULL, `player_cid` varchar(128) NOT NULL, `player_name` varchar(128) NOT NULL, `player_ip` varbinary(16) NOT NULL, `client_app_version` varchar(32) NULL, `operator_id` bigint UNSIGNED NOT NULL, `operator_name` varchar(128) NOT NULL, `group_id` bigint UNSIGNED NOT NULL, `group_name` varchar(128) NOT NULL, `machine_id` bigint UNSIGNED NOT NULL, `machine_serial` varchar(64) NOT NULL, `status` enum ('viewer', 'playing', 'autoplay', 'queue', 'terminating', 'completed', 'terminated', 'forcedAutoplay', 'viewerBetBehind', 'queueBetBehind') NOT NULL, `queue_id` bigint UNSIGNED NOT NULL, `balance` decimal(10,2) UNSIGNED NOT NULL, `stack_size` tinyint(3) UNSIGNED NOT NULL, `last_purchase_amount` decimal(10,2) UNSIGNED NOT NULL DEFAULT '0.00', `is_scatter` tinyint NOT NULL DEFAULT 0, `voucher_id` bigint UNSIGNED NULL, `total_winning` decimal(10,2) UNSIGNED NOT NULL DEFAULT '0.00', `total_net_cash` decimal(10,2) NOT NULL DEFAULT '0.00', `total_bets` decimal(10,2) UNSIGNED NOT NULL DEFAULT '0.00', `configuration` json NOT NULL, `client_api_server_ip` varbinary(16) NULL, `start_date` datetime NOT NULL, `end_date` datetime NOT NULL, `duration` smallint(5) UNSIGNED NOT NULL DEFAULT 0, `viewer_duration` smallint(5) UNSIGNED NOT NULL DEFAULT 0, `queue_duration` smallint(5) UNSIGNED NOT NULL DEFAULT 0, `session_description` json NULL, `total_stacks_used` tinyint(3) UNSIGNED NOT NULL DEFAULT 0, `currency` varchar(3) NOT NULL, `locale` varchar(10) NOT NULL, `is_queue_change_offered` tinyint NOT NULL DEFAULT 0, `os` varchar(64) NOT NULL, `device_type` varchar(64) NOT NULL, `browser` varchar(64) NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("DROP TABLE `session_archive`");
    }

}
