resource "google_secret_manager_secret" "BLUE_RIBBON_API_URL" {
  secret_id = "BLUE_RIBBON_API_URL"

  labels = {
    label = "blue_ribbon_api_url"
  }

  replication {
    user_managed {
      replicas {
        location = var.region
      }
    }
  }
}
resource "google_secret_manager_secret_version" "secret-BLUE_RIBBON_API_URL" {
  secret = google_secret_manager_secret.BLUE_RIBBON_API_URL.id
  secret_data = var.BLUE_RIBBON_API_URL
}


resource "google_secret_manager_secret" "BLUE_RIBBON_AUTHENTICATION_KEY" {
  secret_id = "BLUE_RIBBON_AUTHENTICATION_KEY"

  labels = {
    label = "blue_ribbon_authentication_key"
  }

  replication {
    user_managed {
      replicas {
        location = var.region
      }
    }
  }
}
resource "google_secret_manager_secret_version" "secret-BLUE_RIBBON_AUTHENTICATION_KEY" {
  secret = google_secret_manager_secret.BLUE_RIBBON_AUTHENTICATION_KEY.id
  secret_data = var.BLUE_RIBBON_AUTHENTICATION_KEY
}


resource "google_secret_manager_secret" "BLUE_RIBBON_AUTHENTICATION_SECRET" {
  secret_id = "BLUE_RIBBON_AUTHENTICATION_SECRET"

  labels = {
    label = "blue_ribbon_authentication_secret"
  }

  replication {
    user_managed {
      replicas {
        location = var.region
      }
    }
  }
}
resource "google_secret_manager_secret_version" "secret-BLUE_RIBBON_AUTHENTICATION_SECRET" {
  secret = google_secret_manager_secret.BLUE_RIBBON_AUTHENTICATION_SECRET.id
  secret_data = var.BLUE_RIBBON_AUTHENTICATION_SECRET
}


resource "google_secret_manager_secret" "BO_API_CAMERA_APIS_JSON_CONFIG" {
  secret_id = "BO_API_CAMERA_APIS_JSON_CONFIG"

  labels = {
    label = "bo_api_camera_apis_json_config"
  }

  replication {
    user_managed {
      replicas {
        location = var.region
      }
    }
  }
}
resource "google_secret_manager_secret_version" "secret-BO_API_CAMERA_APIS_JSON_CONFIG" {
  secret = google_secret_manager_secret.BO_API_CAMERA_APIS_JSON_CONFIG.id
  secret_data = var.BO_API_CAMERA_APIS_JSON_CONFIG
}


resource "google_secret_manager_secret" "BO_API_DB_CONNECTION_LIMIT" {
  secret_id = "BO_API_DB_CONNECTION_LIMIT"

  labels = {
    label = "bo_api_db_connection_limit"
  }

  replication {
    user_managed {
      replicas {
        location = var.region
      }
    }
  }
}
resource "google_secret_manager_secret_version" "secret-BO_API_DB_CONNECTION_LIMIT" {
  secret = google_secret_manager_secret.BO_API_DB_CONNECTION_LIMIT.id
  secret_data = var.BO_API_DB_CONNECTION_LIMIT
}


resource "google_secret_manager_secret" "BO_API_DB_LOGS" {
  secret_id = "BO_API_DB_LOGS"

  labels = {
    label = "bo_api_db_logs"
  }

  replication {
    user_managed {
      replicas {
        location = var.region
      }
    }
  }
}
resource "google_secret_manager_secret_version" "secret-BO_API_DB_LOGS" {
  secret = google_secret_manager_secret.BO_API_DB_LOGS.id
  secret_data = var.BO_API_DB_LOGS
}


resource "google_secret_manager_secret" "BO_API_DOMAIN" {
  secret_id = "BO_API_DOMAIN"

  labels = {
    label = "bo_api_domain"
  }

  replication {
    user_managed {
      replicas {
        location = var.region
      }
    }
  }
}
resource "google_secret_manager_secret_version" "secret-BO_API_DOMAIN" {
  secret = google_secret_manager_secret.BO_API_DOMAIN.id
  secret_data = var.BO_API_DOMAIN
}


resource "google_secret_manager_secret" "BO_API_JWT_SECRET" {
  secret_id = "BO_API_JWT_SECRET"

  labels = {
    label = "bo_api_jwt_secret"
  }

  replication {
    user_managed {
      replicas {
        location = var.region
      }
    }
  }
}
resource "google_secret_manager_secret_version" "secret-BO_API_JWT_SECRET" {
  secret = google_secret_manager_secret.BO_API_JWT_SECRET.id
  secret_data = var.BO_API_JWT_SECRET
}


