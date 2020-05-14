from models.Todo import Todo
from models.Habit import Habit

class User:
    def __init__(self, username, password):
        self.username = username
        self.password_hash = password
        self.todos = []
        self.habits = []

    def add_todo(self, title, category):
        new_todo = Todo(title, category)
        self.todos.append(new_todo)

    def add_habit(self, title, category, periodicity):
        new_habit = Habit(title, category, periodicity)
        self.habits.append(new_habit)

    def get_all_todos(self):
        return [todo for todo in self.todos if not todo.is_in_trash and not todo.is_removed]
