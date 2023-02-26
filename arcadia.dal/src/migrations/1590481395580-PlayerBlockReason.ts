import { MigrationInterface, QueryRunner } from 'typeorm';

export class PlayerBlockReason1590481395580 implements MigrationInterface {
    name = 'PlayerBlockReason1590481395580';

    public async up(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query('ALTER TABLE `player` ADD `block_reason` varchar(64) NULL', undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query('ALTER TABLE `player` DROP COLUMN `block_reason`', undefined);
    }
}
