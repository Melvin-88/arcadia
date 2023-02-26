variable "credential_path" {
  description = "GCP credentials"
}

variable "project_id" {
  default = "arcadia-stage"
  type = string
  description = "The project ID to host the cluster in"
}
variable "region" {
  type = string
  description = "The region to host the cluster in"
  default = "europe-west3"
}
variable "asn" {
  description = "ASN for could router"
  default = 16550
}

variable "disk_size" {
  default = 50
  description = " The size of the image in gigabytes"
}

# GKE
variable "gke_num_nodes" {
  default = 1
  description = "The number of nodes per instance group"
}
variable "gke_machine_type" {
  default = "n1-standard-1"
  description = "The machine type to create"
}

# SQL
variable "sql_machine_type" {
  default = "n1-standard-1"
  description = "The machine type to create"
}
variable "mysql_image" {
  default = "mysql:8.0.22"
  description = "Mysql Docker image https://hub.docker.com/_/mysql?tab=tags"
}
variable "mysql_root_password" {
  default = "root_password"
  description = "This variable is mandatory and specifies the password that will be set for the MySQL root superuser account. In the above example, it was set to my-secret-pw."
}
variable "sql_slave_user" {
  default = "slave_user"
  description = "Account specifically for replication"
}
variable "sql_slave_password" {
  default = "password"
  description = "Account specifically for replication"
}
#mongo
variable "mongo_image" {
  default = "mongo:4"
  description = "MongoDB Docker image https://hub.docker.com/_/mongo?tab=tags"
}
variable "mongo_machine_type" {
  default = "n1-standard-1"
  description = "The machine type to create"
}
variable "mongo_disk_size" {
  default = 50
  description = " The size of the image in gigabytes"
}
variable "mongo_user" {
  default = "monitoring"
  description = "mongo user"
}
variable "mongo_password" {
  default = "W7vfrgLWE;3&]v~["
  description = "mongo password"
}
variable "mongo_db" {
  default = "action-logs"
  description = "Mongo database name"
}

#Redis
variable "redis_image" {
  default = "redis:5.0-alpine"
  description = "Redis Docker image https://hub.docker.com/_/redis?tab=tags"
}
variable "redis_machine_type" {
  default = "n1-standard-1"
  description = "The machine type to create"
}
variable "redis_disk_size" {
  default = 50
  description = " The size of the image in gigabytes"
}

#rabbitMQ

variable "rabbitmq_image" {
  default = "bitnami/rabbitmq:3.7.17"
  description = "Rabbitmq Docker image https://hub.docker.com/r/bitnami/rabbitmq/tags"
}
variable "rabbitmq_machine_type" {
  default = "n1-standard-1"
  description = "The machine type to create"
}
variable "rabbitmq_disk_size" {
  default = 50
  description = " The size of the image in gigabytes"
}
variable "rabbitmq_user" {
  default = "arcadia_admin"
  description = "rabbitmq user"
}
variable "rabbitmq_password" {
  default = "AB2WpJdqZ9RRrWH"
  description = "rabbitmq password"
}
variable "rabbitmq_node" {
  default = "rabbit@rabbitmq-1"
  description = "rabbitmq node name"
}

#gcb
variable "branch_name" {
  default = "^staging$"
  description = "branch name for triggers"
}
variable "repo_name" {
  default = "bitbucket_caesarea_arcadia-dev"
  description = "repository name"
}

#env

variable "BLUE_RIBBON_API_URL" {
  default = ""
}


variable "BLUE_RIBBON_AUTHENTICATION_KEY" {
  default = ""
}


variable "BLUE_RIBBON_AUTHENTICATION_SECRET" {
  default = ""
}


variable "BO_API_CAMERA_APIS_JSON_CONFIG" {
  default = ""
}


variable "BO_API_DB_CONNECTION_LIMIT" {
  default = ""
}


variable "BO_API_DB_LOGS" {
  default = ""
}


variable "BO_API_DOMAIN" {
  default = ""
}


variable "BO_API_JWT_SECRET" {
  default = ""
}


