# Generated by Terragrunt. Sig: nIlQXj57tbuaRZEa
terraform {
  backend "s3" {
    bucket         = "terraform-state-500090592849"
    dynamodb_table = "terraform-locks"
    encrypt        = true
    key            = "./terraform.tfstate"
    region         = "eu-central-1"
  }
}
