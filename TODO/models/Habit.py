class Habit:
    def __init__(self, title, category, periodicity):
        self.title = title
        self.category = category
        self.periodicity = periodicity
        self.completion_date = None
        self.is_in_trash = False
        self.is_removed = False
