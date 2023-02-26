import {MigrationInterface, QueryRunner} from "typeorm";

export class DashboardData1602840115506 implements MigrationInterface {
    name = 'DashboardData1602840115506'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("CREATE TABLE `dashboard_data` (`id` varchar(255) NOT NULL, `data` json NOT NULL, `update_date` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), PRIMARY KEY (`id`)) ENGINE=InnoDB");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("DROP TABLE `dashboard_data`");
    }

}
