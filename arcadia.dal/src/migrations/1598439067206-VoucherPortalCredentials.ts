import {MigrationInterface, QueryRunner} from "typeorm";

export class VoucherPortalCredentials1598439067206 implements MigrationInterface {
    name = 'VoucherPortalCredentials1598439067206'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `operator` ADD `voucher_portal_username` varchar(128) NOT NULL", undefined);
        await queryRunner.query("ALTER TABLE `operator` ADD `voucher_portal_password` varchar(250) NOT NULL", undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `operator` DROP COLUMN `voucher_portal_password`", undefined);
        await queryRunner.query("ALTER TABLE `operator` DROP COLUMN `voucher_portal_username`", undefined);
    }

}
