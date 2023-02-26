###### Compute Engine VM
 - OS: CentOS
 - Instalation:
    - Docker
    - Docker Compose
    - Nginx
    - Change ssh config permitrootlogin to true
    - Execute `gcloud auth configure-docker` for root and your user
    - Execute `setsebool -P httpd_can_network_connect 1`
    - Add [startup script](startup.sh) by metadata `gcloud compute instances add-metadata your-instance \
                                                          --metadata-from-file=startup-script={path to file}`
    - Add [nginx config](arcadia.conf)
    - Add docker compose [config](docker-compose.yml)
    - Add fierwall rules for ports 3306(database) and 15672(rabbitMQ UI) 
    - To service account should be add permission Storage Object Viewer
    
###### Locally 
[Host](hosts) should be added to local host                                                     

###### CI/CD trigger branch development

###### Clould Build
To cloud build service account should be added permission: 
   - Compute Instance Admin (v1)
   - Service Account User                                                     
