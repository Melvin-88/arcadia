import {MigrationInterface, QueryRunner} from "typeorm";

export class KpiTrackerForeignKey1594973519164 implements MigrationInterface {
    name = 'KpiTrackerForeignKey1594973519164';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `performance_tracker` ADD `performance_indicator_id` smallint(5) UNSIGNED NULL", undefined);
        await queryRunner.query("ALTER TABLE `performance_tracker` ADD CONSTRAINT `FK_7eccfdabaad0e59cc41a9471cbc` FOREIGN KEY (`performance_indicator_id`) REFERENCES `performance_indicator`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION", undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `performance_tracker` DROP FOREIGN KEY `FK_7eccfdabaad0e59cc41a9471cbc`", undefined);
        await queryRunner.query("ALTER TABLE `performance_tracker` DROP COLUMN `performance_indicator_id`", undefined);
    }

}
