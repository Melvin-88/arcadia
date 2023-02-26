import {MigrationInterface, QueryRunner} from "typeorm";

export class RoundArchiveUpdate1599825723423 implements MigrationInterface {
    name = 'RoundArchiveUpdate1599825723423'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `round_archive` ADD `is_autoplay` tinyint NOT NULL DEFAULT 0");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `round_archive` DROP COLUMN `is_autoplay`");
    }

}
