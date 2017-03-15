/* Inint new event
 * var event  = $.shimba().module('events');
 * Use Event (add target list):
 event.addTargetList(callBackClass,'click, touchstart, touchend', function(index, value){
 callsback()
 });
 * Use Event Element: event.addTarget($(this).find(callBackClass));
 * Remove Event Element: event.removeTarget($(this).find(callBackElem));
 */
$(function () {
    $.shimba().module('events', function (selector, option, obj, globObj) {
        var objTarget = {
            targetClass: "targetOn",
            targetList: [],
            targetActions: [],
            targetCallback: [],
            targetListCount: 0,
            init: function () {
                objTarget.randStr = objTarget.randomString(16, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ');
                objTarget.targetClass = objTarget.targetClass + objTarget.randStr;
                objTarget.targetData = 'targets' + objTarget.randStr;
                objTarget.targetStart();
                return objTarget;
            },

            randomString: function (num, chars) {
                var result = '';
                for (var i = num; i > 0; --i) {
                    result += chars[Math.round(Math.random() * (chars.length - 1))];
                }
                return result;
            },

            addTargetList: function () {
                var target, action, callback;

                if (arguments !== undefined) {
                    switch (arguments.length) {
                        case 1:
                            target = arguments[0];
                            target = (target != undefined && target != null && typeof(target) == 'string') ? target : null;

                            break;

                        case 2:
                            target = arguments[0];
                            target = (target != undefined && target != null && typeof(target) == 'string') ? target : null;

                            callback = arguments[1];
                            callback = (callback != undefined && callback != null && typeof(callback) == 'function') ? callback : null;

                            break;

                        case 3:
                            target = arguments[0];
                            target = (target != undefined && target != null && typeof(target) == 'string') ? target : null;

                            action = arguments[1];
                            action = (action != undefined && action != null && typeof(action) == 'string') ? action : null;

                            callback = arguments[2];
                            callback = (callback != undefined && callback != null && typeof(callback) == 'function') ? callback : null;

                            break;
                    }

                    if (target) {
                        objTarget.targetList[objTarget.targetListCount] = target;
                    }

                    if (action) {
                        objTarget.targetActions[objTarget.targetListCount] = action;
                    }

                    if (callback) {
                        objTarget.targetCallback[objTarget.targetListCount] = callback;
                    }

                    if (target || action || callback) {
                        objTarget.targetListCount++;
                    }
                }

            },

            findTarget: function (target) {
                var findTargets = [];
                $.each(objTarget.targetList, function (index, value) {
                    if (target.find(value).length || target.is(value) || target == value) {
                        findTargets.push(value);
                    }
                });
                return findTargets;
            },

            addTarget: function (target) {
                var targetArr = objTarget.findTarget(target),
                    targetStr = (targetArr.length !== 0) ? targetArr.join(' ') : '';
                $('html').data(objTarget.targetData, targetStr);

                setTimeout(function () {
                    $('html').addClass(objTarget.targetClass).data(objTarget.targetData);

                }, 200);

            },

            removeTarget: function (target) {

                $('html').removeClass(objTarget.targetClass).data(objTarget.targetData, '');
                setTimeout(function () {
                    $('html').data(objTarget.targetData, '');

                }, 200);

            },

            targetAction: function (e) {
                setTimeout(function () {
                    var that = $('html'),
                        targetStr = that.data(objTarget.targetData),
                        targetArr = (targetStr !== undefined && targetStr.length !== 0) ? targetStr.split(' ') : [];

                    if (that.hasClass(objTarget.targetClass)) {

                        $.each(objTarget.targetList, function (index, value) {
                            if ($.inArray(value, targetArr) !== -1) {
                                if (!$(value).is(e.target) && $(value).has(e.target).length === 0) {
                                    if (objTarget.targetActions[index] == undefined || objTarget.targetActions[index].indexOf(e.type) !== -1) {
                                        if (objTarget.targetCallback[index] != undefined) {
                                            objTarget.targetCallback[index](index, value, e);
                                        } else {
                                            $(value).hide();
                                        }
                                    }
                                }
                            }
                        });
                    }

                }, 100);

            },

            targetStart: function () {
                $(document).on('touchstart touchend mouseover mousedown mouseup click', function (e) {
                    objTarget.targetAction(e);
                });
            }
        };

        return objTarget.init();
    });
});