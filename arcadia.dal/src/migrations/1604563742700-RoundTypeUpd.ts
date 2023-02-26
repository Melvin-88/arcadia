import {MigrationInterface, QueryRunner} from "typeorm";

export class RoundTypeUpd1604563742700 implements MigrationInterface {
    name = 'RoundTypeUpd1604563742700'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `round` CHANGE `type` `type` enum ('regular', 'betBehind', 'scatter', 'voucher') NOT NULL DEFAULT 'regular'");
        await queryRunner.query("ALTER TABLE `round_archive` CHANGE `type` `type` enum ('regular', 'betBehind', 'scatter', 'voucher') NOT NULL");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `round_archive` CHANGE `type` `type` enum ('regular', 'betBehind', 'scatter', 'scatterBetBehind') NOT NULL");
        await queryRunner.query("ALTER TABLE `round` CHANGE `type` `type` enum ('regular', 'betBehind', 'scatter', 'scatterBetBehind') NOT NULL DEFAULT 'regular'");
    }

}
