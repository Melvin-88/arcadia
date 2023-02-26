import {MigrationInterface, QueryRunner} from "typeorm";

export class PhantomPrizesTabUpd1610119648324 implements MigrationInterface {
    name = 'PhantomPrizesTabUpd1610119648324'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `rng_phantom_prizes` DROP FOREIGN KEY rng_phantom_prizes_group_id_fk");
        await queryRunner.query("ALTER TABLE `rng_phantom_prizes` DROP COLUMN group_id");
        await queryRunner.query("ALTER TABLE `rng_phantom_prizes` ADD `group` varchar(64) NOT NULL DEFAULT 'default'");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `rng_phantom_prizes` DROP COLUMN `group`");
        await queryRunner.query("ALTER TABLE `rng_phantom_prizes` ADD `group_id` int UNSIGNED NULL");
        await queryRunner.query("ALTER TABLE `rng_phantom_prizes` ADD CONSTRAINT `rng_phantom_prizes_group_id_fk` FOREIGN KEY (`group_id`) REFERENCES `group`(`id`) ON DELETE SET NULL ON UPDATE NO ACTION");
    }

}
