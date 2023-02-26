import {MigrationInterface, QueryRunner} from "typeorm";

export class UserPermissions1594907591878 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('CREATE TABLE `user_permission`' +
            '(`id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, ' +
            '`name` varchar(64) NOT NULL, ' +
            '`description` varchar(128) NULL, ' +
            '`create_date` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), ' +
            'PRIMARY KEY (`id`)) ' +
            'ENGINE=InnoDB', undefined);

        await queryRunner.query(
            "INSERT INTO user_permission(name, description) values" +
            "('dashboard', 'access to dashboard'), " +
            "('sessions', 'access to sessions'), " +
            "('players', 'access to players'), " +
            "('groups', 'access to groups'), " +
            "('machines', 'access to machines'), " +
            "('vouchers', 'access to vouchers'), " +
            "('operators', 'access to operators'), " +
            "('reports', 'access to reports'), " +
            "('alerts', 'access to alerts'), " +
            "('disputes', 'access to disputes'), " +
            "('monitoring', 'access to monitoring'), " +
            "('administration', 'access to administration'), " +
            "('cameras', 'access to cameras'), " +
            "('maintenance', 'access to maintenance'), " +
            "('jackpots', 'access to jackpots')"
            );

        await queryRunner.query("ALTER TABLE `user` ADD `permitted_modules` json NULL", undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("DROP TABLE `user_permission`", undefined);
        await queryRunner.query("ALTER TABLE `user` DROP COLUMN `permitted_modules`", undefined);
    }

}
