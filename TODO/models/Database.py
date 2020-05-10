from passlib.hash import sha256_crypt
from models.User import User
import json


class Database:
    __instance = None

    def __init__(self):
        self.users = []
        self.user_names = set()

    def _save_to_db(self):
        with open('db.json', 'w') as f:
            json_string = json.dumps([user.__dict__ for user in self.users])
            json.dump(json_string, f)

    @classmethod
    def get_instance(cls):
        if not cls.__instance:
            cls.__instance = Database()
        return cls.__instance

    def create_user(self, username, password):
        if username in self.user_names:
            response = 'This user name already exists'
        else:
            new_user = User(username, sha256_crypt.encrypt(password))
            self.users.append(new_user)
            self.user_names.add(new_user.username)
            #self._save_to_db()

            response = id(new_user)

        return response

    def if_user_exists(self, username, password):
        user = next((user for user in self.users if (user.username == username and
                                                     sha256_crypt.verify(password, user.password_hash))), None)

        response = 'Username and password combination is not valid'
        if user:
            response = id(user)

        return response



