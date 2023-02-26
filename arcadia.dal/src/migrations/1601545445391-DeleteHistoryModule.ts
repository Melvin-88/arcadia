import {MigrationInterface, QueryRunner} from "typeorm";

export class DeleteHistoryModule1601545445391 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("DELETE FROM bo_module WHERE tag='history'", undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("INSERT INTO bo_module(name, description, tag) values('history', 'access to history', 'history')");
    }
}
