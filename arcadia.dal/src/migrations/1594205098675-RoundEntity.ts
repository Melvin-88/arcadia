import {MigrationInterface, QueryRunner} from "typeorm";

export class RoundEntity1594205098675 implements MigrationInterface {
    name = 'RoundEntity1594205098675'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("CREATE TABLE `round` (`id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, `type` enum ('regular', 'betBehind', 'scatter', 'scatterBetBehind') NOT NULL DEFAULT 'regular', `status` enum ('active', 'paused', 'completed', 'terminated') NOT NULL DEFAULT 'active', `coins` tinyint(3) UNSIGNED NOT NULL DEFAULT 0, `wins` decimal(10,2) UNSIGNED NOT NULL DEFAULT '0.00', `bet` decimal(10,2) UNSIGNED NOT NULL DEFAULT '0.00', `create_date` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `is_deleted` tinyint NOT NULL DEFAULT 0, `session_id` bigint(24) UNSIGNED NULL, `foreign_session_id` bigint(24) UNSIGNED NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB", undefined);
        await queryRunner.query("ALTER TABLE `session` DROP COLUMN `rounds`", undefined);
        await queryRunner.query("ALTER TABLE `session_archive` DROP COLUMN `rounds`", undefined);
        await queryRunner.query("ALTER TABLE `round` ADD CONSTRAINT `FK_310b007d0c6ac4ce74ec57183d4` FOREIGN KEY (`session_id`) REFERENCES `session`(`id`) ON DELETE SET NULL ON UPDATE NO ACTION", undefined);
        await queryRunner.query("ALTER TABLE `round` ADD CONSTRAINT `FK_bb50ba7728d40dea99950af3b42` FOREIGN KEY (`foreign_session_id`) REFERENCES `session`(`id`) ON DELETE SET NULL ON UPDATE NO ACTION", undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `round` DROP FOREIGN KEY `FK_bb50ba7728d40dea99950af3b42`", undefined);
        await queryRunner.query("ALTER TABLE `round` DROP FOREIGN KEY `FK_310b007d0c6ac4ce74ec57183d4`", undefined);
        await queryRunner.query("ALTER TABLE `session_archive` ADD `rounds` int(10) UNSIGNED NOT NULL DEFAULT '0'", undefined);
        await queryRunner.query("ALTER TABLE `session` ADD `rounds` int(10) UNSIGNED NOT NULL DEFAULT '0'", undefined);
        await queryRunner.query("DROP TABLE `round`", undefined);
    }

}
