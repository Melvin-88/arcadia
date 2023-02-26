import {MigrationInterface, QueryRunner} from "typeorm";

export class EngageTimeout1595924999287 implements MigrationInterface {
    name = 'EngageTimeout1595924999287'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `group` ADD `engage_timeout` tinyint UNSIGNED NOT NULL DEFAULT 5");
        await queryRunner.query("ALTER TABLE `group` DROP COLUMN `idle_timeout`");
        await queryRunner.query("ALTER TABLE `group` ADD `idle_timeout` tinyint UNSIGNED NOT NULL DEFAULT 30");
        await queryRunner.query("ALTER TABLE `group` DROP COLUMN `grace_timeout`");
        await queryRunner.query("ALTER TABLE `group` ADD `grace_timeout` tinyint UNSIGNED NOT NULL DEFAULT 10");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `group` DROP COLUMN `grace_timeout`");
        await queryRunner.query("ALTER TABLE `group` ADD `grace_timeout` smallint NULL");
        await queryRunner.query("ALTER TABLE `group` DROP COLUMN `idle_timeout`");
        await queryRunner.query("ALTER TABLE `group` ADD `idle_timeout` smallint NULL");
        await queryRunner.query("ALTER TABLE `group` DROP COLUMN `engage_timeout`");
    }

}
