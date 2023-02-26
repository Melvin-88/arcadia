import {MigrationInterface, QueryRunner} from "typeorm";

export class PlayerStatsTotalAutoplay1611608898491 implements MigrationInterface {
    name = 'PlayerStatsTotalAutoplay1611608898491'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `player_stats_report` ADD `total_autoplay_sessions` int UNSIGNED NULL");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `player_stats_report` DROP COLUMN `total_autoplay_sessions`");
    }
}
