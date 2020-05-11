import os
from flask import Flask, render_template, request, jsonify, make_response, session, redirect, url_for
from models.Database import Database
from functools import wraps

app = Flask(__name__)

SESSION_TYPE = "redis"
PERMANENT_SESSION_LIFETIME = 1800
app.config.update(SECRET_KEY=os.urandom(24))


def login_required(f):
    @wraps(f)
    def wrap(*args, **kwargs):
        if 'logged_in' not in session:
            return redirect(url_for('login'))
        return f(*args, **kwargs)
    return wrap


@app.route('/')
@login_required
def index():
    return render_template('todos.html')


@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        entry = request.get_json()

        if len(entry['username']) > 15:
            return make_response(jsonify({"message": "The length of user name must be less then 15 characters"}), 200)

        response_from_db = Database.get_instance().create_user(entry['username'], entry['password'])

        return get_response_to_front(response_from_db)

    return render_template('register.html')


@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        entry = request.get_json()

        if len(entry['username']) > 15:
            return make_response(jsonify({"message": "The length of user name must be less then 15 characters"}), 200)

        response_from_db = Database.get_instance().if_user_exists(entry['username'], entry['password'])

        return get_response_to_front(response_from_db)

    return render_template('login.html')


@app.route('/logout')
def logout():
    session.clear()

    return redirect(url_for('login'))


def get_response_to_front(response_from_db):
    # database response is user's id
    if isinstance(response_from_db, int):
        session['user_id'] = response_from_db
        session['logged_in'] = True
        response = make_response(jsonify({"message": "ok"}), 200)

    # database response is error message
    else:
        response = make_response(jsonify({"message": response_from_db}), 200)

    return response


@app.route('/habits', methods=['GET', 'POST'])
@login_required
def habits():
    return render_template('habits.html')


@app.route('/trash')
@login_required
def trash():
    return render_template('trash.html')


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=8000)