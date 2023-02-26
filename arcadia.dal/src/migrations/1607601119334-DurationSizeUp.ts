import {MigrationInterface, QueryRunner} from "typeorm";

export class DurationSizeUp1607601119334 implements MigrationInterface {
    name = 'DurationSizeUp1607601119334'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `session` DROP COLUMN `duration`");
        await queryRunner.query("ALTER TABLE `session` ADD `duration` int UNSIGNED NOT NULL DEFAULT 0");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `session` DROP COLUMN `duration`");
        await queryRunner.query("ALTER TABLE `session` ADD `duration` smallint UNSIGNED NOT NULL DEFAULT '0'");
    }

}
