import { MigrationInterface, QueryRunner } from 'typeorm';

export class Initial1589870405258 implements MigrationInterface {
    name = 'Initial1589870405258'

    public async up(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query('CREATE TABLE `voucher` (`id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, `status` enum (\'pending\', \'used\', \'revoked\') NOT NULL DEFAULT \'pending\', `revocation_reason` varchar(64) NULL, `create_date` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `update_date` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `expiration_date` datetime NULL, `operator_id` bigint(24) UNSIGNED NULL, `player_cid` varchar(200) NULL, `group_id` int(10) UNSIGNED NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB', undefined);
      await queryRunner.query('CREATE TABLE `dispute` (`id` bigint(24) UNSIGNED NOT NULL AUTO_INCREMENT, `status` enum (\'open\', \'inquiring\', \'closed\') NOT NULL DEFAULT \'open\', `rebate_sum` decimal UNSIGNED NOT NULL DEFAULT 0, `rebate_currency` varchar(3) NOT NULL, `create_date` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `update_date` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `closed_date` datetime NULL, `complaint` text NOT NULL, `discussion` text NOT NULL, `operator_id` bigint(24) UNSIGNED NULL, `player_cid` varchar(200) NULL, `session_id` bigint(24) UNSIGNED NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB', undefined);
      await queryRunner.query('CREATE TABLE `alert` (`id` bigint(24) UNSIGNED NOT NULL AUTO_INCREMENT, `status` enum (\'active\', \'dismissed\') NOT NULL DEFAULT \'active\', `type` enum (\'information\', \'warning\', \'alert\', \'critical\') NOT NULL DEFAULT \'information\', `source` varchar(32) NOT NULL, `severity` enum (\'high\', \'medium\', \'low\') NOT NULL DEFAULT \'low\', `create_date` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `update_date` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `description` text NOT NULL, `additional_information` json NOT NULL, `is_flagged` tinyint NOT NULL DEFAULT 0, PRIMARY KEY (`id`)) ENGINE=InnoDB', undefined);
      await queryRunner.query('ALTER TABLE `operator` ADD `is_deleted` tinyint NOT NULL DEFAULT 0', undefined);
      await queryRunner.query('ALTER TABLE `machine` ADD `camera_id` varchar(32) NOT NULL', undefined);
      await queryRunner.query('ALTER TABLE `machine` ADD `controller_ip` varbinary(16) NOT NULL', undefined);
      await queryRunner.query('ALTER TABLE `machine` ADD `name` varchar(200) NOT NULL', undefined);
      await queryRunner.query('ALTER TABLE `machine` ADD `location` varchar(32) NOT NULL', undefined);
      await queryRunner.query('ALTER TABLE `machine` ADD `status_update_date` datetime NULL', undefined);
      await queryRunner.query('ALTER TABLE `machine` ADD `last_diagnostic_date` datetime NULL', undefined);
      await queryRunner.query('ALTER TABLE `user` ADD `phone2` varchar(250) NULL', undefined);
      await queryRunner.query('ALTER TABLE `user` ADD `is_admin` tinyint NOT NULL DEFAULT 0', undefined);
      await queryRunner.query('ALTER TABLE `user` ADD `last_access_date` datetime NULL', undefined);
      await queryRunner.query('ALTER TABLE `user` ADD `last_access_ip` varbinary(16) NULL', undefined);
      await queryRunner.query('ALTER TABLE `player` CHANGE `net_cash` `net_cash` decimal UNSIGNED NOT NULL', undefined);
      await queryRunner.query('ALTER TABLE `session` DROP FOREIGN KEY `FK_6f0d9bf5bd78eeb8f7784a93bad`', undefined);
      await queryRunner.query('ALTER TABLE `session` DROP FOREIGN KEY `FK_3b3285b47c005090d7b46bb979a`', undefined);
      await queryRunner.query('ALTER TABLE `session` CHANGE `total_winning` `total_winning` decimal UNSIGNED NOT NULL DEFAULT 0', undefined);
      await queryRunner.query('ALTER TABLE `session` CHANGE `total_net_cash` `total_net_cash` decimal UNSIGNED NOT NULL DEFAULT 0', undefined);
      await queryRunner.query('ALTER TABLE `session` CHANGE `total_bets` `total_bets` int UNSIGNED NOT NULL DEFAULT 0', undefined);
      await queryRunner.query('ALTER TABLE `session` DROP COLUMN `group_id`', undefined);
      await queryRunner.query('ALTER TABLE `session` ADD `group_id` int(10) UNSIGNED NULL', undefined);
      await queryRunner.query('ALTER TABLE `session` DROP COLUMN `machine_id`', undefined);
      await queryRunner.query('ALTER TABLE `session` ADD `machine_id` int(10) UNSIGNED NULL', undefined);
      await queryRunner.query('ALTER TABLE `machine` DROP FOREIGN KEY `FK_b5621347d2026612de818980f00`', undefined);
      await queryRunner.query('ALTER TABLE `machine` CHANGE `id` `id` bigint(24) UNSIGNED NOT NULL', undefined);
      await queryRunner.query('ALTER TABLE `machine` DROP PRIMARY KEY', undefined);
      await queryRunner.query('ALTER TABLE `machine` DROP COLUMN `id`', undefined);
      await queryRunner.query('ALTER TABLE `machine` ADD `id` int(10) UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT', undefined);
      await queryRunner.query('ALTER TABLE `machine` ADD `status2` enum (\'in-play\', \'preparing\', \'ready\', \'drying\', \'shutting-down\', \'stopped\') NOT NULL DEFAULT \'stopped\'', undefined);
      await queryRunner.query('update `machine` set `status2` =  `status`+0', undefined);
      await queryRunner.query('ALTER TABLE `machine` DROP `status`', undefined);
      await queryRunner.query('ALTER TABLE `machine` CHANGE `status2` `status` enum (\'in-play\', \'preparing\', \'ready\', \'drying\', \'shutting-down\', \'stopped\') NOT NULL DEFAULT \'stopped\'', undefined);
      await queryRunner.query('ALTER TABLE `machine` DROP COLUMN `group_id`', undefined);
      await queryRunner.query('ALTER TABLE `machine` ADD `group_id` int(10) UNSIGNED NULL', undefined);
      await queryRunner.query('ALTER TABLE `group` CHANGE `id` `id` bigint(24) UNSIGNED NOT NULL', undefined);
      await queryRunner.query('ALTER TABLE `group` DROP PRIMARY KEY', undefined);
      await queryRunner.query('ALTER TABLE `group` DROP COLUMN `id`', undefined);
      await queryRunner.query('ALTER TABLE `group` ADD `id` int(10) UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT', undefined);
      await queryRunner.query('ALTER TABLE `group` CHANGE `regulation` `regulation` json NOT NULL', undefined);
      await queryRunner.query('ALTER TABLE `user` CHANGE `recover_password_token` `recover_password_token` varchar(250) NULL DEFAULT NULL', undefined);
      await queryRunner.query('ALTER TABLE `voucher` ADD CONSTRAINT `FK_f3d008c2a1350dae2859c8ea43c` FOREIGN KEY (`operator_id`) REFERENCES `operator`(`id`) ON DELETE SET NULL ON UPDATE NO ACTION', undefined);
      await queryRunner.query('ALTER TABLE `voucher` ADD CONSTRAINT `FK_1d56cea5fa79f8b487da3e47ac1` FOREIGN KEY (`player_cid`) REFERENCES `player`(`cid`) ON DELETE SET NULL ON UPDATE NO ACTION', undefined);
      await queryRunner.query('ALTER TABLE `voucher` ADD CONSTRAINT `FK_a501e3f606ab10b402e87075f8c` FOREIGN KEY (`group_id`) REFERENCES `group`(`id`) ON DELETE SET NULL ON UPDATE NO ACTION', undefined);
      await queryRunner.query('ALTER TABLE `dispute` ADD CONSTRAINT `FK_d7365d0825c18bc1f1e821a4182` FOREIGN KEY (`operator_id`) REFERENCES `operator`(`id`) ON DELETE SET NULL ON UPDATE NO ACTION', undefined);
      await queryRunner.query('ALTER TABLE `dispute` ADD CONSTRAINT `FK_856d88dda63fe16ab5d92f6b2ce` FOREIGN KEY (`player_cid`) REFERENCES `player`(`cid`) ON DELETE SET NULL ON UPDATE NO ACTION', undefined);
      await queryRunner.query('ALTER TABLE `dispute` ADD CONSTRAINT `FK_0b7c5bf657eb0a326be000cbac4` FOREIGN KEY (`session_id`) REFERENCES `session`(`id`) ON DELETE SET NULL ON UPDATE NO ACTION', undefined);
      await queryRunner.query('ALTER TABLE `session` ADD CONSTRAINT `FK_6f0d9bf5bd78eeb8f7784a93bad` FOREIGN KEY (`group_id`) REFERENCES `group`(`id`) ON DELETE SET NULL ON UPDATE NO ACTION', undefined);
      await queryRunner.query('ALTER TABLE `session` ADD CONSTRAINT `FK_3b3285b47c005090d7b46bb979a` FOREIGN KEY (`machine_id`) REFERENCES `machine`(`id`) ON DELETE SET NULL ON UPDATE NO ACTION', undefined);
      await queryRunner.query('ALTER TABLE `machine` ADD CONSTRAINT `FK_b5621347d2026612de818980f00` FOREIGN KEY (`group_id`) REFERENCES `group`(`id`) ON DELETE SET NULL ON UPDATE NO ACTION', undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query('ALTER TABLE `machine` DROP FOREIGN KEY `FK_b5621347d2026612de818980f00`', undefined);
      await queryRunner.query('ALTER TABLE `session` DROP FOREIGN KEY `FK_3b3285b47c005090d7b46bb979a`', undefined);
      await queryRunner.query('ALTER TABLE `session` DROP FOREIGN KEY `FK_6f0d9bf5bd78eeb8f7784a93bad`', undefined);
      await queryRunner.query('ALTER TABLE `dispute` DROP FOREIGN KEY `FK_0b7c5bf657eb0a326be000cbac4`', undefined);
      await queryRunner.query('ALTER TABLE `dispute` DROP FOREIGN KEY `FK_856d88dda63fe16ab5d92f6b2ce`', undefined);
      await queryRunner.query('ALTER TABLE `dispute` DROP FOREIGN KEY `FK_d7365d0825c18bc1f1e821a4182`', undefined);
      await queryRunner.query('ALTER TABLE `voucher` DROP FOREIGN KEY `FK_a501e3f606ab10b402e87075f8c`', undefined);
      await queryRunner.query('ALTER TABLE `voucher` DROP FOREIGN KEY `FK_1d56cea5fa79f8b487da3e47ac1`', undefined);
      await queryRunner.query('ALTER TABLE `voucher` DROP FOREIGN KEY `FK_f3d008c2a1350dae2859c8ea43c`', undefined);
      await queryRunner.query('ALTER TABLE `user` CHANGE `recover_password_token` `recover_password_token` varchar(250) NULL', undefined);
      await queryRunner.query('ALTER TABLE `group` CHANGE `regulation` `regulation` json NULL', undefined);
      await queryRunner.query('ALTER TABLE `group` DROP COLUMN `id`', undefined);
      await queryRunner.query('ALTER TABLE `group` ADD `id` bigint(24) UNSIGNED NOT NULL AUTO_INCREMENT', undefined);
      await queryRunner.query('ALTER TABLE `group` ADD PRIMARY KEY (`id`)', undefined);
      await queryRunner.query('ALTER TABLE `group` CHANGE `id` `id` bigint(24) UNSIGNED NOT NULL AUTO_INCREMENT', undefined);
      await queryRunner.query('ALTER TABLE `machine` DROP COLUMN `group_id`', undefined);
      await queryRunner.query('ALTER TABLE `machine` ADD `group_id` bigint(24) UNSIGNED NULL', undefined);
      await queryRunner.query('ALTER TABLE `machine` CHANGE `status` `status` enum (\'active\', \'drying\', \'offline\', \'test\') NOT NULL DEFAULT \'offline\'', undefined);
      await queryRunner.query('ALTER TABLE `machine` DROP COLUMN `id`', undefined);
      await queryRunner.query('ALTER TABLE `machine` ADD `id` bigint(24) UNSIGNED NOT NULL AUTO_INCREMENT', undefined);
      await queryRunner.query('ALTER TABLE `machine` ADD PRIMARY KEY (`id`)', undefined);
      await queryRunner.query('ALTER TABLE `machine` CHANGE `id` `id` bigint(24) UNSIGNED NOT NULL AUTO_INCREMENT', undefined);
      await queryRunner.query('ALTER TABLE `machine` ADD CONSTRAINT `FK_b5621347d2026612de818980f00` FOREIGN KEY (`group_id`) REFERENCES `group`(`id`) ON DELETE SET NULL ON UPDATE NO ACTION', undefined);
      await queryRunner.query('ALTER TABLE `session` DROP COLUMN `machine_id`', undefined);
      await queryRunner.query('ALTER TABLE `session` ADD `machine_id` bigint(24) UNSIGNED NULL', undefined);
      await queryRunner.query('ALTER TABLE `session` DROP COLUMN `group_id`', undefined);
      await queryRunner.query('ALTER TABLE `session` ADD `group_id` bigint(24) UNSIGNED NULL', undefined);
      await queryRunner.query('ALTER TABLE `session` CHANGE `total_bets` `total_bets` int(10) UNSIGNED NOT NULL DEFAULT \'0\'', undefined);
      await queryRunner.query('ALTER TABLE `session` CHANGE `total_net_cash` `total_net_cash` decimal(10,2) UNSIGNED NOT NULL DEFAULT \'0.00\'', undefined);
      await queryRunner.query('ALTER TABLE `session` CHANGE `total_winning` `total_winning` decimal(10,2) UNSIGNED NOT NULL DEFAULT \'0.00\'', undefined);
      await queryRunner.query('ALTER TABLE `session` ADD CONSTRAINT `FK_3b3285b47c005090d7b46bb979a` FOREIGN KEY (`machine_id`) REFERENCES `machine`(`id`) ON DELETE SET NULL ON UPDATE NO ACTION', undefined);
      await queryRunner.query('ALTER TABLE `session` ADD CONSTRAINT `FK_6f0d9bf5bd78eeb8f7784a93bad` FOREIGN KEY (`group_id`) REFERENCES `group`(`id`) ON DELETE SET NULL ON UPDATE NO ACTION', undefined);
      await queryRunner.query('ALTER TABLE `player` CHANGE `net_cash` `net_cash` decimal(10,0) UNSIGNED NOT NULL', undefined);
      await queryRunner.query('ALTER TABLE `user` DROP COLUMN `last_access_ip`', undefined);
      await queryRunner.query('ALTER TABLE `user` DROP COLUMN `last_access_date`', undefined);
      await queryRunner.query('ALTER TABLE `user` DROP COLUMN `is_admin`', undefined);
      await queryRunner.query('ALTER TABLE `user` DROP COLUMN `phone2`', undefined);
      await queryRunner.query('ALTER TABLE `machine` DROP COLUMN `last_diagnostic_date`', undefined);
      await queryRunner.query('ALTER TABLE `machine` DROP COLUMN `status_update_date`', undefined);
      await queryRunner.query('ALTER TABLE `machine` DROP COLUMN `location`', undefined);
      await queryRunner.query('ALTER TABLE `machine` DROP COLUMN `name`', undefined);
      await queryRunner.query('ALTER TABLE `machine` DROP COLUMN `controller_ip`', undefined);
      await queryRunner.query('ALTER TABLE `machine` DROP COLUMN `camera_id`', undefined);
      await queryRunner.query('ALTER TABLE `operator` DROP COLUMN `is_deleted`', undefined);
      await queryRunner.query('ALTER TABLE `machine` ADD `secret` varchar(32) NOT NULL', undefined);
      await queryRunner.query('DROP TABLE `alert`', undefined);
      await queryRunner.query('DROP TABLE `dispute`', undefined);
      await queryRunner.query('DROP TABLE `voucher`', undefined);
    }
}
