import {MigrationInterface, QueryRunner} from "typeorm";

export class RemovePlayerNetCash1608626050316 implements MigrationInterface {
    name = 'RemovePlayerNetCash1608626050316'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `player` DROP COLUMN `net_cash`");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `player` ADD `net_cash` decimal UNSIGNED NOT NULL DEFAULT '0.00'");
    }

}
