import {MigrationInterface, QueryRunner} from "typeorm";

export class ChangeDisputesReportEnum1610656348962 implements MigrationInterface {
    name = 'ChangeDisputesReportEnum1610656348962'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("DELETE FROM `disputes_report` WHERE grouping_key IN('cid', 'reason')");
        await queryRunner.query("ALTER TABLE `disputes_report` ADD temp_grouping_key ENUM ('operator', 'player', 'status', 'month', 'day') NULL");
        await queryRunner.query("UPDATE `disputes_report` SET temp_grouping_key = grouping_key");
        await queryRunner.query("ALTER TABLE `disputes_report` DROP grouping_key");
        await queryRunner.query("ALTER TABLE `disputes_report` CHANGE temp_grouping_key grouping_key ENUM ('operator', 'player', 'status', 'month', 'day') NULL");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `disputes_report` CHANGE `grouping_key` `grouping_key` enum ('operator', 'cid', 'reason', 'status', 'month', 'day') NULL");
    }
}
