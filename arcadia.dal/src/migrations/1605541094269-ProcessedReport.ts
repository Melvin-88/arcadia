import {MigrationInterface, QueryRunner} from "typeorm";

export class ProcessedReport1605541094269 implements MigrationInterface {
    name = 'ProcessedReport1605541094269'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("CREATE TABLE `processed_report` (`params_hash` varchar(64) NOT NULL, `report_type` enum ('player-stats', 'machine-status', 'activity', 'revenue', 'vouchers', 'disputes', 'player-blocks', 'retention', 'funnel') NOT NULL, `params` json NOT NULL, `status` enum ('pending', 'in_progress', 'ready', 'error') NOT NULL, `create_date` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `update_date` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), PRIMARY KEY (`params_hash`)) ENGINE=InnoDB");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("DROP TABLE `processed_report`");
    }

}
