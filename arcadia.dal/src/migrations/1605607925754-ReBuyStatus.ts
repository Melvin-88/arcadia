import {MigrationInterface, QueryRunner} from "typeorm";

export class ReBuyStatus1605607925754 implements MigrationInterface {
    name = 'ReBuyStatus1605607925754'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `session` CHANGE `status` `status` enum ('viewer', 'playing', 'autoplay', 'queue', 'terminating', 'completed', 'terminated', 'forcedAutoplay', 'viewerBetBehind', 'queueBetBehind', 'reBuy') NOT NULL DEFAULT 'viewer'");
        await queryRunner.query("ALTER TABLE `session_archive` CHANGE `status` `status` enum ('viewer', 'playing', 'autoplay', 'queue', 'terminating', 'completed', 'terminated', 'forcedAutoplay', 'viewerBetBehind', 'queueBetBehind', 'reBuy') NOT NULL");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `session_archive` CHANGE `status` `status` enum ('viewer', 'playing', 'autoplay', 'queue', 'terminating', 'completed', 'terminated', 'forcedAutoplay', 'viewerBetBehind', 'queueBetBehind') NOT NULL");
        await queryRunner.query("ALTER TABLE `session` CHANGE `status` `status` enum ('viewer', 'playing', 'autoplay', 'queue', 'terminating', 'completed', 'terminated', 'forcedAutoplay', 'viewerBetBehind', 'queueBetBehind') NOT NULL DEFAULT 'viewer'");
    }

}
