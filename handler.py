import csv
import json

from botocore.vendored import requests


GOOGLE_SPREADSHEET_URL = "https://docs.google.com/spreadsheets/d/{}/export?gid={}&format=csv"

DATASET_URL = GOOGLE_SPREADSHEET_URL.format("1oFRQAuYKYxD2DQ8lHYmjwPE-Or59pas4i7WXcQr3VvE", 0)
GROUPS_URL = GOOGLE_SPREADSHEET_URL.format("1oFRQAuYKYxD2DQ8lHYmjwPE-Or59pas4i7WXcQr3VvE", 1570976908)


def download_csv_to_json(url):
    resp = requests.get(url)
    csv_content = resp.content.decode('utf-8').splitlines()

    reader = csv.DictReader(csv_content)

    data = []
    for row in reader:
        data.append(row)
    return data


def get_timeline():
    data = download_csv_to_json(DATASET_URL)
    groups = download_csv_to_json(GROUPS_URL)
    return {
        'data': data,
        'groups': groups
    }

def respond(err, res=None):
    return {
        'statusCode': '400' if err else '200',
        'body': str(err) if err else json.dumps(res),
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
    }


def lambda_handler(event, context):
    operation = event['httpMethod']
    if operation == 'GET':
        data = get_timeline()
        return respond(None, data)
    else:
        return respond(ValueError('Unsupported method "{}"'.format(operation)))
