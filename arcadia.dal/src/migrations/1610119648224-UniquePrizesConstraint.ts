import {MigrationInterface, QueryRunner} from "typeorm";

export class UniquePrizesConstraint1610119648224 implements MigrationInterface {
    name = 'UniquePrizesConstraint1610119648224'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `rng_chip_prizes` ADD CONSTRAINT `unique_group_chip_type_rtp_segment` UNIQUE (`group`, chip_type_id, rtp_segment)");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `rng_chip_prizes` DROP CONSTRAINT `unique_group_chip_type_rtp_segment`");
    }
}
