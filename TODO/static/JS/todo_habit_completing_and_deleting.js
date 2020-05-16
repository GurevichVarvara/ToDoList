function complete_item(url, id, name_of_completed_div_class) {
    let item_data = {
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

function complete_todo(id) {
    complete_item(`${window.origin}/`, id, "complited-todo-item");
}

function complete_habit(id) {
    complete_item(`${window.origin}/habits`, id, "completed-habit");
}

function connect_to_server_to_complete_delete(url, data) {
    fetch(url, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify(data)
    }).then(function (response) {
        if (response.ok) {
            change_item_div_to_completed(data.item_id, data.name_of_completed_div_class)
        }
    });
}
