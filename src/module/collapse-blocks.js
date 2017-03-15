//$.shimba('.service-block').module('collapse-block');
$(function () {
    $.shimba().module('collapse-block', function (selector, option, obj, globObj) {
        if ($(selector).length) {
            var settings = {
                    main: '.collapseMain',
                    item: '.collapseItem',
                    inside: '.collapseInside',
                    activeClass: '.active',

                    timeOut: 250,
                    durationIn: 500,
                    durationOut: 500,

                    initCallback: function (that, data) {
                        return true
                    },

                    beforeShowCallback: function (that, data) {
                        return true
                    },
                    afterShowCallback: function (that, data) {
                        return true
                    },

                    beforeHideCallback: function (that, data) {
                        return true
                    },
                    afterHideCallback: function (that, data) {
                        return true
                    }
                },
                data = {};

            settings = $.extend(settings, option);

            var method = {
                init: function () {
                    method.start();
                },

                start: function () {
                    data.collapse = method.setCollapse((typeof(selector) == 'object' && selector instanceof jQuery) ? selector : $(selector));
                    if (!data.collapse) {
                        return false;
                    }

                    data.collapse.find(settings.main).each(function () {
                        var main = $(this),
                            mainHeight = main.outerHeight(true),
                            items = main.find(settings.item),
                            itemCount = items.length,

                            relativeHeight = Math.round(mainHeight / itemCount);

                        items.each(function (index, value) {
                            var el = $(this),
                                elHeight = el.outerHeight(true),
                                inside = el.find(settings.inside),
                                insideHeight = inside.outerHeight(true);

                            data = {
                                main: main,
                                mainHeight: mainHeight,
                                items: items,
                                itemCount: itemCount,

                                el: el,
                                elHeight: elHeight,
                                inside: inside,
                                insideHeight: insideHeight,
                                relativeHeightSide: Math.round((relativeHeight - insideHeight) / 2),
                                relativeHeightOpen: Math.round(mainHeight - (insideHeight * itemCount))
                            };
                        });

                        settings.initCallback(main, data);

                        method.collapseInit(true);
                        method.hover();
                        main.on('mouseleave', function (e) {
                            method.collapseInit();
                        });
                    });
                },

                setCollapse: function (collapse) {
                    if (collapse.length == 0) {
                        return false;
                    }

                    if (collapse.length > 1) {
                        collapse.each(function () {
                            $.shimba($(this)).module('collapse-block', settings);
                        });
                        return false;
                    }

                    return collapse;
                },

                hover: function () {
                    var timeout;
                    data.items.hover(
                        function () {
                            var that = $(this);

                            timeout = setTimeout(function () {
                                method.showFunc(that);
                            }, settings.timeOut);
                        },
                        function () {
                            clearTimeout(timeout);
                            method.hideFunc($(this));
                        }
                    );

                },

                showFunc: function (that) {
                    settings.beforeShowCallback(that, data);
                    method.collapseIn(that);
                    method.collapseOut(that);
                    settings.afterShowCallback(that, data);
                },

                hideFunc: function (that) {
                    settings.beforeHideCallback(that, data);
                    method.collapseInit();
                    settings.afterHideCallback(that, data);
                },

                collapseInit: function (forse) {
                    if (forse != undefined && forse == true) {
                        data.items.each(function () {
                            var that = $(this),
                                inside = that.find(settings.inside);

                            inside.css({
                                'padding-top': data.relativeHeightSide,
                                'padding-bottom': data.relativeHeightSide
                            });

                            data.newInsideHeight = inside.outerHeight(true);

                            that.css({'height': data.newInsideHeight}).removeClass(settings.activeClass.slice(1));
                        });
                    } else {
                        data.items.each(function () {
                            var that = $(this),
                                inside = that.find(settings.inside);

                            inside.stop(true).animate({
                                'padding-top': data.relativeHeightSide,
                                'padding-bottom': data.relativeHeightSide
                            }, settings.durationIn);

                            that.stop(true).animate({'height': data.newInsideHeight}, settings.durationIn).removeClass(settings.activeClass.slice(1));
                        });
                    }
                },

                collapseIn: function (that) {
                    if (!that.is(settings.activeClass)) {
                        that.find(settings.inside).stop(true, true).animate({
                            'padding-top': 0,
                            'padding-bottom': 0
                        }, settings.durationIn);

                        that.stop(true, true).animate({'height': (data.relativeHeightOpen + data.insideHeight)}, settings.durationIn).addClass(settings.activeClass.slice(1));
                    }
                },

                collapseOut: function (that) {
                    data.items.not(that).each(function () {
                        var that = $(this),
                            inside = that.find(settings.inside);

                        inside.stop(true, true).animate({
                            'padding-top': 0,
                            'padding-bottom': 0
                        }, settings.durationOut);

                        that.stop(true, true).animate({'height': data.insideHeight}, settings.durationOut).removeClass(settings.activeClass.slice(1));
                    });
                }

            };

            method.init();
        }
    });
});