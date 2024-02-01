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

resource "aws_dynamodb_table_item" "sample_item" {
  table_name = aws_dynamodb_table.plungestreakusers_table.name
  hash_key   = aws_dynamodb_table.plungestreakusers_table.hash_key
  range_key  = aws_dynamodb_table.plungestreakusers_table.range_key

  item = <<ITEM
{
  "user_id": {"S": "aadc5e9c-05ed-4d99-8071-2c5e010c443b"},
  "timestamp": {"S": "2022-04-14T13:02:33"}
}
ITEM
}

output "table_name" {
  value = aws_dynamodb_table.plungestreakusers_table.name
}
