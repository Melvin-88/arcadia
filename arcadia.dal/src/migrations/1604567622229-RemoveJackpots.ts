import {MigrationInterface, QueryRunner} from "typeorm";

export class RemoveJackpots1604567622229 implements MigrationInterface {
    name = 'RemoveJackpots1604567622229'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("DELETE FROM bo_module WHERE name = 'jackpots'");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("INSERT INTO api.bo_module (name, description, tag) VALUES ('jackpots', 'access to jackpots', 'jackpots')");
    }

}
