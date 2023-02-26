import {MigrationInterface, QueryRunner} from "typeorm";

export class QueueToMachineDep1591346157447 implements MigrationInterface {
    name = 'QueueToMachineDep1591346157447'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `session` DROP COLUMN `secret`", undefined);
        await queryRunner.query("ALTER TABLE `machine` DROP COLUMN `secret`", undefined);
        await queryRunner.query("ALTER TABLE `queue` ADD `machine_id` int(10) UNSIGNED NULL", undefined);
        await queryRunner.query("ALTER TABLE `queue` ADD UNIQUE INDEX `IDX_1826f32b60a211f45219cc3f3f` (`machine_id`)", undefined);
        await queryRunner.query("ALTER TABLE `dispute` CHANGE `rebate_sum` `rebate_sum` decimal(10,2) UNSIGNED NOT NULL DEFAULT '0.00'", undefined);
        await queryRunner.query("ALTER TABLE `player` CHANGE `net_cash` `net_cash` decimal(10,2) UNSIGNED NOT NULL DEFAULT '0.00'", undefined);
        await queryRunner.query("ALTER TABLE `session` DROP FOREIGN KEY `FK_be1b2b01519269226ae6a7f4cd3`", undefined);
        await queryRunner.query("ALTER TABLE `queue` CHANGE `id` `id` int UNSIGNED NOT NULL AUTO_INCREMENT", undefined);
        await queryRunner.query("ALTER TABLE `session` CHANGE `rounds` `rounds` int(10) UNSIGNED NOT NULL DEFAULT 0", undefined);
        await queryRunner.query("ALTER TABLE `session` CHANGE `duration` `duration` int(10) UNSIGNED NOT NULL DEFAULT 0", undefined);
        await queryRunner.query("ALTER TABLE `session` CHANGE `viewer_duration` `viewer_duration` int(10) UNSIGNED NOT NULL DEFAULT 0", undefined);
        await queryRunner.query("ALTER TABLE `session` CHANGE `queue_duration` `queue_duration` int(10) UNSIGNED NOT NULL DEFAULT 0", undefined);
        await queryRunner.query("ALTER TABLE `session` CHANGE `total_winning` `total_winning` decimal(10,2) UNSIGNED NOT NULL DEFAULT '0.00'", undefined);
        await queryRunner.query("ALTER TABLE `session` CHANGE `total_net_cash` `total_net_cash` decimal(10,2) UNSIGNED NOT NULL DEFAULT '0.00'", undefined);
        await queryRunner.query("ALTER TABLE `session` DROP COLUMN `total_bets`", undefined);
        await queryRunner.query("ALTER TABLE `session` ADD `total_bets` decimal(10,2) UNSIGNED NOT NULL DEFAULT '0.00'", undefined);
        await queryRunner.query("ALTER TABLE `session` CHANGE `total_stacks_used` `total_stacks_used` int(10) UNSIGNED NOT NULL DEFAULT 0", undefined);
        await queryRunner.query("ALTER TABLE `session` CHANGE `queue_id` `queue_id` int UNSIGNED NULL", undefined);
        await queryRunner.query("CREATE UNIQUE INDEX `REL_1826f32b60a211f45219cc3f3f` ON `queue` (`machine_id`)", undefined);
        await queryRunner.query("ALTER TABLE `queue` ADD CONSTRAINT `FK_1826f32b60a211f45219cc3f3ff` FOREIGN KEY (`machine_id`) REFERENCES `machine`(`id`) ON DELETE SET NULL ON UPDATE NO ACTION", undefined);
        await queryRunner.query("ALTER TABLE `session` ADD CONSTRAINT `FK_be1b2b01519269226ae6a7f4cd3` FOREIGN KEY (`queue_id`) REFERENCES `queue`(`id`) ON DELETE RESTRICT ON UPDATE NO ACTION", undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `session` DROP FOREIGN KEY `FK_be1b2b01519269226ae6a7f4cd3`", undefined);
        await queryRunner.query("ALTER TABLE `queue` DROP FOREIGN KEY `FK_1826f32b60a211f45219cc3f3ff`", undefined);
        await queryRunner.query("DROP INDEX `REL_1826f32b60a211f45219cc3f3f` ON `queue`", undefined);
        await queryRunner.query("ALTER TABLE `session` CHANGE `queue_id` `queue_id` int(10) UNSIGNED NULL", undefined);
        await queryRunner.query("ALTER TABLE `session` CHANGE `total_stacks_used` `total_stacks_used` int(10) UNSIGNED NOT NULL", undefined);
        await queryRunner.query("ALTER TABLE `session` DROP COLUMN `total_bets`", undefined);
        await queryRunner.query("ALTER TABLE `session` ADD `total_bets` int(10) UNSIGNED NOT NULL DEFAULT '0'", undefined);
        await queryRunner.query("ALTER TABLE `session` CHANGE `total_net_cash` `total_net_cash` decimal(10,0) UNSIGNED NOT NULL DEFAULT '0'", undefined);
        await queryRunner.query("ALTER TABLE `session` CHANGE `total_winning` `total_winning` decimal(10,0) UNSIGNED NOT NULL DEFAULT '0'", undefined);
        await queryRunner.query("ALTER TABLE `session` CHANGE `queue_duration` `queue_duration` int(10) UNSIGNED NOT NULL", undefined);
        await queryRunner.query("ALTER TABLE `session` CHANGE `viewer_duration` `viewer_duration` int(10) UNSIGNED NOT NULL", undefined);
        await queryRunner.query("ALTER TABLE `session` CHANGE `duration` `duration` int(10) UNSIGNED NOT NULL", undefined);
        await queryRunner.query("ALTER TABLE `session` CHANGE `rounds` `rounds` int(10) UNSIGNED NOT NULL", undefined);
        await queryRunner.query("ALTER TABLE `queue` CHANGE `id` `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT", undefined);
        await queryRunner.query("ALTER TABLE `session` ADD CONSTRAINT `FK_be1b2b01519269226ae6a7f4cd3` FOREIGN KEY (`queue_id`) REFERENCES `queue`(`id`) ON DELETE RESTRICT ON UPDATE NO ACTION", undefined);
        await queryRunner.query("ALTER TABLE `player` CHANGE `net_cash` `net_cash` decimal(10,0) UNSIGNED NOT NULL", undefined);
        await queryRunner.query("ALTER TABLE `dispute` CHANGE `rebate_sum` `rebate_sum` decimal(10,0) UNSIGNED NOT NULL DEFAULT '0'", undefined);
        await queryRunner.query("ALTER TABLE `queue` DROP INDEX `IDX_1826f32b60a211f45219cc3f3f`", undefined);
        await queryRunner.query("ALTER TABLE `queue` DROP COLUMN `machine_id`", undefined);
        await queryRunner.query("ALTER TABLE `machine` ADD `secret` varchar(32) NOT NULL", undefined);
        await queryRunner.query("ALTER TABLE `session` ADD `secret` varchar(32) NOT NULL", undefined);
    }

}
