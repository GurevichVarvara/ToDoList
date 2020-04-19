from flask import Flask, escape, request, send_from_directory

app = Flask(__name__, static_url_path='')

@app.route('/static/<path:path>')
def send_static(path):
    print('static request', path)
    return send_from_directory('.', path)


app.run(port=8000, host='0.0.0.0')
