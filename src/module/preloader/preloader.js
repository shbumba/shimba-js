$(function () {
    $('body').css({
        'overflow': 'hidden'
    });
});
$(window).load(function () {
    $('#status').delay(300).fadeOut();
    $('#preloader').delay(300).fadeOut('slow');
    $('body').delay(550).css({'overflow': 'auto'});
})