/*
 include '/scripts/animation/TweenMax.min.js'
 include '/scripts/animation/TimelineMax.min.js'
 include '/scripts/animation/easing/EasePack.min.js'
 include '/scripts/animation/plugins/CSSPlugin.min.js'
 include '/scripts/animation/jquery.scrollmagic.min.js'
 */
//$.shimba().module('animation');
$(function () {
    $.shimba().module('animation', function (selector, option, obj, globObj) {
        var methodPrivate = {
            parseJson: function (el) {
                return JSON.parse(el);
            },

            getAnimation: function (element, defaultAnim) {
                var option;

                if (typeof(element) == 'string') {
                    option = (element != undefined) ? methodPrivate.parseJson(element) : {};
                } else {
                    option = (!$.isEmptyObject(element)) ? element : {};
                }

                if ($.isEmptyObject(option)) {
                    option = (defaultAnim != undefined) ? defaultAnim : {};
                }

                return option;
            }
        };

        var methodPublic = {
            startAppearAnimate: function () {
                var appearClass = '.appear';

                $(appearClass).each(function () {
                    var props = methodPrivate.getAnimation($(this).attr('data-appear-animate')), i;

                    $(this).css(props);
                });

                $(window).on('load scroll resize', function () {
                    var windowScroll = $(window).scrollTop();
                    var viewportHeight = $(window).height();
                    var documentHeight = $(document).height();
                    $(appearClass).each(function () {
                        var that = $(this),
                            height = that.height(),
                            offsetTop = that.offset().top,
                            speed = (that.attr('data-appear-speed') != undefined) ? parseInt(that.attr('data-appear-speed')) : 0,
                            noScroll = (that.data('appear-no-scroll') != undefined && that.data('appear-no-scroll') == true),

                            scrollMin = offsetTop - viewportHeight + height,
                            scrollMax = scrollMin + parseInt(that.attr('data-appear-range')) + speed,

                            props = methodPrivate.getAnimation(that.attr('data-appear-animate')),
                            propsReverse = methodPrivate.getAnimation(that.attr('data-appear-reverse'));

                        if (windowScroll > scrollMax) {
                            that.css(props);
                            if (noScroll) {
                                that.data('is_animated', true)
                            }
                        } else if (windowScroll < scrollMin) {
                            if (that.data('is_animated') == undefined || that.data('is_animated') != true) {
                                that.css(propsReverse);
                            }
                        } else {
                            if (that.data('is_animated') == undefined || that.data('is_animated') != true) {
                                var perc = (windowScroll - scrollMin) / (scrollMax - scrollMin);
                                $.each(props, function (key, val) {
                                    var propsInt = val.toString().replace(/[^\d.]/g, '');
                                    var propsName = val.toString().replace(/[A-Za-z$-]/g, '');
                                    var reverseInt = propsReverse[key].toString().replace(/[^\d.]/g, '');
                                    var reverseName = propsReverse[key].toString().replace(/[A-Za-z$-]/g, '');

                                    if (propsInt > reverseInt) {
                                        that.css(key, (propsInt - reverseInt) * perc);
                                    } else {
                                        that.css(key, reverseInt - ((reverseInt - propsInt) * perc));
                                    }
                                });
                            }
                        }
                    });
                });

            },

            startVelocityAnimate: function () {
                $('.velocity').each(function () {
                    var that = $(this),
                        thisPropsAnim = methodPrivate.getAnimation(that.attr('data-velocity-animate')),
                        thisPropsReverse = methodPrivate.getAnimation(that.attr('data-velocity-reverse')),
                        thisSpeed = (that.attr('data-velocity-speed') != undefined) ? parseInt(that.attr('data-velocity-speed')) : 0,
                        noScroll = (that.data('velocity-no-scroll') != undefined && that.data('velocity-no-scroll') == true);

                    if (!$.isEmptyObject(thisPropsReverse)) {
                        that.css(thisPropsReverse).velocity(thisPropsAnim, thisSpeed);
                    } else {
                        that.velocity(thisPropsAnim, thisSpeed);
                    }
                });

                $('.velocity-scroll').each(function () {
                    var thisPropsReverse = methodPrivate.getAnimation($(this).attr('data-velocity-reverse'));

                    if (!$.isEmptyObject(thisPropsReverse)) {
                        $(this).css(thisPropsReverse);
                    }
                });

                $(window).on('load scroll resize', function () {
                    var windowScroll = $(window).scrollTop();
                    var viewportHeight = $(window).height();
                    var documentHeight = $(document).height();

                    $('.velocity-scroll').each(function () {
                        var that = $(this),
                            height = that.height(),
                            offsetTop = that.offset().top,
                            scrollMin = offsetTop - viewportHeight + height,
                            thisRange = (that.attr('data-velocity-range') != undefined) ? parseInt(that.attr('data-velocity-range')) : 0,
                            thisSpeed = (that.attr('data-velocity-speed') != undefined) ? parseInt(that.attr('data-velocity-speed')) : 0,
                            scrollMax = scrollMin + thisRange,
                            thisPropsAnim = methodPrivate.getAnimation(that.attr('data-velocity-animate'));

                        if (that.not('.animate') && windowScroll > scrollMax) {
                            that.addClass('animate');
                            that.velocity(thisPropsAnim, thisSpeed);
                        }
                    });
                });
            },

            startTweenAnimate: function () {
                var animateAction = '[data-animate-action]',
                    animateData = 'animate-action',
                    animateDataAddClass = 'added-class',
                    animateRange = 'data-range',
                    animateSpeed = 'data-speed';

                $(animateAction).each(function () {
                    var thisPropsReverse = methodPrivate.getAnimation($(this).attr('data-reverse'));

                    if (thisPropsReverse != undefined && $.map(thisPropsReverse, function (n, i) {
                            return i;
                        }).length) {
                        $(this).css(thisPropsReverse);
                    }
                });

                var controllerAnimation = new ScrollMagic({
                    globalSceneOptions: {
                        triggerHook: 0.7
                    }
                });
                var arrTween = [];

                $('[data-tween-animate="true"]').each(function () {
                    var that = $(this),
                        tweenTrigger = that.data("tween-trigger"),
                        tweenParam = methodPrivate.getAnimation(that.data("tween-param")),
                        scrollParam = methodPrivate.getAnimation(that.data("scroll-param")),
                        tweenPropsReverse = methodPrivate.getAnimation(that.data('reverse')),
                        tweenPropsAnimate = methodPrivate.getAnimation(that.data('animate')),
                        tweenDuration = (that.data('duration') != undefined) ? parseInt(that.data('duration')) : 0,
                        tweenOffset = (that.data('offset') != undefined) ? parseInt(that.data('offset')) : 0,
                        tweenSpeed = (that.data('speed') != undefined) ? parseInt(that.data('speed')) : 0,
                        tweenAdded, TimeLine;

                    if ($.isEmptyObject(tweenParam)) {
                        TimeLine = new TimelineMax();
                    } else {
                        TimeLine = new TimelineMax(tweenParam);
                    }

                    TimeLine.add(TweenMax.fromTo(that, tweenSpeed, tweenPropsReverse, tweenPropsAnimate));
                    scrollParam.triggerElement = tweenTrigger;
                    scrollParam.offset = tweenOffset;
                    scrollParam.duration = tweenDuration;
                    tweenAdded = new ScrollScene(scrollParam).setTween(TimeLine);

                    arrTween.push(tweenAdded);
                });

                controllerAnimation.addScene(arrTween);

                $(window).on('load scroll resize', function () {
                    var windowScroll = $(window).scrollTop();
                    var viewportHeight = $(window).height();
                    var documentHeight = $(document).height();
                    $(animateAction).each(function (i, el) {
                        var that = $(this),
                            height = that.height(),
                            offsetTop = that.offset().top,
                            scrollMin = offsetTop - viewportHeight + height,
                            thisRange = (that.attr(animateRange) != undefined) ? parseInt(that.attr(animateRange)) : 0,
                            thisSpeed = (that.attr(animateSpeed) != undefined) ? parseInt(that.attr(animateSpeed)) : 0,
                            scrollMax = scrollMin + thisRange,
                            animateMode = that.attr(animateData),
                            animateAddClass, animateAddClassTimeOut, addClassToEl;

                        switch (animateMode) {
                            case'addClass':
                                if (that.not('.animate') && windowScroll > scrollMax) {
                                    animateAddClass = that.data(animateDataAddClass);
                                    that.addClass('animate').addClass(animateAddClass);
                                }
                                break;

                            case'addIntervalClass':
                                if (that.not('.animate') && windowScroll > scrollMax) {
                                    animateAddClass = that.data(animateDataAddClass);
                                    animateAddClassTimeOut = 100;
                                    addClassToEl = function ($el) {
                                        $el.addClass(animateAddClass);
                                    };

                                    setTimeout(function () {
                                        addClassToEl($(el))
                                    }, i++ * animateAddClassTimeOut);
                                }
                                break;

                            default:
                                return false;
                        }
                    });
                });

            },

            startIntervalAnimate: function () {
                var animScaleClass = $(".animate-scale");
                var addScaleClass = 'animation-loaded';
                var animSacleTimeOut = 100;

                var addClassToEl = function ($el) {
                    $el.addClass(addScaleClass);
                };

                animScaleClass.each(function (i, el) {
                    setTimeout(function () {
                        addClassToEl($(el))
                    }, i++ * animSacleTimeOut);
                });
            }
        };

        return methodPublic;
    });
});