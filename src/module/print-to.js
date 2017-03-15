/*
 * $.shimba().module('print-to');
 * $.shimba($('.print-to')).module('print-to');
 * */
$(function () {
    $.shimba().module('print-to', function (selector, option, obj, globObj) {
        var opt = {
                selector: '.print-to'
            },
            clickHandler = $.shimba().clickHandler(),
            data = {
                main: undefined,
                selector: undefined
            };

        opt = $.extend({}, opt, option);

        var method = {
            init: function () {
                data.selector = (selector != undefined && selector.length > 0) ? selector : opt.selector;

                data.main = $.shimba().setSelectorBlock(data.selector, opt);

                if (!data.main) {
                    return false;
                }

                data.main.on(clickHandler, function (event) {
                    method.click($(this), event);
                });
            },

            click: function (that, event) {
                var printTo = that.data('print-to');

                if (printTo != undefined && printTo.length > 0) {
                    var printItem = $(printTo);

                    if (printItem != undefined && printTo.length > 0) {
                        var printItemContent = printItem[0].outerHTML,
                            printItemWidth = printItem.width(),
                            printItemHeight = printItem.height(),
                            printContentBlock = $('<div class="print-on">');

                        printContentBlock.css({
                            'width': printItemWidth,
                            'height': printItemHeight
                        }).append(printItemContent);

                        printContentBlock.find('*').addClass('print-on__elem');
                        printContentBlock.find('.print-to').hide();

                        $('body').addClass('print-off').append(printContentBlock);

                        setTimeout(function () {
                            window.print();
                        }, 100);

                        setTimeout(function () {
                            $('body').removeClass('print-off');
                            printContentBlock.remove();
                        }, 100);

                        event.preventDefault();
                    }
                }
            }
        };

        method.init();
    });
});