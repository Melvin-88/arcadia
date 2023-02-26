resource "google_cloudbuild_trigger" "migration-main" {

  name = "migration-main-staging"

  trigger_template {
    branch_name = var.branch_name
    repo_name   = var.repo_name
  }

  included_files = ["arcadia.dal/src/migrations/**"]

  substitutions = {
    _DB_HOST = ""
    _DB_NAME = ""
    _DB_PORT = "3306"
    _DB_PSW = ""
    _DB_USER = ""
  }

  filename = "arcadia.dal/cloudbuild-dev-main.yaml"
}

resource "google_cloudbuild_trigger" "migration-audit" {

  name = "migration-audit-staging"

  trigger_template {
    branch_name = var.branch_name
    repo_name   = var.repo_name
  }

  included_files = ["arcadia.dal/src/migrationsAudit/**"]

  substitutions = {
    _DB_AUDIT_NAME = ""
    _DB_HOST = ""
    _DB_NAME = ""
    _DB_PORT = "3306"
    _DB_PSW = ""
    _DB_USER = ""
  }

  filename = "arcadia.dal/cloudbuild-dev-audit.yaml"
}

resource "google_cloudbuild_trigger" "backoffice-api" {

  name = "backoffice-api-staging"

  trigger_template {
    branch_name = var.branch_name
    repo_name   = var.repo_name
  }

  included_files = ["arcadia.backoffice.api/**", "arcadia.dal/**"]

  substitutions = {
    _CLUSTER_NAME = google_container_cluster.primary.name
    _ZONE = var.region
    _ENV = "staging"
  }

  filename = "arcadia.backoffice.api/cloudbuild-stage.yaml"
}
resource "google_cloudbuild_trigger" "chip-distributor" {

  name = "chip-distributor-staging"

  trigger_template {
    branch_name = var.branch_name
    repo_name   = var.repo_name
  }

  included_files = ["arcadia.backoffice.api/**", "arcadia.dal/**"]

  substitutions = {
    _CLUSTER_NAME = google_container_cluster.primary.name
    _ZONE = var.region
    _ENV = "staging"
  }

  filename = "arcadia.backoffice.api/cloudbuild-cd-stage.yaml"
}
resource "google_cloudbuild_trigger" "backoffice-fe" {

  name = "backoffice-fe-staging"

  trigger_template {
    branch_name = var.branch_name
    repo_name   = var.repo_name
  }

  included_files = ["arcadia.backoffice.fe/**"]

  substitutions = {
    _API_HOST = "https://stage-bo-api.arcadiagaming.io"
    _CLUSTER_NAME = google_container_cluster.primary.name
    _ZONE = var.region
    _ENV = "staging"
  }

  filename = "arcadia.backoffice.fe/cloudbuild-stage.yaml"
}
resource "google_cloudbuild_trigger" "client-api" {

  name = "client-api-staging"

  trigger_template {
    branch_name = var.branch_name
    repo_name   = var.repo_name
  }

  included_files = ["arcadia.client.api/**"]

  substitutions = {
    _CLUSTER_NAME = google_container_cluster.primary.name
    _ZONE = var.region
    _ENV = "staging"
  }

  filename = "arcadia.client.api/cloudbuild-stage.yaml"
}
resource "google_cloudbuild_trigger" "client-fe" {

  name = "client-fe-staging"

  trigger_template {
    branch_name = var.branch_name
    repo_name   = var.repo_name
  }

  included_files = ["arcadia.client.fe/**"]

  substitutions = {
    _API_ENDPOINT = "https://stage-client-api.arcadiagaming.io"
    _CLUSTER_NAME = google_container_cluster.primary.name
    _ZONE = var.region
    _ENV = "staging"
  }

  filename = "arcadia.client.fe/cloudbuild-stage.yaml"
}
resource "google_cloudbuild_trigger" "socket-node" {

  name = "socket-node-staging"

  trigger_template {
    branch_name = var.branch_name
    repo_name   = var.repo_name
  }

  included_files = ["arcadia.client.socketio.node/**"]

  substitutions = {
    _CLUSTER_NAME = google_container_cluster.primary.name
    _ZONE = var.region
    _ENV = "staging"
  }

  filename = "arcadia.client.socketio.node/cloudbuild-stage.yaml"
}
resource "google_cloudbuild_trigger" "game-core-api" {

  name = "game-core-api-staging"

  trigger_template {
    branch_name = var.branch_name
    repo_name   = var.repo_name
  }

  included_files = ["arcadia.game.core.api/**", "arcadia.dal/**"]

  substitutions = {
    _CLUSTER_NAME = google_container_cluster.primary.name
    _ZONE = var.region
    _ENV = "staging"
  }

  filename = "arcadia.game.core.api/cloudbuild-stage.yaml"
}
resource "google_cloudbuild_trigger" "game-core-worker" {

  name = "game-core-worker-staging"

  trigger_template {
    branch_name = var.branch_name
    repo_name   = var.repo_name
  }

  included_files = ["arcadia.game.core.worker/**", "arcadia.dal/**"]

  substitutions = {
    _CLUSTER_NAME = google_container_cluster.primary.name
    _ZONE = var.region
    _ENV = "staging"
  }

  filename = "arcadia.game.core.worker/cloudbuild-stage.yaml"
}
resource "google_cloudbuild_trigger" "monitoring-api" {

  name = "monitoring-api-staging"

  trigger_template {
    branch_name = var.branch_name
    repo_name   = var.repo_name
  }

  included_files = ["arcadia.monitoring.api/**", "arcadia.dal/**"]

  substitutions = {
    _CLUSTER_NAME = google_container_cluster.primary.name
    _ZONE = var.region
    _ENV = "staging"
  }

  filename = "arcadia.monitoring.api/cloudbuild-stage.yaml"
}
resource "google_cloudbuild_trigger" "monitoring-worker" {

  name = "monitoring-worker-staging"

  trigger_template {
    branch_name = var.branch_name
    repo_name   = var.repo_name
  }

  included_files = ["arcadia.monitoring.worker/**", "arcadia.dal/**"]

  substitutions = {
    _CLUSTER_NAME = google_container_cluster.primary.name
    _ZONE = var.region
    _ENV = "staging"
  }

  filename = "arcadia.monitoring.worker/cloudbuild-stage.yaml"
}
resource "google_cloudbuild_trigger" "operator-factory" {

  name = "operator-factory-staging"

  trigger_template {
    branch_name = var.branch_name
    repo_name   = var.repo_name
  }

  included_files = ["arcadia.operator.factory/**"]

  substitutions = {
    _CLUSTER_NAME = google_container_cluster.primary.name
    _ZONE = var.region
    _ENV = "staging"
  }

  filename = "arcadia.operator.factory/cloudbuild-stage.yaml"
}
resource "google_cloudbuild_trigger" "robot-emulator" {

  name = "robot-emulator"

  trigger_template {
    branch_name = var.branch_name
    repo_name   = var.repo_name
  }

  included_files = ["arcadia.robot.emulator/**"]

  substitutions = {
    _CLUSTER_NAME = google_container_cluster.primary.name
    _ZONE = var.region
    _ENV = "staging"
  }

  filename = "arcadia.robot.emulator/cloudbuild-stage.yaml"
}
