import {MigrationInterface, QueryRunner} from "typeorm";

export class OperatorConfig1595948059458 implements MigrationInterface {
    name = 'OperatorConfig1595948059458'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `operator` ADD `configuration` json NOT NULL");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `operator` DROP COLUMN `configuration`");
    }

}