resource "google_secret_manager_secret" "CA_MAX_REQUEST_RATE" {
  secret_id = "CA_MAX_REQUEST_RATE"

  labels = {
    label = "ca_max_request_rate"
  }

  replication {
    user_managed {
      replicas {
        location = var.region
      }
    }
  }
}
resource "google_secret_manager_secret_version" "secret-CA_MAX_REQUEST_RATE" {
  secret = google_secret_manager_secret.CA_MAX_REQUEST_RATE.id
  secret_data = var.CA_MAX_REQUEST_RATE
}


resource "google_secret_manager_secret" "CLIENT_IO_HAPROXY_URL" {
  secret_id = "CLIENT_IO_HAPROXY_URL"

  labels = {
    label = "client_io_haproxy_url"
  }

  replication {
    user_managed {
      replicas {
        location = var.region
      }
    }
  }
}
resource "google_secret_manager_secret_version" "secret-CLIENT_IO_HAPROXY_URL" {
  secret = google_secret_manager_secret.CLIENT_IO_HAPROXY_URL.id
  secret_data = var.CLIENT_IO_HAPROXY_URL
}


resource "google_secret_manager_secret" "CSN_LOGIN_WAIT_TIMEOUT" {
  secret_id = "CSN_LOGIN_WAIT_TIMEOUT"

  labels = {
    label = "csn_login_wait_timeout"
  }

  replication {
    user_managed {
      replicas {
        location = var.region
      }
    }
  }
}
resource "google_secret_manager_secret_version" "secret-CSN_LOGIN_WAIT_TIMEOUT" {
  secret = google_secret_manager_secret.CSN_LOGIN_WAIT_TIMEOUT.id
  secret_data = var.CSN_LOGIN_WAIT_TIMEOUT
}


resource "google_secret_manager_secret" "CSN_MESSAGES_PER_SECOND_RATE" {
  secret_id = "CSN_MESSAGES_PER_SECOND_RATE"

  labels = {
    label = "csn_messages_per_second_rate"
  }

  replication {
    user_managed {
      replicas {
        location = var.region
      }
    }
  }
}
resource "google_secret_manager_secret_version" "secret-CSN_MESSAGES_PER_SECOND_RATE" {
  secret = google_secret_manager_secret.CSN_MESSAGES_PER_SECOND_RATE.id
  secret_data = var.CSN_MESSAGES_PER_SECOND_RATE
}


resource "google_secret_manager_secret" "CSN_PLAYER_TO_CORE_QUEUE" {
  secret_id = "CSN_PLAYER_TO_CORE_QUEUE"

  labels = {
    label = "csn_player_to_core_queue"
  }

  replication {
    user_managed {
      replicas {
        location = var.region
      }
    }
  }
}
resource "google_secret_manager_secret_version" "secret-CSN_PLAYER_TO_CORE_QUEUE" {
  secret = google_secret_manager_secret.CSN_PLAYER_TO_CORE_QUEUE.id
  secret_data = var.CSN_PLAYER_TO_CORE_QUEUE
}


resource "google_secret_manager_secret" "CSN_SOCKET_PORT" {
  secret_id = "CSN_SOCKET_PORT"

  labels = {
    label = "csn_socket_port"
  }

  replication {
    user_managed {
      replicas {
        location = var.region
      }
    }
  }
}
resource "google_secret_manager_secret_version" "secret-CSN_SOCKET_PORT" {
  secret = google_secret_manager_secret.CSN_SOCKET_PORT.id
  secret_data = var.CSN_SOCKET_PORT
}


resource "google_secret_manager_secret" "DB_AUDIT_HOST" {
  secret_id = "DB_AUDIT_HOST"

  labels = {
    label = "db_audit_host"
  }

  replication {
    user_managed {
      replicas {
        location = var.region
      }
    }
  }
}
resource "google_secret_manager_secret_version" "secret-DB_AUDIT_HOST" {
  secret = google_secret_manager_secret.DB_AUDIT_HOST.id
  secret_data = google_compute_address.static-db.address
}


resource "google_secret_manager_secret" "DB_AUDIT_NAME" {
  secret_id = "DB_AUDIT_NAME"

  labels = {
    label = "db_audit_name"
  }

  replication {
    user_managed {
      replicas {
        location = var.region
      }
    }
  }
}
resource "google_secret_manager_secret_version" "secret-DB_AUDIT_NAME" {
  secret = google_secret_manager_secret.DB_AUDIT_NAME.id
  secret_data = var.DB_AUDIT_NAME
}


resource "google_secret_manager_secret" "DB_AUDIT_PORT" {
  secret_id = "DB_AUDIT_PORT"

  labels = {
    label = "db_audit_port"
  }

  replication {
    user_managed {
      replicas {
        location = var.region
      }
    }
  }
}
resource "google_secret_manager_secret_version" "secret-DB_AUDIT_PORT" {
  secret = google_secret_manager_secret.DB_AUDIT_PORT.id
  secret_data = var.DB_AUDIT_PORT
}


