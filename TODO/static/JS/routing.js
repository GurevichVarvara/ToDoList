"use strict";

import {render_todo, after_rendering_todo,
        render_habits, after_rendering_habits} from './todo_habit.js'
import {render_trash, after_rendering_trash} from "./trash.js";
import {render_login_page, after_rendering_login_page,
        render_registration_page, after_rendering_registration_page} from "./login-register_form.js";
import {render_login_navbar, after_rendering_login_navbar,
        render_main_navbar, after_rendering_main_navbar} from "./navbar.js";

const rout = {
    'todo': {
        render: render_todo,
        after_rendering: after_rendering_todo
    },
    'habits': {
        render: render_habits,
        after_rendering: after_rendering_habits
    },
    'trash' : {
        render: render_trash,
        after_rendering: after_rendering_trash
    },
    'login': {
        render: render_login_page,
        after_rendering: after_rendering_login_page
    },
    'register': {
        render: render_registration_page,
        after_rendering: after_rendering_registration_page
    }
};

const router = async () => {
    let target_url = get_target_path();

    if (target_url === 'logout') {
        await logout();
        target_url = 'login';
    }

    let is_logged_in = await is_user_logged_in();
    
    const header_container = document.getElementById('header_container');

    // redirect user to login page if not logged in
    if (is_logged_in) {
        header_container.innerHTML = render_main_navbar();
        after_rendering_main_navbar();
    }
    else {
        header_container.innerHTML = render_login_navbar();
        after_rendering_login_navbar();

        target_url = (target_url === 'register') ? target_url : 'login';
    }

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

async function is_user_logged_in() {
    const response = await fetch(`${window.origin}/is_logged_in`, {
        method: "GET",
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        }
    });

    const data = await response.json();

    return data['is_logged_in'];
}

async function logout() {
    await fetch(`${window.origin}/logout`, {
        method: "GET",
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        }
    });
}