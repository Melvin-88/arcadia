import {MigrationInterface, QueryRunner} from "typeorm";

export class ChipsStatus1596096112346 implements MigrationInterface {
    name = 'ChipsStatus1596096112346'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `chip` ADD `status` enum ('active', 'disqualified') NOT NULL", undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `chip` DROP COLUMN `status`", undefined);
    }

}
