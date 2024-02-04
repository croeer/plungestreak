import simplejson as json
import boto3
from datetime import datetime

dynamodb = boto3.resource("dynamodb")
table_name = "plungestreak-users"  # Replace with your DynamoDB table name
table = dynamodb.Table(table_name)


def lambda_handler(event, context):
    # Parse incoming request
    http_method = event["requestContext"]["http"]["method"]
    path = event["rawPath"]
    query_params = (
        event["queryStringParameters"] if "queryStringParameters" in event else {}
    )

    # return respond(200, "OK", event)

    if "requestContext" in event and "authorizer" in event["requestContext"]:
        authorizer_info = event["requestContext"]["authorizer"]["jwt"]

        # Access verified claims from the authorizer information
        user_id = authorizer_info.get("claims", {}).get("sub", "unknown_user_id")
        user_email = authorizer_info.get("claims", {}).get("email", "unknown_email")
        user_name = authorizer_info.get("claims", {}).get("name", "unknown_email")

        # return respond(200, "OK", response_data)
    else:
        # Handle the case when authorizer information is not available
        return respond(
            401, "Unauthorized", "Authorizer information not found in the request."
        )

    # Your route handling logic
    if http_method == "GET":
        if path == "/getstreakitems":
            return handle_getstreakitems(query_params)
        else:
            return respond(404, "Not Found", "Route not supported")
    elif http_method == "POST":
        if path == "/logstreak":
            return handle_logstreak(user_id)
        else:
            return respond(404, "Not Found", "Route not supported")
    else:
        return respond(
            405, "Method Not Allowed", f"HTTP method {http_method} not supported"
        )


def handle_getstreakitems(query_params):
    # Your logic for handling /route1
    parameter_value = query_params.get("parameter_name", "default_value")

    try:
        response = table.scan()
        items = response.get("Items", [])
        return respond(200, "OK", items)

    except Exception as e:
        print(f"Error: {e}")
        return {
            "statusCode": 500,
            "body": json.dumps({"message": "Internal Server Error"}),
        }


def handle_logstreak(user_id):
    # Get current timestamp
    timestamp = datetime.now().isoformat()

    # Create DynamoDB entry
    dynamodb_entry = {"user_id": user_id, "timestamp": timestamp}

    # Put item into DynamoDB table
    response = table.put_item(Item=dynamodb_entry)

    return respond(200, "OK", response)


def respond(status_code, status_message, body):
    return {
        "statusCode": status_code,
        "statusMessage": status_message,
        "body": json.dumps(body),
    }
