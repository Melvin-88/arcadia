import {MigrationInterface, QueryRunner} from "typeorm";

export class VouchersReport1605275552606 implements MigrationInterface {
    name = 'VouchersReport1605275552606'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("CREATE TABLE `vouchers_report` (`id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, `params` json NOT NULL, `params_hash` varchar(255) NULL, `grouping_key` enum ('operator', 'machine', 'month', 'denomination', 'day', 'cid', 'voucher') NULL, `grouping_value` varchar(64) NULL, `date` varchar(16) NOT NULL, `total_vouchers_issued` decimal(16,2) UNSIGNED NULL, `total_vouchers_used` decimal(16,2) UNSIGNED NULL, `total_vouchers_bets` decimal(16,2) UNSIGNED NULL, `total_vouchers_wins` decimal(16,2) UNSIGNED NULL, `total_vouchers_expired` decimal(16,2) UNSIGNED NULL, `total_vouchers_cancelled` decimal(16,2) UNSIGNED NULL, `total_rounds_played` decimal(16,2) UNSIGNED NULL, `is_completed` tinyint NOT NULL, `create_date` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `update_date` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), PRIMARY KEY (`id`)) ENGINE=InnoDB");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("DROP TABLE `vouchers_report`");
    }

}
