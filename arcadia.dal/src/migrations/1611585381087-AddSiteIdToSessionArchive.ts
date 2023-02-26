import {MigrationInterface, QueryRunner} from "typeorm";

export class AddSiteIdToSessionArchive1611585381087 implements MigrationInterface {
    name = 'AddSiteIdToSessionArchive1611585381087'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `session_archive` ADD `site_id` bigint UNSIGNED NOT NULL");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `session_archive` DROP COLUMN `site_id`");
    }
}
