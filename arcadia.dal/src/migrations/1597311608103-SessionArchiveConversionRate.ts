import {MigrationInterface, QueryRunner} from "typeorm";

export class SessionArchiveConversionRate1597311608103 implements MigrationInterface {
    name = 'SessionArchiveConversionRate1597311608103'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `session_archive` ADD `currency_conversion_rate` decimal(10,2) NOT NULL DEFAULT '0.00'");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `session_archive` DROP COLUMN `currency_conversion_rate`");
    }

}
