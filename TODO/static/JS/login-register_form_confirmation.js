function check_username_length(username) {
    var result = false;
    if (username.length < 15) {
        result = true;
    }

    return result;
}

function are_pass_and_confirmation_equal(password, confirmation) {
    var result = false;

    if (password === confirmation) {
        result = true;
    }

    return result;
}


function connect_to_server(url, entry) {
    fetch(url, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify(entry)
    })
    .then(function(response) {
        response.json().then(function(data) {
            if (data["error"]) {
                alert('boo' + data["error"])
            }
            else if (data["message"] == "ok") {
                console.log('ok');
            }
        })
    });
}


function confirm_login_form() {
    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;

    if (check_username_length(username)) {
        var entry = {
            username: username,
            password: password
        };

        connect_to_server(`${window.origin}/login`, entry);
    }
    else {
        alert("The length of user name must be less then 15 characters");
        return false;
    }
}


function confirm_register_form() {
    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;
    var confirmation = document.getElementById("password_confirmation").value;

    if (check_username_length(username)) {
        if (are_pass_and_confirmation_equal(password, confirmation)) {
            var entry = {
                username: username,
                password: password
            };

            connect_to_server(`${window.origin}/register`, entry);
        }
        else {
            alert("Password and its confirmation are not equal to each other");
        }
    }
    else {
        alert("The length of user name must be less then 15 characters");
        return false;
    }
}