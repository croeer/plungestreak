data "aws_caller_identity" "current" {}

resource "aws_s3_bucket" "lambda-bucket" {
  bucket = "${data.aws_caller_identity.current.account_id}-plungestreak-api-lambda"
}

resource "aws_s3_object" "package" {
  bucket = aws_s3_bucket.lambda-bucket.bucket
  key    = "plungestreak-api.zip"
  source = "plungestreak-api.zip"
  etag   = filemd5("plungestreak-api.zip")
}

resource "aws_lambda_function" "plungestreak-api" {
  function_name    = "plungestreak-api-lambda"
  s3_bucket        = aws_s3_bucket.lambda-bucket.bucket
  s3_key           = "plungestreak-api.zip"
  source_code_hash = filebase64sha256("plungestreak-api.zip")

  handler = "plungestreak-api.lambda_handler"
  runtime = "python3.11"

  role = aws_iam_role.lambda_exec.arn
}

resource "aws_iam_role" "lambda_exec" {
  name = "plungestreak_api_lambda_role"

  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": "sts:AssumeRole",
      "Principal": {
        "Service": "lambda.amazonaws.com"
      },
      "Effect": "Allow",
      "Sid": ""
    }
  ]
}
EOF
}

resource "aws_cloudwatch_log_group" "function_log_group" {
  name              = "/aws/lambda/${aws_lambda_function.plungestreak-api.function_name}"
  retention_in_days = 7
  lifecycle {
    prevent_destroy = false
  }
}

resource "aws_iam_policy" "function_logging_policy" {
  name = "plungestreak-api-logging-policy"
  policy = jsonencode({
    "Version" : "2012-10-17",
    "Statement" : [
      {
        Action : [
          "logs:CreateLogStream",
          "logs:PutLogEvents"
        ],
        Effect : "Allow",
        Resource : "arn:aws:logs:*:*:*"
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "function_logging_policy_attachment" {
  role       = aws_iam_role.lambda_exec.id
  policy_arn = aws_iam_policy.function_logging_policy.arn
}


resource "aws_iam_policy" "function_dynamodb_policy" {
  name        = "plungestreak_api_dynamodb_policy"
  description = "IAM policy for Lambda to scan DynamoDB table"

  policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "dynamodb:Scan"
      ],
      "Resource": "arn:aws:dynamodb:eu-central-1:${data.aws_caller_identity.current.account_id}:table/plungestreak-users"
    }
  ]
}
EOF
}

resource "aws_iam_role_policy_attachment" "function_dynamodb_policy_attachment" {
  role       = aws_iam_role.lambda_exec.id
  policy_arn = aws_iam_policy.function_dynamodb_policy.arn
}

# resource "aws_lambda_function_url" "plungestreakapi-function-url" {
#   function_name      = aws_lambda_function.plungestreak-api.function_name
#   authorization_type = "NONE"
#   cors {
#     allow_credentials = true
#     allow_origins     = ["*"]
#     allow_methods     = ["*"]
#     allow_headers     = ["date", "keep-alive"]
#     expose_headers    = ["keep-alive", "date"]
#     max_age           = 86400
#   }
# }


# output "base_url" {
#   value = aws_lambda_function_url.plungestreakapi-function-url.function_url
# }
