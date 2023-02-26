import {MigrationInterface, QueryRunner} from "typeorm";

export class NetCashNegative1592832742143 implements MigrationInterface {
    name = 'NetCashNegative1592832742143'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `session` CHANGE `total_net_cash` `total_net_cash` decimal(10,2) NOT NULL DEFAULT '0.00'", undefined);
        await queryRunner.query("ALTER TABLE `session_archive` CHANGE `total_net_cash` `total_net_cash` decimal(10,2) NOT NULL DEFAULT '0.00'", undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `session_archive` CHANGE `total_net_cash` `total_net_cash` decimal(10,2) UNSIGNED NOT NULL DEFAULT '0.00'", undefined);
        await queryRunner.query("ALTER TABLE `session` CHANGE `total_net_cash` `total_net_cash` decimal(10,2) UNSIGNED NOT NULL DEFAULT '0.00'", undefined);
    }

}
