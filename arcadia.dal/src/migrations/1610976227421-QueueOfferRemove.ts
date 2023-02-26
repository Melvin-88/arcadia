import {MigrationInterface, QueryRunner} from "typeorm";

export class QueueOfferRemove1610976227421 implements MigrationInterface {
    name = 'QueueOfferRemove1610976227421'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `session` DROP COLUMN `is_queue_change_offered`");
        await queryRunner.query("ALTER TABLE `session_archive` DROP COLUMN `is_queue_change_offered`");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `session_archive` ADD `is_queue_change_offered` tinyint NOT NULL DEFAULT '0'");
        await queryRunner.query("ALTER TABLE `session` ADD `is_queue_change_offered` tinyint NOT NULL DEFAULT '0'");
    }

}
