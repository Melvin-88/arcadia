import { MigrationInterface, QueryRunner } from 'typeorm';

export class ActionLogUserData1600761702589 implements MigrationInterface {
    name = 'ActionLogUserData1600761702589'

    public async up(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query('ALTER TABLE `action` ADD `user_name` varchar(256) NOT NULL', undefined);
      await queryRunner.query('ALTER TABLE `action` ADD `user_email` varchar(256) NOT NULL', undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query('ALTER TABLE `action` DROP COLUMN `user_email`', undefined);
      await queryRunner.query('ALTER TABLE `action` DROP COLUMN `user_name`', undefined);
    }
}
