//init lang
$(function () {
    $('.head-top .lang').each(function () {
        var that = $(this),
            selectName = function (id) {
                if (id != undefined && id !== '') {
                    that.find('.dropdown-block').each(function () {
                        var ThisDropDown = $(this),
                            DropDownName = ThisDropDown.find('.dropdown-name'),
                            DropDownId = DropDownName.data("id"),
                            thisName = $(this).find('.dropdown-name'),
                            thisItem = $(this).find('.dropdown-list .dropdown-item[data-id="' + id + '"]');

                        if (thisItem != undefined && thisItem != '') {
                            if (!thisItem.is('.selected')) {
                                $(this).find('.dropdown-list .dropdown-item').removeClass('selected');
                                thisItem.addClass('selected');
                                thisName.attr('data-id', id);
                                thisName.find('.name').html(thisItem.find('.name').html());
                            } else {
                                if (DropDownId == undefined || DropDownId == '') {
                                    thisName.attr('data-id', id);
                                    thisName.find('.name').html(thisItem.find('.name').html());
                                }
                            }
                        }
                    })
                }
            };
        that.find('.dropdown-block').each(function () {
            var ThisDropDown = $(this),
                DropDownName = ThisDropDown.find('.dropdown-name'),
                DropDownId = DropDownName.data("id");

            ThisDropDown.find('.dropdown-list .dropdown-item').on('click', function () {
                var thisId = $(this).data("id");
                if (thisId != undefined && thisId !== '') {
                    selectName(thisId);
                }
            });

            if (DropDownId == undefined || DropDownId == '') {
                ThisDropDown.find('.dropdown-list').each(function () {
                    var item = $(this).find('.dropdown-item.selected');
                    if (item != undefined && item != '') {
                        item.trigger('click');
                    }
                })
            }
        });
    });
});