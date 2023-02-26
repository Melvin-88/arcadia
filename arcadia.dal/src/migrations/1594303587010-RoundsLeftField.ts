import {MigrationInterface, QueryRunner} from "typeorm";

export class RoundsLeftField1594303587010 implements MigrationInterface {
    name = 'RoundsLeftField1594303587010'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `session` ADD `rounds_left` tinyint(3) UNSIGNED NOT NULL DEFAULT 0", undefined);
        await queryRunner.query("ALTER TABLE `session_archive` ADD `rounds_left` tinyint(3) UNSIGNED NOT NULL DEFAULT 0", undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `session_archive` DROP COLUMN `rounds_left`", undefined);
        await queryRunner.query("ALTER TABLE `session` DROP COLUMN `rounds_left`", undefined);
    }

}
