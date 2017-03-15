//$.shimba('.toggle-link').module('toggle-link');
$(function () {
    $.shimba().module('toggle-link', function (selector, option, obj, globObj) {
        if ($(selector).length) {
            var settings = {
                    activeClass: '.active',
                    toggleButton: '.toggle-btn',
                    hideSpeed: 300,
                    showSpeed: 500
                },
                clickHandler = $.shimba().clickHandler(),
                hash = location.hash,
                element = selector,
                $element = $(selector);

            settings = $.extend(settings, option);

            var method = {
                init: function () {
                    $element.each(function () {
                        var that = $(this),
                            values = method.getTitleBtn(that);

                        if (values.toggleId) {
                            if ($(values.toggleId).length) {

                                var toggle = $(values.toggleId);

                                if (
                                    that.is(settings.activeClass) ||
                                    toggle.is(settings.activeClass) ||
                                    (hash != "" && (that.attr('data-hash') != undefined && that.data('hash') == hash.slice(1)))
                                ) {
                                    method.beforeOpenFunction(that, toggle, values);

                                    toggle.show(0);
                                } else {
                                    method.beforeCloseFunction(that, toggle, values);

                                    toggle.hide(0);
                                }

                                that.on(clickHandler, function (e) {
                                    method.clickFunction(that, values, e)
                                });
                            }
                        }
                    });
                },

                getTitleBtn: function (elem) {
                    var toggleId = (elem.attr('data-toggle') !== undefined) ? elem.data('toggle') : null,
                        toggleName = (elem.is(settings.toggleButton)) ? elem : elem.find(settings.toggleButton),
                        toggleNameOpen = null,
                        toggleNameClose = null;

                    if (toggleName != undefined) {
                        toggleNameOpen = (toggleName.attr('data-toggle-name-open') !== undefined) ? toggleName.data('toggle-name-open') : 'open',
                            toggleNameClose = (toggleName.attr('data-toggle-name-close') !== undefined) ? toggleName.data('toggle-name-close') : 'close';
                    }

                    return {
                        toggleId: toggleId,
                        toggleName: toggleName,
                        toggleNameOpen: toggleNameOpen,
                        toggleNameClose: toggleNameClose
                    };
                },

                beforeCloseFunction: function (that, toggle, values) {
                    toggle.removeClass(settings.activeClass.slice(1));
                    that.removeClass(settings.activeClass.slice(1));

                    if (values.toggleName) {
                        values.toggleName.text(values.toggleNameOpen);
                    }
                },

                beforeOpenFunction: function (that, toggle, values) {
                    toggle.addClass(settings.activeClass.slice(1));
                    that.addClass(settings.activeClass.slice(1));

                    if (values.toggleName) {
                        values.toggleName.text(values.toggleNameClose);
                    }
                },

                clickFunction: function (that, values, e) {
                    var toggle = $(values.toggleId);

                    if (that.is(settings.activeClass) || toggle.is(settings.activeClass)) {
                        method.beforeCloseFunction(that, toggle, values);

                        toggle.slideUp(method.hideSpeed);
                    } else {
                        method.beforeOpenFunction(that, toggle, values);

                        toggle.slideDown(method.showSpeed);
                    }

                    e.preventDefault();
                }
            };
            method.init();
        }
    });
});