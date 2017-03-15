//$.shimba('.popover-item').module('popover');
$(function () {
    $.shimba().module('popover', function (selector, option, obj, globObj) {
        if ($(selector).length && $.shimba().issetModule('events')) {
            var opt = {
                    actionItem: '.actionItem',
                    popover: '.sh-popover',
                    popoverItem: '.sh-popover__item',
                    cloneClass: '.is-clone',
                    activeClass: '.is-active',
                    hideClass: '.is-hide',

                    action: 'hover', //hover, click
                    focus: true,

                    position: 'top',//top bottom left right

                    showTimeOut: 250,
                    hideTimeOut: 250,

                    initFunc: function (data, opt) {

                    },

                    beforeActiveFunc: function (actionItem, popoverClone, data) {

                    },

                    afterActiveFunc: function (actionItem, popoverClone, data) {

                    },

                    beforeHideFunc: function (actionItem, popoverClone, data) {

                    },

                    afterHideFunc: function (actionItem, popoverClone, data) {

                    },

                    itemActionFunc: function (item, popover, event, data) {

                    }
                },
                clickHandler = $.shimba().clickHandler(),
                event  = $.shimba().module('events'),
                data = {
                    main: undefined,
                    actionItem: undefined,
                    popover: undefined,

                    popoverClone: undefined,
                    timeoutLeave: undefined,
                    timeoutMove: undefined,
                    popoverPlace: undefined,
                    itemPosition: undefined,
                    popoverPosition: undefined,

                    windowProp: {},
                    popoverSize: {},
                    itemSize: {}
                };

            opt = $.extend({}, opt, option);

            var method = {
                init: function () {
                    data.main = $.shimba().setSelectorBlock(selector, opt);

                    if (!data.main) {
                        return false;
                    }

                    data.actionItem = data.main.find(opt.actionItem);
                    data.popover = data.main.find(opt.popover);
                    data.sliceClass = {
                        'activeClass': opt.activeClass.slice(1),
                        'cloneClass': opt.cloneClass.slice(1),
                        'hideClass': opt.hideClass.slice(1)
                    }

                    method.popoverClone();

                    method.windowEvents();

                    method.setEventAction();

                    method.popoverInit();

                    method.windowEvent();
                },

                windowEvents: function () {
                    method.getWindow();
                    method.getItemsSize();
                    method.getItemsPosition();
                },

                windowEvent: function () {
                    $(window).on('scroll resize', function () {
                        if (data.popoverClone.is(opt.activeClass)) {
                            method.windowEvents();
                            method.setPopoverPosition();
                        }
                    });
                },

                setEventAction: function () {
                    switch (opt.action) {
                        case 'click':
                            method.clickFunc();
                            break;

                        default:
                        case 'hover':
                            method.hoverFunc();
                            break;
                    }
                },

                popoverClone: function () {
                    data.popoverClone = data.popover.clone();

                    data.popoverClone.addClass(data.sliceClass.cloneClass);
                    data.popoverClone.prependTo('body');

                    if (opt.popoverItem) {
                        data.popoverClone.find(opt.popoverItem).on(clickHandler, function (event) {
                            opt.itemActionFunc($(this), data.popoverClone, event, data);
                        })
                    }
                },

                popoverInit: function () {
                    opt.initFunc(data, opt);

                    if (data.main.is(opt.activeClass)) {
                        method.showFunc();
                    } else {
                        data.popover.css({'display': 'none'});
                    }

                    event.addTargetList(opt.popover, clickHandler, function (index, value, event) {
                        method.hideFunc();
                    });
                },

                getWindow: function () {
                    var $window = $(window);

                    data.windowProp = {
                        'top': $window.height() + $window.scrollTop(),
                        'height': $window.height(),
                        'width': $window.width()
                    };
                },

                getItemsSize: function () {
                    data.popoverSize = {
                        'width': data.popoverClone.outerWidth(),
                        'height': data.popoverClone.outerHeight()
                    };
                    data.itemSize = {
                        'width': data.actionItem.outerWidth(),
                        'height': data.actionItem.outerHeight()
                    };
                },

                getPlace: function (popoverPlace) {
                    var placement;

                    switch (popoverPlace) {
                        case 'top':
                            placement = (data.itemPosition.top - data.popoverSize.height > data.windowProp.top - data.windowProp.height) ? 'top' : 'bottom';
                            break;

                        case 'bottom':
                            placement = ((data.itemPosition.top + data.itemPosition.height) + data.popoverSize.height < data.windowProp.top) ? 'bottom' : 'top';
                            break;

                        case 'left':
                            placement = (data.popoverPosition.left - data.popoverSize.width > data.itemPosition.width) ? 'left' : 'right';
                            break;

                        default:
                        case 'right':
                            placement = (data.popoverPosition.right + data.popoverSize.width < data.windowProp.width) ? 'right' : 'left';
                            break;
                    }

                    return placement;
                },

                getPlaceAlign: function (popoverPlace) {
                    var placement, popoverCenter, popoverCenterFrom, popoverCenterTo;

                    switch (popoverPlace) {
                        case 'top':
                        case 'bottom':
                            popoverCenter = (data.popoverSize.width / 2);
                            popoverCenterFrom = data.itemPosition.left + popoverCenter;
                            popoverCenterTo = data.itemPosition.left - popoverCenter;

                            placement = ((popoverCenterFrom < data.windowProp.width) && (popoverCenterTo < data.windowProp.width) && popoverCenterFrom > 0 && popoverCenterTo > 0) ? '-center' : (data.itemPosition.left + data.popoverSize.width < data.windowProp.width) ? '-left' : '-right';
                            break;

                        case 'right':
                        case 'left':
                            popoverCenter = (data.popoverSize.height / 2);
                            popoverCenterFrom = data.itemPosition.top - popoverCenter;
                            popoverCenterTo = data.itemPosition.top + popoverCenter;

                            placement = ((popoverCenterFrom > data.windowProp.top - data.windowProp.height) && (popoverCenterTo < data.windowProp.top) && popoverCenterFrom > 0 && popoverCenterTo > 0) ? '-center' : (data.itemPosition.top - data.popoverSize.height > data.windowProp.top - data.windowProp.height) ? '-top' : '-bottom';
                            break;
                    }

                    return popoverPlace + placement;
                },

                getItemsPosition: function () {
                    var elementOffset = data.actionItem.offset(),
                        elementScroll = data.actionItem.scrollTop(),
                        elementAbsolute = data.actionItem[0].getBoundingClientRect(),
                        popoverPositionData = data.popoverClone.data('position'),
                        popoverPosition = $.extend({}, elementAbsolute, elementScroll, data.popoverSize),
                        popoverPlace = (popoverPositionData != undefined && popoverPositionData.length > 0) ? popoverPositionData : opt.position;

                    data.itemPosition = $.extend({}, elementOffset, data.itemSize);
                    data.popoverPosition = popoverPosition;
                    data.popoverPlace = method.getPlace(popoverPlace);
                    data.popoverPlace = method.getPlaceAlign(data.popoverPlace);
                },

                setPopoverPosition: function () {
                    var calculatePosition = method.getCalculatePosition(data.popoverPlace);

                    data.popoverClone.removeClass('top bottom left right').addClass(data.popoverPlace).css(calculatePosition);
                },

                getCalculatePosition: function (popoverPlace, itemPosition) {
                    var cssPosition = '';

                    switch (popoverPlace) {
                        case 'top-center':
                            cssPosition = {
                                top: data.itemPosition.top - data.popoverPosition.height,
                                left: data.itemPosition.left + data.itemPosition.width / 2 - data.popoverSize.width / 2
                            };
                            break;

                        case 'bottom-center':
                            cssPosition = {
                                top: data.itemPosition.top + data.itemPosition.height,
                                left: data.itemPosition.left + data.itemPosition.width / 2 - data.popoverSize.width / 2
                            };
                            break;

                        case 'left-center':
                            cssPosition = {
                                top: data.itemPosition.top + data.itemPosition.height / 2 - data.popoverSize.height / 2,
                                left: data.itemPosition.left - data.popoverSize.width
                            };
                            break;

                        case 'right-center':
                            cssPosition = {
                                top: data.itemPosition.top + data.itemPosition.height / 2 - data.popoverSize.height / 2,
                                left: data.itemPosition.left + data.itemPosition.width
                            };
                            break;



                        case 'top-left':
                            cssPosition = {
                                top: data.itemPosition.top - data.popoverPosition.height,
                                left: data.itemPosition.left
                            };
                            break;

                        case 'top-right':
                            cssPosition = {
                                top: data.itemPosition.top - data.popoverPosition.height,
                                left: data.itemPosition.left - data.popoverSize.width + data.itemPosition.width
                            };
                            break;

                        case 'bottom-left':
                            cssPosition = {
                                top: data.itemPosition.top + data.itemPosition.height,
                                left: data.itemPosition.left
                            };
                            break;

                        case 'bottom-right':
                            cssPosition = {
                                top: data.itemPosition.top + data.itemPosition.height,
                                left: data.itemPosition.left - data.popoverSize.width + data.itemPosition.width
                            };
                            break;

                        case 'left-top':
                            cssPosition = {
                                top: data.itemPosition.top + data.itemPosition.height - data.popoverSize.height,
                                left: data.itemPosition.left - data.popoverSize.width
                            };
                            break;

                        case 'left-bottom':
                            cssPosition = {
                                top: data.itemPosition.top + data.itemPosition.height - data.itemPosition.height / 2,
                                left: data.itemPosition.left - data.popoverSize.width
                            };
                            break;

                        case 'right-top':
                            cssPosition = {
                                top: data.itemPosition.top + data.itemPosition.height - data.popoverSize.height,
                                left: data.itemPosition.left + data.itemPosition.width
                            };
                            break;

                        case 'right-bottom':
                            cssPosition = {
                                top: data.itemPosition.top + data.itemPosition.height - data.itemPosition.height / 2,
                                left: data.itemPosition.left + data.itemPosition.width
                            };
                            break;

                    }
                    return cssPosition;
                },

                setPopoverEvent: function (popover) {
                    popover.on('mousemove mouseenter', function (event) {
                        if (data.timeoutLeave != undefined) {
                            clearTimeout(data.timeoutLeave);

                            data.timeoutLeave = data.timeoutMove = undefined;
                        }
                    }).on('mouseleave', function () {
                        method.hideFunc();
                    });
                },

                hoverFunc: function () {
                    data.main.on('mousemove mouseenter', function (event) {
                        if ((data.actionItem.is(event.target) || data.actionItem.has(event.target).length > 0) && !data.actionItem.is(opt.activeClass) && data.timeoutMove == undefined) {
                            if (data.timeoutLeave != undefined) {
                                clearTimeout(data.timeoutLeave);
                                data.timeoutLeave = undefined;
                            }

                            data.timeoutMove = setTimeout(function () {
                                method.showFunc();
                            }, opt.showTimeOut);
                        }
                    }).on('mouseleave', function () {
                        data.timeoutLeave = setTimeout(function () {
                            clearTimeout(data.timeoutMove);
                            data.timeoutMove = undefined;
                            method.hideFunc();
                        }, opt.hideTimeOut);
                    });

                    if (opt.focus) {
                        method.setPopoverEvent(data.popoverClone);
                    }
                },

                clickFunc: function () {
                    data.actionItem.on(clickHandler, function (event) {
                        event.preventDefault();
                        
                        if ($(this).is(opt.activeClass)) {
                            method.hideFunc();
                        } else {
                            method.showFunc();
                        }
                    });

                    if (!opt.focus) {
                        data.actionItem.on('mouseleave', function () {
                            data.timeoutLeave = setTimeout(function () {
                                clearTimeout(data.timeoutMove);
                                data.timeoutMove = undefined;
                                method.hideFunc();
                            }, opt.hideTimeOut);
                        });
                    }
                },

                showFunc: function () {
                    method.windowEvents();
                    method.popoverIn();

                    event.addTarget(data.popoverClone);
                },

                hideFunc: function () {
                    method.popoverOut();

                    event.removeTarget(data.popoverClone);
                },

                popoverIn: function () {
                    if (!data.actionItem.is(opt.activeClass) && !data.popover.is(opt.activeClass)) {
                        opt.beforeActiveFunc(data.actionItem, data.popoverClone, data);

                        method.setPopoverPosition();
                        data.actionItem.addClass(data.sliceClass.activeClass).removeClass(data.sliceClass.hideClass);
                        data.popoverClone.addClass(data.sliceClass.activeClass).removeClass(data.sliceClass.hideClass);

                        opt.afterActiveFunc(data.actionItem, data.popoverClone, data);
                    }
                },

                popoverOut: function () {
                    opt.beforeHideFunc(data.actionItem, data.popoverClone, data);

                    data.actionItem.addClass(data.sliceClass.hideClass).removeClass(data.sliceClass.activeClass);

                    if (data.popoverClone != undefined) {
                        data.popoverClone.addClass(data.sliceClass.hideClass).removeClass(data.sliceClass.activeClass);
                    }

                    opt.afterHideFunc(data.actionItem, data.popoverClone, data);
                }
            };

            method.init();



            return {
                showFunc: method.showFunc,
                hideFunc: method.hideFunc
            };
        }
    });
});