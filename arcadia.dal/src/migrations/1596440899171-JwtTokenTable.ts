import {MigrationInterface, QueryRunner} from "typeorm";

export class JwtTokenTable1596440899171 implements MigrationInterface {
    name = 'JwtTokenTable1596440899171'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("CREATE TABLE `jwt_token` (`id` varchar(255) NOT NULL, `token` varchar(512) NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB", undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("DROP TABLE `jwt_token`", undefined);
    }

}
