module "gce-container-mongo" {
  source  = "terraform-google-modules/container-vm/google"
  version = "2.0.0"

  container = {
    image = var.mongo_image
    env = [
      {
        name  = "MONGO_SERVER_PORT"
        value = "27017"
      },
      {
        name  = "MONGO_INITDB_ROOT_USERNAME"
        value = var.mongo_user
      },
      {
        name  = "MONGO_INITDB_ROOT_PASSWORD"
        value = var.mongo_password
      },
      {
        name  = "MONGO_INITDB_DATABASE"
        value = var.mongo_db
      },
    ],

    # Declare volumes to be mounted.
    # This is similar to how docker volumes are declared.
    volumeMounts = [
      {
        mountPath = "/var/lib/mongo/data"
        name      = "mongo-data"
        readOnly  = false
      }
    ]
  }

  # Declare the volumes
  volumes = [
    {
      name = "mongo-data"

      hostPath = {
        path = "/var/mongo"
      }
    }
  ]

  restart_policy = "Always"
}

resource "google_compute_instance" "vm-mongo" {
  project      = var.project_id
  name         = "mongodb"
  machine_type = var.mongo_machine_type
  zone         = "${var.region}-a"

  boot_disk {
    initialize_params {
      image = module.gce-container-mongo.source_image
      size  = var.mongo_disk_size
    }
  }

  network_interface {
    subnetwork = google_compute_subnetwork.vpc-sub-network.id
    access_config {}
  }

  metadata = merge(map("gce-container-declaration", module.gce-container-mongo.metadata_value))

  labels = {
    gce-container = module.gce-container-mongo.vm_container_label
  }

  tags                    = ["gce-container-mongo", "gce-container-mongo-disk-instance"]
}

resource "google_compute_firewall" "http-mongo-access" {
  name    = "${var.project_id}-mongo-access"
  project = var.project_id
  network = google_compute_network.vpc-network.id

  allow {
    protocol = "tcp"
    ports    = [27017]
  }

  source_ranges = ["0.0.0.0/0"]
  target_tags   = ["gce-container-mongo"]
}

output "vm-mongo" {
  value       = google_compute_instance.vm-mongo.network_interface.0.access_config.0.nat_ip
  description = "vm-mongo"
}