resource "google_secret_manager_secret" "DB_AUDIT_PSW" {
  secret_id = "DB_AUDIT_PSW"

  labels = {
    label = "db_audit_psw"
  }

  replication {
    user_managed {
      replicas {
        location = var.region
      }
    }
  }
}
resource "google_secret_manager_secret_version" "secret-DB_AUDIT_PSW" {
  secret = google_secret_manager_secret.DB_AUDIT_PSW.id
  secret_data = var.DB_AUDIT_PSW
}


resource "google_secret_manager_secret" "DB_AUDIT_USER" {
  secret_id = "DB_AUDIT_USER"

  labels = {
    label = "db_audit_user"
  }

  replication {
    user_managed {
      replicas {
        location = var.region
      }
    }
  }
}
resource "google_secret_manager_secret_version" "secret-DB_AUDIT_USER" {
  secret = google_secret_manager_secret.DB_AUDIT_USER.id
  secret_data = var.DB_AUDIT_USER
}


resource "google_secret_manager_secret" "DB_MASTER_HOST" {
  secret_id = "DB_MASTER_HOST"

  labels = {
    label = "db_master_host"
  }

  replication {
    user_managed {
      replicas {
        location = var.region
      }
    }
  }
}
resource "google_secret_manager_secret_version" "secret-DB_MASTER_HOST" {
  secret = google_secret_manager_secret.DB_MASTER_HOST.id
  secret_data = google_compute_address.static-db.address
}


resource "google_secret_manager_secret" "DB_MASTER_NAME" {
  secret_id = "DB_MASTER_NAME"

  labels = {
    label = "db_master_name"
  }

  replication {
    user_managed {
      replicas {
        location = var.region
      }
    }
  }
}
resource "google_secret_manager_secret_version" "secret-DB_MASTER_NAME" {
  secret = google_secret_manager_secret.DB_MASTER_NAME.id
  secret_data = var.DB_MASTER_NAME
}


resource "google_secret_manager_secret" "DB_MASTER_PORT" {
  secret_id = "DB_MASTER_PORT"

  labels = {
    label = "db_master_port"
  }

  replication {
    user_managed {
      replicas {
        location = var.region
      }
    }
  }
}
resource "google_secret_manager_secret_version" "secret-DB_MASTER_PORT" {
  secret = google_secret_manager_secret.DB_MASTER_PORT.id
  secret_data = var.DB_MASTER_PORT
}


resource "google_secret_manager_secret" "DB_MASTER_PSW" {
  secret_id = "DB_MASTER_PSW"

  labels = {
    label = "db_master_psw"
  }

  replication {
    user_managed {
      replicas {
        location = var.region
      }
    }
  }
}
resource "google_secret_manager_secret_version" "secret-DB_MASTER_PSW" {
  secret = google_secret_manager_secret.DB_MASTER_PSW.id
  secret_data = var.DB_MASTER_PSW
}


resource "google_secret_manager_secret" "DB_MASTER_USER" {
  secret_id = "DB_MASTER_USER"

  labels = {
    label = "db_master_user"
  }

  replication {
    user_managed {
      replicas {
        location = var.region
      }
    }
  }
}
resource "google_secret_manager_secret_version" "secret-DB_MASTER_USER" {
  secret = google_secret_manager_secret.DB_MASTER_USER.id
  secret_data = var.DB_MASTER_USER
}


resource "google_secret_manager_secret" "DB_MAX_QUERY_EXECUTION_TIME" {
  secret_id = "DB_MAX_QUERY_EXECUTION_TIME"

  labels = {
    label = "db_max_query_execution_time"
  }

  replication {
    user_managed {
      replicas {
        location = var.region
      }
    }
  }
}
resource "google_secret_manager_secret_version" "secret-DB_MAX_QUERY_EXECUTION_TIME" {
  secret = google_secret_manager_secret.DB_MAX_QUERY_EXECUTION_TIME.id
  secret_data = var.DB_MAX_QUERY_EXECUTION_TIME
}


resource "google_secret_manager_secret" "DB_RETRY_ATTEMPTS" {
  secret_id = "DB_RETRY_ATTEMPTS"

  labels = {
    label = "db_retry_attempts"
  }

  replication {
    user_managed {
      replicas {
        location = var.region
      }
    }
  }
}
resource "google_secret_manager_secret_version" "secret-DB_RETRY_ATTEMPTS" {
  secret = google_secret_manager_secret.DB_RETRY_ATTEMPTS.id
  secret_data = var.DB_RETRY_ATTEMPTS
}


