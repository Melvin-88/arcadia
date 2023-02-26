import {MigrationInterface, QueryRunner} from "typeorm";

export class ChipTypeUpdate1597918196556 implements MigrationInterface {
    name = 'ChipTypeUpdate1597918196556'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `chip_type` ADD `icon_id` varchar(128) NOT NULL");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `chip_type` DROP COLUMN `icon_id`");
    }

}
