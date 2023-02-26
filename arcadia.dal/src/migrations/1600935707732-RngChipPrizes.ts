import {MigrationInterface, QueryRunner} from "typeorm";

export class RngChipPrizes1600935707732 implements MigrationInterface {
    name = 'RngChipPrizes1600935707732'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("create table rng_phantom_prizes\n" +
          "(\n" +
          "    id               int unsigned auto_increment\n" +
          "        primary key,\n" +
          "    group_id         int unsigned                        not null,\n" +
          "    prize_type       varchar(20)                         not null,\n" +
          "    prize_value      decimal(6, 2)                       null,\n" +
          "    other_value      varchar(20)                         null,\n" +
          "    probability      decimal(5, 4) unsigned              not null,\n" +
          "    created_datetime timestamp default CURRENT_TIMESTAMP not null,\n" +
          "    updated_datetime timestamp                           null on update CURRENT_TIMESTAMP,\n" +
          "    rtp_segment      varchar(50)                         null,\n" +
          "    constraint rng_phantom_prizes_group_id_fk\n" +
          "        foreign key (group_id) references `group` (id)\n" +
          "            on delete cascade\n" +
          ")\n" +
          "    comment 'RNG service table';\n");
        await queryRunner.query("create table rng_chip_prizes\n" +
          "(\n" +
          "    id               int unsigned auto_increment\n" +
          "        primary key,\n" +
          "    group_id         int unsigned                             null,\n" +
          "    chip_type_id     int unsigned                             null,\n" +
          "    chip_value       decimal(6, 2)                            null,\n" +
          "    rtp100           decimal(4, 2) unsigned                   not null,\n" +
          "    rtp_segment      varchar(50)                              null,\n" +
          "    created_datetime datetime(6) default CURRENT_TIMESTAMP(6) not null,\n" +
          "    updated_datetime datetime(6) default CURRENT_TIMESTAMP(6) not null,\n" +
          "    constraint FK_76ac0cf05c6ba01be98fb7b9cd3\n" +
          "        foreign key (chip_type_id) references chip_type (id)\n" +
          "            on delete set null,\n" +
          "    constraint FK_ffacdde6d2cf6ac86c15741fb16\n" +
          "        foreign key (group_id) references `group` (id)\n" +
          "            on delete set null\n" +
          ")\n" +
          "    comment 'RNG service table';");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("DROP TABLE `rng_chip_prizes`");
        await queryRunner.query("DROP TABLE `rng_phantom_prizes`");
    }

}
