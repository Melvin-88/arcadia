import {MigrationInterface, QueryRunner} from "typeorm";

export class MachineStatusReport1605237841180 implements MigrationInterface {
    name = 'MachineStatusReport1605237841180'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("CREATE TABLE `machine_status_report` (`id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, `params` json NOT NULL, `params_hash` varchar(255) NULL, `grouping_key` enum ('operator', 'site', 'group', 'machine', 'month', 'denomination', 'day', 'status') NULL, `grouping_value` varchar(64) NULL, `date` varchar(16) NOT NULL, `total_machines` bigint UNSIGNED NULL, `total_available_time` decimal(16,2) NULL, `percent_available_time` decimal(16,2) NULL, `total_in_play_time` decimal(16,2) NULL, `percent_in_play_time` decimal(16,2) NULL, `total_error_time` decimal(16,2) NULL, `percent_error_time` decimal(16,2) NULL, `total_offline_time` decimal(16,2) NULL, `percent_offline_time` decimal(16,2) NULL, `total_stopped_time` decimal(16,2) NULL, `percent_stopped_time` decimal(16,2) NULL, `total_shutting_down_time` decimal(16,2) NULL, `percent_shitting_down_time` decimal(16,2) NULL, `total_on_hold_time` decimal(16,2) NULL, `percent_on_hold_time` decimal(16,2) NULL, `total_preparing_time` decimal(16,2) NULL, `percent_preparing_time` decimal(16,2) NULL, `total_ready_time` decimal(16,2) NULL, `percent_ready_time` decimal(16,2) NULL, `total_seeding_time` decimal(16,2) NULL, `percent_seeding_time` decimal(16,2) NULL, `is_completed` tinyint NOT NULL, `create_date` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `update_date` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), PRIMARY KEY (`id`)) ENGINE=InnoDB");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("DROP TABLE `machine_status_report`");
    }

}
