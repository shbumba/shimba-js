//$.shimba('#header-wrap').module('fixed-header-scroll');
$(function () {
    $.shimba().module('fixed-header-scroll', function (selector, option, obj, globObj) {
        if ($(selector).length) {
            var settings = {
                    headerTop: ".header-top",
                    headerMid: ".header-middle",
                    headerBot: ".header-bottom",
                    navBlock: "nav",
                    navList: "#navigation",
                    navTopList: "#top_line_nav",
                    respNavButton: ".responsive_nav",
                    respTopNavButton: ".responsive_top_nav",
                    fixedClass: ".fixed_header",
                    fixedClassBlock: "#page",
                    navScrolledClass: "nav-scrolled",
                    navScrolledInitClass: "scrolled-init",
                    respHideBlocks: "",
                    maxWidthMid: 400,
                    maxWidthBot: 400,
                    changeTopHeight: true,
                    changeMidHeight: true,
                    mobileDisabled: true
                },
                clickHandler = $.shimba().clickHandler(),
                element = selector,
                $element = $(element),
                vars = {};

            settings = $.extend({}, settings, option);

            var method = {
                init: function () {
                    vars.newTopHeight = 0;
                    vars.newMidHeight = 50;

                    method.setHeaderVars();

                    if (settings.mobileDisabled && vars.isMobile) {
                        return false;
                    }

                    method.startHeader();
                },

                setHeaderVars: function () {
                    vars.headerMidString = settings.headerMid;
                    vars.headerTop = $element.find("> " + settings.headerTop);
                    vars.headerMid = $element.find("> " + vars.headerMidString);
                    vars.headerBot = $element.find("> " + settings.headerBot);
                    vars.offsetTop = $element.offset().top;
                    vars.respNavButton = $element.find(settings.respNavButton);
                    vars.respTopNavButton = $element.find(settings.respTopNavButton);
                    vars.respHideBlocks = $(settings.respHideBlocks);
                    vars.navListString = settings.navList;
                    vars.navTopListString = settings.navTopList;
                    vars.navBlockString = settings.navBlock;
                    vars.navBlock = $element.find(vars.navListString).parents(vars.navBlockString);
                    vars.navTopBlock = $element.find(vars.navTopListString).parents(vars.navBlockString);
                    vars.midChangeHeightBlocksResp = $(vars.headerMidString + ", " + vars.headerMidString + " .header_mid_outer, " + vars.headerMidString + " " + vars.navListString + ", " + vars.headerMidString + " " + vars.navListString + " > li, " + vars.headerMidString + " " + vars.navListString + " > li > a, " + vars.headerMidString + " " + vars.navListString + " > li > a > span.nav_bg_clr");
                    vars.topHeight = 0;
                    vars.midHeight = 0;
                    vars.botHeight = 0;
                    vars.win = $(window);
                    vars.winScrollTop = vars.win.scrollTop();
                    vars.winMidScrollTop = vars.winScrollTop - vars.topHeight - vars.midHeight;
                    vars.isMobile = "ontouchstart" in document.documentElement;

                },

                startHeader: function () {
                    if (vars.headerTop.length > 0) {
                        vars.topHeight = Number(vars.headerTop.attr("data-height"))
                    }
                    if (vars.headerMid.length > 0) {
                        vars.midHeight = Number(vars.headerMid.attr("data-height"))
                    }
                    if (vars.headerBot.length > 0) {
                        vars.botHeight = Number(vars.headerBot.attr("data-height"))
                    }
                    if (vars.winScrollTop == 0) {
                        $element.css({
                            opacity: 1
                        })
                    }
                    $element.addClass(settings.navScrolledInitClass);
                    method.attachEvents();
                    vars.win.trigger("scroll")
                },

                attachEvents: function () {
                    vars.respNavButton.on(clickHandler, function () {
                        if (vars.respNavButton.is(":not(.active)")) {
                            vars.navBlock.css({
                                display: "block"
                            });
                            vars.respHideBlocks.css({
                                display: "none"
                            });
                            vars.respNavButton.addClass("active")
                        } else {
                            vars.navBlock.css({
                                display: "none"
                            });
                            vars.respHideBlocks.css({
                                display: "block"
                            });
                            vars.respNavButton.removeClass("active")
                        }
                        return false
                    });
                    vars.respTopNavButton.on(clickHandler, function () {
                        if (vars.respTopNavButton.is(":not(.active)")) {
                            vars.navTopBlock.css({
                                display: "block"
                            });
                            vars.respHideBlocks.css({
                                display: "none"
                            });
                            vars.respTopNavButton.addClass("active")
                        } else {
                            vars.navTopBlock.css({
                                display: "none"
                            });
                            vars.respHideBlocks.css({
                                display: "block"
                            });
                            vars.respTopNavButton.removeClass("active")
                        }
                        return false
                    });
                    vars.win.bind("scroll touchmove", function () {

                        if ($element.parents(settings.fixedClassBlock).is(":not(" + settings.fixedClass + ")") || settings.mobileDisabled && vars.isMobile) {
                            return false
                        }
                        if (vars.win.width() > settings.maxWidthMid) {
                            method.getScrollTop()
                        }
                    });
                    vars.win.bind("resize", function () {
                        if (vars.headerBot.length > 0) {
                            method.headerResize(settings.maxWidthBot)
                        } else {
                            method.headerResize(settings.maxWidthMid)
                        }
                    })
                },

                getScrollTop: function () {
                    vars.winScrollTop = vars.win.scrollTop();
                    vars.winMidScrollTop = vars.winScrollTop - vars.topHeight - vars.midHeight;

                    if (vars.winScrollTop > vars.topHeight + vars.midHeight + vars.botHeight) {

                        $element.css({
                            marginTop: -(vars.topHeight + vars.midHeight + vars.botHeight),
                            paddingTop: vars.botHeight,
                            opacity: 1
                        }).addClass(settings.navScrolledClass)
                    } else {
                        $element.removeClass(settings.navScrolledClass).css({
                            marginTop: -vars.winScrollTop,
                            paddingTop: 0,
                            opacity: 1
                        })
                    }
                },

                headerResize: function (e) {
                    if (vars.win.width() > e) {
                        vars.navBlock.removeAttr("style");
                        vars.respHideBlocks.removeAttr("style");
                        vars.respNavButton.removeClass("active");
                        method.getScrollTop()
                    } else {
                        $element.removeAttr("style").removeClass(settings.navScrolledClass).css({
                            opacity: 1
                        })
                    }
                }
            };
            method.init()
        }
    });
});