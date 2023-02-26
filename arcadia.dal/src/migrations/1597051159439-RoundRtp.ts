import {MigrationInterface, QueryRunner} from "typeorm";

export class RoundRtp1597051159439 implements MigrationInterface {
    name = 'RoundRtp1597051159439'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `round` ADD `rtp` json NULL");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `round` DROP COLUMN `rtp`");
    }

}
