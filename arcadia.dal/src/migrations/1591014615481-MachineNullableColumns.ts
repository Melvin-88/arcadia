import { MigrationInterface, QueryRunner } from 'typeorm';

export class MachineNullableColumns1591014615481 implements MigrationInterface {
    name = 'MachineNullableColumns1591014615481';

    public async up(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query('ALTER TABLE `machine` CHANGE `camera_id` `camera_id` varchar(32) NULL', undefined);
      await queryRunner.query('ALTER TABLE `machine` CHANGE `controller_ip` `controller_ip` varbinary(16) NULL', undefined);
      await queryRunner.query('ALTER TABLE `machine` ADD UNIQUE INDEX `IDX_c60541d21fe9d462cb49752d7d` (`name`)', undefined);
      await queryRunner.query('ALTER TABLE `machine` CHANGE `location` `location` varchar(32) NULL', undefined);
      await queryRunner.query('ALTER TABLE `machine` CHANGE `configuration` `configuration` json NULL', undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query('ALTER TABLE `machine` CHANGE `configuration` `configuration` json NOT NULL', undefined);
      await queryRunner.query('ALTER TABLE `machine` CHANGE `location` `location` varchar(32) NOT NULL', undefined);
      await queryRunner.query('ALTER TABLE `machine` DROP INDEX `IDX_c60541d21fe9d462cb49752d7d`', undefined);
      await queryRunner.query('ALTER TABLE `machine` CHANGE `controller_ip` `controller_ip` varbinary(16) NOT NULL', undefined);
      await queryRunner.query('ALTER TABLE `machine` CHANGE `camera_id` `camera_id` varchar(32) NOT NULL', undefined);
    }
}
