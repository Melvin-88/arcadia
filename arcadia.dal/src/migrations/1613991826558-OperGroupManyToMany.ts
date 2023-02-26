import {MigrationInterface, QueryRunner} from "typeorm";

export class OperGroupManyToMany1613991826558 implements MigrationInterface {
    name = 'OperGroupManyToMany1613991826558'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `group` DROP FOREIGN KEY `FK_64163d99f930dad5086b67dcfee`");
        await queryRunner.query("CREATE TABLE `group_operators_operator` (`group_id` int UNSIGNED NOT NULL, `operator_id` bigint UNSIGNED NOT NULL, INDEX `IDX_88d10088c35b091922aaaf7d88` (`group_id`), INDEX `IDX_876b05dd82062c001b90c5ce21` (`operator_id`), PRIMARY KEY (`group_id`, `operator_id`)) ENGINE=InnoDB");
        await queryRunner.query("ALTER TABLE `group` DROP COLUMN `operator_id`");
        await queryRunner.query("ALTER TABLE `group_operators_operator` ADD CONSTRAINT `FK_88d10088c35b091922aaaf7d887` FOREIGN KEY (`group_id`) REFERENCES `group`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `group_operators_operator` ADD CONSTRAINT `FK_876b05dd82062c001b90c5ce219` FOREIGN KEY (`operator_id`) REFERENCES `operator`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `group_operators_operator` DROP FOREIGN KEY `FK_876b05dd82062c001b90c5ce219`");
        await queryRunner.query("ALTER TABLE `group_operators_operator` DROP FOREIGN KEY `FK_88d10088c35b091922aaaf7d887`");
        await queryRunner.query("ALTER TABLE `group` ADD `operator_id` bigint UNSIGNED NULL");
        await queryRunner.query("DROP INDEX `IDX_876b05dd82062c001b90c5ce21` ON `group_operators_operator`");
        await queryRunner.query("DROP INDEX `IDX_88d10088c35b091922aaaf7d88` ON `group_operators_operator`");
        await queryRunner.query("DROP TABLE `group_operators_operator`");
        await queryRunner.query("ALTER TABLE `group` ADD CONSTRAINT `FK_64163d99f930dad5086b67dcfee` FOREIGN KEY (`operator_id`) REFERENCES `operator`(`id`) ON DELETE SET NULL ON UPDATE NO ACTION");
    }

}
