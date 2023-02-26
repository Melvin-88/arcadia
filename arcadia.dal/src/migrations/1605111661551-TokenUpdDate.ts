import {MigrationInterface, QueryRunner} from "typeorm";

export class TokenUpdDate1605111661551 implements MigrationInterface {
    name = 'TokenUpdDate1605111661551'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `jwt_token` ADD `update_date` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `jwt_token` DROP COLUMN `update_date`");
    }

}
