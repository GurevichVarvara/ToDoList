import os
from flask import Flask, render_template, request, jsonify, make_response, session, redirect, url_for
from models.Database import Database
from functools import wraps

app = Flask(__name__)

SESSION_TYPE = "redis"
PERMANENT_SESSION_LIFETIME = 1800
app.config.update(SECRET_KEY=os.urandom(24))


@app.route('/')
def todo():
    return render_template('index.html')


@app.route('/is_logged_in')
def is_user_logged_in():
    return make_response(jsonify({"message": "ok", "is_logged_in": ('logged_in' in session.keys())}), 200)


@app.route('/todo', methods=['GET', 'POST'])
def index():
    if request.method == 'POST':
        client_data = request.get_json()

        if client_data['operation_type'] == 'add':
            response_from_db = Database.get_instance().add_todo_to_user(session['username'], client_data['title'], client_data['category'])
            response = get_adding_item_response_to_front(response_from_db)

        elif client_data['operation_type'] == 'complete':
            result_of_completing = Database.get_instance().complete_user_todo(session['username'], client_data['item_id'])
            response = get_plain_completing_and_deleting_response_to_front(
                        result_of_completing, 'Something went wrong with completing that todo')

        elif client_data['operation_type'] == 'delete':
            result_of_deleting = Database.get_instance().change_todo_trash_status(session['username'], client_data['item_id'])
            response = get_plain_completing_and_deleting_response_to_front(
                        result_of_deleting, 'Something went wrong with changing trash status of that todo')

        return response

    all_active_todos = Database.get_instance().get_all_users_todos_json(session['username'])

    return make_response(jsonify({"message": "ok", "todos": all_active_todos}), 200)


def get_adding_item_response_to_front(response_from_db):
    if response_from_db != 'Incorrect todo item format' and response_from_db != 'Incorrect habit item format':
        response = make_response(jsonify({"message": "ok", "id": response_from_db}), 200)
    else:
        response = make_response(jsonify({"message": response_from_db}), 400)

    return response


def get_plain_completing_and_deleting_response_to_front(result_of_operation, error_message):
    return make_response(jsonify({"message": "ok"}), 200) if result_of_operation else make_response(jsonify(
                {"message": error_message}), 400)


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


@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        entry = request.get_json()

        if len(entry['username']) > 15:
            return make_response(jsonify({"message": "The length of user name must be less then 15 characters"}), 200)

        response_from_db = Database.get_instance().if_user_exists(entry['username'], entry['password'])

        return get_login_response_to_front(response_from_db)


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
def habits():
    if request.method == 'POST':
        client_data = request.get_json()

        if client_data['operation_type'] == 'add':
            response_from_db = Database.get_instance().add_habit_to_user(session['username'], client_data['title'], client_data['category'], int(client_data['periodicity']))
            response = get_adding_item_response_to_front(response_from_db)

        elif client_data['operation_type'] == 'complete':
            result_of_completing = Database.get_instance().complete_user_habit(session['username'], client_data['item_id'])
            habit_left_days = Database.get_instance().get_habit_left_days_by_id(session['username'], client_data['item_id'])
            response = make_response(jsonify({"message": "ok", "habit_left_days": habit_left_days}), 200) if result_of_completing else make_response(jsonify({"message": "Something went wrong with completing that habit"}), 400)

        elif client_data['operation_type'] == 'delete':
            result_of_deleting = Database.get_instance().change_habit_trash_status(session['username'], client_data['item_id'])
            response = get_plain_completing_and_deleting_response_to_front(
                result_of_deleting, 'Something went wrong with changing trash status of that habit')

        return response

    all_active_habits = Database.get_instance().get_all_users_habits_json(session['username'])

    return make_response(jsonify({"message": "ok", "habits": all_active_habits}), 200)


@app.route('/trash', methods=['GET', 'POST'])
def trash():
    if request.method == 'POST':
        client_data = request.get_json()

        if client_data['operation_type'] == 'change_type':
            trash_items = Database.get_instance().get_trash_items(session['username'], todos=(client_data['items_type'] == 'all' or client_data['items_type'] == 'todos'),
                                                                    habits=(client_data['items_type'] == 'all' or client_data['items_type'] == 'habits'),
                                                                    is_recently_added_first=(client_data['sorted_type'] == 'new-old'))

            response = make_response(jsonify({"message": "ok", "trash_items": trash_items}), 200)

        elif client_data['operation_type'] == 'remove_from_trash':
            if client_data['item_type'] == 'Todo':
                result_of_deleting = Database.get_instance().change_todo_trash_status(session['username'],
                                                                                  client_data['item_id'])
            else:
                result_of_deleting = Database.get_instance().change_habit_trash_status(session['username'],
                                                                                      client_data['item_id'])

            response = get_plain_completing_and_deleting_response_to_front(
                result_of_deleting, 'Something went wrong with changing trash status of that item')

        elif client_data['operation_type'] == 'remove':
            if client_data['item_type'] == 'Todo':
                result_of_removing = Database.get_instance().remove_todo_permanently(session['username'],
                                                                                  client_data['item_id'])
            else:
                result_of_removing = Database.get_instance().remove_habit_permanently(session['username'],
                                                                                     client_data['item_id'])

            response = get_plain_completing_and_deleting_response_to_front(
                result_of_removing, 'Something went wrong with removing that todo')

        return response


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=8000)