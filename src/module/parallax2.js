//$.shimba('.parallax').module('parallax');
$(function () {
    $.shimba().module('parallax2', function (selector, option, obj, globObj) {
        if (selector !== undefined && selector.length) {
            $(selector).each(function () {
                var settings = {
                        mobileDisabled: true
                    },
                    that = $(this);

                settings = $.extend({}, settings, option);

                var getCss = that.css("background-position").split(' '),
                    cssX = parseInt(getCss[0]),
                    cssY = parseInt(getCss[1]),
                    isMobile = "ontouchstart" in document.documentElement;

                if (settings.mobileDisabled && isMobile) {
                    return false;
                }

                $(window).on('load scroll resize', function () {
                    var yPos = 0, newYPos = 0, coords = 0;

                    var windowScroll = $(window).scrollTop();
                    var viewPortHeight = $(window).height();
                    var parentItem = $(that.attr('data-parent'));
                    var thisMode = (that.data('mode') != undefined) ? that.data('mode') : 'down';//up, down
                    var thisStart = (that.data('start') != undefined) ? that.data('start') : 'before';// after, before
                    var height = parentItem.innerHeight();
                    var offsetTop = parentItem.offset().top;
                    var thisRangeUp = (that.data('range-up') != undefined) ? parseInt(that.data('range-up')) : 0;
                    var thisRangeDown = (that.data('range-down') != undefined) ? parseInt(that.data('range-down')) : 0;

                    var scrollStart, scrollEnd;

                    if (thisStart == "before") {
                        scrollStart = offsetTop - viewPortHeight;
                        scrollEnd = offsetTop + height;
                    } else {
                        scrollStart = offsetTop;
                        scrollEnd = offsetTop + height;
                    }

                    var scrollStartRange = scrollStart + thisRangeUp;
                    var scrollEndRange = scrollEnd + thisRangeDown;

                    if (windowScroll >= scrollStartRange && windowScroll <= scrollEndRange) {
                        yPos = (windowScroll - scrollStartRange) / (scrollEndRange - scrollStartRange) * that.data('speed');

                        if (thisMode == "down") {
                            newYPos = parseInt(cssY) + yPos;
                        } else {
                            newYPos = parseInt(cssY) - yPos;
                        }

                        coords = getCss[0] + ' ' + newYPos + 'px';

                        that.css({backgroundPosition: coords});

                        if (that.data('stop') == true) {
                            that.data('stop', false);
                        }
                    } else if (windowScroll < scrollStartRange && that.data('stop') != true) {
                        coords = getCss[0] + ' ' + cssY + 'px';

                        that.css({backgroundPosition: coords});
                        that.data('stop', true);
                    }
                });
            });
        }
    });
});