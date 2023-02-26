import {MigrationInterface, QueryRunner} from "typeorm";

export class SessionUpd1612448558201 implements MigrationInterface {
    name = 'SessionUpd1612448558201'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `session` DROP FOREIGN KEY `FK_3b3285b47c005090d7b46bb979a`");
        await queryRunner.query("ALTER TABLE `session` DROP FOREIGN KEY `FK_6f0d9bf5bd78eeb8f7784a93bad`");
        await queryRunner.query("ALTER TABLE `session` DROP FOREIGN KEY `FK_d6405ef4073adcef7c5319688f9`");
        await queryRunner.query("ALTER TABLE `session` ADD `denominator` decimal(6,2) UNSIGNED NOT NULL DEFAULT '0.00'");
        await queryRunner.query("ALTER TABLE `session` ADD `operator_id` bigint UNSIGNED NULL");
        await queryRunner.query("ALTER TABLE `session` ADD CONSTRAINT `FK_88ef60ec85a068010e0c039fcd9` FOREIGN KEY (`operator_id`) REFERENCES `operator`(`id`) ON DELETE RESTRICT ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `session` ADD CONSTRAINT `FK_6f0d9bf5bd78eeb8f7784a93bad` FOREIGN KEY (`group_id`) REFERENCES `group`(`id`) ON DELETE RESTRICT ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `session` ADD CONSTRAINT `FK_d6405ef4073adcef7c5319688f9` FOREIGN KEY (`player_cid`) REFERENCES `player`(`cid`) ON DELETE RESTRICT ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `session` ADD CONSTRAINT `FK_3b3285b47c005090d7b46bb979a` FOREIGN KEY (`machine_id`) REFERENCES `machine`(`id`) ON DELETE RESTRICT ON UPDATE NO ACTION");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `session` DROP FOREIGN KEY `FK_3b3285b47c005090d7b46bb979a`");
        await queryRunner.query("ALTER TABLE `session` DROP FOREIGN KEY `FK_d6405ef4073adcef7c5319688f9`");
        await queryRunner.query("ALTER TABLE `session` DROP FOREIGN KEY `FK_6f0d9bf5bd78eeb8f7784a93bad`");
        await queryRunner.query("ALTER TABLE `session` DROP FOREIGN KEY `FK_88ef60ec85a068010e0c039fcd9`");
        await queryRunner.query("ALTER TABLE `session` DROP COLUMN `operator_id`");
        await queryRunner.query("ALTER TABLE `session` DROP COLUMN `denominator`");
        await queryRunner.query("ALTER TABLE `session` ADD CONSTRAINT `FK_d6405ef4073adcef7c5319688f9` FOREIGN KEY (`player_cid`) REFERENCES `player`(`cid`) ON DELETE SET NULL ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `session` ADD CONSTRAINT `FK_6f0d9bf5bd78eeb8f7784a93bad` FOREIGN KEY (`group_id`) REFERENCES `group`(`id`) ON DELETE SET NULL ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `session` ADD CONSTRAINT `FK_3b3285b47c005090d7b46bb979a` FOREIGN KEY (`machine_id`) REFERENCES `machine`(`id`) ON DELETE SET NULL ON UPDATE NO ACTION");
    }

}
