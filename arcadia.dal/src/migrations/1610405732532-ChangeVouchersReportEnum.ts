import {MigrationInterface, QueryRunner} from "typeorm";

export class ChangeVouchersReportEnum1610405732532 implements MigrationInterface {
    name = 'ChangeVouchersReportEnum1610405732532'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `vouchers_report` CHANGE `grouping_key` `grouping_key` enum ('operator', 'day', 'month', 'denomination', 'player') NULL");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `vouchers_report` CHANGE `grouping_key` `grouping_key` enum ('operator', 'day', 'month', 'denomination', 'player', 'voucher') NULL");
    }
}
