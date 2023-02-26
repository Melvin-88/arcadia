module "gce-container-redis" {
  source  = "terraform-google-modules/container-vm/google"
  version = "2.0.0"

  container = {
    image = var.redis_image

    args = ["--appendonly yes"]

    # Declare volumes to be mounted.
    # This is similar to how docker volumes are declared.
    volumeMounts = [
      {
        mountPath = "/data"
        name      = "redis-data"
        readOnly  = false
      }
    ]
  }

  # Declare the volumes
  volumes = [
    {
      name = "redis-data"

      hostPath = {
        path = "/var/redis"
      }
    }
  ]

  restart_policy = "Always"
}

resource "google_compute_instance" "vm-redis" {
  project      = var.project_id
  name         = "redis"
  machine_type = var.redis_machine_type
  zone         = "${var.region}-a"

  boot_disk {
    initialize_params {
      image = module.gce-container-redis.source_image
      size  = var.redis_disk_size
    }
  }

  network_interface {
    subnetwork = google_compute_subnetwork.vpc-sub-network.id
    access_config {}
  }

  metadata = merge(map("gce-container-declaration", module.gce-container-redis.metadata_value))

  labels = {
    gce-container = module.gce-container-redis.vm_container_label
  }

  tags                    = ["gce-container-redis", "gce-container-redis-disk-instance"]
}

resource "google_compute_firewall" "http-redis-access" {
  name    = "${var.project_id}-redis-access"
  project = var.project_id
  network = google_compute_network.vpc-network.id

  allow {
    protocol = "tcp"
    ports    = [6379]
  }

  source_ranges = ["10.0.0.0/8"]
  target_tags   = ["gce-container-redis"]
}

output "vm-redis" {
  value       = google_compute_instance.vm-redis.network_interface.0.access_config.0.nat_ip
  description = "vm-redis"
}
