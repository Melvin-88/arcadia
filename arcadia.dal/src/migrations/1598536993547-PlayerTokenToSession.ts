import {MigrationInterface, QueryRunner} from "typeorm";

export class PlayerTokenToSession1598536993547 implements MigrationInterface {
    name = 'PlayerTokenToSession1598536993547'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `session` ADD `access_token` varchar(64) NOT NULL");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `session` DROP COLUMN `access_token`");
    }

}
