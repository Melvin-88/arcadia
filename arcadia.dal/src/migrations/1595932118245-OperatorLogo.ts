import {MigrationInterface, QueryRunner} from "typeorm";

export class OperatorLogo1595932118245 implements MigrationInterface {
    name = 'OperatorLogo1595932118245'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `operator` ADD `logo_binary` mediumblob NULL", undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `operator` DROP COLUMN `logo_binary`", undefined);
    }

}
