import {MigrationInterface, QueryRunner} from "typeorm";

export class AlertRelatedEntities1594119164295 implements MigrationInterface {
    name = 'AlertRelatedEntities1594119164295'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("CREATE TABLE `alert_notification_service` (`id` smallint(5) UNSIGNED NOT NULL AUTO_INCREMENT, `name` varchar(128) NOT NULL, `description` varchar(128) NULL, `service_identifier` varchar(128) NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB", undefined);
        await queryRunner.query("CREATE TABLE `alert_notification_services` (`id` bigint(24) UNSIGNED NOT NULL AUTO_INCREMENT, `alert_id` bigint(24) UNSIGNED NULL, `alert_notification_service_id` smallint(5) UNSIGNED NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB", undefined);
        await queryRunner.query("CREATE TABLE `alert_type` (`id` smallint(5) UNSIGNED NOT NULL AUTO_INCREMENT, `name` varchar(128) NOT NULL, `description` varchar(128) NULL, `level` varchar(128) NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB", undefined);
        await queryRunner.query("CREATE TABLE `alert_type_notification_service` (`id` bigint(24) UNSIGNED NOT NULL AUTO_INCREMENT, `alert_type_id` smallint(5) UNSIGNED NULL, `alert_notification_service_id` smallint(5) UNSIGNED NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB", undefined);
        await queryRunner.query("ALTER TABLE `alert_notification_services` ADD CONSTRAINT `FK_99f67a9aa1f5c9ac06c70068af3` FOREIGN KEY (`alert_id`) REFERENCES `alert`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION", undefined);
        await queryRunner.query("ALTER TABLE `alert_notification_services` ADD CONSTRAINT `FK_4f3893eac9ed6d732d2290b480a` FOREIGN KEY (`alert_notification_service_id`) REFERENCES `alert_notification_service`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION", undefined);
        await queryRunner.query("ALTER TABLE `alert_type_notification_service` ADD CONSTRAINT `FK_c33845700f5f5340358f99f8521` FOREIGN KEY (`alert_type_id`) REFERENCES `alert_type`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION", undefined);
        await queryRunner.query("ALTER TABLE `alert_type_notification_service` ADD CONSTRAINT `FK_a9056c0d6cda9cc7815314f8912` FOREIGN KEY (`alert_notification_service_id`) REFERENCES `alert_notification_service`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION", undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `alert_type_notification_service` DROP FOREIGN KEY `FK_a9056c0d6cda9cc7815314f8912`", undefined);
        await queryRunner.query("ALTER TABLE `alert_type_notification_service` DROP FOREIGN KEY `FK_c33845700f5f5340358f99f8521`", undefined);
        await queryRunner.query("ALTER TABLE `alert_notification_services` DROP FOREIGN KEY `FK_4f3893eac9ed6d732d2290b480a`", undefined);
        await queryRunner.query("ALTER TABLE `alert_notification_services` DROP FOREIGN KEY `FK_99f67a9aa1f5c9ac06c70068af3`", undefined);
        await queryRunner.query("DROP TABLE `alert_type_notification_service`", undefined);
        await queryRunner.query("DROP TABLE `alert_type`", undefined);
        await queryRunner.query("DROP TABLE `alert_notification_services`", undefined);
        await queryRunner.query("DROP TABLE `alert_notification_service`", undefined);
    }

}
