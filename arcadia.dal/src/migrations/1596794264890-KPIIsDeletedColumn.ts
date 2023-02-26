import {MigrationInterface, QueryRunner} from "typeorm";

export class KPIIsDeletedColumn1596794264890 implements MigrationInterface {
    name = 'KPIIsDeletedColumn1596794264890'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `performance_indicator` ADD `is_deleted` tinyint NOT NULL DEFAULT 0", undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `performance_indicator` DROP COLUMN `is_deleted`", undefined);
    }

}