resource "google_secret_manager_secret" "DB_SLAVE_HOST" {
  secret_id = "DB_SLAVE_HOST"

  labels = {
    label = "db_slave_host"
  }

  replication {
    user_managed {
      replicas {
        location = var.region
      }
    }
  }
}
resource "google_secret_manager_secret_version" "secret-DB_SLAVE_HOST" {
  secret = google_secret_manager_secret.DB_SLAVE_HOST.id
  secret_data = google_compute_instance.vm-slave.network_interface.0.network_ip
}


resource "google_secret_manager_secret" "DB_SLAVE_NAME" {
  secret_id = "DB_SLAVE_NAME"

  labels = {
    label = "db_slave_name"
  }

  replication {
    user_managed {
      replicas {
        location = var.region
      }
    }
  }
}
resource "google_secret_manager_secret_version" "secret-DB_SLAVE_NAME" {
  secret = google_secret_manager_secret.DB_SLAVE_NAME.id
  secret_data = var.DB_SLAVE_NAME
}


resource "google_secret_manager_secret" "DB_SLAVE_PORT" {
  secret_id = "DB_SLAVE_PORT"

  labels = {
    label = "db_slave_port"
  }

  replication {
    user_managed {
      replicas {
        location = var.region
      }
    }
  }
}
resource "google_secret_manager_secret_version" "secret-DB_SLAVE_PORT" {
  secret = google_secret_manager_secret.DB_SLAVE_PORT.id
  secret_data = var.DB_SLAVE_PORT
}


resource "google_secret_manager_secret" "DB_SLAVE_PSW" {
  secret_id = "DB_SLAVE_PSW"

  labels = {
    label = "db_slave_psw"
  }

  replication {
    user_managed {
      replicas {
        location = var.region
      }
    }
  }
}
resource "google_secret_manager_secret_version" "secret-DB_SLAVE_PSW" {
  secret = google_secret_manager_secret.DB_SLAVE_PSW.id
  secret_data = var.DB_SLAVE_PSW
}


resource "google_secret_manager_secret" "DB_SLAVE_USER" {
  secret_id = "DB_SLAVE_USER"

  labels = {
    label = "db_slave_user"
  }

  replication {
    user_managed {
      replicas {
        location = var.region
      }
    }
  }
}
resource "google_secret_manager_secret_version" "secret-DB_SLAVE_USER" {
  secret = google_secret_manager_secret.DB_SLAVE_USER.id
  secret_data = var.DB_SLAVE_USER
}


resource "google_secret_manager_secret" "EXTERNAL_RABBITMQ_HOST" {
  secret_id = "EXTERNAL_RABBITMQ_HOST"

  labels = {
    label = "external_rabbitmq_host"
  }

  replication {
    user_managed {
      replicas {
        location = var.region
      }
    }
  }
}
resource "google_secret_manager_secret_version" "secret-EXTERNAL_RABBITMQ_HOST" {
  secret = google_secret_manager_secret.EXTERNAL_RABBITMQ_HOST.id
  secret_data = var.EXTERNAL_RABBITMQ_HOST
}


resource "google_secret_manager_secret" "EXTERNAL_REDIS_HOST" {
  secret_id = "EXTERNAL_REDIS_HOST"

  labels = {
    label = "external_redis_host"
  }

  replication {
    user_managed {
      replicas {
        location = var.region
      }
    }
  }
}
resource "google_secret_manager_secret_version" "secret-EXTERNAL_REDIS_HOST" {
  secret = google_secret_manager_secret.EXTERNAL_REDIS_HOST.id
  secret_data = var.EXTERNAL_REDIS_HOST
}


resource "google_secret_manager_secret" "GAME_CORE_API_HOST" {
  secret_id = "GAME_CORE_API_HOST"

  labels = {
    label = "game_core_api_host"
  }

  replication {
    user_managed {
      replicas {
        location = var.region
      }
    }
  }
}
resource "google_secret_manager_secret_version" "secret-GAME_CORE_API_HOST" {
  secret = google_secret_manager_secret.GAME_CORE_API_HOST.id
  secret_data = var.GAME_CORE_API_HOST
}


resource "google_secret_manager_secret" "GAME_CORE_API_PORT" {
  secret_id = "GAME_CORE_API_PORT"

  labels = {
    label = "game_core_api_port"
  }

  replication {
    user_managed {
      replicas {
        location = var.region
      }
    }
  }
}
resource "google_secret_manager_secret_version" "secret-GAME_CORE_API_PORT" {
  secret = google_secret_manager_secret.GAME_CORE_API_PORT.id
  secret_data = var.GAME_CORE_API_PORT
}


resource "google_secret_manager_secret" "GCA_CAMERA_API_PASSWORD" {
  secret_id = "GCA_CAMERA_API_PASSWORD"

  labels = {
    label = "gca_camera_api_password"
  }

  replication {
    user_managed {
      replicas {
        location = var.region
      }
    }
  }
}
resource "google_secret_manager_secret_version" "secret-GCA_CAMERA_API_PASSWORD" {
  secret = google_secret_manager_secret.GCA_CAMERA_API_PASSWORD.id
  secret_data = var.GCA_CAMERA_API_PASSWORD
}


