import {MigrationInterface, QueryRunner} from "typeorm";

export class RoundArchiveMachineId1597071220187 implements MigrationInterface {
    name = 'RoundArchiveMachineId1597071220187'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `round_archive` ADD `machine_id` bigint UNSIGNED NOT NULL");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `round_archive` DROP COLUMN `machine_id`");
    }

}
