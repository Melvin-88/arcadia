import {MigrationInterface, QueryRunner} from "typeorm";

export class PlayerName1613988373416 implements MigrationInterface {
    name = 'PlayerName1613988373416'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `player` ADD `name` varchar(128) NULL");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `player` DROP COLUMN `name`");
    }

}
