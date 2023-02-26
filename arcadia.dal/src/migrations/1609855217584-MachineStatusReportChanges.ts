import {MigrationInterface, QueryRunner} from "typeorm";

export class MachineStatusReportChanges1609855217584 implements MigrationInterface {
    name = 'MachineStatusReportChanges1609855217584'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `machine_status_report` DROP COLUMN `percent_available_time`");
        await queryRunner.query("ALTER TABLE `machine_status_report` DROP COLUMN `percent_in_play_time`");
        await queryRunner.query("ALTER TABLE `machine_status_report` DROP COLUMN `percent_error_time`");
        await queryRunner.query("ALTER TABLE `machine_status_report` DROP COLUMN `percent_offline_time`");
        await queryRunner.query("ALTER TABLE `machine_status_report` DROP COLUMN `percent_stopped_time`");
        await queryRunner.query("ALTER TABLE `machine_status_report` DROP COLUMN `percent_shitting_down_time`");
        await queryRunner.query("ALTER TABLE `machine_status_report` DROP COLUMN `percent_on_hold_time`");
        await queryRunner.query("ALTER TABLE `machine_status_report` DROP COLUMN `percent_preparing_time`");
        await queryRunner.query("ALTER TABLE `machine_status_report` DROP COLUMN `percent_ready_time`");
        await queryRunner.query("ALTER TABLE `machine_status_report` DROP COLUMN `percent_seeding_time`");
        await queryRunner.query("ALTER TABLE `machine_status_report` DROP COLUMN `total_machines`");
        await queryRunner.query("ALTER TABLE `machine_status_report` ADD `total_machines` int UNSIGNED NULL");
        await queryRunner.query("ALTER TABLE `machine_status_report` DROP COLUMN `total_available_time`");
        await queryRunner.query("ALTER TABLE `machine_status_report` ADD `total_available_time` int UNSIGNED NULL");
        await queryRunner.query("ALTER TABLE `machine_status_report` DROP COLUMN `total_in_play_time`");
        await queryRunner.query("ALTER TABLE `machine_status_report` ADD `total_in_play_time` int UNSIGNED NULL");
        await queryRunner.query("ALTER TABLE `machine_status_report` DROP COLUMN `total_error_time`");
        await queryRunner.query("ALTER TABLE `machine_status_report` ADD `total_error_time` int UNSIGNED NULL");
        await queryRunner.query("ALTER TABLE `machine_status_report` DROP COLUMN `total_offline_time`");
        await queryRunner.query("ALTER TABLE `machine_status_report` ADD `total_offline_time` int UNSIGNED NULL");
        await queryRunner.query("ALTER TABLE `machine_status_report` DROP COLUMN `total_stopped_time`");
        await queryRunner.query("ALTER TABLE `machine_status_report` ADD `total_stopped_time` int UNSIGNED NULL");
        await queryRunner.query("ALTER TABLE `machine_status_report` DROP COLUMN `total_shutting_down_time`");
        await queryRunner.query("ALTER TABLE `machine_status_report` ADD `total_shutting_down_time` int UNSIGNED NULL");
        await queryRunner.query("ALTER TABLE `machine_status_report` DROP COLUMN `total_on_hold_time`");
        await queryRunner.query("ALTER TABLE `machine_status_report` ADD `total_on_hold_time` int UNSIGNED NULL");
        await queryRunner.query("ALTER TABLE `machine_status_report` DROP COLUMN `total_preparing_time`");
        await queryRunner.query("ALTER TABLE `machine_status_report` ADD `total_preparing_time` int UNSIGNED NULL");
        await queryRunner.query("ALTER TABLE `machine_status_report` DROP COLUMN `total_ready_time`");
        await queryRunner.query("ALTER TABLE `machine_status_report` ADD `total_ready_time` int UNSIGNED NULL");
        await queryRunner.query("ALTER TABLE `machine_status_report` DROP COLUMN `total_seeding_time`");
        await queryRunner.query("ALTER TABLE `machine_status_report` ADD `total_seeding_time` int UNSIGNED NULL");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `machine_status_report` DROP COLUMN `total_seeding_time`");
        await queryRunner.query("ALTER TABLE `machine_status_report` ADD `total_seeding_time` decimal(16,2) NULL");
        await queryRunner.query("ALTER TABLE `machine_status_report` DROP COLUMN `total_ready_time`");
        await queryRunner.query("ALTER TABLE `machine_status_report` ADD `total_ready_time` decimal(16,2) NULL");
        await queryRunner.query("ALTER TABLE `machine_status_report` DROP COLUMN `total_preparing_time`");
        await queryRunner.query("ALTER TABLE `machine_status_report` ADD `total_preparing_time` decimal(16,2) NULL");
        await queryRunner.query("ALTER TABLE `machine_status_report` DROP COLUMN `total_on_hold_time`");
        await queryRunner.query("ALTER TABLE `machine_status_report` ADD `total_on_hold_time` decimal(16,2) NULL");
        await queryRunner.query("ALTER TABLE `machine_status_report` DROP COLUMN `total_shutting_down_time`");
        await queryRunner.query("ALTER TABLE `machine_status_report` ADD `total_shutting_down_time` decimal(16,2) NULL");
        await queryRunner.query("ALTER TABLE `machine_status_report` DROP COLUMN `total_stopped_time`");
        await queryRunner.query("ALTER TABLE `machine_status_report` ADD `total_stopped_time` decimal(16,2) NULL");
        await queryRunner.query("ALTER TABLE `machine_status_report` DROP COLUMN `total_offline_time`");
        await queryRunner.query("ALTER TABLE `machine_status_report` ADD `total_offline_time` decimal(16,2) NULL");
        await queryRunner.query("ALTER TABLE `machine_status_report` DROP COLUMN `total_error_time`");
        await queryRunner.query("ALTER TABLE `machine_status_report` ADD `total_error_time` decimal(16,2) NULL");
        await queryRunner.query("ALTER TABLE `machine_status_report` DROP COLUMN `total_in_play_time`");
        await queryRunner.query("ALTER TABLE `machine_status_report` ADD `total_in_play_time` decimal(16,2) NULL");
        await queryRunner.query("ALTER TABLE `machine_status_report` DROP COLUMN `total_available_time`");
        await queryRunner.query("ALTER TABLE `machine_status_report` ADD `total_available_time` decimal(16,2) NULL");
        await queryRunner.query("ALTER TABLE `machine_status_report` DROP COLUMN `total_machines`");
        await queryRunner.query("ALTER TABLE `machine_status_report` ADD `total_machines` bigint UNSIGNED NULL");
        await queryRunner.query("ALTER TABLE `machine_status_report` ADD `percent_seeding_time` decimal(16,2) NULL");
        await queryRunner.query("ALTER TABLE `machine_status_report` ADD `percent_ready_time` decimal(16,2) NULL");
        await queryRunner.query("ALTER TABLE `machine_status_report` ADD `percent_preparing_time` decimal(16,2) NULL");
        await queryRunner.query("ALTER TABLE `machine_status_report` ADD `percent_on_hold_time` decimal(16,2) NULL");
        await queryRunner.query("ALTER TABLE `machine_status_report` ADD `percent_shitting_down_time` decimal(16,2) NULL");
        await queryRunner.query("ALTER TABLE `machine_status_report` ADD `percent_stopped_time` decimal(16,2) NULL");
        await queryRunner.query("ALTER TABLE `machine_status_report` ADD `percent_offline_time` decimal(16,2) NULL");
        await queryRunner.query("ALTER TABLE `machine_status_report` ADD `percent_error_time` decimal(16,2) NULL");
        await queryRunner.query("ALTER TABLE `machine_status_report` ADD `percent_in_play_time` decimal(16,2) NULL");
        await queryRunner.query("ALTER TABLE `machine_status_report` ADD `percent_available_time` decimal(16,2) NULL");
    }
}
