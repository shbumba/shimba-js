//$.shimba('.container').module('tabs')
$(function () {
    $.shimba().module('tabs', function (selector, option, obj, globObj) {
        if ($(selector).length) {
            var settings = {
                    base: '.tabs',
                    parentNav: '.tabs-nav',
                    nav: 'ul li a.nav',
                    content: '.tabs-content',
                    blocks: '.tabs-block'
                },
                clickHandler = $.shimba().clickHandler(),
                element = selector,
                $element = $(element),
                vars = {};

            settings = $.extend(settings, option);

            var method = {
                init: function () {
                    vars.hash = location.hash;
                    vars.currentActive = 0;

                    method.start();
                },

                start: function () {
                    $element.find(settings.base).each(function () {
                        var links = $(this).find(settings.parentNav + ' ' + settings.nav);

                        links.each(function (index, value) {
                            var el = $(this),
                                elFirst = el.eq(index),
                                elNotFirst = el.not(elFirst);

                            vars.currentActive = elFirst.attr("data-toggle");

                            $("#" + elNotFirst.attr("data-toggle")).hide();
                            $(this).eq(index).addClass("active");

                            method.click(el);

                            if (vars.hash != "" && (links.length - 1) == index) {
                                method.selectHashed(el);
                            }
                        })
                    });
                },

                click: function (el) {
                    el.on(clickHandler, function (e) {

                        var toggleType = el.attr("data-toggle"),
                            toggler = "#" + toggleType,
                            togglerRest = $(settings.base + ' ' + settings.content).find(settings.blocks);

                        if (vars.currentActive != toggleType) {
                            vars.currentActive = toggleType;

                            togglerRest.hide(400).removeClass("active");
                            $(toggler).show(400).addClass("active");

                            $(settings.base).find(settings.nav).removeClass("active");
                            $(this).addClass("active");
                        }
                        e.preventDefault();
                        return false;
                    });
                },

                selectHashed: function (el) {
                    var hashedTab = el.parents(settings.parentNav).find('[data-toggle="' + vars.hash.replace('#', '') + '"]'),
                        offset = $element.find(settings.base + ' ' + settings.parentNav).offset(),
                        offsetTop = offset.top;

                    if (hashedTab != undefined) {
                        hashedTab.trigger('click');

                        $('html, body').stop().animate({
                            scrollTop: offsetTop - 100
                        }, 300);
                    }
                }

            };

            method.init();
        }
    });
});