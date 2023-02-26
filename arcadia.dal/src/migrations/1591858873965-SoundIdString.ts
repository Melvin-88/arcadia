import {MigrationInterface, QueryRunner} from "typeorm";

export class SoundIdString1591858873965 implements MigrationInterface {
    name = 'SoundIdString1591858873965';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `chip_type` DROP COLUMN `sound_id`", undefined);
        await queryRunner.query("ALTER TABLE `chip_type` ADD `sound_id` varchar(200) NOT NULL", undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `chip_type` DROP COLUMN `sound_id`", undefined);
        await queryRunner.query("ALTER TABLE `chip_type` ADD `sound_id` int(5) UNSIGNED NOT NULL DEFAULT '0'", undefined);
    }

}
