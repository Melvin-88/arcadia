import {MigrationInterface, QueryRunner} from "typeorm";

export class BuyDate1592396960678 implements MigrationInterface {
    name = 'BuyDate1592396960678'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `session` ADD `buy_date` datetime NULL", undefined);
        await queryRunner.query("ALTER TABLE `session_archive` ADD `buy_date` datetime NULL", undefined);
        await queryRunner.query("ALTER TABLE `session` DROP FOREIGN KEY `FK_be1b2b01519269226ae6a7f4cd3`", undefined);
        await queryRunner.query("ALTER TABLE `session_archive` DROP FOREIGN KEY `FK_9e6c05c3a983b1f44512f045bac`", undefined);
        await queryRunner.query("ALTER TABLE `queue` CHANGE `id` `id` int UNSIGNED NOT NULL AUTO_INCREMENT", undefined);
        await queryRunner.query("ALTER TABLE `session` CHANGE `queue_id` `queue_id` int UNSIGNED NULL", undefined);
        await queryRunner.query("ALTER TABLE `group` CHANGE `stack_buy_limit` `stack_buy_limit` tinyint UNSIGNED NULL DEFAULT 10", undefined);
        await queryRunner.query("ALTER TABLE `session_archive` CHANGE `queue_id` `queue_id` int UNSIGNED NULL", undefined);
        await queryRunner.query("ALTER TABLE `session` ADD CONSTRAINT `FK_be1b2b01519269226ae6a7f4cd3` FOREIGN KEY (`queue_id`) REFERENCES `queue`(`id`) ON DELETE RESTRICT ON UPDATE NO ACTION", undefined);
        await queryRunner.query("ALTER TABLE `session_archive` ADD CONSTRAINT `FK_9e6c05c3a983b1f44512f045bac` FOREIGN KEY (`queue_id`) REFERENCES `queue`(`id`) ON DELETE RESTRICT ON UPDATE NO ACTION", undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `session_archive` DROP FOREIGN KEY `FK_9e6c05c3a983b1f44512f045bac`", undefined);
        await queryRunner.query("ALTER TABLE `session` DROP FOREIGN KEY `FK_be1b2b01519269226ae6a7f4cd3`", undefined);
        await queryRunner.query("ALTER TABLE `session_archive` CHANGE `queue_id` `queue_id` int(10) UNSIGNED NULL", undefined);
        await queryRunner.query("ALTER TABLE `group` CHANGE `stack_buy_limit` `stack_buy_limit` tinyint(3) UNSIGNED NULL DEFAULT '10'", undefined);
        await queryRunner.query("ALTER TABLE `session` CHANGE `queue_id` `queue_id` int(10) UNSIGNED NULL", undefined);
        await queryRunner.query("ALTER TABLE `queue` CHANGE `id` `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT", undefined);
        await queryRunner.query("ALTER TABLE `session_archive` ADD CONSTRAINT `FK_9e6c05c3a983b1f44512f045bac` FOREIGN KEY (`queue_id`) REFERENCES `queue`(`id`) ON DELETE RESTRICT ON UPDATE NO ACTION", undefined);
        await queryRunner.query("ALTER TABLE `session` ADD CONSTRAINT `FK_be1b2b01519269226ae6a7f4cd3` FOREIGN KEY (`queue_id`) REFERENCES `queue`(`id`) ON DELETE RESTRICT ON UPDATE NO ACTION", undefined);
        await queryRunner.query("ALTER TABLE `session_archive` DROP COLUMN `buy_date`", undefined);
        await queryRunner.query("ALTER TABLE `session` DROP COLUMN `buy_date`", undefined);
    }

}
