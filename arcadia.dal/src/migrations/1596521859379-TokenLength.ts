import {MigrationInterface, QueryRunner} from "typeorm";

export class TokenLength1596521859379 implements MigrationInterface {
    name = 'TokenLength1596521859379'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `jwt_token` DROP COLUMN `token`");
        await queryRunner.query("ALTER TABLE `jwt_token` ADD `token` varchar(1024) NOT NULL");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `jwt_token` DROP COLUMN `token`");
        await queryRunner.query("ALTER TABLE `jwt_token` ADD `token` varchar(512) NOT NULL");
    }

}
