import {MigrationInterface, QueryRunner} from "typeorm";

export class ReassignToField1611318216223 implements MigrationInterface {
    name = 'ReassignToField1611318216223'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `machine` ADD `reassign_to` bigint UNSIGNED NULL");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `machine` DROP COLUMN `reassign_to`");
    }

}
