//$.shimba('.openPopUp').module('autoOpenPopup');
$(function () {
    $.shimba().module('autoOpenPopup', function (selector, option, obj, globObj) {
        var settings = {
                closePopupClass: ".close-popup"
            },
            clickHandler = $.shimba().clickHandler(),
            data = {
                main: undefined,
                clone: undefined,
                popup: undefined,
                popupClone: undefined
            };

        settings = $.extend({}, settings, option);

        var method = {
            init: function () {
                data.main = $.shimba().setSelectorBlock(selector, settings);

                if (!data.main) {
                    return false;
                }

                data.href = data.main.attr("href");

                if (data.href.indexOf("#") != -1) {
                    data.popup = $(data.href);
                    data.popupClone = data.main.clone();

                } else {
                    return false;
                }

                method.openPopup();
                method.closeButton();
            },

            openPopup: function () {
                data.main
                    .removeClass('.open')
                    .addClass('.opened');

                $('body').append(data.popupClone);

                $.fancybox.close();

                $.fancybox(data.popupClone, {
                    helpers: {
                        overlay: {
                            locked: false
                        }
                    },
                    padding: 0,
                    afterClose: function () {
                        method.afterClose();
                    }
                });
            },

            afterClose: function () {
                data.popupClone.remove();

                data.main
                    .removeClass('.opened')
                    .addClass('.open')
                    .on(clickHandler, function(){
                        $(this).fancybox({
                            helpers: {
                                overlay: {
                                    locked: false
                                }
                            },
                            padding: 0
                        });
                    });
            },

            closeButton: function () {
                $(settings.closePopupClass).bind(clickHandler, function () {
                    $.fancybox.close(true);
                });
            }
        };
        method.init();
    });
});