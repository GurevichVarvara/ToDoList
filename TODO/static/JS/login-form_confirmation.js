function confirm_login_form() {
    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;

    if (username.length < 15 && password.length < 15) {

        var entry = {
            username: username,
            password: password
        };

        fetch(`${window.origin}/login`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
             },
            body: JSON.stringify(entry)
        });


    }
    else {
        alert("The length of username and password must be less then 15 characters");
        return false;
    }
}