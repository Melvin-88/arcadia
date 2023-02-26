import {MigrationInterface, QueryRunner} from "typeorm";

export class RoundVoucherId1604405825288 implements MigrationInterface {
    name = 'RoundVoucherId1604405825288'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `voucher` DROP FOREIGN KEY `FK_58ef51c3eee1e2d55bcc2723114`");
        await queryRunner.query("ALTER TABLE `round` ADD `voucher_id` int UNSIGNED NULL");
        await queryRunner.query("ALTER TABLE `round_archive` ADD `voucher_id` int UNSIGNED NULL");
        await queryRunner.query("ALTER TABLE `voucher` ADD CONSTRAINT `FK_58ef51c3eee1e2d55bcc2723114` FOREIGN KEY (`session_id`) REFERENCES `session`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `voucher` DROP FOREIGN KEY `FK_58ef51c3eee1e2d55bcc2723114`");
        await queryRunner.query("ALTER TABLE `round_archive` DROP COLUMN `voucher_id`");
        await queryRunner.query("ALTER TABLE `round` DROP COLUMN `voucher_id`");
        await queryRunner.query("ALTER TABLE `voucher` ADD CONSTRAINT `FK_58ef51c3eee1e2d55bcc2723114` FOREIGN KEY (`session_id`) REFERENCES `session`(`id`) ON DELETE SET NULL ON UPDATE NO ACTION");
    }

}
