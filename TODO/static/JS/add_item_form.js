window.onload=function() {
    /*let button_to_cancel = document.querySelector('#button_to_cancel.button_to_cancel');
    button_to_cancel.addEventListener(change_add_item_form_visibility_state('none'));*/
}

function clear_input(input) {
    input.value = '';
}

function change_add_item_form_visibility_state(state, event) {
    if (event) {
        event.preventDefault();
    }
    document.getElementById("gray_background").style.display = state;
    document.getElementById("add_item_form").style.display = state;

    if (state === 'none') {
        let input_item_title = document.getElementById("item_title");
        clear_input(input_item_title);

        let input_item_days = document.getElementById("item_days");
        if (input_item_days) {
            clear_input(input_item_days);
        }
    }
}