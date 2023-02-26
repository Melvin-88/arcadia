import {MigrationInterface, QueryRunner} from "typeorm";

export class UserEnabledStatus1594724609323 implements MigrationInterface {
    name = 'UserEnabledStatus1594724609323';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `user` CHANGE `status` `status` enum ('enabled', 'disabled') NOT NULL DEFAULT 'enabled'", undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `user` CHANGE `status` `status` enum ('active', 'disabled') NOT NULL DEFAULT 'active'", undefined);
    }

}
