export function render_main_navbar() {
    let content = `<nav class="navbar" id="navbar">
            <a class="app_logo">
                <i class="material-icons md-48">done_all</i>
                <h1>TODO List</h1>
            </a>
            
            <div class="desctop_navbar_buttons" id="desctop_navbar_buttons">
                <a href="/#/todo">Todo's</a>
                <a href="/#/habits">Habits</a>
                <a href="/#/trash">Trash</a>
                <a href="/#/logout">Sign out</a>
            </div>
            
            <button class="phone_navbar_button" id="navbar_burger" onclick="get_drop_down_menu()"><i class="material-icons md-48">reorder</i></button>
        </nav>`;

    return content;
}

export function after_rendering_main_navbar() {
    let burger = document.getElementById("navbar_burger");
    burger.addEventListener('click', get_drop_down_menu);
}

export function render_login_navbar() {
    let content = `<nav class="navbar" id="navbar">
            <a class="app_logo">
                <i class="material-icons md-48">done_all</i>
                <h1>TODO List</h1>
            </a>

            <div class="desctop_navbar_buttons_login" id="desctop_navbar_buttons_login">
                <a id="login_button" href="/#/login">Log in</a>
                <a id="signup_button" href="/#/register">Sign up</a>
            </div>

            <button class="phone_navbar_button" id="navbar_burger" onclick="get_drop_down_menu()"><i class="material-icons md-48">reorder</i></button>
        </nav>`;

    return content;
}

export function after_rendering_login_navbar() {
    let burger = document.getElementById("navbar_burger");
    burger.addEventListener('click', get_drop_down_login_menu);
}

function get_drop_down_login_menu() {
    let buttons = document.getElementById("desctop_navbar_buttons_login");
    let login_form = document.getElementsByClassName("login-form")[0];

    if (buttons.style.display === "grid") {
        buttons.style.display = "none";
        login_form.style.marginTop = "522px";
    } else {
        buttons.style.display = "grid";
        login_form.style.marginTop = "354px";
    }
}

function get_drop_down_menu() {
    let buttons = document.getElementById("desctop_navbar_buttons");

    if (buttons.style.display === "grid") {
        buttons.style.display = "none";
    } else {
        buttons.style.display = "grid";
    }
}