import {MigrationInterface, QueryRunner} from "typeorm";

export class MachineUniqueIp1606836655472 implements MigrationInterface {
    name = 'MachineUniqueIp1606836655472'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `machine` ADD UNIQUE INDEX `IDX_5d30578169773a7f233abfdad7` (`controller_ip`)");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `machine` DROP INDEX `IDX_5d30578169773a7f233abfdad7`");
    }

}
