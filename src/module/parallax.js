//$.shimba('.parallax').module('parallax');
$(function () {
    $.shimba().module('parallax', function (selector, option, obj, globObj) {
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
                    var thisHeight = (that.data('height') != undefined) ? parseInt(that.data('height')) : 0;
                    var thisMode = (that.data('mode') != undefined) ? that.data('mode') : 'down';
                    var height = parentItem.innerHeight();
                    var offsetTop = parentItem.offset().top;
                    var thisRange = (that.data('range') != undefined) ? parseInt(that.data('range')) : 0;
                    var thisRangeStr = '' + thisRange;

                    var scrollStart = offsetTop + thisRange;

                    var scrollEnd = (thisHeight > height) ? scrollStart + thisHeight : scrollStart + height;

                    if (windowScroll >= scrollStart && windowScroll <= scrollEnd) {
                        yPos = (windowScroll - scrollStart) / (scrollEnd - scrollStart) * that.data('speed');

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
                    } else if (windowScroll < scrollStart && that.data('stop') != true) {
                        coords = getCss[0] + ' ' + cssY + 'px';

                        that.css({backgroundPosition: coords});
                        that.data('stop', true);
                    }
                });
            });
        }
    });
});