import {MigrationInterface, QueryRunner} from "typeorm";

export class BlueRibbonColumns1595419755096 implements MigrationInterface {
    name = 'BlueRibbonColumns1595419755096';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `operator` ADD `blue_ribbon_id` varchar(128) NOT NULL", undefined);
        await queryRunner.query("ALTER TABLE `group` ADD `blue_ribbon_game_id` varchar(128) NOT NULL", undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `group` DROP COLUMN `blue_ribbon_game_id`", undefined);
        await queryRunner.query("ALTER TABLE `operator` DROP COLUMN `blue_ribbon_id`", undefined);
    }

}
