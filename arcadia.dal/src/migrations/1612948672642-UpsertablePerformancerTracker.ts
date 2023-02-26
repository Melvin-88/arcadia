import {MigrationInterface, QueryRunner} from "typeorm";

export class UpsertablePerformancerTracker1612948672642 implements MigrationInterface {
    name = 'UpsertablePerformancerTracker1612948672642'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("DROP TABLE `performance_tracker`");
        await queryRunner.query("create table performance_tracker\n" +
            "(\n" +
            "\tupdate_date datetime(6) default CURRENT_TIMESTAMP(6) not null on update CURRENT_TIMESTAMP(6),\n" +
            "\tvalue smallint not null,\n" +
            "\tviolated_threshold enum('alertLow', 'alertHigh', 'cutoffLow', 'cutoffHigh') null,\n" +
            "\tcreate_date datetime(6) default CURRENT_TIMESTAMP(6) not null,\n" +
            "\tis_deleted tinyint default 0 not null,\n" +
            "\tindicator_id smallint unsigned not null,\n" +
            "\tmachine_serial varchar(255) not null,\n" +
            "\tprimary key (indicator_id, machine_serial),\n" +
            "\tconstraint FK_c5827144412be748009a6a32b1d\n" +
            "\t\tforeign key (indicator_id) references performance_indicator (id)\n" +
            ")");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("DROP TABLE `performance_tracker`");
        await queryRunner.query("create table `game-api`.performance_tracker\n" +
            "(\n" +
            "\tid smallint unsigned auto_increment\n" +
            "\t\tprimary key,\n" +
            "\tupdate_date datetime(6) default CURRENT_TIMESTAMP(6) not null on update CURRENT_TIMESTAMP(6),\n" +
            "\tvalue smallint not null,\n" +
            "\tviolated_threshold enum('alertLow', 'alertHigh', 'cutoffLow', 'cutoffHigh') null,\n" +
            "\tperformance_indicator_id smallint unsigned null,\n" +
            "\tcreate_date datetime(6) default CURRENT_TIMESTAMP(6) not null,\n" +
            "\tis_deleted tinyint default 0 not null,\n" +
            "\tconstraint FK_7eccfdabaad0e59cc41a9471cbc\n" +
            "\t\tforeign key (performance_indicator_id) references `game-api`.performance_indicator (id)\n" +
            ")\n" +
            "charset=latin1;\n" +
            "\n");
    }

}
