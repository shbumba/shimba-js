//$.shimba().module('popup');
$(function () {
    $.shimba().module('popup', function (selector, option, obj, globObj) {
        var settings = {
                popup: '[data-popup]',
                popupClass: ".popup-in",
                popupErrorClass: ".error",
                popupCloseBtn: ".closer",
                popupTitle: "span.title",
                overlay: '.overlay',
                findElem: "ul",

                hideSpeed: 250,
                showSpeed: 250
            },
            clickHandler = $.shimba().clickHandler(),
            element = selector,
            $element = $(element),
            vars = {};

        settings = $.extend({}, settings, option);

        var method = {
            init: function () {
                $(settings.popupClass + settings.popupErrorClass).each(function () {
                    showPopup($(this), "undefined");
                });
                $(settings.popup).bind(clickHandler, function () {
                    showPopup($(this));
                });
                $(settings.popupClass + ' ' + settings.popupCloseBtn).bind(clickHandler, function () {
                    hidePopup($(this));
                });
                $(settings.popupClass + ' input[type=submit]').bind(clickHandler, function () {
                    hidePopup($(this), "all");
                });
                $(settings.overlay).bind(clickHandler, function () {
                    if ($(this).hasClass("opened")) {
                        hidePopup($(this), "all");
                    }
                });
            },

            hidePopup: function (that, mode) {
                switch (mode) {
                    case"all":
                        $(settings.popupClass).css({'display': 'none'});
                        break;

                    default:
                        var popupId = that.parent(settings.popupClass).attr("id");
                        $("#" + popupId).hide(settings.hideSpeed);
                }
                $(settings.overlay).removeClass("opened").fadeOut();
            },

            showPopup: function (that, mode) {
                var popupId, linkText = null,
                    scroll = $(document).scrollTop() + 100;

                switch (mode) {
                    case "undefined":
                        popupId = that.attr("id");
                        linkText = $('[data-popup="' + popupId + '"]').text();
                        break;

                    default:
                        popupId = that.data("popup");
                        linkText = that.text();
                }

                $("#" + popupId).css({'top': scroll}).show(250);

                if (linkText) {
                    $("#" + popupId + ' ' + settings.popupTitle).text(linkText);
                }

                setTimeout(function () {
                    $(settings.overlay).fadeIn('slow', function () {
                        $(settings.overlay).addClass("opened");
                    });
                }, 100);
            }
        };
    });
});