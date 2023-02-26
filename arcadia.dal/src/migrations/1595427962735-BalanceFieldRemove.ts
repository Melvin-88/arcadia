import {MigrationInterface, QueryRunner} from "typeorm";

export class BalanceFieldRemove1595427962735 implements MigrationInterface {
    name = 'BalanceFieldRemove1595427962735'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `session_archive` DROP COLUMN `balance`");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `session_archive` ADD `balance` decimal(10,2) UNSIGNED NOT NULL");
    }

}
