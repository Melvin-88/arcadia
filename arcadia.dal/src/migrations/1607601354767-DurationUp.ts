import {MigrationInterface, QueryRunner} from "typeorm";

export class DurationUp1607601354767 implements MigrationInterface {
    name = 'DurationUp1607601354767'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `session_archive` DROP COLUMN `duration`");
        await queryRunner.query("ALTER TABLE `session_archive` ADD `duration` int UNSIGNED NOT NULL DEFAULT 0");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `session_archive` DROP COLUMN `duration`");
        await queryRunner.query("ALTER TABLE `session_archive` ADD `duration` smallint UNSIGNED NOT NULL DEFAULT '0'");
    }

}
