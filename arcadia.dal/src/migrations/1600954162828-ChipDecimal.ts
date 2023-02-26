import {MigrationInterface, QueryRunner} from "typeorm";

export class ChipDecimal1600954162828 implements MigrationInterface {
    name = 'ChipDecimal1600954162828'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `chip` DROP COLUMN `value`");
        await queryRunner.query("ALTER TABLE `chip` ADD `value` decimal(6,2) NOT NULL DEFAULT '0.00'");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `chip` DROP COLUMN `value`");
        await queryRunner.query("ALTER TABLE `chip` ADD `value` int UNSIGNED NOT NULL DEFAULT '0'");
    }

}
