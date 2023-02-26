import {MigrationInterface, QueryRunner} from "typeorm";

export class KPIEntities1594131250951 implements MigrationInterface {
    name = 'KPIEntities1594131250951';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("CREATE TABLE `performance_indicator` (`id` smallint(5) UNSIGNED NOT NULL AUTO_INCREMENT, `status` enum ('active', 'suspended') NOT NULL DEFAULT 'active', `segment` enum ('machine', 'group', 'operator', 'all') NOT NULL DEFAULT 'machine', `sub_segment` json NOT NULL, `target_value` smallint(5) UNSIGNED NOT NULL, `alert_low_threshold` smallint(5) UNSIGNED NOT NULL, `alert_high_threshold` smallint(5) UNSIGNED NOT NULL, `cutoff_low_threshold` smallint(5) UNSIGNED NOT NULL, `cutoff_high_threshold` smallint(5) UNSIGNED NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB", undefined);
        await queryRunner.query("CREATE TABLE `performance_tracker` (`id` smallint(5) UNSIGNED NOT NULL AUTO_INCREMENT, `update_date` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `value` smallint(5) UNSIGNED NOT NULL, `violated_threshold` enum ('alertLow', 'alertHigh', 'cutoffLow', 'cutoffHigh') NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB", undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("DROP TABLE `performance_tracker`", undefined);
        await queryRunner.query("DROP TABLE `performance_indicator`", undefined);
    }

}
