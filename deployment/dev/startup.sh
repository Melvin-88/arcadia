#! /bin/bash
sudo systemctl start nginx
sudo systemctl start docker
sudo docker-compose up
EOF
