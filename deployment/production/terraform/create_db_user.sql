create database `game-api`;
create user `game-api-user`@'%' IDENTIFIED WITH mysql_native_password BY 'W7vfrgLWE3&]v~[';
create database `audit`;
GRANT ALL ON `game-api`.* TO 'game-api-user'@'%';
GRANT ALL ON `audit`.* TO 'game-api-user'@'%';
create user `arcadia-rpl-user`@10.0.4.2 identified by 'passw0rd';
grant replication slave on *.* to `arcadia-rpl-user`@10.0.4.2;
flush privileges;
# slave
CHANGE MASTER TO MASTER_HOST='10.0.4.4', MASTER_USER='arcadia-rpl-user', MASTER_PASSWORD='passw0rd', MASTER_LOG_FILE='binlog.000002', MASTER_LOG_POS=2123;
