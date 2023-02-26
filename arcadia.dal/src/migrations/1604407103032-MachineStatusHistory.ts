import {MigrationInterface, QueryRunner} from "typeorm";

export class MachineStatusHistory1604407103032 implements MigrationInterface {
    name = 'MachineStatusHistory1604407103032'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("CREATE TABLE `machine_status_history` (`id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, `machine_id` bigint UNSIGNED NOT NULL, `status` enum ('in-play', 'preparing', 'seeding', 'ready', 'shutting-down', 'stopped', 'offline', 'error', 'onHold') NOT NULL, `timestamp` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), PRIMARY KEY (`id`)) ENGINE=InnoDB");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("DROP TABLE `machine_status_history`");
    }
}
