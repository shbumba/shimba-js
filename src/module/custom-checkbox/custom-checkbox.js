//$.shimba('.checkbox-block').module('custom-checkbox');
$(function () {
    $.shimba().module('custom-checkbox', function (selector, option, obj, globObj) {
        var opt = {
                selector: '.sh-checkbox',
                inputBlock: ".checkbox",
                initClass: ".init-checkbox",
                checked: ".checked",
                input: 'input[type="checkbox"]'
            },
            data = {
                selector: null,
                inputBlock: null,
                initClass: null,
                checked: null,
                input: null,
                short: {
                    selector: null,
                    inputBlock: null,
                    initClass: null,
                    checked: null,
                    input: null
                }
            };

        opt = $.extend({}, opt, option);

        var method = {
            init: function () {
                data.selector = (selector != undefined && selector.length > 0) ? selector : opt.selector;

                data.main = $.shimba().setSelectorBlock(data.selector, opt);

                if (!data.main) {
                    return false;
                }

                data.inputBlock = data.main.find(opt.inputBlock);
                data.input = data.main.find(opt.input);

                if (data.input.is(data.short.initClass)) {
                    return false;
                }

                data.short.selector = opt.selector.slice(1);
                data.short.inputBlock = opt.inputBlock.slice(1);
                data.short.initClass = opt.initClass.slice(1);
                data.short.checked = opt.checked.slice(1);
                data.short.input = opt.input.slice(1);

                $('body').addClass(data.short.initClass);

                method.initInput(data.input);
                method.clickInput();
            },

            initInput: function (input) {
                if (input.attr('checked') == 'checked') {
                    data.inputBlock.addClass(data.short.checked);
                    input[0].checked = true;
                } else {
                    data.inputBlock.removeClass(data.short.checked);
                    input[0].checked = false;
                }
            },

            checkedInput: function (that) {
                var checkInput = $(that);

                if (!checkInput.prop('disabled')) {
                    data.inputBlock[checkInput[0].checked ? 'addClass' : 'removeClass'](data.short.checked);

                    if (checkInput[0].checked == true) {
                        checkInput[0].checked = true;
                        checkInput.attr('checked', true);
                    } else {
                        checkInput[0].checked = false;
                        checkInput.removeAttr('checked');
                    }
                }
            },

            clickInput: function () {
                data.input.addClass(data.short.initClass).on('change', function () {
                    method.checkedInput(this);
                });
            }
        };

        method.init();
    });
});