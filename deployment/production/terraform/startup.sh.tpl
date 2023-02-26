#!/bin/sh
mkdir -p "/var/mysql/config"
if [ $(hostname) = "mysql-master" ]
then
    cat > "/var/mysql/config/my.cnf" << EOF
[mysqld]
server-id = 1
EOF
else
    cat > "/var/mysql/my.cnf" << EOF
[mysqld]
server-id = 2
EOF
    cat > "/var/lib/toolbox/script.sh" << EOF
#!/bin/sh
while true
do
    netstat -uplnt | grep :3306 | grep LISTEN > /dev/null
    verifier=\$?
    if [ 0 = \$verifier ]
        then
            docker_id=\$(docker ps -f ancestor=${image} --format "{{.ID}}")
            break
        else
            echo "MYSQL is not running yet"
            sleep 5
    fi
done
until docker exec \$docker_id sh -c "export MYSQL_PWD=${mysql_pwd}; mysql -u root -h ${host}"
do
    echo "Waiting for mysql-master database connection..."
    sleep 4
done
command='GRANT REPLICATION SLAVE ON *.* TO "${slave_user}"@"%" IDENTIFIED BY "${password}"; FLUSH PRIVILEGES; SHOW MASTER STATUS \G'
docker exec \$docker_id sh -c "export MYSQL_PWD=${mysql_pwd}; mysql -u root -h ${host} -e '\$command'"
MS_STATUS=\$(docker exec \$docker_id sh -c 'export MYSQL_PWD=${mysql_pwd}; mysql -u root -h ${host} -e "SHOW MASTER STATUS"')
CURRENT_LOG=\$(echo \$MS_STATUS | awk '{print \$6}')
CURRENT_POS=\$(echo \$MS_STATUS | awk '{print \$7}')
command="CHANGE MASTER TO MASTER_HOST=\\"${host}\\", MASTER_USER=\\"${slave_user}\\", MASTER_PASSWORD=\\"${password}\\", MASTER_LOG_FILE=\\"\$CURRENT_LOG\\", MASTER_LOG_POS=\$CURRENT_POS; START SLAVE; SHOW SLAVE STATUS \G"
docker exec \$docker_id sh -c "export MYSQL_PWD=${mysql_pwd}; mysql -u root -e '\$command'"
EOF
chmod +x "/var/lib/toolbox/script.sh"
echo test
fi
