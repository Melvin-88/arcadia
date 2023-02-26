import {MigrationInterface, QueryRunner} from "typeorm";

export class MachineLastLoginDate1606916214636 implements MigrationInterface {
    name = 'MachineLastLoginDate1606916214636'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `machine` ADD `last_login_date` datetime NULL");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `machine` DROP COLUMN `last_login_date`");
    }

}
