import {MigrationInterface, QueryRunner} from "typeorm";

export class KPIAdditionalColumns1596709509144 implements MigrationInterface {
    name = 'KPIAdditionalColumns1596709509144'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `performance_dimension` ADD `name` varchar(100) NOT NULL", undefined);
        await queryRunner.query("ALTER TABLE `performance_indicator` ADD `mode` enum ('all', 'each') NOT NULL DEFAULT 'all'", undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `performance_indicator` DROP COLUMN `mode`", undefined);
        await queryRunner.query("ALTER TABLE `performance_dimension` DROP COLUMN `name`", undefined);
    }

}
