import {MigrationInterface, QueryRunner} from "typeorm";

export class SessionCurrencyConvRate1597308644506 implements MigrationInterface {
    name = 'SessionCurrencyConvRate1597308644506'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `session` ADD `currency_conversion_rate` decimal(10,2) NOT NULL DEFAULT '0.00'");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `session` DROP COLUMN `currency_conversion_rate`");
    }

}
