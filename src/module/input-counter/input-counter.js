/*
 * $.shimba($('.counter')).module('input-counter');
 * */
$(function () {
    $.shimba().module('input-counter', function (selector, option, obj, globObj) {
        var settings = {
                inputHtml: 'input[type="text"]',
                plusHtml: '.plus',
                minusHtml: '.minus',
                numDefault: 0,
                beforeChange: function (value, data, element, event, settings) {
                },
                afterChange: function (value, data, element, event, settings) {
                }
            },
            clickHandler = $.shimba().clickHandler(),
            data = {
                main: undefined,
                input: undefined,
                inputNum: undefined,
                plus: undefined,
                minus: undefined,
                count: 0
            };

        settings = $.extend({}, settings, option);

        var method = {
            init: function () {
                data.main = $.shimba().setSelectorBlock(selector, settings);

                if (!data.main) {
                    return false;
                }

                data.input = data.main.find(settings.inputHtml);
                data.inputNum = (data.input.data('default') != undefined) ? data.input.data('default') : settings.numDefault;
                data.plus = data.main.find(settings.plusHtml);
                data.minus = data.main.find(settings.minusHtml);

                data.count = data.inputNum;

                data.input.on('change', function (event) {
                    method.changeFunc(this, event);
                });
                data.plus.on(clickHandler, function (event) {
                    method.setPlus(this, event);
                });
                data.minus.on(clickHandler, function (event) {
                    method.setMinus(this, event);
                });

                settings.beforeChange(data.count, data, null, null, settings);
                method.updateInput(true);
                settings.afterChange(data.count, data, null, null, settings);
            },

            changeFunc: function (element, event) {
                settings.beforeChange(data.count, data, element, event, event, settings);

                data.count = parseInt(data.input.val());

                method.updateInput();
                settings.afterChange(data.count, data, element, event, settings);

                event.preventDefault();

                return true;
            },

            setPlus: function (element, event) {
                settings.beforeChange(data.count, data, element, event, settings);
                data.count++;

                method.updateInput();
                settings.afterChange(data.count, data, element, event, settings);

                event.preventDefault();

                return true;
            },

            setMinus: function (element, event) {
                settings.beforeChange(data.count, data, element, event, settings);
                data.count--;

                method.updateInput();
                settings.afterChange(data.count, data, element, event, settings);

                event.preventDefault();

                return true;
            },

            updateInput: function (firstUpdate) {
                if(data.count >= 0) {
                    if (firstUpdate == true && data.input.val().length > 0) {
                        data.count = parseInt(data.input.val());
                        data.count = (!isNaN(data.count)) ? data.count : data.inputNum;

                        return true;
                    }
                    data.input.val(data.count);
                    return true;
                }

                data.count = 0;

                return false;
            }
        };

        method.init();
    });
});