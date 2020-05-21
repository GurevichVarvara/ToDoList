class Todo:
    def __init__(self, title, category):
        self.title = title
        self.category = category
        self.is_completed = False
        self.is_in_trash = False
        self.adding_to_trash_date = None
        self.is_removed = False
