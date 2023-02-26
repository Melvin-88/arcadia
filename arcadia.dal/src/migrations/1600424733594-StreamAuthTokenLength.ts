import {MigrationInterface, QueryRunner} from "typeorm";

export class StreamAuthTokenLength1600424733594 implements MigrationInterface {
    name = 'StreamAuthTokenLength1600424733594'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `session` DROP COLUMN `stream_auth_token`", undefined);
        await queryRunner.query("ALTER TABLE `session` ADD `stream_auth_token` varchar(256) NOT NULL", undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `session` DROP COLUMN `stream_auth_token`", undefined);
        await queryRunner.query("ALTER TABLE `session` ADD `stream_auth_token` varchar(64) NOT NULL", undefined);
    }

}
