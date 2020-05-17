from models.Todo import Todo
from models.Habit import Habit
import datetime


class User:
    def __init__(self, username, password):
        self.username = username
        self.password_hash = password
        self.todos = []
        self.habits = []

    def add_todo(self, title, category):
        new_todo = Todo(title, category)
        self.todos.append(new_todo)

        return id(new_todo)

    def add_habit(self, title, category, periodicity):
        new_habit = Habit(title, category, periodicity)
        self.habits.append(new_habit)

        return id(new_habit)

    def get_all_active_todos(self):
        return [todo for todo in self.todos if not todo.is_in_trash and not todo.is_removed]

    def get_all_active_habits(self):
        return [habit for habit in self.habits if not habit.is_in_trash and not habit.is_removed]

    def get_todo_by_id(self, todo_id):
        return next((todo for todo in self.todos if id(todo) == todo_id), None)

    def get_habit_by_id(self, habit_id):
        return next((habit for habit in self.habits if id(habit) == habit_id), None)

    def complete_todo(self, todo_id):
        target_todo = self.get_todo_by_id(todo_id)

        if target_todo:
            target_todo.is_completed = True

        return True if target_todo else False

    def complete_habit(self, habit_id):
        target_habit = self.get_habit_by_id(habit_id)

        if target_habit:
            target_habit.set_completion_date()

        return True if target_habit else False

    def get_habit_left_days_by_id(self, habit_id):
        target_habit = self.get_habit_by_id(habit_id)

        return target_habit.is_habit_completed()['days_left'] if target_habit else None

    def change_todo_trash_status(self, todo_id):
        target_todo = self.get_todo_by_id(todo_id)
        target_todo.adding_to_trash_date = datetime.datetime.now() if not target_todo.adding_to_trash_date else None
        target_todo.is_in_trash = True if target_todo.adding_to_trash_date else False

    def change_habit_trash_status(self, habit_id):
        target_habit = self.get_habit_by_id(habit_id)
        target_habit.adding_to_trash_date = datetime.datetime.now() if not target_habit.adding_to_trash_date else None
        target_habit.is_in_trash = True if target_habit.adding_to_trash_date else False

    def get_todos_in_trash(self):
        return [todo for todo in self.todos if todo.is_in_trash and not todo.is_removed]

    def get_habits_in_trash(self):
        return [habit for habit in self.habits if habit.is_in_trash and not habit.is_removed]

    def remove_todo_permanently(self, todo_id):
        target_todo = self.get_todo_by_id(todo_id)
        target_todo.is_removed = True

    def remove_habit_permanently(self, habit_id):
        target_habit = self.get_habit_by_id(habit_id)
        target_habit.is_removed = True


