import {MigrationInterface, QueryRunner} from "typeorm";

export class DispenserEntity1592989264947 implements MigrationInterface {
    name = 'DispenserEntity1592989264947'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("CREATE TABLE `machine_dispenser` (`id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, `name` varchar(100) NOT NULL, `level` smallint(5) UNSIGNED NOT NULL DEFAULT 0, `capacity` smallint(5) UNSIGNED NOT NULL DEFAULT 0, `machine_id` int(10) UNSIGNED NULL, `chip_type_id` int(10) UNSIGNED NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB", undefined);
        await queryRunner.query("ALTER TABLE `machine_dispenser` ADD CONSTRAINT `FK_7a417f63be7ff865882df5b19ae` FOREIGN KEY (`machine_id`) REFERENCES `machine`(`id`) ON DELETE SET NULL ON UPDATE NO ACTION", undefined);
        await queryRunner.query("ALTER TABLE `machine_dispenser` ADD CONSTRAINT `FK_bb83c1ca39a70894ae0a6083ad6` FOREIGN KEY (`chip_type_id`) REFERENCES `chip_type`(`id`) ON DELETE SET NULL ON UPDATE NO ACTION", undefined);
        await queryRunner.query("DROP TABLE `machine_chip_level`", undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `machine_dispenser` DROP FOREIGN KEY `FK_bb83c1ca39a70894ae0a6083ad6`", undefined);
        await queryRunner.query("ALTER TABLE `machine_dispenser` DROP FOREIGN KEY `FK_7a417f63be7ff865882df5b19ae`", undefined);
        await queryRunner.query("DROP TABLE `machine_dispenser`", undefined);
    }

}
