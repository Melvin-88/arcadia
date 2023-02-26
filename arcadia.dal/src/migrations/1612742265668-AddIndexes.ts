import {MigrationInterface, QueryRunner} from "typeorm";

export class AddIndexes1612742265668 implements MigrationInterface {
    name = 'AddIndexes1612742265668'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("CREATE INDEX `IDX_ef97bac56ccdd2cb942f084210` ON `session_archive` (`end_date`)");
        await queryRunner.query("CREATE INDEX `IDX_62106c5537bc2105b982ce8594` ON `machine` (`status`)");
        await queryRunner.query("CREATE INDEX `IDX_0eaee3b3fe61eb74723fe719ce` ON `alert` (`status`)");
        await queryRunner.query("CREATE INDEX `IDX_20a0b05708f5db5a95214d6630` ON `machine_status_history` (`machine_id`)");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("DROP INDEX `IDX_20a0b05708f5db5a95214d6630` ON `machine_status_history`");
        await queryRunner.query("DROP INDEX `IDX_0eaee3b3fe61eb74723fe719ce` ON `alert`");
        await queryRunner.query("DROP INDEX `IDX_62106c5537bc2105b982ce8594` ON `machine`");
        await queryRunner.query("DROP INDEX `IDX_ef97bac56ccdd2cb942f084210` ON `session_archive`");
    }

}
