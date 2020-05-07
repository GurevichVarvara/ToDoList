from passlib.hash import sha256_crypt


class User:
    def __init__(self, username, password):
        self.username = username
        self.password_hash = sha256_crypt.encrypt(str(password))
