window.onload=function() {
    /*let button_to_cancel = document.querySelector('#button_to_cancel.button_to_cancel');
    button_to_cancel.addEventListener(change_add_item_form_visibility_state('none'));*/
}


function change_add_item_form_visibility_state(state, event) {
    if (event) {
        event.preventDefault();
    }
    document.getElementById("gray_background").style.display = state;
    document.getElementById("add_item_form").style.display = state;
}