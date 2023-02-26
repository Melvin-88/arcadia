import {MigrationInterface, QueryRunner} from "typeorm";

export class KpiMoreTables1594816374605 implements MigrationInterface {
    name = 'KpiMoreTables1594816374605'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("CREATE TABLE `performance_metric` (`name` varchar(128) NOT NULL, `description` varchar(256) NOT NULL, PRIMARY KEY (`name`)) ENGINE=InnoDB", undefined);
        await queryRunner.query("CREATE TABLE `performance_dimension` (`id` smallint(5) UNSIGNED NOT NULL AUTO_INCREMENT, `dimension_type` enum ('round', 'minute') NOT NULL, `value` smallint(5) UNSIGNED NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB", undefined);
        await queryRunner.query("ALTER TABLE `performance_indicator` ADD `metric_name` varchar(128) NOT NULL", undefined);
        await queryRunner.query("ALTER TABLE `performance_indicator` ADD `dimension_id` smallint(5) UNSIGNED NOT NULL", undefined);
        await queryRunner.query("ALTER TABLE `performance_indicator` ADD CONSTRAINT `FK_4cbaecfc516932e3cf927264597` FOREIGN KEY (`metric_name`) REFERENCES `performance_metric`(`name`) ON DELETE NO ACTION ON UPDATE NO ACTION", undefined);
        await queryRunner.query("ALTER TABLE `performance_indicator` ADD CONSTRAINT `FK_4856ac778d7ab2e23ec75558e62` FOREIGN KEY (`dimension_id`) REFERENCES `performance_dimension`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION", undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `performance_indicator` DROP FOREIGN KEY `FK_4856ac778d7ab2e23ec75558e62`", undefined);
        await queryRunner.query("ALTER TABLE `performance_indicator` DROP FOREIGN KEY `FK_4cbaecfc516932e3cf927264597`", undefined);
        await queryRunner.query("ALTER TABLE `performance_indicator` DROP COLUMN `dimension_id`", undefined);
        await queryRunner.query("ALTER TABLE `performance_indicator` DROP COLUMN `metric_name`", undefined);
        await queryRunner.query("DROP TABLE `performance_dimension`", undefined);
        await queryRunner.query("DROP TABLE `performance_metric`", undefined);
    }

}
