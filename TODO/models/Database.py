from passlib.hash import sha256_crypt
from models.User import User
import pickle
import os


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
        user = self.users[username]
        user.add_todo(todo_title, todo_category)
        self._save_to_db()

        return True

    def add_habit_to_user(self, username, habit_title, habit_category, habit_periodicity):
        user = self.users[username]
        user.add_habit(habit_title, habit_category, habit_periodicity)
        self._save_to_db()

        return True

    def get_all_users_todos(self, username):
        user = self.users[username]

        return user.get_all_todos()

    def get_all_users_habits(self, username):
        user = self.users[username]

        return user.get_all_habits()

    def get_json_todo(self, todo):
        return {'id': id(todo), 'title': todo.title, 'category': todo.category, 'completed': todo.is_completed}

    def get_all_users_todos_json(self, username):
        all_active_todos = self.get_all_users_todos(username)

        return list(map(self.get_json_todo, all_active_todos))




