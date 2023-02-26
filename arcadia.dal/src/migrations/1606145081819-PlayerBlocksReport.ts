import {MigrationInterface, QueryRunner} from "typeorm";

export class PlayerBlocksReport1606145081819 implements MigrationInterface {
    name = 'PlayerBlocksReport1606145081819'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("CREATE TABLE `player_blocks_report` (`id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, `params` json NOT NULL, `params_hash` varchar(255) NULL, `grouping_key` enum ('operator', 'day', 'month', 'player', 'reason') NULL, `grouping_value` varchar(64) NULL, `date` varchar(16) NOT NULL, `total_blocked` int UNSIGNED NULL, `total_unblocked` int UNSIGNED NULL, `is_completed` tinyint NOT NULL, `create_date` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `update_date` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), PRIMARY KEY (`id`)) ENGINE=InnoDB");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("DROP TABLE `player_blocks_report`");
    }

}
