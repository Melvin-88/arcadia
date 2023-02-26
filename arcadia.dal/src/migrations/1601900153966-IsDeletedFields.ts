import {MigrationInterface, QueryRunner} from "typeorm";

export class IsDeletedFields1601900153966 implements MigrationInterface {
    name = 'IsDeletedFields1601900153966'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `machine_dispenser` ADD `is_deleted` tinyint NOT NULL DEFAULT 0");
        await queryRunner.query("ALTER TABLE `site` ADD `is_deleted` tinyint NOT NULL DEFAULT 0");
        await queryRunner.query("ALTER TABLE `player` ADD `is_deleted` tinyint NOT NULL DEFAULT 0");
        await queryRunner.query("ALTER TABLE `dispute` ADD `is_deleted` tinyint NOT NULL DEFAULT 0");
        await queryRunner.query("ALTER TABLE `queue` ADD `is_deleted` tinyint NOT NULL DEFAULT 0");
        await queryRunner.query("ALTER TABLE `bo_module` ADD `is_deleted` tinyint NOT NULL DEFAULT 0");
        await queryRunner.query("ALTER TABLE `alert` ADD `is_deleted` tinyint NOT NULL DEFAULT 0");
        await queryRunner.query("ALTER TABLE `currency_conversion` ADD `is_deleted` tinyint NOT NULL DEFAULT 0");
        await queryRunner.query("ALTER TABLE `alert_notification_service` ADD `is_deleted` tinyint NOT NULL DEFAULT 0");
        await queryRunner.query("ALTER TABLE `alert_notification_services` ADD `is_deleted` tinyint NOT NULL DEFAULT 0");
        await queryRunner.query("ALTER TABLE `alert_type` ADD `is_deleted` tinyint NOT NULL DEFAULT 0");
        await queryRunner.query("ALTER TABLE `alert_type_notification_service` ADD `is_deleted` tinyint NOT NULL DEFAULT 0");
        await queryRunner.query("ALTER TABLE `performance_metric` ADD `is_deleted` tinyint NOT NULL DEFAULT 0");
        await queryRunner.query("ALTER TABLE `performance_dimension` ADD `is_deleted` tinyint NOT NULL DEFAULT 0");
        await queryRunner.query("ALTER TABLE `performance_tracker` ADD `is_deleted` tinyint NOT NULL DEFAULT 0");
        await queryRunner.query("ALTER TABLE `logo` ADD `is_deleted` tinyint NOT NULL DEFAULT 0");
        await queryRunner.query("ALTER TABLE `jwt_token` ADD `is_deleted` tinyint NOT NULL DEFAULT 0");
        await queryRunner.query("ALTER TABLE `seed_history` ADD `is_deleted` tinyint NOT NULL DEFAULT 0");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `seed_history` DROP COLUMN `is_deleted`");
        await queryRunner.query("ALTER TABLE `jwt_token` DROP COLUMN `is_deleted`");
        await queryRunner.query("ALTER TABLE `logo` DROP COLUMN `is_deleted`");
        await queryRunner.query("ALTER TABLE `performance_tracker` DROP COLUMN `is_deleted`");
        await queryRunner.query("ALTER TABLE `performance_dimension` DROP COLUMN `is_deleted`");
        await queryRunner.query("ALTER TABLE `performance_metric` DROP COLUMN `is_deleted`");
        await queryRunner.query("ALTER TABLE `alert_type_notification_service` DROP COLUMN `is_deleted`");
        await queryRunner.query("ALTER TABLE `alert_type` DROP COLUMN `is_deleted`");
        await queryRunner.query("ALTER TABLE `alert_notification_services` DROP COLUMN `is_deleted`");
        await queryRunner.query("ALTER TABLE `alert_notification_service` DROP COLUMN `is_deleted`");
        await queryRunner.query("ALTER TABLE `currency_conversion` DROP COLUMN `is_deleted`");
        await queryRunner.query("ALTER TABLE `alert` DROP COLUMN `is_deleted`");
        await queryRunner.query("ALTER TABLE `bo_module` DROP COLUMN `is_deleted`");
        await queryRunner.query("ALTER TABLE `queue` DROP COLUMN `is_deleted`");
        await queryRunner.query("ALTER TABLE `dispute` DROP COLUMN `is_deleted`");
        await queryRunner.query("ALTER TABLE `player` DROP COLUMN `is_deleted`");
        await queryRunner.query("ALTER TABLE `site` DROP COLUMN `is_deleted`");
        await queryRunner.query("ALTER TABLE `machine_dispenser` DROP COLUMN `is_deleted`");
    }

}
