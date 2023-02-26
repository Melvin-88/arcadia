import {MigrationInterface, QueryRunner} from "typeorm";

export class VoucherSession1591781725046 implements MigrationInterface {
    name = 'VoucherSession1591781725046';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `voucher` ADD `session_id` bigint(24) UNSIGNED NULL", undefined);
        await queryRunner.query("ALTER TABLE `voucher` ADD CONSTRAINT `FK_58ef51c3eee1e2d55bcc2723114` FOREIGN KEY (`session_id`) REFERENCES `session`(`id`) ON DELETE SET NULL ON UPDATE NO ACTION", undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `voucher` DROP FOREIGN KEY `FK_58ef51c3eee1e2d55bcc2723114`", undefined);
        await queryRunner.query("ALTER TABLE `voucher` DROP COLUMN `session_id`", undefined);
    }

}
