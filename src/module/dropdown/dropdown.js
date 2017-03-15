/*
 @function addTarget, removeTarget is targetClass
 */
$(function () {
    $.shimba().module('dropdown',
        function (selector, option, obj, globObj) {
            if ($(selector).length && $.shimba().issetModule('events')) {

                var settings = {
                    DDMainClass: '.dd-mainBlock',
                    DDListClass: '.dd-hList',
                    DDActiveClass: 'active',
                    DDHideSpeed: 300,
                    DDShowSpeed: 500,
                    DDOpenBtn: '.dd-clickBtn',
                    DDCloseBtn: '.dd-closeBtn'
                };

                settings = $.extend(settings, option);

                var event = $.shimba().module('events'),
                    clickHandler = $.shimba().clickHandler();

                var method = {
                    init: function () {
                        method.addTarget();
                        method.clickEvent();
                    },

                    addTarget: function () {
                        event.addTargetList(settings.DDMainClass, 'click, mousedown, mouseup, touchstart, touchend', function (index, value, event) {
                            method.toggleFunction($(settings.DDMainClass + '.' + settings.DDActiveClass).find(settings.DDListClass));
                        });
                    },

                    toggleFunction: function (ddList) {
                        if (ddList.hasClass(settings.DDActiveClass)) {
                            ddList.slideUp(settings.DDHideSpeed).removeClass(settings.DDActiveClass);
                            ddList.parents(settings.DDMainClass).removeClass(settings.DDActiveClass);
                            event.removeTarget($(settings.DDMainClass));
                        } else {
                            ddList.slideDown(settings.DDShowSpeed).addClass(settings.DDActiveClass);
                            ddList.parents(settings.DDMainClass).addClass(settings.DDActiveClass);
                            event.addTarget($(settings.DDMainClass));
                        }
                    },

                    clickEvent: function () {
                        $(selector).on('click', function (e) {
                            var that = $(this),
                                thisTarget = $(e.target),
                                ddList = that.find(settings.DDListClass);
                            if (thisTarget.parents(settings.DDOpenBtn).length || thisTarget.parents(settings.DDCloseBtn).length || thisTarget.is(settings.DDOpenBtn)) {
                                method.toggleFunction(ddList);
                            }
                        });
                    }
                };

                method.init();
            }
        }
    );

});