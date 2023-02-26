import {MigrationInterface, QueryRunner} from "typeorm";

export class PerformanceIndicatorSegmentRollback1600092548843 implements MigrationInterface {
    name = 'PerformanceIndicatorSegmentRollback1600092548843'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `performance_indicator` ADD `segment` enum ('machine', 'group', 'operator', 'all') NOT NULL DEFAULT 'machine'", undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `performance_indicator` DROP COLUMN `segment`", undefined);
    }

}
