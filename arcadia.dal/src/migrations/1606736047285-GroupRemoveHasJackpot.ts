import {MigrationInterface, QueryRunner} from "typeorm";

export class GroupRemoveHasJackpot1606736047285 implements MigrationInterface {
    name = 'GroupRemoveHasJackpot1606736047285'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `group` DROP COLUMN `has_jackpot`");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `group` ADD `has_jackpot` tinyint NOT NULL DEFAULT '0'");
    }

}