variable "CA_MAX_REQUEST_RATE" {
  default = ""
}


variable "CLIENT_IO_HAPROXY_URL" {
  default = ""
}


variable "CSN_LOGIN_WAIT_TIMEOUT" {
  default = ""
}


variable "CSN_MESSAGES_PER_SECOND_RATE" {
  default = ""
}


variable "CSN_PLAYER_TO_CORE_QUEUE" {
  default = ""
}


variable "CSN_SOCKET_PORT" {
  default = ""
}

variable "DB_AUDIT_NAME" {
  default = ""
}


variable "DB_AUDIT_PORT" {
  default = ""
}


variable "DB_AUDIT_PSW" {
  default = ""
}


variable "DB_AUDIT_USER" {
  default = ""
}

variable "DB_MASTER_NAME" {
  default = ""
}


variable "DB_MASTER_PORT" {
  default = ""
}


variable "DB_MASTER_PSW" {
  default = ""
}


variable "DB_MASTER_USER" {
  default = ""
}


variable "DB_MAX_QUERY_EXECUTION_TIME" {
  default = ""
}


variable "DB_RETRY_ATTEMPTS" {
  default = ""
}


variable "DB_SLAVE_NAME" {
  default = ""
}


variable "DB_SLAVE_PORT" {
  default = ""
}


variable "DB_SLAVE_PSW" {
  default = ""
}


variable "DB_SLAVE_USER" {
  default = ""
}


variable "EXTERNAL_REDIS_HOST" {
  default = ""
}


variable "GAME_CORE_API_HOST" {
  default = ""
}


variable "GAME_CORE_API_PORT" {
  default = ""
}


variable "GCA_CAMERA_API_PASSWORD" {
  default = ""
}


variable "GCA_CAMERA_API_URL" {
  default = ""
}


variable "GCA_CAMERA_API_USER" {
  default = ""
}


variable "GCA_CLIENT_IO_HAPROXY_URL" {
  default = ""
}


variable "GCA_DB_CONNECTION_LIMIT" {
  default = ""
}


variable "GCA_DB_LOGS" {
  default = ""
}


variable "GCA_OPERATOR_SERVICE_API_URL" {
  default = ""
}


variable "GCA_ROBOTS_AUTH_SECRET" {
  default = ""
}


variable "GCW_API_DB_CONNECTION_LIMIT" {
  default = ""
}


variable "GCW_API_DB_LOGS" {
  default = ""
}


variable "GCW_ROBOTS_PING_TIMEOUT_SEC" {
  default = ""
}


variable "GC_CURRENCY_WHITELIST" {
  default = ""
}

variable "MONITORING_API_HOST" {
  default = ""
}


variable "MONITORING_API_PORT" {
  default = ""
}


variable "MONITORING_WORKER_DB_CONNECTION_LIMIT" {
  default = ""
}


variable "M_API_DB_CONNECTION_LIMIT" {
  default = ""
}


variable "M_API_DB_LOGS" {
  default = ""
}


variable "OP_ACTIVE_OPERATORS" {
  default = ""
}


variable "OP_TEST_OPERATOR2_API_BASE_URL" {
  default = ""
}


variable "OP_TEST_OPERATOR2_API_KEY" {
  default = ""
}


variable "OP_TEST_OPERATOR_API_BASE_URL" {
  default = ""
}


variable "OP_TEST_OPERATOR_API_KEY" {
  default = ""
}

variable "REDIS_PORT" {
  default = ""
}


variable "RNG_HOST" {
  default = ""
}


variable "RNG_PORT" {
  default = ""
}


variable "ROBOT_OFFLINE_DURATION_THRESHOLD_SEC" {
  default = ""
}


variable "STREAM_AUTH_SECRET" {
  default = ""
}


variable "STREAM_AUTH_TEST_TOKEN_BAD" {
  default = ""
}


variable "STREAM_AUTH_TEST_TOKEN_OK" {
  default = ""
}

variable "CLIENT_FE_BASE_URL" {
  default = ""
}

variable "EXTERNAL_RABBITMQ_HOST" {
  default = ""
}
