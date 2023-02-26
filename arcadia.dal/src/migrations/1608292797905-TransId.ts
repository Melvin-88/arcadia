import {MigrationInterface, QueryRunner} from "typeorm";

export class TransId1608292797905 implements MigrationInterface {
    name = 'TransId1608292797905'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `round` ADD `transaction_id` varchar(64) NULL");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `round` DROP COLUMN `transaction_id`");
    }

}
