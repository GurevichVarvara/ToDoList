export async function render_todo() {
    let background = document.createElement('div');
    background.className = "gray_background";
    background.setAttribute("id", 'gray_background');
    document.body.appendChild(background);

    let adding_todo_form = document.createElement('form');
    adding_todo_form.className = "add_item_form";
    adding_todo_form.setAttribute("id", 'todo');

    adding_todo_form.innerHTML = `<div class="item_name" id="title">
                    <label for="item_title">New Todo Title</label>
                    <input type="text" name="item_title" id="item_title" required>
                </div>
        
                <div class="todo_category_select_form">
                    <div>
                        <input type="checkbox" id="category_of_todo_1"
                                 name="category_of_todo" value="important">
                        <label for="category_of_todo_1">Important</label>
                    </div>
                    <div>
                        <input type="checkbox" id="category_of_todo_2"
                                 name="category_of_todo" value="urgent">
                        <label for="category_of_todo_2">Urgent</label>
                    </div>
                </div>
        
                <div class="add_item_buttons">
                    <input class="button_to_cancel" id="button_to_cancel" type="button" value="Cancel">
                    <input class="button_to_submit" id="button_to_submit" type="submit" value="Add">
                </div>`
    document.body.appendChild(adding_todo_form);

    let add_todo_form = document.querySelector('#todo.add_item_form');
    add_todo_form.addEventListener('submit', add_todo);

    let button_to_cancel_adding_todo = document.getElementById("button_to_cancel");
    button_to_cancel_adding_todo.addEventListener('click', finish_work_with_add_todo_form);

    let content = `<button class="add_todo_button" id="up">Add Todo</button>

        <div class="todo-container">
            <div class="todo-title" id="important">
                <p>Important</p>
            </div>
            <div class="todo-title" id="not-important">
                <p>Not Important</p>
            </div>
            <div class="todo-title" id="urgent">
                <p>Urgent</p>
            </div>
            <div class="todo-title" id="not-urgent">
                <p>Not Urgent</p>
            </div>

            <div class="todo-title-phone" id="important-urgent">
                <p>Important, Urgent</p>
            </div>
            <div class="todo-title-phone" id="not-important-urgent">
                <p>Not Important, Urgent</p>
            </div>
            <div class="todo-title-phone" id="important-not-urgent">
                <p>Important, Not Urgent</p>
            </div>
            <div class="todo-title-phone" id="not-important-not-urgent">
                <p>Not Important, Not Urgent</p>
            </div>

            <section class="todo-category" id='important-urgent'>
                <ol class='important-urgent-list'></ol>
            </section>
            <section class="todo-category" id='not-important-urgent'>
                <ol class='not-important-urgent-list'></ol>
            </section>
            <section class="todo-category" id='important-not-urgent'>
                <ol class='important-not-urgent-list'></ol>
            </section>
            <section class="todo-category" id='not-important-not-urgent'>
                <ol class='not-important-not-urgent-list'></ol>
            </section>

        </div>

    <button class="add_todo_button" id="down">Add Todo</button>`;

    return content;
}

export function after_rendering_todo() {
    let upper_adding_todo_button = document.getElementById('up');
    upper_adding_todo_button.addEventListener('click', function(){ change_add_item_form_visibility_state('grid'); }, false);

    let down_adding_todo_button = document.getElementById('down');
    down_adding_todo_button.addEventListener('click', function(){ change_add_item_form_visibility_state('grid'); }, false);

    get_todo_list();
}

function get_todo_list() {
    fetch(`${window.origin}/todo`, {
        method: "GET",
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        }
    }).then(response => response.json()).then(function (data) {
        let todo_list = data['todos'];
        console.log(todo_list);

        for (let i = 0; i < todo_list.length; i++) {
            append_todo_item_to_DOM(todo_list[i].id, todo_list[i].title, todo_list[i].category, todo_list[i].completed)
        }
    })
}

function change_add_item_form_visibility_state(state) {
    let background = document.getElementById("gray_background");
    let adding_todo_form = document.getElementsByClassName("add_item_form")[0];

    if (background && adding_todo_form) {
        background.style.display = state;
        adding_todo_form.style.display = state;
    }
}

function append_todo_item_to_DOM(todo_id, todo_title, category, completon_status=false) {
    let new_todo = document.createElement('li');

    if (completon_status) {
        new_todo.className = "complited-todo-item";
    }
    else {
        new_todo.className = "todo-item";
    }

    new_todo.setAttribute("id", todo_id);

    new_todo.innerHTML = `<p class="todo-item-title">${todo_title}</p>
                          <div class="todo-item__controls">
                            <button class="todo-item-button todo-item-button--done" id="complete-button-${todo_id}">
                              <i class="material-icons">done_outline</i>
                            </button>
                            <button class="todo-item-button todo-item-button--delete" id="delete-button-${todo_id}">
                              <i class="material-icons">delete</i>
                            </button>
                          </div>`;

    const todo_container = document.querySelector("." + category + "-list");
    todo_container.appendChild(new_todo);

    let complete_button = document.getElementById("complete-button-" + todo_id);
    complete_button.addEventListener('click', function(){ complete_todo(todo_id); }, false);

    let delete_button = document.getElementById("delete-button-" + todo_id);
    delete_button.addEventListener('click', function(){ delete_todo(todo_id); }, false);
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
    connect_to_server_to_add(`${window.origin}/todo`, todo_data);
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

function complete_item(url, id, item_type, name_of_completed_div_class) {
    let item_data = {
        item_type: item_type,
        operation_type: 'complete',
        item_id: id,
        name_of_completed_div_class: name_of_completed_div_class
    };

    connect_to_server_to_complete_delete(url, item_data);
}

function change_item_div_to_completed(id, name_of_completed_class) {
    let item = document.getElementById(`${id}`);
    item.className = name_of_completed_class;
}

function change_completion_state_of_habit(id, days_left) {
    let days_left_text = document.getElementById(`habit_days_left-${id}`);
    days_left_text.innerHTML = `You can take a break from this task for ${days_left} days`;
}

export function complete_todo(id) {
    complete_item(`${window.origin}/todo`, id, "todo", "complited-todo-item");
}

function complete_habit(id) {
    complete_item(`${window.origin}/habits`, id, "habit", "completed-habit");
}

function remove_item_div_from_DOM(id) {
    let item_div = document.getElementById(id);
    item_div.parentNode.removeChild(item_div);
}

function delete_item(url, id) {
    let item_data = {
        operation_type: 'delete',
        item_id: id,
    };

    connect_to_server_to_complete_delete(url, item_data);
}

export function delete_todo(id) {
    delete_item(`${window.origin}/todo`, id);
}

function delete_habit(id) {
    delete_item(`${window.origin}/habits`, id);
}

function connect_to_server_to_complete_delete(url, item_data) {
    fetch(url, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify(item_data)
    }).then(response => response.json()).then(function (data) {
        if (data['message'] === 'ok') {
            if (item_data.operation_type === "complete") {
                if (item_data.item_type === "habit") {
                    change_completion_state_of_habit(item_data.item_id, data['habit_left_days']);
                }

                change_item_div_to_completed(item_data.item_id, item_data.name_of_completed_div_class);
            }
            if (item_data.operation_type === "delete") {
                remove_item_div_from_DOM(item_data.item_id);
            }
        }
        else {
            alert(data['message']);
        }
    });
}
