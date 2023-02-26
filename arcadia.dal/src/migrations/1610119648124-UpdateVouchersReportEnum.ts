import {MigrationInterface, QueryRunner} from "typeorm";

export class UpdateVouchersReportEnum1610119648124 implements MigrationInterface {
    name = 'UpdateVouchersReportEnum1610119648124'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `vouchers_report` CHANGE `grouping_key` `grouping_key` enum ('operator', 'day', 'month', 'denomination', 'player', 'voucher') NULL");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `vouchers_report` CHANGE `grouping_key` `grouping_key` enum ('operator', 'machine', 'month', 'denomination', 'day', 'cid', 'voucher') NULL");
    }
}
