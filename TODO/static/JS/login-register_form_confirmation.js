function check_entry_length(username, password) {
    var result = false;
    if (username.length < 15 && password.length < 15) {
        result = true;
    }

    return result;
}


function confirm_login_form() {
    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;

    if (check_entry_length(username, password)) {
        var entry = {
            username: username,
            password: password
        };

        fetch(`${window.origin}/login`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
             },
            body: JSON.stringify(entry),
            redirect: 'manual'
        })
        .then(function(response) {
            response.json().then(function(data) {
                if (data["error"]) {
                    alert(data["error"])
                }
                else if (data["message"] === "ok") {
                    window.location.replace(data["url"]);
                }
            })
        });
    }
    else {
        alert("The length of username and password must be less then 15 characters");
        return false;
    }
}