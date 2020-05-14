window.onload=function() {
    let add_todo_form = document.querySelector('#todo.add_item_form');
    let add_habit_form = document.querySelector('#habit.add_item_form');

    if (add_todo_form) {
        add_todo_form.addEventListener('submit', add_todo);
    }

    if (add_habit_form) {
        add_habit_form.addEventListener('submit', add_habit);
    }
}

function change_add_item_form_visibility_state(state, event) {
    if (event) {
        event.preventDefault();
    }

    document.getElementById("gray_background").style.display = state;
    document.getElementsByClassName("add_item_form")[0].style.display = state;

    if (state === 'none') {
        let input_item_title = document.getElementById("item_title");
        input_item_title.value = '';

        let input_item_days = document.getElementById("item_days");
        if (input_item_days) {
            input_item_days.value = '';
        }
    }
}

function append_todo_item_to_DOM(todo_title, category) {
    let new_todo = document.createElement('li');
    new_todo.className = "todo-item";

    new_todo.innerHTML = `<p class="todo-item-title">${todo_title}</p>
                          <div class="todo-item__controls">
                            <button class="todo-item-button todo-item-button--done">
                              <i class="material-icons">done_outline</i>
                            </button>
                            <button class="todo-item-button todo-item-button--delete">
                              <i class="material-icons">delete</i>
                            </button>
                          </div>`;

    const todo_container = document.querySelector("." + category + "-list");
    todo_container.appendChild(new_todo);
}

function append_habit_item_to_DOM(habit_title, category, periodicity) {
    let new_habit = document.createElement('div');
    new_habit.className = "habit";

    new_habit.innerHTML = `<p class="habit-title">${habit_title}</p>
                            <div class="habit-category">
                                <div class="bg"></div>
                                <div class="habit-categoty-text">${category}</div>
                            </div>
            
                            <div class="completed-habit-text">
                                <p>You can take a break from this task for ${periodicity} days</p>
                            </div>
            
                            <button class="habit-done-button">
                                <i class="material-icons">done_outline</i>
                            </button>
                                    
                            <button class="habit-delete-button">
                                <i class="material-icons">delete</i>
                            </button>`;

    const habit_container = document.getElementsByClassName("habits-container")[0];
    habit_container.appendChild(new_habit);
}

function get_item_title() {
    let item_title_input = document.getElementById("item_title");

    return item_title_input.value;
}

function add_todo(event) {
    event.preventDefault();

    const todo_title = get_item_title();

    let category_checkboxes = document.querySelectorAll('input[name="category_of_todo"]');
    let category = "";
    category_checkboxes.forEach((checkbox) => {
        category += checkbox.checked ? checkbox.value : "not-" + checkbox.value;
        category += "-";
    });

    category = category.substring(0, category.length - 1);
    append_todo_item_to_DOM(todo_title, category);

    finish_work_with_add_todo_form();
}

function add_habit(event) {
    event.preventDefault();

    const habit_title = get_item_title();
    const habit_category = document.querySelector('input[name="category_of_habit"]:checked').value;
    const periodicity = document.getElementById("item_days").value;

    append_habit_item_to_DOM(habit_title, habit_category, periodicity);

    finish_work_with_add_habit_form();
}

function clear_input_field(input) {
    input.value = '';
}

function set_default_todo_category() {
    let category_checkboxes = document.querySelectorAll('input[name="category_of_todo"]');
    category_checkboxes.forEach((checkbox) => {
        checkbox.checked = false;
    });
}

function set_default_habit_category() {
    document.getElementById('category_of_habit_easy').checked = true;
}

function finish_work_with_add_todo_form() {
    clear_input_field(document.getElementById("item_title"));
    set_default_todo_category();

    change_add_item_form_visibility_state('none');
}

function finish_work_with_add_habit_form()  {
    clear_input_field(document.getElementById("item_title"));
    clear_input_field(document.getElementById("item_days"));
    set_default_habit_category();

    change_add_item_form_visibility_state('none');
}