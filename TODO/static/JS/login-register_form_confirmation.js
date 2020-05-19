export function render_login_page() {
    let content = `<form class="login-form" id="login-form">
        <div class="error-message-container" id="error-message-container">
            <p id="error-message">hello</p>
        </div>

        <div class="username_field">
            <label for="username">Username</label>
            <input type="text" name="username" id="username" required>
        </div>

        <div class="password_field">
            <label for="password">Password</label>
            <input type="password" name="password" id="password" required>
        </div>
            
        <input class="button_to_submit" type="submit" value="Log in">
    </form>`;

    return content;
}

export function after_rendering_login_page() {
    let login_form = document.getElementById('login-form');
    login_form.addEventListener('submit', confirm_login_form);
}

let check_username_length = (username) => { return username.length < 15; };


let check_password_length = (password) => { return password.length > 10; };


function are_pass_and_confirmation_equal(password, confirmation) {
    var result = false;

    if (password === confirmation) {
        result = true;
    }

    return result;
}

function set_error_message(error_message) {
    document.getElementById("error-message-container").style.visibility = "visible";
    document.getElementById("error-message").innerHTML = error_message;
}

function set_username_length_error() {
    set_error_message("The length of user name must be less then 15 characters");
}


function set_password_length_error() {
    set_error_message("The length of password must be greater then 10 characters");
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
        if (data["message"] === "ok") {
            window.location.replace(`${window.origin}/`);
        }
        else {
            set_error_message(data["message"]);
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
        set_username_length_error();
        return false;
    }
}


function confirm_register_form(event) {
    event.preventDefault();

    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;
    var confirmation = document.getElementById("password_confirmation").value;

    if (check_username_length(username) && check_password_length(password)) {
        if (are_pass_and_confirmation_equal(password, confirmation)) {
            var entry = {
                username: username,
                password: password
            };

            connect_to_server(`${window.origin}/register`, entry);
        }
        else {
            set_error_message("Password and its confirmation are not equal to each other");
        }
    }
    else if (check_password_length(password)) {
        set_username_length_error();
        return false;
    }
    else {
        set_password_length_error();
        return false;
    }
}