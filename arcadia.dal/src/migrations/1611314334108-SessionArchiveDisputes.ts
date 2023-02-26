import {MigrationInterface, QueryRunner} from "typeorm";

export class SessionArchiveDisputes1611314334108 implements MigrationInterface {
    name = 'SessionArchiveDisputes1611314334108'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `dispute` DROP FOREIGN KEY `FK_0b7c5bf657eb0a326be000cbac4`");
        await queryRunner.query("ALTER TABLE `dispute` ADD CONSTRAINT `FK_0b7c5bf657eb0a326be000cbac4` FOREIGN KEY (`session_id`) REFERENCES `session_archive`(`id`) ON DELETE SET NULL ON UPDATE NO ACTION");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `dispute` DROP FOREIGN KEY `FK_0b7c5bf657eb0a326be000cbac4`");
        await queryRunner.query("ALTER TABLE `dispute` ADD CONSTRAINT `FK_0b7c5bf657eb0a326be000cbac4` FOREIGN KEY (`session_id`) REFERENCES `session`(`id`) ON DELETE SET NULL ON UPDATE NO ACTION");
    }

}
