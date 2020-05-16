import datetime

class Habit:
    def __init__(self, title, category, periodicity):
        self.title = title
        self.category = category
        self.periodicity = periodicity
        self.completion_date = None
        self.is_in_trash = False
        self.is_removed = False

    def set_completion_date(self):
        self.completion_date = datetime.datetime.now()

    def is_habit_completed(self):
        return (False if not self.completion_date else \
                (True if (datetime.datetime.now() - self.completion_date).days <= self.periodicity else False))

