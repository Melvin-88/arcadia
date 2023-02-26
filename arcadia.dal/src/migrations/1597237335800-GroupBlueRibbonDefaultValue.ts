import {MigrationInterface, QueryRunner} from "typeorm";

export class GroupBlueRibbonDefaultValue1597237335800 implements MigrationInterface {
    name = 'GroupBlueRibbonDefaultValue1597237335800'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `group` CHANGE `blue_ribbon_game_id` `blue_ribbon_game_id` varchar(128) NOT NULL DEFAULT ''", undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `group` CHANGE `blue_ribbon_game_id` `blue_ribbon_game_id` varchar(128) NOT NULL", undefined);
    }

}
