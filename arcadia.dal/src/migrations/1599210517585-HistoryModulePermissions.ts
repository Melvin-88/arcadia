import {MigrationInterface, QueryRunner} from "typeorm";

export class HistoryModulePermissions1599210517585 implements MigrationInterface {
    name = 'HistoryModulePermissions1599210517585'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
          "INSERT INTO bo_module(name, description, tag) values" +
          "('history', 'access to history', 'history')"
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("DELETE FROM bo_module WHERE name = 'history'");
    }

}
