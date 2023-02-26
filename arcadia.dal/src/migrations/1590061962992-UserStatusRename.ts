import { MigrationInterface, QueryRunner } from 'typeorm';

export class UserStatusRename1590061962992 implements MigrationInterface {
    name = 'UserStatusRename1590061962992'

    public async up(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query('ALTER TABLE `user` CHANGE `state` `status` enum (\'active\', \'disabled\') NOT NULL DEFAULT \'active\'', undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query('ALTER TABLE `user` CHANGE `status` `state` enum (\'active\', \'disabled\') NOT NULL DEFAULT \'active\'', undefined);
    }
}