resource "google_secret_manager_secret" "GCA_CAMERA_API_URL" {
  secret_id = "GCA_CAMERA_API_URL"

  labels = {
    label = "gca_camera_api_url"
  }

  replication {
    user_managed {
      replicas {
        location = var.region
      }
    }
  }
}
resource "google_secret_manager_secret_version" "secret-GCA_CAMERA_API_URL" {
  secret = google_secret_manager_secret.GCA_CAMERA_API_URL.id
  secret_data = var.GCA_CAMERA_API_URL
}


resource "google_secret_manager_secret" "GCA_CAMERA_API_USER" {
  secret_id = "GCA_CAMERA_API_USER"

  labels = {
    label = "gca_camera_api_user"
  }

  replication {
    user_managed {
      replicas {
        location = var.region
      }
    }
  }
}
resource "google_secret_manager_secret_version" "secret-GCA_CAMERA_API_USER" {
  secret = google_secret_manager_secret.GCA_CAMERA_API_USER.id
  secret_data = var.GCA_CAMERA_API_USER
}


resource "google_secret_manager_secret" "GCA_CLIENT_IO_HAPROXY_URL" {
  secret_id = "GCA_CLIENT_IO_HAPROXY_URL"

  labels = {
    label = "gca_client_io_haproxy_url"
  }

  replication {
    user_managed {
      replicas {
        location = var.region
      }
    }
  }
}
resource "google_secret_manager_secret_version" "secret-GCA_CLIENT_IO_HAPROXY_URL" {
  secret = google_secret_manager_secret.GCA_CLIENT_IO_HAPROXY_URL.id
  secret_data = var.GCA_CLIENT_IO_HAPROXY_URL
}


resource "google_secret_manager_secret" "GCA_DB_CONNECTION_LIMIT" {
  secret_id = "GCA_DB_CONNECTION_LIMIT"

  labels = {
    label = "gca_db_connection_limit"
  }

  replication {
    user_managed {
      replicas {
        location = var.region
      }
    }
  }
}
resource "google_secret_manager_secret_version" "secret-GCA_DB_CONNECTION_LIMIT" {
  secret = google_secret_manager_secret.GCA_DB_CONNECTION_LIMIT.id
  secret_data = var.GCA_DB_CONNECTION_LIMIT
}


resource "google_secret_manager_secret" "GCA_DB_LOGS" {
  secret_id = "GCA_DB_LOGS"

  labels = {
    label = "gca_db_logs"
  }

  replication {
    user_managed {
      replicas {
        location = var.region
      }
    }
  }
}
resource "google_secret_manager_secret_version" "secret-GCA_DB_LOGS" {
  secret = google_secret_manager_secret.GCA_DB_LOGS.id
  secret_data = var.GCA_DB_LOGS
}


resource "google_secret_manager_secret" "GCA_OPERATOR_SERVICE_API_URL" {
  secret_id = "GCA_OPERATOR_SERVICE_API_URL"

  labels = {
    label = "gca_operator_service_api_url"
  }

  replication {
    user_managed {
      replicas {
        location = var.region
      }
    }
  }
}
resource "google_secret_manager_secret_version" "secret-GCA_OPERATOR_SERVICE_API_URL" {
  secret = google_secret_manager_secret.GCA_OPERATOR_SERVICE_API_URL.id
  secret_data = var.GCA_OPERATOR_SERVICE_API_URL
}


resource "google_secret_manager_secret" "GCA_ROBOTS_AUTH_SECRET" {
  secret_id = "GCA_ROBOTS_AUTH_SECRET"

  labels = {
    label = "gca_robots_auth_secret"
  }

  replication {
    user_managed {
      replicas {
        location = var.region
      }
    }
  }
}
resource "google_secret_manager_secret_version" "secret-GCA_ROBOTS_AUTH_SECRET" {
  secret = google_secret_manager_secret.GCA_ROBOTS_AUTH_SECRET.id
  secret_data = var.GCA_ROBOTS_AUTH_SECRET
}


resource "google_secret_manager_secret" "GCW_API_DB_CONNECTION_LIMIT" {
  secret_id = "GCW_API_DB_CONNECTION_LIMIT"

  labels = {
    label = "gcw_api_db_connection_limit"
  }

  replication {
    user_managed {
      replicas {
        location = var.region
      }
    }
  }
}
resource "google_secret_manager_secret_version" "secret-GCW_API_DB_CONNECTION_LIMIT" {
  secret = google_secret_manager_secret.GCW_API_DB_CONNECTION_LIMIT.id
  secret_data = var.GCW_API_DB_CONNECTION_LIMIT
}


