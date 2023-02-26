  $template = '
resource "google_secret_manager_secret" "{key}" {
  secret_id = "{key}"

  labels = {
    label = "{key}"
  }

  replication {
    user_managed {
      replicas {
        location = var.region
      }
    }
  }
}
resource "google_secret_manager_secret_version" "secret-{key}" {
  secret = google_secret_manager_secret.{key}.id
   secret_data = var.{key}
}
  '
  $var_template = '
variable "{key}" {
  default = ""
}
  '

  $var_value_template = '{key} = "{value}"'

foreach ($key in gcloud secrets list --format="value(name)")
{
  Write-Host "key: $key"
  $value = gcloud beta secrets versions access latest --secret="${key}"
  $text = $template -Replace "{key}", $key
  $var = $var_template -Replace "{key}", $key
  $val = $var_value_template -Replace "{key}", $key
  $val = $val -Replace "{value}", $value
  $text
  Add-Content -Path "./sm.tf" -Value $text
  Add-Content -Path "./var.tf" -Value $var
  Add-Content -Path "./var.tfvars" -Value $val
}
