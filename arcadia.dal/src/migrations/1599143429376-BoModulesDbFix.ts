import {MigrationInterface, QueryRunner} from "typeorm";

export class BoModulesDbFix1599143429376 implements MigrationInterface {
    name = 'BoModulesDbFix1599143429376'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `user_permitted_modules_bo_module` DROP FOREIGN KEY `FK_9298329aeaaaf1787e85173ce6g`");
        await queryRunner.query("ALTER TABLE `user_permitted_modules_bo_module` DROP FOREIGN KEY `FK_119e02e600ae165a4fefdf05e78`");
        await queryRunner.query("DROP INDEX `contacts_unique` ON `bo_module`");
        await queryRunner.query("DROP INDEX `IDX_9298329aeaaaf1787e85173ce5` ON `user_permitted_modules_bo_module`");
        await queryRunner.query("DROP INDEX `IDX_119e02e600ae165a4fefdf05e7` ON `user_permitted_modules_bo_module`");
        await queryRunner.query("CREATE INDEX `IDX_6bbc588459b0dc59790912cc79` ON `user_permitted_modules_bo_module` (`user_id`)");
        await queryRunner.query("CREATE INDEX `IDX_5662a9e4b59a44b410a2f580c1` ON `user_permitted_modules_bo_module` (`bo_module_id`)");
        await queryRunner.query("ALTER TABLE `user_permitted_modules_bo_module` ADD CONSTRAINT `FK_6bbc588459b0dc59790912cc790` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `user_permitted_modules_bo_module` ADD CONSTRAINT `FK_5662a9e4b59a44b410a2f580c1c` FOREIGN KEY (`bo_module_id`) REFERENCES `bo_module`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `user_permitted_modules_bo_module` DROP FOREIGN KEY `FK_5662a9e4b59a44b410a2f580c1c`");
        await queryRunner.query("ALTER TABLE `user_permitted_modules_bo_module` DROP FOREIGN KEY `FK_6bbc588459b0dc59790912cc790`");
        await queryRunner.query("DROP INDEX `IDX_5662a9e4b59a44b410a2f580c1` ON `user_permitted_modules_bo_module`");
        await queryRunner.query("DROP INDEX `IDX_6bbc588459b0dc59790912cc79` ON `user_permitted_modules_bo_module`");
        await queryRunner.query("CREATE INDEX `IDX_119e02e600ae165a4fefdf05e7` ON `user_permitted_modules_bo_module` (`bo_module_id`)");
        await queryRunner.query("CREATE INDEX `IDX_9298329aeaaaf1787e85173ce5` ON `user_permitted_modules_bo_module` (`user_id`)");
        await queryRunner.query("CREATE UNIQUE INDEX `contacts_unique` ON `bo_module` (`tag`)");
        await queryRunner.query("ALTER TABLE `user_permitted_modules_bo_module` ADD CONSTRAINT `FK_119e02e600ae165a4fefdf05e78` FOREIGN KEY (`bo_module_id`) REFERENCES `bo_module`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `user_permitted_modules_bo_module` ADD CONSTRAINT `FK_9298329aeaaaf1787e85173ce6g` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION");
    }

}
