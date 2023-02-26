import {MigrationInterface, QueryRunner} from "typeorm";

export class SessionStreamAuthToken1600073659921 implements MigrationInterface {
    name = 'SessionStreamAuthToken1600073659921'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `session` ADD `stream_auth_token` varchar(64) NOT NULL", undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `session` DROP COLUMN `stream_auth_token`", undefined);
    }

}
