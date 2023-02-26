import {MigrationInterface, QueryRunner} from "typeorm";

export class DisputeRebateCurrencyNullable1596008880349 implements MigrationInterface {
    name = 'DisputeRebateCurrencyNullable1596008880349'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `dispute` CHANGE `rebate_currency` `rebate_currency` varchar(3) NULL", undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `dispute` CHANGE `rebate_currency` `rebate_currency` varchar(3) NOT NULL", undefined);
    }

}
