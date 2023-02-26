import {MigrationInterface, QueryRunner} from "typeorm";

export class VouchersReportChanges1609852469501 implements MigrationInterface {
    name = 'VouchersReportChanges1609852469501'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `vouchers_report` DROP COLUMN `total_vouchers_cancelled`");
        await queryRunner.query("ALTER TABLE `vouchers_report` ADD `total_vouchers_canceled` int UNSIGNED NULL");
        await queryRunner.query("ALTER TABLE `vouchers_report` DROP COLUMN `total_vouchers_issued`");
        await queryRunner.query("ALTER TABLE `vouchers_report` ADD `total_vouchers_issued` int UNSIGNED NULL");
        await queryRunner.query("ALTER TABLE `vouchers_report` DROP COLUMN `total_vouchers_used`");
        await queryRunner.query("ALTER TABLE `vouchers_report` ADD `total_vouchers_used` int UNSIGNED NULL");
        await queryRunner.query("ALTER TABLE `vouchers_report` DROP COLUMN `total_vouchers_expired`");
        await queryRunner.query("ALTER TABLE `vouchers_report` ADD `total_vouchers_expired` int UNSIGNED NULL");
        await queryRunner.query("ALTER TABLE `vouchers_report` DROP COLUMN `total_rounds_played`");
        await queryRunner.query("ALTER TABLE `vouchers_report` ADD `total_rounds_played` int UNSIGNED NULL");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `vouchers_report` DROP COLUMN `total_rounds_played`");
        await queryRunner.query("ALTER TABLE `vouchers_report` ADD `total_rounds_played` decimal(16,2) UNSIGNED NULL");
        await queryRunner.query("ALTER TABLE `vouchers_report` DROP COLUMN `total_vouchers_expired`");
        await queryRunner.query("ALTER TABLE `vouchers_report` ADD `total_vouchers_expired` decimal(16,2) UNSIGNED NULL");
        await queryRunner.query("ALTER TABLE `vouchers_report` DROP COLUMN `total_vouchers_used`");
        await queryRunner.query("ALTER TABLE `vouchers_report` ADD `total_vouchers_used` decimal(16,2) UNSIGNED NULL");
        await queryRunner.query("ALTER TABLE `vouchers_report` DROP COLUMN `total_vouchers_issued`");
        await queryRunner.query("ALTER TABLE `vouchers_report` ADD `total_vouchers_issued` decimal(16,2) UNSIGNED NULL");
        await queryRunner.query("ALTER TABLE `vouchers_report` DROP COLUMN `total_vouchers_canceled`");
        await queryRunner.query("ALTER TABLE `vouchers_report` ADD `total_vouchers_cancelled` decimal(16,2) UNSIGNED NULL");
    }
}
