terraform {
  required_version = ">= 0.12"
  required_providers {
    google = {
      source = "hashicorp/google"
    }
  }
  backend "gcs" {
    bucket      = "tf-arcadia-state-production"
    prefix      = "terraform/state"
    credentials = "D:\\phpStormProjects\\arcadia-dev\\deployment\\production\\prod-1-298208-75cfd94a031a.json"
  }
}
provider "google" {
  version = "~> 3.46.0"

  credentials = file(var.credential_path)

  project = var.project_id
  region  = var.region
  zone    = "${var.region}-c"
}
