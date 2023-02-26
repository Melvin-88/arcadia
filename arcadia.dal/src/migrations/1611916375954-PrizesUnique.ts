import {MigrationInterface, QueryRunner} from "typeorm";

export class PrizesUnique1611916375954 implements MigrationInterface {
    name = 'PrizesUnique1611916375954'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("DROP INDEX `unique_group_chip_type_rtp_segment` ON `rng_chip_prizes`");
        await queryRunner.query("CREATE UNIQUE INDEX `IDX_3280e8e819c698a54cfa52b407` ON `rng_chip_prizes` (`group`, `chip_type_id`, `rtp_segment`)");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("DROP INDEX `IDX_3280e8e819c698a54cfa52b407` ON `rng_chip_prizes`");
    }

}
