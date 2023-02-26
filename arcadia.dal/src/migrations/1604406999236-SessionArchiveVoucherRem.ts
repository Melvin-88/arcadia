import {MigrationInterface, QueryRunner} from "typeorm";

export class SessionArchiveVoucherRem1604406999236 implements MigrationInterface {
    name = 'SessionArchiveVoucherRem1604406999236'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `session_archive` DROP COLUMN `voucher_id`");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `session_archive` ADD `voucher_id` bigint UNSIGNED NULL");
    }

}
