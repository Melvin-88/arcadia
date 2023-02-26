module "gce-container" {
  source  = "terraform-google-modules/container-vm/google"
  version = "2.0.0"

  container = {
    image = var.mysql_image
    env = [
      {
        name  = "MYSQL_ROOT_PASSWORD"
        value = "${var.mysql_root_password}"
      }
    ],

    args = ["--default_authentication_plugin=mysql_native_password"]

    # Declare volumes to be mounted.
    # This is similar to how docker volumes are declared.
    volumeMounts = [
      {
        mountPath = "/var/lib/mysql-files"
        name      = "mysql-data"
        readOnly  = false
      },
      {
        mountPath = "/etc/mysql"
        name      = "config"
        readOnly  = true
      },
    ]
  }

  # Declare the volumes
  volumes = [
    {
      name = "mysql-data"

      hostPath = {
        path = "/var/mysql/data"
      }
    },
    {
      name = "config"
      hostPath = {
        path = "/var/mysql/config"
      }
    },
  ]

  restart_policy = "Always"
}
#data "template_file" "startup_script_sql" {
#  template = "${file("${path.module}/startup.sh.tpl")}"
#  vars = {
#    slave_user = "${var.sql_slave_user}"
#    password   = "${var.sql_slave_password}"
#    image      = "${var.mysql_image}"
#    host       = "skip"
#    mysql_pwd  = "${var.mysql_root_password}"
#  }
#}
#data "template_file" "startup_script_sql_slave" {
#  template = "${file("${path.module}/startup.sh.tpl")}"
#  vars = {
#    slave_user = "${var.sql_slave_user}"
#    password   = "${var.sql_slave_password}"
#    host       = "${google_compute_instance.vm-master.network_interface.0.network_ip}"
#    image      = "${var.mysql_image}"
#    mysql_pwd  = "${var.mysql_root_password}"
#  }
#}

resource "google_compute_instance" "vm-master" {
  project      = var.project_id
  name         = "mysql-master"
  machine_type = var.sql_machine_type
  zone         = "${var.region}-a"

  boot_disk {
    initialize_params {
      image = module.gce-container.source_image
      size  = var.disk_size
    }
  }

  network_interface {
    subnetwork = google_compute_subnetwork.vpc-sub-network.id
    access_config {
      nat_ip       = google_compute_address.static-db.address
      network_tier = "PREMIUM"
    }
  }

  metadata = merge(map("gce-container-declaration", module.gce-container.metadata_value))

  labels = {
    gce-container = module.gce-container.vm_container_label
  }

  tags                    = ["gce-container-mysql", "gce-container-test-disk-instance"]
#  metadata_startup_script = data.template_file.startup_script_sql.rendered
}
resource "google_compute_instance" "vm-slave" {
  project      = var.project_id
  name         = "mysql-slave"
  machine_type = var.sql_machine_type
  zone         = "${var.region}-b"

  boot_disk {
    initialize_params {
      image = module.gce-container.source_image
      size  = var.disk_size
    }
  }

  network_interface {
    subnetwork = google_compute_subnetwork.vpc-sub-network.id
    access_config {}
  }

  labels = {
    gce-container = module.gce-container.vm_container_label
  }

  metadata                = merge(map("gce-container-declaration", module.gce-container.metadata_value))
  tags                    = ["gce-container-mysql", "gce-container-test-disk-instance"]
#  metadata_startup_script = data.template_file.startup_script_sql_slave.rendered
#  provisioner "local-exec" {
#    command = "gcloud config set project ${google_compute_instance.vm-slave.project} && gcloud compute ssh --force-key-file-overwrite --ssh-key-expire-after=15m --zone=${google_compute_instance.vm-slave.zone} ${google_compute_instance.vm-slave.name} --command=/var/lib/toolbox/script.sh"
#  }
}

resource "google_compute_firewall" "http-access" {
  name    = "${var.project_id}-mysql-access"
  project = var.project_id
  network = google_compute_network.vpc-network.id

  allow {
    protocol = "tcp"
    ports    = [3306]
  }

  source_ranges = ["0.0.0.0/0"]
  target_tags   = ["gce-container-mysql"]
}

output "vm-master" {
  value       = google_compute_instance.vm-master.network_interface.0.access_config.0.nat_ip
  description = "vm-master"
}
output "vm-slave" {
  value       = google_compute_instance.vm-slave.network_interface.0.access_config.0.nat_ip
  description = "vm-slave"
}
