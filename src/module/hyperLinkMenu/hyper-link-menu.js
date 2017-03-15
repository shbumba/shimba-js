//$.shimba("#menu-top").module('hyperLinkMenu');
$(function () {
    $.shimba().module('hyper-link-menu', function (selector, option, obj, globObj) {
        var window = $(window),
            lastId,
            topMenu = $(selector),
            heightPlus = 50,
            topMenuHeight = topMenu.outerHeight() + heightPlus,
            menuItems = topMenu.find("a"),
            clickHandler = $.shimba().clickHandler(),
            scrollItems = menuItems.map(function () {
                var href = $(this).attr('href').replace('#', '');
                var item = $("a[name='" + href + "']");

                if (item.length) {
                    return item;
                }
            }),
            hideTopMenu = function () {
                var fromTop = $(this).scrollTop() + topMenuHeight;
                var cur = scrollItems.map(function () {
                    if ($(this).offset().top < fromTop) {
                        return this;
                    }
                });
                cur = cur[cur.length - 1];

                var id = cur && cur.length ? cur.attr("name") : "";

                if (window.scrollTop() > 400) {
                    topMenu.slideDown();
                } else {
                    topMenu.slideUp();
                }

                if (lastId !== id) {
                    lastId = id;
                    menuItems
                        .parent().removeClass("select")
                        .end().filter("[href=#" + id + "]").parent().addClass("select");
                }
            };

        menuItems.on(clickHandler, function (e) {
            var href = $(this).attr("href").replace('#', ''),
                offset = $("a[name='" + href + "']").offset(),
                offsetTop = offset.top;
            $('html, body').stop().animate({
                scrollTop: offsetTop - heightPlus
            }, 300);
            e.preventDefault();
        });

        window.scroll(function () {
            hideTopMenu();
        });
    });
});
