//$.shimba('.block').module('curtain');
$(function () {
    $.shimba().module('curtain', function (selector, option, obj, globObj) {
        if ($(selector).length) {
            var settings = {
                    main: ".curtain",
                    items: ".curtain-item",
                    activeClass: '.active',
                    hoverClass: '.hover',
                    slideDownSpeed: 250,
                    slideUpSpeed: 250
                },
                data = {};

            settings = $.extend({}, settings, option);

            var method = {
                init: function () {
                    data.curtain = method.setCurtain((typeof(selector) == 'object' && selector instanceof jQuery) ? selector : $(selector));
                    if (!data.curtain) {
                        return false;
                    }

                    data.curtain.find(settings.main).each(function () {
                        data.that = $(this);
                        data.items = data.that.find(settings.items);
                        data.itemsCount = data.items.length;

                        data.percentOpen = (data.that.data('percent-open') != undefined) ? data.that.data('percent-open') : '80';
                        data.percentHide = (data.that.data('percent-hide') != undefined) ? data.that.data('percent-hide') : '20';
                        data.percentHover = (data.that.data('percent-hover') != undefined) ? data.that.data('percent-hover') : '90';

                        data.widthOpen = (data.that.outerWidth() / 100) * data.percentOpen;
                        data.widthHide = ((data.that.outerWidth() / 100) * data.percentHide) / data.items.not(settings.activeClass).length;

                        data.widthHoverOpen = (data.that.outerWidth() / 100) * data.percentHover;
                        data.widthHoverHide = ((data.that.outerWidth() / 100) * ((data.percentOpen + data.percentHide) - data.percentHover)) / data.items.not(settings.activeClass).length;

                        method.curtainInit(true);

                        method.hoverFunc();

                        data.that.on('mouseleave', function (e) {
                            method.curtainInit();
                        });
                    });
                },

                setCurtain: function (curtain) {
                    if (curtain.length == 0) {
                        return false;
                    }

                    if (curtain.length > 1) {
                        curtain.each(function () {
                            $.shimba($(this)).module('curtain', settings);
                        });
                        return false;
                    }

                    return curtain;
                },

                hoverFunc: function () {
                    var timeout;

                    data.items.hover(
                        function () {
                            var that = $(this);
                            timeout = setTimeout(function () {
                                method.showFunc(that);
                            }, 150);
                        },
                        function () {
                            var that = $(this);
                            clearTimeout(timeout);
                            method.hideFunc(that);
                        }
                    );
                },

                showFunc: function (that) {
                    if (method.curtainIn(that)) {
                        method.curtainOut(that, data.widthHoverHide);
                    }
                },

                hideFunc: function (that) {
                    that.removeClass(settings.hoverClass.slice(1));
                    method.curtainInit();
                },

                curtainInit: function (forse) {
                    if (data.items.is(settings.activeClass + settings.hoverClass)) {
                        return false;
                    }
                    if (forse != undefined && forse == true) {
                        data.items.each(function () {
                            if ($(this).is(settings.activeClass)) {
                                $(this).css({'width': data.widthOpen});
                            } else {
                                $(this).css({'width': data.widthHide});
                            }
                            $(this).removeClass(settings.hoverClass.slice(1));
                        });
                    } else {
                        data.items.each(function () {
                            if ($(this).is(settings.activeClass)) {
                                $(this).stop(true).animate({'width': data.widthOpen}, {
                                    duration: 500,
                                    queue: false
                                });
                            } else {
                                $(this).stop(true).animate({'width': data.widthHide}, {
                                    duration: 500,
                                    queue: false
                                });
                            }
                            $(this).removeClass(settings.hoverClass.slice(1));
                        });
                    }
                    return true;
                },

                curtainIn: function (that) {
                    that.stop(true).animate({'width': data.widthHoverOpen}, {
                        duration: 500,
                        queue: false
                    }).addClass(settings.hoverClass.slice(1));
                    return true;
                },

                curtainOut: function (that, width) {
                    data.items.not(that).each(function () {
                        $(this).stop(true).animate({'width': width}, {
                            duration: 500,
                            queue: false
                        }).removeClass(settings.hoverClass.slice(1));
                    });
                }

            };
            method.init();
        }
    });
});