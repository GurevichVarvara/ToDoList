let current_items_type;

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
            operation_type: 'change_type',
            items_type: items_type,
            sorted_type: sorted_type
        };

        connect_to_server_to_change_trash_items(items_data);
    }
}

function append_trash_item_to_DOM(item_id, item_title, item_type) {
    let new_item = document.createElement('div');
    new_item.className = "trash-item";
    new_item.setAttribute("id", item_id);

    new_item.innerHTML = `<p class="trash-item-name">${item_title}</p>
                            <p class="trash-item-category">${item_type}</p>
                            <button class="trash-item-back-button" id="back-${item_id}" onclick="remove_from_trash_item(${item_id})" value="${item_type}">Back</button>
                            <button class="trash-item-delete-button">Remove permanently</button>`;

    const trash_list = document.getElementById("trash-container");
    trash_list.appendChild(new_item);
}

function recreate_trash_container() {
    let trash_list = document.getElementById("trash-container");
    trash_list.parentNode.removeChild(trash_list);

    trash_list = document.createElement('div');
    trash_list.className = "trash-container";
    trash_list.setAttribute("id", "trash-container");

    const main = document.getElementById("main");
    main.appendChild(trash_list);
}

function change_trash_list_inside_DOM(trash_items) {
    recreate_trash_container();

    for (let i = 0; i < trash_items.length; i += 1) {
        append_trash_item_to_DOM(trash_items[i].id, trash_items[i].title, trash_items[i].type);
    }
}

function remove_item_div_from_DOM(id) {
    let item_div = document.getElementById(id);
    item_div.parentNode.removeChild(item_div);
}

function remove_from_trash_item(id) {
    let item_type = document.getElementById("back-" + id).value;

    let item_data = {
        operation_type: 'remove_from_trash',
        item_type: item_type,
        item_id: id,
    };

    connect_to_server_to_change_trash_items(item_data);
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
            if (items_data.operation_type === 'change_type') {
                current_items_type.type = items_data.items_type;
                current_items_type.sorted_method = items_data.sorted_type;

                change_trash_list_inside_DOM(data['trash_items']);
            }
            else if (items_data.operation_type === 'remove_from_trash') {
                remove_item_div_from_DOM(items_data.item_id);
            }
        }
        else {
            alert(data['message']);
        }
    });
}