import { MigrationInterface, QueryRunner } from 'typeorm';

export class GroupDenominatorRename1590058336368 implements MigrationInterface {
    name = 'GroupDenominatorRename1590058336368'

    public async up(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query('ALTER TABLE `group` CHANGE `denomination` `denominator` decimal(10,2) NOT NULL', undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query('ALTER TABLE `group` CHANGE `denominator` `denomination` decimal(10,2) NOT NULL', undefined);
    }
}
