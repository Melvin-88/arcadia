import {MigrationInterface, QueryRunner} from "typeorm";

export class SessionOfferedQueueId1593165306429 implements MigrationInterface {
    name = 'SessionOfferedQueueId1593165306429';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `session` ADD `offered_queue_id` int(10) UNSIGNED NULL", undefined);
        await queryRunner.query("ALTER TABLE `session_archive` ADD `offered_queue_id` int(10) UNSIGNED NULL", undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `session_archive` DROP COLUMN `offered_queue_id`", undefined);
        await queryRunner.query("ALTER TABLE `session` DROP COLUMN `offered_queue_id`", undefined);
    }

}
