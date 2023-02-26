import {MigrationInterface, QueryRunner} from "typeorm";

export class ScatterRoundSizeRmove1597844362070 implements MigrationInterface {
    name = 'ScatterRoundSizeRmove1597844362070'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `group` DROP COLUMN `scatter_round_size`");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `group` ADD `scatter_round_size` smallint NULL");
    }

}
