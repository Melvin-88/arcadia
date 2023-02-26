import {MigrationInterface, QueryRunner} from "typeorm";

export class ChipCreateUpdateDate1608736681452 implements MigrationInterface {
    name = 'ChipCreateUpdateDate1608736681452'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `chip` ADD `create_date` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)");
        await queryRunner.query("ALTER TABLE `chip` ADD `update_date` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `chip` DROP COLUMN `update_date`");
        await queryRunner.query("ALTER TABLE `chip` DROP COLUMN `create_date`");
    }

}
