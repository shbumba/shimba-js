/*$.shimba('form').module('get-inputs-title');*/
$(function () {
    $.shimba().module('init-position', function (selector, option, obj, globObj) {
        var settings = {
            ajax: false,
            ulr: ''
        },
            data = {
                main: undefined,
                inputArray: {}
            };

        settings = $.extend({}, settings, option);

        var method = {
            init: function () {
                data.main = $.shimba().setSelectorBlock(selector, settings);

                if (!data.main) {
                    return false;
                }

                if (true) {
                    data.main.each(function () {
                        var form = $(this),
                            inputArray = [];

                        form.find(':input').each(function () {
                            var input = $(this),
                                inputName = input.attr('name'),
                                inputId = input.attr('id'),
                                inputPlaceholder = input.attr('placeholder'),
                                siblings = input.siblings('label'),
                                closest = input.closest('label'),
                                parent = input.parent('label'),
                                parents = input.parents('label'),
                                title;

                            if (inputName == undefined || inputName == '') return false;

                            if (siblings != undefined && siblings.length > 0) {
                                title = siblings.text();
                            } else if (closest != undefined && closest.length > 0) {
                                title = closest.text();
                            } else if (parent != undefined && parent.length > 0) {
                                title = parent.text();
                            } else if (parents != undefined && parents.length > 0) {
                                title = parents.text();
                            } else if (inputPlaceholder != undefined && inputPlaceholder != '') {
                                title = inputPlaceholder;
                            } else if (inputId != undefined && inputId != '') {
                                var formLabel = form.find('label[for="' + inputName + '"]');
                                if (formLabel != undefined && formLabel.length > 0) {
                                    title = formLabel.text();
                                } else {
                                    return false;
                                }
                            } else {
                                console.error({
                                    input: input,
                                    inputName: inputName,
                                    siblings: siblings,
                                    closest: closest,
                                    parent: parent,
                                    parents: parents
                                })
                                return false;
                            }

                            data.inputArray[inputName] = title;
                        });

                        console.info(data.inputArray);

                        if (settings.ajax == true && settings.url != '') {
                            $.ajax({
                                type: "POST",
                                url: settings.url,
                                data: {inputArray: inputArray}
                            });
                        }
                    });
                }
            }
        };

        method.init();
    });
});