resource "google_secret_manager_secret" "GCW_API_DB_LOGS" {
  secret_id = "GCW_API_DB_LOGS"

  labels = {
    label = "gcw_api_db_logs"
  }

  replication {
    user_managed {
      replicas {
        location = var.region
      }
    }
  }
}
resource "google_secret_manager_secret_version" "secret-GCW_API_DB_LOGS" {
  secret = google_secret_manager_secret.GCW_API_DB_LOGS.id
  secret_data = var.GCW_API_DB_LOGS
}


resource "google_secret_manager_secret" "GCW_ROBOTS_PING_TIMEOUT_SEC" {
  secret_id = "GCW_ROBOTS_PING_TIMEOUT_SEC"

  labels = {
    label = "gcw_robots_ping_timeout_sec"
  }

  replication {
    user_managed {
      replicas {
        location = var.region
      }
    }
  }
}
resource "google_secret_manager_secret_version" "secret-GCW_ROBOTS_PING_TIMEOUT_SEC" {
  secret = google_secret_manager_secret.GCW_ROBOTS_PING_TIMEOUT_SEC.id
  secret_data = var.GCW_ROBOTS_PING_TIMEOUT_SEC
}


resource "google_secret_manager_secret" "GC_CURRENCY_WHITELIST" {
  secret_id = "GC_CURRENCY_WHITELIST"

  labels = {
    label = "gc_currency_whitelist"
  }

  replication {
    user_managed {
      replicas {
        location = var.region
      }
    }
  }
}
resource "google_secret_manager_secret_version" "secret-GC_CURRENCY_WHITELIST" {
  secret = google_secret_manager_secret.GC_CURRENCY_WHITELIST.id
  secret_data = var.GC_CURRENCY_WHITELIST
}


resource "google_secret_manager_secret" "MONGODB_URI" {
  secret_id = "MONGODB_URI"

  labels = {
    label = "mongodb_uri"
  }

  replication {
    user_managed {
      replicas {
        location = var.region
      }
    }
  }
}
resource "google_secret_manager_secret_version" "secret-MONGODB_URI" {
  secret = google_secret_manager_secret.MONGODB_URI.id
  secret_data = "mongodb://${var.mongo_user}:${var.mongo_password}@${google_compute_instance.vm-mongo.network_interface.0.network_ip}:27017/${var.mongo_db}?authSource=admin"

}


resource "google_secret_manager_secret" "MONITORING_API_HOST" {
  secret_id = "MONITORING_API_HOST"

  labels = {
    label = "monitoring_api_host"
  }

  replication {
    user_managed {
      replicas {
        location = var.region
      }
    }
  }
}
resource "google_secret_manager_secret_version" "secret-MONITORING_API_HOST" {
  secret = google_secret_manager_secret.MONITORING_API_HOST.id
  secret_data = var.MONITORING_API_HOST
}


resource "google_secret_manager_secret" "MONITORING_API_PORT" {
  secret_id = "MONITORING_API_PORT"

  labels = {
    label = "monitoring_api_port"
  }

  replication {
    user_managed {
      replicas {
        location = var.region
      }
    }
  }
}
resource "google_secret_manager_secret_version" "secret-MONITORING_API_PORT" {
  secret = google_secret_manager_secret.MONITORING_API_PORT.id
  secret_data = var.MONITORING_API_PORT
}


resource "google_secret_manager_secret" "MONITORING_WORKER_DB_CONNECTION_LIMIT" {
  secret_id = "MONITORING_WORKER_DB_CONNECTION_LIMIT"

  labels = {
    label = "monitoring_worker_db_connection_limit"
  }

  replication {
    user_managed {
      replicas {
        location = var.region
      }
    }
  }
}
resource "google_secret_manager_secret_version" "secret-MONITORING_WORKER_DB_CONNECTION_LIMIT" {
  secret = google_secret_manager_secret.MONITORING_WORKER_DB_CONNECTION_LIMIT.id
  secret_data = var.MONITORING_WORKER_DB_CONNECTION_LIMIT
}


resource "google_secret_manager_secret" "M_API_DB_CONNECTION_LIMIT" {
  secret_id = "M_API_DB_CONNECTION_LIMIT"

  labels = {
    label = "m_api_db_connection_limit"
  }

  replication {
    user_managed {
      replicas {
        location = var.region
      }
    }
  }
}
resource "google_secret_manager_secret_version" "secret-M_API_DB_CONNECTION_LIMIT" {
  secret = google_secret_manager_secret.M_API_DB_CONNECTION_LIMIT.id
  secret_data = var.M_API_DB_CONNECTION_LIMIT
}


resource "google_secret_manager_secret" "M_API_DB_LOGS" {
  secret_id = "M_API_DB_LOGS"

  labels = {
    label = "m_api_db_logs"
  }

  replication {
    user_managed {
      replicas {
        location = var.region
      }
    }
  }
}
resource "google_secret_manager_secret_version" "secret-M_API_DB_LOGS" {
  secret = google_secret_manager_secret.M_API_DB_LOGS.id
  secret_data = var.M_API_DB_LOGS
}


