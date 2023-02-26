import {MigrationInterface, QueryRunner} from "typeorm";

export class OnDelSetNullForVoucher1609153561339 implements MigrationInterface {
    name = 'OnDelSetNullForVoucher1609153561339'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `voucher` DROP FOREIGN KEY `FK_58ef51c3eee1e2d55bcc2723114`");
        await queryRunner.query("ALTER TABLE `voucher` ADD CONSTRAINT `FK_58ef51c3eee1e2d55bcc2723114` FOREIGN KEY (`session_id`) REFERENCES `session`(`id`) ON DELETE SET NULL ON UPDATE NO ACTION");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `voucher` DROP FOREIGN KEY `FK_58ef51c3eee1e2d55bcc2723114`");
        await queryRunner.query("ALTER TABLE `voucher` ADD CONSTRAINT `FK_58ef51c3eee1e2d55bcc2723114` FOREIGN KEY (`session_id`) REFERENCES `session`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
    }

}
