import {MigrationInterface, QueryRunner} from "typeorm";

export class RoundTransactionRemove1609257465347 implements MigrationInterface {
    name = 'RoundTransactionRemove1609257465347'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `round` DROP COLUMN `transaction_id`");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `round` ADD `transaction_id` varchar(64) NULL");
    }

}
