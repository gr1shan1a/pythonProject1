from flask import Flask, render_template
import requests


app = Flask(__name__)

url = "http://localhost:8080/api/v1/olap/get-cube"
BASE_URL = 'http://localhost:8080/'

@app.route('/')
def index():
    data = {
        "columnFields": [
            {
                "fieldId": 14,
                "fieldType": "REPORT_FIELD"
            }
        ],
        "rowFields": [],
        "metrics": [],
        "columnsInterval": {
            "from": 0,
            "count": 39
        },
        "rowsInterval": {
            "from": 0,
            "count": 135
        },
        "filterGroup": {
            "childGroups": [],
            "filters": [],
            "invertResult": False,
            "operationType": "AND"
        },
        "metricFilterGroup": {
            "childGroups": [],
            "filters": [],
            "invertResult": False,
            "operationType": "AND"
        }
    }
    metadata_response = requests.post(f'{BASE_URL}api/v1/report-job/get-metadata', json=data)
    if metadata_response.status_code == 200:
        metadata_data = metadata_response.json()
        print(metadata_data)
    else:
        metadata_data = {}  # Если запрос завершился с ошибкой

    response = requests.post(url, json=data)
    if response.status_code == 200:
        response = response.json()
        print(response)
    else:
        response = {}
        print(f"Ошибка {response.status_code}: {response.text}")

    return render_template('sait.html', metadata_data=metadata_data, response=response)

if __name__ == '__main__':
    app.run()