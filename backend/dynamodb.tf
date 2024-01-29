resource "aws_dynamodb_table" "plungestreakusers_table" {
  name           = "plungestreak-users"
  billing_mode   = "PROVISIONED"
  read_capacity  = 1
  write_capacity = 1

  hash_key  = "user_id"
  range_key = "timestamp"

  attribute {
    name = "user_id"
    type = "S"
  }

  attribute {
    name = "timestamp"
    type = "S"
  }

}

output "table_name" {
  value = aws_dynamodb_table.plungestreakusers_table.name
}
