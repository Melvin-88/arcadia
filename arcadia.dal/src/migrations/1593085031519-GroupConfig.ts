import {MigrationInterface, QueryRunner} from "typeorm";

export class GroupConfig1593085031519 implements MigrationInterface {
    name = 'GroupConfig1593085031519'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `group` ADD `configuration` json NOT NULL", undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `group` DROP COLUMN `configuration`", undefined);
    }

}
