import {MigrationInterface, QueryRunner} from "typeorm";

export class DisputesOptionalColumns1613661249127 implements MigrationInterface {
    name = 'DisputesOptionalColumns1613661249127'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `dispute` CHANGE `rebate_sum` `rebate_sum` decimal(10,2) UNSIGNED NULL DEFAULT '0.00'");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `dispute` CHANGE `rebate_sum` `rebate_sum` decimal(10,2) UNSIGNED NOT NULL DEFAULT '0.00'");
    }

}
