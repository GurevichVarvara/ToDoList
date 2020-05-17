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

function change_add_item_form_visibility_state(state) {
    document.getElementById("gray_background").style.display = state;
    document.getElementsByClassName("add_item_form")[0].style.display = state;
}

function append_todo_item_to_DOM(todo_id, todo_title, category) {
    let new_todo = document.createElement('li');
    new_todo.className = "todo-item";
    new_todo.setAttribute("id", todo_id);

    new_todo.innerHTML = `<p class="todo-item-title">${todo_title}</p>
                          <div class="todo-item__controls">
                            <button class="todo-item-button todo-item-button--done" onclick="complete_todo(${todo_id})">
                              <i class="material-icons">done_outline</i>
                            </button>
                            <button class="todo-item-button todo-item-button--delete" onclick="delete_todo(${todo_id})">
                              <i class="material-icons">delete</i>
                            </button>
                          </div>`;

    const todo_container = document.querySelector("." + category + "-list");
    todo_container.appendChild(new_todo);
}

function append_habit_item_to_DOM(habit_id, habit_title, category, periodicity) {
    let new_habit = document.createElement('div');
    new_habit.className = "habit";
    new_habit.setAttribute("id", habit_id);

    new_habit.innerHTML = `<p class="habit-title">${habit_title}</p>
                            <div class="habit-category">
                                <div class="bg"></div>
                                <div class="habit-categoty-text">${category}</div>
                            </div>
            
                            <div class="completed-habit-text">
                                <p id="habit_days_left-${habit_id}">You can take a break from this task for ${periodicity} days</p>
                            </div>
            
                            <button class="habit-done-button" onclick="complete_habit(${habit_id})">
                                <i class="material-icons">done_outline</i>
                            </button>
                                    
                            <button class="habit-delete-button" onclick="delete_habit(${habit_id})">
                                <i class="material-icons">delete</i>
                            </button>`;

    const habit_container = document.getElementsByClassName("habits-container")[0];
    habit_container.appendChild(new_habit);
}

function get_item_title() {
    let item_title_input = document.getElementById("item_title");

    return item_title_input.value;
}

function connect_to_server_to_add(url, item_data) {
    fetch(url, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify(item_data)
    }).then(response => response.json()).then(function (data) {
        if (data['message'] === 'ok') {
            if (item_data.item_type === 'todo') {
                append_todo_item_to_DOM(data['id'], item_data.title, item_data.category);
                finish_work_with_add_todo_form();
            }
            else if (item_data.item_type === 'habit') {
                append_habit_item_to_DOM(data['id'], item_data.title, item_data.category, item_data.periodicity);
                finish_work_with_add_habit_form();
            }
        }
        else {
            alert(data['message']);
        }
    });

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

    let todo_data = {
        item_type: 'todo',
        operation_type: 'add',
        title: todo_title,
        category: category
    };
    connect_to_server_to_add(`${window.origin}/`, todo_data);
}

function add_habit(event) {
    event.preventDefault();

    const habit_title = get_item_title();
    const habit_category = document.querySelector('input[name="category_of_habit"]:checked').value;
    const periodicity = document.getElementById("item_days").value;

    let habit_data = {
        item_type: 'habit',
        operation_type: 'add',
        title: habit_title,
        category: habit_category,
        periodicity: periodicity
    };
    connect_to_server_to_add(`${window.origin}/habits`, habit_data);
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