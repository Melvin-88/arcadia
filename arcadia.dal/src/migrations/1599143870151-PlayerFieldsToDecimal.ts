import {MigrationInterface, QueryRunner} from "typeorm";

export class PlayerFieldsToDecimal1599143870151 implements MigrationInterface {
    name = 'PlayerFieldsToDecimal1599143870151'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `player` DROP COLUMN `bets`");
        await queryRunner.query("ALTER TABLE `player` ADD `bets` decimal(10,2) UNSIGNED NOT NULL DEFAULT '0.00'");
        await queryRunner.query("ALTER TABLE `player` DROP COLUMN `wins`");
        await queryRunner.query("ALTER TABLE `player` ADD `wins` decimal(10,2) UNSIGNED NOT NULL DEFAULT '0.00'");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `player` DROP COLUMN `wins`");
        await queryRunner.query("ALTER TABLE `player` ADD `wins` int UNSIGNED NOT NULL");
        await queryRunner.query("ALTER TABLE `player` DROP COLUMN `bets`");
        await queryRunner.query("ALTER TABLE `player` ADD `bets` int UNSIGNED NOT NULL");
    }

}
