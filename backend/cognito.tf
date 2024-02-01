variable "user_pool_name" {
  type        = string
  description = "User pool name"
  default     = "plungestreak-userpool"
}

variable "username_attributes" {
  type        = list(string)
  description = "Attributes that can be used as usernames in the User Pool"
  default     = ["email"]
}

variable "password_policy" {
  type        = map(string)
  description = "Password policy for the User Pool"
  default = {
    minimum_length    = "8"
    require_lowercase = "true"
    require_numbers   = "true"
    require_symbols   = "false"
    require_uppercase = "true"
  }
}

resource "aws_cognito_user_pool" "user_pool" {
  name = var.user_pool_name

  schema {
    attribute_data_type      = "String"
    developer_only_attribute = false
    mutable                  = true
    name                     = "email"
    required                 = true
    string_attribute_constraints {
      max_length = "256"
      min_length = "0"
    }
  }

  username_attributes = var.username_attributes

  password_policy {
    minimum_length    = var.password_policy["minimum_length"]
    require_lowercase = var.password_policy["require_lowercase"]
    require_numbers   = var.password_policy["require_numbers"]
    require_symbols   = var.password_policy["require_symbols"]
    require_uppercase = var.password_policy["require_uppercase"]
  }
}

resource "aws_cognito_user_pool_client" "my_user_pool_client" {
  name                                 = "plungestreak-client"
  user_pool_id                         = aws_cognito_user_pool.user_pool.id
  generate_secret                      = false
  callback_urls                        = ["http://localhost:3000"] # Replace with your actual callback URL
  allowed_oauth_flows                  = ["code"]
  allowed_oauth_scopes                 = ["openid"]
  allowed_oauth_flows_user_pool_client = true
}

output "user_pool_id" {
  value = aws_cognito_user_pool.user_pool.id
}

output "client_id" {
  value = aws_cognito_user_pool_client.my_user_pool_client.id
}
