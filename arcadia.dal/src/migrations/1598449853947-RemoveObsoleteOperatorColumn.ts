import {MigrationInterface, QueryRunner} from "typeorm";

export class RemoveObsoleteOperatorColumn1598449853947 implements MigrationInterface {
    name = 'RemoveObsoleteOperatorColumn1598449853947'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `operator` DROP COLUMN `logo_binary`", undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `operator` ADD `logo_binary` mediumblob NULL", undefined);
    }

}
