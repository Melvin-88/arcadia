import {MigrationInterface, QueryRunner} from "typeorm";

export class Chips1591367529214 implements MigrationInterface {
    name = 'Chips1591367529214';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("CREATE TABLE `machine_chip_level` (`id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, `capacity` int(5) UNSIGNED NOT NULL DEFAULT 0, `level` int(5) UNSIGNED NOT NULL DEFAULT 0, `type_id` int(10) UNSIGNED NULL, `machine_id` int(10) UNSIGNED NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB", undefined);
        await queryRunner.query("CREATE TABLE `chip_type` (`id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, `name` varchar(200) NOT NULL, `is_deleted` tinyint NOT NULL DEFAULT 0, PRIMARY KEY (`id`)) ENGINE=InnoDB", undefined);
        await queryRunner.query("CREATE TABLE `chip` (`rfid` varchar(255) NOT NULL, `value` int(5) UNSIGNED NOT NULL DEFAULT 0, `is_deleted` tinyint NOT NULL DEFAULT 0, `type_id` int(10) UNSIGNED NULL, `site_id` int(10) UNSIGNED NULL, `machine_id` int(10) UNSIGNED NULL, PRIMARY KEY (`rfid`)) ENGINE=InnoDB", undefined);
        await queryRunner.query("ALTER TABLE `machine_chip_level` ADD CONSTRAINT `FK_3c5fcd8d46e2b2ac344d04ec011` FOREIGN KEY (`type_id`) REFERENCES `chip_type`(`id`) ON DELETE SET NULL ON UPDATE NO ACTION", undefined);
        await queryRunner.query("ALTER TABLE `machine_chip_level` ADD CONSTRAINT `FK_e664865cf6c099e1fe6f211324d` FOREIGN KEY (`machine_id`) REFERENCES `machine`(`id`) ON DELETE SET NULL ON UPDATE NO ACTION", undefined);
        await queryRunner.query("ALTER TABLE `chip` ADD CONSTRAINT `FK_74466c0bd76c7640c3b9786c8bc` FOREIGN KEY (`type_id`) REFERENCES `chip_type`(`id`) ON DELETE SET NULL ON UPDATE NO ACTION", undefined);
        await queryRunner.query("ALTER TABLE `chip` ADD CONSTRAINT `FK_1ad10c26a889acec6e6858c0297` FOREIGN KEY (`site_id`) REFERENCES `site`(`id`) ON DELETE SET NULL ON UPDATE NO ACTION", undefined);
        await queryRunner.query("ALTER TABLE `chip` ADD CONSTRAINT `FK_867568ac460456f959a25f4c58c` FOREIGN KEY (`machine_id`) REFERENCES `machine`(`id`) ON DELETE SET NULL ON UPDATE NO ACTION", undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `chip` DROP FOREIGN KEY `FK_867568ac460456f959a25f4c58c`", undefined);
        await queryRunner.query("ALTER TABLE `chip` DROP FOREIGN KEY `FK_1ad10c26a889acec6e6858c0297`", undefined);
        await queryRunner.query("ALTER TABLE `chip` DROP FOREIGN KEY `FK_74466c0bd76c7640c3b9786c8bc`", undefined);
        await queryRunner.query("ALTER TABLE `machine_chip_level` DROP FOREIGN KEY `FK_e664865cf6c099e1fe6f211324d`", undefined);
        await queryRunner.query("ALTER TABLE `machine_chip_level` DROP FOREIGN KEY `FK_3c5fcd8d46e2b2ac344d04ec011`", undefined);
        await queryRunner.query("DROP TABLE `chip`", undefined);
        await queryRunner.query("DROP TABLE `chip_type`", undefined);
        await queryRunner.query("DROP TABLE `machine_chip_level`", undefined);
    }

}
