import {MigrationInterface, QueryRunner} from "typeorm";

export class SessionIsQueueChangeOffered1593159757759 implements MigrationInterface {
    name = 'SessionIsQueueChangeOffered1593159757759';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `session` ADD `is_queue_change_offered` tinyint NOT NULL DEFAULT 0", undefined);
        await queryRunner.query("ALTER TABLE `session_archive` ADD `is_queue_change_offered` tinyint NOT NULL DEFAULT 0", undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `session_archive` DROP COLUMN `is_queue_change_offered`", undefined);
        await queryRunner.query("ALTER TABLE `session` DROP COLUMN `is_queue_change_offered`", undefined);
    }

}
