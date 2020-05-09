from passlib.hash import sha256_crypt
from models.User import User


class Database:
    __instance = None

    def __init__(self):
        self.users = [User('var', 'var')]

    @classmethod
    def get_instance(cls):
        if not cls.__instance:
            cls.__instance = Database()
        return cls.__instance

    def if_user_exists(self, username, password):
        user = next((user for user in self.users if (user.username == username and user.password == password)), None)

        response = 'Username and password combination is not valid'
        if user:
            response = id(user)

        return response

