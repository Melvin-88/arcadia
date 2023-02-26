import { MigrationInterface, QueryRunner } from 'typeorm';

export class GroupHasJackpotColumn1590757904465 implements MigrationInterface {
    name = 'GroupHasJackpotColumn1590757904465'

    public async up(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query('ALTER TABLE `group` ADD `has_jackpot` tinyint NOT NULL DEFAULT 0', undefined);
      await queryRunner.query('ALTER TABLE `machine` CHANGE `status` `status` enum (\'in-play\', \'preparing\', \'ready\', \'drying\', \'shutting-down\', \'stopped\', \'offline\', \'error\') NOT NULL DEFAULT \'offline\'', undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query('ALTER TABLE `machine` CHANGE `status` `status` enum (\'in-play\', \'preparing\', \'ready\', \'drying\', \'shutting-down\', \'stopped\') NOT NULL DEFAULT \'stopped\'', undefined);
      await queryRunner.query('ALTER TABLE `group` DROP COLUMN `has_jackpot`', undefined);
    }
}
