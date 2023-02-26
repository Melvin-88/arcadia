import {MigrationInterface, QueryRunner} from "typeorm";

export class KPINullableThresholds1609325043575 implements MigrationInterface {
    name = 'KPINullableThresholds1609325043575'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `performance_indicator` CHANGE `alert_low_threshold` `alert_low_threshold` smallint UNSIGNED NULL");
        await queryRunner.query("ALTER TABLE `performance_indicator` CHANGE `alert_high_threshold` `alert_high_threshold` smallint UNSIGNED NULL");
        await queryRunner.query("ALTER TABLE `performance_indicator` CHANGE `cutoff_low_threshold` `cutoff_low_threshold` smallint UNSIGNED NULL");
        await queryRunner.query("ALTER TABLE `performance_indicator` CHANGE `cutoff_high_threshold` `cutoff_high_threshold` smallint UNSIGNED NULL");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `performance_indicator` CHANGE `cutoff_high_threshold` `cutoff_high_threshold` smallint UNSIGNED NOT NULL");
        await queryRunner.query("ALTER TABLE `performance_indicator` CHANGE `cutoff_low_threshold` `cutoff_low_threshold` smallint UNSIGNED NOT NULL");
        await queryRunner.query("ALTER TABLE `performance_indicator` CHANGE `alert_high_threshold` `alert_high_threshold` smallint UNSIGNED NOT NULL");
        await queryRunner.query("ALTER TABLE `performance_indicator` CHANGE `alert_low_threshold` `alert_low_threshold` smallint UNSIGNED NOT NULL");
    }

}
