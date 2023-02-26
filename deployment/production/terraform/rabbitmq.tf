module "gce-container-rabbitmq" {
  source  = "terraform-google-modules/container-vm/google"
  version = "2.0.0"

  container = {
    image = var.rabbitmq_image
    env = [
      {
        name  = "RABBITMQ_USERNAME"
        value = var.rabbitmq_user
      },
      {
        name  = "RABBITMQ_PASSWORD"
        value = var.rabbitmq_password
      },
    ],
    securityContext = {
      privileged : true
    }

    # Declare volumes to be mounted.
    # This is similar to how docker volumes are declared.
    volumeMounts = [
      {
        mountPath = "/bitnami"
        name      = "rabbitmq-data"
        readOnly  = false
      }
    ]
  }

  # Declare the volumes
  volumes = [
    {
      name = "rabbitmq-data"

      emptyDir = {
        medium = "Memory"
      }
    }
  ]

  restart_policy = "Always"
}

resource "google_compute_instance" "vm-rabbitmq" {
  project      = var.project_id
  name         = "rabbitmqdb"
  machine_type = var.rabbitmq_machine_type
  zone         = "${var.region}-a"

  boot_disk {
    initialize_params {
      image = module.gce-container-rabbitmq.source_image
      size  = var.rabbitmq_disk_size
    }
  }

  network_interface {
    subnetwork = google_compute_subnetwork.vpc-sub-network.id
    access_config {}
  }

  metadata = merge(map("gce-container-declaration", module.gce-container-rabbitmq.metadata_value))

  labels = {
    gce-container = module.gce-container-rabbitmq.vm_container_label
  }

  tags                    = ["gce-container-rabbitmq", "gce-container-rabbitmq-disk-instance"]
}

resource "google_compute_firewall" "http-rabbitmq-access" {
  name    = "${var.project_id}-rabbitmq-access"
  project = var.project_id
  network = google_compute_network.vpc-network.id

  allow {
    protocol = "tcp"
    ports    = [5672,15672]
  }

  source_ranges = ["10.0.0.0/8"]
}

output "vm-rabbitmq" {
  value       = google_compute_instance.vm-rabbitmq.network_interface.0.access_config.0.nat_ip
  description = "vm-rabbitmq"
}
