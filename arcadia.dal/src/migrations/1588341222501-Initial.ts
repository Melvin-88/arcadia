/* eslint-disable */
import { MigrationInterface, QueryRunner } from 'typeorm';

export class Initial1588341222501 implements MigrationInterface {
    name = 'Initial1588341222501'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("CREATE TABLE `operator` (`id` bigint(24) UNSIGNED NOT NULL AUTO_INCREMENT, `name` varchar(100) NOT NULL, `status` enum ('disabled', 'enabled') NOT NULL DEFAULT 'disabled', `api_connector_id` varchar(100) NOT NULL, `api_access_token` varchar(100) NOT NULL, `api_token_expiration_date` datetime NOT NULL, `regulation` json NOT NULL, `create_date` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `update_date` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), UNIQUE INDEX `IDX_b383ed84b5891bd42be1d2eefd` (`name`), PRIMARY KEY (`id`)) ENGINE=InnoDB", undefined);
        await queryRunner.query("CREATE TABLE `player` (`cid` varchar(200) NOT NULL, `status` enum ('active', 'in-play', 'blocked') NOT NULL DEFAULT 'active', `bets` int(10) UNSIGNED NOT NULL, `wins` int(10) UNSIGNED NOT NULL, `net_cash` decimal UNSIGNED NOT NULL, `last_session_date` datetime NOT NULL, `settings` json NOT NULL, `create_date` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `update_date` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `operator_id` bigint(24) UNSIGNED NULL, PRIMARY KEY (`cid`)) ENGINE=InnoDB", undefined);
        await queryRunner.query("CREATE TABLE `session` (`id` bigint(24) UNSIGNED NOT NULL AUTO_INCREMENT, `session_description` json NOT NULL, `player_ip` varbinary(16) NOT NULL, `rounds` int(10) UNSIGNED NOT NULL, `duration` int(10) UNSIGNED NOT NULL, `viewer_duration` int(10) UNSIGNED NOT NULL, `queue_duration` int(10) UNSIGNED NOT NULL, `total_winning` decimal UNSIGNED NOT NULL, `total_net_cash` decimal UNSIGNED NOT NULL, `total_bets` int UNSIGNED NOT NULL, `total_stacks_used` int(10) UNSIGNED NOT NULL, `currency` varchar(3) NOT NULL, `client_version` varchar(32) NOT NULL, `os` varchar(32) NOT NULL, `device_type` varchar(16) NOT NULL, `browser` varchar(32) NOT NULL, `secret` varchar(32) NOT NULL, `status` enum ('viewer', 'playing', 'queue', 'terminating', 'completed', 'terminated') NOT NULL DEFAULT 'viewer', `configuration` json NOT NULL, `is_deleted` tinyint NOT NULL DEFAULT 0, `create_date` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `update_date` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `player_cid` varchar(200) NULL, `group_id` int(10) UNSIGNED NULL, `machine_id` bigint(24) UNSIGNED NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB", undefined);
        await queryRunner.query("CREATE TABLE `machine` (`id` bigint(24) UNSIGNED NOT NULL AUTO_INCREMENT, `serial` varchar(32) NOT NULL, `secret` varchar(32) NOT NULL, `status` enum ('active', 'drying', 'offline', 'test') NOT NULL DEFAULT 'offline', `configuration` json NOT NULL, `is_deleted` tinyint NOT NULL DEFAULT 0, `create_date` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `update_date` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `group_id` int(10) UNSIGNED NULL, UNIQUE INDEX `IDX_54ac2f0c00fed63ae6b77ef20a` (`serial`), PRIMARY KEY (`id`)) ENGINE=InnoDB", undefined);
        await queryRunner.query("CREATE TABLE `group` (`id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, `name` varchar(200) NOT NULL, `denomination` decimal(10,2) NOT NULL, `regulation` json NOT NULL, `is_private` tinyint NOT NULL DEFAULT 0, `stack_size` smallint(4) NULL, `status` enum ('idle', 'in-play', 'drying', 'shutting-down', 'offline') NOT NULL DEFAULT 'offline', `idle_timeout` smallint(6) NULL, `grace_timeout` smallint(6) NULL, `scatter_round_size` smallint(6) NULL, `number_of_players_alert` smallint(6) NULL COMMENT 'Number of players in queue alert threshold', `is_deleted` tinyint NOT NULL DEFAULT 0, `create_date` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `update_date` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `operator_id` bigint(24) UNSIGNED NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB", undefined);
        await queryRunner.query("CREATE TABLE `user` (`id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, `first_name` varchar(100) NOT NULL, `last_name` varchar(100) NOT NULL, `email` varchar(100) NOT NULL, `password` varchar(250) NOT NULL, `phone` varchar(250) NOT NULL, `recover_password_token` varchar(250) NULL DEFAULT NULL, `state` enum ('active', 'disabled') NOT NULL DEFAULT 'active', `is_deleted` tinyint NOT NULL DEFAULT 0, `create_date` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `update_date` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), PRIMARY KEY (`id`)) ENGINE=InnoDB", undefined);
        await queryRunner.query("ALTER TABLE `player` ADD CONSTRAINT `FK_1c3b0472e6cec56b62aa6466afb` FOREIGN KEY (`operator_id`) REFERENCES `operator`(`id`) ON DELETE SET NULL ON UPDATE NO ACTION", undefined);
        await queryRunner.query("ALTER TABLE `session` ADD CONSTRAINT `FK_d6405ef4073adcef7c5319688f9` FOREIGN KEY (`player_cid`) REFERENCES `player`(`cid`) ON DELETE SET NULL ON UPDATE NO ACTION", undefined);
        await queryRunner.query("ALTER TABLE `session` ADD CONSTRAINT `FK_6f0d9bf5bd78eeb8f7784a93bad` FOREIGN KEY (`group_id`) REFERENCES `group`(`id`) ON DELETE SET NULL ON UPDATE NO ACTION", undefined);
        await queryRunner.query("ALTER TABLE `session` ADD CONSTRAINT `FK_3b3285b47c005090d7b46bb979a` FOREIGN KEY (`machine_id`) REFERENCES `machine`(`id`) ON DELETE SET NULL ON UPDATE NO ACTION", undefined);
        await queryRunner.query("ALTER TABLE `machine` ADD CONSTRAINT `FK_b5621347d2026612de818980f00` FOREIGN KEY (`group_id`) REFERENCES `group`(`id`) ON DELETE SET NULL ON UPDATE NO ACTION", undefined);
        await queryRunner.query("ALTER TABLE `group` ADD CONSTRAINT `FK_64163d99f930dad5086b67dcfee` FOREIGN KEY (`operator_id`) REFERENCES `operator`(`id`) ON DELETE SET NULL ON UPDATE NO ACTION", undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `group` DROP FOREIGN KEY `FK_64163d99f930dad5086b67dcfee`", undefined);
        await queryRunner.query("ALTER TABLE `machine` DROP FOREIGN KEY `FK_b5621347d2026612de818980f00`", undefined);
        await queryRunner.query("ALTER TABLE `session` DROP FOREIGN KEY `FK_3b3285b47c005090d7b46bb979a`", undefined);
        await queryRunner.query("ALTER TABLE `session` DROP FOREIGN KEY `FK_6f0d9bf5bd78eeb8f7784a93bad`", undefined);
        await queryRunner.query("ALTER TABLE `session` DROP FOREIGN KEY `FK_d6405ef4073adcef7c5319688f9`", undefined);
        await queryRunner.query("ALTER TABLE `player` DROP FOREIGN KEY `FK_1c3b0472e6cec56b62aa6466afb`", undefined);
        await queryRunner.query("DROP TABLE `user`", undefined);
        await queryRunner.query("DROP TABLE `group`", undefined);
        await queryRunner.query("DROP INDEX `IDX_54ac2f0c00fed63ae6b77ef20a` ON `machine`", undefined);
        await queryRunner.query("DROP TABLE `machine`", undefined);
        await queryRunner.query("DROP TABLE `session`", undefined);
        await queryRunner.query("DROP TABLE `player`", undefined);
        await queryRunner.query("DROP INDEX `IDX_b383ed84b5891bd42be1d2eefd` ON `operator`", undefined);
        await queryRunner.query("DROP TABLE `operator`", undefined);
    }
}
