var current_items_type;

window.onload=function() {
    let select_trash_item_type_form = document.getElementById("select_trash_item_type_form");
    select_trash_item_type_form.addEventListener('submit', change_trash_list);

    current_items_type = { type: "all", sorted_method: "new-old" };
}

function change_trash_list(event) {
    event.preventDefault();

    const all_type = document.getElementById('category_of_items_all');
    const todo_type = document.getElementById('category_of_items_todos');
    const habit_type = document.getElementById('category_of_items_habits');

    let items_type = "";
    if (all_type.checked || (todo_type.checked && habit_type.checked)) {
        items_type = "all";
    }
    else if (todo_type.checked) {
        items_type = "todos";
    }
    else {
        items_type = "habits";
    }

    const sorted_type = document.querySelector('input[name="sorting_methods"]:checked').value;

    if (current_items_type.type !== items_type || current_items_type.sorted_method !== sorted_type) {
        let items_data = {
            items_type: items_type,
            sorted_type: sorted_type
        };

        connect_to_server_to_change_trash_items(items_data);
    }
}

function connect_to_server_to_change_trash_items(items_data) {
    fetch(`${window.origin}/trash`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify(items_data)
    }).then(response => response.json()).then(function (data) {
        if (data['message'] === 'ok') {

        }
        else {
            alert(data['message']);
        }
    });
}