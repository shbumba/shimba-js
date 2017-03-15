//$.shimba().module('utilities');
$(window).scroll(function () {
    if ($(this).scrollTop() > 350) {
        $('#up').fadeIn();
    } else {
        $('#up').fadeOut();
    }
});

$(function () {
    $.shimba().module('utilities', function (selector, option, obj, globObj) {
        var clickHandler = $.shimba().clickHandler();

        $('#up').on(clickHandler, function () {
            $('body, html').animate({
                scrollTop: 0
            }, 'slow');
            return false;
        });

        $('a[href="#"]').on(clickHandler, function (e) {
            e.preventDefault();
        });

        $('.load-scroll-to').each(function (e) {
            var scrollBlock = $(this);
            $('html, body').stop().animate({
                scrollTop: scrollBlock.offset().top - 100
            }, 1000);
        });
    });
});