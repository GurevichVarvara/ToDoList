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


@app.route('/', methods=['GET', 'POST'])
@login_required
def index():
    if request.method == 'POST':
        client_data = request.get_json()

        if client_data['operation_type'] == 'add':
            response_from_db = Database.get_instance().add_todo_to_user(session['username'], client_data['title'], client_data['category'])
            response = get_adding_item_response_to_front(response_from_db)
        elif client_data['operation_type'] == 'complete':
            result_of_completing = Database.get_instance().complete_user_todo(session['username'], client_data['item_id'])
            response = make_response(jsonify({"message": "ok"}), 200) if result_of_completing else make_response(jsonify({"message": "Something with completing that todo"}), 400)

        return response

    all_active_todos = Database.get_instance().get_all_users_todos_json(session['username'])

    return render_template('todos.html', all_active_todos=all_active_todos)


def get_adding_item_response_to_front(response_from_db):
    if response_from_db != 'Incorrect todo item format' and response_from_db != 'Incorrect habit item format':
        response = make_response(jsonify({"message": "ok", "id": response_from_db}), 200)
    else:
        response = make_response(jsonify({"message": response_from_db}), 400)

    return response


@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        entry = request.get_json()

        if len(entry['username']) > 15:
            entry_error_response = make_response(jsonify({"message": "The length of user name must be less then 15 "
                                                                     "characters"}), 200)
            if len(entry['password'] < 10):
                entry_error_response = make_response(
                    jsonify({"message": "The length of password must be greater then 10 characters"}), 200)

            return entry_error_response

        response_from_db = Database.get_instance().create_user(entry['username'], entry['password'])

        return get_login_response_to_front(response_from_db)

    return render_template('register.html')


@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        entry = request.get_json()

        if len(entry['username']) > 15:
            return make_response(jsonify({"message": "The length of user name must be less then 15 characters"}), 200)

        response_from_db = Database.get_instance().if_user_exists(entry['username'], entry['password'])

        return get_login_response_to_front(response_from_db)

    return render_template('login.html')


@app.route('/logout')
def logout():
    session.clear()

    return redirect(url_for('login'))


def get_login_response_to_front(response_from_db):
    # database response is user's id
    if response_from_db != 'This user name already exists' and response_from_db != 'Username and password combination is not valid':
        session['username'] = response_from_db
        session['logged_in'] = True
        response = make_response(jsonify({"message": "ok"}), 200)

    # database response is error message
    else:
        response = make_response(jsonify({"message": response_from_db}), 200)

    return response


@app.route('/habits', methods=['GET', 'POST'])
@login_required
def habits():
    if request.method == 'POST':
        client_data = request.get_json()

        if client_data['operation_type'] == 'add':
            response_from_db = Database.get_instance().add_habit_to_user(session['username'], client_data['title'], client_data['category'], client_data['periodicity'])
            response = get_adding_item_response_to_front(response_from_db)
        elif client_data['operation_type'] == 'complete':
            result_of_completing = Database.get_instance().complete_user_habit(session['username'], client_data['item_id'])
            response = make_response(jsonify({"message": "ok"}), 200) if result_of_completing else make_response(jsonify({"message": "Something with completing that habit"}), 400)

        return response

    all_active_habits = Database.get_instance().get_all_users_habits_json(session['username'])

    return render_template('habits.html', all_active_habits=all_active_habits)


@app.route('/trash')
@login_required
def trash():
    return render_template('trash.html')


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=8000)