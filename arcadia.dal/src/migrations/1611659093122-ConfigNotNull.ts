import {MigrationInterface, QueryRunner} from "typeorm";

export class ConfigNotNull1611659093122 implements MigrationInterface {
    name = 'ConfigNotNull1611659093122'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `machine` CHANGE `configuration` `configuration` json NOT NULL");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `machine` CHANGE `configuration` `configuration` json NULL");
    }

}
