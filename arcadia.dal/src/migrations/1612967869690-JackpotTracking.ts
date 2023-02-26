import {MigrationInterface, QueryRunner} from "typeorm";

export class JackpotTracking1612967869690 implements MigrationInterface {
    name = 'JackpotTracking1612967869690'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `session_archive` ADD `jackpot_win` decimal(10,2) UNSIGNED NOT NULL DEFAULT '0.00'");
        await queryRunner.query("ALTER TABLE `round` ADD `jackpot_contribution` decimal(8,2) UNSIGNED NOT NULL DEFAULT '0.00'");
        await queryRunner.query("ALTER TABLE `session` ADD `jackpot_win` decimal(10,2) UNSIGNED NOT NULL DEFAULT '0.00'");
        await queryRunner.query("ALTER TABLE `round_archive` ADD `jackpot_contribution` decimal(8,2) UNSIGNED NOT NULL DEFAULT '0.00'");
        await queryRunner.query("ALTER TABLE `session_archive` CHANGE `currency_conversion_rate` `currency_conversion_rate` decimal(6,2) UNSIGNED NOT NULL DEFAULT '0.00'");
        await queryRunner.query("ALTER TABLE `session_archive` CHANGE `denominator` `denominator` decimal(6,2) UNSIGNED NOT NULL DEFAULT '0.00'");
        await queryRunner.query("ALTER TABLE `session` CHANGE `currency_conversion_rate` `currency_conversion_rate` decimal(6,2) UNSIGNED NOT NULL DEFAULT '0.00'");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `session` CHANGE `currency_conversion_rate` `currency_conversion_rate` decimal(10,2) NOT NULL DEFAULT '0.00'");
        await queryRunner.query("ALTER TABLE `session_archive` CHANGE `denominator` `denominator` decimal(10,2) NOT NULL");
        await queryRunner.query("ALTER TABLE `session_archive` CHANGE `currency_conversion_rate` `currency_conversion_rate` decimal(10,2) NOT NULL DEFAULT '0.00'");
        await queryRunner.query("ALTER TABLE `round_archive` DROP COLUMN `jackpot_contribution`");
        await queryRunner.query("ALTER TABLE `session` DROP COLUMN `jackpot_win`");
        await queryRunner.query("ALTER TABLE `round` DROP COLUMN `jackpot_contribution`");
        await queryRunner.query("ALTER TABLE `session_archive` DROP COLUMN `jackpot_win`");
    }

}
