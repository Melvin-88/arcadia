import {MigrationInterface, QueryRunner} from "typeorm";

export class SessionCoins1591349693630 implements MigrationInterface {
    name = 'SessionCoins1591349693630';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `session` ADD `coins` int(10) UNSIGNED NOT NULL DEFAULT 0", undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `session` DROP COLUMN `coins`", undefined);
    }

}
