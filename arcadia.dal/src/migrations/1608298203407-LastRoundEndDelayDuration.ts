import {MigrationInterface, QueryRunner} from "typeorm";

export class LastRoundEndDelayDuration1608298203407 implements MigrationInterface {
    name = 'LastRoundEndDelayDuration1608298203407'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `round` ADD `end_delay_up_to` datetime NULL");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `round` DROP COLUMN `end_delay_up_to`");
    }
}
