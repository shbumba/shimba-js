$(function () {
    $.shimba('#slider-top').module('slider', {
        timeOut: 10000,
        stopPointing: false,
        resizeImage: true,
        hideImageAfterCallback: true,
        setSlideHeightContent: false,

        orderBtnStartAnimation: {
            opacity: 1,
            right: 0
        },
        orderBtnEndAnimation: {
            opacity: 0,
            right: '-200px'
        },
        otherBlockStartAnimation: {
            opacity: 1,
            left: 0
        },
        otherBlockEndAnimation: {
            opacity: 0,
            left: '-200px'
        },
        slideCallbackInit: function (slide, ind, option) {
            var texts = slide.find('.slide-text p, .slide-text .btn, .slide-text .big-title, .order-image');

            if (texts.length) {
                texts.each(function (index, element) {
                    var isAnimated = ($(this).data('is-animated') != undefined) ? $(this).data('is-animated') : false;

                    if (!isAnimated) {
                        if ($(this).is('.order-image')) {
                            $(this).css(option.orderBtnEndAnimation);
                        } else {
                            $(this).css(option.otherBlockEndAnimation);
                        }
                        $(this).data('is-animated', true);
                    }
                });
            }
        },
        slideCallbackStart: function (slide, ind, callback, option) {

            var to = 150,
                texts = slide.find('.slide-text p, .slide-text .btn, .slide-text .big-title, .order-image');

            if (texts.length) {

                texts.each(function (index, element) {

                    setTimeout((function (e) {
                        return function () {
                            var animation = option.otherBlockStartAnimation;

                            if (e.is('.order-image')) {
                                animation = option.orderBtnStartAnimation;
                            }

                            e.animate(animation, 300, index != texts.length - 1 ? null : function () {
                                callback()
                            });
                        }
                    })($(this)), to);
                    to += 150;
                });

                return true;
            } else {
                return false;
            }
        },
        slideCallbackEnd: function (slide, ind, callback, option) {
            var to = 150,
                texts = slide.find('.slide-text p, .slide-text .btn, .slide-text .big-title, .order-image');

            if (texts.length) {

                texts.each(function (index, element) {
                    setTimeout((function (e) {
                        return function () {

                            var animation = option.otherBlockEndAnimation;

                            if (e.is('.order-image')) {
                                animation = option.orderBtnEndAnimation;
                            }

                            e.animate(animation, 300, index != texts.length - 1 ? null : function () {
                                callback();
                            });
                        }
                    })($(this)), to);
                    to += 150;
                });

                return true;
            } else {
                return false;
            }
        }
    });
});