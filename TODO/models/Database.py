from passlib.hash import sha256_crypt
from models.User import User
from models.Todo import Todo
import pickle
import os
import datetime


class Database:
    __instance = None

    def __init__(self):
        self.users = {}

        if os.path.getsize("db.txt") > 0:
            with open('db.txt', 'rb') as file:
                self.users = pickle.load(file)

    def _save_to_db(self):
        with open('db.txt', 'wb') as file:
            pickle.dump(self.users, file)

    @classmethod
    def get_instance(cls):
        if not cls.__instance:
            cls.__instance = Database()
        return cls.__instance

    def create_user(self, username, password):
        if username in self.users.keys():
            response = 'This user name already exists'
        else:
            new_user = User(username, sha256_crypt.encrypt(password))
            self.users[username] = new_user

            self._save_to_db()

            response = username

        return response

    def if_user_exists(self, username, password):
        user = None
        if username in self.users.keys():
            user = self.users[username] if sha256_crypt.verify(password, self.users[username].password_hash) else user

        response = 'Username and password combination is not valid'
        if user:
            response = username

        return response

    def add_todo_to_user(self, username, todo_title, todo_category):
        response = 'Incorrect todo item format'

        if len(todo_title) > 0 and len(todo_category):
            user = self.users[username]
            new_todo_id = user.add_todo(todo_title, todo_category)
            self._save_to_db()

            response = new_todo_id

        return response

    def add_habit_to_user(self, username, habit_title, habit_category, habit_periodicity):
        response = 'Incorrect habit item format'

        if len(habit_title) > 0 and len(habit_category) > 0 and habit_periodicity:
            user = self.users[username]
            new_habit_id = user.add_habit(habit_title, habit_category, habit_periodicity)
            self._save_to_db()

            response = new_habit_id

        return response

    def get_all_active_users_todos(self, username):
        user = self.users[username]

        return user.get_all_active_todos()

    def get_json_todo(self, todo):
        return {'id': id(todo), 'title': todo.title, 'category': todo.category, 'completed': todo.is_completed}

    def get_all_users_todos_json(self, username):
        all_active_todos = self.get_all_active_users_todos(username)

        return list(map(self.get_json_todo, all_active_todos))

    def get_all_active_users_habits(self, username):
        user = self.users[username]

        return user.get_all_active_habits()

    def get_json_habit(self, habit):
        completion_state = habit.is_habit_completed()

        return {'id': id(habit), 'title': habit.title, 'category': habit.category, 'completed': completion_state['is_completed'], 'days_left': completion_state['days_left']}

    def get_all_users_habits_json(self, username):
        all_active_habits = self.get_all_active_users_habits(username)

        return list(map(self.get_json_habit, all_active_habits))

    def complete_user_todo(self, username, todo_id):
        user = self.users[username]
        result_of_operation = user.complete_todo(todo_id)
        self._save_to_db()

        return result_of_operation

    def complete_user_habit(self, username, habit_id):
        user = self.users[username]
        result_of_operation = user.complete_habit(habit_id)
        self._save_to_db()

        return result_of_operation

    def get_habit_left_days_by_id(self, username, habit_id):
        user = self.users[username]

        return user.get_habit_left_days_by_id(habit_id)

    def change_todo_trash_status(self, username, todo_id):
        user = self.users[username]
        user.change_todo_trash_status(todo_id)
        self._save_to_db()

        return True

    def change_habit_trash_status(self, username, habit_id):
        user = self.users[username]
        user.change_habit_trash_status(habit_id)
        self._save_to_db()

        return True

    def get_trash_items(self, username, todos=True, habits=True, is_recently_added_first=True):
        user = self.users[username]

        trash_todos = user.get_todos_in_trash()
        trash_habits = user.get_habits_in_trash()

        trash_items = (trash_todos + trash_habits) if todos and habits else (trash_todos if todos else trash_habits)
        sorted_trash_items = sorted(trash_items, key=lambda item: item.adding_to_trash_date, reverse=is_recently_added_first)

        return [{'id': id(item), 'title': item.title, 'type': ('Todo' if isinstance(item, Todo) else 'Habit')} for item in sorted_trash_items]

    def remove_todo_permanently(self, username, todo_id):
        user = self.users[username]
        user.remove_todo_permanently(todo_id)
        self._save_to_db()

        return True

    def remove_habit_permanently(self, username, habit_id):
        user = self.users[username]
        user.remove_habit_permanently(habit_id)
        self._save_to_db()

        return True

