function complete_todo(id) {
    let todo_data = {
        operation_type: 'complete',
        todo_id: id
    };

    connect_to_server(`${window.origin}/`, todo_data, change_todo_div_to_completed(id));
}

function connect_to_server(url, data, success_function) {
    fetch(url, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify(data)
    }).then(function (response) {
        if (response.ok) {
            success_function();
        }
        else {
            console.log('error');
        }
    });
}

function change_todo_div_to_completed(id) {
    let todo_div = document.getElementById(`${id}`);
    todo_div.className = "complited-todo-item";
}
