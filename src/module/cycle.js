//$.shimba().module('cycle');
$(function () {
    $.shimba().module('cycle', function (selector, option, obj, globObj) {
        var localInterval, startCycleTemp = [], intervals = [], count = [];

        var methodPublic = {
            initCycle: function (intervalName, startInterval, callback, arg) {
                count[intervalName] = (count[intervalName] == undefined) ? 0 : ++count[intervalName];
                intervals[intervalName] = (intervals[intervalName] == undefined) ? 0 : intervals[intervalName];
                intervals[intervalName] = localInterval = intervals[intervalName] + startInterval;

                privateMethod.startCycle({
                    intervalName: intervalName,
                    callback: callback,
                    arg: arg,
                    count: count[intervalName]
                });
            },

            destroyCycle: function (intervalName) {
                privateMethod.destroyCycle(intervalName);
            }
        };

        var privateMethod = {
            startCycle: function (data) {
                startCycleTemp[data.count] = setTimeout(function () {
                    if (data.callback.apply(this, data.arg)) {
                        privateMethod.clearCycle(data);
                    }
                }, localInterval);
            },

            clearCycle: function (data) {
                clearTimeout(startCycleTemp[data.count]);
                localInterval = intervals[data.intervalName];

                privateMethod.startCycle(data);
            },

            destroyCycle: function (intervalName) {
                if (intervals[intervalName] != undefined) {
                    delete intervals[intervalName];
                    delete count[intervalName];

                    $.each(startCycleTemp, function (key, val) {
                        //console.log([key, val])
                        clearTimeout(val);
                    });
                }
            }
        };

        return methodPublic;
    });
});