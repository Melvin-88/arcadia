import {MigrationInterface, QueryRunner} from "typeorm";

export class SessionArchiveTabDrop1595418537398 implements MigrationInterface {
    name = 'SessionArchiveTabDrop1595418537398'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("DROP TABLE `session_archive`", undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {

    }

}
