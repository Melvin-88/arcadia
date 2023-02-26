import {MigrationInterface, QueryRunner} from "typeorm";

export class PerformanceTrackerSubsegmentId1613566249368 implements MigrationInterface {
    name = 'PerformanceTrackerSubsegmentId1613566249368'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `performance_tracker` CHANGE `machine_serial` `subsegment_item` varchar(255) NOT NULL");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `performance_tracker` CHANGE `subsegment_item` `machine_serial` varchar(255) NOT NULL");
    }

}
