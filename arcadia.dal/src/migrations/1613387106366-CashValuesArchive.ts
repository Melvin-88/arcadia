import {MigrationInterface, QueryRunner} from "typeorm";

export class CashValuesArchive1613387106366 implements MigrationInterface {
    name = 'CashValuesArchive1613387106366'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `session_archive` ADD `total_win_in_cash` decimal(10,2) UNSIGNED NOT NULL DEFAULT '0.00'");
        await queryRunner.query("ALTER TABLE `session_archive` ADD `total_bets_in_cash` decimal(10,2) UNSIGNED NOT NULL DEFAULT '0.00'");
        await queryRunner.query("ALTER TABLE `round_archive` ADD `win_in_cash` decimal(10,2) UNSIGNED NOT NULL DEFAULT '0.00'");
        await queryRunner.query("ALTER TABLE `round_archive` ADD `bet_in_cash` decimal(10,2) UNSIGNED NOT NULL DEFAULT '0.00'");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `round_archive` DROP COLUMN `bet_in_cash`");
        await queryRunner.query("ALTER TABLE `round_archive` DROP COLUMN `win_in_cash`");
        await queryRunner.query("ALTER TABLE `session_archive` DROP COLUMN `total_bets_in_cash`");
        await queryRunner.query("ALTER TABLE `session_archive` DROP COLUMN `total_win_in_cash`");
    }

}
