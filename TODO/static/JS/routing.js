"use strict";

import {fill_page_by_todos} from './todo_habit_adding.js'
import {render_login_page, after_rendering_login_page} from "./login-register_form_confirmation.js";

const rout = {
    'todo': {
        render: fill_page_by_todos,
        after_rendering: 1
    },
    'login': {
        render: render_login_page,
        after_rendering: after_rendering_login_page
    }
};

const router = async () => {
    let target_url = get_target_path();

    let init_function = rout[target_url];
    const content = await init_function.render();

    const main_container = document.getElementById("main_container");
    main_container.innerHTML = content;

    init_function.after_rendering();
}

window.addEventListener('load', router);
window.addEventListener('hashchange', router);

function get_target_path() {
    return window.location.href.split('/').pop();
}