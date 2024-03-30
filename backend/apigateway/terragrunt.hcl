include "root" {
  path = find_in_parent_folders()
}

dependency "lambda" {
  config_path = "../lambda"
       mock_outputs = {
       plungestreak_function_arn = "MOCK"
       plungestreak_function_name = "MOCK"
     }
}

inputs = {
  plungestreak_arn = dependency.lambda.outputs.plungestreak_function_arn
  plungestreak_lambda_name = dependency.lambda.outputs.plungestreak_function_name
}