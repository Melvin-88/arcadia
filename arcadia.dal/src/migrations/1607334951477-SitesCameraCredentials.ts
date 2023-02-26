import {MigrationInterface, QueryRunner} from "typeorm";

export class SitesCameraCredentials1607334951477 implements MigrationInterface {
    name = 'SitesCameraCredentials1607334951477'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `site` ADD `camera_api_user` varchar(64) NOT NULL");
        await queryRunner.query("ALTER TABLE `site` ADD `camera_api_base_url` varchar(200) NOT NULL");
        await queryRunner.query("ALTER TABLE `site` ADD `camera_api_password_config_key` varchar(64) NOT NULL");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `site` DROP COLUMN `camera_api_password_config_key`");
        await queryRunner.query("ALTER TABLE `site` DROP COLUMN `camera_api_base_url`");
        await queryRunner.query("ALTER TABLE `site` DROP COLUMN `camera_api_user`");
    }

}
