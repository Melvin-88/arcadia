import {MigrationInterface, QueryRunner} from "typeorm";

export class SessionCoinRemove1594796155786 implements MigrationInterface {
    name = 'SessionCoinRemove1594796155786'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `session` DROP COLUMN `coins`", undefined);
        await queryRunner.query("ALTER TABLE `session_archive` DROP COLUMN `coins`", undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `session_archive` ADD `coins` int(10) UNSIGNED NOT NULL DEFAULT '0'", undefined);
        await queryRunner.query("ALTER TABLE `session` ADD `coins` int(10) UNSIGNED NOT NULL DEFAULT '0'", undefined);
    }

}
