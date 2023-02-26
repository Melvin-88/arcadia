import {MigrationInterface, QueryRunner} from "typeorm";

export class RemoveArpu1613340601858 implements MigrationInterface {
    name = 'RemoveArpu1613340601858'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `revenue_report` DROP COLUMN `arpu`");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `revenue_report` ADD `arpu` decimal(16,2) NULL");
    }
}
