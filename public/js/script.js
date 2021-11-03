// make flash messages fade away after 5 seconds
$(document).ready(function () {
    window.setTimeout(function() {
        $(".alert").fadeTo(1000, 0).slideUp(500, function(){
            $(this).remove(); 
        });
    }, 5000);
});