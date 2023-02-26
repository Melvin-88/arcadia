import {MigrationInterface, QueryRunner} from "typeorm";

export class GroupNullableColor1611588322552 implements MigrationInterface {
    name = 'GroupNullableColor1611588322552'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `group` CHANGE `color` `color` varchar(64) NULL");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `group` CHANGE `color` `color` varchar(64) NOT NULL");
    }

}
