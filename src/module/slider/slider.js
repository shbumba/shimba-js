/*
 $.shimba('#slider-offer').module('slider', {
 timeOut: 1000000,
 pager: true,
 stopPointing: true
 });
 */
$(function () {
    $.shimba().module('slider', function (selector, option, obj, globObj) {
        if (selector.length) {
            var settings = {
                mode: 'horizontal',

                mainClass: '.slider',
                slideList: '.slide-list',

                mainImgBlockClass: '.slide-picture',
                nextBtnClass: '.btn-next',
                prevBtnClass: '.btn-prev',
                slidePagerClass: '.slider-pager',
                slidePagerItemClass: '.pager-item',
                slideControlClass: '.slider-control',
                autoDirection: 'next',

                slideClass: '.slide',

                adaptiveHeight: false,
                adaptiveHeightSpeed: 500,

                easing: null,
                infiniteLoop: true,
                stopPointing: true,
                resizeImage: false,
                pager: true,
                control: true,
                setSlideHeightContent: true,
                startResizeImageWidth: 1360,
                stopResizeImageWidth: 980,
                timeOut: 1000,
                slideIn: 300,
                slideOut: 300,
                transTo: null,
                inTransition: false,
                mouseOver: false,
                hideImageAfterCallback: false,
                showImageAfterCallback: false,

                curIndex: 0,

                onSlideInit: null,
                onSlideBefore: null,
                onSlideAfter: null,
                onSlideNext: function () {
                },
                onSlidePrev: function () {
                },
                onSliderResize: function () {
                }
            };

            settings = $.extend(settings, option);

            var vars = {
                slider: null,
                slideList: null,
                slides: null,

                loader: null,

                nextLink: null,
                prevLink: null,

                loadingImages: [],
                controls: {}

            };

            var clickHandler = $.shimba().clickHandler();
            var method = {
                init: function () {

                    vars.slider = method.setSlider((typeof(selector) == 'object' && selector instanceof jQuery) ? selector : $(selector));

                    if (!vars.slider) {
                        return false;
                    }

                    vars.slideList = vars.slider.find(settings.slideList);
                    vars.slides = vars.slideList.find(settings.slideClass);
                    vars.nextLink = vars.slider.find(settings.nextBtnClass);
                    vars.prevLink = vars.slider.find(settings.prevBtnClass);

                    settings.slideCount = vars.slides.length;

                    vars.slider.addClass(settings.mainClass.slice(1));

                    vars.loader = $('<div class="loading" />');
                    vars.slideList.prepend(vars.loader);

                    if (vars.prevLink.length > 0 && vars.nextLink.length > 0) {
                        vars.prevLink.on(clickHandler, method.slidePrev);

                        vars.nextLink.on(clickHandler, method.slideNext);
                    } else {
                        if (settings.control) {
                            method.appendControls();
                        }
                    }

                    if (settings.pager && settings.slideCount > 0) {
                        method.appendPager();
                    }

                    method.slideCreateImage(function () {
                        method.loadElements(vars.slides.eq(settings.curIndex), function () {
                            method.start();
                        });
                    });
                },

                start: function () {

                    if (settings.infiniteLoop && settings.mode != 'fade') {
                        var sliceAppend = vars.slides.slice(0, 1).clone().addClass('clone');
                        var slicePrepend = vars.slides.slice(-1).clone().addClass('clone');
                        vars.slideList.append(sliceAppend).prepend(slicePrepend);
                    }

                    vars.loader.remove();

                    if (settings.stopPointing) {
                        vars.slider.mouseenter(function () {
                            settings.mouseOver = true;
                            clearTimeout(settings.transTo);
                        }).mouseleave(function () {
                            settings.mouseOver = false;
                            method.clickNextCallback();
                        });
                    }

                    if (settings.resizeImage) {
                        $(window).bind('resize', method.slideResizeImage);
                    }

                    method.slideIn(settings.curIndex, method.clickNextCallback);

                },

                parseJson: function (el) {
                    return JSON.parse(el);
                },

                setSlider: function (slider) {
                    if (slider.length == 0) {
                        return false;
                    }

                    if (slider.length > 1) {
                        slider.each(function () {
                            $.shimba($(this)).module('slider', settings);
                        });
                        return false;
                    }

                    return slider;
                },

                loadElements: function (element, callback) {
                    var total = element.find('img, iframe').length;
                    if (total == 0) {
                        callback();
                        return;
                    }
                    var count = 0;
                    element.find('img, iframe').each(function () {
                        $(this).one('load', function () {
                            if (++count == total) {
                                callback();
                            }
                        }).each(function () {
                            if (this.complete) {
                                $(this).load();
                            }
                        });
                    });
                },

                getImageAnimation: function (element, defaultAnim) {
                    var option;

                    if (typeof(element) == 'string') {
                        option = (element != undefined) ? method.parseJson(element) : {};
                    } else {
                        option = (!$.isEmptyObject(element)) ? element : {};
                    }

                    if ($.isEmptyObject(option)) {
                        option = (defaultAnim != undefined) ? defaultAnim : {};
                    }

                    return option;
                },

                clickNextCallback: function () {
                    clearTimeout(settings.transTo);
                    settings.transTo = setTimeout(function () {
                        method.slideNext();
                    }, settings.timeOut);
                },

                slideIn: function (int, cb) {
                    settings.inTransition = true;

                    var slide = vars.slides.eq(int),
                        slideCallBack = function () {
                            settings.inTransition = false;
                            if (settings.showImageAfterCallback) {
                                method.slideImageAnimation(slide, 'in');
                            }
                            if (cb && !settings.mouseOver) {
                                cb();
                            }
                        };

                    if (slide != undefined) {
                        if (settings.pager) {
                            method.addPagerActive(int);
                        }

                        slide.css({display: 'block'});

                        if (settings.onSlideInit != null) {
                            settings.onSlideInit(slide, int, settings);
                        }

                        if (!settings.showImageAfterCallback) {
                            method.slideImageAnimation(slide, 'in');
                        }

                        if (settings.onSlideBefore != null) {
                            settings.onSlideBefore(slide, int, slideCallBack, settings);
                        } else {
                            slideCallBack();
                        }
                    }
                },

                slideOut: function (int, cb) {
                    settings.inTransition = true;

                    var slide = vars.slides.eq(int),
                        slideCallBack = function () {
                            settings.inTransition = false;

                            if (settings.hideImageAfterCallback) {
                                method.slideImageAnimation(slide, 'out');
                            }

                            if (cb) {
                                cb();
                            }
                        };

                    if (slide != undefined) {
                        if (settings.pager) {
                            method.removePagerActive();
                        }
                        if (!settings.hideImageAfterCallback) {
                            method.slideImageAnimation(slide, 'out');
                        }
                        if (settings.onSlideAfter != null) {
                            settings.onSlideAfter(slide, int, slideCallBack, settings)
                        } else {
                            slideCallBack();
                        }
                    }
                },

                slideNext: function (e) {
                    if (!settings.inTransition) {
                        var total = settings.slideCount;
                        var nextIndex = settings.curIndex == total - 1 ? 0 : settings.curIndex + 1;

                        if (settings.curIndex != nextIndex) {
                            settings.onSlideNext(e, settings.curIndex, settings);

                            method.slideOut(settings.curIndex, function () {
                                settings.curIndex = nextIndex;
                                method.slideIn(settings.curIndex, method.clickNextCallback);
                            });
                        }
                    }

                    if (e) {
                        e.preventDefault();
                    }

                    return false;
                },

                slidePrev: function (e) {
                    if (!settings.inTransition) {
                        var total = settings.slideCount;
                        var nextIndex = settings.curIndex == 0 ? total - 1 : settings.curIndex - 1;

                        if (settings.curIndex != nextIndex) {
                            settings.onSlidePrev(e, settings.curIndex, settings);

                            method.slideOut(settings.curIndex, function () {
                                settings.curIndex = nextIndex;
                                method.slideIn(settings.curIndex, method.clickNextCallback);
                            });
                        }
                    }

                    if (e) {
                        e.preventDefault();
                    }

                    return false;
                },

                slideImageAnimation: function (slide, mode) {
                    var slideAnimationStart = method.getImageAnimation(slide.data("animation-start"), {opacity: 1}),
                        slideAnimationEnd = method.getImageAnimation(slide.data("animation-end"), {opacity: 0}),
                        thisImage = slide.find(settings.mainImgBlockClass);

                    switch (mode) {
                        default:
                        case 'in':
                            thisImage.css(slideAnimationEnd).animate(slideAnimationStart, settings.slideIn);
                            break;

                        case 'out':
                            thisImage.css(slideAnimationStart).animate(slideAnimationEnd, settings.slideOut, function () {
                                slide.css({display: 'none'});
                            });
                            break;

                        case 'load':
                            thisImage.css(slideAnimationStart);
                            break;
                    }
                },

                setHeightSlide: function (slide, newHeight) {
                    if (settings.resizeImage) {
                        method.slideResizeImage();
                    } else {
                        var slideHeight = slide.height();

                        if (settings.setSlideHeightContent) {
                            if (newHeight != 0 && newHeight > slideHeight) {
                                slideHeight = newHeight;
                            }
                        } else {
                            slideHeight = newHeight;
                        }

                        vars.slideList.animate({height: slideHeight}, {
                            queue: false,
                            duration: settings.slideIn
                        });
                        slide.css({height: slideHeight});
                    }
                },

                slideResizeImage: function () {
                    var windowWidth = $(window).width();

                    vars.slides.each(function (slideKey, slideValue) {
                        var slide = $(this),
                            slideImage = slide.find(settings.mainImgBlockClass);

                        if (slideImage != undefined && slide.data('is-load') == true && settings.curIndex == slideKey) {
                            var imageWidth = slideImage.data('width'),
                                imageHeight = slideImage.data('height'),
                                newImageWidth = imageWidth,
                                newImageHeight = imageHeight;

                            if (windowWidth <= settings.startResizeImageWidth) {
                                if (windowWidth > settings.stopResizeImageWidth) {
                                    newImageWidth = imageWidth - (settings.startResizeImageWidth - windowWidth);
                                } else {
                                    newImageWidth = imageWidth - (settings.startResizeImageWidth - settings.stopResizeImageWidth);
                                }

                                newImageHeight = (newImageWidth * imageHeight) / imageWidth;
                            }

                            slideImage.css({
                                backgroundSize: 'cover',
                                height: newImageHeight,
                                width: newImageWidth
                            });

                            method.setHeightSlide(slide, newImageHeight);

                            settings.onSliderResize(slide, {
                                imageWidth: imageWidth,
                                imageHeight: imageHeight,
                                newImageWidth: newImageWidth,
                                newImageHeight: newImageHeight
                            }, settings);
                        }
                    });
                },

                createImage: function (slide, imageSrc, callback) {
                    var tmpImg = new Image(),
                        thisImage = slide.find(settings.mainImgBlockClass),
                        imageWidth = 0;

                    tmpImg.onload = function () {

                        imageHeight = this.height;
                        imageWidth = this.width;
                        vars.loadingImages.push(imageSrc);

                        if (!thisImage.length) {
                            thisImage = slide.append('<div class="' + settings.mainImgBlockClass.slice(1) + '" />');
                        }
                        thisImage = slide
                            .find(settings.mainImgBlockClass)
                            .css({
                                backgroundImage: 'url(' + imageSrc + ')',
                                backgroundPosition: 'center center',
                                height: imageHeight,
                                width: imageWidth,
                                opacity: 0
                            })
                            .data('height', imageHeight).data('width', imageWidth);

                        slide.data('is-load', true);

                        method.setHeightSlide(slide, imageHeight);
                        method.loadElements(slide.find(settings.mainImgBlockClass), callback);

                    };
                    tmpImg.src = imageSrc;
                },

                slideCreateImage: function (callback) {
                    var count = 0;

                    if (settings.slideCount == 0) {
                        callback();
                        return;
                    }

                    vars.slides.each(function () {
                        var slide = $(this),
                            imageSrc = slide.data("image"),
                            thisImage = slide.find(settings.mainImgBlockClass),
                            imageHeight = 0,
                            loadImageCallback = function () {
                                var callsBack = (++count == settings.slideCount) ? callback : function () {
                                    return true
                                };
                                if (vars.loadingImages.indexOf(imageSrc) != -1 && thisImage.length) {
                                    if (thisImage.css("background-image") == undefined || thisImage.css("background-image") == "none") {
                                        method.createImage(slide, imageSrc, callsBack);
                                    } else {
                                        imageHeight = thisImage.data('height');
                                        method.setHeightSlide(slide, imageHeight);
                                    }
                                } else {
                                    method.createImage(slide, imageSrc, callsBack);
                                }
                            };

                        loadImageCallback();
                    });
                },

                clickPagerBind: function (e) {
                    if (!settings.inTransition) {
                        var pagerLink = $(e.currentTarget);

                        if (pagerLink.attr('data-slide-index') !== undefined) {
                            var pagerIndex = parseInt(pagerLink.attr('data-slide-index'));
                            if (settings.curIndex != pagerIndex) {
                                method.slideOut(settings.curIndex, function () {
                                    settings.curIndex = pagerIndex;
                                    method.slideIn(settings.curIndex, method.clickNextCallback);
                                });
                            }
                        }
                    }

                    if (e) {
                        e.preventDefault();
                    }

                    return false;
                },

                populatePager: function () {
                    var pagerHtml = '';

                    for (var i = 0; i < settings.slideCount; i++) {
                        var linkContent = i + 1;

                        pagerHtml += '<div class="' + settings.slidePagerItemClass.slice(1) + '"><a href="" data-slide-index="' + i + '" class="pager-link">' + linkContent + '</a></div>';
                    }

                    vars.controls.pagerEl.html(pagerHtml);
                },

                removePagerActive: function () {
                    vars.controls.pagerEl.find('a').removeClass('active');
                },

                addPagerActive: function (slideIndex) {
                    method.removePagerActive();
                    vars.controls.pagerEl.each(function (i, el) {
                        $(el).find('a').eq(slideIndex).addClass('active');
                    });
                },

                appendPager: function () {
                    if (vars.slider.find(settings.slidePagerClass).length <= 0) {
                        vars.controls.pagerEl = $('<div class="' + settings.slidePagerClass.slice(1) + '" />');

                        vars.slider.addClass('has-pager').append(vars.controls.pagerEl);

                        method.populatePager();
                    } else {
                        vars.controls.pagerEl = vars.slider.find(settings.slidePagerClass);
                    }

                    vars.controls.pagerEl.on(clickHandler, 'a', method.clickPagerBind);
                },

                appendControls: function () {
                    vars.controls.control = $('<div class="' + settings.slideControlClass.slice(1) + '" />');
                    vars.controls.control.next = $('<a href="" class="' + settings.nextBtnClass.slice(1) + '"/>');
                    vars.controls.control.prev = $('<a href="" class="' + settings.prevBtnClass.slice(1) + '"/>');

                    vars.slider.addClass('has-control').append(vars.controls.control);

                    vars.controls.control.next.on(clickHandler, method.slideNext);
                    vars.controls.control.prev.on(clickHandler, method.slidePrev);

                    vars.slider.find(settings.slideControlClass).append(vars.controls.control.next);
                    vars.slider.find(settings.slideControlClass).append(vars.controls.control.prev);
                }
            };

            method.init();
        }
    });
});