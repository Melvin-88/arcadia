import {MigrationInterface, QueryRunner} from "typeorm";

export class PrizesTabUpd1609415122224 implements MigrationInterface {
    name = 'PrizesTabUpd1609415122224'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `rng_chip_prizes` DROP FOREIGN KEY `FK_ffacdde6d2cf6ac86c15741fb16`");
        await queryRunner.query("ALTER TABLE `rng_chip_prizes` CHANGE `group_id` `group` int UNSIGNED NULL");
        await queryRunner.query("ALTER TABLE `group` ADD `prize_group` varchar(64) NOT NULL DEFAULT 'default'");
        await queryRunner.query("ALTER TABLE `rng_chip_prizes` DROP COLUMN `group`");
        await queryRunner.query("ALTER TABLE `rng_chip_prizes` ADD `group` varchar(64) NOT NULL DEFAULT 'default'");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `rng_chip_prizes` DROP COLUMN `group`");
        await queryRunner.query("ALTER TABLE `rng_chip_prizes` ADD `group` int UNSIGNED NULL");
        await queryRunner.query("ALTER TABLE `group` DROP COLUMN `prize_group`");
        await queryRunner.query("ALTER TABLE `rng_chip_prizes` CHANGE `group` `group_id` int UNSIGNED NULL");
        await queryRunner.query("ALTER TABLE `rng_chip_prizes` ADD CONSTRAINT `FK_ffacdde6d2cf6ac86c15741fb16` FOREIGN KEY (`group_id`) REFERENCES `group`(`id`) ON DELETE SET NULL ON UPDATE NO ACTION");
    }

}
