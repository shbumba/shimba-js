//Simple Animation
$(function () {
    $.shimba('#slider-top').module('slider', {
        timeOut: 10000,
        pager: true,
        stopPointing: false,
        hideImageAfterCallback: true,
        setSlideHeightContent: false,

        slideCallbackInit: function (slide, ind, option) {
            var blocks = slide.find('.slide-animate');

            if (blocks.length) {

                blocks.each(function (index, element) {
                    var isAnimated = ($(this).data('is-animated') != undefined) ? $(this).data('is-animated') : false;

                    if (!isAnimated) {
                        var animationAfterJson = ($(this).attr('data-animation-after') !== undefined) ? JSON.parse($(this).attr('data-animation-after')) : null;

                        if (animationAfterJson) {
                            $(this).css(animationAfterJson);
                        }

                        $(this).data('is-animated', true);
                    }
                });
            }
        },
        slideCallbackStart: function (slide, ind, callback, option) {

            var to = 150,
                startCallback = false,
                blocks = slide.find('.slide-animate');

            if (blocks.length) {

                blocks.each(function (index, element) {

                    setTimeout((function (e) {
                        return function () {
                            var animationBeforeJson = (e.attr('data-animation-before') !== undefined) ? JSON.parse(e.attr('data-animation-before')) : null;

                            if (animationBeforeJson) {
                                e.animate(animationBeforeJson, 300, index != blocks.length - 1 ? null : callback);
                            } else {
                                callback();
                            }
                        }
                    })($(this)), to);
                    to += 150;
                });
            } else {
                callback();
            }

            return true;
        },
        slideCallbackEnd: function (slide, ind, callback, option) {
            var to = 150,
                blocks = slide.find('.slide-animate');

            if (blocks.length) {

                blocks.each(function (index, element) {
                    setTimeout((function (e) {
                        return function () {

                            var animationAfterJson = (e.attr('data-animation-after') !== undefined) ? JSON.parse(e.attr('data-animation-after')) : null;

                            if (animationAfterJson) {
                                e.animate(animationAfterJson, 300, index != blocks.length - 1 ? null : callback);
                            } else {
                                callback();
                            }
                        }
                    })($(this)), to);
                    to += 150;
                });
            } else {
                callback();
            }

            return true;
        }
    });
});