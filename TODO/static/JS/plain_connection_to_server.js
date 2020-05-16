function connect_to_server(url, data) {
    fetch(url, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify(data)
    }).then(function (response) {
        if (response.ok) {
            return true;
        }
    });

}