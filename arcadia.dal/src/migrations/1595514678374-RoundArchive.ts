import {MigrationInterface, QueryRunner} from "typeorm";

export class RoundArchive1595514678374 implements MigrationInterface {
    name = 'RoundArchive1595514678374'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("CREATE TABLE `round_archive` (`id` bigint UNSIGNED NOT NULL, `session_id` bigint UNSIGNED NOT NULL, `type` enum ('regular', 'betBehind', 'scatter', 'scatterBetBehind') NOT NULL, `status` enum ('active', 'paused', 'completed', 'terminated') NOT NULL, `coins` tinyint UNSIGNED NOT NULL DEFAULT 0, `wins` decimal(10,2) UNSIGNED NOT NULL DEFAULT '0.00', `bet` decimal(10,2) UNSIGNED NOT NULL DEFAULT '0.00', `start_date` datetime NOT NULL, `end_date` datetime NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("ALTER TABLE `round` ADD `end_date` datetime NULL");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `round` DROP COLUMN `end_date`");
        await queryRunner.query("DROP TABLE `round_archive`");
    }

}
