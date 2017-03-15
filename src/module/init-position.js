/*$.shimba('.hover-area').module('initPosition',{
 roundMode: true,
 coordsTpl: '{{X}},{{Y}}'
 });*/
$(function () {
    $.shimba().module('init-position', function (selector, option, obj, globObj) {
        if ($(selector).length && $.shimba().issetModule('popover')) {
            var settings = {
                    roundMode: false,
                    coordsTpl: 'X:{{X}}<br/>Y:{{Y}}'
                },
                clickHandler = $.shimba().clickHandler(),
                data = {
                    main: undefined,
                    positionObj: {}
                };

            settings = $.extend({}, settings, option);

            var method = {
                init: function () {
                    data.main = $.shimba().setSelectorBlock(selector, settings);

                    if (!data.main) {
                        return false;
                    }

                    if (data.main.css('position') == undefined ||
                        data.main.css('position') != 'absolute' &&
                        data.main.css('position') != 'relative'
                    ) {
                        data.main.css({position: 'relative'});
                    }

                    data.main.on('mousemove', method.getPosition);
                    data.main.on(clickHandler, method.addDot);

                },

                getPosition: function (e) {
                    var parentOffset = $(this).offset();

                    data.positionObj = {
                        x: (settings.roundMode) ? Math.round(e.pageX - parentOffset.left) : e.pageX - parentOffset.left,
                        y: (settings.roundMode) ? Math.round(e.pageY - parentOffset.top) : e.pageY - parentOffset.top
                    };
                },

                addDot: function () {
                    var coordsText = settings.coordsTpl.replace('{{X}}', data.positionObj.x).replace('{{Y}}', data.positionObj.y),
                        element = $('<div class="popover-block"><a href="#" class="actionItem"></a><div class="popover">' + coordsText + '</div></div>');

                    element.find('.actionItem').css({
                        'background-color': 'red',
                        'width': '3px',
                        'height': '3px',
                        'display': 'block',
                        'margin': '-50%',
                        'border-radius': '50%'
                    });

                    element.css({
                        position: 'absolute',
                        top: data.positionObj.y,
                        left: data.positionObj.x
                    });

                    $.shimba(element).module('popover');

                    $(this).append(element);
                }
            };

            method.init();
        }
    });
});