import {MigrationInterface, QueryRunner} from "typeorm";

export class MachineStartedDate1593179688279 implements MigrationInterface {
    name = 'MachineStartedDate1593179688279';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `machine` ADD `started_date` datetime NULL", undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `machine` DROP COLUMN `started_date`", undefined);
    }

}
