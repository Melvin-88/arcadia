import {MigrationInterface, QueryRunner} from "typeorm";

export class RoundAutoplayStatus1599823936906 implements MigrationInterface {
    name = 'RoundAutoplayStatus1599823936906'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `round` ADD `is_autoplay` tinyint NOT NULL DEFAULT 0");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `round` DROP COLUMN `is_autoplay`");
    }

}
