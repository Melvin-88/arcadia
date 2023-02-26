import {MigrationInterface, QueryRunner} from "typeorm";

export class RevenueReportUpdates1611231805670 implements MigrationInterface {
    name = 'RevenueReportUpdates1611231805670'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `revenue_report` DROP COLUMN `total_unique_players`");
        await queryRunner.query("ALTER TABLE `revenue_report` ADD `total_unique_players` int UNSIGNED NULL");
        await queryRunner.query("ALTER TABLE `revenue_report` DROP COLUMN `total_new_players`");
        await queryRunner.query("ALTER TABLE `revenue_report` ADD `total_new_players` int UNSIGNED NULL");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `revenue_report` DROP COLUMN `total_new_players`");
        await queryRunner.query("ALTER TABLE `revenue_report` ADD `total_new_players` decimal(16,2) UNSIGNED NULL");
        await queryRunner.query("ALTER TABLE `revenue_report` DROP COLUMN `total_unique_players`");
        await queryRunner.query("ALTER TABLE `revenue_report` ADD `total_unique_players` decimal(16,2) UNSIGNED NULL");
    }

}
