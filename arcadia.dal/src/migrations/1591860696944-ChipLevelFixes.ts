import {MigrationInterface, QueryRunner} from "typeorm";

export class ChipLevelFixes1591860696944 implements MigrationInterface {
    name = 'ChipLevelFixes1591860696944'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `machine_chip_level` DROP FOREIGN KEY `FK_3c5fcd8d46e2b2ac344d04ec011`", undefined);
        await queryRunner.query("ALTER TABLE `machine_chip_level` DROP COLUMN `capacity`", undefined);
        await queryRunner.query("ALTER TABLE `machine_chip_level` DROP COLUMN `type_id`", undefined);
        await queryRunner.query("ALTER TABLE `machine_chip_level` ADD `dispenser_id` varchar(200) NOT NULL", undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `machine_chip_level` DROP COLUMN `dispenser_id`", undefined);
        await queryRunner.query("ALTER TABLE `machine_chip_level` ADD `type_id` int(10) UNSIGNED NULL", undefined);
        await queryRunner.query("ALTER TABLE `machine_chip_level` ADD `capacity` int(5) UNSIGNED NOT NULL DEFAULT '0'", undefined);
        await queryRunner.query("ALTER TABLE `machine_chip_level` ADD CONSTRAINT `FK_3c5fcd8d46e2b2ac344d04ec011` FOREIGN KEY (`type_id`) REFERENCES `chip_type`(`id`) ON DELETE SET NULL ON UPDATE NO ACTION", undefined);
    }

}
