import {MigrationInterface, QueryRunner} from "typeorm";

export class DispenserUpd1611914620108 implements MigrationInterface {
    name = 'DispenserUpd1611914620108'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `machine_dispenser` DROP COLUMN `chip_value`");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `machine_dispenser` ADD `chip_value` smallint UNSIGNED NOT NULL DEFAULT '0'");
    }

}
