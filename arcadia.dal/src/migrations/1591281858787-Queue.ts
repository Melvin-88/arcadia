import {MigrationInterface, QueryRunner} from "typeorm";

export class Queue1591281858787 implements MigrationInterface {
    name = 'Queue1591281858787'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("CREATE TABLE `queue` (`id` int UNSIGNED NOT NULL AUTO_INCREMENT, `status` enum ('in-play', 'preparing', 'ready', 'drying', 'shutting-down', 'stopped') NOT NULL DEFAULT 'stopped', `status_update_date` datetime NULL, `create_date` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `update_date` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), PRIMARY KEY (`id`)) ENGINE=InnoDB", undefined);
        await queryRunner.query("ALTER TABLE `session` ADD `queue_id` int UNSIGNED NULL", undefined);
        await queryRunner.query("ALTER TABLE `machine` ADD `ping_date` datetime NULL", undefined);
        await queryRunner.query("ALTER TABLE `session` ADD CONSTRAINT `FK_be1b2b01519269226ae6a7f4cd3` FOREIGN KEY (`queue_id`) REFERENCES `queue`(`id`) ON DELETE RESTRICT ON UPDATE NO ACTION", undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `session` DROP FOREIGN KEY `FK_be1b2b01519269226ae6a7f4cd3`", undefined);
        await queryRunner.query("ALTER TABLE `machine` DROP COLUMN `ping_date`", undefined);
        await queryRunner.query("ALTER TABLE `session` DROP COLUMN `queue_id`", undefined);
        await queryRunner.query("DROP TABLE `queue`", undefined);
    }

}
