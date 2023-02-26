import {MigrationInterface, QueryRunner} from "typeorm";

export class OperatorLogoChanges1596108321860 implements MigrationInterface {
    name = 'OperatorLogoChanges1596108321860';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("CREATE TABLE `logo` (`id` int UNSIGNED NOT NULL AUTO_INCREMENT, `logo_binary` mediumblob NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB", undefined);
        await queryRunner.query("ALTER TABLE `operator` ADD `logo_url` varchar(128) NULL", undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("DROP TABLE `logo`", undefined);
        await queryRunner.query("ALTER TABLE `operator` DROP `logo_url`", undefined);
    }

}
