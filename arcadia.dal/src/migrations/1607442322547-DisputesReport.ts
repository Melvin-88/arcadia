import {MigrationInterface, QueryRunner} from "typeorm";

export class DisputesReport1607442322547 implements MigrationInterface {
    name = 'DisputesReport1607442322547'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("CREATE TABLE `disputes_report` (`id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, `params` json NOT NULL, `params_hash` varchar(255) NULL, `grouping_key` enum ('operator', 'cid', 'reason', 'status', 'month', 'day') NULL, `grouping_value` varchar(64) NULL, `date` varchar(16) NOT NULL, `total_dispute_count` bigint UNSIGNED NULL, `is_completed` tinyint NOT NULL, `create_date` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `update_date` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), PRIMARY KEY (`id`)) ENGINE=InnoDB");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("DROP TABLE `disputes_report`");
    }

}
