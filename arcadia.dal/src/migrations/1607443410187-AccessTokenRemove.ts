import {MigrationInterface, QueryRunner} from "typeorm";

export class AccessTokenRemove1607443410187 implements MigrationInterface {
    name = 'AccessTokenRemove1607443410187'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `session` DROP COLUMN `access_token`");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `session` ADD `access_token` varchar(64) NOT NULL");
    }

}
