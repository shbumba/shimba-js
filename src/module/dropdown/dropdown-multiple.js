//$.shimba('.dropdown-multiple').module('dropdown-multiple');
$(function () {
    $.shimba().module('dropdown-multiple', function (selector, option, obj, globObj) {
        if ($(selector).length && $.shimba().issetModule('dropdown')) {
            $(selector).each(function () {
                var that = $(this),
                    thatName = that.find('.dropdown-name').find('.name'),
                    html = $('<span/>');

                var method = {
                    init: function () {
                        that.find('.dropdown-list .dropdown-item').each(function () {
                            var input = $(this).find('input[type="checkbox"]');

                            method.actionFunc(input);

                            $(this).on('click', function (e) {
                                if (!input.is(e.target)) {
                                    method.checkedInput(this);
                                }
                                method.actionFunc(input);
                            });
                        });
                    },

                    actionFunc: function (element) {
                        var inputTitle = element.parent('.dropdown-item').text() + ",";
                        if (element.is(':checked')) {
                            html.append('<span title="' + inputTitle + '">' + inputTitle + '</span>');
                        } else {
                            if (html.children().length) {

                            }
                            html.find('span[title="' + inputTitle + '"]').remove();
                        }
                        method.setTitle();
                    },

                    setTitle: function () {
                        if (html.children().length) {
                            thatName.html(html);
                        }
                    },

                    checkedInput: function (that) {
                        var checkInput = $(that).find('input[type="checkbox"]');

                        if (!checkInput.prop('disabled')) {
                            checkInput[0].checked = checkInput[0].checked ? false : true;
                            checkInput.trigger('change')
                        }
                    }
                };
                method.init();
            });
        }
    });
});