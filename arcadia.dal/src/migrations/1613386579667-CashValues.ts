import {MigrationInterface, QueryRunner} from "typeorm";

export class CashValues1613386579667 implements MigrationInterface {
    name = 'CashValues1613386579667'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `round` ADD `win_in_cash` decimal(10,2) UNSIGNED NOT NULL DEFAULT '0.00'");
        await queryRunner.query("ALTER TABLE `round` ADD `bet_in_cash` decimal(10,2) UNSIGNED NOT NULL DEFAULT '0.00'");
        await queryRunner.query("ALTER TABLE `session` ADD `total_bets_in_cash` decimal(10,2) UNSIGNED NOT NULL DEFAULT '0.00'");
        await queryRunner.query("ALTER TABLE `session` ADD `total_win_in_cash` decimal(10,2) UNSIGNED NOT NULL DEFAULT '0.00'");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `session` DROP COLUMN `total_win_in_cash`");
        await queryRunner.query("ALTER TABLE `session` DROP COLUMN `total_bets_in_cash`");
        await queryRunner.query("ALTER TABLE `round` DROP COLUMN `bet_in_cash`");
        await queryRunner.query("ALTER TABLE `round` DROP COLUMN `win_in_cash`");
    }

}
