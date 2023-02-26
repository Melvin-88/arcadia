import {MigrationInterface, QueryRunner} from "typeorm";

export class VoucherExpiredStatus1608024739861 implements MigrationInterface {
    name = 'VoucherExpiredStatus1608024739861'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `voucher` CHANGE `status` `status` enum ('pending', 'used', 'revoked', 'expired') NOT NULL DEFAULT 'pending'");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `voucher` CHANGE `status` `status` enum ('pending', 'used', 'revoked') NOT NULL DEFAULT 'pending'");
    }

}
