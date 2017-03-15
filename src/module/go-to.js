/**
 * Created by Shimba on 20.02.2016.
 */
/*
 * $.shimba().module('go-to');
 * */
$(function () {
    $.shimba().module('go-to', function (selector, option, obj, globObj) {
        var opt = {
                selector: '.go-to',
                offset: 50
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

                data.main.each(function () {
                    method.scroll($(this))
                });
            },

            scroll: function (that) {
                var hash = location.hash,
                    link = that.attr('href'),
                    linkSplit = link.split("#")[1],
                    linkOffset = opt.offset,
                    hyperLink = $('a[name="' + linkSplit + '"]');

                if (link.indexOf('#') != -1 && hyperLink != undefined && hyperLink.length > 0) {
                    var linkScroll = (hyperLink.offset().top - linkOffset) + 10;

                    if (hash != '' && hash == '#' + linkSplit) {
                        $('html, body').stop().animate({
                            scrollTop: linkScroll
                        }, 0);
                    }

                    that.on(clickHandler, function (e) {
                        e.preventDefault();

                        $('html, body').stop().animate({
                            scrollTop: linkScroll
                        }, 500);
                    });
                }
            }
        };

        method.init();
    });
});