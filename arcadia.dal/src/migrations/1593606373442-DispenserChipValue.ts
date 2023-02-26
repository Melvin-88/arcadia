import {MigrationInterface, QueryRunner} from "typeorm";

export class DispenserChipValue1593606373442 implements MigrationInterface {
    name = 'DispenserChipValue1593606373442'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `machine_dispenser` ADD `chip_value` smallint(5) UNSIGNED NOT NULL DEFAULT 0", undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `machine_dispenser` DROP COLUMN `chip_value`", undefined);
    }

}
