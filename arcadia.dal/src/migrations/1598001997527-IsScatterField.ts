import {MigrationInterface, QueryRunner} from "typeorm";

export class IsScatterField1598001997527 implements MigrationInterface {
    name = 'IsScatterField1598001997527'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `chip` ADD `is_scatter` tinyint NOT NULL DEFAULT 0");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `chip` DROP COLUMN `is_scatter`");
    }

}
