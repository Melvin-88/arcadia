import {MigrationInterface, QueryRunner} from "typeorm";

export class BuyDatePresicion1612169031562 implements MigrationInterface {
    name = 'BuyDatePresicion1612169031562'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `session` CHANGE `buy_date` `buy_date` datetime(6) NULL");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `session` CHANGE `buy_date` `buy_date` datetime(0) NULL");
    }

}
