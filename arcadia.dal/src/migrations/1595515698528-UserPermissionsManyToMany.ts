import {MigrationInterface, QueryRunner} from "typeorm";

export class UserPermissionsManyToMany1595515698528 implements MigrationInterface {
    name = 'UserPermissionsManyToMany1595515698528';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('CREATE TABLE `bo_module`' +
            '(`id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, ' +
            '`name` varchar(64) NOT NULL, ' +
            '`description` varchar(128) NULL, ' +
            '`tag` varchar(64) NOT NULL, ' +
            '`create_date` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), ' +
            'CONSTRAINT `contacts_unique` UNIQUE (tag), ' +
            'PRIMARY KEY (`id`)) ' +
            'ENGINE=InnoDB', undefined);

        await queryRunner.query(
            "INSERT INTO bo_module(name, description, tag) values" +
            "('dashboard', 'access to dashboard', 'dashboard'), " +
            "('sessions', 'access to sessions', 'sessions'), " +
            "('players', 'access to players', 'players'), " +
            "('groups', 'access to groups', 'groups'), " +
            "('machines', 'access to machines', 'machines'), " +
            "('vouchers', 'access to vouchers', 'vouchers'), " +
            "('operators', 'access to operators', 'operators'), " +
            "('reports', 'access to reports', 'reports'), " +
            "('alerts', 'access to alerts', 'alerts'), " +
            "('disputes', 'access to disputes', 'disputes'), " +
            "('monitoring', 'access to monitoring', 'monitoring'), " +
            "('administration', 'access to administration', 'administration'), " +
            "('cameras', 'access to cameras', 'cameras'), " +
            "('maintenance', 'access to maintenance', 'maintenance'), " +
            "('jackpots', 'access to jackpots', 'jackpots')"
        );

        await queryRunner.query("ALTER TABLE `user` DROP COLUMN `permitted_modules`", undefined);

        await queryRunner.query("CREATE TABLE `user_permitted_modules_bo_module` (`user_id` int(10) UNSIGNED NOT NULL, `bo_module_id` int(10) UNSIGNED NOT NULL, INDEX `IDX_9298329aeaaaf1787e85173ce5` (`user_id`), INDEX `IDX_119e02e600ae165a4fefdf05e7` (`bo_module_id`), PRIMARY KEY (`user_id`, `bo_module_id`)) ENGINE=InnoDB");

        await queryRunner.query("ALTER TABLE `user_permitted_modules_bo_module` ADD CONSTRAINT `FK_9298329aeaaaf1787e85173ce6g` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `user_permitted_modules_bo_module` ADD CONSTRAINT `FK_119e02e600ae165a4fefdf05e78` FOREIGN KEY (`bo_module_id`) REFERENCES `bo_module`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION");

        await queryRunner.query("DROP TABLE `user_permission`", undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("DROP TABLE `user_permitted_modules_bo_module`", undefined);
        await queryRunner.query("DROP TABLE `bo_module`", undefined);

        await queryRunner.query("ALTER TABLE `user` ADD `permitted_modules` json NULL", undefined);

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
    }
}
