import {MigrationInterface, QueryRunner} from "typeorm";

export class CurrencyConversion1591878400355 implements MigrationInterface {
    name = 'CurrencyConversion1591878400355';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("CREATE TABLE `currency_conversion` (`id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, `currency` varchar(3) NOT NULL, `effective_from` datetime NOT NULL, `rate` decimal(10,2) UNSIGNED NOT NULL DEFAULT '0.00', PRIMARY KEY (`id`)) ENGINE=InnoDB", undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("DROP TABLE `currency_conversion`", undefined);
    }

}
