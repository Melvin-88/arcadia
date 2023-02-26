resource "google_compute_global_address" "static" {
  name = "arcadia-static"
}
resource "google_compute_address" "static-db" {
  name = "arcadia-static-db-master"
  region = var.region
}

resource "google_compute_address" "static-nat" {
  count  = 2
  name   = "arcadia-static-nat-${count.index}"
  region = google_compute_subnetwork.vpc-sub-network.region
}
