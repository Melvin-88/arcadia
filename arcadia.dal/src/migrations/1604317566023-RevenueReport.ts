import {MigrationInterface, QueryRunner} from "typeorm";

export class RevenueReport1604317566023 implements MigrationInterface {
    name = 'RevenueReport1604317566023'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("CREATE TABLE `revenue_report` (`id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, `params` json NOT NULL, `params_hash` varchar(255) NULL, `grouping_key` enum ('operator', 'site', 'group', 'machine', 'month', 'denomination', 'day', 'currency') NULL, `grouping_value` varchar(64) NULL, `date` varchar(16) NOT NULL, `total_unique_players` decimal(16,2) UNSIGNED NULL, `total_new_players` decimal(16,2) UNSIGNED NULL, `total_bets` decimal(16,2) UNSIGNED NULL, `total_wins` decimal(16,2) UNSIGNED NULL, `total_voucher_bets` decimal(16,2) UNSIGNED NULL, `total_voucher_wins` decimal(16,2) UNSIGNED NULL, `total_refunds` decimal(16,2) UNSIGNED NULL, `total_gross_gaming` decimal(16,2) UNSIGNED NULL, `total_net_gaming` decimal(16,2) UNSIGNED NULL, `arpu` decimal(16,2) UNSIGNED NULL, `is_completed` tinyint NOT NULL, `create_date` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `update_date` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), PRIMARY KEY (`id`)) ENGINE=InnoDB");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("DROP TABLE `revenue_report`");
    }

}
