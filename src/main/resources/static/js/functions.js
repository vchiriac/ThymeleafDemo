
$(document).ready(function() {

    // Replace the validation UI for all forms
    //var forms = $('#validationForm')[0];
/*    $('.important').change(function() {
        if(($(this).val()) !== '') $(this).css( 'border-width', '0' );
        else  $(this).css( 'border-width', '2' );
    });*/

    $('#validationForm').on('submit',function(){
        var element = $('#title');
        var name = $.trim(element.val());
        if (name === '') {
            var parent = $('#div-title')[0];
            show_error(parent, "This is the error");
            //$('#title')[0].setCustomValidity('my custom error');
            event.preventDefault();
        }
    });

/*    $('#sendbutton').on('click', function (event) {

    });*/





});

function getText() {
    return 'test';
}

function show_error(parent, message) {
    parent.insertAdjacentHTML("beforeend", "<span class='error_bubble'>" + message + "</span>");
}