import {MigrationInterface, QueryRunner} from "typeorm";

export class StackBuyLimit1591776793112 implements MigrationInterface {
    name = 'StackBuyLimit1591776793112'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("DROP INDEX `IDX_1826f32b60a211f45219cc3f3f` ON `queue`", undefined);
        await queryRunner.query("ALTER TABLE `group` ADD `stack_buy_limit` tinyint UNSIGNED NULL DEFAULT 10", undefined);
        await queryRunner.query("ALTER TABLE `session` DROP FOREIGN KEY `FK_be1b2b01519269226ae6a7f4cd3`", undefined);
        await queryRunner.query("ALTER TABLE `session_archive` DROP FOREIGN KEY `FK_9e6c05c3a983b1f44512f045bac`", undefined);
        await queryRunner.query("ALTER TABLE `queue` CHANGE `id` `id` int UNSIGNED NOT NULL AUTO_INCREMENT", undefined);
        await queryRunner.query("ALTER TABLE `session` CHANGE `queue_id` `queue_id` int UNSIGNED NULL", undefined);
        await queryRunner.query("ALTER TABLE `session_archive` CHANGE `queue_id` `queue_id` int UNSIGNED NULL", undefined);
        await queryRunner.query("ALTER TABLE `session` ADD CONSTRAINT `FK_be1b2b01519269226ae6a7f4cd3` FOREIGN KEY (`queue_id`) REFERENCES `queue`(`id`) ON DELETE RESTRICT ON UPDATE NO ACTION", undefined);
        await queryRunner.query("ALTER TABLE `session_archive` ADD CONSTRAINT `FK_9e6c05c3a983b1f44512f045bac` FOREIGN KEY (`queue_id`) REFERENCES `queue`(`id`) ON DELETE RESTRICT ON UPDATE NO ACTION", undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `session_archive` DROP FOREIGN KEY `FK_9e6c05c3a983b1f44512f045bac`", undefined);
        await queryRunner.query("ALTER TABLE `session` DROP FOREIGN KEY `FK_be1b2b01519269226ae6a7f4cd3`", undefined);
        await queryRunner.query("ALTER TABLE `session_archive` CHANGE `queue_id` `queue_id` int(10) UNSIGNED NULL", undefined);
        await queryRunner.query("ALTER TABLE `session` CHANGE `queue_id` `queue_id` int(10) UNSIGNED NULL", undefined);
        await queryRunner.query("ALTER TABLE `queue` CHANGE `id` `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT", undefined);
        await queryRunner.query("ALTER TABLE `session_archive` ADD CONSTRAINT `FK_9e6c05c3a983b1f44512f045bac` FOREIGN KEY (`queue_id`) REFERENCES `queue`(`id`) ON DELETE RESTRICT ON UPDATE NO ACTION", undefined);
        await queryRunner.query("ALTER TABLE `session` ADD CONSTRAINT `FK_be1b2b01519269226ae6a7f4cd3` FOREIGN KEY (`queue_id`) REFERENCES `queue`(`id`) ON DELETE RESTRICT ON UPDATE NO ACTION", undefined);
        await queryRunner.query("ALTER TABLE `group` DROP COLUMN `stack_buy_limit`", undefined);
        await queryRunner.query("CREATE UNIQUE INDEX `IDX_1826f32b60a211f45219cc3f3f` ON `queue` (`machine_id`)", undefined);
    }

}
