window.onload=function() {
    let add_todo_form = document.querySelector('#add_item_form.add_item_form');

    if (add_todo_form) {
        add_todo_form.addEventListener('submit', add_todo);
    }
}

function clear_input(input) {
    input.value = '';
}

function clear_checkbox(input) {
    input.checked = false;
}

function clear_todo_inputs(title_input, category_checkboxes) {
    category_checkboxes.forEach((checkbox) => {
        clear_checkbox(checkbox);
    });
    
    clear_input(title_input);
}

function change_add_item_form_visibility_state(state, event) {
    if (event) {
        event.preventDefault();
    }

    document.getElementById("gray_background").style.display = state;
    document.getElementById("add_item_form").style.display = state;

    if (state === 'none') {
        let input_item_title = document.getElementById("item_title");
        clear_input(input_item_title);

        let input_item_days = document.getElementById("item_days");
        if (input_item_days) {
            clear_input(input_item_days);
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

function add_todo(event) {
    event.preventDefault();

    let todo_title_input = document.getElementById("item_title");
    const todo_title = todo_title_input.value;

    let category_checkboxes = document.querySelectorAll('input[name="category_of_todo"]');
    let category = "";
    category_checkboxes.forEach((checkbox) => {
        category += checkbox.checked ? checkbox.value : "not-" + checkbox.value;
        category += "-";
    });

    category = category.substring(0, category.length - 1);
    append_todo_item_to_DOM(todo_title, category);

    clear_todo_inputs(todo_title_input, category_checkboxes);
    change_add_item_form_visibility_state('none');
}