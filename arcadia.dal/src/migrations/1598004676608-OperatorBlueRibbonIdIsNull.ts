import {MigrationInterface, QueryRunner} from "typeorm";

export class testmigr1598004676608 implements MigrationInterface {
    name = 'testmigr1598004676608'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `operator` CHANGE `blue_ribbon_id` `blue_ribbon_id` varchar(128) NULL");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `operator` CHANGE `blue_ribbon_id` `blue_ribbon_id` varchar(128) NOT NULL");
    }
}
