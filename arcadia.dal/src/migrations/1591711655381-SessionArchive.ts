import {MigrationInterface, QueryRunner} from "typeorm";

export class SessionArchive1591711655381 implements MigrationInterface {
    name = 'SessionArchive1591711655381'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("CREATE TABLE `session_archive` (`id` bigint(24) UNSIGNED NOT NULL AUTO_INCREMENT, `session_description` json NOT NULL, `player_ip` varbinary(16) NOT NULL, `rounds` int(10) UNSIGNED NOT NULL DEFAULT 0, `coins` int(10) UNSIGNED NOT NULL DEFAULT 0, `duration` int(10) UNSIGNED NOT NULL DEFAULT 0, `viewer_duration` int(10) UNSIGNED NOT NULL DEFAULT 0, `queue_duration` int(10) UNSIGNED NOT NULL DEFAULT 0, `total_winning` decimal(10,2) UNSIGNED NOT NULL DEFAULT '0.00', `total_net_cash` decimal(10,2) UNSIGNED NOT NULL DEFAULT '0.00', `total_bets` decimal(10,2) UNSIGNED NOT NULL DEFAULT '0.00', `total_stacks_used` int(10) UNSIGNED NOT NULL DEFAULT 0, `currency` varchar(3) NOT NULL, `client_version` varchar(32) NOT NULL, `os` varchar(32) NOT NULL, `device_type` varchar(16) NOT NULL, `browser` varchar(32) NOT NULL, `status` enum ('viewer', 'playing', 'queue', 'terminating', 'completed', 'terminated') NOT NULL DEFAULT 'viewer', `configuration` json NOT NULL, `is_deleted` tinyint NOT NULL DEFAULT 0, `create_date` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `update_date` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `player_cid` varchar(200) NULL, `queue_id` int UNSIGNED NULL, `group_id` int(10) UNSIGNED NULL, `machine_id` int(10) UNSIGNED NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB", undefined);
        await queryRunner.query("ALTER TABLE `session_archive` ADD CONSTRAINT `FK_a5392b079539ddd65f78dce3a31` FOREIGN KEY (`player_cid`) REFERENCES `player`(`cid`) ON DELETE SET NULL ON UPDATE NO ACTION", undefined);
        await queryRunner.query("ALTER TABLE `session_archive` ADD CONSTRAINT `FK_9e6c05c3a983b1f44512f045bac` FOREIGN KEY (`queue_id`) REFERENCES `queue`(`id`) ON DELETE RESTRICT ON UPDATE NO ACTION", undefined);
        await queryRunner.query("ALTER TABLE `session_archive` ADD CONSTRAINT `FK_f13f26685401e31ee9b7dee6b83` FOREIGN KEY (`group_id`) REFERENCES `group`(`id`) ON DELETE SET NULL ON UPDATE NO ACTION", undefined);
        await queryRunner.query("ALTER TABLE `session_archive` ADD CONSTRAINT `FK_3b9c245866e1a82e2ade51f0967` FOREIGN KEY (`machine_id`) REFERENCES `machine`(`id`) ON DELETE SET NULL ON UPDATE NO ACTION", undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `session_archive` DROP FOREIGN KEY `FK_3b9c245866e1a82e2ade51f0967`", undefined);
        await queryRunner.query("ALTER TABLE `session_archive` DROP FOREIGN KEY `FK_f13f26685401e31ee9b7dee6b83`", undefined);
        await queryRunner.query("ALTER TABLE `session_archive` DROP FOREIGN KEY `FK_9e6c05c3a983b1f44512f045bac`", undefined);
        await queryRunner.query("ALTER TABLE `session_archive` DROP FOREIGN KEY `FK_a5392b079539ddd65f78dce3a31`", undefined);
        await queryRunner.query("DROP TABLE `session_archive`", undefined);
    }

}
