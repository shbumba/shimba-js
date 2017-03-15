//$.shimba().module('fancybox');
$(function () {
    $.shimba().module('fancybox', function (selector, option, obj, globObj) {
        $('.fancy, .fs-popup').fancybox({
            helpers: {
                overlay: {
                    locked: false
                }
            },
            padding: 0
        });

        $('.fs-popup.open').fancybox({
            helpers: {
                overlay: {
                    locked: false
                }
            },
            padding: 0
        }).trigger('click');

        $('.fs-ajax').fancybox({
            helpers: {
                overlay: {
                    locked: true
                }
            },
            ajax: {
                type: "POST",
                data: {
                    'ajax': true
                }
            },
            type: 'ajax',
            padding: 0
        });

        $('.fs-iframe').fancybox({
            helpers: {
                overlay: {
                    locked: false
                }
            },
            ajax: {
                type: "POST",
                data: {
                    'ajax': true
                }
            },
            maxWidth: 500,
            type: 'iframe',
            padding: 0
        });

        $('.success-popup.open').each(function() {
            var that = $(this);
            var thisHref = that.attr("href");

            if (thisHref.indexOf("#") != -1) {
                var popup = $(thisHref);

                if (popup != undefined && popup.length > 0) {
                    var popupClone = popup.clone();

                    that.removeClass('.open').addClass('.opened');

                    $('body').append(popupClone);

                    $.fancybox.close();

                    $.fancybox(popupClone, {
                        helpers: {
                            overlay: {
                                locked: false
                            }
                        },
                        padding: 0,
                        afterClose: function () {
                            popupClone.remove();

                            that.removeClass('.opened').addClass('.open').on('click', function(){
                                $(this).fancybox({
                                    helpers: {
                                        overlay: {
                                            locked: false
                                        }
                                    },
                                    padding: 0
                                });
                            });
                        }
                    });
                }
            }
        });

        function fancyFixNav(forse) {
            var mainOffsetTop = $('.fancybox-wrap').offset().top,
                mainHeight = $('.fancybox-wrap').height(),
                winScrollTop = $(window).scrollTop(),
                winHeight = $(window).height(),
                sinHeightHalf = (winHeight / 2),
                scrollTop = winScrollTop - mainOffsetTop + 20,
                fixT = $(".fancybox-close"),
                fixL = $(".fancybox-prev span"),
                fixR = $(".fancybox-next span"),

                fixTPosition, fixTPosition, fixTPosition = 0;

            if (forse == true || winScrollTop >= mainOffsetTop - 20 && scrollTop <= (mainHeight - sinHeightHalf) - 120) {
                fixT.stop(true).animate({"margin-top": scrollTop}, 300);
                fixL.stop(true).animate({"margin-top": (scrollTop + sinHeightHalf)}, 300);
                fixR.stop(true).animate({"margin-top": (scrollTop + sinHeightHalf)}, 300);
            }
            if (winScrollTop <= mainOffsetTop - 20) {
                fixT.stop(true).animate({"margin-top": 0}, 300);
                fixL.stop(true).animate({"margin-top": sinHeightHalf}, 300);
                fixR.stop(true).animate({"margin-top": sinHeightHalf}, 300);
            }
        }

        $(".fancy-big").fancybox({
            fitToView: false,
            padding: 0,

            helpers: {
                overlay: {
                    locked: false
                }
            },

            afterShow: function () {
                $(".fancybox-skin").addClass('fancy-bigs');

                fancyFixNav(true);

                $(window).bind("scroll touchmove", function () {
                    fancyFixNav();
                });
                $(window).bind("resize", function () {
                    fancyFixNav();
                });
            }
        });
    });
});