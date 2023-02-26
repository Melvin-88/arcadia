import {MigrationInterface, QueryRunner} from "typeorm";

export class BoModulesChange1605558964437 implements MigrationInterface {
    name = 'BoModulesChange1605558964437'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `bo_module` DROP COLUMN `is_deleted`");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `bo_module` ADD `is_deleted` tinyint NOT NULL DEFAULT '0'");
    }

}
