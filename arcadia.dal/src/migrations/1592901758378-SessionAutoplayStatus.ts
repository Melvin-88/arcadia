import {MigrationInterface, QueryRunner} from "typeorm";

export class SessionAutoplayStatus1592901758378 implements MigrationInterface {
    name = 'SessionAutoplayStatus1592901758378'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `session` CHANGE `status` `status` enum ('viewer', 'playing', 'autoplay', 'queue', 'terminating', 'completed', 'terminated') NOT NULL DEFAULT 'viewer'", undefined);
        await queryRunner.query("ALTER TABLE `session_archive` CHANGE `status` `status` enum ('viewer', 'playing', 'autoplay', 'queue', 'terminating', 'completed', 'terminated') NOT NULL DEFAULT 'viewer'", undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `session_archive` CHANGE `status` `status` enum ('viewer', 'playing', 'queue', 'terminating', 'completed', 'terminated') NOT NULL DEFAULT 'viewer'", undefined);
        await queryRunner.query("ALTER TABLE `session` CHANGE `status` `status` enum ('viewer', 'playing', 'queue', 'terminating', 'completed', 'terminated') NOT NULL DEFAULT 'viewer'", undefined);
    }

}
