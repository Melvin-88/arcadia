import {MigrationInterface, QueryRunner} from "typeorm";

export class KPICreateUpdateDateColumns1595575933839 implements MigrationInterface {
    name = 'KPICreateUpdateDateColumns1595575933839'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `performance_metric` ADD `create_date` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)", undefined);
        await queryRunner.query("ALTER TABLE `performance_metric` ADD `update_date` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)", undefined);
        await queryRunner.query("ALTER TABLE `performance_dimension` ADD `create_date` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)", undefined);
        await queryRunner.query("ALTER TABLE `performance_dimension` ADD `update_date` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)", undefined);
        await queryRunner.query("ALTER TABLE `performance_indicator` ADD `create_date` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)", undefined);
        await queryRunner.query("ALTER TABLE `performance_indicator` ADD `update_date` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)", undefined);
        await queryRunner.query("ALTER TABLE `performance_tracker` ADD `create_date` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)", undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `performance_tracker` DROP COLUMN `create_date`", undefined);
        await queryRunner.query("ALTER TABLE `performance_indicator` DROP COLUMN `update_date`", undefined);
        await queryRunner.query("ALTER TABLE `performance_indicator` DROP COLUMN `create_date`", undefined);
        await queryRunner.query("ALTER TABLE `performance_dimension` DROP COLUMN `update_date`", undefined);
        await queryRunner.query("ALTER TABLE `performance_dimension` DROP COLUMN `create_date`", undefined);
        await queryRunner.query("ALTER TABLE `performance_metric` DROP COLUMN `update_date`", undefined);
        await queryRunner.query("ALTER TABLE `performance_metric` DROP COLUMN `create_date`", undefined);
    }

}
