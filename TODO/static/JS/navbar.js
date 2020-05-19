export async function render() {
    let view = `<nav class="navbar" id="navbar">
            <a class="app_logo">
                <i class="material-icons md-48">done_all</i>
                <h1>TODO List</h1>
            </a>
            
            <div class="desctop_navbar_buttons">
                <a href="/#/todo">Todo's</a>
                <a href="/#/habits">Habits</a>
                <a href="/#/trash">Trash</a>
                <a href="/#/logout">Sign out</a>
            </div>
            
            <button class="phone_navbar_button" onclick="get_drop_down_menu()"><i class="material-icons md-48">reorder</i></button>
        </nav>`;

    return view;
}