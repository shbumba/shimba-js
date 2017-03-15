/**
 * Created by Shimba on 20.02.2016.
 */
/*
 * $.shimba().module('form-helper');
 * $.shimba($('.form-helper')).module('form-helper');
 * */
$(function () {
    $.shimba().module('form-helper', function (selector, option, obj, globObj) {
        var opt = {
                selector: '.form',
                cloneSelector: '[data-clone-id]',
                toggleSelector: '.from-toggle',
                beforeCloneCallback: function (that, cloneBlock) {

                },
                afterCloneCallback: function (that, cloneBlock) {

                },
                beforeToggleShowCallback: function (data) {

                },
                afterToggleShowCallback: function (data) {

                },
                beforeToggleHideCallback: function (data) {

                },
                afterToggleHideCallback: function (data) {

                }
            },
            clickHandler = $.shimba().clickHandler(),
            data = {
                main: undefined,
                selector: undefined,
                clone: undefined,
                toggle: undefined
            };

        opt = $.extend({}, opt, option);

        var method = {
            init: function () {
                data.selector = (selector != undefined && selector.length > 0) ? selector : opt.selector;

                data.main = $.shimba().setSelectorBlock(data.selector, opt);

                if (!data.main) {
                    return false;
                }

                data.clone = data.main.find(opt.cloneSelector);
                data.toggle = (data.main.is(opt.toggleSelector)) ? data.main : data.main.find(opt.toggleSelector);

                data.clone.on(clickHandler, function(){
                    method.clone($(this));
                });

                data.toggle.each(function () {
                    method.toggle($(this));
                });
            },

            clone: function (that) {
                var idToClone = that.data('clone-id'),
                    cloneBlocks = $('[data-clone-in="'+idToClone+'"]'),
                    cloneInBlock = cloneBlocks.eq(0),
                    afterAddedBlock = cloneBlocks.last(),
                    cloneBlock;

                if(cloneInBlock.length) {
                    cloneBlock = cloneInBlock.clone(false, false);

                    opt.beforeCloneCallback(that, cloneBlock);

                    cloneBlock.find('input[type="text"], textarea').not('.noClean').val("");
                    cloneBlock.find('option, input[type="radio"]').not('.noClean').removeAttr('selected');
                    cloneBlock.find('input[type="chechbox"]').not('.noClean').removeAttr('checked');
                    cloneBlock.insertAfter(afterAddedBlock);

                    opt.afterCloneCallback(that, cloneBlock);
                }
            },

            toggle: function (that) {
                var form = that.find('form'),
                    toggleInputs = form.find('.form-type-input'),
                    toggleBlocks = form.find('.form-type-block');

                toggleBlocks.hide();
                toggleBlocks.find(':input').prop('disabled', true);

                toggleInputs.on('change', function () {
                    method.toggleCall(that, form, toggleInputs, toggleBlocks);
                }).each(function () {
                    method.toggleCall(that, form, toggleInputs, toggleBlocks);
                });
            },

            toggleCall: function (that, form, toggleInputs, toggleBlocks) {
                var inputBlock = $(this),
                    inputToggleId = inputBlock.data('toggle-id'),
                    inputToggleGroup = inputBlock.data('toggle-group');

                if (inputBlock.is(':input') && inputToggleId != '' && inputToggleGroup != '') {
                    var toggleBlocksGroup = toggleBlocks.filter('[data-toggle-group="'+inputToggleGroup+'"]'),
                        toggleBlock = toggleBlocksGroup.filter('[data-toggle-id="'+inputToggleId+'"]');

                    if (inputBlock.is(':selected,:checked')) {
                        opt.beforeToggleHideCallback({
                            that: that,
                            form: form,
                            toggleInputs: toggleInputs,
                            toggleBlocks: toggleBlocks
                        });

                        toggleBlocksGroup.hide();
                        toggleBlocksGroup.find(':input').prop('disabled', true);

                        opt.afterToggleHideCallback({
                            that: that,
                            form: form,
                            toggleInputs: toggleInputs,
                            toggleBlocks: toggleBlocks
                        });

                        opt.beforeToggleShowCallback({
                            that: that,
                            form: form,
                            toggleInputs: toggleInputs,
                            toggleBlocks: toggleBlocks
                        });

                        toggleBlock.show();
                        toggleBlock.find(':input').prop('disabled', false);

                        opt.afterToggleShowCallback({
                            that: that,
                            form: form,
                            toggleInputs: toggleInputs,
                            toggleBlocks: toggleBlocks
                        });
                    }
                }
            }
        };

        method.init();
    });
});