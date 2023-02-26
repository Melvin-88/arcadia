import {MigrationInterface, QueryRunner} from "typeorm";

export class SessionIsDenominationChanged1614205679275 implements MigrationInterface {
    name = 'SessionIsDenominationChanged1614205679275'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `session` ADD `is_denomination_changed` tinyint NOT NULL DEFAULT 0");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `session` DROP COLUMN `is_denomination_changed`");
    }
}
