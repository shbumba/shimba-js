//$.shimba('.main-nav').module('main-nav');
//$.shimba('.action-menu').module('main-nav', {method:'click',parentElem: "ul > li.item.parent",activeClass:'.selected',actionElem:'a .ico',slideDownSpeed:'500',slideUpSpeed:'250'});
$(function () {
    $.shimba().module('main-nav', function (selector, option, obj, globObj) {
        var settings = {
                parentElem: "ul > li",
                actionElem: null,
                childElem: "> ul",
                activeClass: '.active',
                slideDownSpeed: 250,
                slideUpSpeed: 250,
                method: 'hover'
            },
            clickHandler = $.shimba().clickHandler(),
            data = {
                main: undefined
            };

        settings = $.extend({}, settings, option);

        var method = {
            init: function () {
                data.main = $.shimba().setSelectorBlock(selector, settings);

                if (!data.main) {
                    return false;
                }

                data.main.find(settings.parentElem).each(function () {
                    var that = $(this);

                    if (that.is(settings.activeClass)) {
                        that.find(settings.childElem).show(0);
                    } else {
                        that.find(settings.childElem).hide(0);
                    }

                    switch (settings.method) {
                        case 'click':
                            method.clickFunc(that);
                            break;

                        default:
                        case 'hover':
                            method.hoverFunc(that);
                            break;
                    }
                });
            },

            hoverFunc: function (elem) {
                var timeout;

                if (settings.actionElem) {
                    elem.find(settings.actionElem).hover(
                        function () {
                            var that = $(this).closest(settings.parentElem);
                            timeout = setTimeout(function () {
                                method.showFunc(that);
                            }, 250);
                        },
                        function () {
                            var that = $(this).closest(settings.parentElem);
                            clearTimeout(timeout);
                            method.hideFunc(that);
                        }
                    );
                } else {
                    elem.hover(
                        function () {
                            var that = $(this);
                            timeout = setTimeout(function () {
                                method.showFunc(that);
                            }, 250);
                        },
                        function () {
                            var that = $(this);
                            clearTimeout(timeout);
                            method.hideFunc(that);
                        }
                    );
                }
            },

            clickFunc: function (elem) {
                if (settings.actionElem) {
                    elem.find(settings.actionElem).on(clickHandler, function (e) {
                        var that = $(this).closest(settings.parentElem);

                        if (that.is(settings.activeClass)) {
                            method.hideFunc(that);
                        } else {
                            method.showFunc(that);
                        }
                        e.preventDefault();
                    });
                } else {
                    elem.on(clickHandler, function (e) {
                        var that = $(this);
                        if (that.is(settings.activeClass)) {
                            method.hideFunc(that);
                        } else {
                            method.showFunc(that);
                        }
                        e.preventDefault();
                    });
                }
            },

            showFunc: function (that) {
                that.find(settings.childElem).each(function () {
                    $(this).stop(true, true).slideDown(settings.slideDownSpeed);
                    that.addClass(settings.activeClass.slice(1));
                });
            },

            hideFunc: function (that) {
                that.find(settings.childElem).each(function () {
                    $(this).slideUp(settings.slideDownSpeed);
                    that.removeClass(settings.activeClass.slice(1));
                });
            }

        };
        method.init();
    });
});