window.onload=function() {
    var login_form = document.querySelector('#login-form.login-form');
    var registration_form = document.querySelector('#registration-form.login-form');

    if (login_form) {
        login_form.addEventListener('submit', confirm_login_form);
    }

    if (registration_form) {
        registration_form.addEventListener('submit', confirm_register_form);
    }
}


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
    }).then(response => response.json())
    .then(function(data) {
        console.log(data);
        if (data["message"] == "ok") {
            window.location.replace(`${window.origin}/`);
        }
        else {
            alert(data["message"]);
        }
    });
}


function confirm_login_form(event) {
    event.preventDefault();

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


function confirm_register_form(event) {
    event.preventDefault();

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