import {MigrationInterface, QueryRunner} from "typeorm";

export class FkIdFix1613488088623 implements MigrationInterface {
    name = 'FkIdFix1613488088623'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `performance_tracker` DROP FOREIGN KEY `FK_c5827144412be748009a6a32b1d`");
        await queryRunner.query("ALTER TABLE `performance_tracker` ADD CONSTRAINT `FK_96c5cbe85980269146d8ac6fc2a` FOREIGN KEY (`indicator_id`) REFERENCES `performance_indicator`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `performance_tracker` DROP FOREIGN KEY `FK_96c5cbe85980269146d8ac6fc2a`");
        await queryRunner.query("ALTER TABLE `performance_tracker` ADD CONSTRAINT `FK_c5827144412be748009a6a32b1d` FOREIGN KEY (`indicator_id`) REFERENCES `performance_indicator`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
    }

}
