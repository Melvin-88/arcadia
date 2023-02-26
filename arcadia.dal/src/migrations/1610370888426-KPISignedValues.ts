import {MigrationInterface, QueryRunner} from "typeorm";

export class KPISignedValues1610370888426 implements MigrationInterface {
    name = 'KPISignedValues1610370888426'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `performance_tracker` CHANGE `value` `value` smallint NOT NULL");
        await queryRunner.query("ALTER TABLE `performance_indicator` CHANGE `target_value` `target_value` smallint NOT NULL");
        await queryRunner.query("ALTER TABLE `performance_indicator` CHANGE `alert_low_threshold` `alert_low_threshold` smallint NULL");
        await queryRunner.query("ALTER TABLE `performance_indicator` CHANGE `alert_high_threshold` `alert_high_threshold` smallint NULL");
        await queryRunner.query("ALTER TABLE `performance_indicator` CHANGE `cutoff_low_threshold` `cutoff_low_threshold` smallint NULL");
        await queryRunner.query("ALTER TABLE `performance_indicator` CHANGE `cutoff_high_threshold` `cutoff_high_threshold` smallint NULL");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `performance_indicator` CHANGE `cutoff_high_threshold` `cutoff_high_threshold` smallint UNSIGNED NULL");
        await queryRunner.query("ALTER TABLE `performance_indicator` CHANGE `cutoff_low_threshold` `cutoff_low_threshold` smallint UNSIGNED NULL");
        await queryRunner.query("ALTER TABLE `performance_indicator` CHANGE `alert_high_threshold` `alert_high_threshold` smallint UNSIGNED NULL");
        await queryRunner.query("ALTER TABLE `performance_indicator` CHANGE `alert_low_threshold` `alert_low_threshold` smallint UNSIGNED NULL");
        await queryRunner.query("ALTER TABLE `performance_indicator` CHANGE `target_value` `target_value` smallint UNSIGNED NOT NULL");
        await queryRunner.query("ALTER TABLE `performance_tracker` CHANGE `value` `value` smallint UNSIGNED NOT NULL");
    }

}
