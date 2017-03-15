//$.shimba('.sticky').module('sticky-scroll');
//$.shimba('.cart_block').module('sticky-scroll',{parent:'#page-wrap'});
$(function () {
    $.shimba().module('sticky-scroll', function (selector, option, obj, globObj) {
        if ($(selector).length) {
            var settings = {
                    unstick: true,
                    easing: 'linear',
                    duration: 400,
                    queue: false,
                    closeChar: '',
                    closeTop: 0,
                    closeRight: 0,
                    position: 'absolute',
                    parent: null
                },
                clickHandler = $.shimba().clickHandler(),
                element = selector,
                $element = $(selector);

            settings = $.extend(settings, option);

            var method = {
                init: function () {
                    if (settings.unstick == true) {
                        $element.css('position', settings.position);
                        $element.append('<a class="scrollFixIt">' + settings.closeChar + '</a>');
                        $(element + ' .scrollFixIt').css('position', 'absolute');
                        $(element + ' .scrollFixIt').css('top', settings.closeTop + 'px');
                        $(element + ' .scrollFixIt').css('right', settings.closeTop + 'px');
                        $(element + ' .scrollFixIt').css('cursor', 'pointer');
                        $(element + ' .scrollFixIt').on(clickHandler, function () {
                            $element.stop(true).animate({top: "0px"}, {
                                queue: settings.queue,
                                easing: settings.easing,
                                duration: settings.duration
                            });
                            $(window).unbind();
                            $('.scrollFixIt').remove();
                        });
                    }
                    method.scrollFunc();
                },

                getParent: function () {
                    if (settings.parent) {
                        return $(settings.parent);
                    } else {
                        return $element.parent();
                    }
                },

                scrollFunc: function () {
                    var parentBlock = method.getParent();

                    $(window).on('load scroll resize', function () {
                        if ($(window).scrollTop() > (parentBlock.offset().top) &&
                            (parentBlock.height() + parentBlock.position().top - 30) > ($(window).scrollTop() + $element.height())) {
                            $element.stop(true).animate({top: ($(window).scrollTop() - parentBlock.offset().top) + "px"},
                                {
                                    queue: settings.queue,
                                    easing: settings.easing,
                                    duration: settings.duration
                                });
                        } else if ($(window).scrollTop() < (parentBlock.offset().top)) {
                            $element.stop(true).animate({top: "0px"},
                                {
                                    queue: settings.queue,
                                    easing: settings.easing,
                                    duration: settings.duration
                                });
                        }
                    });
                }
            };

            method.init();
        }
    });
});