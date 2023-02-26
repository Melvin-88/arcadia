resource "google_compute_network" "vpc-network" {
  name                    = "${var.project_id}-net"
  auto_create_subnetworks = false
}

resource "google_compute_subnetwork" "vpc-sub-network" {
  name          = "${var.project_id}-net-subnetwork"
  ip_cidr_range = "10.0.4.0/28"
  region        = var.region
  network       = google_compute_network.vpc-network.id
  secondary_ip_range {
    range_name    = "sub-network-pods"
    ip_cidr_range = "10.4.0.0/14"
  }
  secondary_ip_range {
    range_name    = "sub-network-services"
    ip_cidr_range = "10.0.32.0/20"
  }
}

resource "google_compute_firewall" "ssh-access" {
  name    = "${var.project_id}-ssh-access"
  project = var.project_id
  network = google_compute_network.vpc-network.id

  allow {
    protocol = "tcp"
    ports    = [22]
  }

  source_ranges = ["62.80.191.0/24", "185.19.6.0/24"]
}

#Create CloudNAT to avoid External IP on VM instances, but provide connection to exteranal resources
resource "google_compute_router" "router" {
  name    = "${var.project_id}-router"
  region  = google_compute_subnetwork.vpc-sub-network.region
  network = google_compute_network.vpc-network.id
}

resource "google_compute_router_nat" "nat" {
  name                   = "${var.project_id}-nat"
  router                 = google_compute_router.router.name
  region                 = google_compute_router.router.region

  nat_ip_allocate_option = "MANUAL_ONLY"
  nat_ips                = google_compute_address.static-nat.*.self_link

  source_subnetwork_ip_ranges_to_nat = "LIST_OF_SUBNETWORKS"
  subnetwork {
    name                    = google_compute_subnetwork.vpc-sub-network.id
    source_ip_ranges_to_nat = ["ALL_IP_RANGES"]
  }

  log_config {
    enable = true
    filter = "ERRORS_ONLY"
  }
}

# Serverless VPC access
resource "google_vpc_access_connector" "access_vpc" {
  name           = "${var.project_id}-vpc"
  region         = var.region
  ip_cidr_range  = "10.8.0.0/28"
  network        = "default"
  min_throughput = 200
  max_throughput = 300
}
