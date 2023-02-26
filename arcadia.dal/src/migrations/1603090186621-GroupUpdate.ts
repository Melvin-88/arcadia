import {MigrationInterface, QueryRunner} from "typeorm";

export class GroupUpdate1603090186621 implements MigrationInterface {
    name = 'GroupUpdate1603090186621'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `group` CHANGE `blue_ribbon_game_id` `blue_ribbon_game_id` varchar(128) NULL");
        await queryRunner.query("ALTER TABLE `group` CHANGE `stack_buy_limit` `stack_buy_limit` tinyint UNSIGNED NOT NULL DEFAULT 10");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `group` CHANGE `stack_buy_limit` `stack_buy_limit` tinyint UNSIGNED NULL DEFAULT '10'");
        await queryRunner.query("ALTER TABLE `group` CHANGE `blue_ribbon_game_id` `blue_ribbon_game_id` varchar(128) NOT NULL DEFAULT ''");
    }

}
