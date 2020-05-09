import os
from flask import Flask, render_template, request, jsonify, make_response, session, redirect, url_for
from models.Database import Database

app = Flask(__name__)

SESSION_TYPE = "redis"
PERMANENT_SESSION_LIFETIME = 1800
app.config.update(SECRET_KEY=os.urandom(24))


@app.route('/')
def index():
    return render_template('todos.html')


@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        entry = request.get_json()

    return render_template('register.html')


@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        entry = request.get_json()

        response_from_db = Database.get_instance().if_user_exists(entry['username'], entry['password'])

        # database response is user's id
        if isinstance(response_from_db, int):
            session['user_id'] = response_from_db
            response = make_response(jsonify({"message": "ok", "url": "http://0.0.0.0:8000/"}), 300)

        # database response is error message
        else:
            response = make_response(jsonify({"error": response_from_db}), 200)

        return response

    return render_template('login.html')


@app.route('/is_user_logged_in', methods=['POST'])
def is_user_logged_in():
    response = {'logged_in': "no"}

    if 'user_id' in session.keys():
        response['logged_in'] = "yes"

    return make_response(jsonify(response), 200)


@app.route('/habits', methods=['GET', 'POST'])
def habits():
    return render_template('habits.html')


@app.route('/trash')
def trash():
    return render_template('trash.html')


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=8000)