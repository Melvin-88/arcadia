import { MigrationInterface, QueryRunner } from 'typeorm';

export class SiteEntity1591099780625 implements MigrationInterface {
    name = 'SiteEntity1591099780625';

    public async up(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query('CREATE TABLE `site` (`id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, `name` varchar(200) NOT NULL, `create_date` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `update_date` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), UNIQUE INDEX `IDX_9669a09fcc0eb6d2794a658f64` (`name`), PRIMARY KEY (`id`)) ENGINE=InnoDB', undefined);
      await queryRunner.query('ALTER TABLE `machine` ADD `site_id` int(10) UNSIGNED NULL', undefined);
      await queryRunner.query('ALTER TABLE `machine` ADD CONSTRAINT `FK_6214707b3d06dbdff02413ba576` FOREIGN KEY (`site_id`) REFERENCES `site`(`id`) ON DELETE SET NULL ON UPDATE NO ACTION', undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query('ALTER TABLE `machine` DROP FOREIGN KEY `FK_6214707b3d06dbdff02413ba576`', undefined);
      await queryRunner.query('ALTER TABLE `machine` DROP COLUMN `site_id`', undefined);
      await queryRunner.query('DROP INDEX `IDX_9669a09fcc0eb6d2794a658f64` ON `site`', undefined);
      await queryRunner.query('DROP TABLE `site`', undefined);
    }
}
