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



