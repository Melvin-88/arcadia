import {MigrationInterface, QueryRunner} from "typeorm";

export class ChangeReportFieldsType1603832872504 implements MigrationInterface {
    name = 'ChangeReportFieldsType1603832872504'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `activity_report` CHANGE `total_gross_gaming` `total_gross_gaming` decimal(16,2) NULL");
        await queryRunner.query("ALTER TABLE `activity_report` CHANGE `total_net_gaming` `total_net_gaming` decimal(16,2) NULL");
        await queryRunner.query("ALTER TABLE `player_stats_report` CHANGE `total_gross_gaming` `total_gross_gaming` decimal(16,2) NULL");
        await queryRunner.query("ALTER TABLE `player_stats_report` CHANGE `total_net_gaming` `total_net_gaming` decimal(16,2) NULL");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `player_stats_report` CHANGE `total_net_gaming` `total_net_gaming` decimal(16,2) UNSIGNED NULL");
        await queryRunner.query("ALTER TABLE `player_stats_report` CHANGE `total_gross_gaming` `total_gross_gaming` decimal(16,2) UNSIGNED NULL");
        await queryRunner.query("ALTER TABLE `activity_report` CHANGE `total_net_gaming` `total_net_gaming` decimal(16,2) UNSIGNED NULL");
        await queryRunner.query("ALTER TABLE `activity_report` CHANGE `total_gross_gaming` `total_gross_gaming` decimal(16,2) UNSIGNED NULL");
    }
}
