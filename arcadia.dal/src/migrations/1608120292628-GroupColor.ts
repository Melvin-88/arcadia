import {MigrationInterface, QueryRunner} from "typeorm";

export class GroupColor1608120292628 implements MigrationInterface {
    name = 'GroupColor1608120292628'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `group` ADD `color` varchar(64) NOT NULL");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `group` DROP COLUMN `color`");
    }

}