resource "google_secret_manager_secret" "OP_ACTIVE_OPERATORS" {
  secret_id = "OP_ACTIVE_OPERATORS"

  labels = {
    label = "op_active_operators"
  }

  replication {
    user_managed {
      replicas {
        location = var.region
      }
    }
  }
}
resource "google_secret_manager_secret_version" "secret-OP_ACTIVE_OPERATORS" {
  secret = google_secret_manager_secret.OP_ACTIVE_OPERATORS.id
  secret_data = var.OP_ACTIVE_OPERATORS
}


resource "google_secret_manager_secret" "OP_TEST_OPERATOR2_API_BASE_URL" {
  secret_id = "OP_TEST_OPERATOR2_API_BASE_URL"

  labels = {
    label = "op_test_operator2_api_base_url"
  }

  replication {
    user_managed {
      replicas {
        location = var.region
      }
    }
  }
}
resource "google_secret_manager_secret_version" "secret-OP_TEST_OPERATOR2_API_BASE_URL" {
  secret = google_secret_manager_secret.OP_TEST_OPERATOR2_API_BASE_URL.id
  secret_data = var.OP_TEST_OPERATOR2_API_BASE_URL
}


resource "google_secret_manager_secret" "OP_TEST_OPERATOR2_API_KEY" {
  secret_id = "OP_TEST_OPERATOR2_API_KEY"

  labels = {
    label = "op_test_operator2_api_key"
  }

  replication {
    user_managed {
      replicas {
        location = var.region
      }
    }
  }
}
resource "google_secret_manager_secret_version" "secret-OP_TEST_OPERATOR2_API_KEY" {
  secret = google_secret_manager_secret.OP_TEST_OPERATOR2_API_KEY.id
  secret_data = var.OP_TEST_OPERATOR2_API_KEY
}


resource "google_secret_manager_secret" "OP_TEST_OPERATOR_API_BASE_URL" {
  secret_id = "OP_TEST_OPERATOR_API_BASE_URL"

  labels = {
    label = "op_test_operator_api_base_url"
  }

  replication {
    user_managed {
      replicas {
        location = var.region
      }
    }
  }
}
resource "google_secret_manager_secret_version" "secret-OP_TEST_OPERATOR_API_BASE_URL" {
  secret = google_secret_manager_secret.OP_TEST_OPERATOR_API_BASE_URL.id
  secret_data = var.OP_TEST_OPERATOR_API_BASE_URL
}


resource "google_secret_manager_secret" "OP_TEST_OPERATOR_API_KEY" {
  secret_id = "OP_TEST_OPERATOR_API_KEY"

  labels = {
    label = "op_test_operator_api_key"
  }

  replication {
    user_managed {
      replicas {
        location = var.region
      }
    }
  }
}
resource "google_secret_manager_secret_version" "secret-OP_TEST_OPERATOR_API_KEY" {
  secret = google_secret_manager_secret.OP_TEST_OPERATOR_API_KEY.id
  secret_data = var.OP_TEST_OPERATOR_API_KEY
}


resource "google_secret_manager_secret" "RABBITMQ_HOST" {
  secret_id = "RABBITMQ_HOST"

  labels = {
    label = "rabbitmq_host"
  }

  replication {
    user_managed {
      replicas {
        location = var.region
      }
    }
  }
}
resource "google_secret_manager_secret_version" "secret-RABBITMQ_HOST" {
  secret = google_secret_manager_secret.RABBITMQ_HOST.id
  secret_data = google_compute_instance.vm-rabbitmq.network_interface.0.network_ip
}


resource "google_secret_manager_secret" "RABBITMQ_PASSWORD" {
  secret_id = "RABBITMQ_PASSWORD"

  labels = {
    label = "rabbitmq_password"
  }

  replication {
    user_managed {
      replicas {
        location = var.region
      }
    }
  }
}
resource "google_secret_manager_secret_version" "secret-RABBITMQ_PASSWORD" {
  secret = google_secret_manager_secret.RABBITMQ_PASSWORD.id
  secret_data = var.rabbitmq_password
}


resource "google_secret_manager_secret" "RABBITMQ_USERNAME" {
  secret_id = "RABBITMQ_USERNAME"

  labels = {
    label = "rabbitmq_username"
  }

  replication {
    user_managed {
      replicas {
        location = var.region
      }
    }
  }
}
resource "google_secret_manager_secret_version" "secret-RABBITMQ_USERNAME" {
  secret = google_secret_manager_secret.RABBITMQ_USERNAME.id
  secret_data = var.rabbitmq_user
}


