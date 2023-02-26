import {MigrationInterface, QueryRunner} from "typeorm";

export class DisputeNullableColumns1596015283845 implements MigrationInterface {
    name = 'DisputeNullableColumns1596015283845'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `dispute` CHANGE `discussion` `discussion` text NULL", undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `dispute` CHANGE `discussion` `discussion` text NOT NULL", undefined);
    }

}
