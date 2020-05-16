function complete_todo(id) {
    let todo_data = {
        operation_type: 'complete',
        todo_id: id
    };

    let server_response = connect_to_server(`${window.origin}/`, todo_data);

    if (server_response) {
        alert('eeeah');
    }
}

function connect_to_server(url, data) {
    fetch(url, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify(data)
    }).then(function (response) {
        if (response.ok) {
            console.log('success');
            return true;
        }
        else {
            return false;
        }
    });

}
