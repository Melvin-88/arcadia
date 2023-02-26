/* eslint-disable */
import { MigrationInterface, QueryRunner } from 'typeorm';

export class Initial1587719374802 implements MigrationInterface {
    name = 'Initial1587719374802'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("CREATE TABLE `change` (`id` varchar(36) NOT NULL, `entity_name` varchar(200) NOT NULL, `old_entity` json NULL, `new_entity` json NULL, `action_type` enum ('insert', 'update', 'delete') NOT NULL, `created_at_date` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `action_id` varchar(36) NULL, INDEX `IDX_c2dacfdaf65d5381d9a52a3432` (`entity_name`), PRIMARY KEY (`id`)) ENGINE=InnoDB", undefined);
        await queryRunner.query("CREATE TABLE `action` (`id` varchar(36) NOT NULL, `user_id` int(10) UNSIGNED NOT NULL, `path` varchar(256) NOT NULL, `ip` varbinary(16) NOT NULL, `created_at_date` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), PRIMARY KEY (`id`)) ENGINE=InnoDB", undefined);
        await queryRunner.query("ALTER TABLE `change` ADD CONSTRAINT `FK_2d22a71262b6bab1ea3d9fe4b8a` FOREIGN KEY (`action_id`) REFERENCES `action`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION", undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `change` DROP FOREIGN KEY `FK_2d22a71262b6bab1ea3d9fe4b8a`", undefined);
        await queryRunner.query("DROP TABLE `action`", undefined);
        await queryRunner.query("DROP INDEX `IDX_c2dacfdaf65d5381d9a52a3432` ON `change`", undefined);
        await queryRunner.query("DROP TABLE `change`", undefined);
    }
}
