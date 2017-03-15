/*$.shimba('.slide-ui').module('slide-ui');*/
$(function () {
    $.shimba().module('slide-ui', function (selector, option, obj, globObj) {
        var method;
        var settings = {
                slideMain: '.slide-ui',
                slideControl: '__control',
                slideHandle: '__handle',
                slideFill: '__fill',
                slideInput: 'input',
                slideTemplate: '<span class="{{slideMain}}"><span class="{{slideControl}}"><span class="{{slideFill}}"><span class="{{slideHandle}}"></span></span></span><span style="display: none">{{input}}</span></span>',
                speed: 400,
                lowerPercent: 1,
                upperPercent: 100,
                lowerValue: 1,
                upperValue: 10,
                beforeChange: function (value, percent, event, data, settings) {
                },
                afterChange: function (value, percent, event, data, settings) {
                }
            },
            clickHandler = $.shimba().clickHandler(),
            data = {
                controller: false,
                position: 0,
                parent: undefined,
                label: undefined,
                container: undefined,
                fill: undefined,
                handle: undefined,
                input: undefined,
                containerWidth: undefined,
                handleWidth: undefined,
                offset: {}
            };

        settings = $.extend({}, settings, option);

        method = {
            init: function () {
                data.main = $.shimba().setSelectorBlock(selector, settings);

                if (!data.main) {
                    return false;
                }
                settings.slideControl = settings.slideMain + settings.slideControl;
                settings.slideHandle = settings.slideMain + settings.slideHandle;
                settings.slideFill = settings.slideMain + settings.slideFill;

                method.setTemplate();

                data.container = data.main.find(settings.slideControl);
                data.fill = data.container.find(settings.slideFill);
                data.handle = data.fill.find(settings.slideHandle);
                data.input = data.main.find(settings.slideInput);
                data.containerWidth = data.container.outerWidth() + 1;
                data.handleWidth = data.handle.outerWidth();
                data.offset = data.container.offset();

                $(window)
                    .on('load resize', method.updateVars)
                    .on('DOMAttrModified', method.updateVars);
                data.container.on('click', method.clickFunc);
                data.handle.on('mousedown touchstart', method.mousedownFunc);
                data.input.each(method.changeFunc).on('change', method.changeFunc);
            },
            updateVars: function (event) {
                data.containerWidth = data.container.outerWidth() + 1;
                data.handleWidth = data.handle.outerWidth();
                data.offset = data.container.offset();
            },
            setTemplate: function () {
                var template = settings.slideTemplate
                    .replace('{{slideMain}}', settings.slideMain.slice(1))
                    .replace('{{slideControl}}', settings.slideControl.slice(1))
                    .replace('{{slideFill}}', settings.slideFill.slice(1))
                    .replace('{{slideHandle}}', settings.slideHandle.slice(1))
                    .replace('{{input}}', data.main[0].outerHTML);

                template = $(template);

                template.find(settings.slideFill).css({
                    'width': method.getPercentByValueFunc(data.main.val()) + '%'
                });

                data.main.replaceWith(template);
                data.main = template;
            },
            clickFunc: function (event) {
                event.preventDefault();
                var xPos = (event.pageX) ? event.pageX : event.originalEvent.touches[0].pageX;
                data.position = method.checkPercentFunc(Math.round(((xPos - data.offset.left + data.handleWidth / 2) / data.containerWidth) * 100));

                method.animateFunc(data.position);
                method.setValueFunc(data.position);
            },
            mousedownFunc: function (event) {
                event.preventDefault();
                data.controller = true;
                $(document).on('mousemove touchmove', method.mousemoveFunc);
                $(document).on('mouseup touchend', method.mouseupFunc);
            },
            mousemoveFunc: function (event) {
                event.preventDefault();
                var xPos = (event.pageX) ? event.pageX : event.originalEvent.touches[0].pageX;
                data.position = method.checkPercentFunc(Math.round(((xPos - data.offset.left + data.handleWidth / 2) / data.containerWidth) * 100));

                if (data.controller) {
                    data.fill.css({width: data.position + "%"});
                    method.setValueFunc(data.position, event);
                }
            },
            mouseupFunc: function (event) {
                event.preventDefault();
                data.controller = false;
            },
            setValueFunc: function (percent) {
                var calcValue = method.checkValueFunc(percent);

                settings.beforeChange(calcValue, percent, data, settings);

                data.input.val(calcValue);

                settings.afterChange(calcValue, percent, data, settings);
            },
            changeFunc: function () {
                var thatValue = $(this).val(),
                    percent = method.getPercentByValueFunc(thatValue);

                if ($(this).val() > settings.upperValue) {
                    method.setValueFunc(settings.upperPercent);
                } else if ($(this).val() < settings.lowerValue) {
                    method.setValueFunc(settings.lowerPercent);
                } else {
                    method.setValueFunc(percent);
                }

                method.animateFunc(percent);
            },
            animateFunc: function (value) {
                data.fill.animate({width: value + "%"}, settings.speed);
            },
            checkPercentFunc: function (value) {
                if (value < settings.lowerPercent) {
                    return settings.lowerPercent;
                } else if (value > settings.upperPercent) {
                    return settings.upperPercent;
                } else {
                    return value;
                }
            },
            checkValueFunc: function (percent) {
                var percentVal = (settings.upperValue / settings.upperPercent);
                var percentLoverVal = (percentVal * settings.lowerPercent);
                var percentUpperVal = (percentVal * settings.upperPercent);
                var calcPercent = (percentVal * percent);

                if (calcPercent < percentLoverVal) {
                    return percentLoverVal;
                } else if (calcPercent > percentUpperVal) {
                    return percentUpperVal;
                } else {
                    return calcPercent;
                }
            },
            getPercentByValueFunc: function (value) {
                var calcPercent = ((value * settings.upperPercent) / settings.upperValue);

                if (calcPercent < settings.lowerPercent) {
                    return settings.lowerPercent;
                } else if (calcPercent > settings.upperPercent) {
                    return settings.upperPercent;
                } else {
                    return calcPercent;
                }
            }
        };

        method.init();
    });
});