import {MigrationInterface, QueryRunner} from "typeorm";

export class SessionArchiveDenominator1604418205826 implements MigrationInterface {
    name = 'SessionArchiveDenominator1604418205826'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `session_archive` ADD `denominator` decimal(10,2) NOT NULL");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `session_archive` DROP COLUMN `denominator`");
    }
}
