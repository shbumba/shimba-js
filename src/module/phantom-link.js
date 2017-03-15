/*
 * $.shimba().module('phantom-link');
 * $.shimba($('.phantom-link')).module('phantom-link');
 * */
$(function () {
    $.shimba().module('phantom-link', function (selector, option, obj, globObj) {
        var opt = {
                selector: '[data-phantom-link]',
                hidden: false,
                titleTpl: 'Редирект по ссылке: "{{href}}"',
                titleAttr: 'title'
            },
            clickHandler = $.shimba().clickHandler(),
            data = {
                main: undefined,
                selector: undefined,
                title: undefined,
                href: undefined,
                titleText: undefined
            };

        opt = $.extend({}, opt, option);

        var method = {
            init: function () {
                data.selector = (selector != undefined && selector.length > 0) ? selector : opt.selector;

                data.main = $.shimba().setSelectorBlock(data.selector, opt);

                if (!data.main) {
                    return false;
                }

                data.title = data.main.attr('title');
                data.href = data.main.data('phantom-link');

                data.main.on(clickHandler, function (event) {
                    method.click($(this), event);
                });

                if (!opt.hidden && (data.title == undefined || data.title.length > 0)) {
                    data.titleText = opt.titleTpl.replace('{{href}}', data.title);

                    data.main.addClass('submit');

                    data.main.on('mouseover', function (event) {
                        method.mouseover($(this), event);
                    });
                }
            },

            mouseover: function (that, event) {
                var target = event.target,
                    $target = $(target);

                if ((!$target.is('a') && !$(target.parentNode).is('a') || $target.is(that)) && data.href != undefined && data.href.length > 0) {
                    that.attr(opt.titleAttr, data.titleText);
                } else {
                    that.attr(opt.titleAttr, '');
                }
            },

            click: function (that, event) {
                var target = event.target,
                    $target = $(target);

                if ((!$target.is('a') && !$(target.parentNode).is('a') || $target.is(that)) && data.href != undefined && data.href.length > 0) {
                    event.preventDefault();

                    window.location = data.href;
                }
            }
        };

        method.init();
    });
});