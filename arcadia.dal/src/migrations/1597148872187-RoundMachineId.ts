import {MigrationInterface, QueryRunner} from "typeorm";

export class RoundMachineId1597148872187 implements MigrationInterface {
    name = 'RoundMachineId1597148872187'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `round` ADD `machine_id` bigint UNSIGNED NOT NULL");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `round` DROP COLUMN `machine_id`");
    }

}
