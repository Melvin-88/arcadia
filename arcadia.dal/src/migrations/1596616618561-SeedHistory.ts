import {MigrationInterface, QueryRunner} from "typeorm";

export class SeedHistory1596616618561 implements MigrationInterface {
    name = 'SeedHistory1596616618561'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("CREATE TABLE `seed_history` (`id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, `machine_id` bigint UNSIGNED NOT NULL, `seed` json NOT NULL, `create_date` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), PRIMARY KEY (`id`)) ENGINE=InnoDB");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("DROP TABLE `seed_history`");
    }

}
