import {MigrationInterface, QueryRunner} from "typeorm";

export class SessionArchiveChangeDenomination1613515311089 implements MigrationInterface {
    name = 'SessionArchiveChangeDenomination1613515311089'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `session_archive` ADD `is_denomination_changed` tinyint NOT NULL DEFAULT 0");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `session_archive` DROP COLUMN `is_denomination_changed`");
    }
}
