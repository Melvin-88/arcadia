import {MigrationInterface, QueryRunner} from "typeorm";

export class RetentionReport1606397260248 implements MigrationInterface {
    name = 'RetentionReport1606397260248'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("CREATE TABLE `retention_report` (`id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, `params` json NOT NULL, `params_hash` varchar(255) NULL, `grouping_key` enum ('operator', 'site', 'group', 'machine', 'month', 'denomination', 'day') NULL, `grouping_value` varchar(64) NULL, `date` varchar(16) NOT NULL, `r1` bigint UNSIGNED NULL, `r2` bigint UNSIGNED NULL, `r7` bigint UNSIGNED NULL, `r14` bigint UNSIGNED NULL, `r30` bigint UNSIGNED NULL, `is_completed` tinyint NOT NULL, `create_date` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `update_date` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), PRIMARY KEY (`id`)) ENGINE=InnoDB");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("DROP TABLE `retention_report`");
    }

}
