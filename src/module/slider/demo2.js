/*
 @function addTarget, removeTarget is targetClass
 */
$(function () {
    $.shimba('#slider-blog').module('slider', {
        timeOut: 5000,
        hideImageAfterCallback: true,
        slideCallbackStart: function (slide, ind, callback) {
            var to = 150,
                texts = slide.find('.blog-block .author-block, .blog-block .articles .article, .blog-block .articles .btn');

            if (texts.length) {
                texts.each(function (index, element) {
                    setTimeout((function (e) {
                        return function () {
                            e.animate({
                                opacity: 1,
                                left: 0
                            }, 300, index != texts.length - 1 ? null : function () {
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
        slideCallbackEnd: function (slide, ind, callback) {
            var to = 150,
                texts = slide.find('.blog-block .author-block, .blog-block .articles .article, .blog-block .articles .btn');

            if (texts.length) {
                texts.each(function (index, element) {
                    setTimeout((function (e) {
                        return function () {
                            e.animate({
                                opacity: 0,
                                left: '-200px'
                            }, 300, index != texts.length - 1 ? null : function () {
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