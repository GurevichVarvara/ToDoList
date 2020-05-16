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

function complete_todo(id) {
    complete_item(`${window.origin}/`, id, "todo", "complited-todo-item");
}

function complete_habit(id) {
    complete_item(`${window.origin}/habits`, id, "habit", "completed-habit");
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
            if (item_data.item_type === "habit") {
                change_completion_state_of_habit(item_data.item_id, data['habit_periodicity']);
            }

            change_item_div_to_completed(item_data.item_id, item_data.name_of_completed_div_class);
        }
        else {
            alert(data['message']);
        }
    });
}
