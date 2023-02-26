import {MigrationInterface, QueryRunner} from "typeorm";

export class ChipTypeSoundId1591800979090 implements MigrationInterface {
    name = 'ChipTypeSoundId1591800979090';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `chip_type` ADD `sound_id` int(5) UNSIGNED NOT NULL DEFAULT 0", undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `chip_type` DROP COLUMN `sound_id`", undefined);
    }

}
