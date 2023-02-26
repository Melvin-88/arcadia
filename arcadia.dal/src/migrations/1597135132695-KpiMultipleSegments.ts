import {MigrationInterface, QueryRunner} from "typeorm";

export class KpiMultipleSegments1597135132695 implements MigrationInterface {
    name = 'KpiMultipleSegments1597135132695'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("CREATE TABLE `performance_indicator_to_segment` (`id` smallint UNSIGNED NOT NULL AUTO_INCREMENT, `segment` enum ('machine', 'group', 'operator', 'all') NOT NULL DEFAULT 'machine', `indicator_id` smallint UNSIGNED NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB", undefined);
        await queryRunner.query("ALTER TABLE `performance_indicator` DROP COLUMN `segment`", undefined);
        await queryRunner.query("ALTER TABLE `performance_indicator_to_segment` ADD CONSTRAINT `FK_b56ab70f06163cb4809df647834` FOREIGN KEY (`indicator_id`) REFERENCES `performance_indicator`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION", undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `performance_indicator_to_segment` DROP FOREIGN KEY `FK_b56ab70f06163cb4809df647834`", undefined);
        await queryRunner.query("ALTER TABLE `performance_indicator` ADD `segment` enum ('machine', 'group', 'operator', 'all') NOT NULL DEFAULT 'machine'", undefined);
        await queryRunner.query("DROP TABLE `performance_indicator_to_segment`", undefined);
    }

}