resource "google_secret_manager_secret" "REDIS_HOST" {
  secret_id = "REDIS_HOST"

  labels = {
    label = "redis_host"
  }

  replication {
    user_managed {
      replicas {
        location = var.region
      }
    }
  }
}
resource "google_secret_manager_secret_version" "secret-REDIS_HOST" {
  secret = google_secret_manager_secret.REDIS_HOST.id
  secret_data = google_compute_instance.vm-redis.network_interface.0.network_ip
}


resource "google_secret_manager_secret" "REDIS_PORT" {
  secret_id = "REDIS_PORT"

  labels = {
    label = "redis_port"
  }

  replication {
    user_managed {
      replicas {
        location = var.region
      }
    }
  }
}
resource "google_secret_manager_secret_version" "secret-REDIS_PORT" {
  secret = google_secret_manager_secret.REDIS_PORT.id
  secret_data = var.REDIS_PORT
}


resource "google_secret_manager_secret" "RNG_HOST" {
  secret_id = "RNG_HOST"

  labels = {
    label = "rng_host"
  }

  replication {
    user_managed {
      replicas {
        location = var.region
      }
    }
  }
}
resource "google_secret_manager_secret_version" "secret-RNG_HOST" {
  secret = google_secret_manager_secret.RNG_HOST.id
  secret_data = var.RNG_HOST
}


resource "google_secret_manager_secret" "RNG_PORT" {
  secret_id = "RNG_PORT"

  labels = {
    label = "rng_port"
  }

  replication {
    user_managed {
      replicas {
        location = var.region
      }
    }
  }
}
resource "google_secret_manager_secret_version" "secret-RNG_PORT" {
  secret = google_secret_manager_secret.RNG_PORT.id
  secret_data = var.RNG_PORT
}


resource "google_secret_manager_secret" "ROBOT_OFFLINE_DURATION_THRESHOLD_SEC" {
  secret_id = "ROBOT_OFFLINE_DURATION_THRESHOLD_SEC"

  labels = {
    label = "robot_offline_duration_threshold_sec"
  }

  replication {
    user_managed {
      replicas {
        location = var.region
      }
    }
  }
}
resource "google_secret_manager_secret_version" "secret-ROBOT_OFFLINE_DURATION_THRESHOLD_SEC" {
  secret = google_secret_manager_secret.ROBOT_OFFLINE_DURATION_THRESHOLD_SEC.id
  secret_data = var.ROBOT_OFFLINE_DURATION_THRESHOLD_SEC
}


resource "google_secret_manager_secret" "STREAM_AUTH_SECRET" {
  secret_id = "STREAM_AUTH_SECRET"

  labels = {
    label = "stream_auth_secret"
  }

  replication {
    user_managed {
      replicas {
        location = var.region
      }
    }
  }
}
resource "google_secret_manager_secret_version" "secret-STREAM_AUTH_SECRET" {
  secret = google_secret_manager_secret.STREAM_AUTH_SECRET.id
  secret_data = var.STREAM_AUTH_SECRET
}


resource "google_secret_manager_secret" "STREAM_AUTH_TEST_TOKEN_BAD" {
  secret_id = "STREAM_AUTH_TEST_TOKEN_BAD"

  labels = {
    label = "stream_auth_test_token_bad"
  }

  replication {
    user_managed {
      replicas {
        location = var.region
      }
    }
  }
}
resource "google_secret_manager_secret_version" "secret-STREAM_AUTH_TEST_TOKEN_BAD" {
  secret = google_secret_manager_secret.STREAM_AUTH_TEST_TOKEN_BAD.id
  secret_data = var.STREAM_AUTH_TEST_TOKEN_BAD
}


resource "google_secret_manager_secret" "STREAM_AUTH_TEST_TOKEN_OK" {
  secret_id = "STREAM_AUTH_TEST_TOKEN_OK"

  labels = {
    label = "stream_auth_test_token_ok"
  }

  replication {
    user_managed {
      replicas {
        location = var.region
      }
    }
  }
}
resource "google_secret_manager_secret_version" "secret-STREAM_AUTH_TEST_TOKEN_OK" {
  secret = google_secret_manager_secret.STREAM_AUTH_TEST_TOKEN_OK.id
  secret_data = var.STREAM_AUTH_TEST_TOKEN_OK
}

resource "google_secret_manager_secret" "CLIENT_FE_BASE_URL" {
  secret_id = "CLIENT_FE_BASE_URL"

  labels = {
    label = "client_fe_base_url"
  }

  replication {
    user_managed {
      replicas {
        location = var.region
      }
    }
  }
}
resource "google_secret_manager_secret_version" "secret-CLIENT_FE_BASE_URL" {
  secret = google_secret_manager_secret.CLIENT_FE_BASE_URL.id
  secret_data = var.CLIENT_FE_BASE_URL
}
